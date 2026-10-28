# Hull University Robotics Society website

The source of [hull-robotics-society.github.io](https://hull-robotics-society.github.io), built with [Astro](https://astro.build).

Every page is generated from Markdown and JSON files. You never edit a list of links by hand: add a file and it shows up everywhere it should (Projects page, homepage, Events, search, …).

**Contents**

- [Quick start](#quick-start)
- [How content works](#how-content-works)
- [Projects and build logs](#projects-and-build-logs)
- [Events, weekly sessions and film nights](#events-weekly-sessions-and-film-nights)
- [Cancelled sessions and notice banners](#cancelled-sessions-and-notice-banners)
- [Tutorials, journal posts and research](#tutorials-journal-posts-and-research)
- [Photos, videos and 3D models](#photos-videos-and-3d-models)
- [Site-wide settings](#site-wide-settings)
- [Running and testing it locally](#running-and-testing-it-locally)
- [Publishing](#publishing)
- [When something goes wrong](#when-something-goes-wrong)
- [Layout of the code](#layout-of-the-code)

---

## Quick start

**To add a page, run `npm run new`** in the project folder. It asks what you want to add (event, film night, journal post, build-log entry, tutorial or project), the title and the date, then creates the Markdown file in the right folder from a template in `templates/`, plus an empty folder for its photos and videos. Fill in every `TODO`, preview with `npm run dev`, and run **`npm run check`** before you commit (see [Checking your changes](#checking-your-changes)).

| I want to… | Edit or create |
| --- | --- |
| Announce an event or film night | `src/content/events/<academic year>/<name>.md` |
| Cancel one week of the Project Meeting or Project Day | `cancelled:` in `src/content/events/weekly/weekly-meetup.md` or `project-day.md` |
| Show a banner on every page (e.g. "Lab closed") | `src/data/notices.json` |
| Write a build-log entry for a project | `src/content/logs/<project>/<name>.md` |
| Add a new project | `src/content/projects/<name>.md` |
| Add a tutorial | `src/content/tutorials/<name>.md` |
| Write a journal post | `src/content/journal/<academic year>/<name>.md` |
| Add photos or videos to a page | its media folder, `public/media/<same path as the Markdown file>/` (see [Where files go](#where-files-go)) |
| Credit a photographer | `src/data/credits.json` |
| Update the committee | `src/data/committee.json` |
| Change the email, Discord link, address … | `src/data/site.json` |

### Where files go

Every page has a Markdown file in `src/content/` and, if it has pictures, a **media folder** in `public/media/` with the same path:

```
src/content/events/2026-27/mary-poppins-screening.md
public/media/events/2026-27/mary-poppins-screening/
    poster.jpg          the film poster (cover.jpg for other pages)
    some-photo.jpg      everything else appears as a gallery on the page
```

- **Events and journal posts** are filed in academic-year folders (`2025-26`, `2026-27`, …). A year runs from 1 August to 31 July, so a graduation in July still belongs to the year that is ending. Weekly sessions live in `src/content/events/weekly/`.
- **Build logs** are grouped by project (`logs/dalek/…`), research articles by area (`research/neuro/…`).
- `public/images/` is only for the website's own design files (`site/`) and the committee photos (`committee/`).

---

## How content works

### Front matter

Every Markdown file starts with a block between two `---` lines, the *front matter*. It holds the facts the site needs (title, date, …); everything below it is the text of the page.

```markdown
---
title: "Upgrading the electronics"
date: 2024-09-10
excerpt: "One sentence that appears in lists."
---

The text of the page, in normal Markdown.
```

A few rules that avoid most mistakes:

- **Dates** are always `YYYY-MM-DD`, without quotes: `date: 2026-11-02`.
- **Times** are 24-hour `HH:MM` *with* quotes: `start: "17:00"`. They are UK local time.
- **Text** is safest in double quotes, and must be quoted if it contains a colon (`:`) or starts with `[`, `{`, `*`, `#` or `@`. To use a double quote inside, write `\"`.
- **Lists** can be written in one line, `tags: [ROS, Python]`, or one item per line starting with `- `.
- **Indentation** matters for nested blocks (like `film:` or `roster:`): use two spaces, never tabs.
- **Paths** to files in `public/` start with `/`: the file `public/media/logs/dalek/new-arm/new.jpg` is written `/media/logs/dalek/new-arm/new.jpg`.
- Lines starting with `#` inside the front matter are comments and are ignored.

The site checks every file when it builds. If a field is missing or has the wrong format, the build stops and tells you the file and the field (see [When something goes wrong](#when-something-goes-wrong)). All allowed fields are defined in `src/content.config.ts`.

### File names become web addresses

The file name (without `.md`) becomes the last part of the page's address: `src/content/events/2026-27/kicad-workshop.md` → `/events/kicad-workshop/`. The year folder is not part of the address, so two events can't share a file name, even in different years (`npm run new` and `npm run check` warn you). Use lower case, digits and hyphens only, and don't rename a file once it has been shared, or old links break. If you do rename one, rename its media folder too.

Some older files have a `slug:` field. It keeps the address the page had on the old website; leave it as it is. New files don't need one.

### Writing the page text

Normal Markdown works: `## Headings`, **bold**, lists, links, `inline code`, code blocks with three backticks, and tables. A few extras:

- Pages with three or more `##` headings get an "On this page" contents list automatically (tutorials, build logs, …).
- Images in the text: `![What the photo shows](/media/logs/dalek/new-arm/new-photo.jpg)`. Photos and videos in the page's media folder that are *not* used in the text appear as a "Photos and video" grid under it, so often you don't need to place them at all.
- Videos in the text: `<video controls preload="none" poster="/media/logs/dalek/new-arm/clip.jpg" src="/media/logs/dalek/new-arm/clip.mp4"></video>`.
- To place pictures with a caption or side by side, use these two patterns and nothing else. Don't use `style="…"`, `align=` or `<center>`: hand-made layouts break in the site's design, and `npm run check` reports them.

  ```html
  <figure>
    <img src="/media/…/photo.jpg" alt="What the photo shows" />
    <figcaption>One picture with a caption underneath.</figcaption>
  </figure>

  <figure>
    <div class="media-row">
      <img src="/media/…/one.jpg" alt="…" width="1600" height="2134" />
      <video controls preload="none" poster="/media/…/clip.jpg" src="/media/…/clip.mp4" width="480" height="852"></video>
    </div>
    <figcaption>Several pictures or videos side by side, all the same height.</figcaption>
  </figure>
  ```

  A row fills the width of the text and lines its pictures up at one height (at most 440 px), so a single portrait video in a row is shown at a sensible size too. For that, every picture and video in a row needs `width` and `height`, its real size in pixels; `npm run check` tells you the right numbers to paste. The caption is optional. Leave an **empty line after each block**, or the next line of Markdown is shown as raw text.
- Start sections with `##` (and `###` below that). The page title is the only `#` heading.
- YouTube: paste the embed code from YouTube's *Share → Embed*. It is shown full width automatically.
- Link to other pages of the site with paths like `[the Dalek](/projects/dalek/)`.

### AI-assisted pages

If a page was mostly drafted with AI tools, add `aiAssisted: true` to its front matter *after a member has checked it*. A note appears under the title, and the page is listed under "About this website" on the About page. On build logs, tutorials and documentation the note also asks readers to check commands before running them on a robot. Works for build logs, tutorials, research, journal posts and events.

---

## Projects and build logs

### A new project

Create `src/content/projects/<id>.md`. The `<id>` becomes the address (`/projects/<id>/`) and is how build-log entries find their project. The text below the front matter is the "Overview" on the project page. Copy `baxter.md` (simple) or `dalek.md` (with 3D models and a homepage card) to start.

| Field | Required | What it does |
| --- | --- | --- |
| `title` | yes | The project's name. |
| `order` | yes | Position on the Projects page and in "Previous / Next project" (1 = first). |
| `status` | yes | `active` (green "Active" chip), `paused` (grey "Paused" chip) or `new` (amber "Just started" chip). |
| `started` | yes | Date the project started, shown as "since Aug 2024". Also sets the order of the homepage robot cards. |
| `tagline` | yes | One or two sentences in the big header of the project page. |
| `summary` | yes | One sentence on the project's card. |
| `tags` | no | Small chips on the project's card, e.g. `[ROS, Python]`. Free text. |
| `filters` | no | Which filter buttons on the Projects page show this project. Choose from `ros`, `electronics`, `humanoid`, `eeg`, `3d`. Other values are ignored; to add a new filter button, add it to `labels` in `src/pages/projects/index.astro`. |
| `stack` | no | "Stack" line in the fact sheet, e.g. `Raspberry Pi, ROS 2`. |
| `seenAt` | no | "Events" line in the fact sheet, e.g. `Freshers Fair, Varsity 2026`. |
| `cover` | no | Picture on the project's card. Without it, `cover.jpg` (or `.png`, `.webp`) in `public/media/projects/<id>/` is used; without either, a "Photo coming soon" placeholder is shown. |
| `coverFit` | no | `cover` (default: fills the card and crops the edges) or `contain` (shows the whole picture on white, good for product shots). |
| `hero` | no | Wide picture behind the header of the project page. Without one, a circuit-grid background is shown. |
| `repo` | no | Link for the "Code on GitHub" button. |
| `gallery` | no | *Extra* folders or files in `public/` to show under "Photos and video", next to the project's own `public/media/projects/<id>/`, e.g. `[media/events/2024-25/daleks-day-out]`. See [Photos and videos](#photos-and-videos). |
| `cad` | no | Where the 3D viewer finds STL files. See [3D models](#3d-models). |
| `roster` | no | The project's card in "Meet the machines" on the homepage. Leave it out to keep the project off the homepage. |

`roster` has these fields:

```yaml
roster:
  eyebrow: Flagship build                  # small green label above the name
  image: /images/site/dalek.jpg            # photo on the card (optional)
  imageFit: cover                          # or contain, as for coverFit
  video: /media/projects/dalek/loop.mp4    # optional short muted loop, played instead of the photo
  specs:                                   # label / value rows on the card
    - ["Base", "Electric wheelchair, DB9 controller"]
    - ["Brains", "Arduino bridge, Raspberry Pi"]
```

Without `image` and `video`, the card shows "Photo coming soon".

### A build-log entry

Create `src/content/logs/<project>/<name>.md`, where `<project>` is the project's id in lower case. It appears in the project's "Build log" timeline, newest first, at `/projects/<project id>/<name>/`.

```markdown
---
title: "Upgrading the electronics"
project: dalek
date: 2024-09-10
excerpt: "One sentence shown in the timeline."
---

Your write-up…
```

| Field | Required | What it does |
| --- | --- | --- |
| `title` | yes | Heading of the entry. |
| `project` | yes | The project's id in **lower case** (the OSRC's file is `osrc.md`, so `project: osrc`). |
| `date` | no | Date of the entry. Leave it out for a reference page that isn't part of the timeline (like "Dalek files"); it then gets a button in the project's fact sheet instead. |
| `excerpt` | no | One sentence under the title in the timeline and the page header. |
| `tags` | no | Free-text tags, e.g. `[Arduino, Relays]` (stored for future use, not shown yet). |
| `aiAssisted` | no | See [AI-assisted pages](#ai-assisted-pages). |

---

## Events, weekly sessions and film nights

### A one-off event

Run `npm run new`, or create `src/content/events/<academic year>/<name>.md` yourself:

```markdown
---
title: "KiCad workshop"
type: "Workshop"
date: 2026-11-12
start: "17:00"
end: "19:00"
location: "Robotics Lab, Applied Science building"
excerpt: "One or two sentences for the events list and the page header."
---

Details, what to bring, …
```

| Field | Required | What it does |
| --- | --- | --- |
| `title` | yes | Name of the event. |
| `type` | yes | One of `Project meeting`, `Project day`, `Workshop`, `Film night`, `Showcase`, `Fair`, `Social`, `Competition`, `Executive` (spelled exactly like this). Use `Executive` for committee business such as executive meetings, EGMs and AGMs. Shown as a label; `Film night` with a `film` block gets the cinema page (below). |
| `date` | yes for one-off events | The day it happens. |
| `start`, `end` | no | Times as `"HH:MM"`. An event counts as upcoming until its `end` (or `start`, or the end of the day). |
| `location` | no | Where it happens. The lab is written `Robotics Lab, Applied Science building`. |
| `excerpt` | no | Short description in lists, "Next up" and the page header. |
| `cover` | no | Picture used when the page is shared (WhatsApp, Discord, …). Usually left out: `cover.jpg` in the event's media folder (`poster.jpg` for a film night) is found automatically. |
| `gallery` | no | Extra folders or files from elsewhere in `public/` to add to the page's photo grid. |
| `bring` | no | "Bring" line on a film night's ticket, e.g. `"Bring your own snacks!"`. |

What happens automatically:

- Until it has ended, the event is listed at the top of the Events page and, if it's the soonest thing on, in the "Next up" bar on the homepage.
- If a one-off event overlaps a weekly session (Project Meeting or Project Day) in time, the one-off event wins: it's shown in "Next up" and listed first on the Events page. The weekly session still appears on the Events page; cancel it as well if it doesn't happen that day.
- Afterwards it moves to the list of past events under its year. The live site rebuilds every morning, but the visitor's browser already sorts by today's date, so it moves at the right moment.
- Every dated event with a `start` time gets an "Add to calendar" file at `/events/<name>.ics` (shown as a button on film nights while they're upcoming).

### Weekly sessions

A regular session (like the Project Meeting) has no `date`. Instead:

```yaml
recurring: weekly
weekday: 1        # 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday
start: "17:00"
end: "19:00"
```

It always shows its next occurrence on the Events page, in "Next up" and on the About page ("Weekly sessions"). To skip a week, see [Cancelled sessions](#cancelling-one-week-of-a-weekly-session).

### Film nights

A film night is an event with `type: "Film night"` plus a `film` block. It gets a cinema-style page (poster, ticket, cast, trailer, more film nights) and appears in the "Film nights" poster row on the Events page. Start it with `npm run new` → *Film night*, and save the poster as `poster.jpg` in its media folder (portrait, about 5:7 like a cinema poster, works best):

```yaml
bring: "Bring your own snacks!"
film:
  title: "The Terminator"              # the film's title (the event title can differ)
  edition: "Extended Edition"          # optional, shown under the title
  year: 1984                           # optional, no quotes
  director: "James Cameron"            # optional
  runtime: "1h 47m"                    # optional
  rating: "R"                          # optional, shown as a small badge
  synopsis: "What the film is about."  # required
  cast:                                # optional, actor and role
    - ["Arnold Schwarzenegger", "The Terminator"]
    - ["Linda Hamilton", "Sarah Connor"]
  trailer: "k64P4l2Wmeg"               # optional: the YouTube video id
```

- The **trailer id** is the part after `v=` in a YouTube link: `https://www.youtube.com/watch?v=k64P4l2Wmeg` → `k64P4l2Wmeg`. The trailer only loads from YouTube when a visitor presses play.
- Use the same **rating** system for every film (so far US ratings: G, PG, PG-13, R).
- Add a **credit** for the poster in `src/data/credits.json` (see [Image credits](#image-credits)).
- The text below the front matter is an optional paragraph about the evening.

---

## Cancelled sessions and notice banners

Banners appear at the top of every page, attached to the navigation bar, and stay visible while scrolling. Visitors can close a banner with ✕; their browser remembers that (until the text of the notice changes).

### Cancelling one week of a weekly session

Add the date to `cancelled:` in the session's file (`weekly-meetup.md` for the Project Meeting, `project-day.md` for the Project Day):

```yaml
cancelled: [2026-11-02]
```

- A **yellow** banner *"No Project Meeting on Monday 2 November. Details →"* appears on every page from **7 days before** until the end of that day. "Details" links to the session's page.
- "Next up", the Events page and the About page skip that week.
- Several dates can be listed: `cancelled: [2026-11-02, 2026-11-30]`.

If something else happens instead, give the date a **note** and a **link**. The note replaces "Details" as the banner's link text:

```yaml
cancelled:
  - date: 2026-11-02
    note: "Mary Poppins film night instead, starting 16:30"
    link: /events/mary-poppins-screening/
  - 2026-11-30
```

Plain dates and dates with a note can be mixed in the same list. Old dates can stay in the list or be removed; they have no effect once they're over.

### Any other announcement

Add an entry to the `notices` list in `src/data/notices.json`:

```json
{
    "_help": "…",
    "notices": [
        {
            "text": "The lab is closed for exams until 20 January.",
            "from": "2027-01-05",
            "until": "2027-01-20",
            "tone": "warning",
            "link": "/events/",
            "linkText": "See events"
        }
    ]
}
```

| Field | Required | What it does |
| --- | --- | --- |
| `text` | yes | The message. Keep it to one sentence. |
| `from` | no | First day the banner is shown (`YYYY-MM-DD`). Without it, it shows straight away. |
| `until` | no | Last day the banner is shown (inclusive). Without it, it stays until you remove it. |
| `tone` | no | The banner's colour: `"info"` (default) is a **green** tint for news and invitations ("Membership is open"); `"warning"` is a **yellow/amber** tint for things that affect plans ("Lab closed", "Meeting moved"). Cancelled sessions always use `warning`. |
| `link` | no | Where the banner's link goes: a page of the site (`/events/`) or a full web address. |
| `linkText` | no | The link's text. Defaults to "More". Only used together with `link`. |

The banner shows on a day in the **visitor's** calendar, so it switches at midnight their time. Several banners stack, cancellations first. Remove old notices from the file once they've expired, to keep it tidy.

> JSON is stricter than front matter: every text needs double quotes, and entries in a list are separated by commas, with no comma after the last one.

---

## Tutorials, journal posts and research

### A tutorial

Create `src/content/tutorials/<name>.md`. Use `##` headings for the steps; with three or more, the page gets a contents list.

| Field | Required | What it does |
| --- | --- | --- |
| `title` | yes | Title of the tutorial. |
| `date` | yes | Last updated, shown as "Updated". Newest tutorials are listed first. |
| `excerpt` | yes | One or two sentences on the card and in the header. |
| `level` | yes | `Beginner`, `Intermediate` or `Advanced`. |
| `duration` | yes | Free text, e.g. `"About 60 minutes"`. |
| `needs` | no | What people need, shown as "You need". |
| `session` | no | The workshop it comes from, e.g. `"Give It A Go"` → "Tutorial · Give It A Go session". |
| `cover` | no | Picture on the card. Without it, `cover.png` (or `.jpg`) in `public/media/tutorials/<name>/` is used. |
| `tags` | no | The first tag is the card's category label; the first two are shown as chips. |

### A journal post

Create `src/content/journal/<academic year>/<name>.md` (or run `npm run new`) for stories from events, fairs and the lab. Posts are listed newest first and have "Previous / Next" links. Photos and videos in its media folder appear as a grid under the text.

| Field | Required | What it does |
| --- | --- | --- |
| `title` | yes | Title of the post. |
| `date` | yes | Date of the post. |
| `excerpt` | no | One sentence in the list and the header. |
| `cover` | no | Thumbnail in the Journal list, and picture when shared. Usually left out: `cover.jpg` in the post's media folder is found automatically. Set it to use a picture from somewhere else. |
| `gallery` | no | Extra folders or files from elsewhere in `public/` to add to the photo grid. |
| `eventType` | no | Also lists the post among the past events on the Events page, with this label: `Showcase`, `Fair`, `Social`, `Competition` or `Workshop`. Without it, the post is labelled "Blog" and appears only in the Journal. |

### A research article

Create `src/content/research/<area>/<name>.md` with `title`, `area` (the folder name, e.g. `neuro`), `date` and `excerpt`. The article appears under its area on the Research tab of the Projects page.

Each area is described once in `src/data/research-areas.json`. The key (e.g. `"neuro"`) must match the folder name and `area:`:

| Field | What it does |
| --- | --- |
| `title` | Name of the area, e.g. "Neuro Robotics". |
| `status` | Chip next to the title, e.g. "Ongoing". |
| `summary` | One or two sentences about the area. |
| `image` | Picture on the left of the area's card. |
| `tags` | Chips, e.g. `["EEG", "Neuroscience"]`. |
| `usedIn` | "Used in" links to related pages: `[{ "label": "Dalek: mind control", "href": "/projects/dalek/dalek-mind-control/" }]`. |

---

## Photos, videos and 3D models

### Photos and videos

Each page's photos and videos go in its media folder (see [Where files go](#where-files-go)), and are linked with a path starting with `/` (without `public`).

**Shrink files before committing them.** Phone photos are often 3–6 MB and slow the site down; GitHub refuses files over 100 MB. With [ffmpeg](https://ffmpeg.org) installed, run:

```bash
python scripts/optimise-media.py public/media/journal/2026-27/varsity-2027
```

You can pass a folder or single files. It scales photos to at most 1600 px wide, re-encodes videos to MP4 (at most 1280 px) and creates a preview image for each video with the same name (`clip.mp4` → `clip.jpg`). It changes the files in place and can be run again safely.

**Galleries fill themselves.** Every photo (`.jpg`, `.jpeg`, `.png`, `.webp`) and video (`.mp4`) in a page's media folder appears in a "Photos and video" grid on that page, sorted by file name, with `cover.*` first; subfolders are included. Photos open full size when clicked. A few files are left out of the grid:

- files the page already shows: pictures used in the text, and a project's `hero` and homepage card picture;
- `poster.*` (film posters are shown on the film night page itself);
- a `.jpg` with the same name as an `.mp4`, which is used as that video's preview.

To show pictures that belong to another page as well, add `gallery:` with folders or single files, e.g. `gallery: [media/events/2024-25/daleks-day-out, media/journal/2025-26/varsity-2026/dalek-dance.mp4]`. Prefer the grid over `<video>` tags in the text: it shows each video's preview image and opens photos full size.

The homepage photo collage is set in `src/data/home.json`: three columns, each a list of photos with `src`, `alt` (a description for screen readers) and `caption`.

### Image credits

Photos without a credit are treated as the society's own. To credit a photographer or another source, add an entry to `src/data/credits.json`:

```json
{ "path": "/media/journal/2025-26/varsity-2026/", "credit": "Photos: Jane Doe", "link": "https://instagram.com/janedoe", "licence": "CC BY 4.0", "note": "Used with permission" }
```

| Field | Required | What it does |
| --- | --- | --- |
| `path` | yes | One file (`/media/events/2024-25/klaus-screening/poster.jpg`) or a whole folder ending in `/` (`/media/journal/2025-26/varsity-2026/`), which covers everything inside it. If several entries match, the most specific one wins. |
| `credit` | yes | The text shown on the photo, e.g. "Photos: Jane Doe" or "Poster © Netflix". |
| `link` | no | Makes the credit a link (e.g. to the photographer's page). |
| `licence` | no | Added after the credit, e.g. "CC BY 4.0". |
| `note` | no | Only shown in the list on the About page, e.g. "Used to promote our screening". |

The credit is shown in the corner of the photo (galleries and their full-size view, project headers, film posters, homepage cards and collage, project cards) and listed under "About this website" on the About page.

### 3D models

A project's page gets an "Explore the CAD" 3D viewer when its front matter has a `cad` block:

```yaml
cad:
  repo: Hull-Robotics-Society/Dalek        # GitHub repository (owner/name)
  branch: main                             # optional, main by default
  folders: ["[01] 3D Models", "[02] Electronics"]   # folders in that repository, exactly as on GitHub
  names:                                   # optional nicer names: file name without .STL → name
    dalekcentre: Centre section
    pcb mount: PCB mount
  groups:                                  # optional filter labels: folder → label
    "[01] 3D Models": Body
    "[02] Electronics": Electronics
```

- Every `.stl` file directly in those folders (not in subfolders) appears in the viewer, straight from GitHub, each time the site is built. To add a part, export it as **STL in millimetres** into one of the folders and push it to that repository; it appears on the next build of the website.
- Parts listed under `names` come first, in that order, with that name. The names must match the file name exactly, without `.STL`. Other parts get a name made from their file name.
- With more than one group, filter chips (All / Body / Electronics …) appear above the parts.
- SolidWorks files (`.SLDPRT`, `.SLDASM`) can't be shown in a browser; export them to STL first.
- If GitHub can't be reached during a build, the viewer is left out of that build (the build doesn't fail).

---

## Site-wide settings

| File | What's in it |
| --- | --- |
| `src/data/site.json` | Society name, email, links (Union page, merch in the Union shop, Discord, Instagram, GitHub, YouTube; leave `youtube` empty to hide that line on the About page), lab name, address, map link, and the GitHub repository and branch used for "Edit this page on GitHub". |
| `src/data/committee.json` | The Executive Team on the About page, see [below](#the-executive-team). |
| `src/data/notices.json` | Notice banners, see [above](#any-other-announcement). |
| `src/data/credits.json` | Image credits, see [above](#image-credits). |
| `src/data/research-areas.json` | Research areas, see [above](#a-research-article). |
| `src/data/home.json` | Homepage photo collage. |

### The Executive Team

`src/data/committee.json` lists the committee shown on the About page, in the order given:

```json
{
    "year": "2026–27",
    "source": "https://www.instagram.com/hull_rs/p/…",
    "members": [
        { "name": "Reece", "role": "President", "about": "One formal sentence.", "robot": "Sophia" },
        { "role": "Vice President", "vacant": true }
    ]
}
```

| Field | What it does |
| --- | --- |
| `year` | Shown under the heading, e.g. "2026–27". |
| `source` | Optional link to the announcement post ("Meet the committee on Instagram"). |
| `name`, `role` | Shown on the card. Keep `role` spelled the same way each year, because the photo is found by it (below). |
| `about` | One formal sentence, e.g. course and year. |
| `robot` | Optional "Favourite robot" line. |
| `vacant` | `true` for an open role: the card shows "Vacant" and invites people to get in touch. `name`, `robot` and the photo are then ignored; `about` replaces the default invitation text if you want your own. |
| `photo` | Optional path to a picture somewhere else; overrides the automatic one. |

**Profile pictures are picked up automatically.** Put a picture named after the role in `public/images/committee/`: lower case, spaces become hyphens, as `.jpg`, `.jpeg`, `.png` or `.webp`:

| Role | File |
| --- | --- |
| President | `public/images/committee/president.jpg` |
| Vice President | `public/images/committee/vice-president.jpg` |
| Treasurer | `public/images/committee/treasurer.jpg` |
| Project Manager | `public/images/committee/project-manager.jpg` |

Use a square photo of the face, about 400×400 px (it's shown as a small circle). Without a picture, the card shows the person's first initial. When a new committee is elected, replace the files and update the names in `committee.json`. The section is hidden while `members` is empty.

The footer note about AI tools and the "About this website" section are in `src/components/Footer.astro` and `src/pages/about.astro`.

---

## Running and testing it locally

You need [Git](https://git-scm.com) and [Node.js](https://nodejs.org) 22.23.4 or newer (the current LTS version is fine). Open a terminal in the project folder; the first time, install the dependencies:

```bash
npm install
```

**While editing:**

```bash
npm run dev
```

Open <http://localhost:4321>. Every time you save a file, the page updates within a second. Stop it with Ctrl+C. Search doesn't work in this mode (its index is only made by a full build).

**To see exactly what will go online, including search:**

```bash
npm run build
```

```bash
npm run preview
```

`npm run build` creates the finished site in `dist/`, `npm run preview` shows it at <http://localhost:4321>. After further changes, stop it and run both again.

If a banner doesn't show up while testing, you may have closed it earlier: open the page in a private window.

### Checking your changes

```bash
npm run check
```

Looks over all content and media in a few seconds, without building the site. **Errors** need fixing before you publish:

- `TODO`s or other placeholder text left from a template;
- links to pictures or videos that don't exist in `public/`;
- two events or journal posts with the same file name (they would share one address);
- a film night without a poster.
- a code block in a language the highlighter doesn't know (write ` ```cpp ` for Arduino sketches, ` ```text ` for plain output).

**Warnings** are worth a look: an event or post in the wrong academic-year folder, media that no page uses (often left behind when a page was renamed or deleted), photos over 1 MB or videos over 25 MB, videos without a preview image, and film posters without a credit.

---

## Publishing

The live site is built and published by GitHub Actions (`.github/workflows/deploy.yml`) whenever something is pushed to the **`gh-pages`** branch. It takes about two minutes; progress is shown under the repository's **Actions** tab.

- The repository's **Settings → Pages → Source** must be set to **GitHub Actions**.
- The workflow also rebuilds the site every morning at 05:00 UTC, which keeps the past/upcoming event lists in sync. GitHub only runs scheduled workflows from the repository's **default branch**, so set **Settings → General → Default branch** to `gh-pages` (or this daily rebuild won't happen).
- It can also be started by hand: **Actions → Deploy website → Run workflow**.

A good way to work: make changes on your own branch, open a pull request into `gh-pages`, and let someone else look at it before merging. The pull request doesn't publish anything; merging does.

---

## When something goes wrong

- **The build stops with an error about a field** (it names the file and a field such as `type` or `date`): usually it's a typo in an allowed value (they must be spelled exactly as listed above, including capitals), a date not written as `YYYY-MM-DD`, or a missing required field.
- **`YAMLException` / "bad indentation"**: something in the front matter isn't valid. Check quotes (text with a colon needs them) and indentation (two spaces, no tabs).
- **`Unexpected token` in a `.json` file**: a missing comma between entries, a comma after the last entry, or text without double quotes.
- **A photo doesn't show**: run `npm run check`, which lists broken paths. Check that the path starts with `/`, doesn't include `public`, and matches the file name exactly. Upper and lower case matter on the live site, even if they don't on Windows. A photo in a page's media folder only appears automatically if the folder has exactly the same path as the Markdown file.
- **A page didn't move from "upcoming" to "past"**: the browser sorts by today's date, so reload. The live site also rebuilds every morning.
- **`npm` is not recognised**: Node.js isn't installed, or the terminal was opened before it was installed. Open a new terminal.

---

## Layout of the code

```
src/content/            Markdown content (see above)
src/content.config.ts   Which fields each kind of content has and which values are allowed
src/data/               Site-wide settings, committee, notices, credits, research areas, homepage collage
src/pages/              One file per page type; [brackets] are generated for every entry
src/components/         Header, notices, search, roster, 3D viewer, photo grid, film night page, …
src/layouts/            Page frame (Base) and long-form article layout
src/lib/, src/scripts/  Helpers for content (galleries, credits, CAD) and browser scripts (events, 3D viewer)
src/styles/             Design tokens and styles (light theme by default, dark via the toggle)
public/media/           Photos and videos, one folder per page (same path as its Markdown file)
public/images/          Design files (site/) and committee photos (committee/)
templates/              Starting points used by npm run new
scripts/                new.mjs (npm run new), check.mjs (npm run check), optimise-media.py for new media;
                        migrate-content.py was used once to move from Jekyll
```
