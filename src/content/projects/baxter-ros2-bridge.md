---
title: Baxter ROS 2 bridge
kind: project
robots: [baxter]
layout: hub
author: Samuel Galla
status: active
started: 2026-10-01
tagline: Programming our Baxters from ROS 2 and current Python, without changing the robots' own software.
summary: A bridge and a Python library between Baxter's ROS 1 and ROS 2 Jazzy.
tags: [ROS 2, Docker, Python]
filters: [ros]
stack: ROS 1 Indigo, ROS 2 Jazzy, Docker, Python
repo: https://github.com/Hull-Robotics-Society/baxter-ros2-bridge
---

[Baxter's](/projects/baxter/) software can't be updated, because the company that made it no longer exists. The robot speaks ROS 1 Indigo, a version from 2014, and ROS 1 itself reached its end of life in 2025. Today's robotics tools and courses use ROS 2.

This project connects the two worlds. A *bridge* talks ROS 1 to the robot and ROS 2 to your programs, so you can write current Python on any ROS 2 computer and nothing on the robot changes.

<figure class="diagram">
<svg viewBox="0 0 400 356" role="img" aria-label="A Baxter runs ROS 1. A bridge in Docker connects it to programs that use ROS 2.">
<rect class="dg-box" x="60" y="4" width="280" height="72" rx="6"/>
<text class="dg-t dg-c" x="200" y="30">Baxter</text>
<text class="dg-s dg-c" x="200" y="49">its own computer, ROS 1 Indigo</text>
<text class="dg-s dg-c" x="200" y="65">runs its own ROS master</text>
<path class="dg-link" d="M200 84V132"/><path class="dg-tip" d="M200 78l-5 8h10zM200 138l-5-8h10z"/>
<text class="dg-m" x="214" y="104">ROS 1</text>
<text class="dg-s" x="214" y="120">over the network, both ways</text>
<rect class="dg-key" x="60" y="140" width="280" height="72" rx="6"/>
<text class="dg-t dg-c" x="200" y="166">The bridge</text>
<text class="dg-s dg-c" x="200" y="185">in Docker, on a Linux machine</text>
<text class="dg-s dg-c" x="200" y="201">passes messages between the two</text>
<path class="dg-link" d="M200 220V268"/><path class="dg-tip" d="M200 214l-5 8h10zM200 274l-5-8h10z"/>
<text class="dg-m" x="214" y="248">ROS 2 Jazzy</text>
<rect class="dg-box" x="60" y="276" width="280" height="72" rx="6"/>
<text class="dg-t dg-c" x="200" y="302">Your programs</text>
<text class="dg-s dg-c" x="200" y="321">Python with baxter_interface</text>
<text class="dg-s dg-c" x="200" y="337">MoveIt, RViz, any ROS 2 tool</text>
</svg>
<figcaption>The robot's software stays as it is. The bridge translates between it and current ROS 2.</figcaption>
</figure>

### What is in it

- **The bridge.** It runs in Docker on a Linux computer, or in WSL on Windows. It carries the topics and services the library needs, all the time.
- **`baxter_interface`.** A Python library with the same classes as Rethink's original one, such as `Limb`, `Head` and `Gripper`, plus simpler additions. These include moving a hand by a few centimetres, running several moves at once, and classes for the sensors.
- **Command-line tools.** Enabling the robot, tucking the arms, cameras, the screen, calibration, and a robot check that tests everything step by step.
- **MoveIt 2.** Motions planned around the robot itself and around obstacles, using the values of Rethink's original configuration.
- **Several robots at once.** Each robot gets a name, and one program can use both of our Baxters.
- **The Mobility Base.** A bridge of its own, and a `MobilityBase` class to read its state and drive it.

### Where it stands

The full robot check has passed on both robots. The Mobility Base has driven under program control, and the university's lab machines have moved a robot using their own ROS 2 installation. MoveIt works on the real robot so far only at a tenth of full speed.

The [tutorials](#tutorials) below walk you through setting it up and writing a first program. The detailed guides for every part of the robot are in the [repository](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge).
