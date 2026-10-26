/** Client-side helpers for "what's on next". The static build cannot know today's date. */

export interface ClientEvent {
    title: string;
    href: string;
    type: string;
    date?: string;
    nice: string;
    weekday?: number;
    cancelled?: string[];
    start: string;
    end: string;
    location: string;
}

export interface Occurrence {
    event: ClientEvent;
    when: Date;
}

/** Local date as YYYY-MM-DD */
export function isoDay(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function at(day: Date, time: string, fallback: number): Date {
    const d = new Date(day);
    const [h, m] = (time || '').split(':').map(Number);
    d.setHours(Number.isFinite(h) ? h : fallback, Number.isFinite(m) ? m : 0, 0, 0);
    return d;
}

/**
 * The next time an event happens, or null if it is over.
 * Recurring events repeat on their weekday; an event counts as upcoming until it ends.
 */
export function nextOccurrence(e: ClientEvent, now = new Date()): Date | null {
    if (e.weekday !== undefined && !e.date) {
        const day = new Date(now);
        day.setDate(day.getDate() + ((e.weekday - day.getDay() + 7) % 7));
        if (at(day, e.end || e.start, 23) < now) day.setDate(day.getDate() + 7);
        // Skip weeks the session is cancelled
        while (e.cancelled?.includes(isoDay(day))) day.setDate(day.getDate() + 7);
        return at(day, e.start, 0);
    }
    if (!e.date) return null;
    const day = new Date(e.date + 'T00:00:00');
    return at(day, e.end || e.start, 23) >= now ? at(day, e.start, 0) : null;
}

/** Upcoming occurrences, soonest first. */
export function upcoming(events: ClientEvent[], now = new Date()): Occurrence[] {
    return events
        .map(event => ({ event, when: nextOccurrence(event, now) }))
        .filter((o): o is Occurrence => o.when !== null)
        .sort((a, b) => a.when.getTime() - b.when.getTime());
}

/** "Tonight", "Tomorrow" or "Mon 2 Nov" */
export function dayLabel(when: Date, now = new Date()): string {
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const day = new Date(when);
    day.setHours(0, 0, 0, 0);
    const diff = Math.round((day.getTime() - today.getTime()) / 864e5);
    if (diff === 0) return when.getHours() >= 17 ? 'Tonight' : 'Today';
    if (diff === 1) return 'Tomorrow';
    return when.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function timeRange(e: ClientEvent): string {
    return e.start && e.end ? `${e.start} to ${e.end}` : e.start;
}
