# Baxter Documentation

## 1. Create the Workspace

First create a meaningful ROS workspace.  
Make sure the name reflects the project purpose.

```
mkdir -p ~/ros_baxter_ws/src
```

It is recommended to keep “ros” in the name but make the rest meaningful.

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
wstool init.
```

This may take approximately 1 minute, depending on system performance.

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

You will end up with a code error, depending on python version. So in baxter_interface you will see this: 

```
except OSError, e;
```

This needs to be:

```
except OSEerror as e:
```


## 7. Setting up a connection to Baxter
Within baxter_ws, you will need to set both the host and user ID. This needs to be done by the staff.

Once started, you can start with topics and programming baxter

You MUST source and build 

```
catkin_make
```

## 8. Starting with baxter

After home making is done, it is now time to launch and enable baxter. 

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

In order to see preloaded topics (what you installed earlier)

```
rostopic list
```
Will show all active topics

In order to launch topics:

```
rostopic pub (insert topic)
```

## Scripting

Much like ros2, you can create packages, topics, run scripts individualy ect....

```
catkin_make_pkg my_baxter_stuff scripts (scripts.py)
```

And then 

```
nano (scripts.py)
```

And enter the code 

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
