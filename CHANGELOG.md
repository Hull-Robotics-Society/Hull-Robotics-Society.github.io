# Changelog

## 2.0.0 (unreleased)

Rebuilt the website from scratch with Astro (7.4; needs Node.js 22.23.4 or newer), replacing the Jekyll site based on the Minimal Mistakes theme.

### Design
- New design in light and dark themes: a light theme by default and a dark "lab" look via the toggle in the header. The logo green is the accent colour, with Chakra Petch, IBM Plex Sans and JetBrains Mono as typefaces (self-hosted).
- Homepage is now a scroll story:
  - The hero draws circuit traces into the logo.
  - A "Next up" bar always shows the next Project Meeting, Project Day or event.
  - A pinned robot roster ("Meet the machines") swaps through the robots as you scroll.
  - A drifting photo collage and a Join section.
- Calm, readable inner pages: project pages with a dated build-log timeline and fact sheet, long-form article pages with a sticky contents list, reading time and an "Edit this page on GitHub" link.
- New About page with mission, what we do, why join, where to find us and contacts, plus the 2026–27 Executive Team (President, Vice President, Treasurer, Project Manager) as compact cards.
- Film nights get their own cinema-style page:
  - A dark poster hero that marks the film as upcoming or "Screened".
  - Film facts (year, director, runtime, rating) and a ticket-stub card with the screening details.
  - The cast, and a trailer that only loads from YouTube on click.
  - A shelf of the other film nights.
- The Events page has a film night poster shelf, and every dated event offers an "Add to calendar" (.ics) file while it is upcoming.

### Content and navigation
- Site search (Pagefind) in the header, also on Ctrl+K and `/`: searches every build log, tutorial, event, film night, journal post, research article and the About page, entirely in the browser.
- Notice banners: cancelled weekly sessions (a `cancelled` date list on the event) and announcements from `src/data/notices.json` appear at the top of every page while they are current, and "Next up" skips cancelled weeks.
- Navigation reduced to Projects, Tutorials, Events, Journal and About. Research is a tab next to Projects; the blog is now the Journal.
- All listings generate themselves from the Markdown files. No hand-maintained link lists any more.
- Galleries replace the separate gallery pages: every photo and video in a page's media folder appears in a grid on that page (projects, events, journal posts, build logs), apart from the ones already used in the text.
- The Events page sorts upcoming events to the top in the visitor's browser, and a daily rebuild moves past events to the archive.
- 3D viewer (three.js) on project pages: lists the STL files from the project's GitHub repository at build time and shows them with turntable previews. Live for the Dalek and the OSRC.

### Content structure
- Events and journal posts are filed in academic-year folders (`events/2026-27/…`, 1 August to 31 July); weekly sessions in `events/weekly/`. Page addresses still come from the file name only, so no URL changed.
- Every page has its own media folder that mirrors its Markdown file (`src/content/events/2026-27/egm.md` → `public/media/events/2026-27/egm/`). `cover.*` (or `poster.*` for film nights) in it is the cover, everything else the gallery, so most pages need no `cover:` or `gallery:` lines. `public/images/` now only holds design files and committee photos.
- All existing photos and videos moved into this layout; four unused images (Transformer, Dalek and Pepper pictures and a brain diagram) were removed.
- `npm run new` asks what to add, the title and the date, and creates the file from a template in `templates/` in the right folder, with its media folder.
- Pictures in the text use three patterns styled by the site: `<figure>` with `<figcaption>` and `media-row`, which lines pictures and videos up side by side at one height and fills the width of the text without stretching or cropping. The hand-made layouts from the old site are gone: the Top 100 Leaders photos were stretched its opening clip only 125 px wide beside a short list, a caption showed as raw text, and the Baxter build logs had extra top-level headings that were missing from "On this page".
- `npm run check` reports old-site layouts (`style=`, `align=`, `<center>`), Jekyll template syntax, `#` headings, missing empty lines after HTML blocks, captions written as text, videos without a preview image, old Jekyll front matter fields and code blocks in languages the highlighter doesn't know (the Dalek electronics sketch was labelled `arduino`; it is now highlighted as C++). It also lists placeholder text, broken media links, clashing addresses, film nights without a poster, entries in the wrong year folder, unused media, oversized files and videos without a preview image.

### Transparency
- Footer note and an "About this website" section on the About page: who runs the site, how AI tools were used (with a list of AI-assisted pages) and image credits.
- `aiAssisted: true` in front matter shows a short note under a page's title. It is set on the Pepper documentation and the Baxter × Pepper dance write-up.
- Image credits from `src/data/credits.json`, by file or whole folder, shown on the photos themselves (galleries, lightbox, project headers, film posters, roster, collage, project cards). Film posters and the Baxter press image are credited.

### Media and performance
- Photos scaled to at most 1600 px and videos re-encoded to H.264 with poster frames: media went from 384 MB to 106 MB.
- three.js only loads on pages with a 3D viewer, once it scrolls into view.

### URLs
- Every old build-log, tutorial, event and research URL still works. The blog, gallery and "all-…" pages redirect to their new homes, and the `transfomer` typo URL redirects to `transformer`.

### Fixes
- Footer: logo, address and email in one row with the AI note centred underneath, instead of the note sitting alone on the left.
- On phones, all five menu links now fit in one row (down to 320 px wide screens) instead of "About" being cut off.
- Broken outside links: the Aldebaran Pepper documentation now links to the official doc.aldebaran.com instead of a mirror with an invalid certificate, and the Dalek "Source Code" link points to the `[03] Code` folder. The Baxter "Code on GitHub" button now opens the Pepper–Baxter dance repository (the only public Baxter code), and the About page links to the society's YouTube channel @UoH_RobSoc.
- Clearer build-log and journal titles and one-line summaries (OSRC, Baxter, Pepper, Transformer, Dalek and Journal), replacing ones like "Pepper Projects: HTML" / "Detailed Project Documentation". "Freshers Fair 2" is now correctly "Pepper at Refreshers".
- Spelling and grammar fixes in the Journal posts, including "Robotics Society of Hope" and unfilled "[insert name]" placeholders for the Dalek.
- Weekly sessions now match reality: the Monday Project Meeting (17:00 to 19:00) and the new Wednesday Project Day (13:30 to 17:00), both in term time. Their times live in one place and feed the homepage, Events and About.
- "Univeristy" and "Kindgom" typos, the broken `/what-we-do/` link, the empty Dalek update list, `tock_sticky` typos, relative video posters and placeholder images that never loaded.

### Removed
- The vendored Minimal Mistakes theme including its demo `docs/` and `test/` folders, jQuery, the Lunr search and the unused Algolia workflow.
