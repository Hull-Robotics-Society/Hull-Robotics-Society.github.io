---
title: "Your first Baxter program"
author: Samuel Galla
date: 2026-11-05
excerpt: "Read the robot, enable it, and write a short Python program that moves an arm and nods the head."
level: "Beginner"
duration: "About 45 minutes"
needs:
  - A lab machine set up in part 1, or your own laptop
  - A robot
  - A second person at the e-stop
series: Getting started with Baxter
part: 2
projects: [baxter, baxter-ros2-bridge]
tags: [Python, ROS 2, Baxter]
---

This tutorial takes you from a running bridge to a program of your own that moves Baxter. It uses the Python library `baxter_interface`, and you don't need to know ROS for it. It assumes a lab machine set up as in [Baxter on a lab machine](/tutorials/baxter-on-a-lab-machine/), or a laptop set up as in [Baxter on your own laptop](/tutorials/baxter-on-your-laptop/).

## Before the robot moves

- **Someone stands at the e-stop** whenever the robot is enabled, and nobody is within reach of the arms.
- The arms are strong and don't see you. Try new programs slowly first.
- Every example program says at its top whether it moves the robot.

## Step 1: Start the bridge and the terminal

As at the start of every session on a lab machine (on a laptop, use the commands from its tutorial):

```bash
cd ~/baxter-ros2-bridge
bash scripts/add_robot.sh 011603p0009.hull.ac.uk     # robot 1; robot 2 is 011602p0013.hull.ac.uk
docker compose up -d bridge
source ~/baxter_ws/baxter.sh
```

Run `source ~/baxter_ws/baxter.sh` in every new terminal you open for Baxter.

**On a computer without ROS 2**, programs run in the `client` container instead, a container with ROS 2 and the library already installed. Put `docker compose run --rm client` in front of every `python3` and `ros2` command below, in the `baxter-ros2-bridge` folder, and skip `baxter.sh`. The container sees that folder as its own working folder, so keep your programs in it, and write paths from there: `docker compose run --rm client python3 examples/01_read_robot.py`.

## Step 2: Read the robot

```bash
python3 ~/baxter-ros2-bridge/examples/01_read_robot.py
```

The program prints the robot's software version, the left arm's joint angles, and where both hands are, measured in metres from the middle of the robot. It only reads, so it is safe at any time. [`examples/01_read_robot.py`](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge/blob/main/examples/01_read_robot.py) is a short file you can open and read.

If it prints an error instead, the message says what is missing. The most common reasons are a terminal without `baxter.sh`, or a bridge that isn't running.

## Step 3: Look around with the tools

```bash
ros2 run baxter_interface enable_robot -s      # the robot's state
ros2 run baxter_interface robot_info           # software version and more
ros2 run baxter_interface tuck_arms -u         # arms out to a working pose (they move!)
```

Untuck the arms before anything else enables the robot. `tuck_arms -u` enables the robot itself, with the robot's collision avoidance switched off for the move. Enabled while still tucked, the arms move away from the body by themselves, pushed by that collision avoidance. `enable_robot -e` switches the motors on, and `-d` off again.

## Step 4: Write your own program

With the arms untucked, create a file `my_first_program.py` in any folder, with any editor:

```python
import baxter_interface
from baxter_interface import Head, Limb, RobotEnable

# The parts of the robot this program uses. Inside a setup() block
# they connect together, which is faster than one after the other.
with baxter_interface.setup():
    robot = RobotEnable()
    left = Limb('left')
    head = Head()

robot.enable()                        # switch the motors on
left.set_joint_position_speed(0.2)    # move slowly (0 to 1)

left.move_to_neutral()                # a safe start pose
left.move_by(z=0.10)                  # the hand 10 cm up
head.command_nod()
left.move_by(z=-0.10)                 # and down again
```

Run it, in the same folder:

```bash
python3 my_first_program.py
```

There is no ROS set-up code in it: the library does that in the background, so the program is plain Python from top to bottom.

## Step 5: Do two things at once

Each command above waits until it is done. To move both arms together, put the commands in an `at_once()` block. They all start together, and the block waits until every one has finished:

```python
right = Limb('right')

with baxter_interface.at_once():
    left.move_to_neutral()
    right.move_to_neutral()
    head.set_pan(0.5)                 # turn the head to the robot's left

head.set_pan(0.0)
```

## Step 6: When something goes wrong

The library never carries on as if a command had arrived when it hasn't. Instead it raises one of three errors:

| Error | Meaning |
| --- | --- |
| `TimeoutError` | the robot got the command but didn't finish in time: something in the way, robot not enabled, target out of range |
| `ConnectionError` | the command didn't get through, or the robot stopped reporting: bridge stopped, cable out, robot off |
| `ValueError` | what you asked for isn't possible: a place the hand can't reach, a wrong name |

## Step 7: Finish

The robot stays enabled when your program ends. When you are done, fold the arms, which disables the robot at the end:

```bash
ros2 run baxter_interface tuck_arms -t
```

Then end the session as in [part 1, step 6](/tutorials/baxter-on-a-lab-machine/#step-6-end-the-session): stop the bridge, shut the robot down, and on a lab machine save the WSL image.

## What next

- The [repository](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge) has 17 example programs in [`examples/`](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge/tree/main/examples), one per part of the robot: cameras, grippers, buttons, sensors, teach-and-repeat and more.
- [The baxter_interface library](/projects/baxter-ros2-bridge/baxter-interface/) lists every class and its guide.
- To keep your programs in a project of their own, or to work in VS Code, see [own-project.md](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge/blob/main/docs/own-project.md).
