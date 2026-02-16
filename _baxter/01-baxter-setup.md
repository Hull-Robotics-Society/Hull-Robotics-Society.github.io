---
title: "Baxter Setup"
date: 2026-01-15
permalink: /projects/baxter/baxter-setup
excerpt: "How to set up and initialise a Baxter robot."
---  


# Baxter Documentation

## 1. Create the Workspace

First, create a meaningful ROS workspace.  
Make sure the name reflects the project's purpose.

```
mkdir -p ~/ros_baxter_ws/src
```

> It is recommended to keep “ros” in the name, but make the rest meaningful.

---

## 2. Navigate to Source Directory

Move into the workspace source folder:

```
cd ~/ros_baxter_ws/src
```

---

## 3. Initialise wstool

Initialise the workspace using wstool:

```
wstool init .
```

> This may take approximately 1 minute, depending on system performance.

---

## 4. Merge Baxter Repositories

Download the Baxter SDK repositories:

```
wstool merge https://raw.githubusercontent.com/RethinkRobotics/baxter/master/baxter_sdk.rosinstall
```

After merging, you should see the following packages:

- baxter  
- baxter_common  
- baxter_examples  
- baxter_interface  
- baxter_tools  

---

## 5. Update Workspace

From inside the `src` folder, run:

```
wstool update (approx 1 minute)
```

Then source the project

```
source /opt/ros/groovy/setup.bash
```

---
You will run into errors (depending on OS)

```
ls /opt/ros/noetic
```


---

## 6. Verify Installation

List the contents to confirm everything downloaded correctly:

```
ls
```

You should now see all Baxter-related folders inside the workspace.

---

You may encounter a code error, depending on the Python version. So in baxter_interface (python script) you will see this: 

```
except OSError, e;
```

This needs to be:

```
except OSEerror as e:
```

## 7. Setting up a connection to Baxter
Within baxter_ws, you will need to set both the host and user ID. This needs to be done by the staff.

Once started, you can start with topics and programming Baxter

You MUST source and build 

```
catkin_make
```

## 8. Starting with Baxter

After home making is done, it is now time to launch and enable Baxter. 

Must run first:

```
rosrun baxter.sh
```

Then we can start by entering the ws.

```
ros_baxter_ws
```

and then 

```
rosrun baxter_tools enable_robot.py -e
```

Enables baxter 

```
rosrun baxter_tools enable_robot.py -d
```

Disables baxter

To see preloaded topics (what you installed earlier)

```
rostopic list
```
Will show all active topics

To launch topics:

```
rostopic pub (insert topic)
```

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
