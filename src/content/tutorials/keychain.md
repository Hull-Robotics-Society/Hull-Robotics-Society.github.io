---
title: "Design a light-up PCB keychain"
slug: keychain
date: 2025-08-29
excerpt: "Simulate an LED circuit in TinkerCAD, move it into KiCad and route a board you can send off for manufacturing."
level: "Beginner"
duration: "About 60 minutes"
needs: "A laptop with KiCad installed"
session: "Give It A Go"
tags: ["KiCad", "TinkerCAD", "Electronics"]
---
*Using TinkerCAD and KiCad*

---

## Step 1: Set Up TinkerCAD

- Visit [TinkerCAD.com](https://www.tinkercad.com)
- Log in or create an account
- Navigate to **"Circuits"**
- Click **"Create New Circuit"**

<figure>
  <img src="/media/tutorials/keychain/create.svg" alt="Creating a new account and circuit project" />
  <figcaption>Figure 1: Creating a new account and circuit project in TinkerCAD.</figcaption>
</figure>

---

## Step 2: Create Your Circuit

- Use the component menu to add:
  - LEDs
  - Resistors
  - Power source (e.g., battery)
- Connect them using wires
- Click **"Start Simulation"** to test

<figure>
  <img src="/media/tutorials/keychain/circuit.svg" alt="Creating a new LED circuit" />
  <figcaption>Figure 2: Creating a new LED circuit in TinkerCAD.</figcaption>
</figure>

---

## Step 3: Export Your Design

- Click **"Export"**
- Select **.BRD** (Eagle Board File)
- Save it to your device

<figure>
  <img src="/media/tutorials/keychain/export.svg" alt="Exporting .BRD for KiCAD" />
  <figcaption>Figure 3: Exporting your circuit as a .BRD file for KiCAD.</figcaption>
</figure>

---

## Step 4: Import into KiCad

- Open KiCad (ask for help if not installed)
- Go to **File > Import Non-KiCad Project**
- Select your **.BRD** file
- Choose **Auto-Match Layers**

<figure>
  <img src="/media/tutorials/keychain/kicad.svg" alt="KiCAD setup" />
  <figcaption>Figure 4: Setting up your project in KiCAD.</figcaption>
</figure>

---

## Step 5: Clean and Arrange

- Use the PCB editor to:
  - Reposition components
  - Start routing tracks

<figure>
  <img src="/media/tutorials/keychain/optimise.svg" alt="Optimising the circuit layout" />
  <figcaption>Figure 5: Optimising the circuit layout in KiCAD.</figcaption>
</figure>

---

## Step 6: Route Your PCB

- Use routing tools (right panel)
- Press:
  - **V** to invert track layer
  - **F** to flip components
- Ensure tracks don’t overlap

<figure>
  <img src="/media/tutorials/keychain/routing.svg" alt="Routing trace lines for the circuit" />
  <figcaption>Figure 6: Routing trace lines for the circuit.</figcaption>
</figure>

---

## Step 6.1: Preview in 3D

- Use KiCad’s 3D viewer to inspect your board
- Look for spacing and design issues

<figure>
  <img src="/media/tutorials/keychain/3D.svg" alt="A 3D view of the circuit for final checks" />
  <figcaption>Figure 7: A 3D view of the circuit for final checks.</figcaption>
</figure>

---

## Step 7: Prepare for Printing

- Go to **File > Plot > Generate Drill Files**
- Save all output files
- Check for **.gbrjob** file
- Zip the folder
- Email the zipped files to us

<figure>
  <img src="/media/tutorials/keychain/drill-files.svg" alt="Saving drill files for final submission" />
  <figcaption>Figure 8: Saving drill files for final submission.</figcaption>
</figure>

---

## Bonus: Make it Yours!

- Add:
  - Custom shapes
  - Initials
  - Fun artwork or labels

---

## 🎉 Congrats!

You’ve created your own LED keychain PCB from scratch!  
Keep experimenting and making cool electronics!
