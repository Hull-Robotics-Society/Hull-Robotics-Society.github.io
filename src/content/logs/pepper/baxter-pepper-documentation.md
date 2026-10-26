---
title: "Baxter × Pepper dance: Pepper's side"
slug: pepper/baxter-pepper-documentation
project: pepper
date: 2026-10-12
excerpt: "Choregraphe, NAOqi motion and timing behind Pepper's half of the dance."
aiAssisted: true
---
## Contents

1. Executive summary
2. Project goals and audience
3. Evidence and current-source limitations
4. Pepper vs Baxter: responsibilities
5. Previously identified repository structure
6. Choregraphe file formats and semantics
7. Toolchain and compatibility
8. Ubuntu workspace and repository commands
9. Launching Choregraphe
10. Connecting to the physical Pepper robot
11. Historical dance sequence and storyboard
12. Motion subsystem and relevant NAOqi APIs
13. Choregraphe Python-box lifecycle
14. Controlling speech, gestures and timing
15. Choregraphe box wiring and event flow
16. Optional tablet and media presentation
17. How actual Pepper–Baxter synchronisation would work
18. Cross-robot coordination designs and trade-offs
19. Timing, countdowns and jitter
20. Safe starting, stopping and resetting
21. Source-analysis commands for the existing project
22. Example inspection script and XML validation
23. Testing programme
24. Troubleshooting
25. Safety and event supervision
26. Repository maintenance and version control
27. Recommended improvements
28. Handover checklist
29. Glossary
30. References and verification log

---

## 1. Executive summary

This project concerns an expressive dance/performance built around the **Pepper social humanoid robot** and associated with a separate Baxter robotics project. The earlier project work used **Choregraphe** to arrange Pepper's movements as a sequence of timed behaviours. The available historical information points to a Choregraphe package named `Pepper Dance` with a root behaviour, manifest and translations; an HTML directory was added in later work. An earlier planned routine combined introduction speech, gestures, a microphone-style pose, a disco segment, an arms-up movement and a concluding posture.

The project offers an opportunity to study:

- Expressive motion programming on Pepper using NAOqi.
- Packaging and editing Choregraphe behaviours.
- Time-based sequences and their transition conditions.
- Safe reset/cancel of joint animation.
- Rehearsal and interaction design for university demonstrations.
- **Potential**, but not yet evidenced, synchronisation with Baxter's ROS-driven arm routine.

### Core distinction

**Pepper** is usually programmed in this historical project through **Choregraphe/NAOqi**; **Baxter** uses **ROS 1 and Baxter's SDK**. Although the two can be presented as one show, their scripts belong to different runtimes. A single combined name does not remove the need to inspect and validate an inter-robot communication path.

## 2. Project goals and audience

Historically intended uses include university robotics exhibitions, student society demonstrations, public-facing robot performances and recording a choreographed sequence for a portfolio. The educational aims are to combine speech and movement into an approachable demonstration, design motions within the robot's constraints and practise integrating more than one robot platform where applicable.

### Functional requirements to verify

| Requirement | What to inspect | Status in this review |
|---|---|---|
| Choregraphe Pepper package loads | `.pml`, manifest, all linked resources | Previously identified; current load untested |
| Timed Pepper gestures | Python boxes and timelines | Historical sequence available; current code uninspected |
| Speech and gestures coordinate | `ALTextToSpeech`, `ALMotion` references | Verify in current source |
| A microphone pose/gesture appears | Motion joint targets, box names | Historical storyboard only |
| Disco segment occurs | Timeline/keyframe/Python section | Historical storyboard only |
| End pose/reset is stable | Stop behaviour and robot posture | Hardware test not run |
| Tablet/web display | `html/`, `ALTabletService` or Show App | Directory previously added; functionality unknown |
| Baxter takes part | ROS node/script in actual run | Not established |
| Pepper/Baxter synchronise | Network protocol, trigger and acknowledgment | Not established |
| Stop affects both robots | Shared abort path | Not established |

## 3. Evidence and current-source limitations

The current public GitHub repository could not be retrieved through the available browsing or clone interfaces, so this guide **does not pretend to review current source**. However, previous conversations recorded:

1. A Choregraphe project under `Pepper Dance/Pepper Dance.pml`.
2. A package manifest and root behaviour, including `behavior_1/behavior.xar`.
3. Translation resources and, later, an `html/` area.
4. Choregraphe Python using NAOqi services such as `ALMotion` and `ALRobotPosture`.
5. A timed sequence: approximately **13 s introduction**, **30 s microphone mime**, **1 s gap**, **15 s disco**, **11 s arms-up gesture** and a final neutral/reset.
6. Previous use of `setAngles`, `angleInterpolation`, periodic updates in the approximate **25–30 Hz** range and a transition to `StandInit`.

These are **historical notes**, not a commitment that every element still exists in the current GitHub branch. Capture a commit hash and inspect the files before revising the architecture description or publishing implementation claims.

## 4. Pepper vs Baxter: responsibilities

| Topic | Pepper | Baxter |
|---|---|---|
| Robot role | Social interaction, speech, expressive upper-body movement, tablet | Dual-arm joint motion and display, possible dance gestures |
| Existing prior workflow | Choregraphe `.pml`/`.xar` and NAOqi | ROS 1 catkin package and Python |
| Typical command interface | `ALMotion`, `ALRobotPosture`, `ALTextToSpeech` | `rospy`, `baxter_interface.Limb` |
| Timing | Choregraphe timelines or Python loop | ROS node / elapsed-time control loop |
| Program start | Choregraphe play or deployed behaviour | `rosrun`/`roslaunch` of actual package |
| Collision considerations | Torso/base/arm clearance, people, tablet, cables | Two long arms, joint limits, crossing paths |
| Synchronisation | Needs an explicit start/stop path | Needs the matching start/stop path |

Do not use ROS Baxter example code as Pepper Python-box code. Conversely, Pepper's NAOqi `ALProxy` API is not a replacement for Baxter's `Limb` API.

## 5. Previously identified repository structure

**Historical layout reported in an earlier session:**

```text
Pepper-Baxter-Dance/
└── Pepper Dance/
    ├── Pepper Dance.pml
    ├── manifest.xml
    ├── behavior_1/
    │   └── behavior.xar
    ├── translations/
    └── html/                 # reported added later
```

**Important:** This is an indicative **historical** tree, not a fresh `find` output. More files, alternative branches and renamed directories may now exist. To get the current structure on your Ubuntu machine:

```bash
cd ~/repos/Pepper-Baxter-Dance
find . -maxdepth 5 -type f -not -path './.git/*' | sort
```

If the repository is not cloned yet:

```bash
mkdir -p ~/repos
cd ~/repos
git clone https://github.com/reeceherbert887/Pepper-Baxter-Dance.git
cd Pepper-Baxter-Dance
```

## 6. Choregraphe file formats and semantics

### `.pml` — project/package definition

A Choregraphe project file manages the packaged application and references behaviours/resources. It is not just a Python script and should not be modified casually by concatenating XML files from unrelated projects. Inspect it to establish behaviour locations, image/music dependencies and package names.

### `manifest.xml` — package metadata

A manifest may describe the application's identifier, version, behaviours and availability. The exact manifest schema depends on Choregraphe/NAOqi generation. Confirm the intended entry point and ensure the package name shown to operators is meaningful.

### `behavior.xar` — behaviour graph

This is XML describing nested Choregraphe boxes, signals, inputs/outputs, embedded Python, timelines and links. A box visible on the canvas might have no incoming trigger and therefore never execute. The position or presence of a box is not proof of an operational branch.

### `translations/`

Contains localisation strings used by the project or Choregraphe. A working project may have no custom translation content, but do not remove referenced resources without checking package dependencies.

### `html/`

May contain tablet pages and other browser assets. Its **presence does not prove** the current root behaviour loads a web view or uses it during the dance. Confirm by tracing references from `Pepper Dance.pml`, the manifest and the actual Choregraphe boxes.

### Motion/media resources

Other Choregraphe projects often use `.pmt` trajectory files, `.ogg`/`.wav` music, video and images. Search the current repo before making claims that particular formats or songs occur in **this** project:

```bash
find . -type f \( -iname '*.pmt' -o -iname '*.ogg' -o -iname '*.wav' \
   -o -iname '*.mp3' -o -iname '*.mp4' -o -iname '*.png' -o -iname '*.jpg' \) | sort
```

## 7. Toolchain and compatibility

Your earlier Ubuntu setup used **Choregraphe 2.5.5.5**, installed under `/opt/Choregraphe`. That generation generally targets older Pepper/NAOqi packages and Python-2-era box scripts. Do not substitute a newer Pepper QiSDK/Android tutorial or Python 3 code into those embedded boxes without verifying compatibility.

Recommended verification checklist:

- Confirm executable Choregraphe version actually installed.
- Confirm physical Pepper's firmware/NAOqi version and connectivity.
- Confirm robot type selected in Choregraphe (Pepper rather than NAO virtual robot).
- Verify animation names/joints are valid for this robot.
- Ensure scripts use syntax supported by the robot-side Python runtime.
- Establish correct behaviour package identifier and all resource paths.

## 8. Ubuntu workspace and repository commands

Start with read-only inspection:

```bash
cd ~/repos/Pepper-Baxter-Dance
pwd
git remote -v
git branch --show-current
git rev-parse HEAD
git status --short
find . -maxdepth 4 -type f | sort
```

Search for all Choregraphe projects:

```bash
find . -type f \( -iname '*.pml' -o -iname '*.xar' \
    -o -iname 'manifest.xml' \) | sort
```

If using the previously reported project path:

```bash
cd ~/repos/Pepper-Baxter-Dance/'Pepper Dance'
ls -lah
```

If this fails, discover the actual project path using `find` rather than renaming things blindly.

## 9. Launching Choregraphe

Previously confirmed on the user's Ubuntu setup:

```bash
/opt/Choregraphe/choregraphe
```

Open Choregraphe's File/Open Project interface and select the **actual** `.pml` discovered above. For the historical structure, that was:

```text
~/repos/Pepper-Baxter-Dance/Pepper Dance/Pepper Dance.pml
```

Then:

1. Confirm Choregraphe opens without missing-resource errors.
2. Inspect the root behaviour and its connections.
3. Verify the virtual robot type is Pepper and is compatible with project animations.
4. Look for the start and stop inputs on the root graph.
5. Do not run on hardware until the operator reviews arm/base movements.

The graphical simulator/animation preview cannot guarantee physical clearance or firmware compatibility.

## 10. Connecting to the physical Pepper robot

Obtain the robot's actual address from your lab (not a guessed public example). Confirm it is on the reachable network. Typical operator procedure:

1. Start Pepper following laboratory procedures.
2. Allow boot and any required calibration to complete.
3. Connect the Ubuntu laptop to the same approved network.
4. In Choregraphe, connect to the correct robot/IP, not the virtual NAO/Pepper model.
5. Read robot identity, firmware and status where possible.
6. Verify the stop method before requesting any moving behaviour.

Network check example:

```bash
ping -c 4 PEPPER_IP_ADDRESS
```

Replace `PEPPER_IP_ADDRESS` with the staff-provided address. Successful ping only establishes basic network reachability; it does not confirm that NAOqi services or motions are available.

## 11. Historical dance sequence and storyboard

An earlier Pepper choreography described the approximate following order. **Do not read these timings as verified measurements of the present repository**:

| Stage | Approximate duration | Historical purpose | What to verify |
|---|---:|---|---|
| T1 — introduction | 13 s | Pepper introduces/sets up performance | Speech text, gestures, voice readiness |
| T2 — microphone mime | 30 s | Humorous holding/singing or mime-style gesture | Motion path and interaction with speech/music |
| Transition | 1 s | Gap before faster movement | Clean phase handoff |
| T3 — disco | 15 s | Alternating disco-style motions | Timing, arm/head clearance |
| T4 — arms up | 11 s | Arms-up or waving finale | Collision and joint-limit safety |
| T5 — neutral | Variable | Return to an approved stable posture | Timing and posture confirmation |

The nominal durations before T5 sum to **70 seconds** (`13 + 30 + 1 + 15 + 11`), **excluding** motion latency, speech start delays, controller processing, final reset and any pauses. Actual elapsed performance time may be different.

### Storyboard for rehearsals

```text
Operator confirms READY
      |
      v
Intro speech + small gestures        (T1)
      |
      v
Microphone mime / presentation       (T2)
      |
      v
Deliberate brief transition          (gap)
      |
      v
Disco movement sequence              (T3)
      |
      v
Arms-up finale                       (T4)
      |
      v
Stop moving, settle, neutral/reset   (T5)
      |
      v
Complete / request operator acknowledgment
```

Do not copy **Pepper-Freshers** dance selections (Dance of the Knights, Walk This Way, Hungary) into this documentation as though this repo contains them; those are verified in a different repo/project.

## 12. Motion subsystem and relevant NAOqi APIs

The previous implementation discussions involved **`ALMotion`** and **`ALRobotPosture`**. Commonly relevant concepts:

- **`ALMotion`** controls joint target positions, interpolations and stiffness states.
- **`ALRobotPosture`** transitions to predefined posture targets such as `StandInit`, subject to the particular robot/firmware and operator safety procedures.
- **`setAngles(names, angles, fractionMaxSpeed)`** requests joint motion at a fraction of maximum permitted speed. It is not a full collision-aware planner.
- **`angleInterpolation(...)`** can schedule a sequence of joint angle targets/time values, subject to service semantics.
- **Stiffness** enables/disables joint actuation as directed by the service; mishandling it can cause unsafe changes in robot posture. Do not automatically remove stiffness during a loaded or moving pose.

### Example of read-only posture inspection

The following is **illustrative external Python** and is not intended to be pasted unchanged into a legacy Choregraphe Python box:

```python
# Generic external client structure, only if the compatible qi package
# exists for the local Python runtime. This snippet reads state only.
import qi

session = qi.Session()
session.connect('tcp://ROBOT_IP:9559')
posture = session.service('ALRobotPosture')
print(posture.getPosture())
```

For a Choregraphe Python box, service access is often through the runtime's `ALProxy(...)` or session-based services, depending on the box template/version. Select the pattern already used in **your exact project**. Mixing sample code from incompatible SDK generations is a common cause of failures.

### Frequency and movement

Earlier code discussions used periodic loops of around **25–30 Hz**, including sinusoidal head/arm joint targets. That is a prior design description, **not proof of current code frequency**. Real scheduling rate, servo response and network jitter should be measured from logs. Never assume 30 Hz commands guarantee 30 Hz physically tracked motion.

## 13. Choregraphe Python-box lifecycle

Choregraphe Python boxes commonly define callbacks such as `onLoad`, `onInput_onStart`, `onInput_onStop`, and `onUnload` (names vary with box IO setup). The important properties are:

- **Initialization:** acquire needed NAOqi services once and validate they exist.
- **Start:** reject duplicate activation if already running.
- **Execution:** perform stage-specific speech/motion without blocking event handling indefinitely.
- **Stop:** cancel active loops/tasks and restore a supervised safe state.
- **Unload:** release references/subscriptions and report completion or failure.

### Typical conceptual graph

```text
Root.onStart
    → Prepare / robot-ready check
    → Intro
    → Microphone gesture
    → Pause / transition
    → Disco
    → Arms-up finale
    → Neutral / completion
    → Root.onStopped

Root.onStop
    → Cancel current action / controlled stop
```

**This is a recommended architecture, not a claim that these exact named boxes exist.** To verify, inspect the root `.xar`, nested timelines, and actual input/output wires in Choregraphe.

## 14. Controlling speech, gestures and timing

### Speech

Pepper's spoken dialogue generally uses `ALTextToSpeech`, provided the target NAOqi generation supports the relevant calls. Check that speech is audible in the venue, not unintentionally repeated by multiple boxes and safely interruptible when a stop is requested.

### Gesture playback

Keyframe motion may live in Choregraphe timeline boxes or embedded Python. Avoid having a timeline and a Python loop command the **same joints at the same time**. A state machine should grant one controller responsibility for a joint group per stage.

### Waits and transitions

If speech, music or movement duration varies, waiting a fixed number of seconds can cause transitions to overlap. Prefer completion acknowledgements or task results where available. If a fixed cue is required for stage timing, measure the runtime difference between scheduled and actual start.

### Sinusoidal gestures

An expressive periodic joint profile might use a bounded oscillation of the form:

`q(t) = q_center + amplitude * sin(2π f t + phase)`.

This is a mathematical explanation only, **not a validated Pepper joint target**. Values for `q_center`, `amplitude` and `f` need per-joint limit checking and physical clearance tests; default amplitude is not safe to invent. During a two-robot performance, do not choose amplitudes independently without considering spacing.

## 15. Choregraphe box wiring and event flow

### Trace the actual start path

In Choregraphe, begin at root `onStart` and follow the wires into the first Python/timeline box. For each stage, record which output triggers the next stage. Confirm stop branches, missing outputs and any disabled boxes. Check whether a `wait`, timer or nested behaviour prevents completion signals from reaching the root.

### Find embedded Python

The `.xar` is XML and may contain code lines escaped as XML entities. Useful searching commands:

```bash
cd ~/repos/Pepper-Baxter-Dance
grep -RInE \
  --include='*.xar' --include='*.py' \
  'ALMotion|ALRobotPosture|ALTextToSpeech|ALMemory|onInput_onStart|setAngles|angleInterpolation|onStopped' .
```

A text match is only evidence that source **mentions** an API. It does not prove the box is connected, runs, or succeeds on hardware.

## 16. Optional tablet and media presentation

If the current package's `html/` directory is active, locate its entry page, scripts, images and package references:

```bash
cd ~/repos/Pepper-Baxter-Dance
find . -type f \( -iname '*.html' -o -iname '*.js' -o -iname '*.css' \) | sort
grep -RInE 'ALTabletService|loadApplication|showWebview|QiSession|ALMemory' . \
    --include='*.xar' --include='*.py' --include='*.js' 2>/dev/null
```

Potential uses include an introduction, show title, event QR image, running stage name or an operator/visitor-facing status screen. **These are design options, not verified current content.**

### Prevent the display from hijacking another application

When multiple Choregraphe projects are combined, `Show App`, `ALTabletService` and package-local web views may conflict. The earlier **Pepper-Freshers** project had this problem; do not assume its solution or files are already incorporated here. Test the dance package independently before sharing tablet resources.

## 17. How actual Pepper–Baxter synchronisation would work

A genuine inter-robot dance requires **explicit coordination** between Choregraphe/NAOqi and Baxter/ROS. At minimum, a supervisor or software controller must decide *when* each robot should start and stop, and must observe failures. The two robots have different control networks, timing models and safety states.

```text
                  OPERATOR / SUPERVISOR
                            |
                    Common show start
                            |
                  Show controller (OPTION)
                   /                  \
        NAOqi / Pepper                ROS 1 / Baxter
               |                             |
        Choregraphe boxes            Python motion node
               |                             |
       Pepper motion/speech           Baxter arm motion
               \                             /
                \---- status / stop --------/
```

**This diagram is a suggested future architecture.** No current connection, ROS topic, bridge, socket, shared file or protocol is verified in the supplied repo.

## 18. Cross-robot coordination designs and trade-offs

### A. Manual cueing — simplest verified-at-event option

A trained operator starts both performances in a defined order after clearing both workspaces. Pros: no extra protocol; easy to rehearse. Cons: non-deterministic human reaction delay and difficult repeatability. Suitable for preliminary stage rehearsals, but it is not precise technical synchronisation.

### B. One central trigger — a possible software design

A controller sends a start request to each robot-side process. Each process acknowledges **READY**, then waits for a shared future start timestamp or separately agreed cue. Requires network access to ROS and NAOqi. This architecture needs failure handling, authentication and carefully bounded delays; no such implementation has been confirmed.

### C. Shared timeline or music reference

Both robots derive phase indices from a common elapsed-time reference. Each receives cues `START`, `PHASE_N`, `STOP`; ideally they report their own timestamp and status. This makes phase alignment measurable but depends on the robustness of the time source and acknowledgements.

### D. Media-driven cueing

A show operator starts music and both robots respond to explicit cues. Cue-based choreography can be easier to rehearse than strict hard timestamps, but care is needed if playback starts late or audio drifts.

### What synchronisation is **not**

Running a Pepper script and a Baxter script on the same laptop, using a similarly named `dance.py`, or starting two programs manually does **not** by itself establish synchronisation.

## 19. Timing, countdowns and jitter

Let `t_P` be the observed beginning of Pepper's first commanded action and `t_B` the observed beginning of Baxter's corresponding action. A simple start-offset metric is:

`offset_ms = 1000 × (t_P - t_B)`.

For repeated trials, log mean, median, maximum and spread of this offset. A common logical `START` received by both robots is not identical to an identical motor start time; controller latency, ROS transport and Choregraphe action scheduling can differ. Do not invent an acceptable millisecond tolerance — select one appropriate to the audience experience and what can be measured safely.

### Suggested test CSV

```text
trial_id,utc_time,robot,stage,requested_start,observed_start,finish_time,status,notes
```

### Stage timing plan

For the historical 70-second Pepper storyboard, capture both the planned duration and observed run time of each stage. For Baxter's separate historical **30-second** routine (15-second elbow/wrist random stage, then left disco), do **not** assume it already matches Pepper's 70+ seconds. An integrated show must define whether Baxter starts only for the Pepper disco section, runs an independent segment or uses a different choreography; this remains a design decision and source-verification question, not an existing fact.

## 20. Safe starting, stopping and resetting

Safety is especially important when two robots occupy the same display area.

1. Choose an approved physical separation based on *full swept volume*, not a guessed distance between robot bases.
2. Test Pepper and Baxter separately before any combined rehearsal.
3. Confirm each robot's manual emergency-stop procedure and who is responsible for it.
4. Stop a failed, disconnected or unready robot before beginning a joint performance.
5. Distinguish user-requested **stop** from emergency stop: a software command cannot replace a hardware safety mechanism.
6. Ensure a previously started controller cannot continue issuing commands after a new run starts.
7. Only return to neutral/initial poses when paths are validated and the supervising operator decides it is safe.

### Preferred state model

```text
OFFLINE → CONNECTING → READY → COUNTDOWN → RUNNING → FINISHED
                                    ↘ STOPPING → STOPPED
                                    ↘ FAULT → SUPERVISOR ACTION
```

A future coordinating process should not release the countdown until **both** robots report READY. If either robot faults, the system should stop both workflows through their validated mechanisms and require operator acknowledgement before restarting.

## 21. Source-analysis commands for the existing project

Run from the actual repository on your Ubuntu system:

```bash
cd ~/repos/Pepper-Baxter-Dance

# Evidence for a reproducible report:
git rev-parse HEAD
git status --short
git log -8 --date=iso --pretty=format:'%h %ad %s'

# Identify files and resource sizes:
find . -maxdepth 5 -type f -not -path './.git/*' | sort
du -ah --exclude=.git . | sort -hr | head -n 25

# Find API calls, ROS references and cross-robot transport:
grep -RInE \
  'ALMotion|ALTextToSpeech|ALTabletService|ALBehaviorManager|ALMemory|setAngles|angleInterpolation|rospy|roslib|baxter_interface|socket|MQTT|websocket|http://' . \
  --include='*.xar' --include='*.py' --include='*.xml' --include='*.js' 2>/dev/null
```

A missing `grep` result alone is not proof of no integration: a dependency could be indirect, inside a binary asset, in an external controller repository or another branch. Check manifest, imports, behaviour references, deployment configuration and both endpoints. Conversely, a single mention of `rospy` is not proof that live coordination works.

### Git history on exact code changes

```bash
cd ~/repos/Pepper-Baxter-Dance
git log --all --oneline --decorate --graph -30
git log --name-status --date=iso --all
git diff --check
```

Use `git show HASH:path/to/file` to examine historical versions without overwriting the working tree.

## 22. Example inspection script and XML validation

Choregraphe `.xar`, `.pml` and `manifest.xml` can often be parsed as XML. The following **read-only** Python 3 script checks XML well-formedness and lists root element names. It does *not* execute any robot code:

```python
#!/usr/bin/env python3
from pathlib import Path
import xml.etree.ElementTree as ET

root = Path('.').resolve()
for file in sorted(root.rglob('*')):
    if file.is_file() and file.suffix.lower() in ('.pml', '.xar', '.xml'):
        if '.git' in file.parts:
            continue
        try:
            tree = ET.parse(str(file))
            print('OK   {} root={}'.format(file.relative_to(root), tree.getroot().tag))
        except ET.ParseError as exc:
            print('FAIL {} {}'.format(file.relative_to(root), exc))
        except OSError as exc:
            print('ERROR {} {}'.format(file.relative_to(root), exc))
```

Save as `inspect_xml.py` **outside the robot package or in a clearly separated utilities directory**, then run from the repository root:

```bash
python3 inspect_xml.py
```

This catches malformed XML, but not Choregraphe-specific schema/box wiring errors, missing media, mismatched NAOqi versions or missing assets. Open the package in Choregraphe to evaluate those.

## 23. Testing programme

**All tests below are proposed. None is marked as passed.**

| ID | Test | Expected result | Status |
|---|---|---|---|
| PB-01 | Repository checkout | Exact source commit recorded | Not run |
| PB-02 | File inventory | `.pml`, manifest, `.xar` locations known | Not run |
| PB-03 | XML parse | No malformed project/resource XML | Not run |
| PB-04 | Package opens | Choregraphe loads without missing boxes | Not run |
| PB-05 | Robot type | Correct Pepper model selected | Not run |
| PB-06 | NAOqi compatibility | Services and Python syntax supported | Not run |
| PB-07 | Root start | Exactly one behaviour starts | Not run |
| PB-08 | Root stop | Current behaviour stops safely | Not run |
| PB-09 | Speech | Audible and clear to visitors | Not run |
| PB-10 | Intro timing | T1 measured and logged | Not run |
| PB-11 | Microphone segment | Correct stage plays, no collisions | Not run |
| PB-12 | Transition | No overlapping joint commands | Not run |
| PB-13 | Disco | Bounded, appropriate motions | Not run |
| PB-14 | Arms-up finale | Safe pose and clear posture | Not run |
| PB-15 | Neutral/reset | Approved ending posture achieved | Not run |
| PB-16 | Duplicate start | No concurrent duplicate animations | Not run |
| PB-17 | Stop during speech | Speech/stage cancellation defined | Not run |
| PB-18 | Stop during movement | Controlled safe response | Not run |
| PB-19 | Robot disconnect | Defined fault/stop behaviour | Not run |
| PB-20 | Missing resource | Meaningful diagnostic without uncontrolled stage | Not run |
| PB-21 | HTML assets, if used | Correct content loads | Not run |
| PB-22 | Tablet application, if used | No incorrect 404 or old page | Not run |
| PB-23 | Repeated run | No stale subscriptions/tasks | Not run |
| PB-24 | Baxter independence | Baxter code can run/test separately | Not run |
| PB-25 | Both robots READY | Both statuses checked before start | Not run |
| PB-26 | Coordinated start, if implemented | Start offset logged | Not run |
| PB-27 | Coordinated stop, if implemented | Both processes stop | Not run |
| PB-28 | Combined clearance | Full swept volumes separated | Not run |
| PB-29 | Power/network rehearsal | Recovery procedure documented | Not run |
| PB-30 | Event handover | Supervisor can start and stop safely | Not run |

### Suggested test report template

```text
Test ID:
Date / operator:
Repo commit:
Robot ID and firmware:
Choregraphe version:
Connected to physical robot? [yes/no]
Conditions and clearance:
Expected behaviour:
Observed behaviour:
Duration:
Pass / fail / not run:
Log or video reference:
Follow-up:
```

## 24. Troubleshooting

| Symptom | Likely cause | Suggested investigation |
|---|---|---|
| Cannot open `.pml` | Wrong path/version, malformed XML | Search `find`, XML check, exact Choregraphe version |
| Virtual robot is NAO | Project or simulator selected wrong robot | Select compatible Pepper model and inspect box library |
| Python box errors | Legacy syntax, unsupported service | Read box traceback, identify NAOqi/Python pairing |
| Motion starts then stops | Safety state, exception, stop wire or command overlap | Inspect logs and real behaviour links |
| Speech silent | Audio muted, speech service error | Verify audio and `ALTextToSpeech` separately |
| Animation wrong timing | Blocking box, scheduling delays, task overlap | Log stage start/end and identify blocking calls |
| `StandInit` fails | Posture unavailable/unsafe from current state | Stop and check physical robot with operator |
| Tablet is blank/404 | Missing package resources, wrong app ID, browser path | Inspect `.pml`, manifest and Show App calls |
| Music not playing | Unsupported media type or broken path | Verify asset existence and Choregraphe package path |
| Pepper starts but Baxter not | Two independent launches or one endpoint offline | Confirm explicit sync implementation and Baxter status |
| Baxter runs at wrong phase | 30-second routine does not align with Pepper 70+ s plan | Define cues and log timestamps |
| Two robots dangerously approach | Insufficient physical planning | Stop hardware tests; revise venue layout |
| Old behaviour persists | Previous run not stopped or duplicate subscriber | Check active tasks/nodes and reset under supervision |

### Debug order

**Do not immediately rerun the whole dance.** Stop and secure the robot, reproduce the issue in the relevant component (package parsing → non-motion initialization → one motion stage → full Pepper performance → combined demonstration), and log the error before the next attempt.

## 25. Safety and event supervision

Pepper's expressive arm/head movement and posture transitions can collide with objects, people or equipment. Baxter's larger dual-arm reach increases the need for venue planning. Prefer substantial separation between the two robots unless a formal review of the entire swept path demonstrates clearance. Never place members of the audience in a robot's moving volume. For public events:

- Keep a named, trained operator responsible for each robot's safe state.
- Establish a stop signal and a clear, visible physical stopping procedure.
- Test every movement on the real devices at conservative settings under supervision.
- Protect power, Ethernet and audio cables from movement and public access.
- Avoid sudden stiffness changes and unsupported posture transitions.
- Prevent simultaneous command sources from controlling the same Pepper joints.
- Agree a no-motion fallback if either robot becomes unavailable.
- Follow applicable university/laboratory risk-assessment and media/copyright rules.

## 26. Repository maintenance and version control

Recommended source structure **for future cleanup**, not a representation of the current repository:

```text
Pepper-Baxter-Dance/
├── Pepper Dance/               # Existing Choregraphe project (if current)
│   ├── Pepper Dance.pml
│   ├── manifest.xml
│   ├── behavior_1/
│   ├── translations/
│   └── html/                   # Only if actually referenced
├── docs/
│   ├── Pepper-Baxter-Dance-Detailed-Documentation.md
│   ├── testing.md
│   └── integration-plan.md
└── README.md
```

Do not rename the root Choregraphe folder or `.pml` file without checking resource references. Choregraphe packages can refer to named resources and internal identifiers; a careless move may silently break deployment.

### Git workflow

```bash
cd ~/repos/Pepper-Baxter-Dance

git status
git branch --show-current
git log --oneline -10

git diff --stat
git diff --check
```

To add the documentation after reviewing it:

```bash
mkdir -p docs
cp /PATH/TO/Pepper-Baxter-Dance-Detailed-Documentation.md docs/
git add docs/Pepper-Baxter-Dance-Detailed-Documentation.md
git commit -m "Document Pepper-Baxter dance project"
# Push only after checking your branch and remote:
git remote -v
```

No push is performed by this guide. Avoid publishing third-party songs, unlicensed video or sensitive lab network settings without permission.

## 27. Recommended improvements

### Priority 1 — verify current source

Pin the GitHub commit, inventory the project and trace the exact behaviour graph. Add screenshots of **actual box wiring**, not a generic design diagram. Record whether the HTML area and all media assets are referenced by the live behaviour.

### Priority 2 — consolidate the Pepper routine

Use explicit stage names, stage completion signals, one responsible motion controller per joint group, stable reset behaviour and consistent error paths. Document measured timings rather than assuming static stage lengths.

### Priority 3 — separate choreography from synchronisation

Keep the working Pepper-only performance independent of any future two-robot orchestrator. Add an optional coordination component only after both individual performances pass acceptance tests.

### Priority 4 — test cross-robot operation, if desired

Choose a specific trigger protocol, acknowledgements, event timestamps, recovery rules and measured drift tolerance. Prefer a clear ready/start/stop interface that can be demonstrated in logs. Avoid making both robots dependent on a music clip or remote network service with no fallback.

### Priority 5 — professional handover

Create a single operator quick-start sheet listing startup sequence, expected performance, normal stop, emergency stop, final posture and contact details for on-site laboratory staff.

## 28. Handover checklist

Before demonstrating or editing this project:

- [ ] The current GitHub commit and branch have been recorded.
- [ ] The root `.pml` file path is verified.
- [ ] `manifest.xml`, `.xar`, translations and all assets are accounted for.
- [ ] Choregraphe and Pepper NAOqi versions are compatible.
- [ ] Python boxes have no unknown runtime/import errors.
- [ ] Root behaviour triggers and completion wires are traced.
- [ ] Historical 13/30/1/15/11-second storyboard is reconciled against current code.
- [ ] Speech, motion and reset have been rehearsed separately.
- [ ] Physical motion limits and clearance are approved.
- [ ] Baxter's **actual** launch package/script are identified, if combined work is intended.
- [ ] The method of synchronisation is documented or clearly marked **not implemented**.
- [ ] Stop/fault tests have been completed with staff.
- [ ] Test log, video evidence (where authorised) and maintenance notes are attached.

## 29. Glossary

**Choregraphe:** visual programming environment for NAO/Pepper behaviours. **NAOqi:** robot software and service framework used in older Pepper generations. **`.pml`:** Choregraphe project/package file. **`.xar`:** Choregraphe behaviour XML. **`ALMotion`:** NAOqi service for robot joint/motion control. **`ALRobotPosture`:** service for named robot postures. **ROS 1:** middleware used by the historical Baxter SDK. **`baxter_interface`:** Baxter Python control interface. **Cue:** a signal that starts or transitions a performance stage. **Jitter:** variability in timing delay. **Swept volume:** complete space occupied by a moving robot part during a motion path. **ACK:** acknowledgement of a request or state.

## 30. References and verification log

### Source and related repositories

- [User-supplied Pepper-Baxter-Dance repository](https://github.com/reeceherbert887/Pepper-Baxter-Dance) — current file contents not accessible in this review.
- [User-supplied Baxter repository](https://github.com/reeceherbert887/Baxter) — current file contents not accessible in this review.
- [Rethink Robotics Baxter SDK](https://github.com/RethinkRobotics/baxter) — upstream general ROS/Baxter references.
- [Rethink Robotics baxter_interface](https://github.com/RethinkRobotics/baxter_interface) — upstream Baxter Python API.
- [Pepper Choregraphe orientation guide (Interaction Lab)](https://github-wiki-see.page/m/utwente-interaction-lab/interaction-lab/wiki/Getting-started-with-the-Pepper-robot) — third-party Choregraphe examples, not this repository's implementation.

### Historical basis

Earlier project conversations (February–March 2026) identified the `Pepper Dance` Choregraphe package and discussed a stage-based motion script using `ALMotion`/`ALRobotPosture`. Later work on `Pepper-Freshers` is a **distinct project** and must not be conflated with this one.

### Verification log

| Date | Action | Result |
|---|---|---|
| 12 Oct 2026 | Attempt to retrieve user GitHub repository pages and raw files | Not retrievable with available tools |
| 12 Oct 2026 | Consult earlier project context for Choregraphe layout, NAOqi and choreography | Historical context recovered |
| 12 Oct 2026 | Create source-aware technical documentation | Completed as a **historical/technical draft** |
| Pending | Inspect current `.pml`, `.xar`, manifest and actual git SHA | Not performed |
| Pending | Test physical Pepper behaviour | Not performed |
| Pending | Confirm whether ROS/Baxter integration actually exists | Not performed |
| Pending | Run approved two-robot rehearsal | Not performed |

**Final source-integrity statement:** This guide offers actionable project documentation, operator setup, example inspection tools, historical implementation context and a rigorous verification plan. It does **not** certify the currently published repository's contents, functional correctness or physical multi-robot synchronisation.
