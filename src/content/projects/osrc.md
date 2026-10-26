---
title: OSRC
slug: OSRC
order: 2
status: active
started: 2025-01-10
tagline: The Open Source Robotics Controller, a fully 3D-printed handheld remote for any robot that speaks ROS, ROS 2 or MQTT.
summary: An open-source handheld remote for controlling any robot over ROS or MQTT.
tags: [ROS 2, Raspberry Pi]
filters: [ros, electronics, 3d]
stack: Raspberry Pi 5, Teensy 3.6, ROS, ROS 2, Node-RED, MQTT
cover: /images/OSRC.png
hero: /images/osrc/dashboard.jpg
repo: https://github.com/Hull-Robotics-Society/ros-controller
gallery: [images/osrc]
cad:
  repo: Hull-Robotics-Society/ros-controller
  folders: ["[01] 3D Models/[01] Controller"]
  names:
    front-face-2: Front face, v2
    front-face: Front face, v1
    back-plate: Back plate
  groups:
    "[01] 3D Models/[01] Controller": Enclosure
roster:
  eyebrow: Designed in-house
  image: /images/osrc/dashboard.jpg
  specs:
    - ["Compute", "Raspberry Pi 5, 7-inch touchscreen"]
    - ["Input", "Dual joysticks, buttons"]
    - ["Talks", "ROS, ROS 2, MQTT via Node-RED"]
    - ["Case", "CAD-designed, 3D printed"]
---

Robot control usually means a laptop, a gamepad and a lot of cables. We wanted one portable, standalone remote that any student or researcher could build and adapt.

The OSRC runs on a Raspberry Pi 5 with a 7-inch touchscreen. A Teensy 3.6 reads the dual joysticks and buttons with low latency, and the enclosure is designed in CAD and printed in-house. Node-RED and MQTT let it drive robots over the local network.
