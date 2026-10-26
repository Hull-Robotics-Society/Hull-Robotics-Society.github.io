---
title: "Baxter × Pepper dance: Baxter's side"
slug: baxter/baxter-pepper-dance
project: baxter
date: 2026-10-12
excerpt: "How Baxter's half of the 30-second dance works, from joint captures to smooth, safe motion."
---
## Contents

1. Purpose and project scope
2. Evidence and verification status
3. Robot platform overview
4. Software architecture
5. Workspace and repository discovery
6. ROS 1 prerequisites and compatibility
7. Activate the existing Baxter environment
8. Configure connectivity
9. Robot status, enable and disable
10. Create a new ROS package
11. Read joint state without moving Baxter
12. Baxter's fourteen arm joints
13. Joint-angle captures from earlier tests
14. `smooth_move` implementation explained
15. Earlier motion-script problems and corrections
16. Thirty-second dance specification
17. Timing and scheduling the dance
18. Safe movement design
19. Building and launching actual repository scripts
20. ROS command reference
21. Diagnostics and troubleshooting
22. Testing and acceptance checklist
23. Physical safety and supervision
24. Logging, reproducibility and Git history
25. Further improvements
26. Handover and deployment checklist
27. Glossary and references

---

## 1. Purpose and project scope

This project area focuses on using the **Baxter Research Robot** to learn and demonstrate dual-arm robotic control under ROS. Baxter has two arms with seven actuated joints each. In previous project discussions, the practical goals included reading joint states, moving both arms from starting poses to selected positions, returning to recorded poses and building a timed **dance** sequence. The work was used as part of robotics learning and demonstrations, rather than as a certified industrial controller.

**Previously requested dance:** keep the arms **up and well separated**, perform **randomised motion for the first 15 seconds** without changing either shoulder joint `s0` or `s1`, then perform a **left-arm disco gesture for the final 15 seconds** and finish at 30 seconds. The user preferred simple decimal constants for the starting pose. This is a **historical design requirement**; the current code's conformance cannot be asserted without reading the repository.

Secondary learning goals include ROS node development, joint-angle representation, timing, motion commands, safe stopping and Git-based tracking of changes.

### Scope boundary

- **Baxter repository:** Baxter ROS/Python environment and arm-control work.
- **Pepper-Baxter-Dance repository:** separate Choregraphe/NAOqi Pepper dance material, documented in its own guide.
- A similarly themed demonstration does **not prove** Baxter and Pepper are communicating with one another. Cross-robot synchronisation needs explicit code evidence and physical validation.

## 2. Evidence and verification status

| Topic | Evidence available | Confidence |
|---|---|---|
| Repository address | Supplied directly by project owner | Confirmed URL supplied; contents not fetched |
| ROS workspace activation | Earlier `01-baxter-setup.md` and `Baxter_New_Project.md` | Historical instructions |
| Baxter joint API | Rethink Robotics `baxter_interface` SDK | General platform evidence |
| Example `smooth_move` source | Earlier `02-baxter-code.md` | Previous code, **not verified current** |
| Historic joint values | Earlier terminal/code notes | Previous measurements only |
| 30-second disco design | Earlier requirements | Requirement, not acceptance test |
| Present script names, ROS package names, branch, commit | GitHub listing unavailable here | **Unknown** |
| Tested robot motion / collision-free paths | No live access to physical Baxter | **Not tested** |

### Source-verification procedure

On your laptop, obtain an exact commit and inventory without changing the repository:

```bash
# If the repository has already been cloned:
cd ~/repos/Baxter
pwd
git status --short
git remote -v
git branch --show-current
git rev-parse HEAD
find . -maxdepth 4 -type f -not -path './.git/*' | sort
```

If your clone lives elsewhere, locate it first using `find ~/repos -maxdepth 3 -name .git -type d`. If it is not yet cloned:

```bash
mkdir -p ~/repos
cd ~/repos
git clone https://github.com/reeceherbert887/Baxter.git
```

Do **not** assume a Python file or package name from this guide is the one in the current repository. Identify it with the commands below before running any motion.

## 3. Robot platform overview

Baxter is a dual-arm research robot originally developed by Rethink Robotics. It combines a torso, two seven-degree-of-freedom arms, a head display, cameras/sensors and the ability to receive joint-level commands through a ROS-integrated SDK. Each arm has named shoulder (`s`), elbow (`e`) and wrist (`w`) joints. The seven-joint chains give a redundant solution space: more joint variables than the six commonly required to specify a rigid end-effector pose.

Practical consequences:

- A *joint position* specifies one actuator angle, typically **radians**.
- A *joint configuration* is the set of seven angles for one arm.
- Two configurations can produce similar hand positions while taking very different paths.
- Keeping the final poses separated is not enough: **intermediate motions must also be checked** for collision and contact.
- Compliant design features do **not** guarantee collision-free or person-safe operation; operate under trained supervision.

## 4. Software architecture

A typical ROS 1 Baxter project consists of:

```text
Ubuntu workstation
  └── ROS 1 environment and catkin workspace
        ├── baxter.sh connection/environment configuration
        ├── Baxter SDK packages
        │     ├── baxter_interface
        │     ├── baxter_tools
        │     └── baxter_common and related packages
        └── your ROS package
              └── scripts/<actual_script>.py
                     ├── rospy node and timing
                     ├── Limb('left') / Limb('right')
                     ├── joint_angles() feedback
                     └── set_joint_positions() commands
                               ↓ ROS topics/services
                         physical Baxter
```

The **robot** runs low-level controllers. Your laptop publishes high-level commands through ROS. Your Python code is neither a full trajectory planner nor an independent safety controller unless those functions are explicitly implemented.

## 5. Workspace and repository discovery

Previous guides used `~/ros_baxter_ws`; a later session used `~/ros_baxter_test_sg`. They are **different workspaces**, and neither should automatically be treated as authoritative for the current machine.

```bash
for ws in "$HOME/ros_baxter_ws" "$HOME/ros_baxter_test_sg"; do
  if [ -d "$ws" ]; then
    echo "=== $ws ==="
    ls -ld "$ws" "$ws/src" 2>/dev/null
    ls "$ws"/baxter.sh "$ws"/devel/setup.bash 2>/dev/null
  fi
done
```

To determine which workspace contains your ROS package:

```bash
find ~/ros_baxter_ws ~/ros_baxter_test_sg -name package.xml -type f 2>/dev/null
find ~/ros_baxter_ws ~/ros_baxter_test_sg -name baxter.sh -type f 2>/dev/null
```

Keep the **source repository** and the **catkin package location** distinct. You may choose to symlink a ROS package from `~/repos/Baxter` into the workspace `src/` rather than maintaining two diverging copies, but do that only after identifying the real package root and resolving any conflicting package names.

## 6. ROS 1 prerequisites and compatibility

Required components depend on the version of Baxter's SDK installed in your lab:

- A supported **ROS 1** installation matching the Baxter environment in use.
- `rospy`, `rostopic`, catkin tools and the Baxter SDK packages.
- Appropriate Python interpreter. Historical Baxter SDK releases were primarily Python 2-era; modern ROS Noetic generally uses Python 3 and may need compatibility patches.
- Correct IP routing, hostname resolution and network connection to the robot.
- Permission from lab staff to control the physical robot.

Check, do not guess:

```bash
echo "ROS_DISTRO=$ROS_DISTRO"
command -v roscore rosrun rostopic catkin_make python python2 python3
python --version 2>&1
ls /opt/ros/
```

**Historical note:** An earlier setup file mentioned `source /opt/ros/groovy/setup.bash` and an old exception syntax like `except OSError, e:`. These were part of historical instructions and are **not safe universal setup commands**. Source the ROS distribution actually installed and use code compatible with its interpreter. The correct Python 3 syntax is `except OSError as e:` (not `OSEerror`).

For a new SDK installation, use the version-specific Rethink Robotics documentation linked in the References section. Do not overwrite a lab's working workspace just to reproduce these examples.

## 7. Activate the existing Baxter environment

The following sequence follows your previously documented workflow. Substitute your *actual* workspace:

```bash
cd ~/ros_baxter_ws
source devel/setup.bash
./baxter.sh
```

The `baxter.sh` script configures the robot environment; on installations where it spawns a new shell, use the **new shell** for later commands. If `./baxter.sh` does not exist, stop and check the correct workspace rather than running a guessed path.

For a workspace that still needs building, **build before sourcing `devel`**:

```bash
cd ~/ros_baxter_ws
# Source the ROS installation installed on this host first,
# e.g. source /opt/ros/noetic/setup.bash IF noetic is installed.
catkin_make
source devel/setup.bash
./baxter.sh
```

After entering the Baxter environment:

```bash
echo "$ROS_MASTER_URI"
echo "$ROS_IP"
echo "$ROS_HOSTNAME"
rostopic list
```

If `catkin_make` fails, read the first meaningful traceback/error, not merely the last few lines. If ROS packages are missing, do not proceed to the robot-motion stage.

## 8. Configure connectivity

Check with lab staff which **Baxter robot hostname/IP**, workstation address and supported network topology apply. Avoid substituting general online example IPs. Diagnostics:

```bash
ip -br addr
ip route
getent hosts baxter.local  # only if this hostname is configured
# Substitute the lab-provided robot IP or hostname:
ping -c 4 ROBOT_HOST_OR_IP
```

A successful ping is not sufficient proof of a correct ROS master address or joint-control availability. Check for stale ROS environment variables, wrong NIC selection, VPN routing, DNS/name resolution and local firewall behaviour.

## 9. Robot status, enable and disable

**Only after connecting to the correctly configured robot and clearing the workspace:**

```bash
rosrun baxter_tools enable_robot.py -s  # inspect status
rosrun baxter_tools enable_robot.py -e  # enable, supervised
rosrun baxter_tools enable_robot.py -d  # disable when appropriate
```

These commands rely on `baxter_tools` being present. Robot enable is not a substitute for a protective stop, and disabling is not a substitute for following lab procedures for emergency stops.

## 10. Create a new ROS package

Only needed for **new work**, not for launching an existing repository package:

```bash
cd ~/ros_baxter_ws/src
catkin_create_pkg baxter_motion_demo rospy
mkdir -p baxter_motion_demo/scripts
cd baxter_motion_demo
```

Do not treat `baxter_interface` as a catkin build dependency without first verifying its `package.xml` in your particular SDK/workspace. Use `rospy` as a minimum for the example. Build and source:

```bash
cd ~/ros_baxter_ws
catkin_make
source devel/setup.bash
rospack find baxter_motion_demo
```

## 11. Read joint state without moving Baxter

This **example** only reads arm states; it does not move the robot. Save as `scripts/read_joints.py` within a new demonstration ROS package:

```python
#!/usr/bin/env python
import rospy
from baxter_interface import Limb

def main():
    rospy.init_node('baxter_read_joints')
    left = Limb('left')
    right = Limb('right')
    rospy.loginfo('Left: %s', left.joint_angles())
    rospy.loginfo('Right: %s', right.joint_angles())

if __name__ == '__main__':
    main()
```

Then:

```bash
chmod +x ~/ros_baxter_ws/src/baxter_motion_demo/scripts/read_joints.py
cd ~/ros_baxter_ws
source devel/setup.bash
./baxter.sh
# Inside the Baxter shell:
rosrun baxter_motion_demo read_joints.py
```

To inspect the wider robot state:

```bash
rostopic echo -n 1 /robot/joint_states
rostopic hz /robot/joint_states
```

`/robot/joint_states` contains multiple joints, not just a single arm. Be careful to match names to values.

## 12. Baxter's fourteen arm joints

Each arm normally exposes the seven names below:

| Index | Left arm | Right arm | Meaning |
|---|---|---|---|
| 1 | `left_s0` | `right_s0` | Shoulder 0 |
| 2 | `left_s1` | `right_s1` | Shoulder 1 |
| 3 | `left_e0` | `right_e0` | Elbow 0 |
| 4 | `left_e1` | `right_e1` | Elbow 1 |
| 5 | `left_w0` | `right_w0` | Wrist 0 |
| 6 | `left_w1` | `right_w1` | Wrist 1 |
| 7 | `left_w2` | `right_w2` | Wrist 2 |

Joint angle values should be interpreted in **radians**. Example conversion: `degrees = radians * 180 / pi`. Never infer joint safety limits from the names or from example poses. Query the robot description and SDK for limits; hardware-specific restrictions can differ.

## 13. Joint-angle captures from earlier tests

These values appeared in an earlier Baxter conversation/code record. They are **historic captures**, **not currently approved target poses**:

```python
historical_left = {
    'left_e0': 0.03489806292439316,
    'left_e1': 1.1259418983078937,
    'left_s0': -0.8038059328519568,
    'left_s1': 0.4506068564413403,
    'left_w0': -0.03029612056073692,
    'left_w1': 0.003451456772742181,
    'left_w2': 3.0418839023767754,
}

historical_right = {
    'right_e0': -0.05905826033358843,
    'right_e1': 0.9583544972314122,
    'right_s0': 0.8705340971249723,
    'right_s1': 0.6412039693361029,
    'right_w0': -0.2688301330769188,
    'right_w1': -0.23009711818281206,
    'right_w2': 0.6784030034423242,
}
```

A separate earlier reading used different values for both arms. They represent different timepoints. For a reproducible dance start pose, capture the robot's actual state, compare it with intended values, then have staff review all transitions. Rounded constants are useful for readability but should not silently replace calibrated positions.

## 14. `smooth_move` implementation explained

An earlier example contained logic resembling:

```python
import copy

def smooth_move(arm, start_angles, target_angles, rate, steps=100):
    angles = copy.deepcopy(start_angles)
    for _ in range(steps):
        for joint in target_angles:
            angles[joint] += (target_angles[joint] - angles[joint]) * 0.15
        arm.set_joint_positions(angles)
        rate.sleep()
    arm.set_joint_positions(target_angles)
    return target_angles
```

### How it behaves

- **Initial copy:** protects the original start-angle dictionary from edits.
- **Per-iteration update:** approaches the target using a fixed fraction of the remaining error.
- **`set_joint_positions`:** sends joint setpoints to the arm; this is a command, not a collision-checking motion plan.
- **`rate.sleep`:** limits the loop frequency subject to scheduling and robot communication overhead.
- **Final command:** requests the full target at the end; if it is far from the current measured state, that may create an abrupt command discontinuity.

The mathematical recurrence for a single joint is:

`q[k+1] = q[k] + alpha * (q_target - q[k])`, where `alpha = 0.15`.

The remaining error after `n` steps is `e[n] = (1 - alpha)^n * e[0]` in the *ideal command sequence*, not necessarily the actual actuator tracking. For `steps=100`, `rate=50 Hz`, the nominal loop duration is `100/50 = 2 s` **per invocation**. Calling it on left and right sequentially takes approximately **4 s**, not 2 s for simultaneous movement. ROS transport and controller response can extend this time.

### Why this is not fully safe by itself

The method has no documented velocity/acceleration limit, workspace collision checking, joint-limit verification or operator abort path. Use it only as a historical educational example until those safeguards are added and approved.

## 15. Earlier motion-script problems and corrections

An older snippet in your `02-baxter-code.md` included values such as shoulder angles `9.0` and `-10.0` radians. These are not credible ordinary shoulder setpoints and must **not** be reused as a motion demonstration. It also referenced an undefined `left_current` variable when printing both initial arm states:

```python
# Incorrect historical lines:
print("Initial left:", left_current)
print("Initial right:", left_current)

# Correct when state variables are named left_start/right_start:
print("Initial left:", left_start)
print("Initial right:", right_start)
```

A later recorded start/end dump showed unchanged joint values in some tests; that alone does not prove arms reached a requested pose. Always compare **measured post-motion** readings to the command; do not print the target dictionary and label it "Last" without measuring feedback.

A new script should:

1. Inspect and validate commanded joint names.
2. Check targets against limits and a collision-tested motion envelope.
3. Log requested versus measured poses.
4. Separate simultaneous and sequential phases explicitly.
5. Provide an interrupt-safe termination state and avoid sudden target jumps.
6. Reject stale ROS feedback or missing hardware before enabling motion.

## 16. Thirty-second dance specification

Historical specification from earlier discussions, **not proof of the current code**:

| Phase | Time (relative) | Requested behaviour | Constraint |
|---|---|---|---|
| Pre-start | Before 0 s | Supervised, arms raised and separated | Test collision-free starting pose |
| A | 0–15 s | Both arms vary joint positions | **No movement of `s0` or `s1`** |
| B | 15–30 s | Left arm does a disco-style repetitive movement | Other arm should remain non-interfering; maintain separation |
| End | At 30 s | Stop dance | No uncontrolled extra movement |

The shoulder exclusion applies to `left_s0`, `left_s1`, `right_s0`, `right_s1`. In particular, the apparent simplicity of a wrist/elbow-only move **does not guarantee safe clearance** with the other arm or the robot's body. Previous requirements also mentioned returning to a base pose; whether return is *inside* or *outside* the 30-second performance must be explicitly decided and tested rather than silently changing the phase durations.

### Acceptance criteria

- Phase change is tied to an elapsed monotonic clock, not a loose count of animation cycles.
- `s0`/`s1` remain within a chosen low tolerance of the approved hold configuration during Phase A.
- A trajectory trace demonstrates separation through the full path.
- The switch at 15 s does not create a discontinuous target jump.
- Routine finishes, stops issuing commands and reports actual outcome.
- Physical stop/fault actions are handled immediately and safely.

## 17. Timing and scheduling the dance

For later development, use a **monotonic clock** to separate the phases:

```python
# Timing-only pseudocode: DOES NOT command the robot.
import time

start = time.monotonic()   # Python 3 example; select equivalent for your runtime
while True:
    elapsed = time.monotonic() - start
    if elapsed >= 30.0:
        break
    phase = 'random_wrist_elbow' if elapsed < 15.0 else 'left_disco'
    # Schedule a PREVALIDATED setpoint for this phase.
```

Legacy Python environments may need `rospy.get_time()` with the appropriate time-source caveats or `time.time()` plus clock-change safeguards. `rospy.Rate` regulates loop frequency but does not automatically enforce phase deadlines. Do not use `time.sleep(15)` while continuing to send a stale robot command without checking for cancellation and failures.

### State model

```text
DISCONNECTED
    ↓ network and ROS checks
IDLE → ARMED → STARTING → PHASE_A → PHASE_B → COMPLETED
                 ↘ FAULT / ABORT / EMERGENCY_STOP
```

Each transition should be logged with timestamp and cause. Only ARMED, after explicit operator action, should allow physical motion.

## 18. Safe movement design

Develop trajectories in stages: read-only connection test, static joint-list validation, offline motion preview, single arm at low speed, both arms separated, then full choreography. Store approved poses and joint limits in a configuration file only after they are checked against the actual robot and lab surroundings.

A robust controller should validate:

- Requested joint is part of the selected arm.
- Target is a finite numeric angle, within the joint-specific limit.
- Step changes meet velocity and acceleration envelopes.
- Both arms remain clear of each other, the torso, table, people and objects.
- No stale state feedback and no controller errors are present.
- Emergency stopping is understood and reachable by the human operator.

For coordinated dual-arm motion, issue both arms' setpoints in the same loop rather than moving the entire left trajectory and then the entire right trajectory. Even a simultaneous command loop does **not** guarantee synchronisation at the servo level; measure actual feedback.

## 19. Building and launching actual repository scripts

**Discover names first**:

```bash
cd ~/repos/Baxter
find . -type f \( -name 'package.xml' -o -name '*.launch' -o -name '*.py' \) | sort
find . -type f -name package.xml -exec grep -H '<name>' {} \;
grep -RIn 'rospy.init_node\|Limb(\|set_joint_positions\|move_to_joint_positions' . --include='*.py' 2>/dev/null
```

If the ROS package is **already inside** a catkin workspace:

```bash
cd ~/ros_baxter_ws
catkin_make
source devel/setup.bash
./baxter.sh
# Now inside Baxter-configured shell:
rospack list | grep -i baxter
```

To run a verified script from the appropriate package:

```bash
# Replace both placeholders with names discovered above.
rosrun ACTUAL_PACKAGE ACTUAL_SCRIPT.py
```

Do not use this placeholder command literally. If there is a `.launch` file, check its parameters and default actions before using `roslaunch ACTUAL_PACKAGE ACTUAL_FILE.launch`.

### Avoid double-running a dance

```bash
rosnode list
rosnode info /NODE_NAME
```

An accidental second process can command the same joints concurrently. Shut down or reset the old demonstration cleanly before starting another controller.

## 20. ROS command reference

| Command | Why it matters |
|---|---|
| `roscore` | ROS master (only launch locally if your setup calls for it; not a replacement for Baxter's configured master) |
| `rostopic list` | See published/subscribed topics |
| `rostopic echo -n 1 /robot/joint_states` | Take a single state sample |
| `rostopic hz /robot/joint_states` | Check feedback freshness |
| `rosnode list` | Locate active ROS nodes |
| `rospack find PACKAGE` | Confirm ROS can resolve a package |
| `rosrun baxter_tools enable_robot.py -s` | Inspect robot enable status |
| `rqt_image_view` | Inspect available camera topics visually |
| `rosparam list` | Discover parameter names |
| `roswtf` | Diagnose ROS environment/configuration issues where installed |

Do not publish raw commands to robot motion topics merely to diagnose a connection. Use status-only commands first.

## 21. Diagnostics and troubleshooting

| Symptom | Likely causes | First checks |
|---|---|---|
| `./baxter.sh: No such file` | Wrong workspace root | `find ~/ -name baxter.sh -type f` |
| `rospy` import fails | ROS environment not sourced, mismatched Python | `echo "$ROS_DISTRO"; python --version; which python` |
| `baxter_interface` fails | SDK missing/unbuilt, Python incompatibility | `rospack find baxter_interface`, inspect exception |
| `Unable to communicate with master` | Wrong `ROS_MASTER_URI`, network | `env | grep '^ROS_'`, ping staff-provided IP |
| `rospack` cannot locate package | Missing catkin build or source | `catkin_make; source devel/setup.bash` |
| `Permission denied` running script | Not executable | `chmod +x path/to/script.py` |
| Arms do not move | Disabled robot, invalid targets, another controller, safety fault | Read-only status/logs first |
| Wrong arm moves | Incorrect name prefix | Validate each dictionary key against actual arm |
| Too-fast or abrupt motion | Sudden target jump, loop mismatch | Stop testing; use approved bounded trajectories |
| Arms approach one another | Collision path not validated | Halt supervised demonstration; revise choreography offline |
| Timing exceeds 30 seconds | Blocking actions or sequential motion | Log actual phase times and service latencies |
| `SyntaxError` in SDK | Python 2/3 mismatch | Verify installed SDK/runtime, use proper branch/patch set |

### Safe debug workflow

1. Stop motion and check physical state.
2. Record the exact command, environment variables and traceback.
3. Test import/build/connection without moving the robot.
4. Verify actual joint feedback and robot enabled state.
5. Reproduce in simulation or offline static checks where available.
6. Restart a motion test only with supervisor approval and a cleared workspace.

## 22. Testing and acceptance checklist

The following tests are **proposed**, not completed:

| ID | Test | Expected result | Status |
|---|---|---|---|
| BX-01 | Git checkout and commit recorded | Reproducible source revision | Not run |
| BX-02 | Workspace identified | Correct `src/`, `devel/`, `baxter.sh` | Not run |
| BX-03 | Catkin build | Build completes | Not run |
| BX-04 | ROS and Python version | SDK compatible | Not run |
| BX-05 | Network connectivity | Correct robot responds | Not run |
| BX-06 | Baxter status | Meaningful reported state | Not run |
| BX-07 | Joint topics | Fresh messages and names | Not run |
| BX-08 | Read-only arm script | Seven angles per arm returned | Not run |
| BX-09 | Joint name validation | Wrong joint refused | Not run |
| BX-10 | Joint limit validation | Unsafe target refused | Not run |
| BX-11 | Idle behaviour | No unexpected motion | Not run |
| BX-12 | Approved startup pose | Reached under supervision | Not run |
| BX-13 | Left path preview | Clears torso and other arm | Not run |
| BX-14 | Right path preview | Clears torso and other arm | Not run |
| BX-15 | Both arms | No collision or interference | Not run |
| BX-16 | Shoulder hold | s0/s1 unchanged in Phase A | Not run |
| BX-17 | Random elbow/wrist moves | Safe bounded sequence | Not run |
| BX-18 | 15-second transition | Precise logged transition | Not run |
| BX-19 | Left disco | Left-arm routine behaves as intended | Not run |
| BX-20 | Right-arm hold | Does not intrude into left-arm range | Not run |
| BX-21 | 30-second end | Motion commands cease | Not run |
| BX-22 | Stop mid-run | Supervisor can abort safely | Not run |
| BX-23 | Controller disconnect | Well-defined safe response | Not run |
| BX-24 | Duplicate launch | Second controller prevented | Not run |
| BX-25 | Repeated runs | No state drift/competing processes | Not run |
| BX-26 | Post-run feedback | Measured angles logged | Not run |
| BX-27 | Shutdown | Robot left in approved state | Not run |

## 23. Physical safety and supervision

**Do not launch movement code unattended.** Require lab authorisation, sufficient clearance, reachable emergency stop, no people in the arms' sweep, checked power/cabling and an approved startup state. Avoid copying old example angles into live commands. Test movement at reduced speed and with someone ready to stop the operation. A robot designed for collaboration can still pinch, collide with or strike a person. Do not defeat hardware safety systems to make a demonstration work.

## 24. Logging, reproducibility and Git history

Record commit hash, package, script, ROS distro, Python version, robot firmware, workspace, operator, approved pose and logs for each test. Suggested CSV fields:

```text
run_id,utc_timestamp,phase,elapsed_s,arm,joint,command_rad,measured_rad,error_rad,state
```

Helpful commands:

```bash
cd ~/repos/Baxter
git status --short
git log --date=iso --pretty=format:'%h %ad %an %s' --all
git log --stat --oneline --all
git log --follow -- ACTUAL_FILE.py
git diff --check
```

Prefer version-controlled source and configuration, not repeated unpublished copies called `final2.py` etc. Keep hardware logs separate from application source when large.

## 25. Further improvements

**Priority 1 — operational reliability:** add collision-reviewed joint constraints, state-feedback freshness checks, an explicit finite-state controller and safe stop handling. **Priority 2 — choreography:** separate preparation from performance; run simultaneous arm setpoints only where validated; use monotonic timing and phase acknowledgements. **Priority 3 — maintainability:** extract pose configurations, log measured data, add offline unit tests for timing and joint-name validation, and document exact launch parameters. **Priority 4 — presentation:** map performance phases to a rehearsal storyboard and record video evidence only when recording permissions are satisfied.

## 26. Handover and deployment checklist

Before an operator uses the repository:

- [ ] Confirm the **real repo** file inventory and commit hash.
- [ ] Identify the correct ROS workspace and package.
- [ ] Inspect every Python script for physical movement commands.
- [ ] Record the ROS/Python/Baxter SDK compatibility pairing.
- [ ] Obtain robot-specific connection configuration from staff.
- [ ] Verify network, SDK and live feedback in read-only mode.
- [ ] Review all poses and validate every intermediate transition.
- [ ] Approve 30-second timing, shoulder lock and finale behaviour.
- [ ] Run a supervised rehearsal and complete the tests above.
- [ ] Update this guide with **actual** script names, successful test logs and a pinned commit.

## 27. Glossary and references

**ROS:** Robot Operating System middleware. **Catkin:** ROS 1 build/workspace system. **`rospy`:** Python client for ROS 1. **`baxter_interface.Limb`:** SDK API for one robot arm. **Joint state:** actual reported joint angle measurement. **Setpoint:** requested joint angle. **DOF:** degrees of freedom. **Monotonic clock:** elapsed-time source not affected by system wall-clock adjustments. **Choreography:** ordered set of robot motions for an expressive performance.

### Project and supporting references

1. [User-supplied Baxter repository](https://github.com/reeceherbert887/Baxter) — current files **not fetched** in this review.
2. [Rethink Robotics Baxter SDK](https://github.com/RethinkRobotics/baxter) — upstream SDK, workspace and `baxter.sh` guidance.
3. [Rethink Robotics `baxter_interface`](https://github.com/RethinkRobotics/baxter_interface) — Python control API and SDK examples.
4. Previous user-supplied notes: `01-baxter-setup.md`, `02-baxter-code.md`, `05-baxter-introdcution.md`, `Baxter_New_Project.md` — historical instructions and measurements.

**Audit note:** A source-level guide for current `reeceherbert887/Baxter` would need the current repository tree, `package.xml`, scripts, launch files and the exact commit SHA. Until then this document intentionally avoids claims about current deployed features or a successful run.
