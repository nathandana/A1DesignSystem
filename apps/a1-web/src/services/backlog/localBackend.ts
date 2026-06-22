/**
 * Backlog — local (offline / signed-out) backend. Keeps everything in gzipped
 * localStorage via the editor storage helpers. Single-browser only: numbering is a
 * local sequence and there is no cross-user sync (documented to the user). This lets
 * the Backlog page work without Supabase rather than showing a dead end.
 */
import { readStored, writeStored } from '../../editor/storage';
import type {
  BacklogBackend, CreateItemRow, AddCommentRow, AddNotificationRow,
} from './backend';
import type {
  BacklogComment, BacklogItem, BacklogNotification, BacklogUser, UpdateTicketPatch,
} from './types';

const ITEMS_KEY = 'a1-backlog-items';
const COMMENTS_KEY = 'a1-backlog-comments';
const VOTES_KEY = 'a1-backlog-votes';           // { [itemId]: string[] userIds }
const NOTIFS_KEY = 'a1-backlog-notifications';
const SEQ_KEY = 'a1-backlog-seq';

const listeners = new Set<() => void>();
function notify() { for (const fn of listeners) { try { fn(); } catch { /* ignore */ } } }

function read<T>(key: string, fallback: T): T {
  try {
    const raw = readStored(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}
function write(key: string, value: unknown) {
  writeStored(key, JSON.stringify(value));
}

function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
function nextNumber(): number {
  const n = (read<number>(SEQ_KEY, 0) || 0) + 1;
  write(SEQ_KEY, n);
  return n;
}
function nowIso(): string { return new Date().toISOString(); }

export function createLocalBackend(getUser: () => BacklogUser | null): BacklogBackend {
  return {
    async listItems() {
      return read<BacklogItem[]>(ITEMS_KEY, [])
        .map((it) => ({ ...it, reviews: it.reviews ?? {}, links: it.links ?? [] })) // defaults for items stored before reviews/links
        .sort((a, b) => b.number - a.number);
    },

    async createItem(row: CreateItemRow) {
      const items = read<BacklogItem[]>(ITEMS_KEY, []);
      const ts = nowIso();
      const item: BacklogItem = {
        id: uid('bk'),
        number: nextNumber(),
        title: row.title,
        description: row.description ?? null,
        type: row.type ?? 'feature',
        status: 'new',
        priority: row.priority ?? null,
        complexity: row.complexity ?? null,
        scopeKind: row.scopeKind ?? 'general',
        scopeRef: row.scopeRef ?? null,
        scopeLabel: row.scopeLabel ?? null,
        createdBy: row.createdBy ?? null,
        createdByEmail: row.createdByEmail ?? null,
        assigneeId: null,
        assigneeEmail: null,
        awaitingRequester: false,
        duplicateOf: null,
        links: [],
        attachmentRefs: row.attachmentRefs ?? [],
        voteCount: 0,
        reviews: {},
        createdAt: ts,
        updatedAt: ts,
      };
      write(ITEMS_KEY, [item, ...items]);
      notify();
      return item;
    },

    async updateItem(id: string, patch: UpdateTicketPatch) {
      const items = read<BacklogItem[]>(ITEMS_KEY, []);
      let updated: BacklogItem | null = null;
      const next = items.map((it) => {
        if (it.id !== id) return it;
        updated = { ...it, ...patch, updatedAt: nowIso() } as BacklogItem;
        return updated;
      });
      if (updated) { write(ITEMS_KEY, next); notify(); }
      return updated;
    },

    async removeItem(id: string) {
      write(ITEMS_KEY, read<BacklogItem[]>(ITEMS_KEY, []).filter((i) => i.id !== id));
      write(COMMENTS_KEY, read<BacklogComment[]>(COMMENTS_KEY, []).filter((c) => c.itemId !== id));
      notify();
    },

    async mergeItem(fromId: string, toId: string) {
      // Move the human thread onto the survivor (keep the activity log on the duplicate).
      const THREAD = new Set(['comment', 'question', 'answer']);
      write(COMMENTS_KEY, read<BacklogComment[]>(COMMENTS_KEY, [])
        .map((c) => (c.itemId === fromId && THREAD.has(c.kind) ? { ...c, itemId: toId } : c)));

      // Combine votes (union of voters) and refresh the survivor's denormalized count.
      const votes = read<Record<string, string[]>>(VOTES_KEY, {});
      const fromVoters = votes[fromId] ?? [];
      if (fromVoters.length) {
        const merged = new Set([...(votes[toId] ?? []), ...fromVoters]);
        votes[toId] = [...merged];
        write(VOTES_KEY, votes);
        const items = read<BacklogItem[]>(ITEMS_KEY, []);
        write(ITEMS_KEY, items.map((it) => (it.id === toId ? { ...it, voteCount: merged.size } : it)));
      }
      notify();
    },

    async listComments(itemId: string) {
      return read<BacklogComment[]>(COMMENTS_KEY, [])
        .filter((c) => c.itemId === itemId)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    },

    async addComment(c: AddCommentRow) {
      const comments = read<BacklogComment[]>(COMMENTS_KEY, []);
      const comment: BacklogComment = {
        id: uid('cm'),
        itemId: c.itemId,
        kind: c.kind ?? 'comment',
        body: c.body ?? null,
        meta: c.meta ?? null,
        userId: c.userId ?? null,
        userEmail: c.userEmail ?? null,
        createdAt: nowIso(),
      };
      write(COMMENTS_KEY, [...comments, comment]);
      notify();
      return comment;
    },

    async votedItemIds() {
      const user = getUser();
      const votes = read<Record<string, string[]>>(VOTES_KEY, {});
      const me = user?.id ?? 'local';
      return Object.entries(votes).filter(([, ids]) => ids.includes(me)).map(([id]) => id);
    },

    async setVote(itemId: string, voted: boolean) {
      const user = getUser();
      const me = user?.id ?? 'local';
      const votes = read<Record<string, string[]>>(VOTES_KEY, {});
      const ids = new Set(votes[itemId] ?? []);
      if (voted) ids.add(me); else ids.delete(me);
      votes[itemId] = [...ids];
      write(VOTES_KEY, votes);
      // Keep the denormalized count in step with the cloud behaviour.
      const items = read<BacklogItem[]>(ITEMS_KEY, []);
      write(ITEMS_KEY, items.map((it) => (it.id === itemId ? { ...it, voteCount: ids.size } : it)));
      notify();
    },

    async listNotifications() {
      const user = getUser();
      const me = user?.id ?? 'local';
      return read<BacklogNotification[]>(NOTIFS_KEY, [])
        .filter((n) => n.userId === me)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },

    async addNotifications(rows: AddNotificationRow[]) {
      if (!rows.length) return;
      const existing = read<BacklogNotification[]>(NOTIFS_KEY, []);
      const added = rows.map((n) => ({
        id: uid('nt'),
        userId: n.userId,
        itemId: n.itemId ?? null,
        kind: n.kind,
        body: n.body ?? null,
        read: false,
        createdAt: nowIso(),
      } as BacklogNotification));
      write(NOTIFS_KEY, [...existing, ...added]);
      notify();
    },

    async markRead(ids: string[]) {
      if (!ids.length) return;
      const set = new Set(ids);
      write(NOTIFS_KEY, read<BacklogNotification[]>(NOTIFS_KEY, [])
        .map((n) => (set.has(n.id) ? { ...n, read: true } : n)));
      notify();
    },

    subscribe(cb: () => void) {
      listeners.add(cb);
      return () => { listeners.delete(cb); };
    },
  };
}
