import { getCollection } from 'astro:content';
import { formatDate } from './site';

export interface EventItem {
    title: string;
    href: string;
    type: string;
    date?: Date;
    recurring?: 'weekly';
    weekday?: number;
    cancelled?: Date[];
    start?: string;
    end?: string;
    location?: string;
    excerpt: string;
    cover?: string;
}

/** Events plus journal posts flagged with `eventType`, newest first. */
export async function allEvents(): Promise<EventItem[]> {
    const events = (await getCollection('events')).map(e => ({
        title: e.data.title,
        href: `/events/${e.id}/`,
        type: e.data.type,
        date: e.data.date,
        recurring: e.data.recurring,
        weekday: e.data.weekday,
        cancelled: e.data.cancelled,
        start: e.data.start,
        end: e.data.end,
        location: e.data.location,
        excerpt: e.data.excerpt,
        cover: e.data.cover
    }));
    const posts = (await getCollection('journal'))
        .filter(j => j.data.eventType)
        .map(j => ({
            title: j.data.title,
            href: `/journal/${j.id}/`,
            type: j.data.eventType!,
            date: j.data.date,
            excerpt: j.data.excerpt,
            cover: j.data.cover
        }));
    return [...events, ...posts].sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0));
}

/**
 * Data for the client-side "next up" logic: the browser knows today's date, the build does not.
 * Dated events are passed as YYYY-MM-DD, recurring ones by weekday.
 */
export function clientEvents(items: EventItem[]) {
    return items
        .filter(e => e.recurring || e.date)
        .map(e => ({
            title: e.title,
            href: e.href,
            type: e.type,
            date: e.date?.toISOString().slice(0, 10),
            nice: formatDate(e.date),
            weekday: e.weekday,
            cancelled: (e.cancelled ?? []).map(d => d.toISOString().slice(0, 10)),
            start: e.start ?? '',
            end: e.end ?? '',
            location: e.location ?? ''
        }));
}
