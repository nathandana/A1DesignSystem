/**
 * Backlog — Supabase backend. Maps the snake_case `backlog_*` tables to the
 * camelCase records in `types.ts`. Shared + attributed, like edit_history: every
 * signed-in user reads/writes every row. Live updates come from a Realtime channel
 * with an 8s poll fallback (mirrors projects/cloudSync.js).
 */
import { supabase } from '../../lib/supabase.js';
import type {
  BacklogBackend, CreateItemRow, AddCommentRow, AddNotificationRow,
} from './backend';
import type {
  BacklogComment, BacklogItem, BacklogNotification, BacklogUser, UpdateTicketPatch,
} from './types';

const ITEM_COLS =
  'id,number,title,description,type,status,priority,complexity,scope_kind,scope_ref,scope_label,' +
  'created_by,created_by_email,assignee_id,assignee_email,awaiting_requester,duplicate_of,' +
  'attachment_refs,vote_count,created_at,updated_at';

/* eslint-disable @typescript-eslint/no-explicit-any */
function itemFromRow(r: any): BacklogItem {
  return {
    id: r.id,
    number: r.number,
    title: r.title,
    description: r.description ?? null,
    type: r.type,
    status: r.status,
    priority: r.priority ?? null,
    complexity: r.complexity ?? null,
    scopeKind: r.scope_kind,
    scopeRef: r.scope_ref ?? null,
    scopeLabel: r.scope_label ?? null,
    createdBy: r.created_by ?? null,
    createdByEmail: r.created_by_email ?? null,
    assigneeId: r.assignee_id ?? null,
    assigneeEmail: r.assignee_email ?? null,
    awaitingRequester: !!r.awaiting_requester,
    duplicateOf: r.duplicate_of ?? null,
    attachmentRefs: r.attachment_refs ?? [],
    voteCount: r.vote_count ?? 0,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function commentFromRow(r: any): BacklogComment {
  return {
    id: r.id,
    itemId: r.item_id,
    kind: r.kind,
    body: r.body ?? null,
    meta: r.meta ?? null,
    userId: r.user_id ?? null,
    userEmail: r.user_email ?? null,
    createdAt: r.created_at,
  };
}

function notificationFromRow(r: any): BacklogNotification {
  return {
    id: r.id,
    userId: r.user_id,
    itemId: r.item_id ?? null,
    kind: r.kind,
    body: r.body ?? null,
    read: !!r.read,
    createdAt: r.created_at,
  };
}

/** Translate a typed patch to a DB update payload (snake_case). */
function rowFromPatch(patch: UpdateTicketPatch): Record<string, unknown> {
  const map: Record<string, string> = {
    title: 'title', description: 'description', type: 'type', status: 'status',
    priority: 'priority', complexity: 'complexity', scopeKind: 'scope_kind',
    scopeRef: 'scope_ref', scopeLabel: 'scope_label', assigneeId: 'assignee_id',
    assigneeEmail: 'assignee_email', awaitingRequester: 'awaiting_requester',
    duplicateOf: 'duplicate_of', attachmentRefs: 'attachment_refs',
  };
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(patch)) {
    const col = map[k];
    if (col) out[col] = v;
  }
  return out;
}

export function createSupabaseBackend(getUser: () => BacklogUser | null): BacklogBackend {
  const sb = supabase!; // only constructed when supabaseConfigured

  return {
    async listItems() {
      const { data, error } = await sb
        .from('backlog_items').select(ITEM_COLS).order('number', { ascending: false });
      if (error) { console.warn('[backlog] listItems failed', error); return []; }
      return (data ?? []).map(itemFromRow);
    },

    async createItem(row: CreateItemRow) {
      const { data, error } = await sb.from('backlog_items').insert({
        title: row.title,
        description: row.description ?? null,
        type: row.type ?? 'feature',
        priority: row.priority ?? null,
        complexity: row.complexity ?? null,
        scope_kind: row.scopeKind ?? 'general',
        scope_ref: row.scopeRef ?? null,
        scope_label: row.scopeLabel ?? null,
        created_by: row.createdBy ?? null,
        created_by_email: row.createdByEmail ?? null,
        attachment_refs: row.attachmentRefs ?? [],
      }).select(ITEM_COLS).single();
      if (error) throw error;
      return itemFromRow(data);
    },

    async updateItem(id: string, patch: UpdateTicketPatch) {
      const { data, error } = await sb
        .from('backlog_items').update(rowFromPatch(patch)).eq('id', id).select(ITEM_COLS).single();
      if (error) { console.warn('[backlog] updateItem failed', error); return null; }
      return itemFromRow(data);
    },

    async removeItem(id: string) {
      const { error } = await sb.from('backlog_items').delete().eq('id', id);
      if (error) console.warn('[backlog] removeItem failed', error);
    },

    async listComments(itemId: string) {
      const { data, error } = await sb
        .from('backlog_comments').select('*').eq('item_id', itemId)
        .order('created_at', { ascending: true });
      if (error) { console.warn('[backlog] listComments failed', error); return []; }
      return (data ?? []).map(commentFromRow);
    },

    async addComment(c: AddCommentRow) {
      const { data, error } = await sb.from('backlog_comments').insert({
        item_id: c.itemId, kind: c.kind ?? 'comment', body: c.body ?? null,
        meta: c.meta ?? null, user_id: c.userId ?? null, user_email: c.userEmail ?? null,
      }).select('*').single();
      if (error) throw error;
      return commentFromRow(data);
    },

    async votedItemIds() {
      const user = getUser();
      if (!user) return [];
      const { data, error } = await sb
        .from('backlog_votes').select('item_id').eq('user_id', user.id);
      if (error) { console.warn('[backlog] votedItemIds failed', error); return []; }
      return (data ?? []).map((r: any) => r.item_id);
    },

    async setVote(itemId: string, voted: boolean) {
      const user = getUser();
      if (!user) return;
      if (voted) {
        const { error } = await sb.from('backlog_votes')
          .upsert({ item_id: itemId, user_id: user.id }, { onConflict: 'item_id,user_id' });
        if (error) console.warn('[backlog] vote failed', error);
      } else {
        const { error } = await sb.from('backlog_votes')
          .delete().eq('item_id', itemId).eq('user_id', user.id);
        if (error) console.warn('[backlog] unvote failed', error);
      }
    },

    async listNotifications() {
      const user = getUser();
      if (!user) return [];
      const { data, error } = await sb
        .from('backlog_notifications').select('*').eq('user_id', user.id)
        .order('created_at', { ascending: false }).limit(100);
      if (error) { console.warn('[backlog] listNotifications failed', error); return []; }
      return (data ?? []).map(notificationFromRow);
    },

    async addNotifications(rows: AddNotificationRow[]) {
      if (!rows.length) return;
      const { error } = await sb.from('backlog_notifications').insert(
        rows.map((n) => ({
          user_id: n.userId, item_id: n.itemId ?? null, kind: n.kind, body: n.body ?? null,
        })),
      );
      if (error) console.warn('[backlog] addNotifications failed', error);
    },

    async markRead(ids: string[]) {
      if (!ids.length) return;
      const { error } = await sb.from('backlog_notifications').update({ read: true }).in('id', ids);
      if (error) console.warn('[backlog] markRead failed', error);
    },

    subscribe(cb: () => void) {
      let channel: ReturnType<typeof sb.channel> | null = null;
      let poll: ReturnType<typeof setInterval> | null = null;
      (async () => {
        try {
          const { data } = await sb.auth.getSession();
          if (data?.session?.access_token) sb.realtime.setAuth(data.session.access_token);
        } catch { /* ignore */ }
        channel = sb
          .channel('backlog_changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'backlog_items' }, cb)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'backlog_comments' }, cb)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'backlog_notifications' }, cb)
          .subscribe();
      })();
      // Fallback so changes still land if Realtime isn't enabled on the tables.
      poll = setInterval(cb, 8000);
      return () => {
        if (channel) sb.removeChannel(channel);
        if (poll) clearInterval(poll);
      };
    },
  };
}
