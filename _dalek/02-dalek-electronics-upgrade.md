---
layout: single
title: "Upgrading the Electronics"
date: 2024-09-10
permalink: /projects/dalek/dalek-electronics-upgrade/
excerpt: "Enhancing joystick control with a relay module for smooth movement and lighting control."
toc: true
---

## Enhancing the Dalek Project: Joystick Control, Relays, and Lights

After successfully constructing the custom joystick controller, we were faced with another obstacle—integrating the wheelchair’s control system with the additional functionality we wanted for the Dalek. The wheelchair’s control board required specific pins to be shorted to ground to enable the movement of the motors, and this meant that we needed a more complex way of controlling the wheelchair's functions.

To address this, we introduced a **4x relay module** into the system. This allowed us to enhance the joystick’s capabilities and fine-tune the Dalek’s movements, as well as adding a cool feature: the ability to control the Dalek’s **top lights**. Let’s dive into how we achieved this and expanded the project’s functionality.

---

## The Role of Relays in Enhancing Control

Relays play an essential role in allowing the Arduino to control various aspects of the Dalek’s movement and features. In the previous setup, we had only a basic joystick connected to the Arduino, which controlled the wheelchair’s movement. However, the wheelchair’s control system required some additional logic to handle specific inputs and activate different components.

Here’s how the **4x relay module** was integrated into the system:

- **Forward Movement**: The first relay allowed us to activate the motor for forward movement, based on the joystick input.
- **Left and Right Turns**: The second and third relays were responsible for handling the turning movements. When the joystick was tilted in either direction, the relays toggled the necessary pins to enable turning left or right.
- **Lighting Control**: The fourth relay was used to control the Dalek’s **top lights**. These lights were powered by a **12V supply**, and with the relay, we could easily toggle them on and off.

This setup provided a much more versatile system, allowing us to control not just movement but also the lights, which would add to the Dalek's visual appeal.

![Relay module and joystick controller setup](#)

---

## Wiring and Schematic Pin Layout

To achieve all of this, the **Arduino** acted as the central controller. The schematic for this setup involved wiring the joystick to the **analog input pins** of the Arduino, while the relays were connected to **digital output pins**. The goal was to allow fine control over the Dalek's movements and the lighting system using the joystick, while also ensuring that the relays could control specific functions.

### **Pin Layout:**

- **Joystick Wiring**: The joystick was wired into the **analog input pins** of the Arduino. Since the joystick was a 4-axis controller, it sent signals for both horizontal and vertical movement, which were read by the analog pins.
  
  - **X-axis (Left/Right)**: Connected to **analog pin A0**
  - **Y-axis (Forward/Backward)**: Connected to **analog pin A1**
  - **Z-axis (Buttons)**: Used for lighting control, connected to **digital pin 2**
  
- **Relay Wiring**: The **4x relay module** was connected to **digital pins 3, 4, 5, and 6**. Each of these relays corresponds to a specific function:
  
  - **Relay 1**: Controls forward movement
  - **Relay 2**: Handles left turns
  - **Relay 3**: Handles right turns
  - **Relay 4**: Controls the top lights
  
- **Motor Driver (L298N)**: A separate **L298N motor driver** was used to control the power to the stepper motor for the Dalek’s head and lighting system. The L298N receives control signals from the Arduino, which toggles the relays to determine whether the lights should be on or off and controls the direction of the stepper motor to rotate the head.

---

## Thresholding the Joystick for Fine Control

One of the challenges of using a joystick to control a large and potentially heavy system like the Dalek is ensuring smooth, fine-tuned movements. To achieve this, we implemented **thresholding** in the Arduino code. The joystick’s raw analog input values could fluctuate, so we introduced a threshold to ensure that small, unintended movements didn’t trigger full motion.

This allowed us to have better control over the wheelchair's movements, making it possible to apply gradual speed changes when the joystick was pushed slightly or to make more deliberate movements when the joystick was pushed further.

---

## Code Enhancements and Movement Direction

We also wanted to expand the movement capabilities of the Dalek, beyond just forward movement. The Arduino code was updated to allow for simultaneous movement in two directions at once. This means the Dalek could move **forward-right** or **forward-left**, adding greater maneuverability.

For example:
- Moving the joystick forward and slightly to the right would result in forward-right motion.
- Moving the joystick forward and slightly to the left would result in forward-left motion.

This addition allowed the Dalek to navigate more efficiently, especially in tight spaces where simple forward or reverse movement wasn’t sufficient. However, **reverse movement** wasn’t programmed or wired yet, so this remains an area for future improvements.

---

## The Expanded Code

Here’s a snippet of the Arduino code that handles the joystick and relays for movement and lighting control:

```arduino
// Pin Definitions
int joyX = A0; // Joystick X-axis (left-right)
int joyY = A1; // Joystick Y-axis (forward-backward)
int lightPin = 2; // Pin for controlling lights

// Relay Pins for movement control
int forwardRelay = 3;
int leftRelay = 4;
int rightRelay = 5;
int lightRelay = 6;

// Setup function
void setup() {
  pinMode(forwardRelay, OUTPUT);
  pinMode(leftRelay, OUTPUT);
  pinMode(rightRelay, OUTPUT);
  pinMode(lightRelay, OUTPUT);
  pinMode(lightPin, INPUT);
}

// Loop function
void loop() {
  int xVal = analogRead(joyX);
  int yVal = analogRead(joyY);

  // Thresholding the joystick values for smooth movement control
  if (yVal > 600) {
    digitalWrite(forwardRelay, HIGH); // Move forward
  } else {
    digitalWrite(forwardRelay, LOW);
  }

  if (xVal < 400) {
    digitalWrite(leftRelay, HIGH); // Turn left
  } else {
    digitalWrite(leftRelay, LOW);
  }

  if (xVal > 600) {
    digitalWrite(rightRelay, HIGH); // Turn right
  } else {
    digitalWrite(rightRelay, LOW);
  }

  // Lighting control
  if (digitalRead(lightPin) == HIGH) {
    digitalWrite(lightRelay, HIGH); // Turn lights on
  } else {
    digitalWrite(lightRelay, LOW); // Turn lights off
  }
}
```

For those of you interested in exploring the full code, you can download the .ino file here: Download Dalek Control Code.

## Next Steps: Head Movement and Further Expansion

As we continue to refine the Dalek project, the next major challenge will be experimenting with the head movement. Our goal is to add the ability to spin the Dalek’s head, which will require further work with the stepper motor and additional control logic.

We’re excited to continue expanding the project, adding more functionality, and working toward making the Dalek a fully operational, mobile robot.
