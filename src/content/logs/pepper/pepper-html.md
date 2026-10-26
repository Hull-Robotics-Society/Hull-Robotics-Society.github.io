---
title: "Web apps on Pepper's tablet"
slug: pepper/pepper-HTML
project: pepper
date: 2026-10-12
excerpt: "Building and testing HTML pages for the tablet on Pepper's chest."
aiAssisted: true
---
**Repository:** [reeceherbert887/Pepper_Stuff](https://github.com/reeceherbert887/Pepper_Stuff)  
**Target directory:** [`html_pepper`](https://github.com/reeceherbert887/Pepper_Stuff/tree/main/html_pepper)  
**Expected Ubuntu location:** `~/repos/Pepper_Stuff/html_pepper`  
**Prepared:** 12 October 2026  
**Document type:** Technical guide, source-inspection manual and verification checklist  
**Status:** **Partial source verification — project-specific functionality unconfirmed**  
**Relevant platform:** SoftBank Robotics Pepper, NAOqi, Choregraphe and web technologies **where present in the folder**

> **Important evidence note:** `html_pepper` was identified as a separate top-level directory of the `Pepper_Stuff` repository in the earlier repository review. During this documentation pass, the public GitHub directory listing and raw source could not be retrieved, and a fresh `git clone` could not be made from the documentation environment. **I have not inspected the files inside `html_pepper`.** The exact filenames, contents, appearance, number of pages, interaction model and relationship to Choregraphe are therefore **not verified**. The HTML/JavaScript/NAOqi examples in this guide are **reference implementations, not extracts from `html_pepper`**. This is deliberately different from claiming the folder implements the Freshers quiz, dances or any other feature without evidence.

---

## Contents

1. [Purpose and evidence status](#1-purpose-and-evidence-status)
2. [Scope and relationship to other projects](#2-scope-and-relationship-to-other-projects)
3. [First-time inspection on Ubuntu](#3-first-time-inspection-on-ubuntu)
4. [Creating a repeatable source inventory](#4-creating-a-repeatable-source-inventory)
5. [Understanding the technology layers](#5-understanding-the-technology-layers)
6. [Typical web application structure](#6-typical-web-application-structure)
7. [HTML and navigation review](#7-html-and-navigation-review)
8. [CSS and Pepper tablet compatibility](#8-css-and-pepper-tablet-compatibility)
9. [JavaScript and application state](#9-javascript-and-application-state)
10. [NAOqi, QiSession and ALMemory](#10-naoqi-qisession-and-almemory)
11. [Connecting a tablet interface to Choregraphe](#11-connecting-a-tablet-interface-to-choregraphe)
12. [Images, audio, video and other assets](#12-images-audio-video-and-other-assets)
13. [Running and previewing locally](#13-running-and-previewing-locally)
14. [Deploying and opening content on Pepper](#14-deploying-and-opening-content-on-pepper)
15. [Testing strategy and checklist](#15-testing-strategy-and-checklist)
16. [Debugging and troubleshooting](#16-debugging-and-troubleshooting)
17. [Security, safety and accessibility](#17-security-safety-and-accessibility)
18. [Code quality and maintenance](#18-code-quality-and-maintenance)
19. [GitHub maintenance and reproducibility](#19-github-maintenance-and-reproducibility)
20. [Evidence to collect for a fully verified revision](#20-evidence-to-collect-for-a-fully-verified-revision)
21. [Worked reference example — not project code](#21-worked-reference-example--not-project-code)
22. [Glossary and useful references](#22-glossary-and-useful-references)

---

## 1. Purpose and evidence status

The repository has a directory called **`html_pepper`**, suggesting a connection to HTML content used in the wider Pepper workspace. A directory name alone, however, does not prove that it is a self-contained application, that it is deployed to Pepper's tablet, or that it has a particular user interface. This document serves two immediate purposes: it gives a technically useful guide for assessing an HTML-based Pepper project, and it records exactly what still has to be checked against the source before project-specific claims can be made.

### 1.1 What is known

| Assertion | Evidence status |
|---|---|
| User's repository is `reeceherbert887/Pepper_Stuff` | Provided by repository URL |
| `html_pepper` was listed at repository root during prior review | Previously observed directory name |
| Local checkout is in `~/repos/Pepper_Stuff` | User-provided workspace location |
| Exact files inside `html_pepper` | **Unverified** |
| Whether `index.html` exists | **Unverified** |
| Whether the folder has CSS, JavaScript or QiMessaging | **Unverified** |
| Whether the folder is used by Pepper-Freshers or Robo Grad | **Unverified** |
| Whether the folder runs on Pepper hardware | **Not tested** |

### 1.2 What the guide does not assert

This guide does **not** assert that `html_pepper` has an interactive quiz, dance selector, specific ALMemory keys, sensor triggers, QR page, Choregraphe file or a working robot connection. Those behaviours were documented in *other* Pepper projects, and should not be transferred here unless the source proves the relationship.

### 1.3 How to turn this into definitive project documentation

Run the source-inventory commands in sections 3–4 on the checked-out directory. Use the resulting file list, actual function names, screen IDs, asset paths, Git commit and screenshots to replace the provisional sections of this guide. Keep a distinction between features that exist in code, features that were manually tested, and proposed changes.

---

## 2. Scope and relationship to other projects

The following related projects are documented independently:

| Project | Verified or documented focus | Relationship to `html_pepper` |
|---|---|---|
| `Pepper-Freshers` | Interactive tablet quiz, demo menu and Choregraphe-triggered robot activities | **Potentially related**, but shared files or imports must be checked |
| `Refreshers 1/Refreshers` | Touch-controlled Choregraphe interactions and robot multimedia | No verified direct connection |
| `Robo Grad` | University presentation project area | No verified direct connection |
| `Pepper-Documentation` | Documentation directory | May contain general setup context; not inspected for this guide |
| `html_pepper` | Subject of this document | Actual purpose and implementation to verify |

It is common for a robotics repository to contain prototype interfaces, exported tablet files, reusable web assets and complete Choregraphe packages side by side. They are **not automatically a single system**. Verify whether HTML is embedded within a `.pml` package, opened by `ALTabletService`, served from a local HTTP server, or retained only as a development prototype.

### 2.1 Questions to resolve from the code

- Is the folder a website, a Pepper tablet app, a design mock-up, an archived version or a collection of assets?
- Which file acts as the entry page, if any?
- Which scripts are loaded, and in what order?
- Does JavaScript use `QiSession`, `qimessaging.js`, `fetch`, WebSockets or no robot API?
- Does any Choregraphe project reference this folder by path?
- Can it be used in a normal desktop browser without a robot?
- Which elements of the interface can make the physical robot move, speak or play media?

---

## 3. First-time inspection on Ubuntu

These commands are **read-only**, except where a report is expressly written into `/tmp` later in the guide. They do not alter the project.

### 3.1 Enter the folder

```bash
cd ~/repos/Pepper_Stuff
pwd
git status --short
git branch --show-current

cd html_pepper
pwd
ls -lah
```

If `cd html_pepper` fails, check case and spelling from the repository root:

```bash
cd ~/repos/Pepper_Stuff
find . -maxdepth 2 -type d -iname '*html*' -print
```

Linux directory names are case-sensitive. Do not rename folders until you have checked imports and paths that may rely on the existing name.

### 3.2 Get a full list of local source files

```bash
cd ~/repos/Pepper_Stuff/html_pepper
find . -type f -not -path '*/.git/*' | sort
```

For a shorter two-level overview:

```bash
find . -maxdepth 2 -type f | sort
```

### 3.3 Check the overall size and identify large assets

```bash
du -sh .
du -ah . | sort -h | tail -n 25
```

A large project can still have only a small amount of source code; large video, audio and images should be documented as assets rather than confused with executable logic.

### 3.4 Find web and Pepper-related files

```bash
find . -type f \( \
  -iname '*.html' -o -iname '*.htm' -o \
  -iname '*.js' -o -iname '*.css' -o \
  -iname '*.json' -o -iname '*.pml' -o \
  -iname '*.xar' -o -iname '*.py' \) | sort
```

No matches for a particular extension **does not necessarily mean a project is broken**; it may be a static media directory or include files under different extensions.

### 3.5 Record Git provenance

```bash
cd ~/repos/Pepper_Stuff

git rev-parse HEAD
git log -1 --date=iso-strict --format='%h %ad %s'
git log --date=iso-strict --format='%h %ad %s' -- html_pepper
```

Add the latest commit hash to this documentation after the source is available. **Commit history does not prove that code successfully ran on the robot.**

---

## 4. Creating a repeatable source inventory

A durable documentation record should include the source tree, links between scripts and pages, assets, robot API calls, and any runnable project definitions.

### 4.1 Produce a plain-text report

```bash
PROJECT="$HOME/repos/Pepper_Stuff/html_pepper"
REPORT="/tmp/html_pepper_inventory.txt"

{
  printf 'Project: %s\n' "$PROJECT"
  printf 'Generated: '
  date --iso-8601=seconds
  printf '\nFILES\n'
  find "$PROJECT" -type f | sort
  printf '\nDISK USAGE\n'
  du -sh "$PROJECT"
  printf '\nEXTENSIONS (approximate)\n'
  find "$PROJECT" -type f -name '*.*' \
    | sed 's/.*\.//' | tr '[:upper:]' '[:lower:]' \
    | sort | uniq -c | sort -nr
} > "$REPORT"

cat "$REPORT"
```

This report lists **filenames**, so review it for sensitive or private material before sharing. Do not automatically upload hidden credentials, personal information, or access tokens.

### 4.2 Discover entry points

```bash
cd ~/repos/Pepper_Stuff/html_pepper
find . -type f \( -iname 'index.html' -o -iname 'main.html' \
  -o -iname 'README*' -o -iname 'package.json' \
  -o -iname '*.pml' \) | sort
```

Check any candidate HTML page for linked resources:

```bash
grep -RInE '<(script|link|img|video|audio)|<iframe' . \
  --include='*.html' --include='*.htm' | head -n 150
```

This lists references in text; it does not validate that referenced files exist or are loadable.

### 4.3 Search for behaviour and robot API integrations

```bash
grep -RInE \
  'QiSession|ALMemory|ALTabletService|ALTextToSpeech|ALMotion|ALBehaviorManager|raiseEvent|subscriber|qimessaging' \
  . --include='*.js' --include='*.html' --include='*.py' \
  --include='*.xar' --include='*.pml' || true
```

Absence of matches is evidence only that **these strings** were not found in the searched text files. Integration might be hidden in an external service or in a separate project.

### 4.4 Identify screens, actions and asset routes

```bash
grep -RInE 'id=|onclick=|addEventListener|location\.|window\.onload|window\.addEventListener' . \
  --include='*.html' --include='*.js' | head -n 200
```

For a final code audit, produce a table like this:

| File | Function/element | Called by | Calls/changes | Robot involvement | Tested? |
|---|---|---|---|---|---|
| **To verify** | **To verify** | **To verify** | **To verify** | **To verify** | No |

The first version of this table should come from actual code, not plausible filenames or assumptions.

---

## 5. Understanding the technology layers

A Pepper web interface commonly spans several components. **The following is a conceptual architecture and not proof of the architecture in `html_pepper`.**

```text
Person using interface
          |
          v
Web page or Pepper tablet
(HTML / CSS / JavaScript)
          |
          | optional: QiMessaging / QiSession
          v
NAOqi services
(ALMemory, ALTabletService, etc.)
          |
          | optional: event subscription
          v
Choregraphe behaviour / Python box
          |
          v
Robot speech, motion, LEDs and media
```

### 5.1 HTML

HTML defines the semantic structure of screens, menus, buttons, text, accessible labels, embedded images, audio and video. A page can be a purely visual demonstration with **no** robot integration.

### 5.2 CSS

CSS controls positioning, colours, sizes, visibility and responsiveness. For Pepper, touch accuracy and readability often matter more than decorative animations. Test against the tablet's actual browser and firmware instead of assuming support for modern desktop-browser features.

### 5.3 JavaScript

JavaScript controls navigation, input validation, timers, media events and potentially robot-service calls. In a real deployment, the JavaScript runtime may differ from a contemporary Firefox or Chrome desktop browser.

### 5.4 NAOqi and Choregraphe

NAOqi provides robot services such as speech, tablet presentation and memory/event messaging. Choregraphe builds and runs behaviour graphs. Neither is automatically required merely because a folder is named `html_pepper`; confirm the real dependency chain.

---

## 6. Typical web application structure

**Illustration only — not a discovered directory tree:**

```text
html_pepper/
├── index.html                 # Possible entry page
├── style.css                  # Possible styles
├── script.js                  # Possible JavaScript logic
├── assets/
│   ├── logo.png
│   ├── demo.mp4
│   └── sound.ogg
└── README.md
```

The actual folder may contain one file, many nested pages, or an entirely different naming scheme. Generate the real tree with `find` before changing file paths or documenting module boundaries.

### 6.1 Why relative paths matter

A relative reference like `assets/logo.png` resolves relative to the document URL. An absolute URL path like `/assets/logo.png` resolves from the web server root. This difference frequently causes pages to display correctly on Ubuntu while failing from Pepper's tablet, or vice versa.

### 6.2 File names and spaces

URL-encoding and case sensitivity matter. `Dance Song.ogg`, `dance song.ogg` and `Dance%20Song.ogg` are not universally interchangeable. Preserve exact spelling in documentation and test the final URL rather than only checking the local filename.

---

## 7. HTML and navigation review

For **each actual HTML file**, record:

1. Page title and purpose.
2. External and local scripts loaded.
3. CSS stylesheets and font dependencies.
4. Screens or sections shown to the visitor.
5. Buttons, links, forms and gestures.
6. Whether actions are handled by inline `onclick` or JavaScript listeners.
7. Image, video and audio references.
8. The expected destination when Back, Home, Restart or Stop is pressed.
9. Whether the page starts any robot-side action.
10. Whether all controls work after repeating a workflow.

A useful **illustrative** navigation flow is:

```text
Home
  ├── Demonstration A -> Running -> Return
  ├── Demonstration B -> Running -> Return
  └── Information -> Home
```

This is **not** the confirmed flow of `html_pepper`. Its real navigation graph should be derived from the HTML IDs and JavaScript event handlers.

### 7.1 Semantic controls

Prefer genuine `<button type="button">` elements for actions and `<a href="...">` for navigation. Using noninteractive `<div>` elements for controls can make keyboard access and screen-reader use more difficult. Always give informative images `alt` text and avoid relying on colour alone to indicate state.

### 7.2 Button state and double taps

A visitor may tap twice because speech or animation does not start immediately. A robust interface should show a `RUNNING` state, prevent duplicate robot actions while busy, and offer a stop/cancel route that actually reaches the robot where needed.

---

## 8. CSS and Pepper tablet compatibility

When reviewing the real CSS, check page width, overflow, safe touch targets and text contrast. Avoid declaring any particular tablet resolution as a guaranteed platform value without verifying the actual robot/browser combination.

### 8.1 Example responsive baseline — not project CSS

```css
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: Arial, sans-serif;
  line-height: 1.4;
}
.page {
  max-width: 100%;
  min-height: 100vh;
  padding: 1rem;
}
button {
  min-height: 3rem;
  min-width: 3rem;
  padding: .7rem 1rem;
  cursor: pointer;
}
img, video { max-width: 100%; height: auto; }
```

The CSS above is a starting point for a newly built interface; it does **not** replace testing on the original Pepper tablet. Feature support can be limited by the tablet's embedded browser.

### 8.2 Practical checks

- Are buttons large enough for visitors to hit reliably?
- Is any important content below the fold with no obvious scroll affordance?
- Do fixed-position controls overlap other elements?
- Do full-screen images retain their intended aspect ratios?
- Are media playback controls visible and usable?
- Is text readable under bright exhibition lighting?
- Does the interface survive rotation, reload and loss of connection?

---

## 9. JavaScript and application state

A useful way to document web application code is to separate **navigation state**, **presentation state** and **robot execution state**.

| State | Example value | Meaning |
|---|---|---|
| Navigation | `home`, `menu`, `playing` | Which page or section is visible |
| Media | `stopped`, `loading`, `playing`, `error` | What the browser's audio/video is doing |
| Robot | `idle`, `running`, `stopping`, `fault` | What the physical robot is expected to be doing |

These states can diverge. Hiding a browser video does not necessarily stop Pepper's motors, animation, or speech. Conversely, a robot-side behaviour ending does not guarantee a browser automatically returns to the menu.

### 9.1 Example state transition — illustrative

```javascript
var appState = {
  screen: "home",
  robotState: "idle",
  activeAction: null
};

function setScreen(screenName) {
  appState.screen = screenName;
  // Update visible HTML elements here.
}
```

This snippet is a demonstration of separation of concerns; it is **not** a quote from this repository folder.

### 9.2 Risks to look for in the real code

- Globals that are written in several different functions.
- A timer still running after the user returns to Home.
- Multiple `QiSession` connections created on each tap.
- Duplicate `ALMemory` subscriptions after the page reloads.
- Missing `.catch(...)` on asynchronous service calls.
- Automatic video playback blocked by browser policy.
- A Back button changing the screen but leaving sound or robot motion active.
- Hard-coded IP addresses no longer matching the robot.

For each identified risk, cite the actual filename and line number before declaring it a defect.

---

## 10. NAOqi, QiSession and ALMemory

**This section applies only if `html_pepper` uses Pepper's NAOqi JavaScript integration.** The verified `Pepper-Freshers` project uses `QiSession` and `ALMemory`; this is background for recognising similar patterns, **not evidence of their presence here**.

### 10.1 Conceptual event exchange

```text
Tablet button
  -> JavaScript callback
    -> ALMemory.raiseEvent('Example/Start', 'demo_a')
      -> Robot-side subscriber / Choregraphe box
        -> Robot action
```

A complementary completion event may travel in the other direction:

```text
Robot sequence ends
  -> ALMemory.raiseEvent('Example/Finished', 'demo_a')
    -> Tablet subscriber
      -> browser returns to menu
```

Names beginning `Example/` are **invented example keys**. Do not treat them as keys currently used by `html_pepper`.

### 10.2 Typical QiSession call — reference code only

```javascript
function requestExampleAction(actionId) {
  if (typeof QiSession === "undefined") {
    console.log("NAOqi bridge unavailable; local preview only.");
    return;
  }

  QiSession(function (session) {
    session.service("ALMemory").then(function (memory) {
      memory.raiseEvent("Example/Start", actionId);
    }).catch(function (err) {
      console.error("ALMemory not available:", err);
    });
  });
}
```

The precise bridge-loading method depends on the NAOqi/tablet runtime. A desktop browser will not automatically contain a `QiSession` global. **Do not expose NAOqi services to untrusted websites or unrestricted networks.**

### 10.3 Confirming real event names

Use the `grep` command from section 4.3, then produce a table:

| Event string from code | Publisher file/function | Subscriber file/box | Payload type | Result |
|---|---|---|---|---|
| **To be extracted** | **To verify** | **To verify** | **To verify** | **To verify** |

Preserve exact capitalisation and punctuation when documenting ALMemory event keys. A mismatch will silently break event routing in many setups.

---

## 11. Connecting a tablet interface to Choregraphe

A website cannot normally make Pepper execute a Choregraphe box just by displaying a new page. The application needs a defined communication path such as NAOqi memory events or another service provided by the deployment.

### 11.1 What to check

1. Open the actual Choregraphe package **if one is referenced by this folder**.
2. Identify its `.pml`, `manifest.xml`, entry behaviour and main `.xar` graph.
3. Find any Python boxes subscribing to the same event keys raised by JavaScript.
4. Verify the exact payload values and their case.
5. Confirm that boxes have a completion and stop/reset route.
6. Check whether two actions can start simultaneously.
7. Verify that media resources are declared and transferred with the Choregraphe package.

### 11.2 Distinguish a completed sequence from a stopped one

An `onStopped` output may occur after normal completion, cancellation or failure depending on the box. Keep explicit application-level states if the UI needs to tell these outcomes apart. A completed dance returning to its menu is different from an emergency interruption.

### 11.3 Safe extension pattern

For a new action, define the tablet ID, the robot event key, the accepted payload, the target behaviour, what counts as completion, what happens on timeout, and how to stop it. Write this down **before** adding a new button. The corresponding control diagram and event table should be part of the final verified guide.

---

## 12. Images, audio, video and other assets

### 12.1 Find actual assets

```bash
cd ~/repos/Pepper_Stuff/html_pepper
find . -type f \( \
  -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o \
  -iname '*.svg' -o -iname '*.gif' -o -iname '*.ogg' -o \
  -iname '*.wav' -o -iname '*.mp3' -o -iname '*.mp4' -o \
  -iname '*.webm' \) | sort
```

### 12.2 Check file types and metadata

```bash
find . -type f \( -iname '*.mp4' -o -iname '*.ogg' -o \
  -iname '*.png' \) -print0 | xargs -0 -r file
```

Where `ffprobe` is installed:

```bash
find . -type f -iname '*.mp4' -print0 | while IFS= read -r -d '' f; do
  echo "--- $f"
  ffprobe -v error -show_entries \
    format=duration,size:stream=codec_name,width,height \
    -of default=noprint_wrappers=1 "$f"
done
```

### 12.3 Create an asset register

| Asset path | Used on page | Purpose | Format | Loaded on tablet? | Rights reviewed? |
|---|---|---|---|---|---|
| **To inventory** | **To verify** | **To verify** | **To verify** | No | No |

### 12.4 Common playback failures

- Video is present but the codec is unsupported on the embedded tablet browser.
- A filename differs in case or spacing from the JavaScript URL.
- A file exists in the Git checkout but was not packaged or served to Pepper.
- Browser autoplay restrictions prevent unmuted media from starting.
- The media file is large enough to cause long load times or failed transfers.
- A video element is hidden while its audio continues playing.

For copyrighted music and clips, having the file locally does not automatically mean it can be redistributed through a public GitHub repository or used in a public show. Verify licensing and event permissions.

---

## 13. Running and previewing locally

This section describes **how to preview static HTML if the folder contains a valid entry page**. It does not prove that `html_pepper` works without Pepper.

### 13.1 Locate the entry page

```bash
cd ~/repos/Pepper_Stuff/html_pepper
find . -type f -iname '*.html' | sort
```

If `index.html` exists in the folder root:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/` in Firefox, then press **Ctrl+C** in the terminal to stop the server. If the actual entry page is in a subdirectory, open its URL accordingly.

### 13.2 Why a server helps

Opening a file directly as `file:///...` is convenient for simple layouts but may cause local-fetch, path or CORS restrictions. A basic local HTTP server more closely simulates the way browser assets are retrieved. It **does not** supply Pepper's QiMessaging bridge or NAOqi services.

### 13.3 Browser-only checks

Verify that the initial page appears, all links resolve, controls can be clicked, media loads, and no critical JavaScript exceptions occur. A mock or fallback mode may be necessary for controls that normally talk to Pepper; mark those controls *not robot-tested*.

### 13.4 Development tools

In Firefox, use **F12 → Console** to inspect errors and **Network** to locate 404 requests. Network logs distinguish a missing file from a JavaScript crash. Check the **Responsive Design Mode** to identify likely layout issues, then re-test on the actual robot.

---

## 14. Deploying and opening content on Pepper

**Choose the deployment path based on the real project files and robot firmware.** No single deployment method can be asserted for `html_pepper` yet.

### 14.1 Path A — HTML bundled in a Choregraphe package

If the page is part of a `.pml` package, open that package in Choregraphe, confirm the HTML and media resources are listed, and use the project's intended tablet-opening box or script. If the resources are absent from the package manifest, they may not be available after deploying to the robot.

### 14.2 Path B — browser served from another host

If your tested robot supports `ALTabletService.showWebview()` and can reach a trusted local web server, the page can sometimes be opened by URL. Test robot network connectivity, host address, URL, permissions and browser compatibility. A server bound to `127.0.0.1` on your laptop **cannot** be reached from Pepper; using a LAN binding requires a trusted network and suitable firewall controls. Do not make robot-control pages public on the internet.

### 14.3 Path C — standalone website or mock-up

If no robot API calls or deployment references exist, treat `html_pepper` as a conventional web prototype unless further evidence establishes robot integration. Document its UX and assets without inventing Choregraphe triggers.

### 14.4 Choregraphe on the user's Ubuntu setup

A previously used launch command for Choregraphe 2.5.5.5 is:

```bash
/opt/Choregraphe/choregraphe
```

The exact project to open must be discovered from the current source; do **not** assume `html_pepper` contains a `.pml` file. If an unrelated Pepper project opens, do not treat that as proof that the HTML folder is connected.

---

## 15. Testing strategy and checklist

No tests below are claimed as passed. This table is designed for the subsequent source/hardware verification pass.

| ID | Test | Expected result | Status |
|---|---|---|---|
| HTML-01 | Folder exists in checkout | Correct path and accessible files | Not run |
| HTML-02 | Git version identified | Commit hash recorded | Not run |
| HTML-03 | Entry point found | Startup page determined from source | Not run |
| HTML-04 | HTML parses | No structural blocking errors | Not run |
| HTML-05 | CSS files load | No missing stylesheet requests | Not run |
| HTML-06 | JavaScript loads | No fatal parse/runtime errors | Not run |
| HTML-07 | Images load | No broken paths | Not run |
| HTML-08 | Audio/video load if used | Expected media opens | Not run |
| HTML-09 | Page controls work locally | Each applicable control responds | Not run |
| HTML-10 | Navigation works | Every route can return safely | Not run |
| HTML-11 | Refresh/reload works | Page starts in predictable state | Not run |
| HTML-12 | Rapid double tap | No duplicate/overlapping actions | Not run |
| HTML-13 | Browser console audit | No unexplained exceptions | Not run |
| HTML-14 | Browser network audit | No unexplained 404s | Not run |
| HTML-15 | Tablet layout | Buttons and text legible on device | Not run |
| HTML-16 | QiSession, if used | Valid connection established on robot | Not run |
| HTML-17 | ALMemory event, if used | Correct event/payload observed | Not run |
| HTML-18 | Robot action, if used | Correct action triggered exactly once | Not run |
| HTML-19 | Robot action completed | UI reflects actual completion | Not run |
| HTML-20 | Back during active action | UI and robot stop/return as designed | Not run |
| HTML-21 | Connection failure | Visible error or safe fallback | Not run |
| HTML-22 | Missing asset | Failure does not lock the interface | Not run |
| HTML-23 | Two consecutive runs | State resets; controls remain usable | Not run |
| HTML-24 | Robot stop/interrupt | Motion and speech stop safely | Not run |
| HTML-25 | Public event test | Stable under supervised visitor use | Not run |

### 15.1 Test evidence record

For each applicable test, record the date, robot model/firmware, Choregraphe version, source commit, steps, observed result, screenshot/log and whether it passed. **Desktop-browser passes are not substitutes for real robot tests.**

### 15.2 Minimal test sequence

1. Inspect source and determine what is actually intended to run.
2. Start with browser-only behaviour in a development environment.
3. Validate web references and JavaScript errors.
4. Confirm the robot-side service contract before sending any events.
5. Test speech-only or non-moving actions first.
6. Test one physical action under direct supervision in clear space.
7. Confirm stop, reset and repeated interactions.

---

## 16. Debugging and troubleshooting

### 16.1 Blank page

**Possible causes:** wrong entry path, invalid document, script error or CSS hiding the root element. Use browser Console and Network tabs. Try the smallest entry page first; verify URLs and document case.

### 16.2 HTML works on a laptop, but not Pepper

**Possible causes:** embedded browser version, missing packaged assets, unavailable remote server, or unsupported JavaScript and video formats. Verify the exact URL the tablet opens and test incrementally with basic text before adding scripts and video.

### 16.3 `QiSession is not defined`

The bridge was not loaded or is unavailable in the current browsing context. This is expected when a Pepper-specific script is opened in a normal desktop browser without a mock. Check the intended script-loading mechanism before changing robot-side code.

### 16.4 Button changes screen but robot does not respond

Inspect the JavaScript handler, connection result, event name, payload type, robot-side subscriber and relevant Choregraphe box graph. A button click alone demonstrates only that a browser callback executed.

### 16.5 Robot action occurs but the UI never returns

The application may lack a completion event, the subscriber may have been discarded, or a promise/signal callback may not be firing. Test normal completion separately from cancellation and network failure.

### 16.6 Back button does not stop music or movement

Check three independent things: browser media element stopped; robot speech/audio stopped; and robot motion/behaviour stopped. Page navigation is not a substitute for robot-side cancellation. Test under supervision without abruptly interrupting unsafe motions.

### 16.7 A video plays on desktop but not Pepper

Inspect its codec with `ffprobe`, check resolution/bitrate, confirm the URL is accessible, and determine whether the embedded browser supports autoplay and that codec. Test with a short, known-compatible sample before altering every media file.

### 16.8 Missing `index.html`

The folder may use a different entry name, be a partial asset directory, or be consumed from another project. Search the whole tree; do not generate a replacement `index.html` until the existing runtime structure is understood.

### 16.9 Correct Choregraphe project will not open

Check actual file path, Choregraphe version, resources and XML parsing; do not manually splice unrelated `.pml`/`.xar` files together. Keep a backup or work on a new branch before repairing package metadata.

### 16.10 Useful non-destructive diagnostics

```bash
cd ~/repos/Pepper_Stuff/html_pepper

# Show files and recent checkout state.
find . -maxdepth 3 -type f | sort
git status --short

# Locate links to missing local assets manually.
grep -RInE '(src|href)=' . --include='*.html' | head -n 80

# Find robot communication call sites.
grep -RInE 'QiSession|raiseEvent|subscriber|ALTabletService' . \
  --include='*.js' --include='*.html' --include='*.py' || true
```

---

## 17. Security, safety and accessibility

### 17.1 Safe robotics control

- Always supervise Pepper during movements at public demonstrations.
- Clear the space around Pepper's arms and mobile base before testing.
- Treat any web action capable of moving the robot as privileged functionality.
- Prevent repeat taps from launching conflicting movement sequences.
- Make an operator-controlled stop or safe pause mechanism available and **verify** what it cancels.
- Never rely on a tablet page change to make active motor control safe.

### 17.2 Network security

Keep robot control on a trusted local network; do not expose unauthenticated NAOqi services, development web servers or remote-control endpoints on the public internet. Avoid hard-coded usernames/passwords in JavaScript, source files and screenshots. Limit CORS and any network bridge to only the origins and functions actually needed. Do not run arbitrary third-party JavaScript on the robot's control page.

### 17.3 Visitor privacy

If the interface collects names, photographs, telemetry or other personal data, document the precise inputs, retention, storage, access and deletion procedure. Do not assume user data is absent merely because the page appears to be a demo. For a university event, follow applicable organisational policies and UK data-protection requirements.

### 17.4 Accessible interaction

Ensure adequate contrast, large touch targets and readable language. Keep spoken instructions concise, provide on-screen alternatives where practical, and allow users to exit or restart without assistance. Consider visitors who cannot reach Pepper's physical touch sensors or understand audio in a noisy room.

---

## 18. Code quality and maintenance

### 18.1 Maintain a separation of responsibilities

A reliable structure keeps screen rendering, input handlers, media controls and robot service communication logically distinct, even when they share a small JavaScript file. This makes it easier to test navigation on a laptop without activating Pepper.

### 18.2 Avoid duplicated connections

If the real code uses NAOqi, establish the connection and subscribers in a controlled lifecycle. Repeatedly subscribing on each menu visit may generate duplicate callback invocations. Preserve subscriber handles where the runtime requires them and clean up on shutdown or reload.

### 18.3 Error reporting

Use clear messages such as *robot unavailable*, *media missing* and *action cancelled* rather than leaving buttons silently unresponsive. Include a diagnostic console error with a stable event identifier. Do not display sensitive technical details to visitors.

### 18.4 Asset management

Organise media into clearly named folders, remove unreferenced duplicates only after checking package references, and keep any large assets out of repositories if their size or licensing is unsuitable. Maintain an asset attribution register.

### 18.5 Suggested documentation alongside the code

Once the folder is inspected, add a README with its actual entry point, screen flow, tested robot/firmware, deployment instructions, event table, source-to-behaviour mapping, known issues and one screenshot per main page. Avoid promising a feature that is only proposed or cannot be reproduced.

---

## 19. GitHub maintenance and reproducibility

### 19.1 Check changes safely

```bash
cd ~/repos/Pepper_Stuff

git status
git diff -- html_pepper
git log --oneline --max-count=20 -- html_pepper
```

Do not run a hard reset or overwrite a working local version merely to match GitHub. Check local, uncommitted changes and branches first.

### 19.2 Create a documentation branch (optional)

```bash
cd ~/repos/Pepper_Stuff
git switch -c docs/html-pepper-guide
```

This command creates a new branch **only if that branch name does not already exist**. Afterwards, copy the reviewed documentation file into an appropriate location in the repository, inspect `git diff`, and commit explicitly. The present Markdown file has **not** been automatically pushed to GitHub.

### 19.3 Recommended minimum reproducibility record

```text
Git commit:        <run git rev-parse HEAD>
Entry HTML file:   <verified path>
JS files:          <verified paths>
CSS files:         <verified paths>
Robot model:       <record during tests>
NAOqi firmware:    <record during tests>
Choregraphe:       <record version if applicable>
Deployment route:  <bundled / locally hosted / other>
Last robot test:   <date and result>
```

---

## 20. Evidence to collect for a fully verified revision

A second pass can replace provisional guidance with a true line-by-line description when these inputs are available:

1. Complete `find` output from `~/repos/Pepper_Stuff/html_pepper`.
2. A copy of the actual HTML files and any local JavaScript/CSS they load.
3. Asset inventory and the purpose of each referenced file.
4. Actual Choregraphe `.pml`/`.xar` code if this folder is deployed with a behaviour.
5. An event-name cross-reference, if robot events are used.
6. Representative tablet screenshots, if the interface is intended for Pepper.
7. Git commit hash so the review identifies a reproducible revision.
8. Results from at least one local-browser run and, where appropriate, a supervised Pepper hardware test.

### 20.1 Verification matrix template

| Question | Observed answer | File + line evidence | Test evidence |
|---|---|---|---|
| What does the application do? | Pending | Pending | Pending |
| What starts it? | Pending | Pending | Pending |
| What are the screens? | Pending | Pending | Pending |
| What is the page/script dependency order? | Pending | Pending | Pending |
| What media is actually used? | Pending | Pending | Pending |
| How does Pepper receive commands? | Pending | Pending | Pending |
| How are commands stopped? | Pending | Pending | Pending |
| How does it reset? | Pending | Pending | Pending |
| What works on the robot? | Pending | Pending | Pending |

Any entries that cannot be answered honestly should remain marked as unknown in a portfolio write-up.

---

## 21. Worked reference example — not project code

This small example demonstrates how a **new**, standalone HTML mock-up could show a page, change text, and optionally send a test event in a NAOqi-capable context. **It is provided to explain the concepts, not to describe or modify `html_pepper`.** Do not confuse it with a verified existing implementation.

### 21.1 HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Pepper UI — Reference Example</title>
</head>
<body>
  <main>
    <h1>Pepper Demo</h1>
    <p id="status" role="status">Ready</p>
    <button id="demoButton" type="button">Request demo</button>
  </main>
  
  <script src="example.js"></script>
</body>
</html>
```

### 21.2 JavaScript

```javascript
(function () {
  var button = document.getElementById("demoButton");
  var status = document.getElementById("status");

  button.addEventListener("click", function () {
    status.textContent = "Requesting demonstration...";

    if (typeof QiSession === "undefined") {
      status.textContent = "Local preview: no Pepper connection.";
      return;
    }

    QiSession(function (session) {
      session.service("ALMemory").then(function (memory) {
        memory.raiseEvent("Example/Start", "demo");
        status.textContent = "Request sent. Waiting for robot...";
      }).catch(function (err) {
        console.error(err);
        status.textContent = "Could not contact robot service.";
      });
    });
  });
}());
```

This example intentionally does **not** command motors, define a robot-side subscriber, or claim that a raised event completed anything. The status says *request sent*, not *action completed*. The `Example/Start` event is not assumed to exist on Pepper. A genuine implementation would need correct bridge loading, a matching trusted robot-side consumer, completion/error acknowledgement, explicit cancellation and supervised tests.

### 21.3 Important design lesson

**A web interface is not the whole robot system.** The site can render perfectly in Firefox while every robot-specific button remains nonfunctional. Document the boundary between browser state and physical robot state, and verify both sides of every action.

---

## 22. Glossary and useful references

**Pepper:** Social humanoid robot with built-in tablet and NAOqi-based services on supported firmware.  
**NAOqi:** Robot software platform exposing services for speech, memory, tablet and other capabilities.  
**Choregraphe:** Graphical environment for composing Pepper/NAOqi behaviours.  
**QiSession:** A JavaScript bridge pattern used in some NAOqi tablet environments to access robot services.  
**ALMemory:** NAOqi memory/event service; can enable event-driven coordination.  
**ALTabletService:** NAOqi service supporting tablet display operations on compatible firmware.  
**`.pml`:** Choregraphe project/package descriptor.  
**`.xar`:** Choregraphe behaviour graph representation.  
**Entry point:** File or behaviour that starts the application.  
**Asset:** Image, font, audio, video or similar resource used by the interface.  
**Runtime verification:** Testing what actually happens, rather than inferring behaviour solely from code.

### Project links

- [Main `Pepper_Stuff` repository](https://github.com/reeceherbert887/Pepper_Stuff)
- [`html_pepper` folder (expected location)](https://github.com/reeceherbert887/Pepper_Stuff/tree/main/html_pepper)
- [`Pepper-Freshers` folder — separate project](https://github.com/reeceherbert887/Pepper_Stuff/tree/main/Pepper-Freshers)
- [`Refreshers 1/Refreshers` folder — separate project](https://github.com/reeceherbert887/Pepper_Stuff/tree/main/Refreshers%201/Refreshers)
- [GitHub documentation: README files](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes)

### Final documentation note

**Current state:** The project-specific source has **not** been inspected; this is a detailed and actionable **technical guide and audit draft**, not a verified functional specification. The fastest route to a fully accurate final version is the source inventory from sections 3–4 plus the actual HTML, CSS, JavaScript and optional Choregraphe files from the folder. Until then, keep the verified/unverified distinction wherever this guide is reused.
