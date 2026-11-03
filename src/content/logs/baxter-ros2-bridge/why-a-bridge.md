---
title: "Why we built a bridge"
project: baxter-ros2-bridge
alsoIn: [baxter]
author: Samuel Galla
date: 2026-10-01
excerpt: "Why the robots needed a new setup, why a bridge to ROS 2, and the first week of building it."
---

I didn't have a particular project in mind. I saw the two robots in the lab, thought they looked really interesting, and wanted to do something with them. But with the old setup, I couldn't get far before I was debugging and working out how things were supposed to work, long before any actual project could start. I also heard that the robots had hardly been used, because the setup was so complicated and worked from only one workstation. So I wanted to build a setup that makes all of this easier: ROS 2 and current Python, from any of the lab's machines.

## Where we started

Until autumn 2026, Baxter was programmed from a single ROS 1 workstation in the lab, with Rethink Robotics' original software from 2015 (see [Baxter before the bridge](/projects/baxter/before-the-bridge/)). The robot's own software can't be changed: it runs ROS 1 Indigo, and the company that could update it closed in 2018. ROS 1 itself reached its end of life in May 2025.

Apart from staying on the workstation, the only other option I considered was a ROS 1 virtual machine. I dropped it mainly because ROS 1 still needs an old version of Ubuntu, which is about to lose its support. A full virtual machine was also out of the question on the lab's machines, while WSL2 was already set up there for newer versions of Ubuntu.

## The idea

ROS 2 has a ready-made tool for exactly this situation, [ros1_bridge](https://github.com/ros2/ros1_bridge), a program that is a ROS 1 and a ROS 2 node at the same time. Put it in a Docker container next to the robot, and the robot can stay exactly as it is, while everything else moves to ROS 2.

Was it worth the effort? I didn't really weigh that up. I liked the challenge, and I wanted to work with the robots.

## The first week

- **1 to 2 October.** The repository, Baxter's message types translated to ROS 2, and a first bridge built on ROS 2 Jazzy. Without the robot, a ROS 2 program read joint states and moved a shoulder joint through it.
- **2 to 4 October.** The Python library `baxter_interface` ported to ROS 2, keeping the original's classes so old code would carry over. The arms came first, then the head, grippers, buttons, cameras and the screen. An automatic check passed completely on its sixth run.
