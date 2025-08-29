---
title: Keychain TinkerCAD & KiCAD Tutorial    
date: 2025-08-29
tags:
    - KiCAD
    - Manufacturing
    - TinkerCAD
    - Simulation
permalink: /tutorials/keychain/
excerpt: "**Learn how to design and build a keychain using TinkerCAD and KiCAD.**<br>Part of our Freshers Give It A Go event."
---

*Using TinkerCAD and KiCad*

---

## Step 1: Set Up TinkerCAD

- Visit [TinkerCAD.com](https://www.tinkercad.com)
- Log in or create an account
- Navigate to **"Circuits"**
- Click **"Create New Circuit"**

<div style="text-align: center;">
  <img src="/images/tutorials/keychain/create.svg" alt="Creating a new account and circuit project" style="width: 100%; max-width: 900px;">
  <br>
  <em>Figure 1: Creating a new account and circuit project in TinkerCAD.</em>
</div>

---

## Step 2: Create Your Circuit

- Use the component menu to add:
  - LEDs
  - Resistors
  - Power source (e.g., battery)
- Connect them using wires
- Click **"Start Simulation"** to test

<div style="text-align: center;">
  <img src="/images/tutorials/keychain/circuit.svg" alt="Creating a new LED circuit" style="width: 100%; max-width: 900px;">
  <br>
  <em>Figure 2: Creating a new LED circuit in TinkerCAD.</em>
</div>

---

## Step 3: Export Your Design

- Click **"Export"**
- Select **.BRD** (Eagle Board File)
- Save it to your device

<div style="text-align: center;">
  <img src="/images/tutorials/keychain/export.svg" alt="Exporting .BRD for KiCAD" style="width: 100%; max-width: 900px;">
  <br>
  <em>Figure 3: Exporting your circuit as a .BRD file for KiCAD.</em>
</div>

---

## Step 4: Import into KiCad

- Open KiCad (ask for help if not installed)
- Go to **File > Import Non-KiCad Project**
- Select your **.BRD** file
- Choose **Auto-Match Layers**

<div style="text-align: center;">
  <img src="/images/tutorials/keychain/kicad.svg" alt="KiCAD setup" style="width: 100%; max-width: 900px;">
  <br>
  <em>Figure 4: Setting up your project in KiCAD.</em>
</div>

---

## Step 5: Clean and Arrange

- Use the PCB editor to:
  - Reposition components
  - Start routing tracks

<div style="text-align: center;">
  <img src="/images/tutorials/keychain/optimise.svg" alt="Optimising the circuit layout" style="width: 100%; max-width: 900px;">
  <br>
  <em>Figure 5: Optimising the circuit layout in KiCAD.</em>
</div>

---

## Step 6: Route Your PCB

- Use routing tools (right panel)
- Press:
  - **V** to invert track layer
  - **F** to flip components
- Ensure tracks don’t overlap

<div style="text-align: center;">
  <img src="/images/tutorials/keychain/routing.svg" alt="Routing trace lines for the circuit" style="width: 100%; max-width: 900px;">
  <br>
  <em>Figure 6: Routing trace lines for the circuit.</em>
</div>

---

## Step 6.1: Preview in 3D

- Use KiCad’s 3D viewer to inspect your board
- Look for spacing and design issues

<div style="text-align: center;">
  <img src="/images/tutorials/keychain/3D.svg" alt="A 3D view of the circuit for final checks" style="width: 100%; max-width: 900px;">
  <br>
  <em>Figure 7: A 3D view of the circuit for final checks.</em>
</div>

---

## Step 7: Prepare for Printing

- Go to **File > Plot > Generate Drill Files**
- Save all output files
- Check for **.gbrjob** file
- Zip the folder
- Email the zipped files to us

<div style="text-align: center;">
  <img src="/images/tutorials/keychain/drill-files.svg" alt="Saving drill files for final submission" style="width: 100%; max-width: 900px;">
  <br>
  <em>Figure 8: Saving drill files for final submission.</em>
</div>

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
