---
title: "Set up the Baxter bridge"
author: Samuel Galla
date: 2026-11-03
excerpt: "From a laptop to a computer that can talk to Baxter: Linux and Docker, the connection, the settings, and a full check."
level: "Intermediate"
duration: "About 2 hours"
needs:
  - A laptop with Windows 11 or Linux
  - A network cable
  - Time with a robot, and someone to stand at its e-stop
series: Getting started with Baxter
part: 1
projects: [baxter, baxter-ros2-bridge]
tags: [ROS 2, Docker, Baxter]
---

This tutorial sets up a computer as the *bridge machine*: the one connected to Baxter that runs the [bridge](/projects/baxter-ros2-bridge/). You only do it once per computer. After that, [Your first Baxter program](/tutorials/first-baxter-program/) takes over.

Commands in grey boxes are typed into a terminal. Where a command contains something in angle brackets, like `<robot name>`, replace the whole thing, brackets included.

## Step 1: A Linux system with Docker

The bridge runs in [Docker](https://www.docker.com/), a tool that runs programs in ready-made *containers* with everything they need inside. Docker needs Linux.

**On a Linux computer** (Ubuntu 24.04 is what we use), install Docker Engine following [Docker's own guide](https://docs.docker.com/engine/install/ubuntu/), then continue with step 2.

**On Windows 11**, use WSL2, Microsoft's way of running Linux inside Windows. (A VirtualBox virtual machine also works, but it is much slower and pauses for up to a second at a time.)

1. In PowerShell, install Ubuntu:

   ```powershell
   wsl --install -d Ubuntu-24.04
   ```

2. Let WSL use the same network connections as Windows, so it can reach the robot. Create the file `C:\Users\<your user name>\.wslconfig` with this content:

   ```
   [wsl2]
   networkingMode=mirrored
   ```

   Then run `wsl --shutdown` in PowerShell, wait ten seconds, and open Ubuntu again.

3. Install Docker Engine inside Ubuntu, not Docker Desktop:

   ```bash
   sudo apt-get update && sudo apt-get install -y ca-certificates curl git
   sudo install -m 0755 -d /etc/apt/keyrings
   sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
   echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu noble stable" | sudo tee /etc/apt/sources.list.d/docker.list
   sudo apt-get update && sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
   sudo usermod -aG docker $USER
   ```

   Close the Ubuntu window and open it again. `docker run --rm hello-world` should now print a greeting.

4. Let the robot connect back into WSL. The robot opens connections to the bridge to deliver commands, and Windows blocks those by default. In a PowerShell opened with **Run as administrator**:

   ```powershell
   New-NetFirewallHyperVRule -Name BaxterRobotTcp -DisplayName "Baxter robot into WSL (TCP)" -Direction Inbound -VMCreatorId '{40E0AC32-46A5-438A-A0B2-2B479E8F2E90}' -Protocol TCP -RemoteAddresses 169.254.0.0/16 -Action Allow
   New-NetFirewallHyperVRule -Name BaxterRobotUdp -DisplayName "Baxter robot into WSL (UDP)" -Direction Inbound -VMCreatorId '{40E0AC32-46A5-438A-A0B2-2B479E8F2E90}' -Protocol UDP -RemoteAddresses 169.254.0.0/16 -Action Allow
   ```

**On the university's lab machines**, WSL is already there, but in a different network mode. Follow [lab-machines.md](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge/blob/main/docs/lab-machines.md) in the repository instead of this step.

## Step 2: Get the code

In Ubuntu, in your home folder (not under `/mnt/c`, which is slow):

```bash
cd ~
git clone https://github.com/Hull-Robotics-Society/baxter-ros2-bridge.git
cd baxter-ros2-bridge
```

Every command from now on is run in this folder.

## Step 3: Connect to the robot

Release the e-stop, then switch the robot on (switched on with the e-stop pressed, it refuses to enable later). It takes a few minutes to start; its screen shows the Rethink Robotics logo before it is ready.

Plug a network cable into the robot and into your computer.

- **Linux:** set the wired connection's IPv4 method to *Link-Local Only*.
- **Windows:** the network adapter has to get its address automatically (Settings → Network & internet → Ethernet → IP assignment: Automatic).

After about a minute, both sides have an address starting with `169.254.`.

You need four things for the settings. Write them down:

1. **The robot's name.** This is its serial number, as in `<serial>.local`. Ask whoever looks after the robots.
2. **The robot's address.** On Linux: `getent hosts <robot name>.local`. On Windows, in PowerShell (WSL can't look up `.local` names): `ping -4 <robot name>.local`. The `169.254.x.x` address in the answer is the robot's.
3. **Your computer's address towards the robot.** In Ubuntu, `ip route get <the robot's address>`. It is the address after `src`.
4. **Whether you are in WSL mirrored mode.** `wslinfo --networking-mode` prints `mirrored` if you followed step 1 on Windows.

## Step 4: The settings

```bash
cp .env.example .env
nano .env
```

Fill in:

| Setting | Value |
| --- | --- |
| `ROBOT_HOSTNAME` | the robot's name, e.g. `<serial>.local` |
| `ROBOT_IP` | the robot's address |
| `ROS_MASTER_URI` | `http://<the robot's name>:11311` |
| `ROS_IP` | your computer's address towards the robot |

Only in WSL mirrored mode, add this line as well:

```
DDS_PROFILE=wsl
```

Without it, ROS 2 programs inside WSL can't find each other. Leave it out anywhere else, or nothing will see the robot. Save with Ctrl+O and Enter, then leave with Ctrl+X.

The robot's address can change when it restarts. If the bridge stops reaching the robot after a restart, look the address up again and update `ROBOT_IP`.

## Step 5: Build

```bash
docker compose --profile tools build
```

This builds the containers: the bridge itself, the `client` your programs will run in, RViz, and a few tools. The bridge takes about half an hour the first time, because it compiles a translator for every one of Baxter's message types. Later builds are much faster.

## Step 6: Check everything

Before the robot moves for the first time, **someone stands at the e-stop** (the red button on its cable), and nobody is within reach of the arms.

```bash
bash scripts/robot_check.sh
```

The check goes through the robot stage by stage. The first stages only read. Before every stage that makes the robot move, it says what will happen and waits until you type `yes`. Results are saved in `robot_check_logs/`.

If something fails early:

| What you see | Likely cause |
| --- | --- |
| no ping | cable, wrong adapter, robot still booting |
| ping works, port 11311 closed | the robot hasn't finished starting, or the address is wrong |
| reading works, enabling times out | `ROS_IP` is wrong (the robot can't reach you back), or the e-stop is pressed |
| cameras: "has no power" | only two of the three cameras can run at once; that is normal |

`bash scripts/robot_check.sh --only network` checks just the connection, and `--from arms` continues from a given stage.

## Step 7: Start the bridge

```bash
docker compose up -d bridge
docker compose run --rm client python3 examples/01_read_robot.py
```

The first line starts the bridge in the background. The second runs an example that only reads: you should see the robot's software version, the left arm's joint angles and where both hands are.

The bridge keeps running until you stop it with `docker compose stop bridge`. After the robot has been switched off and on, restart it with `docker compose restart bridge`.

## What next

- [Your first Baxter program](/tutorials/first-baxter-program/): write and run your own program.
- [How the bridge works](/projects/baxter-ros2-bridge/how-the-bridge-works/): what you just built.
- The repository's [README](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge#setup) and [troubleshooting.md](https://github.com/Hull-Robotics-Society/baxter-ros2-bridge/blob/main/docs/troubleshooting.md), when something doesn't work.
