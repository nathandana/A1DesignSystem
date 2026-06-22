/**
 * Backlog — the storage backend interface. Two implementations exist:
 *   - supabaseBackend.ts — the shared, multi-user cloud store (signed in + configured)
 *   - localBackend.ts     — gzipped localStorage, so the Backlog page works offline/solo
 * `backlogStore.ts` selects between them and layers the business logic (activity log
 * entries + notifications) on top of these primitives.
 */
import type {
  BacklogComment, BacklogItem, BacklogNotification, CommentKind, Complexity,
  NotificationKind, Priority, ScopeKind, TicketType, UpdateTicketPatch,
} from './types';

/** A new ticket as handed to a backend (the store has already stamped the author). */
export interface CreateItemRow {
  title: string;
  description?: string | null;
  type?: TicketType;
  priority?: Priority | null;
  complexity?: Complexity | null;
  scopeKind?: ScopeKind;
  scopeRef?: string | null;
  scopeLabel?: string | null;
  createdBy?: string | null;
  createdByEmail?: string | null;
  attachmentRefs?: string[];
}

export interface AddCommentRow {
  itemId: string;
  kind?: CommentKind;
  body?: string | null;
  meta?: Record<string, unknown> | null;
  userId?: string | null;
  userEmail?: string | null;
}

export interface AddNotificationRow {
  userId: string;
  itemId?: string | null;
  kind: NotificationKind;
  body?: string | null;
}

export interface BacklogBackend {
  listItems(): Promise<BacklogItem[]>;
  createItem(row: CreateItemRow): Promise<BacklogItem>;
  updateItem(id: string, patch: UpdateTicketPatch): Promise<BacklogItem | null>;
  removeItem(id: string): Promise<void>;
  /**
   * Merge ticket `fromId` into `toId`: move the discussion thread (comment / question /
   * answer rows — never the activity log) and the votes onto the surviving ticket. The
   * caller (store) handles the status / `duplicateOf` bookkeeping and the activity notes.
   */
  mergeItem(fromId: string, toId: string): Promise<void>;
  listComments(itemId: string): Promise<BacklogComment[]>;
  addComment(c: AddCommentRow): Promise<BacklogComment>;
  /** Item ids the current user has voted for. */
  votedItemIds(): Promise<string[]>;
  setVote(itemId: string, voted: boolean): Promise<void>;
  listNotifications(): Promise<BacklogNotification[]>;
  addNotifications(rows: AddNotificationRow[]): Promise<void>;
  markRead(ids: string[]): Promise<void>;
  /** Call `cb` whenever remote data may have changed; returns an unsubscribe fn. */
  subscribe(cb: () => void): () => void;
}
