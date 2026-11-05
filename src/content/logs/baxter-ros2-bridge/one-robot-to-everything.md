---
title: "From one robot to everything"
project: baxter-ros2-bridge
alsoIn: [baxter]
author: Samuel Galla
aiAssisted: true
date: 2026-10-09
excerpt: "Both robots in one program, the second robot and its Mobility Base, MoveIt, and finally the university's own lab machines."
---

After [its first days on the real robot](/projects/baxter-ros2-bridge/on-the-real-robot/), the bridge worked with robot 1. The goal, though, was both robots and the Mobility Base, from any of the lab's machines.

## Two robots, one program

Both Baxters use exactly the same topic names, so they can't simply share one ROS system. The first version, on 8 October, gave each robot a ROS 2 system of its own. It worked, but it felt like a workaround: the robots couldn't be seen together in one 3D view, or planned for together.

On 9 October I replaced it with the usual ROS 2 way: one system, and a *namespace* per robot. Each robot gets a name, and its bridge puts that name in front of everything on the ROS 2 side, so robot "one" reports on `/one/robot/joint_states`. The bridge program itself can't rename anything. The trick is to give it the renamed list for the ROS 2 side, and tell its ROS 1 half to map each name back to the robot's real one.

In a program, `Robot('one')` and `Robot('two')` are then two robots side by side. Several moves across both can run at the same time. This was tested with two stand-ins for the robots; both real robots at once haven't been tried yet. [Our two Baxters](/projects/baxter/two-baxters/) explains the setup.

## The second robot and its base

On 12 October the bridge met robot 2 for the first time. It runs the same software as robot 1, all of its message types matched, and the robot check passed there too: 55 checks passed, and one was skipped because no gripper was mounted.

Robot 2 stands on a Dataspeed Mobility Base, and that day was also the first look at the base through ROS. It turned out to be a separate system: the base has a computer of its own, with an older ROS 1 (Kinetic) and its own ROS master, and nothing starts on it by itself. For the bridge, that makes the base a third robot of sorts, with its own bridge.

## A bridge for the base, and MoveIt

- **The base's bridge** (13 October) carries the base's state and its speed command to ROS 2. It needed four new message types from Dataspeed's software. In a program, `MobilityBase` reads the base's mode, battery and bumpers, and drives it at limited speeds.
- **MoveIt 2** plans arm motions around the robot's own body and around obstacles. Rethink's original MoveIt configuration for Baxter is no longer online, but a copy was still on the lab's old workstation. Our configuration follows it file by file, and uses the robot's own model, which includes any mounted grippers.

## The first drive

On 21 October the Mobility Base drove under program control for the first time: 10 cm forward and back again. The day also showed that the base's computer clock was nine days behind, because its clock battery is flat.

Driving the base through ROS also showed up a problem with its wheels. That gets an entry of its own once it is fixed.

## The lab's own machines

The real test of "from any of the lab's machines" came on 23 October, on one of the university's Windows computers. The bridge reached robot 1 over the university network, but no ROS 2 program saw a single Baxter topic.

The lab machines' WSL uses a different network mode from my laptop (*bridged* instead of *mirrored*), and a network setting meant for the laptop pointed ROS 2 at an address that doesn't exist there. Without that setting, on 26 October, programs built with the lab machine's own ROS 2 tucked and untucked the robot's arms. They used the newer ROS 2 Lyrical, through the Jazzy bridge, without any of the bridge's ready-made containers. That was the goal from the start: the robots usable from the lab's own machines. What was left was making that easy for everyone else: [version 1.0.0](/projects/baxter-ros2-bridge/version-1-0-0/).
