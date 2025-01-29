---
title: "Software Setup: Installing ROS & ROS2 on the OSRC"
date: 2025-02-19
excerpt: "A step-by-step guide to installing ROS and ROS2 on the OSRC."
permalink: /projects/OSRC/software-setup/
---

## Installing ROS & ROS2
The OSRC is designed for **seamless integration with ROS and ROS2**. Follow these steps to set up your system:

### **1. Install Ubuntu on Raspberry Pi 5**
- Download and flash Ubuntu 22.04 onto an SD card.
- Configure Wi-Fi and SSH for remote access.

### **2. Install ROS & ROS2**
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install ros-humble-desktop
```

### **3. Configure Joysticks & Buttons**
- Use the Teensy to map inputs to ROS topics.
- Create a ROS node to read joystick commands and send them to a robot.

This setup enables real-time control of ROS-based robots from the OSRC.
