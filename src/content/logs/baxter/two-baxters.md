---
title: "Our two Baxters and how they connect"
project: baxter
author: Samuel Galla
excerpt: "The two robots, the Mobility Base, and how they all reach one ROS 2 program."
---

The society has two Baxters, called **robot 1** and **robot 2** here. Robot 2 stands on a Dataspeed Mobility Base. Both run the same robot software (version 1.2.0), and in October 2026 both passed the same full check through the bridge. A program written for one therefore runs on the other.

| | Robot 1 | Robot 2 |
| --- | --- | --- |
| Robot software | 1.2.0 | 1.2.0 |
| Stands on | | the Mobility Base |
| Full robot check through the bridge | passed, 7 October 2026 | passed, 12 October 2026 |

The society has two electric grippers, which are mounted on whichever robot needs them. The library checks what is mounted each time a program starts.

## Three separate systems

Each Baxter is a complete ROS 1 system of its own: a computer inside the robot, and its own *ROS master* (the program that tells the robot's other programs where to find each other). The Mobility Base is a third system: its own computer runs an older ROS 1 (Kinetic) with a master of its own.

The three never talk to each other. Both robots even use exactly the same topic names (`/robot/joint_states`, for example), so they can't simply share one ROS 1 network.

## Where they meet: ROS 2

Each system gets its own [bridge](/projects/baxter-ros2-bridge/), and all bridges run on one machine. A bridge can give its robot a name, and puts that name in front of everything of the robot on the ROS 2 side. Robot 1's joint states then arrive as `/one/robot/joint_states`, robot 2's as `/two/robot/joint_states`. The base's bridge takes the name of the robot standing on it.

<figure class="diagram">
<svg viewBox="0 0 400 468" role="img" aria-label="Robot 1, robot 2 and the Mobility Base computer are three separate ROS 1 systems on one network switch. Each has its own bridge on one machine, and all appear in one ROS 2 system under namespaces.">
<rect class="dg-zone" x="136" y="4" width="260" height="96" rx="8"/>
<text class="dg-s dg-c" x="266" y="20">robot 2 stands on the base</text>
<rect class="dg-box" x="4" y="28" width="120" height="64" rx="6"/>
<text class="dg-t dg-c" x="64" y="52">Robot 1</text><text class="dg-s dg-c" x="64" y="71">ROS 1 Indigo</text><text class="dg-s dg-c" x="64" y="85">own master</text>
<rect class="dg-box" x="144" y="28" width="118" height="64" rx="6"/>
<text class="dg-t dg-c" x="203" y="52">Robot 2</text><text class="dg-s dg-c" x="203" y="71">ROS 1 Indigo</text><text class="dg-s dg-c" x="203" y="85">own master</text>
<rect class="dg-box" x="270" y="28" width="118" height="64" rx="6"/>
<text class="dg-t dg-c" x="329" y="52">Base computer</text><text class="dg-s dg-c" x="329" y="71">ROS 1 Kinetic</text><text class="dg-s dg-c" x="329" y="85">own master</text>
<rect class="dg-zone" x="4" y="188" width="392" height="84" rx="8"/>
<path class="dg-wire" d="M64 92V132M203 92V132M329 92V132M64 160V216M203 160V216M329 160V216"/>
<rect class="dg-box" x="4" y="132" width="392" height="28" rx="6"/>
<text class="dg-s dg-c" x="200" y="151">network switch</text>
<text class="dg-m" x="72" y="179">ROS 1</text>
<text class="dg-s dg-c" x="133" y="207">bridge machine</text>
<rect class="dg-key" x="13" y="216" width="102" height="46" rx="6"/><text class="dg-t dg-c" x="64" y="244">Bridge one</text>
<rect class="dg-key" x="152" y="216" width="102" height="46" rx="6"/><text class="dg-t dg-c" x="203" y="244">Bridge two</text>
<rect class="dg-key" x="278" y="216" width="102" height="46" rx="6"/><text class="dg-t dg-c" x="329" y="244">Base bridge</text>
<path class="dg-link" d="M64 262V312M203 262V312M329 262V312"/>
<text class="dg-m" x="72" y="296">ROS 2</text>
<rect class="dg-box" x="4" y="312" width="392" height="84" rx="6"/>
<text class="dg-t" x="16" y="334">One ROS 2 system, a namespace per robot</text>
<text class="dg-m" x="16" y="354">/one/robot/joint_states</text>
<text class="dg-m" x="16" y="370">/two/robot/joint_states</text>
<text class="dg-m" x="16" y="386">/two/mobility_base/cmd_vel</text>
<path class="dg-link" d="M200 396V416"/>
<rect class="dg-box" x="64" y="416" width="272" height="48" rx="6"/>
<text class="dg-t dg-c" x="200" y="436">One program</text>
<text class="dg-m dg-c" x="200" y="454">Robot('one')  Robot('two')</text>
</svg>
<figcaption>The robots never talk to each other directly. They meet on the ROS 2 side, where one program can use both.</figcaption>
</figure>

This is the usual ROS 2 way of keeping several robots apart, with one *namespace* per robot. All of them sit in one ROS 2 system, so RViz can show both robots in one picture, and one program can move both:

```python
import baxter_interface

one = baxter_interface.Robot('one')
two = baxter_interface.Robot('two')

with baxter_interface.at_once():          # both at the same time
    one.Limb('left').move_to_neutral()
    two.Limb('left').move_to_neutral()
```

`one` and `two` are just examples: the name is set in each robot's settings file. A robot without a name keeps the plain topic names, which is the normal case when only one robot is in use.

## The network

The bridge has to reach the robot, and the robot has to reach the bridge back: it connects to the bridge machine to receive commands. There are three ways to wire this up:

- **A cable straight to one robot.** The computer's wired connection is set to *link-local*, and the robot gives itself an address starting with `169.254.` after about a minute. The address can change when the robot restarts.
- **A small switch** with the bridge machine, both robots and the base's computer on it, all with link-local addresses. This is how the base was first reached.
- **The university network.** The robots have names there, and the university's lab machines reach a robot this way.

Your own programs don't need to be on the robot's network at all. They only need to see the bridge machine's ROS 2 traffic, on the same *ROS 2 domain* (a number all programs of one ROS 2 system share; the bridge uses 42). Guest and university Wi-Fi often block the messages ROS 2 uses to find other programs. The bridge's repository explains how to name the other machine directly in that case.

## Status

The names and both bridges have been tested with stand-ins for two robots. Each robot and the base have worked through the bridge on their own. **Both real robots at the same time** haven't been tried yet.
