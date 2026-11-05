---
title: "Baxter on a lab machine"
author: Samuel Galla
date: 2026-11-05
excerpt: "From a fresh WSL image on one of the university's lab machines to a moving Baxter, and how to end a session."
level: "Beginner"
duration: "About an hour"
needs:
  - A university lab machine with the UoH-WSL manager
  - Time with a robot, and someone to stand at its e-stop
series: Getting started with Baxter
part: 1
projects: [baxter, baxter-ros2-bridge]
tags: [ROS 2, WSL, Baxter]
---

This tutorial sets up one of the university's lab machines to work with Baxter, and takes you through a whole session: switching the robot on, connecting to it, moving it, and leaving everything as you found it. After that, [Your first Baxter program](/tutorials/first-baxter-program/) takes over.

The lab machines run Windows, with WSL images (Ubuntu inside Windows) from the university's WSL manager, UoH-WSL. Their images come with ROS 2 Lyrical, MoveIt and RViz, and Docker. The [bridge](/projects/baxter-ros2-bridge/) runs in Docker, and your programs use the machine's own ROS 2.

Commands in grey boxes are typed into the WSL terminal. Where a command contains something in angle brackets, like `<robot name>`, replace the whole thing, brackets included.

**Save your WSL image in the WSL manager before you log out.** Without saving, everything you set up is gone the next time, and you start again at step 2.

## Step 1: Switch the robot on

1. **Release the e-stop** (the red button on the robot's cable) before switching on. A robot switched on with its e-stop pressed refuses to be enabled later, and its log says "robot is still resetting".
2. Switch on the robot's power. It starts by itself, and takes a few minutes. Its screen shows the Rethink Robotics logo before it is ready.

The society has two Baxters. Both are on the university network under a name of their own:

| Robot | Name on the network |
| --- | --- |
| Robot 1 | `011603p0009.hull.ac.uk` |
| Robot 2, on the Mobility Base | `011602p0013.hull.ac.uk` |

Robot 2 passed the full robot check with an earlier version of the bridge, but version 1.0.0 hasn't been tried on it yet.

## Step 2: Set up the WSL image (once)

Start your WSL image from the WSL manager and open its terminal. Then:

```bash
git clone https://github.com/Hull-Robotics-Society/baxter-ros2-bridge.git ~/baxter-ros2-bridge
cd ~/baxter-ros2-bridge
bash scripts/setup.sh
```

`setup.sh` asks for your WSL password once (for `sudo`). It downloads the bridge's ready-made image, installs the few ROS packages that may be missing, and builds Baxter's messages, the Python library, the robot model and the MoveIt configuration in `~/baxter_ws`. When it is done it says so and names the next step. If it stops, it says why.

You only do this once per WSL image, as long as you save the image at the end of every session.

## Step 3: Connect to the robot (every session)

```bash
cd ~/baxter-ros2-bridge
bash scripts/add_robot.sh 011603p0009.hull.ac.uk     # robot 1; robot 2 is 011602p0013.hull.ac.uk
docker compose up -d bridge
```

`add_robot.sh` looks up the robot's address and this machine's own address, and writes both into the bridge's settings. Run it at the start of every session: the lab machine's address can change from day to day. `docker compose up -d bridge` starts the bridge in the background, or restarts it with the new settings.

## Step 4: Set up the terminal

In every terminal you use for Baxter:

```bash
source ~/baxter_ws/baxter.sh
```

It prints one line, such as `Baxter: ROS 2 lyrical, domain 42, discovery LOCALHOST, Fast DDS`.

This switches that one terminal to the bridge's ROS 2 settings. Other terminals keep the lab's own settings, so your other ROS 2 coursework is not affected. In a terminal without it, programs either don't see the robot at all, or see its topics but get no answer from its services.

## Step 5: Move the robot

Before the robot moves, **someone stands at the e-stop**, and nobody is within reach of the arms.

```bash
ros2 run baxter_interface tuck_arms -u               # arms out to the working pose
python3 ~/baxter-ros2-bridge/examples/01_read_robot.py
```

`tuck_arms -u` enables the robot and moves both arms out of their folded transport pose. The example only reads: it prints the robot's software version, the left arm's joint angles, and where both hands are.

The robot is now yours. The [repository](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge) has a short example program for every part of the robot in [`examples/`](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge/tree/main/examples) (on the lab machine: `~/baxter-ros2-bridge/examples/`), and each says at its top whether it moves the robot. Two to try first:

```bash
python3 ~/baxter-ros2-bridge/examples/10_wave.py
```

The left arm waves for eight seconds, higher and wider than in the other examples (Ctrl+C stops it earlier). Add `right` at the end for the right arm.

```bash
python3 ~/baxter-ros2-bridge/examples/11_teach_and_repeat.py
```

This one you teach by hand. Hold the left arm by its cuff, the ring just behind the hand, and it moves freely. Put it into a pose and press the scroll wheel of the navigator on that arm to store the pose. Store a few, then let go, step back and press Enter: the arm goes through your poses, first one by one, then once more in one smooth motion.

### See the robot in 3D

RViz is installed on the lab machines, and its window opens on the Windows desktop:

```bash
ros2 launch baxter_description view_robot.launch.py
```

It shows the robot as it moves, live. Leave it open in its own terminal while you run the examples in another one, set up with `baxter.sh` as well.

## Step 6: End the session

In this order:

1. Stop your programs and RViz (Ctrl+C).
2. Fold the arms. This disables the robot at the end:

   ```bash
   ros2 run baxter_interface tuck_arms -t
   ```

   Without folding, `ros2 run baxter_interface enable_robot -d` disables it. The arms then sink down slowly, so make sure nothing is underneath them.
3. Stop the bridge:

   ```bash
   cd ~/baxter-ros2-bridge && docker compose --profile tools down
   ```

4. Shut the robot down with its power button, and wait until it is off.
5. Switch off the robot's power. Leave the e-stop released, so the next person can start the robot normally.
6. **Save the WSL image in the WSL manager**, then log out.

## Several lab machines

Every lab machine keeps its ROS 2 traffic to itself. Two students on two machines don't see each other's bridge or programs, even with the same robot.

Two machines can still both connect to the same robot, and then both can command it. Agree who drives.

## When something doesn't work

| What you see | What to do |
| --- | --- |
| `add_robot.sh` can't look up the robot | the robot isn't on yet, or the name is mistyped |
| reading works, but enabling or moving times out | run `add_robot.sh` again (this machine's address may have changed), then `docker compose up -d bridge`. Check that the e-stop is released |
| enabling times out although the e-stop is released | the robot was switched on with its e-stop pressed: shut it down, release the e-stop, switch it on again |
| topics work, but every service call times out | this terminal isn't set up: `source ~/baxter_ws/baxter.sh` |
| `ModuleNotFoundError: No module named 'baxter_interface'` | the same |
| everything from step 2 is gone | the WSL image wasn't saved last time: start again at step 2 |

More in the repository's [troubleshooting.md](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge/blob/main/docs/troubleshooting.md). If that doesn't help, open an issue on the repository's [Issues page](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge/issues).

To update to a newer version of the bridge:

```bash
cd ~/baxter-ros2-bridge
git pull
bash scripts/setup.sh
docker compose up -d bridge
```

## What next

- [Your first Baxter program](/tutorials/first-baxter-program/): write and run a program of your own.
- Motions planned around obstacles with MoveIt, once you know your way around: the repository's [moveit.md](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge/blob/main/docs/moveit.md).
- [Baxter on your own laptop](/tutorials/baxter-on-your-laptop/): the same with a cable straight to the robot.
- The repository's [lab-machines.md](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge/blob/main/docs/lab-machines.md) explains what each step does, and what is different about the lab machines.
