---
title: "The Mobility Base"
project: baxter
author: Samuel Galla
aiAssisted: true
excerpt: "The wheeled platform robot 2 stands on: how it is built, its limits, and what we know about ours."
---

Robot 2 stands on a Mobility Base made by Dataspeed. This is a platform on four wheels that can drive forward, drive sideways and turn on the spot, while carrying a 75 kg robot. How to drive it from a program is in the tutorial [Drive the Mobility Base](/tutorials/drive-the-mobility-base/).

## How it is built

- **The controller** drives the motors and listens to the wireless joystick. It works without any computer: with the base switched on and the e-stop released, the joystick drives the base.
- **The base's computer** runs Dataspeed's driver, which offers the base as ROS 1 topics. It is a ROS 1 system of its own, separate from the robot's, and nothing starts on it by itself: someone starts ROS and the base's programs after switching it on.
- **The base's bridge** runs on the bridge machine next to the robot's bridge, and carries the base to ROS 2. Programs don't run on the base itself.

## Who is in control

A program can only drive the base while the joystick allows it: the joystick is on, its left stick is up, and its mode switch is on "Computer". The base reports which state it is in:

| Mode | Meaning |
| --- | --- |
| `estop` | the e-stop is pressed |
| `disabled` | the joystick is off, out of range, or its left stick is down |
| `joystick` | the joystick drives (mode switch on "Manual") |
| `waiting` | a program may drive, but none is sending commands |
| `driving` | the base follows a program |
| `battery_low`, `battery_critical`, `motor_fault` | as they say |

The base stops by itself when no command has arrived for a fifth of a second. A program that crashes, hangs or loses its connection therefore leaves a standing base. Pulling the joystick's left stick down stops it at any time.

## Limits

| | The base itself | `baxter_interface` |
| --- | --- | --- |
| Top speed | 1.5 m/s | 0.3 m/s |
| Top turning speed | 2.1 rad/s | 0.5 rad/s |

The library cuts every command down to its own limits. They can be raised in a program, but only do that when you know the space around the base. The base knows speeds, not places: there is no command for "drive 30 cm", so a distance comes from speed times time.

## Our base

| | |
| --- | --- |
| Computer | Ubuntu 16.04, ROS 1 Kinetic, Dataspeed's software 1.0.3 (from 2017) |
| At boot | nothing starts; ROS and the base's programs are started by hand |
| Battery | 24 V. It reported 61 % in October 2026, and reported "discharging" while on the charger. The base's batteries are known to have problems |
| Clock | 9 days behind in October 2026: the computer's clock battery is flat and it has no time source, so everything the base sends carries the wrong time. To fix: replace the coin cell inside the computer, then set the time once |

Switching off happens in a fixed order: bridges, then the robot, then the base's computer, then the joystick and e-stop, and the circuit breaker last. The breaker cuts power to everything, the computer included, so the computer has to be shut down before it. The tutorial lists the steps.

## A newer system on its computer?

Ubuntu 16.04 and ROS Kinetic are long out of support, but Dataspeed's driver exists only as a ready-made program for those old versions. Its source was never published, so it can't be rebuilt for a newer ROS. The realistic route is a newer Ubuntu with the old driver inside a Docker container. This would be tried on a second computer first, before anyone touches the built-in one. Nothing of this has been tried yet.

Dataspeed's own documentation is offline. Archived copies are on the Wayback Machine under `mbsdk.dataspeedinc.com`.
