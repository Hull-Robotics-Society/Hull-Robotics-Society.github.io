---
title: "Your first Baxter program"
author: Samuel Galla
date: 2026-11-03
excerpt: "Read the robot, enable it, and write a short Python program that moves an arm and nods the head."
level: "Beginner"
duration: "About 45 minutes"
needs:
  - A bridge machine, set up in part 1
  - A robot
  - A second person at the e-stop
series: Getting started with Baxter
part: 2
projects: [baxter, baxter-ros2-bridge]
tags: [Python, ROS 2, Baxter]
---

This tutorial takes you from a working bridge to a program of your own that moves Baxter. It uses the Python library `baxter_interface`, and you don't need to know ROS for it. It assumes the bridge machine is set up as in [Set up the Baxter bridge](/tutorials/set-up-the-baxter-bridge/).

## Before the robot moves

- **Someone stands at the e-stop** whenever the robot is enabled, and nobody is within reach of the arms.
- The arms are strong and don't see you. Try new programs slowly first.
- Every example program says at its top whether it moves the robot.

## Step 1: Start the bridge

On the bridge machine, in the `baxter-ros2-bridge` folder:

```bash
docker compose up -d bridge
```

## Step 2: Read the robot

```bash
docker compose run --rm client python3 examples/01_read_robot.py
```

`client` is a container with ROS 2 and the library already installed. It sees the repository's folder, so `examples/01_read_robot.py` is a file you can open and read. The program prints the robot's software version, the left arm's joint angles, and where both hands are, measured in metres from the middle of the robot.

If it prints an error instead, the message says what is missing. The most common reason is that the bridge isn't running, or the robot was restarted and its address changed.

## Step 3: Look around with the tools

```bash
docker compose run --rm client
```

This gives you a terminal inside the `client` container. Try:

```bash
ros2 run baxter_interface enable_robot -s      # the robot's state
ros2 run baxter_interface enable_robot -e      # switch the motors on
ros2 run baxter_interface tuck_arms -u         # arms to a working pose (they move!)
ros2 run baxter_interface robot_info           # software version and more
```

Type `exit` to leave the container.

## Step 4: Write your own program

Create a file `my_first_program.py` in the repository's folder, with any editor:

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

Run it:

```bash
docker compose run --rm client python3 my_first_program.py
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

The robot stays enabled when your program ends. When you are done:

```bash
docker compose run --rm client ros2 run baxter_interface enable_robot -d
```

The arms sink down slowly when the motors switch off, so make sure nothing is underneath them.

## What next

- The repository has 17 example programs in `examples/`, one per part of the robot: cameras, grippers, buttons, sensors, teach-and-repeat and more.
- [The baxter_interface library](/projects/baxter-ros2-bridge/baxter-interface/) lists every class and its guide.
- To keep your programs in a folder of their own, or to work in VS Code, see [own-project.md](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge/blob/main/docs/own-project.md). To program from your own computer while the bridge runs on another, see [own-machine.md](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge/blob/main/docs/own-machine.md).