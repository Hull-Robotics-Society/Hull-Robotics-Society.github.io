---
title: "Baxter's topics and services"
project: baxter
author: Samuel Galla
aiAssisted: true
excerpt: "What the robot offers in ROS 1, what the bridge carries to ROS 2, and under which names."
---

Everything Baxter can do is offered as ROS *topics* (streams of messages, such as joint angles coming out or commands going in) and *services* (a question with one answer, such as "open this camera"). The robot has 271 topics and 89 services. The bridge carries the ones the `baxter_interface` library and its tools use, listed below.

## ROS 1 and ROS 2 names

A topic has the same name on both sides of the bridge. Only two things change:

| | ROS 1 (on the robot) | ROS 2 (through the bridge) |
| --- | --- | --- |
| Name | `/robot/joint_states` | `/robot/joint_states` |
| Name, robot with the name `one` | `/robot/joint_states` | `/one/robot/joint_states` |
| Message type | `sensor_msgs/JointState` | `sensor_msgs/msg/JointState` |
| Service type | `baxter_core_msgs/OpenCamera` | `baxter_core_msgs/srv/OpenCamera` |

The robot itself always uses the plain names. The name in front is added only on the ROS 2 side (see [Our two Baxters](/projects/baxter/two-baxters/)).

Under each name in the tables are its message type and its direction: **out** means from the robot to ROS 2, and **in** means a command from ROS 2 to the robot. Types are written without their package where it is obvious: `JointCommand` is `baxter_core_msgs`, `Bool` is `std_msgs`, `JointState` is `sensor_msgs`.

## State and enabling

| Topic | What it carries |
| --- | --- |
| `/robot/state` <small>`AssemblyState` · out</small> | enabled, stopped, error, e-stop |
| `/robot/set_super_enable` <small>`Bool` · in</small> | `true` enables the motors, `false` disables them |
| `/robot/set_super_reset` <small>`Empty` · in</small> | clears a stop or an error |
| `/robot/set_super_stop` <small>`Empty` · in</small> | stops the robot, like the e-stop |
| `/robot/joint_states` <small>`JointState` · out</small> | angle, speed and force of every joint of both arms and the head, 100 times per second |

## Arms

Each topic exists for `left` and `right`; only `left` is shown.

| Topic | What it carries |
| --- | --- |
| `/robot/limb/left/joint_command` <small>`JointCommand` · in</small> | target angles, speeds or torques |
| `/robot/limb/left/endpoint_state` <small>`EndpointState` · out</small> | where the hand is, how fast it moves, the force on it |
| `/robot/limb/left/set_speed_ratio` <small>`Float64` · in</small> | speed for position moves, 0 to 1 |
| `/robot/limb/left/joint_command_timeout` <small>`Float64` · in</small> | how long a command stays valid |
| `/robot/limb/left/inverse_dynamics_command` <small>`trajectory_msgs/JointTrajectoryPoint` · in</small> | extra force along a path, used by the trajectory action |
| `/robot/limb/left/collision_avoidance_state` <small>`CollisionAvoidanceState` · out</small> | whether the arm is held back from touching the body or the other arm |
| `/robot/limb/left/suppress_collision_avoidance` <small>`Empty` · in</small> | switches that off for a moment (used when tucking the arms) |
| `/robot/digital_io/left_lower_cuff/state` <small>`DigitalIOState` · out</small> | true while someone holds the arm by its cuff |
| `/robot/joint_state_publish_rate` <small>`UInt16` · in</small> | how often the robot reports its joints |

## Grippers, head and screen

| Topic | What it carries |
| --- | --- |
| `/robot/end_effector/left_gripper/command` <small>`EndEffectorCommand` · in</small> | open, close, calibrate (also `right_gripper`) |
| `/robot/end_effector/left_gripper/state` <small>`EndEffectorState` · out</small> | position, force, whether it holds something |
| `/robot/end_effector/left_gripper/properties` <small>`EndEffectorProperties` · out</small> | which gripper is mounted |
| `/robot/head/head_state` <small>`HeadState` · out</small> | head angle, whether it pans or nods |
| `/robot/head/command_head_pan` <small>`HeadPanCommand` · in</small> | turn the head |
| `/robot/head/command_head_nod` <small>`Bool` · in</small> | nod once |
| `/robot/xdisplay` <small>`Image` · in</small> | a picture for the 1024 × 600 screen |

## Cameras

Each topic exists for `head_camera`, `left_hand_camera` and `right_hand_camera`. Pictures only come from cameras that are open, and only two can be open at a time.

| Topic | What it carries |
| --- | --- |
| `/cameras/left_hand_camera/image` <small>`Image` · out</small> | the pictures, up to 25 per second at 640 × 400 |
| `/cameras/left_hand_camera/camera_info` <small>`CameraInfo` · out</small> | size and lens values, sent with every picture |

## Sensors and lights

| Topic | What it carries |
| --- | --- |
| `/robot/sonar/head_sonar/state` <small>`PointCloud` · out</small> | echoes of the 12 ultrasound sensors around the head |
| `/robot/range/left_hand_range/state` <small>`Range` · out</small> | the infrared distance sensor in the hand (also `right_hand_range`) |
| `/robot/accelerometer/left_accelerometer/state` <small>`Imu` · out</small> | the accelerometer in the hand (also `right_accelerometer`) |
| `/robot/sonar/head_sonar/lights/state` <small>`UInt16` · out</small> | which of the yellow sonar lights are on |
| `/robot/sonar/head_sonar/lights/set_lights` <small>`UInt16` · in</small> | switch them |
| `/robot/sonar/head_sonar/lights/red_level`, `green_level` <small>`Float32` · out</small> | the halo's colour |
| `/robot/sonar/head_sonar/lights/set_red_level`, `set_green_level` <small>`Float32` · in</small> | set it |

## Buttons and lights

| Topic | What it carries |
| --- | --- |
| `/robot/navigators/left_navigator/state` <small>`NavigatorState` · out</small> | the scroll wheel and three buttons; also `right_navigator`, `torso_left_navigator`, `torso_right_navigator` |
| `/robot/digital_io/left_inner_light/state` <small>`DigitalIOState` · out</small> | the navigator lights: `inner` and `outer`, on `left`, `right`, `torso_left` and `torso_right` |
| `/robot/digital_io/command` <small>`DigitalOutputCommand` · in</small> | switch any light or output |
| `/robot/analog_io/command` <small>`AnalogOutputCommand` · in</small> | set any analog output |
| `/robot/analog_io_states` <small>`AnalogIOStates` · out</small> | all analog inputs and outputs at once |

Every other button, switch and output (the cuff buttons, suction valves, the torso fan, and so on) has a topic of its own on the robot: `/robot/digital_io/<name>/state` or `/robot/analog_io/<name>/state`. They are not bridged unless added to the bridge's list.

## Maintenance

Each exists for `left` and `right`. These start routines that move an arm by itself and change the robot's calibration; use them through the library's `tare` and `calibrate_arm` tools.

| Topic | What it carries |
| --- | --- |
| `/robustcontroller/left/CalibrateArm/enable` <small>`baxter_maintenance_msgs/CalibrateArmEnable` · in</small> | start the arm calibration |
| `/robustcontroller/left/CalibrateArm/status` <small>`RobustControllerStatus` · out</small> | its progress |
| `/robustcontroller/left/Tare/enable` <small>`baxter_maintenance_msgs/TareEnable` · in</small> | start re-zeroing the arm's force sensing |
| `/robustcontroller/left/Tare/status` <small>`RobustControllerStatus` · out</small> | its progress |

## Services

| Service | What it does |
| --- | --- |
| `/cameras/list` <small>`ListCameras`</small> | which cameras the robot offers right now |
| `/cameras/open` <small>`OpenCamera`</small> | open a camera with a resolution |
| `/cameras/close` <small>`CloseCamera`</small> | close it |
| `/cameras/reset` <small>`std_srvs/Empty`</small> | make the robot look for its cameras again |
| `/ExternalTools/left/PositionKinematicsNode/IKService` <small>`SolvePositionIK`</small> | joint angles that put the hand at a given place (also `right`) |

## From the bridge itself

These don't exist on the robot. The bridge adds them.

| Name | What it is |
| --- | --- |
| `/baxter_bridge/robot_info` <small>topic, `String`</small> | facts about the robot, such as its software version (`ros2 run baxter_interface robot_info`) |
| `robot/robot_description` <small>topic</small> | the robot's own model, with its measured arm mounts, for RViz and MoveIt |
| `/baxter_bridge/ping` <small>service</small> | answers at once; the bridge uses it to notice when it has got stuck |

## The Mobility Base

The base's bridge carries these. Rates are the base's own.

| Topic | What it carries |
| --- | --- |
| `/mobility_base/mode` <small>`Mode` · out</small> | e-stop, disabled, joystick, program; 2 per second |
| `/mobility_base/battery` <small>`BatteryState` · out</small> | voltage and charge, every 2 seconds |
| `/mobility_base/bumper_states` <small>`BumperState` · out</small> | which bumpers are pressed, 10 per second |
| `/mobility_base/twist` <small>`TwistStamped` · out</small> | measured speed, 250 per second |
| `/mobility_base/wrench` <small>`WrenchStamped` · out</small> | measured force, 250 per second |
| `/mobility_base/joint_states` <small>`JointState` · out</small> | the four wheels, 250 per second |
| `/mobility_base/joystick` <small>`TwistStamped` · out</small> | what the wireless joystick asks for, 50 per second |
| `/mobility_base/joystick_raw` <small>`JoystickRaw` · out</small> | the joystick's sticks and switches |
| `/mobility_base/imu/data_raw` <small>`Imu` · out</small> | the inertial sensor, 100 per second |
| `/mobility_base/imu/is_calibrated` <small>`Bool` · out</small> | whether it is calibrated |
| `/mobility_base/cmd_vel` <small>`Twist` · in</small> | speed forward and sideways in m/s, turning in rad/s |
| `/mobility_base/suppress_wireless` <small>`Empty` · in</small> | makes the base ignore its joystick for a moment |

The types without a package are `mobility_base_core_msgs` or the standard ones. The services `/mobility_base/get_max_speed` and `/mobility_base/set_max_speed` read and set the base's own speed limit.

## What is not bridged

The rest of the robot's topics and services stay on the ROS 1 side. These include the robot's collision detection and diagnostics, the single buttons and switches mentioned above, its coordinate frames (`/tf`), and its internal motor messages. The bridge's list can be extended without rebuilding anything, provided the message type exists on both sides.
