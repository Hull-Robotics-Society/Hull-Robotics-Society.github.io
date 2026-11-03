---
title: "Drive the Mobility Base"
author: Samuel Galla
date: 2026-11-03
excerpt: "Start the base robot 2 stands on, watch its state from ROS 2, and drive it from a Python program."
level: "Advanced"
duration: "About an hour"
needs:
  - A bridge machine set up for robot 2
  - Access to the base's computer
  - A second person on the joystick
projects: [baxter, baxter-ros2-bridge]
tags: [Python, ROS 2, Baxter]
---

Robot 2 stands on a [Mobility Base](/projects/baxter/mobility-base/), a wheeled platform. This tutorial starts the base, connects it to ROS 2 with a bridge of its own, and drives it a few centimetres from a program. Do [Your first Baxter program](/tutorials/first-baxter-program/) first.

**The base carries a 75 kg robot.** Read step 1 before anything moves.

## Step 1: Before the base may move

1. **Someone holds the joystick**, knows how it works, and stays with it. Pulling its left stick down stops the base at any time, whatever a program sends.
2. **The base's e-stop is within reach.** Check it before the first drive of the day: with the e-stop pressed, the base must not move.
3. **The robot's arms are tucked**, or in a pose that stays inside the base's outline.
4. **The floor is clear**: at least 60 cm on every side, more in the driving direction. No cables on the floor that the wheels can catch, the network cable included.
5. **The joystick allows programs**: it is switched on, its left stick is up ("enable") and its mode switch is on "Computer". In "Manual" the joystick drives and programs are ignored.

The base stops by itself if no command has arrived for a fifth of a second. A program that crashes leaves a standing base.

## Step 2: Start the base's computer

Nothing starts on the base's computer by itself. Log in with a monitor and keyboard, or over SSH, and start ROS in one terminal:

```bash
roscore
```

Then, in a second terminal, the base's programs:

```bash
roslaunch mobility_base_bringup mobility_base.launch
```

Both terminals stay open while you work.

## Step 3: Network and settings

The base's computer and the bridge machine must reach each other. With the robot, the base and the laptop on a small switch and no router, every machine needs an address starting with `169.254.`. The base's computer may need one added by hand, for example:

```bash
sudo ip addr add 169.254.50.10/16 dev <its network card>
```

On the bridge machine, in the `baxter-ros2-bridge` folder, make the base's settings file once:

```bash
cp .env.base.example .env.base
nano .env.base
```

The file explains each line: the base computer's name and address, and this machine's address.

## Step 4: Start the base's bridge

The base gets a bridge of its own, next to the robot's:

```bash
docker compose up -d bridge                          # the robot's, as always
docker compose --env-file .env.base up -d bridge     # the base's
docker compose --env-file .env.base logs -f bridge   # wait for "Starting parameter_bridge", then Ctrl+C
```

## Step 5: Look at the base

```bash
docker compose run --rm client ros2 run baxter_interface base_status -w
```

This prints a line like the one below and updates it until you press Ctrl+C:

```
mode 'waiting': the base waits for commands from a program | battery 61 % (24.1 V, discharging) | bumpers: none pressed | speed: forward +0.00, left +0.00 m/s, turn +0.00 rad/s
```

The mode must be `waiting` before a program can drive. `disabled` means the joystick is off or its left stick is down, and `joystick` means its mode switch is on "Manual".

## Step 6: Drive from a program

Create `drive_base.py`:

```python
from baxter_interface import MobilityBase

base = MobilityBase()

print(base.mode(), '-', base.mode_meaning())
print(base.battery().percent, '%')

base.drive(forward=0.05, seconds=2.0)    # 5 cm/s for two seconds: about 10 cm
base.drive(forward=-0.05, seconds=2.0)   # and back
```

Run it with the person on the joystick ready:

```bash
docker compose run --rm client python3 drive_base.py
```

Directions are seen from the robot: `forward` is where Baxter looks, `left` is Baxter's left, and `turn` is counter-clockwise seen from above. `base.drive(left=0.05, seconds=2.0)` drives sideways.

`drive()` repeats the command 20 times per second for the time given, then stops the base. It gives up with an error that names the reason if the base doesn't follow (the joystick is in charge, for example), or if a bumper is pressed. Speeds are cut to 0.3 m/s and 0.5 rad/s, whatever a program asks for.

## Step 7: Switch off, in this order

The circuit breaker cuts the battery off from everything, the base's computer included, so the computer has to be off before it:

1. On the bridge machine: `docker compose --env-file .env.base down`, and `docker compose down` for the robot's bridge.
2. Shut down the robot as usual, and wait until it is off.
3. On the base's computer: Ctrl+C in the `roslaunch` terminal, then in the `roscore` terminal, then `sudo shutdown -h now`. Wait until it is off.
4. Joystick off, e-stop pressed.
5. Circuit breaker: press the red button. Charging works with the breaker off.

## What next

- `MobilityBase` also has `set_velocity()` for a control loop of your own, the base's own speed limit, and events when the mode changes or a bumper is pressed: see [mobility-base.md](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge/blob/main/docs/mobility-base.md).
- `drive()` works inside an `at_once()` block, together with arm commands. Driving while the arms move hasn't been tried on the real robot yet: try it slowly.
