import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Old Jekyll URLs that moved. Everything else keeps its old address.
const redirects = {
    '/what-we-do': '/about/',
    '/projects/all-projects': '/projects/',
    '/projects/transfomer/introduction': '/projects/transformer/introduction/',
    '/research/all-research': '/research/',
    '/research/neuro': '/research/#neuro',
    '/tutorials/all-tutorials': '/tutorials/',
    '/events/all-events': '/events/',
    '/events/film-nights': '/events/',
    '/blogs': '/journal/',
    '/blogs/Varsity-2026': '/journal/varsity-2026/',
    '/blogs/freshers-day-2026': '/journal/freshers-day-2026/',
    '/blogs/graduation-2025-26': '/journal/graduation-2025-26/',
    '/blogs/our-2025': '/journal/our-2025/',
    '/blogs/our-2026': '/journal/our-2026/',
    '/gallery': '/projects/',
    '/gallery/dalek': '/projects/dalek/#media',
    '/gallery/baxter': '/projects/baxter/#media',
    '/gallery/pepper': '/projects/pepper/#media',
    '/gallery/transformer': '/projects/transformer/',
    '/gallery/general': '/projects/',
    '/gallery/events': '/events/'
};

export default defineConfig({
    site: 'https://hull-robotics-society.github.io',
    trailingSlash: 'ignore',
    compressHTML: true,
    redirects,
    integrations: [sitemap()]
});
