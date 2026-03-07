---
title: "Baxter Introduction"
date: 2026-03-07
permalink: /projects/baxter/baxter-introduction
excerpt: "Programming Baxter the robot."
---  

# 1. What Baxter Is

Baxter is a collaborative industrial robot (often called a “cobot”) developed by Rethink Robotics and first introduced in 2012. It was designed to work safely alongside humans while performing simple repetitive tasks such as sorting, assembly, packaging, and material handling.

Unlike traditional industrial robots that operate inside safety cages, Baxter was designed for direct human–robot collaboration in the same workspace. This made it very popular in research laboratories and universities studying robotics and human-robot interaction.

Key characteristics include:

- Two robotic arms designed to mimic human arm motion

- An LCD “face” display that shows expressions and system status

- Multiple sensors and cameras to detect people and objects

- Designed to perform repetitive industrial tasks safely alongside humans

Although commercial production stopped in 2018, Baxter remains widely used in research and education.

## How Baxter Works

Baxter works through a combination of sensors, actuators, and control software that allow it to interact with its environment.

### Mechanical system

- Baxter has two robotic arms, each with 7 degrees of freedom, allowing complex human-like movement.

- Each arm uses series elastic actuators, which allow the robot to sense force and move safely around people.

### Sensors and perception

- Baxter includes several sensing systems:

- Cameras in the head for object recognition and workspace monitoring

- Sonar sensors to detect nearby humans

- Torque sensors in joints to detect collisions

- Sensors in the grippers to detect objects and force during grasping

### These sensors allow Baxter to:

- Detect obstacles and humans

- Adjust movements in real time

- Stop or slow down if a collision is detected

This makes it safer than traditional industrial robots that move at high speeds without awareness of humans nearby.

Programming and control

Baxter is designed to be easy to program, even for non-experts.

It can be programmed in two main ways:

### Demonstration / teaching mode

- A user physically moves the robot’s arm

- The robot records the motion

- Baxter repeats the movement automatically

### Software programming

- Uses the Robot Operating System (ROS)

- Controlled through a computer in the robot’s torso

- Developers can write code (often Python) to control movements and behaviours


### why Baxter Is Important in Robotics

- Baxter was significant because it introduced several key ideas in robotics:

- Collaborative robotics (cobots) – robots working safely with humans

- Low-cost industrial automation for small companies

- Human-robot interaction research

- Teaching robots through demonstration rather than complex coding

These concepts influenced the development of many modern collaborative robots used today.

---

# 2. Baxter at the University of Hull

The University of Hull robotics laboratories include Baxter alongside other robots such as NAO, Pepper, and TurtleBot3. Students use these platforms to learn about robotics, AI, and real-world robot programming.

In practice, Baxter at Hull is typically used for:

### Robotics programming

Students learn to program Baxter using tools such as:

- ROS (Robot Operating System)

- Python or C++

- Robot control frameworks and SDKs

This helps students understand robot control, kinematics, and perception systems.

### Human-robot interaction experiments

Because Baxter can work safely near people, it is useful for experiments involving:

- Collaborative manipulation

- Gesture or voice interaction

- Human-robot teamwork

### Research and project work

Baxter can be used for projects such as:

- Robotic object manipulation

- Machine vision experiments

- AI-driven task planning

- Learning from demonstration

### Teaching robotics fundamentals

- Students use Baxter to learn:

- Robotic arm kinematics

- Sensor integration

- Motion planning

- Robot perception systems