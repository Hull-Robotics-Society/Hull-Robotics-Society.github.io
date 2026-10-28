import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Dates in front matter are written as YYYY-MM-DD.
const date = z.coerce.date();

/** A robot or build. One Markdown file per project; the body is the overview. */
const projects = defineCollection({
    loader: glob({ base: './src/content/projects', pattern: '*.md' }),
    schema: z.object({
        title: z.string(),
        order: z.number(),
        status: z.enum(['active', 'paused', 'new']),
        started: date,
        tagline: z.string(),
        summary: z.string(),
        tags: z.array(z.string()).default([]),
        filters: z.array(z.string()).default([]),
        stack: z.string().optional(),
        seenAt: z.string().optional(),
        cover: z.string().optional(),
        coverFit: z.enum(['cover', 'contain']).default('cover'),
        hero: z.string().optional(),
        repo: z.url().optional(),
        // Photo and video folders below public/, listed automatically
        gallery: z.array(z.string()).default([]),
        // GitHub folders whose STL files appear in the 3D viewer
        cad: z.object({
            repo: z.string(),
            branch: z.string().default('main'),
            folders: z.array(z.string()),
            names: z.record(z.string(), z.string()).default({}),
            groups: z.record(z.string(), z.string()).default({})
        }).optional(),
        // Homepage robot roster card
        roster: z.object({
            eyebrow: z.string(),
            specs: z.array(z.tuple([z.string(), z.string()])),
            video: z.string().optional(),
            image: z.string().optional(),
            imageFit: z.enum(['cover', 'contain']).default('cover')
        }).optional()
    })
});

/** Build-log entries and documentation, filed under a project. */
const logs = defineCollection({
    loader: glob({ base: './src/content/logs', pattern: '**/*.md' }),
    schema: z.object({
        // Shows a short note that the page was drafted with AI assistance and reviewed
        aiAssisted: z.boolean().default(false),
        title: z.string(),
        project: z.string(),
        date: date.optional(),
        excerpt: z.string().default(''),
        tags: z.array(z.string()).default([])
    })
});

/** Research articles, grouped into areas (see src/data/research-areas.json). */
const research = defineCollection({
    loader: glob({ base: './src/content/research', pattern: '**/*.md' }),
    schema: z.object({
        // Shows a short note that the page was drafted with AI assistance and reviewed
        aiAssisted: z.boolean().default(false),
        title: z.string(),
        area: z.string(),
        date: date,
        excerpt: z.string().default(''),
        tags: z.array(z.string()).default([])
    })
});

const tutorials = defineCollection({
    loader: glob({ base: './src/content/tutorials', pattern: '*.md' }),
    schema: z.object({
        // Shows a short note that the page was drafted with AI assistance and reviewed
        aiAssisted: z.boolean().default(false),
        title: z.string(),
        date: date,
        excerpt: z.string(),
        level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
        duration: z.string(),
        needs: z.string().optional(),
        session: z.string().optional(),
        cover: z.string().optional(),
        tags: z.array(z.string()).default([])
    })
});

/** Events. Leave `date` empty and set `recurring: weekly` for a regular session. */
const events = defineCollection({
    loader: glob({ base: './src/content/events', pattern: '*.md' }),
    schema: z.object({
        // Shows a short note that the page was drafted with AI assistance and reviewed
        aiAssisted: z.boolean().default(false),
        title: z.string(),
        type: z.enum(['Project meeting', 'Project day', 'Workshop', 'Film night', 'Showcase', 'Fair', 'Social', 'Competition']),
        date: date.optional(),
        recurring: z.enum(['weekly']).optional(),
        weekday: z.number().min(0).max(6).optional(),
        // Dates a weekly session does not happen; shown as a notice and skipped by "Next up"
        cancelled: z.array(z.union([
            z.coerce.date().transform(date => ({ date, note: undefined as string | undefined, link: undefined as string | undefined })),
            z.object({ date: z.coerce.date(), note: z.string().optional(), link: z.string().optional() })
        ])).default([]),
        start: z.string().optional(),
        end: z.string().optional(),
        location: z.string().optional(),
        bring: z.string().optional(),
        excerpt: z.string().default(''),
        cover: z.string().optional(),
        // Film nights: the film being screened, shown as a cinema-style page
        film: z.object({
            title: z.string(),
            year: z.number().optional(),
            director: z.string().optional(),
            runtime: z.string().optional(),
            rating: z.string().optional(),
            edition: z.string().optional(),
            synopsis: z.string(),
            cast: z.array(z.tuple([z.string(), z.string()])).default([]),
            trailer: z.string().optional()
        }).optional()
    })
});

/** Stories from the society. Set `eventType` to also list a post on the Events page. */
const journal = defineCollection({
    loader: glob({ base: './src/content/journal', pattern: '*.md' }),
    schema: z.object({
        // Shows a short note that the page was drafted with AI assistance and reviewed
        aiAssisted: z.boolean().default(false),
        title: z.string(),
        date: date,
        excerpt: z.string().default(''),
        cover: z.string().optional(),
        eventType: z.enum(['Showcase', 'Fair', 'Social', 'Competition', 'Workshop']).optional()
    })
});

export const collections = { projects, logs, research, tutorials, events, journal };
