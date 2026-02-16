---
title: "Baxter Code"
date: 2026-01-16
permalink: /projects/baxter/baxter-code
excerpt: "How to code a Baxter robot."
---  

## 9. Scripting

Much like ROS2, you can create packages, topics, run scripts individually, etc.

```
catkin_make_pkg my_baxter_stuff scripts (scripts.py)
```

And then 

```
nano (scripts.py)
```

And enter code 

Again, like ros2, you MUST make them executable

```
chmod +x (scripts.py)
```
And then from the ws:

Enable robot, source, build 

```
rosrun my_baxter_stuff script.py
```

And then you should see the code come to life :)

## 10. Baxter arm positions

Please note:

The best way I have found to see the most reliable way is by adding a print line, for example:

```
print("Initial left:", left_angles)
```
Alternatively, for live positions, you can echo it:

```
rostopic echo /robot/joint_states
```

Starting point for the left arm:

```
Initial left: {
'left_e0': -0.08590292412158317, 
'left_e1': 1.1010147105047556,
'left_s0': -0.3616359707439863,
'left_s1': 0.3466796580621035,
'left_w0': -0.044485442848677,
'left_w1': 0.17602429540985123,
'left_w2': -0.0015339807878854137}

```
Starting point for the right arm:

```
Initial right: {
'right_e0': 0.11389807350049197,
'right_e1': 1.0523108204893938,
'right_s0': 0.38924762492592374,
'right_s1': 0.37160684586524145,
'right_w0': -0.09664078963678106,
'right_w1': 0.23086410857675477,
'right_w2': -0.0015339807878854137}
```

Baxter also has cameras and sensors around the head and hands (best to run in multiple terminals to see):

```
rqt_image_view
```

Here is a quick, simple example: 

https://github.com/user-attachments/assets/4337b7d4-a83f-4d7b-ae24-1a065d795056 


## 11. Programming Baxter through scripts

Here is some test code, plain and simple arm movemnt remeber stand clear!

```
import rospy
from baxter_interface import Limb
import copy

def smooth_move(arm, start_angles, target_angles, rate, steps=100):
    angles = copy.deepcopy(start_angles)

    for _ in range(steps):
        for j in target_angles:
            angles[j] += (target_angles[j] - angles[j]) * 0.15
        arm.set_joint_positions(angles)
        rate.sleep()

    # Force final pose
    arm.set_joint_positions(target_angles)
    return target_angles


def main():
    rospy.init_node('extend_arms')

    left_arm = Limb('left')
    right_arm = Limb('right')

    rate = rospy.Rate(50)

    # Save starting positions (DO NOT overwrite these)
    left_start = left_arm.joint_angles()
    right_start = right_arm.joint_angles()

    
    print("Initial left:", left_current)
    print("Initial right:", left_current)

    # Target positions
    target_left = {
        'left_s0': 9.0,
        'left_s1': -10.0,
        'left_e0': 0.0,
        'left_e1': 0.0,
        'left_w0': -5.0,
        'left_w1': 0.0,
        'left_w2': 0.0
    }

    target_right = {
        'right_s0': -9.0,
        'right_s1': -10.0,
        'right_e0': 0.0,
        'right_e1': 0.0,
        'right_w0': 5.0,
        'right_w1': 0.0,
        'right_w2': 0.0
    }

    rospy.loginfo("Moving to target")

    left_current = smooth_move(left_arm, left_start, target_left, rate)
    right_current = smooth_move(right_arm, right_start, target_right, rate)

    print("Last left:", left_current)
    print("Last right:", right_current)

    rospy.loginfo("Holding for 5 seconds")
    rospy.sleep(5.0)

    rospy.loginfo("Returning to start positions")

    smooth_move(left_arm, left_current, left_start, rate)
    smooth_move(right_arm, right_current, right_start, rate)

    rospy.loginfo("Motion complete")


if __name__ == '__main__':
    main()
```

Here is the starting and ending state for the arms:

```
Initial Left:
{'left_e0': 0.03489806292439316, 
'left_e1': 1.1259418983078937, 
'left_s0': -0.8038059328519568, 
'left_s1': 0.4506068564413403, 
'left_w0': -0.03029612056073692, 
'left_w1': 0.003451456772742181, 
'left_w2': 3.0418839023767754}

Initial Right:
{'right_e0': -0.05905826033358843, 
'right_e1': 0.9583544972314122, 
'right_s0': 0.8705340971249723, 
'right_s1': 0.6412039693361029, 
'right_w0': -0.2688301330769188, 
'right_w1': -0.23009711818281206, 
'right_w2': 0.6784030034423242}

Last Left:
{'left_e0': 0.03489806292439316, 
'left_e1': 1.1259418983078937, 
'left_s0': -0.8038059328519568, 
'left_s1': 0.4506068564413403, 
'left_w0': -0.03029612056073692, 
'left_w1': 0.003451456772742181, 
'left_w2': 3.0418839023767754}

Last Right: 
{'right_e0': -0.05905826033358843, 
'right_e1': 0.9583544972314122, 
'right_s0': 0.8705340971249723, 
'right_s1': 0.6412039693361029, 
'right_w0': -0.2688301330769188, 
'right_w1': -0.23009711818281206, 
'right_w2': 0.6784030034423242}
```

Now this code mainly moves the shoulders up and down, left, and right. Next, we'll go over each section of Baxter's arms:


