import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';

// "Add to calendar" file for every dated event with a start time.
export async function getStaticPaths() {
    return (await getCollection('events'))
        .filter(e => e.data.date && e.data.start)
        .map(e => ({ params: { slug: e.id }, props: { e } }));
}

const stamp = (date: Date, time: string) => date.toISOString().slice(0, 10).replace(/-/g, '') + 'T' + time.replace(':', '') + '00';
const escape = (s: string) => s.replace(/[\\;,]/g, m => '\\' + m).replace(/\n/g, '\\n');

export const GET: APIRoute = ({ props, site }) => {
    const e = (props as { e: CollectionEntry<'events'> }).e;
    const d = e.data.date!;
    const start = e.data.start!;
    const end = e.data.end ?? `${String(Number(start.slice(0, 2)) + 2).padStart(2, '0')}${start.slice(2)}`;
    const url = new URL(`/events/${e.id}/`, site).href;
    const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Hull University Robotics Society//Website//EN',
        'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        `UID:${e.id}@hull-robotics-society.github.io`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
        `DTSTART;TZID=Europe/London:${stamp(d, start)}`,
        `DTEND;TZID=Europe/London:${stamp(d, end)}`,
        `SUMMARY:${escape(e.data.title)}`,
        `DESCRIPTION:${escape(e.data.excerpt + '\n\n' + url)}`,
        e.data.location ? `LOCATION:${escape(e.data.location)}` : '',
        `URL:${url}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].filter(Boolean).join('\r\n');

    return new Response(ics, { headers: { 'Content-Type': 'text/calendar; charset=utf-8' } });
};
