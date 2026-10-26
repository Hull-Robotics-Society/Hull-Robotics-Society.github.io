import fs from 'node:fs';
import path from 'node:path';
import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;
export type Log = CollectionEntry<'logs'>;

/** "15 Aug 2024" */
export function formatDate(d?: Date): string {
    if (!d) return '';
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

/** "Aug 2024" */
export function formatMonth(d?: Date): string {
    if (!d) return '';
    return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

/** Rough reading time for a Markdown body. */
export function readingTime(body = ''): string {
    const words = body.replace(/```[\s\S]*?```/g, '').split(/\s+/).length;
    return Math.max(1, Math.round(words / 200)) + ' min read';
}

export async function projects(): Promise<Project[]> {
    return (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);
}

/** Dated build-log entries of a project, newest first. Undated documentation is left out. */
export async function logsOf(project: Project): Promise<Log[]> {
    const key = project.id.toLowerCase();
    return (await getCollection('logs'))
        .filter(l => l.data.project === key && l.data.date)
        .sort((a, b) => b.data.date!.getTime() - a.data.date!.getTime() || b.id.localeCompare(a.id));
}

export const statusLabel = { active: 'Active', paused: 'Paused', new: 'Just started' } as const;

/** Link to the Markdown source of an entry, so members can fix or extend it on GitHub. */
export function editUrl(filePath: string | undefined, repo: string, branch: string): string {
    return filePath ? `${repo}/edit/${branch}/${filePath.replace(/\\/g, '/')}` : repo;
}

export interface MediaItem {
    src: string;
    kind: 'image' | 'video';
    poster?: string;
    alt: string;
}

/**
 * List photos and videos in folders below public/, so a project's gallery fills itself.
 * A .jpg with the same name as an .mp4 is that video's poster and is not listed on its own.
 */
export function gallery(folders: string[], title: string): MediaItem[] {
    const items: MediaItem[] = [];
    for (const folder of folders) {
        const root = path.join(process.cwd(), 'public', folder);
        if (!fs.existsSync(root)) continue;

        const files = (fs.readdirSync(root, { recursive: true }) as string[])
            .map(f => f.replace(/\\/g, '/'))
            .sort();
        const videos = new Set(files.filter(f => /\.mp4$/i.test(f)).map(f => f.replace(/\.mp4$/i, '')));

        for (const f of files) {
            const url = '/' + folder + '/' + f;
            const stem = f.replace(/\.[^.]+$/, '');
            if (/\.mp4$/i.test(f)) {
                const poster = files.find(x => x !== f && x.replace(/\.[^.]+$/, '') === stem && /\.jpe?g$/i.test(x));
                items.push({ src: url, kind: 'video', poster: poster && '/' + folder + '/' + poster, alt: title + ' video' });
            } else if (/\.(jpe?g|png)$/i.test(f) && !videos.has(stem)) {
                items.push({ src: url, kind: 'image', alt: title + ' photo' });
            }
        }
    }
    return items;
}

export interface CadPart {
    id: string;
    name: string;
    group: string;
    file: string;
    raw: string;
    blob: string;
}

const cadCache = new Map<string, CadPart[]>();

/**
 * Find the STL files of a project on GitHub at build time.
 * New files in the listed folders show up in the 3D viewer on the next build.
 */
export async function cadParts(cad: NonNullable<Project['data']['cad']>): Promise<CadPart[]> {
    const key = JSON.stringify(cad);
    if (cadCache.has(key)) return cadCache.get(key)!;

    const headers: Record<string, string> = { 'User-Agent': 'hullrs-website' };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

    let parts: CadPart[] = [];
    try {
        const res = await fetch(`https://api.github.com/repos/${cad.repo}/git/trees/${cad.branch}?recursive=1`, { headers });
        if (!res.ok) throw new Error(`GitHub API ${res.status}`);
        const tree = (await res.json()).tree as { path: string; type: string }[];
        const enc = (p: string) => p.split('/').map(encodeURIComponent).join('/');

        parts = tree
            .filter(t => t.type === 'blob' && /\.stl$/i.test(t.path))
            .filter(t => cad.folders.some(f => path.posix.dirname(t.path) === f))
            .map(t => {
                const folder = path.posix.dirname(t.path);
                const stem = path.posix.basename(t.path).replace(/\.stl$/i, '');
                return {
                    id: stem.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    name: cad.names[stem] ?? stem.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                    group: cad.groups[folder] ?? folder.replace(/\[\d+\]\s*/g, ''),
                    file: path.posix.basename(t.path),
                    raw: `https://raw.githubusercontent.com/${cad.repo}/${cad.branch}/${enc(t.path)}`,
                    blob: `https://github.com/${cad.repo}/blob/${cad.branch}/${enc(t.path)}`
                };
            });

        // Named parts first, in the order given in front matter
        const order = Object.keys(cad.names).map(n => n.toLowerCase());
        const rank = (p: CadPart) => {
            const i = order.indexOf(p.file.replace(/\.stl$/i, '').toLowerCase());
            return i < 0 ? order.length : i;
        };
        parts.sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name));
    } catch (err) {
        console.warn(`[cad] could not list STL files for ${cad.repo}: ${(err as Error).message}`);
    }

    cadCache.set(key, parts);
    return parts;
}
