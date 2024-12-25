---
title: "Giving the Dalek Its Wheels"
date: 2024-08-15
permalink: /projects/dalek/dalek-mobile-frame/
excerpt: "How we gave the Dalek mobility by repurposing an electric wheelchair and a custom joystick controller."
toc: true
---  

## Building the Dalek Project: The Quest for Mobility and Control

When we set out on the Dalek project back in August 2024, our primary objective was to create a functional, mobile base for the Dalek frame. One of the first challenges we encountered was finding a reliable way to power and control the Dalek’s movement. After exploring different options, we decided to repurpose an electric wheelchair as the foundation for mobility. However, while the wheelchair provided a solid start, it came with its own set of hurdles—chief among them being the controller.

The wheelchair’s original control system required a compatible joystick, which, unfortunately, we didn’t have. This presented a major issue, but also an opportunity to get creative with a solution.

---

## The Custom Joystick Controller Solution

In order to bypass the need for a compatible joystick, we designed and built a custom joystick controller using a 4-axis joystick. This joystick would serve as the input device, allowing us to control the Dalek’s movement in multiple directions—forward, left, and right. The joystick’s output signals were then fed into an Arduino, which acted as an intermediary between the joystick and the wheelchair’s controller.

The Arduino played a pivotal role in translating the joystick’s inputs into commands that the wheelchair could understand. Through the DB9 connector on the wheelchair’s controller, we were able to establish communication between the joystick and the wheelchair’s internal systems. This allowed us to control the Dalek’s movement accurately while also keeping the system modular and flexible for future upgrades.

---

## Challenges of Mounting the Dalek on a Pivoting Wheelchair Base

While the concept of using an electric wheelchair as the Dalek's base was promising, it quickly became clear that there were challenges to overcome. One of the key design hurdles was the mounting system. The wheelchair frame, designed to support a seated individual, had a single mount point at the back to attach the Dalek frame.

This mounting point was effective, but it introduced a stability issue—the Dalek’s weight and design caused it to be unstable at times, as it was essentially pivoting around this single point. This made balancing the Dalek a constant challenge, especially when trying to ensure that the weight distribution was ideal for smooth mobility.

The pivot point at the back of the wheelchair, though functional, meant that the Dalek could tip or wobble if too much weight was placed on the front. As we continued to work on the project, we realized that to make the Dalek truly mobile, we would need to balance the structure carefully and possibly add additional support to prevent instability during movement. These design considerations were crucial as we sought to refine the Dalek’s performance.

---

## Powering the Dalek’s Movement: A Deep Dive Into the System

Now that we had mobility sorted with the wheelchair base and custom joystick, we needed to understand how the Dalek’s power and control systems worked together. At the heart of the Dalek’s movement lies the power source and motor control system.

The motor driver responsible for controlling the Dalek’s movement is powered directly by two 12V car batteries connected in parallel. These batteries provide the necessary voltage and current to run the motors efficiently, ensuring that the Dalek can move with enough power for both speed and control. The motor driver also connects to the left and right motors, which are responsible for driving the wheelchair's wheels.

The wheelchair’s original controller communicates with the motor driver, receiving signals from the custom joystick through the Arduino. When the joystick is moved, the Arduino interprets the directional commands (forward, left, or right) and sends the appropriate signals to the wheelchair’s motor controller. The motor controller then adjusts the speed and direction of the motors based on the input from the joystick, enabling smooth movement in the desired direction.

This feedback loop between the joystick, Arduino, wheelchair controller, and motor driver is what makes the Dalek’s movement both responsive and precise. While the joystick controls the speed and direction, the motor driver ensures that the wheels rotate according to the commands sent from the wheelchair controller. It’s a simple yet effective system that provides full mobility to the Dalek.

---

## Looking Ahead: Fine-Tuning the Dalek's Electronics and Functionality

As we move forward with the Dalek project, the next stage will focus on upgrading and fine-tuning the electronics. In particular, we plan to delve deeper into the joystick controller and explore its various capabilities in more detail. There are several ways we can enhance the system—by adding more axes of control or incorporating sensors for better feedback and movement precision.

We also aim to address the stability issues associated with the single pivot mount. As we continue to test and iterate, we will likely introduce additional support or reinforcements to ensure that the Dalek’s movements remain smooth and balanced.

Stay tuned for the next update where we’ll take a closer look at how the joystick controller works in more detail and how we plan to optimize the Dalek’s performance for more advanced functionalities. The journey is far from over, and we’re excited to share the next steps of this ambitious project!
