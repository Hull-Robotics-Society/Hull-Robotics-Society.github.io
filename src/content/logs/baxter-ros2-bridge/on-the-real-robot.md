---
title: "On the real robot"
project: baxter-ros2-bridge
alsoIn: [baxter]
author: Samuel Galla
aiAssisted: true
date: 2026-10-05
excerpt: "Three days with robot 1: what broke under the robot's real load, why the bridge moved to WSL2, and the first full check."
---

This continues [Why we built a bridge](/projects/baxter-ros2-bridge/why-a-bridge/), which ends with the bridge's first week. Until then, everything had run against a small test system without the robot. The real robot sends about 60 of the bridged topics at 100 messages per second each, and that changed a lot.

## First contact

On 5 October the bridge met robot 1 for the first time, over a direct cable from a laptop.

A lot worked straight away. All of Baxter's message types matched the ones the bridge was built with. Reading the robot's state, joint angles and hand positions worked, and so did enabling it. The arms untucked, the head panned and nodded, and a picture appeared on the screen. A press of a navigator button made the head nod from inside a program.

Other things went wrong in a way the test system had never shown:

- **Service calls** were answered after a minute, or not at all.
- **Commands** arrived late or only sometimes: the head reached its target after the time limit, and light commands worked now and then. Pictures for the screen never arrived.

The cause was the bridge itself. It ran as one program that handles everything in one loop, and the flood of state messages from the robot starved everything going the other way. The fix was to split it into three processes: one for services, one for commands to the robot, and one for the state coming back. After that, commands and service calls went through reliably.

Two smaller lessons from the same day: the hand's position arrives a little later than the joint angles after a program starts, so the library now waits for both. And just subscribing to all of the robot's 271 topics takes about ten seconds.

## A laptop that stood still

Arm motions on the first day were mostly smooth, but with occasional hitches. The bridge ran in a VirtualBox virtual machine on a Windows laptop, so on 6 October I measured how evenly time passes there:

| | VirtualBox VM | WSL2 |
| --- | --- | --- |
| A loop meant to run 100 times per second | 87 to 92 | 100 |
| Longest pause in two to three minutes | 1.3 s | 11 ms |
| Joint states arriving through the bridge (100 sent) | 65 to 83 | 99.7 |

With Windows' Memory Integrity switched on, VirtualBox runs in a slow fallback mode and now and then stands still for more than a second. That explained the hitches, and also some errors about a lost connection that was really the virtual machine pausing. The bridge moved to WSL2, which runs at full speed on the same laptop.

## The full check

On 7 October, back at the robot with the bridge in WSL2, the whole robot check passed: **56 out of 56**. That covered moving a hand to a place and through waypoints, several moves at once, the trajectory action other software uses, the grippers, cameras, head lights and sensors, Rethink's own self-tests, and the arm calibration routines.

On the way, the bridge's second mode, `on_demand`, turned out to stall on the real robot. Once per second it looks at everything the robot offers to see what has changed, and with 271 topics and 89 services that look takes up to 0.45 s. It carries nothing in the meantime:

| | `fixed_list` | `on_demand` |
| --- | --- | --- |
| Joint states per second (the robot sends 100) | 105 | 67 to 83 |
| Longest gap between joint states | 17 ms | 330 to 500 ms |
| Furthest an arm strayed from its path | 0.044 rad | 0.184 rad |

So `fixed_list`, which carries a fixed list of topics all the time, became the default.

## Other surprises

- **The third camera.** After a start, the robot lists all three cameras, although only two can run at the same time. Asking for the third made the robot's camera program stop answering until the robot restarted. The library now refuses to open a third camera, and a guard inside the bridge restarts any part of it that gets stuck waiting for an answer.
- **The e-stop at start-up.** Once, the robot refused every attempt to enable it, with "robot is still resetting" in its own log. It had been switched on with the e-stop pressed. A restart with the e-stop released fixed it.
- **A changing address.** On a direct cable the robot gives itself a new address each time it starts, so the bridge's settings need updating after every restart.

By the end of the week, robot 1 worked fully from ROS 2. The next weeks were about everything else: [the second robot, the Mobility Base and the lab's machines](/projects/baxter-ros2-bridge/one-robot-to-everything/).
