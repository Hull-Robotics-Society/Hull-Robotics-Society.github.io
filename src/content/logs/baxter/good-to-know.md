---
title: "Good to know"
project: baxter
author: Samuel Galla
excerpt: "Quirks of our Baxters that cost us time to find out."
---

Things the robots do that aren't obvious, found while working with them in 2026.

## Starting and stopping

- **Release the e-stop before switching Baxter on.** If the e-stop is pressed while the robot starts, it gets stuck in an odd state and refuses to enable: every request is answered with "robot is still resetting" in its own log. Shutting it down and starting it again with the e-stop released fixes it.
- **Booting takes a few minutes.** The robot answers a ping before it accepts connections.
- **On a direct cable, the robot's address can change** each time it restarts. Look it up again and update the bridge's settings.
- **Disabling the motors makes the arms sink down slowly.** Make sure nothing is underneath them.
- **The e-stop disables the robot.** After releasing it, the robot needs a reset and then enabling again.

## Arms

- **Hold an arm by its cuff** (the ring behind the hand) and the robot lets it move freely. This is the easiest way to find the coordinates of a place.
- **After someone has leaned on an arm**, it may move oddly. Re-zeroing its force sensing (the `tare` tool) helps; the arm moves by itself while that runs.
- **The robot stops an arm** before it touches the body or the other arm. A move that stops short has often hit this.

## Cameras

- **Only two of the three cameras can run at the same time.** Asking the robot for the third one made its camera program hang until the robot restarted. The library now refuses that request and explains why.
- **Pictures are large.** An open camera sends its pictures through the bridge all the time, whether a program uses them or not. Close cameras you don't need.

## Grippers

- **An electric gripper needs calibrating** once after power-on. It opens and closes fully while doing so.
- **The robot adds mounted electric grippers to its own robot model.** MoveIt has to be told which arms have grippers, otherwise it thinks the fingers collide with the hand and refuses every plan.

## The bridge

- **Use the bridge's `fixed_list` mode.** The other mode, `on_demand`, pauses all data for about 0.4 s once per second on the real robot. Arm motions stutter in that mode, and commands go missing.
- **On a Windows laptop, run the bridge in WSL2**, not in a VirtualBox VM. With Windows' Memory Integrity switched on, VirtualBox runs in a slow mode and stood still for up to 1.3 s at a time.
- **The bridge machine needs an address the robot can reach.** The robot connects back to it for every command. If reading works but enabling times out, this address is usually the problem.

## The Mobility Base

- **Nothing starts on the base's computer by itself.** ROS and the base's programs are started by hand each time.
- **The base's clock was 9 days behind**, because the battery of the computer's clock is flat. Everything the base sends carries that time.
