---
title: "Pepper Projects: Pepper Documentation"
date: 2026-10-12
permalink: /projects/pepper/pepper-documentation/
excerpt: "Detailed Project Documentation"
---

# Pepper Robotics — Development, Setup and Documentation Guide

**Workspace:** Pepper robotics projects / University of Hull Robotics Society  
**Repository:** [reeceherbert887/Pepper_Stuff](https://github.com/reeceherbert887/Pepper_Stuff)  
**Documentation area:** [`Pepper-Documentation`](https://github.com/reeceherbert887/Pepper_Stuff/tree/main/Pepper-Documentation)  
**Typical local checkout:** `~/repos/Pepper_Stuff`  
**Prepared:** 12 October 2026  
**Document type:** Consolidated technical handbook, development runbook and documentation index  
**Scope:** Legacy Pepper/NAOqi/Choregraphe projects, including Freshers, Refreshers, Robo Grad and `html_pepper`

> **Source-verification notice:** This guide is **not** a claim that every file within `Pepper-Documentation/` was read. The top-level documentation area was identified during earlier reviews, but its actual contents were not retrievable in the present session. The **Freshers** and standalone **Refreshers** descriptions are drawn from earlier code-based project reviews. The **Robo Grad** and **html_pepper** internal implementations remain unverified. Commands, project-maintenance procedures, technical background and sample patterns are labelled accordingly. No physical robot test was performed. The repository revision is not pinned to an individual commit.

---

## Contents

1. [Purpose and intended readers](#1-purpose-and-intended-readers)
2. [Repository projects and confidence levels](#2-repository-projects-and-confidence-levels)
3. [Recommended document structure](#3-recommended-document-structure)
4. [System overview and technology stack](#4-system-overview-and-technology-stack)
5. [Pepper hardware and operating limits](#5-pepper-hardware-and-operating-limits)
6. [Development environment on Ubuntu](#6-development-environment-on-ubuntu)
7. [Finding and opening Choregraphe projects](#7-finding-and-opening-choregraphe-projects)
8. [Understanding Choregraphe files](#8-understanding-choregraphe-files)
9. [Connecting Choregraphe to the robot](#9-connecting-choregraphe-to-the-robot)
10. [Fundamental Choregraphe workflow](#10-fundamental-choregraphe-workflow)
11. [NAOqi services and Python boxes](#11-naoqi-services-and-python-boxes)
12. [Tablet technologies and JavaScript](#12-tablet-technologies-and-javascript)
13. [ALMemory event communication](#13-almemory-event-communication)
14. [Known Pepper Freshers architecture](#14-known-pepper-freshers-architecture)
15. [Known standalone Refreshers architecture](#15-known-standalone-refreshers-architecture)
16. [Robo Grad and HTML project verification](#16-robo-grad-and-html-project-verification)
17. [Speech, animation, sensors and media](#17-speech-animation-sensors-and-media)
18. [Working with images, audio and video](#18-working-with-images-audio-and-video)
19. [Testing in stages](#19-testing-in-stages)
20. [Debugging and troubleshooting](#20-debugging-and-troubleshooting)
21. [Robot safety and event-day procedures](#21-robot-safety-and-event-day-procedures)
22. [Version control, backups and release management](#22-version-control-backups-and-release-management)
23. [Source inventory and documentation audit](#23-source-inventory-and-documentation-audit)
24. [Documentation standards and templates](#24-documentation-standards-and-templates)
25. [Maintenance and handover checklist](#25-maintenance-and-handover-checklist)
26. [Risk register](#26-risk-register)
27. [Improvement roadmap](#27-improvement-roadmap)
28. [Quick command reference](#28-quick-command-reference)
29. [Glossary](#29-glossary)
30. [External references and project links](#30-external-references-and-project-links)

---

## 1. Purpose and intended readers

This document is the **general reference guide** for the Pepper robotics workspace. It complements detailed guides for specific demonstrations. Its purpose is to make the environment understandable and reproducible for future student developers, Robotics Society committee members and event operators.

A new maintainer should be able to use it to locate the projects, understand the boundary between Pepper's tablet and robot behaviour, start Choregraphe on the development laptop, inspect and modify a project safely, diagnose a broken interaction, collect test evidence and commit documentation without damaging a working event build.

It is also a **handover guide**: university societies often have annual committee turnover, so the project should not depend on a single person's memory of where files are stored or which Choregraphe buttons to press.

### In scope

- Ubuntu-based development and basic terminal operations.
- Choregraphe 2.5-era package and behaviour workflows.
- Pepper's NAOqi services, event handling, media and motion.
- HTML/CSS/JavaScript tablet interfaces where actually implemented.
- Known information about Freshers and Refreshers.
- Source inspection methods for Robo Grad, `html_pepper` and `Pepper-Documentation`.
- Testing, safety, version control and documentation quality.

### Out of scope

- A claim that any project is production-ready on the physical robot.
- Firmware upgrades or changes to Pepper's low-level safety controls.
- Replacement of the robot's original software stack with ROS or modern Python.
- Reproduction of unverified files or scripts within the documentation folder.

---

## 2. Repository projects and confidence levels

The GitHub repository contains several Pepper-related areas. They share hardware and some technologies but should not be treated as a single runtime application.

| Directory | Purpose or role | Verification status |
|---|---|---|
| `Pepper-Freshers/` | Interactive Freshers quiz, dance choices, Refreshers choices and photo opportunity | **Source-reviewed** in earlier project guide; hardware execution not independently tested |
| `Refreshers 1/Refreshers/` | Separate Choregraphe demonstration with touch/sensor, speech, multimedia and animation branches | **Source-reviewed** in earlier project guide; hardware execution not independently tested |
| `Robo Grad/` | Separate project previously described in the workspace as graduation/presentation-related | **Internal source not verified** |
| `html_pepper/` | Separate HTML-related folder | **Internal source and functionality not verified** |
| `Pepper-Documentation/` | Documentation area of the repository | **Internal file list/content not verified in this session** |

### Companion project guides

These are separate Markdown guides previously prepared for the same repository. If saved alongside this file, the links below work as local Markdown links:

- [Pepper Freshers — Detailed Documentation](Pepper-Freshers-Detailed-Documentation.md)
- [Pepper Refreshers — Detailed Documentation](Pepper-Refreshers-Detailed-Documentation.md)
- [Pepper Robo Grad — Detailed Documentation](Pepper-Robo-Grad-Detailed-Documentation.md) — technical framework; implementation pending inspection.
- [Pepper HTML — Detailed Documentation](Pepper-HTML-Detailed-Documentation.md) — technical framework; implementation pending inspection.

**Documentation rule:** Do not copy a behaviour or feature description from another project and label it as belonging to `Robo Grad` or `html_pepper` without verifying the corresponding files.

---

## 3. Recommended document structure

A sensible future layout, **proposed rather than confirmed**, is:

```text
Pepper_Stuff/
├── README.md
├── Pepper-Freshers/
├── Refreshers 1/
│   └── Refreshers/
├── Robo Grad/
├── html_pepper/
└── Pepper-Documentation/
    ├── README.md
    ├── Pepper-Documentation-Guide.md
    ├── Pepper-Freshers-Detailed-Documentation.md
    ├── Pepper-Refreshers-Detailed-Documentation.md
    ├── Pepper-Robo-Grad-Detailed-Documentation.md
    ├── Pepper-HTML-Detailed-Documentation.md
    ├── test-results/
    ├── known-issues.md
    └── assets/
```

This does **not** mean the repository already has that structure. Only move or create files after checking for duplicates and references. Keeping project-specific guides together makes onboarding easier, while retaining the actual Choregraphe projects in their original directories avoids breaking paths and IDs.

An index `README.md` should answer four questions immediately: what projects exist; which software/robot version they target; where to find setup and troubleshooting instructions; and which build was last tested on Pepper.

---

## 4. System overview and technology stack

The legacy Pepper setup has distinct development, robot-runtime and tablet layers:

```text
Ubuntu development computer
  ├── Git / GitHub                  (source history)
  ├── Choregraphe 2.5.5.5           (visual behaviour authoring)
  ├── Code editor + terminal       (HTML, JavaScript, XML, docs)
  └── Browser                       (local web-interface previews)
             │
             │ Local network / robot connection
             ▼
Pepper robot (compatible NAOqi firmware)
  ├── Choregraphe behaviour package (.pml + .xar)
  ├── NAOqi runtime services
  │    ├── ALMemory
  │    ├── ALTextToSpeech / ALAnimatedSpeech
  │    ├── ALMotion
  │    ├── ALTabletService
  │    ├── ALAudioPlayer
  │    └── Sensor / LED services
  ├── Motors, speakers, sensors and LEDs
  └── Tablet WebView (if used)
       └── HTML + CSS + JavaScript + qimessaging/QiSession
```

Different projects may use only part of this stack. For example, an ordinary HTML mock-up can work in a laptop browser even if it never connects to Pepper. Conversely, a Choregraphe-only sensor demonstration can operate without a custom HTML menu.

### Version awareness

**Choregraphe 2.5.5.5** is the version previously used on the Ubuntu laptop in this workspace. The compatible **NAOqi/Pepper firmware generation must still be checked on the actual robot**. Pepper's older NAOqi 2.5/Python ecosystem differs significantly from Pepper 2.9 Android/QiSDK development; instructions for one should not be substituted automatically for the other.

The developer documentation maintained by United Robotics Group distinguishes these two platform families (see References).

---

## 5. Pepper hardware and operating limits

Pepper is a mobile social robot with head, arms, hands, a wheeled base, microphones, cameras, touch and other sensors, speakers, LEDs and an integrated tablet. Exactly which sensors and runtime APIs are available must be established from the robot model and installed software version.

### Hardware considerations for demonstrations

- **Base movement:** Confirm a clear operating area. Never assume that a box called `Dance` is upper-body-only; inspect movement and displacement calls.
- **Arm/head movement:** Keep visitors clear of moving joints and ensure props cannot catch on the robot.
- **Battery/power:** Check charge and event-duration requirements before a public run.
- **Tablet:** Test viewing angles and button sizes for a standing audience.
- **Speakers:** Balance intelligibility against excessive volume in a crowded room.
- **Network:** A successful laptop Wi-Fi connection does not prove that Choregraphe can reach NAOqi services.

Do not assume arbitrary trajectories are safe simply because the virtual robot plays them. Every new movement needs a supervised physical check.

---

## 6. Development environment on Ubuntu

The user previously installed Choregraphe under `/opt/Choregraphe`. This is the recorded launcher:

```bash
/opt/Choregraphe/choregraphe
```

### 6.1 Confirm the checkout

```bash
cd ~/repos/Pepper_Stuff
pwd
git status --short
git branch --show-current
git log -1 --date=iso --pretty=format:'%h  %ad  %s%n'
```

If that fails, check the directory name; Linux paths are case-sensitive:

```bash
ls -lah ~/repos
find ~/repos -maxdepth 2 -type d -iname '*pepper*' -print
```

### 6.2 Check whether Choregraphe exists

```bash
ls -lh /opt/Choregraphe/choregraphe
file /opt/Choregraphe/choregraphe
```

If the binary exists and has appropriate permissions, launch it with the command above. **Do not blindly reinstall Choregraphe or overwrite the existing installation** to solve a project-specific loading error. First check for missing files, wrong paths, incompatible robot version or application dependencies.

### 6.3 Useful development tools

```bash
sudo apt update
sudo apt install git curl jq tree unzip zip file sqlite3
```

Only install optional tools you need. SQLite is not required by the Pepper Freshers or standalone Refreshers projects; it is listed here as a general utility, **not** as a claimed Pepper dependency.

For XML syntax checks, a useful optional package is:

```bash
sudo apt install libxml2-utils
```

Then, for a known local XML-based Choregraphe file:

```bash
xmllint --noout "Pepper-Freshers/manifest.xml"
xmllint --noout "Pepper-Freshers/behavior_1/behavior.xar"
```

A well-formed XML file may still have invalid Choregraphe links, schema differences or unavailable assets. Parsing is only a first check.

---

## 7. Finding and opening Choregraphe projects

### 7.1 Discover project entry points

From the repository root:

```bash
cd ~/repos/Pepper_Stuff
find . -type f \( -iname '*.pml' -o -iname '*.xar' -o -iname 'manifest.xml' \) | sort
```

The **previously reviewed** project entry points include:

```text
Pepper-Freshers/Pepper-Freshers.pml
Refreshers 1/Refreshers/Refreshers.pml
```

The Robo Grad entry point is not verified. Discover it rather than guessing:

```bash
find 'Robo Grad' -type f -iname '*.pml' -print
```

### 7.2 Open a project

1. Start Choregraphe with `/opt/Choregraphe/choregraphe`.
2. Use its **File > Open Project** command (wording may vary).
3. Navigate to the project `.pml` file.
4. Inspect the project-files panel for missing resources.
5. Confirm that the expected behaviour graph is loaded and that the intended robot/model is selected.
6. Save a copy or commit existing changes before making edits.

**Important:** Open a `.pml` as the project. An `.xar` generally stores one behaviour within the project and is not the same as launching the complete packaged application. Neither a `.pml` nor an `.xar` should be executed using `python`.

---

## 8. Understanding Choregraphe files

| Extension/file | Purpose | Guidance |
|---|---|---|
| `.pml` | Choregraphe project descriptor, referencing behaviours and resources | Main project opening point; keep references valid |
| `.xar` | Behaviour graph/timelines/XML and possibly embedded Python | Edit primarily in Choregraphe |
| `manifest.xml` | Application identity, metadata and behaviour declarations | Check intended entry point and version |
| `.pmt` | Planar movement trajectory where used | Verify safety on physical robot |
| `.ogg`, `.mp3`, `.wav` | Sound assets | Confirm codec, timing, file presence and rights |
| `.mp4`, `.gif`, `.png`, `.jpg` | Tablet/web multimedia | Confirm tablet compatibility and path references |
| `.html`, `.css`, `.js` | Browser/tablet interface | Edit and preview using a text editor/browser |
| `.ts` | Translation/localisation resource in some Choregraphe packages | Keep language strings current |
| `.py` | Python helper or trajectory source | Identify whether it expects legacy Python 2/NAOqi |
| `.md` | Human-readable documentation | Use relative links and maintain version information |

### Why direct XML merging is risky

An `.xar` is more than a block of Python: it encodes box IDs, signal links, event names, timing curves, attached resources and hierarchy. Combining two full projects by copy/pasting XML or concatenating `.pml` files can create duplicate identifiers or disconnected behaviours.

**Safer method:** open both source and destination projects in Choregraphe, copy the required boxes/animations, import their assets, reconnect signals, then test the resulting project. Back up/commit before changing anything.

---

## 9. Connecting Choregraphe to the robot

### 9.1 Network checks

Find the robot's current IP using the robot display or authorised network configuration. In all examples below, replace `<PEPPER_IP>` with the real address; do not type the angle brackets literally.

```bash
ping -c 4 <PEPPER_IP>
```

This tests basic reachability only. Ping success is **not** proof that Choregraphe, its version, credentials or required NAOqi services are working.

### 9.2 Connect from Choregraphe

1. Place the laptop and Pepper on a network that allows them to communicate.
2. Start Choregraphe.
3. Use the connection dialog to choose the physical robot or specify its IP.
4. Verify a real robot connection, not merely a virtual robot selection.
5. Confirm the robot/firmware version is compatible with the Choregraphe installation.
6. Start with a **non-moving** test such as a controlled speech or harmless status check.

Connection menu names can vary by Choregraphe release. Do not assume that the available port or address is the same as another robotics platform (for example, Niryo Studio or ROSBridge).

### 9.3 If connection fails

Check these in order: robot powered on and fully booted; correct IP; same reachable network; university guest network client isolation; VPN/firewall routing; robot system version; correct Choregraphe target; robot-side service health; and whether the project can be opened offline.

Do not weaken firewall rules broadly or expose robot control ports to the public Internet to make a demonstration work. Use a trusted local network.

---

## 10. Fundamental Choregraphe workflow

A typical Choregraphe behaviour is a graph of boxes connected by input/output signals.

```text
Root onStart
   │
   ▼
Initialisation / Show Tablet / Start Listeners
   │
   ├──── Speech branch
   ├──── Animation branch
   ├──── Sensor branch
   └──── ALMemory event branch
                 │
                 ▼
          Completion / Reset
```

### Graph concepts

- **Root behaviour:** Entry point and owner of other boxes.
- **Box:** An action (speech, animation, wait, Python, tablet, sensor) or controller.
- **Input:** Receives triggers or values, e.g. `onStart`, `onStop`.
- **Output:** Emits success/failure or a project-specific signal.
- **Parameter:** A filename, message, duration or other configuration value.
- **Timeline:** Time-dependent animations, keyframes and other tracks.
- **Embedded Python:** Scripts that interact with NAOqi services or route signals.

### Recommended edit cycle

1. Checkout or create a short-lived Git branch for the change.
2. Open the working project, confirm the robot model and take a screenshot of the original graph.
3. Change **one behaviour path at a time**.
4. Save and inspect `git diff`.
5. Run XML/asset sanity checks.
6. Test on a virtual robot **where appropriate**, then on real hardware with supervision.
7. Record expected and actual behaviour, including stop/restart.
8. Commit the change and update the relevant Markdown guide.

---

## 11. NAOqi services and Python boxes

The Pepper 2.5-style projects use NAOqi services. Their actual availability and method signatures depend on the robot's version.

| Service | Typical purpose | Example responsibility |
|---|---|---|
| `ALMemory` | Read/raise/subscribe to named events | Tablet-to-behaviour routing |
| `ALTextToSpeech` | Speak text | Announcements and quiz results |
| `ALAnimatedSpeech` | Speech with expressive animation | Visitor-facing introductions |
| `ALMotion` | Joint movement/robot motion | Physical animation and poses |
| `ALRobotPosture` | Request supported postures | Preparation/recovery where appropriate |
| `ALTabletService` | Load/show tablet content, media | Quiz UI, images and videos |
| `ALAudioPlayer` | Play packaged sounds | Music and sound effects |
| `ALLeds` | LED control | Visual feedback and effects |

### Legacy Python warning

The earlier reviewed Choregraphe source contains Python 2-era constructs such as `except Exception, error`. The standard Ubuntu Python 3 interpreter cannot run this syntax. A script embedded inside a Choregraphe `.xar` should be run by the **compatible robot behaviour runtime**, not extracted and executed as `python3 behavior.xar`.

A separate external Python client also needs the correct NAOqi SDK, supported Python interpreter and library paths. Do not try to fix a missing `naoqi` module by blindly installing an unrelated modern package with the same name.

### Example: conceptual speech box

The following is a **reference pattern, not copied from the repository**, suitable for adaptation inside a correctly configured legacy Choregraphe Python box:

```python
class MyClass(GeneratedClass):
    def __init__(self):
        GeneratedClass.__init__(self)

    def onInput_onStart(self):
        try:
            tts = ALProxy("ALTextToSpeech")
            tts.say("Welcome to the Robotics Society.")
            self.onStopped()
        except Exception as error:
            self.logger.error(str(error))
            self.onStopped()
```

This illustration omits concurrency and cancellation logic and **must not be treated as a validated box**. Check whether a service proxy is provided directly by Choregraphe and whether the requested methods match your robot version before use.

---

## 12. Tablet technologies and JavaScript

Pepper Freshers uses a web-based tablet interface. Its reviewed HTML application includes:

```text
Pepper-Freshers/html/index.html
Pepper-Freshers/html/style.css
Pepper-Freshers/html/script.js
```

It also uses the Pepper JavaScript bridge (`qimessaging.js` / `QiSession`) to communicate with robot services when running on Pepper's tablet. A regular desktop browser might render the HTML but lack that bridge.

### Responsibility split

| Location | Responsibility |
|---|---|
| HTML | Buttons, screens, text, images and video elements |
| CSS | Layout, colours, responsive design and visibility |
| JavaScript | Quiz scoring, UI navigation, media lifecycle, event requests |
| NAOqi bridge | Connection from tablet JavaScript to robot service calls |
| Choregraphe | Physical movement, robot speech, completion events |

A tablet message such as “Pepper is dancing!” is **a UI state**, not evidence that the robot's motors have begun moving. The behaviour may have failed, may not have subscribed to the event, or may be paused.

### Browser-preview checks

For a conventional HTML folder, a Python 3 HTTP server can serve local pages:

```bash
cd ~/repos/Pepper_Stuff/Pepper-Freshers/html
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/` on the laptop. This validates only normal web rendering and interactions; it does **not** emulate NAOqi or validate robot movement. Use `Ctrl+C` to stop the server.

Do not assume the standalone `html_pepper` folder has an `index.html` until you inspect it.

---

## 13. ALMemory event communication

`ALMemory` supports named values and event-style communication within NAOqi. In the Freshers application, the tablet raises events and a Choregraphe listener routes them to behaviours.

### Known Freshers events from prior source review

| Event key | Direction | Purpose |
|---|---|---|
| `PepperFreshers/Result` | Tablet → robot | Announces or otherwise handles quiz result |
| `PepperFreshers/DanceSelected` | Tablet → robot | Requests a selected dance/Refreshers/photo branch |
| `PepperFreshers/ReturnToDancePage` | Robot → tablet | Navigate to dance menu when relevant behaviour finishes |
| `PepperFreshers/ReturnToRefreshersPage` | Robot → tablet | Navigate to Refreshers menu when relevant behaviour finishes |

### Conceptual event lifecycle

```text
Visitor selects activity
      |
      v
Tablet JavaScript calls memory.raiseEvent(key, value)
      |
      v
NAOqi ALMemory dispatches matching event
      |
      v
Robot-side subscribed Choregraphe/Python controller
      |
      v
Animation / speech / media starts
      |
      v
Controller finishes or handles cancellation
      |
      v
Controller emits completion/return event
      |
      v
Tablet subscriber updates the selected screen
```

### Three easily confused concepts

1. **Event sent:** Tablet requested a behaviour.
2. **Event received:** Choregraphe listener actually handled it.
3. **Behaviour completed:** Pepper has finished the requested action.

These states are not interchangeable. For robust systems, use acknowledgements and a clear state machine such as `IDLE → STARTING → RUNNING → STOPPING → IDLE` with an `ERROR` state.

### Known stop/reset concern

In the earlier Freshers source review, tablet Back buttons were observed to stop local media/change screens without necessarily requesting **robot-side cancellation**. A reliable system should have an explicit stop/reset signal and check that any currently running robot action has actually finished or been cancelled before accepting a new one.

Do **not** assume that hiding a video or moving to another menu cancels arm movement. Stop behaviour and completion handling must be verified in Choregraphe on the physical robot.

---

## 14. Known Pepper Freshers architecture

The earlier source-reviewed Freshers project provides a strong example of the two-layer system:

- **Five-question personality quiz** with six possible robotics-themed outcomes.
- **QR/result screen** that directs visitors towards the Robotics Society.
- **Activity menu** with Pepper Dance, Photo Opportunity and Refreshers.
- **Dance choices:** Dance of the Knights, Walk This Way and Hungary.
- **Refreshers choices:** Bees, Surprise and Speech.
- **Robot-side event router** for requested activities and completion notification.

Typical user journey:

```text
Welcome → Personality quiz → Result + QR code → Choose a project
                                             ├── Dances
                                             ├── Photo opportunity
                                             └── Refreshers
```

### Working on Freshers

Open:

```text
~/repos/Pepper_Stuff/Pepper-Freshers/Pepper-Freshers.pml
```

Before editing, identify the active behaviour declared in `manifest.xml`; the earlier guide identified `behavior_1/behavior.xar` as the primary user-requestable behaviour, while other `.xar` files also exist in the package.

For feature-by-feature code notes, see the dedicated [Pepper Freshers guide](Pepper-Freshers-Detailed-Documentation.md). Do not assume this general handbook supersedes a later change made in the repository.

---

## 15. Known standalone Refreshers architecture

The standalone project, in `Refreshers 1/Refreshers/`, was reviewed as a **sensor-driven** Choregraphe demonstration, rather than an HTML quiz application.

It contains branches using head, hand, tablet and bumper interactions, speech, expressive animations, LEDs, sound and tablet media. Previously identified demonstrations/resources include Disco, Thinking and Headbang animation branches; Bee Gees-themed, Rick Roll and Christmas videos; and several motion/audio resources.

### Difference from Freshers

Freshers has a custom UI and sends selection events to a robot-side router. Standalone Refreshers has sensor-triggered and Choregraphe-wired interactions directly inside its own project graph. The fact that Freshers offers a “Refreshers” menu does **not** prove that it launches the whole standalone `Refreshers.pml` package as a separate executable.

Open the standalone project with:

```text
~/repos/Pepper_Stuff/Refreshers 1/Refreshers/Refreshers.pml
```

For exact box and asset explanations, see the [Pepper Refreshers guide](Pepper-Refreshers-Detailed-Documentation.md).

---

## 16. Robo Grad and HTML project verification

These project directories were identified in the repository, but their internal contents were **not** directly retrieved in the earlier documentation passes. This section provides a safe and reproducible way to finish the review.

### 16.1 Robo Grad

```bash
cd ~/repos/Pepper_Stuff
find 'Robo Grad' -maxdepth 4 -type f | sort
find 'Robo Grad' -type f \( -iname '*.pml' -o -iname '*.xar' -o -iname '*.py' \) | sort
```

For each `.pml`, record the declared behaviours, manifest, embedded scripts, media paths, triggers, spoken text, motion resources, start/stop behaviour and actual hardware results. Do not invent a graduation speech or presentation sequence solely from the name.

### 16.2 `html_pepper`

```bash
cd ~/repos/Pepper_Stuff
find html_pepper -maxdepth 4 -type f | sort
find html_pepper -type f \( -iname '*.html' -o -iname '*.css' -o -iname '*.js' -o -iname '*.json' \) | sort
```

Determine whether this is a standalone site, asset directory, early prototype or Pepper tablet app. Search for `QiSession`, `qimessaging`, `ALMemory`, `ALTabletService` and references from `.pml` files before claiming robot integration.

### 16.3 Record inspection outcomes

Use a simple evidence table:

| Claim | Source path / box | Behaviour seen | Physical test | Status |
|---|---|---|---|---|
| Project opens in Choregraphe | `<path>` | `<details>` | Yes/No | Verified/Partial/Unverified |
| Button sends event | `<path>` | `<event>` | Yes/No | Verified/Partial/Unverified |
| Robot runs action | `<path>` | `<motion>` | Yes/No | Verified/Partial/Unverified |

---

## 17. Speech, animation, sensors and media

### Speech

For public events, keep speech brief and unambiguous. Check pronunciation, volume, interruptions and multilingual behaviour if used. Choregraphe may provide simple `Say` boxes and more elaborate animated-speech boxes.

### Animation

Check the **actual joint motion** of all imported timelines, not only the visible label. A performance can have multiple sound and pose tracks; a missing asset or incomplete output transition may leave the sequence active longer than expected.

### Sensors

Touch events can fire repeatedly or while a robot is already busy. Introduce debouncing/busy-state logic before adding new event triggers. The standalone Refreshers project's sensor branches are a useful case study.

### Audio

A sound resource playing in a local desktop preview does not imply the robot's audio player supports its format or path. Store paths consistently and verify hardware volume, duration and stop/cancel behavior.

### Video and images

Pepper's tablet services display on-screen content; webviews and direct tablet media APIs can behave differently. Validate display resolution, screen return routes, autoplay and compatibility using the target firmware.

---

## 18. Working with images, audio and video

Large media assets can dominate Git history, delay clone operations and sometimes cause push failures. For every project, maintain a resource inventory with:

| Field | Example |
|---|---|
| Relative path | `html/assets/example.mp4` |
| Purpose | Tablet demonstration video |
| Source/creator | Society-made or third-party |
| Required by | Named `.pml` asset or JavaScript page |
| Licensing | Permission / restriction recorded |
| Size | Check with `ls -lh` |
| Verified on robot | Date and result |

### List the largest assets

```bash
cd ~/repos/Pepper_Stuff
find . -type f -not -path './.git/*' -printf '%s\t%p\n' | sort -nr | head -n 25
```

### Check media formats

```bash
find . -type f \( -iname '*.mp4' -o -iname '*.ogg' -o -iname '*.mp3' \) -exec file {} \;
```

### GitHub repository limits

Do not commit generated build files, giant intermediate videos, temporary exports or caches without a reason. GitHub's limits and recommendations can change; verify current limits before adding large media. Where the project **requires** a large asset, evaluate Git LFS and ensure future maintainers understand how to fetch it.

**Rights warning:** Code being in a public repository does not grant redistribution rights for commercially released songs, performance music or video clips. Record licensing/permissions for media used at public society events, and consider alternatives for public GitHub distribution.

---

## 19. Testing in stages

Testing should progress from low-risk components to complete robot behaviour. **None of the tests below are asserted to have been performed for this guide.**

### Stage A — repository/static checks

- [ ] Repository checkout has no accidental changes.
- [ ] Expected `.pml`, `.xar` and manifest files are present.
- [ ] Critical XML files are syntactically well-formed.
- [ ] Assets declared in project files exist with matching spelling/case.
- [ ] No unsafe credentials or unnecessary private data are committed.

### Stage B — laptop/browser checks

- [ ] HTML menus and buttons work in desktop browser where applicable.
- [ ] Quiz scoring/results are correct.
- [ ] Local video/image files display correctly.
- [ ] Missing `QiSession` is handled gracefully in ordinary browser mode.
- [ ] Browser navigation does not leave overlapping local media.

### Stage C — Choregraphe offline checks

- [ ] Correct virtual robot/model selected.
- [ ] Project opens without broken links or missing box warnings.
- [ ] Start/stop connections are understandable.
- [ ] Event keys and box output names are consistent.
- [ ] Timelines play as expected in compatible simulation mode.

### Stage D — robot service checks

- [ ] Robot is connected and identifies correctly.
- [ ] Low-risk speech test completes.
- [ ] Tablet webview/media loads where applicable.
- [ ] One event is sent, received and acknowledged.
- [ ] Sensor events activate the intended branch once.

### Stage E — supervised movement and recovery

- [ ] Safe motion path/clearance checked physically.
- [ ] Each dance/gesture runs with an operator nearby.
- [ ] Stop/cancel route works during movement, not only afterwards.
- [ ] Repeated start does not overlap existing animations.
- [ ] Completion returns the robot and tablet to expected states.
- [ ] Behaviour recovers from missing media or a failed call.

### Stage F — event acceptance

- [ ] Full visitor journey works without operator intervention in normal use.
- [ ] Power, network, volume and crowd-control plan agreed.
- [ ] An operator can recover/reset after every branch.
- [ ] Backup laptop/project copy available.
- [ ] Version/commit and test date recorded.

### Suggested results table

| Test ID | Project | Scenario | Expected | Actual | Pass? | Build commit | Date |
|---|---|---|---|---|---|---|---|
| PX-001 | Freshers | Start quiz | First question displayed | — | Not run | — | — |
| PX-002 | Freshers | Choose dance | One corresponding request received | — | Not run | — | — |
| PX-003 | Freshers | Back during motion | Robot activity safely stops/resets | — | Not run | — | — |
| PX-004 | Refreshers | Touch head sensor | Matching branch starts once | — | Not run | — | — |
| PX-005 | Refreshers | Play video | Video visible and completion handled | — | Not run | — | — |
| PX-006 | Robo Grad | Open project | Correct graph and resources load | — | Not run | — | — |
| PX-007 | html_pepper | Inspect entry point | Identified from source | — | Not run | — | — |

---

## 20. Debugging and troubleshooting

### Problem: Choregraphe opens as NAO instead of Pepper

Verify the intended robot/model selection within Choregraphe. The presence of both NAO and Pepper library folders is normal and does not prove that the selected virtual or physical robot is Pepper. Confirm compatible Choregraphe edition, firmware and project target rather than changing library files blindly.

### Problem: Choregraphe will not start on Ubuntu

```bash
ls -lh /opt/Choregraphe/choregraphe
file /opt/Choregraphe/choregraphe
/opt/Choregraphe/choregraphe
```

Read terminal output for library, permission or display-system problems. Avoid downloading arbitrary replacement shared libraries or disabling sandboxing without understanding the risk.

### Problem: Tablet page loads but Pepper does not respond

Check whether `QiSession` exists on the target, `ALMemory` service resolves, the event key/value matches the robot listener, the listener was started, the action's Choregraphe output is connected, and the robot is not already busy. Add observable acknowledgements instead of treating a browser button click as success.

### Problem: Music plays but animation does not

Verify the motion branch is connected and started. Confirm the selected robot has motion services enabled and there are no active conflicting behaviours. A desktop audio preview may be independent of Pepper's motors.

### Problem: Back button appears to work but motion continues

The tablet navigation is separate from robot execution. The solution is to design and test a **robot-side cancel/stop path**, followed by a clear idle acknowledgement. Do not rely on HTML `showScreen()` or stopping audio alone.

### Problem: Media returns 404 or fails to display

Check path case, packaging/resource declarations, relative URL, webview location, file presence and video codec. Print the paths declared in `.pml` and compare to actual on-disk paths. Do not move files merely to satisfy a local browser if that breaks tablet package references.

### Problem: Two sensor triggers overlap

Implement a busy flag/debounce strategy and define the policy: ignore triggers, queue a new action, or cancel and replace the current action. Never start two potentially conflicting motor timelines simultaneously just because two sensors were touched.

### Problem: Python box code fails under `python3`

Legacy Choregraphe boxes may be Python 2 scripts embedded in XML. Inspect and execute them through the intended runtime; do not assume a modern Ubuntu venv can run them unchanged.

### Problem: Git push rejects media

Inspect file sizes and commit history. Removing a file from the working tree does not necessarily remove it from commits being pushed. Decide whether to compress, use Git LFS or intentionally rewrite unpublished history. Back up and coordinate before destructive history changes.

---

## 21. Robot safety and event-day procedures

**This is an operational checklist, not a replacement for the university's risk assessment or official robot manuals.**

### Before visitors arrive

1. Confirm the event build/commit and physical robot model.
2. Charge and inspect Pepper in accordance with manufacturer guidance.
3. Clear the planned operating area; restrict visitors from the robot's motion envelope.
4. Confirm the network and operator laptop, or arrange an offline fallback if supported.
5. Verify volume, tablet brightness and accessible button sizes.
6. Run every critical interaction once, including start, normal finish and interruption.
7. Establish who is supervising the robot and who speaks to visitors.
8. Make sure the operator knows the manufacturer's approved safe stop/power procedures.

### During demonstrations

- Keep one trained person responsible for robot control.
- Do not run untested full-body movement in a crowded setting.
- Prevent multiple visitors triggering conflicting actions at the same time.
- Do not use unsupported force to change Pepper's posture while motors are active.
- Pause the demonstration if faults, abnormal noises, instability or unexpected movement occur.

### After the event

1. Return the robot to an appropriate manufacturer-approved state.
2. Close behaviours and tablet media.
3. Record faults, unexpected transitions and observed timings.
4. Back up changed project files and event assets.
5. Update the GitHub documentation, but only commit verified changes.

---

## 22. Version control, backups and release management

### 22.1 Inspect the current worktree

```bash
cd ~/repos/Pepper_Stuff
git status
git branch --show-current
git remote -v
git log --oneline --decorate --max-count=15
```

### 22.2 Full recorded history and precise timestamps

```bash
git log --all --date=iso-strict --pretty=format:'%h  %ad  %an  %s'
```

For one project directory:

```bash
git log --date=iso-strict --pretty=format:'%h  %ad  %s' -- Pepper-Freshers
```

### 22.3 Work in an isolated branch

```bash
cd ~/repos/Pepper_Stuff
git switch -c docs/pepper-handbook
```

If the branch name is already in use, choose a different one; do not overwrite an existing branch.

### 22.4 Back up first

For a portable archive that preserves all current checkout files (including `.git` unless you exclude it):

```bash
mkdir -p ~/Pepper_Backups
tar -czf ~/Pepper_Backups/Pepper_Stuff_backup_$(date +%Y%m%d_%H%M%S).tar.gz \
  -C ~/repos Pepper_Stuff
```

If media makes the archive very large, confirm available disk space first. To preserve only tracked source history, a Git bundle is an alternative, but it does not include uncommitted changes:

```bash
cd ~/repos/Pepper_Stuff
git bundle create ~/Pepper_Backups/Pepper_Stuff_history.bundle --all
```

### 22.5 Add documentation safely

Assuming you have downloaded this `.md` file into `~/Downloads`:

```bash
mkdir -p ~/repos/Pepper_Stuff/Pepper-Documentation
cp ~/Downloads/Pepper-Documentation-Guide.md \
  ~/repos/Pepper_Stuff/Pepper-Documentation/

cd ~/repos/Pepper_Stuff
git diff --stat
git status --short
```

Only then commit the intended file:

```bash
git add Pepper-Documentation/Pepper-Documentation-Guide.md
git commit -m "docs: add Pepper development handbook"
```

Pushing is optional and should be performed only after reviewing the branch and remote target. Do not use `git add .` if other unreviewed project changes are present.

### 22.6 Release tags for event builds

A documented release should record: event name/date; Git commit; Pepper model/NAOqi version; Choregraphe version; tested interaction list; assets; known issues; and a fallback procedure. Consider a Git tag only for a commit that really passed event acceptance tests.

---

## 23. Source inventory and documentation audit

The `Pepper-Documentation/` directory contents are **not verified**, so the following commands are designed to create an accurate inventory from your local checkout.

### 23.1 List every documentation file

```bash
cd ~/repos/Pepper_Stuff
find Pepper-Documentation -type f | sort
```

If that path does not exist in your current branch, do not assume GitHub has deleted it; inspect branch and checkout first:

```bash
git branch --show-current
git ls-tree -r --name-only HEAD | grep '^Pepper-Documentation/' || true
```

### 23.2 Generate a documentation file inventory

This writes a report into `/tmp` and does not modify the repository:

```bash
cd ~/repos/Pepper_Stuff
find . -type f \( -iname '*.md' -o -iname '*.txt' -o -iname '*.pdf' \) \
  -not -path './.git/*' | sort > /tmp/pepper-document-inventory.txt
cat /tmp/pepper-document-inventory.txt
```

### 23.3 Look for duplicated guidance

```bash
grep -RInE 'Choregraphe|NAOqi|ALMemory|Pepper|QiSession' \
  --include='*.md' --include='*.txt' Pepper-Documentation 2>/dev/null || true
```

### 23.4 Record a precise source revision

```bash
cd ~/repos/Pepper_Stuff
git rev-parse HEAD
git log -1 --format='%H%n%aI%n%s'
```

Place this in the documentation as the **reviewed commit** during the next code-backed update. That prevents future confusion when project files change.

---

## 24. Documentation standards and templates

Every project-specific README should contain the following sections:

1. **Purpose:** Who uses the project and why.
2. **Status/evidence:** What has been inspected, run and tested.
3. **Hardware/software versions:** Pepper generation, NAOqi and Choregraphe.
4. **Exact repository paths:** `.pml` entry point, active `.xar`, HTML, media, config.
5. **Behaviour architecture:** Diagram of triggers, actions, completion/cancellation.
6. **Inputs and outputs:** Sensor triggers, button identifiers, `ALMemory` event keys and payloads.
7. **Dependencies:** Runtime services, packaged resources and optional tools.
8. **Setup/run instructions:** Tested commands and actions.
9. **Testing:** Expected results, actual results, status and tested commit.
10. **Known issues and safety:** What is incomplete or risky.
11. **Ownership/maintenance:** Last editor, review date and planned next task.
12. **References/licensing:** Upstream docs and third-party assets.

### Example header

```markdown
# Project Name

**Repository:** https://github.com/reeceherbert887/Pepper_Stuff
**Path:** `path/to/project`
**Reviewed commit:** `<git rev-parse HEAD>`
**Choregraphe version:** `2.5.5.5` (confirm on laptop)
**NAOqi version:** `TBC` (confirm on robot)
**Physical test:** Not run / Passed / Failed, date
**Maintainer:** Robotics Society

## Overview
Describe observed project purpose without assumptions.

## How to run
Write the exact entry point and steps.

## Known issues
Separate observed faults from untested risks.
```

### Writing recommendations

- Use relative paths for files inside the repository.
- Keep command blocks directly copyable, with clearly marked placeholders.
- Do not use “works” or “complete” for an untested behaviour.
- Separate factual implementation notes from desired improvements.
- Add screenshots of Choregraphe graphs only when they come from the actual project and capture the date/version.
- Prefer readable diagrams over enormous raw XML dumps.
- Keep Markdown guide updates in the same pull request/commit as the relevant code changes.

---

## 25. Maintenance and handover checklist

| Item | What must be recorded | Current documentation state |
|---|---|---|
| GitHub home | Repository URL and default branch | URL recorded; branch needs verification in live checkout |
| Development OS | Ubuntu release and desktop assumptions | Ubuntu known; exact current release to confirm |
| Choregraphe launcher | Binary path and version | `/opt/Choregraphe/choregraphe` previously used |
| Pepper version | Model, NAOqi version, IP acquisition method | **Unverified** |
| Freshers entry point | `.pml`, main graph and tablet files | Documented from earlier source review |
| Refreshers entry point | `.pml`, sensor/media graph | Documented from earlier source review |
| Robo Grad internals | `.pml`, assets, actual behaviour | **Outstanding** |
| `html_pepper` internals | Page listing, integration and entry | **Outstanding** |
| Documentation directory | Actual file list, duplicate guides | **Outstanding** |
| Safety | Physical movement/stop testing | Test record outstanding |
| Known issues | Symptoms, reproduction, severity | Need single maintained issue log |
| Handover | Contact role, demo procedure, fallback | Add after in-person test |

### Suggested next maintainer's first session

1. Inspect working tree and record its commit.
2. Create an inventory of files and projects.
3. Confirm the robot's hardware/NAOqi version.
4. Open Freshers and standalone Refreshers in Choregraphe **without editing anything**.
5. Trace one end-to-end event in Freshers.
6. Trace one touch-sensor branch in Refreshers.
7. Inspect Robo Grad and `html_pepper` before completing their guides.
8. Review the original `Pepper-Documentation/` files and merge duplicated instructions.
9. Run and record safe tests with a trained operator.
10. Update this guide with exact evidence and the tested commit.

---

## 26. Risk register

| Risk | Consequence | Likelihood before testing | Mitigation |
|---|---|---|---|
| Unsupported motion or overlapping animations | Physical collision or unsafe movement | Unknown | Test each path, enforce one-active-action policy and controlled stop |
| Tablet/robot state desynchronisation | Wrong screen or apparently stuck robot | Medium | Explicit acknowledgements, timeouts and robot-side cancel/reset |
| Wrong NAOqi/Choregraphe versions | Connection or service failures | Medium | Record exact versions; validate compatibility |
| Missing assets or wrong paths | Silent or incomplete demos | Medium | Inventory and package-check all resources |
| Sensor double triggers | Repeated or concurrent actions | Medium | Debounce and `busy`/state controls |
| Unlicensed third-party media | Redistribution or event-compliance risk | Unknown | Rights audit, restrict/remove assets where necessary |
| Oversized repository media | Failed pushes and slow onboarding | Medium | Compress media or use appropriate external/LFS storage |
| Lost institutional knowledge | Broken handover after committee change | High over time | Record runbook, troubleshooting, tests and ownership |
| Unverified documentation claims | Incorrect maintenance decisions | Medium | Source links, tested commit and verification labels |

These likelihood labels are **planning judgements**, not measured incident statistics.

---

## 27. Improvement roadmap

### Priority 1 — reliability and safety

- Verify the real-robot configuration and record it.
- Establish one reliable global **Stop/Reset** pathway for robot movements, sound and tablet media.
- Ensure only one potentially conflicting physical behaviour can run at a time.
- Introduce state acknowledgements so the tablet knows an action truly started or finished.
- Add an event-day acceptance test and a recovery procedure.

### Priority 2 — reproducible development

- Pin each documented review to a commit hash.
- Complete actual source inspections for `Robo Grad`, `html_pepper` and `Pepper-Documentation`.
- Keep a shared asset inventory and licence record.
- Standardise project README headers and testing evidence.
- Create a known-good event tag after successful physical testing.

### Priority 3 — maintainability and experience

- Make visitor buttons easier to understand and accessible.
- Add visible busy, success, failed and cancelled states.
- Record video/music fallback behaviour when media will not play.
- Separate robot-side control modules from presentation content where the legacy stack permits.
- Document safe extensibility for additional Robotics Society demonstrations.

---

## 28. Quick command reference

### Locate workspace

```bash
cd ~/repos/Pepper_Stuff
pwd
ls -lah
```

### Check Git status

```bash
git status --short
git branch --show-current
git log -1 --date=iso-strict --format='%H%n%ad%n%s'
```

### See full history

```bash
git log --all --date=iso-strict --pretty=format:'%h %ad %s'
```

### Find Choregraphe projects

```bash
find . -type f -iname '*.pml' | sort
```

### Find behaviours

```bash
find . -type f -iname '*.xar' | sort
```

### Find web files

```bash
find . -type f \( -iname '*.html' -o -iname '*.css' -o -iname '*.js' \) | sort
```

### Start Choregraphe

```bash
/opt/Choregraphe/choregraphe
```

### Inspect documentation area

```bash
find Pepper-Documentation -maxdepth 3 -type f | sort
```

### Preview verified Freshers HTML locally

```bash
cd ~/repos/Pepper_Stuff/Pepper-Freshers/html
python3 -m http.server 8000 --bind 127.0.0.1
```

### Back up repository

```bash
mkdir -p ~/Pepper_Backups
tar -czf ~/Pepper_Backups/Pepper_Stuff_$(date +%Y%m%d).tar.gz \
  -C ~/repos Pepper_Stuff
```

---

## 29. Glossary

**ALMemory** — NAOqi service for named memory values and event-based communication.  
**ALMotion** — NAOqi service for robot motion.  
**ALTabletService** — NAOqi service for controlling Pepper's legacy tablet content.  
**Behaviour** — A Choregraphe sequence composed of connected boxes and/or embedded code.  
**Box** — A reusable element of a Choregraphe graph.  
**Choregraphe** — Visual programming environment for supported Aldebaran/SoftBank robots.  
**Event key** — Named `ALMemory` notification such as `PepperFreshers/DanceSelected`.  
**Handover** — Documentation and evidence enabling another developer to operate/maintain the project.  
**Manifest** — Project/application metadata defining identity and exposed behaviours.  
**NAOqi** — Software platform providing Pepper robot services and APIs.  
**`.pml`** — Choregraphe project descriptor.  
**`.pmt`** — Planar movement trajectory file.  
**Python box** — Choregraphe box containing scripting logic, often designed for legacy Python.  
**QiSession** — JavaScript-side interface for connecting tablet applications to robot services.  
**Robot-side stop** — Actual cancellation/termination of an executing robot behaviour, distinct from leaving a tablet screen.  
**Tablet WebView** — Built-in web content display surface on supported Pepper software.  
**`.xar`** — Choregraphe behaviour/graph storage file.

---

## 30. External references and project links

### Original workspace

- [Pepper_Stuff repository](https://github.com/reeceherbert887/Pepper_Stuff)
- [Pepper Freshers directory](https://github.com/reeceherbert887/Pepper_Stuff/tree/main/Pepper-Freshers)
- [Standalone Refreshers directory](https://github.com/reeceherbert887/Pepper_Stuff/tree/main/Refreshers%201/Refreshers)
- [Robo Grad directory](https://github.com/reeceherbert887/Pepper_Stuff/tree/main/Robo%20Grad)
- [html_pepper directory](https://github.com/reeceherbert887/Pepper_Stuff/tree/main/html_pepper)
- [Pepper-Documentation directory](https://github.com/reeceherbert887/Pepper_Stuff/tree/main/Pepper-Documentation)

### Legacy Pepper / Choregraphe background

- [United Robotics Group — Pepper developer documentation](https://unitedrobotics.group/en-us/robots/pepper/documentation) — distinguishes Pepper 2.5/NAOqi Python development from Pepper 2.9 Android/QiSDK.
- [Aldebaran 2.5 documentation — Choregraphe project structure](https://www.arabicrobotics.com/Aldebaran/aldeb-doc-2.5.7.1/software/choregraphe/objects/choregraphe_project.html) — reference for `.pml`, project files and project packaging.
- [Aldebaran 2.5 documentation — Behaviours](https://www.arabicrobotics.com/Aldebaran/aldeb-doc-2.5.7.1/software/choregraphe/objects/behavior.html) — explanation of Choregraphe boxes and behaviour graphs.
- [Aldebaran 2.5 documentation — Creating an application](https://www.arabicrobotics.com/Aldebaran/aldeb-doc-2.5.7.1/getting_started/creating_applications/index.html) — background on creating Choregraphe applications.
- [Aldebaran `ALTabletService` Java wrapper](https://github.com/aldebaran/jnaoqi/blob/master/src/main/java/com/aldebaran/qi/helper/ALTabletService.java) — API method names such as `loadApplication`, `showWebview` and `hideWebview`; verify version compatibility before adapting.

**Provenance note:** External pages above describe the platform and API patterns; they are **not substitutes for reading this repository's source or testing its actual robot behaviour**. The original `Pepper-Documentation/` contents need to be checked from a clone or a working connected repository before issuing a fully source-verified revision.

---

## Document status summary

This handbook is usable as a **development, troubleshooting and maintenance reference** today. Freshers and standalone Refreshers have prior source-backed companion guides; Robo Grad, `html_pepper` and the current `Pepper-Documentation/` contents still require a file-level review. After inspecting the local repository, add the exact commit hash, a documentation inventory, robot firmware version and the results of supervised physical tests. Until then, treat unverified items as planned checks rather than implemented or proven features.
