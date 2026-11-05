---
title: "How the bridge works"
project: baxter-ros2-bridge
author: Samuel Galla
aiAssisted: true
excerpt: "Inside the bridge: two ROS versions in one container, two ways of running, and why commands get a lane of their own."
---

The bridge is a Docker container that speaks ROS 1 to the robot and ROS 2 to everything else. Lab members only ever deal with its ROS 2 side. This page is for anyone who wants to know what happens inside, or who needs to change it.

## Two ROS versions in one container

At its heart is [ros1_bridge](https://github.com/ros2/ros1_bridge), a program that is a ROS 1 node and a ROS 2 node at the same time. For that it needs both installed side by side:

1. **ROS 2 Jazzy** comes from the official base image. **ROS 1 Noetic** comes from a community package source, rebuilt for the same Ubuntu version. ROS 1 Noetic understands the robot's older ROS 1 Indigo without problems.
2. **Baxter's own message types**, such as `JointCommand` or `EndpointState`, exist twice: once as Rethink's original ROS 1 definitions for the robot's software version, and once translated to ROS 2.
3. **The bridge is compiled against both.** At build time it finds every message type that exists on both sides and writes a converter for each pair. That is why building the bridge takes about half an hour, and why it has to be redone when a message definition changes. Since version 1.0.0 the bridge also comes as a ready-made image, so most people never build it themselves.

## Two ways of running

| | `fixed_list` (the one to use) | `on_demand` |
| --- | --- | --- |
| What it carries | exactly the topics and services in its list, all the time | whatever one side publishes and the other listens to |
| Joint states per second (the robot sends 100) | 105 | 67 to 83 |
| Longest gap between joint states | 17 ms | 330 to 500 ms |
| Furthest an arm strayed from its path | 0.044 rad | 0.184 rad |

Measured on the robot on 7 October 2026. The `on_demand` mode looks at the robot once per second to see what has changed. On a robot with 271 topics and 89 services that look takes 0.3 to 0.45 s, and the bridge carries nothing in the meantime. With a small test system on the other side the look takes no time at all, which is why the problem only showed up on the real robot. `on_demand` is still useful for looking around, but not for moving the robot.

## Commands get a lane of their own

In `fixed_list` mode the bridge runs as three processes: one for services, one for commands going to the robot, and one for everything else. One process alone handles everything in a single loop, and couldn't keep up with about 60 topics at 100 messages per second. Commands and service calls then arrived late, in bursts, or not at all. That was found on the robot on 5 October 2026.

## Things ros1_bridge doesn't do by itself

- **ROS 1 parameters.** ros1_bridge carries only topics and services. A small helper reads the robot's parameters, such as its software version and its own robot model, and publishes them in ROS 2.
- **Getting stuck.** A robot service that never answers makes ros1_bridge wait for ever. A guard calls a test service through the bridge every few seconds. After 30 seconds without an answer it restarts the stuck process, while the topics keep flowing.
- **Renaming.** ros1_bridge uses one name per topic on both sides. For several robots, the bridge writes the names with the robot's name in front into its list, and tells only its ROS 1 half to map each one back to the robot's real name. The program itself stays unchanged. This needs the list, which is why a named robot needs `fixed_list` mode.

## Where to run it

The bridge needs Linux with Docker, and a network path to the robot in both directions: the robot connects back to the bridge machine to receive commands.

- **On a Windows laptop, WSL2** is the way. A VirtualBox VM on Windows 11 runs in a slow mode while Windows' Memory Integrity is on, and stood still for up to 1.3 seconds at a time. WSL2 showed no such pauses.
- **WSL2's network mode matters.** In *mirrored* mode, ROS 2 needs a special setting (`DDS_PROFILE=wsl`), because large messages to the machine itself get lost. The university's lab machines use *bridged* mode, where that setting has to be left out. The setup script picks the right one.
- **The same ROS 2 middleware on both sides.** The bridge uses Fast DDS, while the lab machines' terminals start with Cyclone DDS. Topics work between the two, but every service call times out. The script `baxter.sh` switches the terminal it runs in to Fast DDS and the bridge's ROS 2 domain (42), and leaves other terminals as they are.
- **ROS 2 stays on the machine.** All lab machines are on the same university network. The bridge's settings keep ROS 2 traffic on the machine itself (`ROS_AUTOMATIC_DISCOVERY_RANGE=LOCALHOST`), so nobody else's programs see your bridge, or yours theirs.
- **Your own programs** can run on any other computer that sees the bridge machine's ROS 2 traffic, with its own ROS 2 installation or in the ready-made Docker image.

## Why ROS 2 Jazzy for the bridge

The bridge needs ROS 1 and ROS 2 on the same Ubuntu version. ROS 1 is available for Ubuntu 24.04 through the community package source, so the bridge stays on Jazzy. Programs can use a newer ROS 2: the lab machines' Lyrical programs moved the robot through the Jazzy bridge.
