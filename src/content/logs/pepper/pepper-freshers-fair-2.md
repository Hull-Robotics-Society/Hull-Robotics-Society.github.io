---
title: "Pepper at Refreshers"
slug: pepper/pepper-freshers-fair-2
project: pepper
date: 2026-10-12
excerpt: "The standalone Refreshers demo: what it does and how to launch it."
aiAssisted: true
---
**Project:** Pepper Refreshers — interactive Pepper robot demonstration  
**Repository:** [reeceherbert887/Pepper_Stuff](https://github.com/reeceherbert887/Pepper_Stuff)  
**Repository path:** `Refreshers 1/Refreshers/`  
**Local path:** `~/repos/Pepper_Stuff/Refreshers 1/Refreshers/`  
**Reviewed:** 8 October 2026  
**Review method:** Inspection of the public `main` branch's Choregraphe package definition, manifest and main behaviour XML. No physical robot test was performed and no specific commit was pinned.  
**Status:** Source-based documentation, not a claim that every feature has passed a test on Pepper.

---

## 1. Executive summary

**Refreshers** is a standalone, event-oriented demonstration for the SoftBank Robotics Pepper humanoid robot. Unlike the separate **Pepper-Freshers** tablet quiz application, this project is primarily operated by **touch and proximity-related interaction with the robot's built-in sensors** rather than a custom HTML navigation menu. The Choregraphe behaviour coordinates short speeches, sound effects, recorded motion timelines, eye and ear LEDs, images and video shown on Pepper's tablet.

The project is intended for supervised demonstrations of Pepper's interactive capabilities: attendees can engage with the robot while it responds with spoken introductions, expressive animations, a musical performance, multimedia, and Robotics Society materials. The package includes resources for a Bee Gees-themed video, a Rick Roll video, a Hull Robotics Society Christmas video, images/GIFs, music and motion sequences.

### Primary objectives

1. Demonstrate Pepper's head, hand, bumper and tablet touch input.
2. Use Choregraphe to connect sensor events to appropriate animations or speeches.
3. Use Pepper's tablet as a presentation/display surface for images and local video files.
4. Combine physical movement, speech, lights and sound into engaging visitor-facing sequences.
5. Provide a maintainable Choregraphe package that can be opened, inspected and modified by Robotics Society members.

### What can be confirmed from source

- A Choregraphe project named `Refreshers` and an interactive behaviour are declared.
- The graph contains tactile head, right-hand, left-hand, tablet-touch and bumper listener boxes.
- The graph contains speech, waiting/delay, timeline animation, lighting, audio, image and video boxes.
- Its main graph references **Disco Animation**, **Thinking Animation**, **Headbang Animation**, video playback and other behaviour sequences.
- The tablet playback components call `ALTabletService` and listen for playback-completion events.
- Sound and motion resources are declared in `Refreshers.pml`.

**Verification boundary:** The available project XML establishes which boxes and wiring exist, but actual sensor responsiveness, media decoding, movement clearance, start-to-finish execution and robot-side compatibility must still be tested. The original repository root README provides no setup detail beyond its title.

---

## 2. Relationship to Pepper-Freshers

The repository contains **two distinct projects** that should not be confused:

| Aspect | Standalone Refreshers | Pepper-Freshers |
|---|---|---|
| Project file | `Refreshers 1/Refreshers/Refreshers.pml` | `Pepper-Freshers/Pepper-Freshers.pml` |
| Main interaction | Touch sensors, tablet touches, scripted chains | Visitor-facing tablet menu and quiz |
| Core workflow | Choregraphe boxes wired directly to sensor events | JavaScript raises `ALMemory` events handled in Choregraphe |
| Tablet use | `ALTabletService` displays media directly | HTML/CSS/JavaScript application |
| Maintenance | Edit Choregraphe sensor links, timelines and media-box parameters | Edit tablet JS/CSS/HTML and event routing plus robot behaviour |

There is a *Refreshers section inside Pepper-Freshers*, but that does **not** mean the projects are identical or that the standalone `Refreshers.pml` is invoked as a separate application automatically. To reuse a behaviour from this standalone project in Freshers, import or copy the appropriate Choregraphe boxes, bring required resources across and wire the events in the master project; do not assume nested `.pml` launch support.

---

## 3. Technology and runtime environment

| Layer | Technology | Responsibilities |
|---|---|---|
| Robot hardware | Pepper | Motion, touch input, head/arms, speaker, LEDs, tablet |
| Behaviour development | Choregraphe | Graphical behaviour sequencing and motion timelines |
| Runtime services | NAOqi | Access to sensors, motion, media and presentation services |
| Language | Embedded Choregraphe Python scripts | Start/stop callbacks and media/service calls |
| Robot speech | `ALAnimatedSpeech` | Speech synchronized with selected gestures |
| Video/images | `ALTabletService` | Display images; play, pause, resume and stop video |
| Sound | `ALAudioPlayer` | Load/play project audio resources |
| Robot movement | Choregraphe timelines and `ALMotion` | Animate body joints; move/turn base where configured |
| Lighting | `ALLeds` / timeline LED boxes | Eye and ear colour/intensity effects |
| Input events | Choregraphe memory-connected sensor inputs | React to head, hand and bumper signals |
| Package metadata | `.pml`, `manifest.xml` | Define resources, default behaviour and package identity |

Many embedded scripts are written for the older Choregraphe/NAOqi Python environment. **They are not intended to be executed as ordinary Python 3 scripts** with `python behavior.xar`; `.xar` is XML describing a Choregraphe graph, not a Python script.

---

## 4. Repository structure

The following is a **source-backed partial structure** based on files successfully opened and resource paths declared in `Refreshers.pml`. Confirm actual binary file presence locally before a demonstration.

```text
Pepper_Stuff/
└── Refreshers 1/
    └── Refreshers/
        ├── Refreshers.pml
        ├── manifest.xml
        ├── behavior_1/
        │   ├── behavior.xar
        │   ├── swiftswords_ext.mp3        # Declared resource
        │   ├── taichimove.pmt             # Declared motion resource
        │   ├── epicsax.ogg               # Declared resource
        │   └── behavior_1/
        │       └── heaven1.ogg           # Declared nested resource
        ├── html/
        │   ├── gd.gif                    # Declared GIF
        │   ├── preview.jpg               # Declared image
        │   ├── robsoc.jpg                # Declared Robotics Society image
        │   ├── Rick Roll Link.mp4        # Declared video
        │   ├── HullRS_Christmas_2025.mp4 # Declared video
        │   └── Bees_Gees.mp4            # Declared video
        └── translations/
            └── translation_en_US.ts     # Declared translation
```

### 4.1 `Refreshers.pml`

The package definition begins as a Choregraphe package with `name="Refreshers"` and `format_version="4"`. It defines one behaviour (`behavior_1/behavior.xar`) and lists resources and translations. Choregraphe uses this file as the entry point; **open the `.pml`, not a media file or the `.xar` as a loose standalone project.**

### 4.2 `manifest.xml`

The manifest identifies package UUID `refreshers-3cec73`, version `0.0.0`, English language `en_US`, and one `interactive` behaviour marked `userRequestable`. Its visible name is currently **`Untitled`**. That is a package-polish issue, not necessarily a runtime error: a descriptive application name and version would be better for other maintainers.

### 4.3 `behavior_1/behavior.xar`

This is the main implementation. It is an XML representation of Choregraphe boxes, parameters, Python code, inputs/outputs, links, timelines and joint curves. It contains the functional behaviour graph; editing it manually as raw XML is riskier than editing in Choregraphe, because box IDs and link owners must remain consistent.

### 4.4 Media and motion assets

The `.pml` has explicit resource declarations for video, sound and images. A declaration alone does not prove that a media file decodes on Pepper, and a matching file on your laptop does not prove it was uploaded to the robot. Pay special attention to **case-sensitive filenames, spaces, extensions, folder names and relative paths**.

---

## 5. System architecture

Conceptually, the behaviour follows this model:

```text
                    Visitor interacting with Pepper
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
  Head / hand sensors      Tablet touch          Base bumpers
          │                     │                     │
          └─────────────────────┼─────────────────────┘
                                ▼
                  NAOqi sensor/event updates
                                ▼
                   Choregraphe trigger boxes
                                ▼
                        Behaviour links
                                ▼
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
   Animated speech      Motion / lighting       Media playback
   ALAnimatedSpeech     Timelines / ALLeds      Tablet / audio
          │                     │                     │
          └─────────────────────┼─────────────────────┘
                                ▼
                   Completion / follow-up box
```

The main difference from a traditional sequential program is that Choregraphe can **launch separate branches when different events fire**. A tactile event may pass through a guard (`If > 0`) to avoid triggering on release, then trigger speech/animation boxes. Other branches use completion outputs, timer outputs and video start/finished callbacks.

### 5.1 Inputs, outputs and links

Typical Choregraphe box ports:

- `onStart` — start an activity.
- `onStop` — request cancellation/cleanup.
- `onStopped` — a finished/stopped signal (semantics depend on the box).
- `timerOutput` — send a signal after a configured delay.
- `onStarted` — a video box has started playback.
- `onTouched` — a tablet touch event, potentially with coordinates.
- `onLeft`, `onRight`, or similar — specific physical sensor channel outputs.

A box may show or send `onStopped` after **normal completion or an error**. Do not assume that event always means media played successfully.

---

## 6. Sensor inputs and event detection

### 6.1 Head tactile sensors

The source contains a `01 Head Touch Trigger` box with bindings named `FrontTactilTouched`, `MiddleTactilTouched` and `RearTactilTouched`. The box exposes individual outputs for front, middle and rear touches. Its nested `If > 0` boxes test that the sampled tactile state is positive before forwarding events.

**Why the positive-value check matters:** Many touch sensors send a value when touched and another when released. Without checking the state, a visitor might trigger an activity twice by touching and releasing once.

### 6.2 Right-hand tactile sensors

There is a `02 Right Hand Trigger` box. Its multiple sensor-specific outputs allow distinct hand-touch gestures to activate downstream boxes. The main behaviour includes timing delays and speeches associated with hand-trigger branches.

### 6.3 Left-hand tactile sensors

The left-hand trigger uses NAOqi event names including:

```text
HandLeftLeftTouched
HandLeftBackTouched
HandLeftRightTouched
```

The corresponding Choregraphe box routes them to `leftTouched`, `backTouched` and `rightTouched` outputs. Its nested guard boxes again forward events only when the sensor state is above zero.

### 6.4 Tablet touch

The `Tablet Touch Trigger` uses the `ALTabletService` `onTouch` signal and forwards touch coordinates through its `onTouched` output. Its action parameter supports:

```text
On touch move
On touch down
On touch up
```

The reviewed value is **`On touch move`**. That is an important design detail: sliding a finger or repeatedly generating touch-move updates may trigger more than once. A deliberate tap-only interface would generally use `On touch down`, plus suitable debouncing or a state guard. **Test before changing it**, because it could alter the original interaction.

### 6.5 Base bumpers

The `04 Bumper Trigger` listens for `LeftBumperPressed` and `RightBumperPressed`. It provides `onLeft` and `onRight` outputs, and at least one bumper branch is wired to the `Headbang Animation` in the source graph.

**Safety consideration:** A bumper is a contact sensor on the robot's mobile base. Do not instruct visitors to kick, strike or forcefully press it. If you demonstrate this interaction, supervise carefully and stop the robot first if base movement could create contact hazards.

---

## 7. Speech and spoken presentation

Several graph boxes invoke `ALAnimatedSpeech`. Examples include:

- `Head Intro Speech`
- `Video Follow-up Speech`
- `Left Hand Speech`
- `LED Sequence Speech`
- `Rick Roll Follow-up Speech`

An extracted configured introduction begins with Pepper introducing itself and mentioning that it can play the saxophone. Another configured speech says Pepper can dance. The Rick Roll follow-up speech includes a transition into Robotics Society activities.

### 7.1 How speech works

The scripted speech box takes an editable **Text** parameter, reads options such as speed, voice shaping and movement mode, and then submits the utterance to `ALAnimatedSpeech`. When speech playback completes, it emits `onStopped` to allow the next box to run.

The behaviour uses the following conceptual pattern:

```python
# Simplified explanation: not copied as a runnable stand-alone module
speech = ALProxy('ALAnimatedSpeech')
speech.say('Hello! Welcome to the demonstration.')
```

The actual Choregraphe boxes use asynchronous `post.say(...)`, wait for completion and have cleanup paths that attempt to stop running speech. They can also apply gesture commands such as `Stand/Gestures/Hey_2`.

### 7.2 Editing speech safely

1. Open `Refreshers.pml` in Choregraphe.
2. Select the required speech box in the main graph.
3. Find its **Text** parameter.
4. Update the words; keep spoken sentences relatively short for public demonstrations.
5. Check the movement mode: contextual, random or disabled.
6. Save a copy and test on a virtual robot first, then on Pepper.

Avoid directly changing the `.xar` unless you are deliberately manipulating XML and have a validated backup.

---

## 8. Motion and animation sequences

### 8.1 Disco Animation

The main graph includes a **Disco Animation** box containing a 25-fps timeline and joint-keyframe curves. It animates head orientation, torso posture, arms, wrists, hands and related joints. The declared timeline length is 412 frames (roughly 16.5 seconds of timeline data); this is not a guaranteed observed runtime or proof that the robot physically completed it.

### 8.2 Thinking Animation

A separate **Thinking Animation** box provides a short posture/gesture sequence, again with keyframe curves. Its declared timeline length is 140 frames at 25 fps (roughly 5.6 seconds of timeline data).

### 8.3 Headbang Animation

A **Headbang Animation** box is present and wired to a bumper-trigger branch. It has a 25-fps motion timeline with approximately 301 frames. The graph also includes eye-LED effects in a nested part of this animation.

### 8.4 Other motion resources

The project declares `taichimove.pmt` and contains trajectory-based and Choregraphe motion boxes. `ALMotion` is used in a **Move To** box; the reviewed parameters include a rotation of **−30°** in one movement keyframe. This means some movement code may change the robot's physical orientation, not just wave its arms.

**Critical safety check:** Clear the area around Pepper, pay attention to the robot's base and arm sweep, verify mobility state, and use supervision when enabling timeline/Move To branches. Previewing a gesture is not a substitute for physical collision-clearance testing.

### 8.5 Stop behaviour

Motion timelines and move commands must be checked for how their `onStop` inputs behave. Some resources have lock declarations such as `Standing`, `All motors`, `Legs` and head/arm sequence locks. Those help coordinate resource use, but they do not replace a tested operator-accessible stop and safe physical supervision.

---

## 9. Audio playback

The project uses audio assets and an `ALAudioPlayer` box. One configured music reference is `/epicsax.ogg`; the `.pml` additionally declares `swiftswords_ext.mp3` and `heaven1.ogg`. The audio box exposes file path, playback position, balance, volume and loop settings.

The embedded pattern is equivalent to:

```python
# Illustrative only; execute inside a compatible NAOqi environment
player = ALProxy('ALAudioPlayer')
player.playFile('/absolute/path/to/file.ogg')
```

In the project, the file is normally resolved from a **packaged resource path** rather than an arbitrary laptop path. A mismatch between the configured value and uploaded package path results in silence or a playback error.

**Audio troubleshooting:** verify that the source file exists, is referenced correctly, is supported by the robot's audio stack, and that volume is appropriate for a public setting. Test files one at a time.

---

## 10. Tablet video playback

The code contains three named media boxes and their configured filenames:

| Choregraphe box | Configured file |
|---|---|
| `Play Bee Gees Video` | `Bees_Gees.mp4` |
| `Play Rick Roll Video` | `Rick Roll Link.mp4` |
| `Play HullRS Christmas Video` | `HullRS_Christmas_2025.mp4` |

The media files are declared under `html/` by the package definition. **The name `html/` here is a resource container; it does not mean this project uses the Freshers custom quiz frontend.**

### 10.1 How a video is started

Each video box obtains `ALTabletService`, reads its configured `VideoPath`, turns a local package resource into a tablet URL (if necessary), and calls `playVideo(url)`. It connects to two playback callbacks:

```text
videoStarted  → onStarted
videoFinished → onStopped
```

The box also exposes pause/resume inputs and calls `stopVideo()` when unloaded/stopped.

### 10.2 Common video errors

- File is missing from `html/` or was not transferred to Pepper.
- Name differs by case, whitespace or extension.
- Video codec/profile is unsupported by the older Pepper tablet runtime.
- The tablet service is unavailable or media URL cannot be formed.
- Two media boxes attempt to use the tablet simultaneously.
- A stale callback or sequence is left active after cancelling.

Use a locally installed `ffprobe` to inspect file metadata and compare working/nonworking files; do not presume every `.mp4` will play merely because it works in a desktop browser.

---

## 11. Tablet images and GIFs

The behaviour contains `Show GIF on Tablet` and `Show RobSoc Image` display boxes. Configured resource names include `gd.gif` and `robsoc.jpg`. A `preview.jpg` is also declared in the package.

The display boxes call the tablet service's `showImage(url)`; they also include `hideImage()` and `preLoadImage(url)` helper inputs. This allows a multimedia sequence to present a graphical introduction or Robotics Society branding between movement, music and video events.

**Implementation note:** If an image remains after a new sequence starts, check whether the current branch triggers `onHideImage`/`onStop`. Showing a new image is not always equivalent to removing the prior presentation state.

---

## 12. LEDs and expressive visual feedback

The main graph contains eye and ear LED boxes and a named `LED Sequence Speech`. Some animated routines call `ALLeds.fadeRGB`/`ALLeds.post.fadeRGB` to change facial LEDs during an animation.

Lighting adds visual feedback when a visitor touches the robot or when music is playing. These effects can be useful in a noisy environment because guests can see a response even if speech is hard to hear.

When changing lighting code:

1. Start with a short, non-looping test sequence.
2. Confirm the colour values and targets (eyes versus ears).
3. Ensure a loop has a working `onStop`/`onUnload` path.
4. Verify lights restore to an appropriate idle state afterwards.

The source includes loops controlled by flags such as `bMustStop`, so lifecycle cleanup is especially important.

---

## 13. Behaviour lifecycle and sequencing

A typical triggered branch in the source follows a pattern like:

```text
Robot input changes
       │
       ▼
Sensor trigger box
       │
       ▼
Check sensor state (> 0 where appropriate)
       │
       ▼
Speech / delay / gesture / media
       │
       ▼
Box completion output
       │
       ▼
Optional follow-up box
```

### 13.1 Start

The root `onStart` activates the entry-point branches and subscriptions. Touch-sensing boxes begin listening for relevant sensor values.

### 13.2 Running

An input starts a branch. Its next step can be driven by a speech ending, a timer, video starting/finishing, a sensor touch or another animation completing.

### 13.3 Completion

A box generally sends `onStopped`, `timerOutput` or a named output. **Watch out for completion outputs that can fire in error paths**, including video-box cases where `ALTabletService` is unavailable.

### 13.4 Stop

A proper stop should halt motion, active audio, playback and any applicable callbacks/subscriptions. The video boxes do implement `stopVideo()` cleanup, while speech and LED boxes have stop/unload handlers. The integration-level behaviour under simultaneous triggers or repeated starts still needs hands-on testing.

---

## 14. How to open and run on Ubuntu

### 14.1 Open the local repository

If you have already cloned your repository:

```bash
cd ~/repos/Pepper_Stuff

git status

git pull --ff-only
```

If you need a new clone, from a writable parent directory:

```bash
mkdir -p ~/repos
cd ~/repos
git clone https://github.com/reeceherbert887/Pepper_Stuff.git
```

### 14.2 Navigate to this specific project

Because the directory names contain spaces, use quotes:

```bash
cd ~/repos/Pepper_Stuff/'Refreshers 1/Refreshers'
pwd
ls -lah
```

### 14.3 Launch Choregraphe

On your previously used Ubuntu installation, the Choregraphe launcher is:

```bash
/opt/Choregraphe/choregraphe
```

If the binary is not there, inspect the installation location rather than guessing. Open `Refreshers.pml` using **File → Open project** inside Choregraphe.

### 14.4 Configure robot connection

1. Power on Pepper and confirm its network connection.
2. Connect your Ubuntu computer to the same reachable network.
3. In Choregraphe, connect to Pepper at the IP address reported by your robot.
4. Confirm the connected robot model is **Pepper**, not NAO.
5. Open the main behaviour graph and inspect missing-resource warnings.
6. Test low-risk speech/tablet outputs before enabling movement.
7. With the area clear and an operator present, start the root behaviour.
8. Trigger one sensor interaction at a time and observe results.

**Do not claim a successful deployment until the specific physical robot has been tested.**

### 14.5 Inspect locally without moving Pepper

```bash
cd ~/repos/Pepper_Stuff/'Refreshers 1/Refreshers'
find . -maxdepth 3 -type f | sort
```

The available XML can be checked for well-formedness with:

```bash
python3 - <<'PY'
from pathlib import Path
import xml.etree.ElementTree as ET
for item in ('Refreshers.pml', 'manifest.xml', 'behavior_1/behavior.xar'):
    ET.parse(item)
    print('XML OK:', item)
PY
```

This validates XML syntax only. It does **not** check graph logic, hardware connectivity, service compatibility or movement safety.

---

## 15. Inspect the graph and its code programmatically

The main `.xar` is XML. You can list its named boxes without opening Choregraphe:

```bash
cd ~/repos/Pepper_Stuff/'Refreshers 1/Refreshers'
python3 - <<'PY'
from collections import Counter
import xml.etree.ElementTree as ET
root = ET.parse('behavior_1/behavior.xar').getroot()
for box in root.iter():
    if box.tag.split('}')[-1] == 'Box':
        print('ID:', box.get('id'), '|', box.get('name'))
PY
```

IDs repeat inside nested graphs: interpret a box ID **relative to its parent `Diagram`**, not as a globally unique ID. For detailed tracing, open the box diagram in Choregraphe and inspect its wires and input/output labels.

### Check declared media paths

```bash
find . -type f \( -iname '*.mp4' -o -iname '*.ogg' -o -iname '*.mp3' -o -iname '*.pmt' -o -iname '*.gif' \) -print
```

### Inspect video codec information

```bash
sudo apt install ffmpeg
ffprobe -hide_banner 'html/Bees_Gees.mp4'
ffprobe -hide_banner 'html/Rick Roll Link.mp4'
ffprobe -hide_banner 'html/HullRS_Christmas_2025.mp4'
```

`ffprobe` will fail if the file is missing; that is itself useful diagnostic information.

---

## 16. Testing strategy

Prefer **incremental testing** over immediately running the entire demonstration:

1. Validate `.pml`, manifest and `.xar` parse correctly.
2. Open the Choregraphe project with no missing-file warnings.
3. Test a single `ALAnimatedSpeech` box.
4. Test a static tablet image.
5. Test one short video and completion callback.
6. Test a basic eye LED effect.
7. Verify one head-touch input and that release does not retrigger it.
8. Test each hand input independently.
9. Test tablet touch and watch for repeated on-move events.
10. Test bumper contacts only under supervised, low-force conditions.
11. Preview a single non-base-moving animation.
12. Test the Move To/rotation branch only in a suitable cleared space.
13. Trigger two interactions close together to look for overlap/conflicts.
14. Stop a video mid-playback, then restart the demonstration.
15. Stop a speech/LED animation mid-cycle and verify cleanup.
16. Repeat all event scenarios after a fresh restart.

### 16.1 Suggested test table

| ID | Test | Expected result | Pass/fail |
|---|---|---|---|
| RF-01 | Project opens | No resource errors or missing graph boxes | [ ] |
| RF-02 | Robot connection | Pepper is reachable in Choregraphe | [ ] |
| RF-03 | Head front/middle/rear | Intended branch responds once per press | [ ] |
| RF-04 | Right-hand regions | Correct action is selected | [ ] |
| RF-05 | Left-hand regions | Correct action is selected | [ ] |
| RF-06 | Tablet tap/move | Touch listener fires as intended | [ ] |
| RF-07 | Left/right bumper | Correct branch without unsafe impact | [ ] |
| RF-08 | Spoken introduction | Clear output and successful completion | [ ] |
| RF-09 | Disco animation | Safe movement sequence completes | [ ] |
| RF-10 | Thinking animation | Safe movement sequence completes | [ ] |
| RF-11 | Headbang animation | Safe movement and stop work | [ ] |
| RF-12 | Bee Gees video | Playback and callback work | [ ] |
| RF-13 | Rick Roll video | Playback and callback work | [ ] |
| RF-14 | Christmas video | Playback and callback work | [ ] |
| RF-15 | GIF and image | Media displays without blank screen | [ ] |
| RF-16 | Audio resources | Correct soundtrack volume and timing | [ ] |
| RF-17 | LED sequence | Lights change and recover | [ ] |
| RF-18 | Stop/restart | No ghost audio/video/animation remains | [ ] |
| RF-19 | Back-to-back inputs | No overlapping dangerous behaviours | [ ] |
| RF-20 | Full visitor run | Each intended interaction works repeatedly | [ ] |

Record robot model/firmware, Choregraphe version, date, starting posture, file revision and any error messages when evaluating tests.

---

## 17. Troubleshooting guide

### 17.1 Choregraphe opens a blank or broken project

Check that you open the `.pml` file from the correct folder, retain folder structure and resources, and use a Choregraphe version compatible with the robot. Validate the XML as shown above. If the simulator displays NAO rather than Pepper, check the robot model selected in Choregraphe and whether you opened the intended Pepper package.

### 17.2 Touching Pepper produces no response

Check that the root behaviour is running, the relevant trigger box has been started, the input event is available, and the outgoing wire is connected. Inspect live event values if your Choregraphe runtime exposes them. Touch-release and touch-move may have different values or repeated callbacks.

### 17.3 Pepper speaks but a video never appears

Check `ALTabletService`, resources, the package URL and the tablet screen. Validate file presence and codec. A `VideoPath` parameter such as `Bees_Gees.mp4` must resolve to the correct packaged media file.

### 17.4 Video plays but follow-up never starts

Check that `videoStarted`/`videoFinished` callbacks are firing. Examine whether the next box is wired from `onStarted` versus `onStopped`. Stopping a video early and letting it finish naturally are different paths.

### 17.5 Sound does not play

Check the path used by `ALAudioPlayer`, especially `epicsax.ogg` and other packaged resources. Make sure the speaker is not muted, no other audio task is monopolising output, and sound was uploaded with the project.

### 17.6 Animations overlap or Pepper behaves unpredictably

Stop the behaviour. Check for multiple sensor triggers firing while another branch is already active. The graph contains locks, but overlapping event streams should still be handled deliberately. Introduce a busy/idle gate before starting a new motion sequence if necessary.

### 17.7 Video/image persists after stopping

Confirm the relevant `onStop` signal reaches the media box. `playVideo` boxes have a `stopVideo` cleanup path, while image boxes have `hideImage` inputs. Some branches may need explicit cleanup wires.

### 17.8 LEDs do not return to normal

Check whether a repeating LED script exited its `while not bMustStop` loop, and whether the stop signal reached that box. Restart from a safe idle state and test the lighting branch alone.

### 17.9 An updated media file does not appear on Pepper

Save/repackage/upload the project again, not just the local video. Verify cache effects and filename consistency. Avoid changing the extension without changing the behaviour parameter.

### 17.10 File names containing spaces break command lines

Always quote paths:

```bash
cd ~/repos/Pepper_Stuff/'Refreshers 1/Refreshers'
ls -lh 'html/Rick Roll Link.mp4'
```

---

## 18. Code review findings and development risks

### 18.1 Touch-move can produce repeated activation

`Tablet Touch Trigger` is configured as `On touch move`. For a visitor interface, this can generate many updates per interaction. Consider a tap-trigger mode or a debounce/busy state if repeated starts are occurring, but test compatibility first.

### 18.2 Some media callbacks signal completion on error

The reviewed video code emits `onStopped` when a tablet service is unavailable or playback fails. Downstream logic that treats every `onStopped` as success may advance unexpectedly. A more robust future architecture would separate **success**, **cancel** and **error** outcomes.

### 18.3 Multiple activities may compete for resources

Speech, sound, tablet playback, LEDs and motion can be started from separate sensor branches. Check whether a new interaction is allowed while one is running; do not rely on every sub-box's internal `isRunning` flag to serialize the *whole* project.

### 18.4 Resource declarations need validation

Resources in the `.pml` should exist in the corresponding relative paths. The unusual nested declaration `behavior_1/behavior_1/heaven1.ogg` deserves particular attention; verify the real file location before correcting anything.

### 18.5 Manifest metadata is unfinished

The manifest currently uses a visible title `Untitled` and version `0.0.0`. For a shared Robotics Society project, consider a descriptive title, maintained semantic version and a brief description.

### 18.6 Movement includes base rotation

A `Move To` branch includes a −30° heading change parameter. Unlike static arm gestures, this may change Pepper's orientation. Validate free space and behaviour stop before any public demonstration.

### 18.7 Legacy runtime dependence

Older NAOqi/Choregraphe script syntax and asynchronous runtime assumptions can be incompatible with current Python 3 or newer library environments. Maintain the original working Choregraphe/robot firmware pairing when testing, and migrate only with targeted tests.

### 18.8 Licensing and redistribution of entertainment media

The project declares commercial audio/video media, including recognisable songs/entertainment clips. Ownership of the code repository does not automatically confer permission to publicly redistribute or commercially use third-party music or video. Check rights and university event policy before publishing or exhibiting these assets.

---

## 19. Safe event-day procedure

### Before opening

- [ ] Check battery charge and Pepper stability.
- [ ] Inspect the area for obstacles and bystanders within arm/base movement distance.
- [ ] Confirm robot and operator computer can communicate.
- [ ] Open the correct `Refreshers.pml`.
- [ ] Verify image, video, audio and speech outputs separately.
- [ ] Test stop/restart once.
- [ ] Tell attendants which sensors visitors may safely touch.

### During the demonstration

- [ ] Keep a trained operator at the computer/robot.
- [ ] Avoid touching or forcing the bumper during base motion.
- [ ] Allow each routine to complete before inviting the next trigger unless overlap handling has been tested.
- [ ] Monitor audio volume and unexpected movement.
- [ ] Stop the behaviour immediately if motion space becomes obstructed.

### After the demonstration

- [ ] Stop active motion/media tasks in Choregraphe.
- [ ] Verify LEDs/audio/video are no longer running.
- [ ] Record any unexpected behaviour and the triggering sensor.
- [ ] Commit tested improvements with meaningful messages.
- [ ] Shut down/charge Pepper using the normal operating procedure.

---

## 20. Maintainability and future enhancements

### Priority A — reliability

1. Implement a single controller state: `IDLE`, `RUNNING`, `STOPPING`, `ERROR`.
2. Reject or queue touch triggers while motion is already active.
3. Establish one verified stop/reset route for animations, audio, tablet video and images.
4. Separate media completion signals from failures and user cancellations.
5. Validate asset existence and provide a clear message when a resource is missing.

### Priority B — audience experience

1. Add a simple welcome panel explaining where visitors can touch Pepper.
2. Provide visual feedback for busy/ready states on the tablet and LEDs.
3. Add consistent spoken transitions between entertainment items.
4. Make the Robotics Society image/QR presentation easy to access from idle.
5. Use accessible volume, captions or on-screen explanations for a busy event space.

### Priority C — project handover

1. Rename the package from `Untitled` to a descriptive release title.
2. Document the intended trigger-to-action map after testing all physical sensors.
3. Add a licence and clarify third-party media use.
4. Capture robot firmware and supported Choregraphe version.
5. Keep source, media and Choregraphe outputs in version control with appropriate handling for large files.

### Suggested branch naming

```bash
cd ~/repos/Pepper_Stuff
git checkout -b docs/refreshers-guide
# Add / edit documentation
git add 'Refreshers 1/Refreshers/README.md'
git commit -m 'Document Pepper Refreshers setup and behaviour'
```

This example does not upload the guide automatically; copy the generated Markdown into the destination README path first and push only after reviewing your changes.

---

## 21. Source references and validation notes

These links point to the original, publicly accessible project resources on the reviewed `main` branch:

1. [Repository home](https://github.com/reeceherbert887/Pepper_Stuff)
2. [Refreshers.pml — package and resource definitions](https://raw.githubusercontent.com/reeceherbert887/Pepper_Stuff/main/Refreshers%201/Refreshers/Refreshers.pml)
3. [manifest.xml — package metadata](https://raw.githubusercontent.com/reeceherbert887/Pepper_Stuff/main/Refreshers%201/Refreshers/manifest.xml)
4. [behavior_1/behavior.xar — full main behaviour XML](https://raw.githubusercontent.com/reeceherbert887/Pepper_Stuff/main/Refreshers%201/Refreshers/behavior_1/behavior.xar)
5. [Pepper-Freshers project](https://github.com/reeceherbert887/Pepper_Stuff/tree/main/Pepper-Freshers) — related but separate application.

**Verified:** Project file, manifest, Choregraphe box and script names, parameter values, declared resources and example event/service calls.  
**Inferred from implementation:** Audience workflow, intended sequencing and possible failure modes.  
**Not independently tested:** Real sensor assignment outcomes, all video codecs and binary file availability, physical movement completion, timing on robot, and overall event-day reliability.  
**Important:** Repository `main` may change after this review. Pin a Git commit hash if the documentation must describe a reproducible release.

---

## 22. Short technical summary

**Pepper Refreshers** is a Choregraphe/NAOqi interactive demonstration using Pepper's head, hand, bumper and tablet touch events to trigger speech, motion timelines, audio, tablet images/videos and light effects. Its main `behavior_1/behavior.xar` contains the event wiring and runtime scripts; `Refreshers.pml` defines the Choregraphe project and media resources; `manifest.xml` defines the application's metadata. The project is well suited to supervised outreach once the trigger/action mappings, media decoding, stop paths and motion clearance have been verified on the real robot. The most valuable maintenance improvements are consolidated state management, dependable cancellation, and a formal repeatable test checklist.
