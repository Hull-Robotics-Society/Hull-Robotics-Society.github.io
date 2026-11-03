---
title: "The baxter_interface library"
project: baxter-ros2-bridge
author: Samuel Galla
excerpt: "A map of the Python library: its classes, what it adds to Rethink's original, and where each guide is."
---

`baxter_interface` is the Python library for programming Baxter through the bridge. It has the same classes and methods as the `baxter_interface` of Rethink's original SDK, so old Baxter code ports easily. On top of that it has simpler additions, and it makes sure your program notices when the connection to the robot fails.

```python
from baxter_interface import Limb, RobotEnable

RobotEnable().enable()
left = Limb('left')
print(left.joint_angles())
left.move_to_neutral()
```

No ROS set-up code is needed: all classes share one ROS 2 node that runs in the background.

## The classes

Every class has a guide in the [repository's `docs` folder](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge/tree/main/docs).

| Class | What it does | Guide |
| --- | --- | --- |
| `RobotEnable` | switches the motors on and off, resets after a stop | [tools.md](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge/blob/main/docs/tools.md) |
| `Limb` | an arm: joint angles, the hand to a place, paths through several points | [arms.md](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge/blob/main/docs/arms.md) |
| `Head`, `HeadLights` | turning and nodding; the halo and the sonar lights | [head.md](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge/blob/main/docs/head.md) |
| `Gripper` | electric and suction grippers | [grippers.md](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge/blob/main/docs/grippers.md) |
| `Camera`, `Display` | pictures from the cameras, pictures on the screen (as OpenCV images) | [cameras-and-screen.md](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge/blob/main/docs/cameras-and-screen.md) |
| `Navigator`, `DigitalIO`, `AnalogIO` | buttons, scroll wheels, lights | [buttons-and-lights.md](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge/blob/main/docs/buttons-and-lights.md) |
| `Sonar`, `RangeSensor`, `Accelerometer` | the sensors | [sensors.md](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge/blob/main/docs/sensors.md) |
| `Robot` | one of several robots, by name | [two-robots.md](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge/blob/main/docs/two-robots.md) |
| `MobilityBase` | the base's state, and driving it | [mobility-base.md](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge/blob/main/docs/mobility-base.md) |
| `MotionPlanner` | motions planned by MoveIt, around obstacles | [moveit.md](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge/blob/main/docs/moveit.md) |

## What it adds to the original

- **Simple moves.** `left.move_by(z=0.10)` lifts the hand 10 cm, and `move_to_pose()` puts it at a place in metres. `move_through()` moves it through several points in one motion.
- **Several things at once.** Commands inside an `at_once()` block all start together, and the block waits until every one of them is done. That also works across both robots and the base.
- **A faster start.** Parts created inside a `setup()` block connect together, instead of one after the other.
- **Classes for the sensors**, which the original SDK only offered as raw topics.
- **Events.** A function of your own can run whenever a button is pressed or the base's mode changes: `navigator.button0_changed.connect(my_function)`. Each one runs in its own thread, and the library makes sure two of them don't send commands to the same arm at once.
- **Honest connections.** Creating a part waits until the robot has answered. A command that waits for the robot stops with an error as soon as the robot goes quiet, and the arm then holds its position. So a program never carries on as if a command had arrived when it hasn't.

## The command-line tools

| Tool | What it does |
| --- | --- |
| `enable_robot` | shows the robot's state, switches the motors on and off, resets after a stop |
| `robot_info` | the robot's software version and other facts |
| `move_to_neutral`, `tuck_arms` | the arms to a safe pose, or folded up for transport |
| `camera_control`, `show_image` | the cameras, and a picture on the screen |
| `joint_trajectory_action_server` | lets other ROS 2 software, such as MoveIt, move the arms along paths |
| `smoke_test` | Rethink's self-test of the robot's main functions |
| `tare`, `calibrate_arm` | the robot's own maintenance routines for the arms |
| `base_status` | the Mobility Base's mode, battery, bumpers and speed |

Run them with `ros2 run baxter_interface <tool>`. Anything that moves the robot asks first.

## Examples

The repository has 17 short example programs, one per part of the robot: reading the robot, moving an arm and a hand, the head, the screen, buttons, cameras, grippers, sensors, waving, teach-and-repeat, the trajectory action, `at_once()`, the head lights, two robots, the Mobility Base and MoveIt.

## Seeing and planning

- **RViz** shows the robot in 3D, live from the real robot. See [rviz.md](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge/blob/main/docs/rviz.md).
- **MoveIt 2** plans motions that avoid the robot's own body and obstacles you describe, from RViz or with `MotionPlanner`. It uses the values of Rethink's original MoveIt configuration. On the real robot it so far runs cleanly only at a tenth of full speed.
