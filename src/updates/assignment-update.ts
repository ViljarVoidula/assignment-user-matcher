import type { Assignment } from '../types/matcher';

/**
 * Editing a task that is already in flight.
 *
 * Everything here is pure: what a patch actually changes, which per-tag
 * indexes have to move as a result, and whether the person currently holding
 * the task can still hold it. The Redis writes live in the matcher; the
 * decisions live here, because "did the tags change" and "is the owner still
 * eligible" are exactly the two questions a wrong answer to would silently
 * redistribute somebody's work — or silently fail to.
 */

/**
 * The fields of a stored assignment an operator may edit after creation.
 *
 * Deliberately narrow. `tags` and `priority` are routing — changing them
 * changes who should have the task, which is what makes this more than a
 * metadata write. `title` and `meta` are description, carried on the record so
 * a list view can render a row without a second store. Everything else about
 * an assignment (its escalation ladder, its SLA, its offer window, its vetoes)
 * is a policy chosen when the work was created and is not patched piecemeal —
 * same reasoning as `resolvePolicy` on the platform side.
 *
 * A field left `undefined` is untouched; `title` and `meta` accept `null` to
 * clear them, which is why they are not simply optional.
 */
export interface AssignmentUpdate {
    tags?: string[];
    priority?: number;
    title?: string | null;
    meta?: Record<string, unknown> | null;
}

/** Which stores an assignment can be edited in. Terminal states are not editable. */
export type UpdatableStatus = 'queued' | 'pending' | 'accepted' | 'parked' | 'scheduled';

export interface UpdateAssignmentResult {
    id: string;
    /** Where the task ended up — `queued` when a retag sent it back for rematching. */
    status: UpdatableStatus;
    tags: string[];
    priority: number | undefined;
    /** Whether the edit pulled the task off its owner and put it back in the queue. */
    requeued: boolean;
    /** Who held it before the edit, whether or not they kept it. */
    previousOwnerId: string | null;
}

/**
 * Tidy a patch's tag list without changing what any tag *is*.
 *
 * Surrounding whitespace is stripped, empties dropped and duplicates folded —
 * all of which leave the tag's identity alone. Case is deliberately not folded:
 * creation indexes tags verbatim (`enqueueAssignment`), users carry them
 * verbatim (`addUser`) and matching compares them exactly, so an edit that
 * lowercased would open a second routing universe that only edits enter. In it,
 * re-stating `Plumbing` reads as a tag change, scores the holder against
 * `plumbing` — a tag they do not have — and takes their work away for an edit
 * that changed nothing.
 */
export function normalizeUpdateTags(tags: string[]): string[] {
    const seen = new Set<string>();
    for (const raw of tags) {
        const tag = String(raw).trim();
        if (tag.length > 0) seen.add(tag);
    }
    return [...seen];
}

export interface TagIndexDiff {
    /** Per-tag sorted sets the assignment must be added to. */
    added: string[];
    /** Per-tag sorted sets it must be removed from. */
    removed: string[];
    /** Every tag it should be indexed under afterwards (the `default` tag included). */
    indexTags: string[];
    /** The value of the `assignment:<id>:tags` hash field afterwards. */
    tagsCsv: string;
    /** False when the patch leaves the routing tags exactly as they were. */
    changed: boolean;
}

/**
 * What moving from one tag set to another costs in index writes.
 *
 * The `default` tag is folded in here rather than at the call site because it
 * is an index-level fact, not a property of the task: `enableDefaultMatching`
 * puts every assignment in one shared set, and a retag that forgot it would
 * evict a task from the default pool without anybody asking.
 */
export function diffTagIndexes(oldTags: string[], newTags: string[], enableDefaultMatching: boolean): TagIndexDiff {
    const withDefault = (tags: string[]) => (enableDefaultMatching ? [...tags, 'default'] : [...tags]);
    const before = new Set(withDefault(oldTags));
    const indexTags = withDefault(newTags);
    const after = new Set(indexTags);

    return {
        added: indexTags.filter((tag) => !before.has(tag)),
        removed: [...before].filter((tag) => !after.has(tag)),
        indexTags,
        tagsCsv: indexTags.join(','),
        changed: before.size !== after.size || [...after].some((tag) => !before.has(tag)),
    };
}

/** Apply a patch to a stored record, leaving untouched fields byte-identical. */
export function applyUpdate(assignment: Assignment, patch: AssignmentUpdate, normalizedTags?: string[]): Assignment {
    const next = { ...assignment } as Assignment & Record<string, unknown>;
    if (patch.tags !== undefined) next.tags = normalizedTags ?? normalizeUpdateTags(patch.tags);
    if (patch.priority !== undefined) next.priority = patch.priority;
    if (patch.title !== undefined) {
        if (patch.title === null) delete next.title;
        else next.title = patch.title;
    }
    if (patch.meta !== undefined) {
        if (patch.meta === null) delete next.meta;
        else next.meta = patch.meta;
    }
    return next;
}

/**
 * An acceptance consumes the offer window.
 *
 * `schedule.notAfter` means "somebody must take this by T", and somebody did.
 * When accepted work goes back into the pool — a retag that takes it off its
 * holder, or a supervisor moving it to a different worker — re-arming an
 * elapsed window would have the next sweep park or drop it as a missed offer,
 * which is a verdict about an offer nobody answered. Dropping the field from
 * the record (rather than only from the index) keeps every later requeue of
 * the same record agreeing with this.
 */
export function consumeOfferWindow(record: Record<string, any>): void {
    const schedule = record.schedule;
    if (schedule && typeof schedule === 'object' && schedule.notAfter !== undefined) {
        const { notAfter, ...rest } = schedule as Record<string, unknown>;
        if (Object.keys(rest).length > 0) record.schedule = rest;
        else delete record.schedule;
    }
}
