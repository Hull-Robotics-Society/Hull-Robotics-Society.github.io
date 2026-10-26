# Hull University Robotics Society website

The source of [hull-robotics-society.github.io](https://hull-robotics-society.github.io), built with [Astro](https://astro.build).
Every page is generated from Markdown files. You never edit a list of links by hand: add a file and it shows up everywhere it should.

## Adding content

Everything lives in `src/content/`. Copy an existing file next to the one you want to add, change the front matter (the block between the `---` lines) and write the body in Markdown.
Photos and videos go in `public/`, and you link them with a path that starts with `/`, for example `/images/dalek/new-photo.jpg`.

### A build-log entry

Create `src/content/logs/<project>/<entry>.md`:

```markdown
---
title: "Upgrading the Electronics"
slug: dalek/dalek-electronics-upgrade   # becomes /projects/dalek/dalek-electronics-upgrade/
project: dalek                          # lower-case project id
date: 2024-09-10
excerpt: "One sentence for the build log."
---

Your write-up…
```

Leave out `date` for a reference page that is not part of the timeline, like the Dalek schematics. Its button appears in the project's fact sheet.

### An event

Create `src/content/events/<slug>.md`:

```markdown
---
title: "KiCad workshop"
type: "Workshop"        # Project meeting, Project day, Workshop, Film night, Showcase, Fair, Social or Competition
date: 2026-11-12
start: "17:00"
end: "19:00"
location: "Robot Lab, Applied Science building"
excerpt: "One sentence for the events list."
cover: "/images/events/kicad.jpg"   # optional
---
```

Upcoming events go to the top of the Events page and into the "Next up" bar on the homepage. Once they have ended they move to the past list on their own: the site rebuilds every morning.
A regular session uses `recurring: weekly` and `weekday: 1` (0 = Sunday, 1 = Monday, …) instead of a `date`.
Every dated event with a `start` time gets an "Add to calendar" file at `/events/<slug>.ics`.

#### Film nights

A film night is an event with `type: "Film night"` and a `film` block. It gets a cinema-style page with the poster, a ticket, the cast, the trailer and the other film nights. Copy `terminator-screening.md` as a starting point:

```markdown
---
title: "Movie Night: The Terminator"
type: "Film night"
date: 2025-10-27
start: "17:00"
end: "19:00"
location: "Robotics Lab, University of Hull"
bring: "Bring your own snacks!"
excerpt: "One or two sentences for the events list and the page header."
cover: "/images/terminator.png"        # the poster, square works best
film:
  title: "The Terminator"
  year: 1984
  director: "James Cameron"
  runtime: "1h 47m"
  rating: "R"
  synopsis: "What the film is about."
  cast:
    - ["Arnold Schwarzenegger", "The Terminator"]
    - ["Linda Hamilton", "Sarah Connor"]
  trailer: "k64P4l2Wmeg"                # the YouTube video id
---

An optional paragraph about the evening itself.
```

The trailer only loads from YouTube when a visitor presses play.

### A tutorial

Create `src/content/tutorials/<slug>.md` with `title`, `date`, `excerpt`, `level` (Beginner, Intermediate or Advanced), `duration` and optionally `needs`, `session`, `cover` and `tags`.
Use `##` headings for the steps. With three or more of them, the page gets a contents list.

### A journal post

Create `src/content/journal/<slug>.md` with `title`, `date`, `excerpt` and `cover`.
Add `eventType: Showcase` (or Fair, Social, Competition, Workshop) to also list the post on the Events page.

### A research article

Create `src/content/research/<area>/<slug>.md` with `title`, `area`, `date` and `excerpt`.
Research areas (title, picture, summary, related projects) are described in `src/data/research-areas.json`.

### A new project

Create `src/content/projects/<id>.md`. The body is the overview; the front matter controls the rest:

| Field | What it does |
| --- | --- |
| `order` | Position on the Projects page |
| `status` | `active`, `paused` or `new` |
| `started` | Start date, shown as "since …" |
| `tagline` / `summary` | Header text on the project page / text on its card |
| `tags`, `filters` | Chips on the card / which filter buttons it answers to (`ros`, `electronics`, `humanoid`, `eeg`, `3d`) |
| `cover`, `hero` | Card picture / wide header picture |
| `gallery` | Folders in `public/` whose photos and videos are listed automatically, e.g. `[images/dalek, media/dalek]` |
| `cad` | GitHub repository and folders whose `.stl` files appear in the 3D viewer (see `dalek.md`) |
| `roster` | Card in "Meet the machines" on the homepage. Leave it out to keep the project off the homepage |

### 3D models

The 3D viewer lists every `.stl` file in the folders named under `cad`, straight from GitHub, each time the site is built.
Export new parts as STL (millimetres) into one of those folders and they appear on the next build. Give a part a nicer name with `cad.names`.
SolidWorks files (`.SLDPRT`, `.SLDASM`) can't be shown in a browser and need an STL export first.

### Notices and cancelled sessions

- To cancel one week of a weekly session, add the date to its file, e.g. in `src/content/events/weekly-meetup.md`:

  ```yaml
  cancelled: [2026-11-02]
  ```

  A banner ("No Project Meeting on Monday 2 November") appears on every page during the week before, and "Next up" skips that week.
- For any other announcement, add an entry to `src/data/notices.json`:

  ```json
  { "text": "The lab is closed for exams until 20 January.", "from": "2027-01-05", "until": "2027-01-20", "tone": "warning", "link": "/events/", "linkText": "See events" }
  ```

  `from`, `until` and `link` are optional. Visitors can dismiss a banner.

### Search

The search (magnifying glass in the header, or Ctrl+K / `/`) covers projects, build logs, tutorials, research, events, film nights, the journal and the About page. The index is built automatically by `npm run build`; it doesn't exist while running `npm run dev`.

### Committee and contact details

- Executive team: `src/data/committee.json` (name, role, a one-sentence `about`, favourite `robot` and an optional `photo`). Update `year` and the list when a new committee is elected. The section on the About page stays hidden while the list is empty.
- Links, email and address: `src/data/site.json`.
- Homepage photo collage: `src/data/home.json`.

## Running it locally

You need [Node.js](https://nodejs.org) 22.12 or newer.

```bash
npm install
```

```bash
npm run dev
```

Then open <http://localhost:4321>. Pages reload as you save files. `npm run build` produces the finished site in `dist/`.

## Publishing

Pushing to the `gh-pages` branch runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages.
The repository's **Settings → Pages → Source** must be set to **GitHub Actions**.

## Layout of the code

```
src/content/        Markdown content (see above)
src/content.config.ts  Which fields each kind of content has
src/data/           Site-wide settings, research areas, committee, homepage collage
src/pages/          One file per page type; [brackets] are generated for every entry
src/components/     Header, roster, 3D viewer, photo grid, …
src/layouts/        Page frame (Base) and long-form article layout
src/styles/         Design tokens and styles (light theme by default, dark via the toggle)
public/             Photos, videos and other files served as they are
scripts/            One-off migration tools used when moving from Jekyll
```
