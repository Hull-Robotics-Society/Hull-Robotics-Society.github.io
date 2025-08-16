---
title: "Node-RED Integration: Connecting the OSRC to Robots"
date: 2025-08-16
excerpt: "How we use Node-RED to connect the OSRC controller to robots over a local network using MQTT."
permalink: /projects/OSRC/nodered/
---

## Node-RED Integration with the OSRC

Node-RED plays a crucial role in enabling seamless communication between the **Open Source Robotics Controller (OSRC)** and robots on the same local network. By leveraging **MQTT channels**, we can send commands from the OSRC's joysticks, buttons, and touchscreen to a Raspberry Pi (RPI) in the robot.

### How It Works

1. **Node-RED on the OSRC**:
   - The OSRC runs a Node-RED instance that acts as the central hub for processing inputs from the controller's hardware (joysticks, buttons, and touchscreen).
   - These inputs are converted into MQTT messages and published to specific topics, such as `robot/movement` or `robot/action`.

2. **Raspberry Pi on the Robot**:
   - The robot is equipped with a Raspberry Pi that subscribes to the MQTT topics published by the OSRC's Node-RED instance.
   - The Raspberry Pi processes these messages to control the robot's motors, sensors, or other components, such as lights or actuators.

3. **Local Network Communication**:
   - Both the OSRC and the robot's Raspberry Pi are connected to the same local network.
   - The robot's Raspberry Pi connects to the OSRC's Node-RED instance using its IP address and subscribes to the relevant MQTT topics.

### Understanding MQTT and Node-RED Communication

**MQTT (Message Queuing Telemetry Transport)** is a lightweight messaging protocol designed for low-bandwidth, high-latency networks. It is ideal for IoT applications like robotics. Here’s how MQTT works in this setup:

- **Publish/Subscribe Model**: 
  - The OSRC (via Node-RED) acts as the **publisher**, sending messages to specific topics (e.g., `robot/movement`).
  - The Raspberry Pi on the robot acts as the **subscriber**, listening to these topics and executing commands based on the received messages.

- **Broker**:
  - An MQTT broker (e.g., Mosquitto) is used to manage the communication between the publisher (OSRC) and subscriber (robot). The broker ensures that messages are delivered to the correct subscribers.

**Node-RED** simplifies the process of integrating MQTT into the system:
- **Input Nodes**: Node-RED can receive joystick, button, or touchscreen inputs from the OSRC hardware.
- **MQTT Output Nodes**: These nodes publish the processed inputs to MQTT topics.
- **MQTT Input Nodes**: On the robot’s Raspberry Pi, Node-RED can subscribe to these topics and trigger actions like motor control or sensor activation.

### Example Workflow

1. **Joystick Movement**:
   - The joystick on the OSRC sends directional input to Node-RED.
   - Node-RED processes the input and publishes an MQTT message to the topic `robot/movement` with payloads like `{"x": 0.5, "y": -0.3}` for forward-left movement.

2. **Button Press**:
   - A button press triggers a specific action, such as toggling a light or activating a sensor.
   - Node-RED publishes the action to the topic `robot/action` with payloads like `{"light": "on"}`.

3. **Touchscreen Commands**:
   - The touchscreen interface allows for more complex commands, such as setting waypoints or adjusting parameters.
   - These commands are published to topics like `robot/settings` with payloads like `{"speed": 0.8, "mode": "autonomous"}`.

### Visualizing the Node-RED Flows

With Node-RED, you can create visual flows to manage the communication. For example:
- **Input Flow**: A flow that reads joystick inputs, processes them, and publishes MQTT messages.
- **Output Flow**: A flow on the robot’s Raspberry Pi that subscribes to MQTT topics and triggers GPIO pins or motor controllers.

### Benefits of Using Node-RED and MQTT

- **Real-Time Communication**: Commands are sent and received with minimal latency, ensuring responsive control.
- **Flexibility**: Node-RED’s drag-and-drop interface makes it easy to modify or expand the system.
- **Scalability**: Additional robots or devices can be integrated by subscribing to the appropriate MQTT topics.
- **Cross-Platform**: MQTT and Node-RED work seamlessly across different hardware and operating systems.

### Next Steps

We are continuously improving the Node-RED workflows to enhance the OSRC’s capabilities. Future updates will include:
- Advanced error handling and feedback mechanisms.
- Integration with additional sensors and actuators.
- Support for multiple robots communicating with the OSRC simultaneously.

Stay tuned for more updates as we refine this powerful integration!
