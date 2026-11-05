---
title: "Baxter on your own laptop"
author: Samuel Galla
date: 2026-11-05
excerpt: "Run the Baxter bridge on a Windows or Linux laptop, with a network cable straight to the robot."
level: "Intermediate"
duration: "About an hour"
needs:
  - A laptop with Windows 11 or Ubuntu
  - A network cable
  - Time with a robot, and someone to stand at its e-stop
projects: [baxter, baxter-ros2-bridge]
tags: [ROS 2, Docker, WSL, Baxter]
---

The lab machines are the easiest way to work with Baxter ([Baxter on a lab machine](/tutorials/baxter-on-a-lab-machine/)). This tutorial is for your own laptop instead, with a network cable plugged straight into the robot. The [bridge](/projects/baxter-ros2-bridge/) needs Linux with Docker: on Windows that is WSL2, Ubuntu inside Windows.

Commands in code boxes are typed into a terminal. Where a command contains something in angle brackets, like `<robot name>`, replace the whole thing, brackets included.

## Step 1: Linux on Windows (Windows only)

On an Ubuntu laptop, skip to step 2.

1. In PowerShell, install Ubuntu:

   ```powershell
   wsl --install -d Ubuntu-24.04
   ```

   `wsl --version` should show WSL 2.0 or newer.

2. Let WSL use the same network connections as Windows, so it can reach the robot. Create the file `C:\Users\<your user name>\.wslconfig` with this content:

   ```
   [wsl2]
   networkingMode=mirrored
   ```

   Then run `wsl --shutdown` in PowerShell, wait ten seconds, and open Ubuntu again. `wslinfo --networking-mode` in Ubuntu now prints `mirrored`.

3. Let the robot connect back into WSL. The robot opens connections to the bridge to deliver commands, and Windows blocks those by default. In a PowerShell opened with **Run as administrator**:

   ```powershell
   New-NetFirewallHyperVRule -Name BaxterRobotTcp -DisplayName "Baxter robot into WSL (TCP)" -Direction Inbound -VMCreatorId '{40E0AC32-46A5-438A-A0B2-2B479E8F2E90}' -Protocol TCP -RemoteAddresses 169.254.0.0/16 -Action Allow
   New-NetFirewallHyperVRule -Name BaxterRobotUdp -DisplayName "Baxter robot into WSL (UDP)" -Direction Inbound -VMCreatorId '{40E0AC32-46A5-438A-A0B2-2B479E8F2E90}' -Protocol UDP -RemoteAddresses 169.254.0.0/16 -Action Allow
   ```

4. The network adapter the robot is plugged into has to get its address automatically (Settings → Network & internet → Ethernet → IP assignment: Automatic).

## Step 2: Get the code and set up (once)

In Ubuntu, in your home folder (on Windows: not under `/mnt/c`, which is slow):

```bash
git clone https://github.com/Hull-Robotics-Society/baxter-ros2-bridge.git ~/baxter-ros2-bridge
cd ~/baxter-ros2-bridge
bash scripts/setup.sh
```

`setup.sh` installs Docker if it is missing and downloads the bridge's ready-made image. Then it depends on the laptop:

- **With ROS 2 installed** (Jazzy or Lyrical), it builds Baxter's messages and the library in `~/baxter_ws`, and `source ~/baxter_ws/baxter.sh` sets up a terminal, as on the lab machines.
- **Without ROS 2**, it downloads the `client` image instead: a container with ROS 2 and the library, in which your programs run.

On Windows, use the Docker that `setup.sh` installs inside Ubuntu, not Docker Desktop: keep Docker Desktop closed while you work with the bridge. If Docker was just installed, open a new Ubuntu window before you go on.

## Step 3: Connect to the robot (every session)

Release the e-stop, then switch the robot on (switched on with the e-stop pressed, it refuses to enable later). Plug the network cable into the robot and into the laptop.

- **Ubuntu:** set the wired connection's IPv4 method to *Link-Local Only*.
- **Windows:** nothing to do after step 1.

About a minute after the robot has started, both sides have an address starting with `169.254.`. On a cable, the robot's name is its serial number with `.local`: `011603p0009.local` for robot 1, `011602p0013.local` for robot 2.

**On Ubuntu:**

```bash
cd ~/baxter-ros2-bridge
bash scripts/add_robot.sh 011603p0009.local
docker compose up -d bridge
```

**On Windows,** WSL can't look up `.local` names itself, so look the robot's address up in PowerShell first:

```powershell
ping -4 011603p0009.local
```

Then, in Ubuntu, with the `169.254.x.x` address from the answer:

```bash
cd ~/baxter-ros2-bridge
ROBOT_IP=<the robot's address> bash scripts/add_robot.sh 011603p0009.local
docker compose up -d bridge
```

The robot gives itself a new address each time it starts, so run `add_robot.sh` again after every restart of the robot.

## Step 4: Check the connection

```bash
bash scripts/robot_check.sh --only network
```

This checks that the laptop reaches the robot, and the robot the laptop. The full check, `bash scripts/robot_check.sh`, goes through the whole robot stage by stage. Before every stage that makes the robot move, it says what will happen and waits until you type `yes`, so someone has to be at the e-stop for it.

## Step 5: Run a program

With ROS 2 installed:

```bash
source ~/baxter_ws/baxter.sh
python3 ~/baxter-ros2-bridge/examples/01_read_robot.py
```

Without ROS 2, in the `baxter-ros2-bridge` folder:

```bash
docker compose run --rm client python3 examples/01_read_robot.py
```

The example only reads: it prints the robot's software version, the left arm's joint angles and where both hands are. [Your first Baxter program](/tutorials/first-baxter-program/) continues from here.

## Step 6: End the session

1. Stop your programs, and fold the arms: `ros2 run baxter_interface tuck_arms -t` (without ROS 2, with `docker compose run --rm client` in front). It disables the robot at the end.
2. Stop the bridge: `docker compose --profile tools down`.
3. Shut the robot down with its power button, wait until it is off, then switch off its power. Leave the e-stop released.

## Good to know

- `setup.sh` and `add_robot.sh` haven't been tried yet on a laptop with the robot on a cable. The steps they take are the ones that ran the whole robot check from WSL2 on a laptop.
- If the laptop has a second wired adapter that is plugged in somewhere, unplug it for the session.
- A VirtualBox virtual machine instead of WSL2 is much slower on Windows 11, and stood still for more than a second at a time ([why](/projects/baxter-ros2-bridge/on-the-real-robot/#a-laptop-that-stood-still)).

The repository's [bridge-machine.md](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge/blob/main/docs/bridge-machine.md) explains each step in more detail, and [own-machine.md](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge/blob/main/docs/own-machine.md) how to program from a second computer while the bridge runs on another.
