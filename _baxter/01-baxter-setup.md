---
title: "Baxter Setup"
date: 2026-01-15
permalink: /projects/baxter/baxter-setup
excerpt: "How to set up and initialise a Baxter robot."
---  
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

From inside the src folder, run:

```
wstool update (approx 1 minute)
```

Then source the project

```
source /opt/ros/groovy/setup.bash
```

---
You will run into errors (depending on OS version)

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

You may encounter a code error, depending on the Python version. So in baxter_interface (python script), you will see this: 

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

Next up, we will look at controlling Baxter through scripts.
