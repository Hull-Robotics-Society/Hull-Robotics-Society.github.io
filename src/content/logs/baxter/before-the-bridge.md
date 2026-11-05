---
title: "Baxter before the bridge"
project: baxter
author: Samuel Galla
aiAssisted: true
date: 2026-01-18
excerpt: "How we programmed Baxter in its first months with the society: one ROS 1 workstation and Rethink's original SDK."
---

When the society brought Baxter back into service in January 2026, it was programmed the way Rethink Robotics intended: from a ROS 1 computer next to the robot, with Rethink's own software kit (SDK). This entry looks back at that setup, which we used until the autumn.

## The workstation

The lab has one workstation for the robot. It runs Ubuntu 20.04 with ROS 1 Noetic, the last version of ROS 1, and the University's staff set up its connection to the robot. Rethink's SDK sits in a *catkin workspace*, the ROS 1 way of building a set of packages:

```bash
mkdir -p ~/ros_baxter_ws/src
cd ~/ros_baxter_ws/src
wstool init .
wstool merge https://raw.githubusercontent.com/RethinkRobotics/baxter/master/baxter_sdk.rosinstall
wstool update
cd ..
catkin_make
```

This downloads five packages from Rethink's GitHub, all at version 1.2.0 from December 2015: `baxter`, `baxter_common`, `baxter_examples`, `baxter_interface` and `baxter_tools`.

The SDK was written for Python 2, while Noetic uses Python 3. Some of the code needed small fixes before it ran. A typical one changes `except OSError, e:` to `except OSError as e:`.

## A session with the robot

The SDK comes with a script, `baxter.sh`, that opens a terminal connected to the robot. From there everything is ROS 1:

```bash
./baxter.sh
rosrun baxter_tools enable_robot.py -e      # motors on
rostopic echo /robot/joint_states           # watch the joint angles
rosrun baxter_tools enable_robot.py -d      # motors off
```

Programs were Python scripts in a package of our own, started with `rosrun`:

```python
import rospy
from baxter_interface import Limb

rospy.init_node('read_arm')
left = Limb('left')
print(left.joint_angles())
```

Baxter's half of the [Baxter × Pepper dance](/projects/baxter-pepper-dance/) was programmed this way, from joint angles printed by scripts like this one.

## What held us back

- **One machine.** Everything had to happen on the single workstation in the lab, one person at a time.
- **Old software.** ROS 1 reached its end of life in May 2025. The SDK's code dates from 2015 and needed fixes to run at all.
- **A different world.** Current robotics tools and tutorials target ROS 2.

Those three points are what led to the [Baxter ROS 2 bridge](/projects/baxter-ros2-bridge/) in October 2026.
