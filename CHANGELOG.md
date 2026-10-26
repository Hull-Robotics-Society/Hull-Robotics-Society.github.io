# Changelog

## 2.0.0 (unreleased)

Rebuilt the website from scratch with Astro, replacing the Jekyll site based on the Minimal Mistakes theme.

### Design
- New design in light and dark themes: a light theme by default and a dark "lab" look via the toggle in the header. The logo green is the accent colour, with Chakra Petch, IBM Plex Sans and JetBrains Mono as typefaces (self-hosted).
- Homepage is now a scroll story:
  - The hero draws circuit traces into the logo.
  - A "Next up" bar always shows the next project night or event.
  - A pinned robot roster ("Meet the machines") swaps through the robots as you scroll.
  - A drifting photo collage and a Join section.
- Calm, readable inner pages: project pages with a dated build-log timeline and fact sheet, long-form article pages with a sticky contents list, reading time and an "Edit this page on GitHub" link.
- New About page with mission, what we do, why join, where to find us, contacts and an optional committee section.

### Content and navigation
- Navigation reduced to Projects, Tutorials, Events, Journal and About. Research is a tab next to Projects; the blog is now the Journal.
- All listings generate themselves from the Markdown files. No hand-maintained link lists any more.
- Project galleries replace the separate gallery pages: every photo and video in a project's folder appears on its page.
- The Events page sorts upcoming events to the top in the visitor's browser, and a daily rebuild moves past events to the archive.
- 3D viewer (three.js) on project pages: lists the STL files from the project's GitHub repository at build time and shows them with turntable previews. Live for the Dalek and the OSRC.

### Media and performance
- Photos scaled to at most 1600 px and videos re-encoded to H.264 with poster frames: media went from 384 MB to 106 MB.
- three.js only loads on pages with a 3D viewer, once it scrolls into view.

### URLs
- Every old build-log, tutorial, event and research URL still works. The blog, gallery and "all-…" pages redirect to their new homes, and the `transfomer` typo URL redirects to `transformer`.

### Fixes
- "Univeristy" and "Kindgom" typos, the broken `/what-we-do/` link, the empty Dalek update list, `tock_sticky` typos, relative video posters and placeholder images that never loaded.

### Removed
- The vendored Minimal Mistakes theme including its demo `docs/` and `test/` folders, jQuery, the Lunr search and the unused Algolia workflow.
