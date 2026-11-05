---
title: "Version 1.0.0"
project: baxter-ros2-bridge
alsoIn: [baxter]
author: Samuel Galla
aiAssisted: true
date: 2026-11-04
excerpt: "The first public release: ready-made images, three setup scripts, and the lab machines as the main way in."
---

By the end of October the bridge [worked from the lab's own machines](/projects/baxter-ros2-bridge/one-robot-to-everything/), but getting there took a long list of steps by hand. On 4 November the [repository](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge) moved to the society's GitHub, became public, and got its first release: [version 1.0.0](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge/releases/tag/v1.0.0), under the Apache 2.0 licence.

## Ready-made images

Building the bridge takes about half an hour, because it compiles a converter for every one of Baxter's message types. Now GitHub builds the bridge and the other containers once for each release, and a computer downloads them instead. On the lab network the bridge's image arrived in about 20 seconds.

## Three scripts instead of a list of steps

| Script | When | What it does |
| --- | --- | --- |
| `setup.sh` | once per computer, or per WSL image | installs Docker if it is missing, downloads the images, builds the ROS 2 workspace if ROS 2 is installed |
| `add_robot.sh` | every session | looks up the robot's address and this computer's, picks the ROS 2 network settings, writes the robot's settings file |
| `baxter.sh` | in every terminal for Baxter | sets up ROS 2, the bridge's domain and middleware in that one terminal |

The steps they take come from the lab machines and my laptop, where they were done by hand first. The scripts themselves were tested in a ROS 2 Lyrical container made like a lab machine, but not yet on a real one.

## What the lab machines taught us

- **Two middlewares.** The bridge uses Fast DDS, while the lab's terminals start with Cyclone DDS. Topics worked between the two, but every service call timed out. `baxter.sh` now switches its terminal to Fast DDS, and leaves the others alone for everyone's other coursework.
- **Everyone on one network.** All lab machines share the university network, so two students' bridges could see each other. The settings now keep ROS 2 on each machine, and two lab machines were tested side by side that way.
- **A folder only root can read.** One Python package in the lab's WSL image can be read by root only, and the build stopped on it. `setup.sh` makes such folders readable.
- **Saving the WSL image.** Everything inside WSL is gone after logging out unless the image is saved in the WSL manager. The guides now say so at the top.

## Tested for the release

On a lab machine (Ubuntu 26.04, ROS 2 Lyrical, MoveIt 2.15) with robot 1: the bridge from the ready-made image, the examples, RViz, and MoveIt from the machine's own ROS 2. From my laptop with WSL2, the whole robot check on robot 1: 56 out of 56. The Mobility Base under robot 2, its bridge and driving it. And 153 tests that need no robot.

Not tried yet: robot 2 itself with this version, both real robots at once, and the setup scripts on a real lab machine.

[Baxter on a lab machine](/tutorials/baxter-on-a-lab-machine/) is the new starting point for everyone.
