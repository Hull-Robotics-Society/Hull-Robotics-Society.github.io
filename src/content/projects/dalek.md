---
title: Dalek
order: 1
status: active
started: 2024-08-15
tagline: A full-size Dalek on a repurposed electric wheelchair, driven by joystick, by Node-RED, and by an EEG headset reading the operator's brain signals.
summary: A full-size, mind-controlled Dalek on an electric wheelchair base.
tags: [Arduino, EEG]
filters: [electronics, eeg]
stack: Arduino, Raspberry Pi, Node-RED, Emotiv EEG
seenAt: Freshers Fair, Top 100 Leaders, Varsity 2026
cover: /images/site/dalek.jpg
hero: /images/dalek/100-leaders/dalek-100-03.jpg
repo: https://github.com/Hull-Robotics-Society/Dalek
gallery: [images/dalek, media/dalek]
cad:
  repo: Hull-Robotics-Society/Dalek
  folders: ["[01] 3D Models", "[02] Electronics"]
  names:
    dalekcentre: Centre section
    dalekstalksupport: Eye-stalk support
    wheelchair-shim: Wheelchair shim
    pcb mount: PCB mount
    molexmount: Molex connector mount
  groups:
    "[01] 3D Models": Body
    "[02] Electronics": Electronics
roster:
  eyebrow: Flagship build
  video: /media/loops/dalek-dance.mp4
  image: /images/site/dalek.jpg
  specs:
    - ["Base", "Electric wheelchair, DB9 controller"]
    - ["Brains", "Arduino bridge, Raspberry Pi"]
    - ["Party trick", "EEG headset → Node-RED → motors"]
    - ["Seen at", "Freshers Fair, Top 100 Leaders, Varsity 2026"]
---

We started the Dalek in August 2024 with one goal: give a fibreglass Dalek shell a base that could actually move. An electric wheelchair gave us motors and batteries, but no joystick. So we built our own controller: a 4-axis joystick feeding an Arduino, which talks to the wheelchair through its DB9 port.

Since then it has gained relay-switched lights, a fresh coat of paint for Freshers Fair, and a mind-control mode that turns EEG signals into movement. It has been to the Top 100 Leaders event in Beverley and to Varsity 2026.
