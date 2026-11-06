---
title: "Cause and fix merge conflicts"
date: 2026-11-04
excerpt: "Two teammates disagree about Scout's speed limit, and two versions of a 3D model can't both win. Merge their branches, read the markers and resolve every kind of conflict."
level: "Intermediate"
duration: "About 60 minutes"
needs:
  - "Labs 1 and 2, or the same experience"
  - "Python 3, to run the small practice robot (optional)"
series: "Git hands-on labs"
part: 4
topic: "Git"
tags: ["Git", "Practice", "Conflicts"]
aiAssisted: true
---
This lab uses the society's practice repository, [git-practice](https://github.com/Hull-Robotics-Society/git-practice). It's a pretend robot called **Scout**, with teammates whose branches are set up to collide. You only need a clone, and nothing you do here can reach the original, because you don't have permission to push there.

## Get the practice repository

```bash
git clone git@github.com:Hull-Robotics-Society/git-practice.git
cd git-practice
git branch
git branch -a
python3 robot.py
```

```text
* main

* main
  remotes/origin/HEAD -> origin/main
  remotes/origin/bug-hunt
  remotes/origin/main
  remotes/origin/team/bracket-a
  remotes/origin/team/bracket-b
  remotes/origin/team/lights
  remotes/origin/team/sensors
  remotes/origin/team/wheels
```

On Windows, you may need `python` instead of `python3`. If you've no Python, run `cat config.py` instead: it's where the speed limit is.

## Task 1: Why isn't the branch there?

The teammates' branches are listed. So try merging one:

```bash
git merge team/lights
```

```text
merge: team/lights - not something we can merge
```

**Predict:** the branch is right there in that list. Why can't Git find it?

<details>
<summary>Check your answer</summary>

Look at the names: they're `remotes/origin/team/lights`. A clone gives you one local branch, `main`, and a **remote-tracking** branch for the rest. Their full name for commands is `origin/team/lights`. This catches people out all the time.

</details>

See what each teammate has been doing, using the right names:

```bash
git log --oneline main..origin/team/wheels
git diff main...origin/team/wheels --stat
git diff main...origin/team/sensors --stat
```

**Predict:** both branches touch one file in common. Which file, and what do you expect will happen when you merge both?

<details>
<summary>Check your answer</summary>

`config.py`. Look at the two changes with `git diff main...origin/team/wheels -- config.py` and the same for sensors. Cleo wants 1.5 m/s for the new wheels. Dev wants 0.5 m/s so the bump sensor can react. Both changed the same line, so one of them will conflict.

</details>

## Task 2: Merge without trouble

Work on a branch of your own, so `main` stays clean:

```bash
git switch -c try-merge
git merge --no-edit origin/team/lights
python3 robot.py
git merge --no-edit origin/team/wheels
python3 robot.py
```

```text
Name: Scout
Speed limit: 1.5 m/s
Lights on: True
```

**Checkpoint:** two merges, no conflicts, and Scout has both changes. Git only conflicts when changes overlap.

## Task 3: Your first conflict

```bash
git merge origin/team/sensors
```

```text
Auto-merging config.py
CONFLICT (content): Merge conflict in config.py
Automatic merge failed; fix conflicts and then commit the result.
```

Stay calm and find out where you are:

```bash
git status
```

```text
You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Changes to be committed:
	new file:   sensors.py

Unmerged paths:
  (use "git add <file>..." to mark resolution)
	both modified:   config.py
```

Notice that `sensors.py` merged without trouble and is already staged. Only the file that overlaps needs you. Now look at it:

```bash
cat config.py
```

```text
# Scout's settings
NAME = "Scout"
<<<<<<< HEAD
MAX_SPEED = 1.5  # metres per second: the new wheels can take it
||||||| d078679
MAX_SPEED = 1.0  # metres per second
=======
MAX_SPEED = 0.5  # metres per second: slow enough to stop before a bump
>>>>>>> origin/team/sensors
```

You only get the middle section with `merge.conflictStyle zdiff3`, from [part 1](/tutorials/git-setup/#step-4-set-sensible-defaults).

**Predict:** which is your branch, which is theirs, and which is the original?

<details>
<summary>Check your answer</summary>

- `HEAD`, on top, is the branch you're on: 1.5 from wheels, which you merged a moment ago.
- `d078679`, in the middle, is the common starting point: 1.0.
- `origin/team/sensors`, at the bottom, is what's coming in: 0.5.

</details>

Read why each of them did it, then back right out, just to prove you can:

```bash
git log --merge --oneline config.py
git merge --abort
git status --short
cat config.py
```

**Checkpoint:** back to 1.5 with a clean status. A conflict is never a trap: `--abort` is always there.

## Task 4: Resolve it

Merge again:

```bash
git merge origin/team/sensors
```

What's the right speed? Git can't know. Neither can you, without asking, and that's the point: **resolving a conflict is a decision, not a typing exercise.** Suppose Cleo and Dev agree on 0.8 m/s. Open `config.py` in your editor and make it read exactly:

```python
# Scout's settings
NAME = "Scout"
MAX_SPEED = 0.8  # metres per second: agreed by Cleo and Dev
```

All the marker lines must go. Tell Git you've finished, check, and complete the merge:

```bash
git add config.py
git diff --check --cached
git merge --continue
python3 robot.py
git lg -9
```

```text
Name: Scout
Speed limit: 0.8 m/s
Lights on: True
```

`git diff --check --cached` should print nothing. Git will happily let you `git add` a file still full of markers, and this command is how you catch that. **Try it next time:** it prints `leftover conflict marker`.

## Task 5: The same conflict, in a rebase

Go back and do it the other way. Start a branch from Dev's work, and rebase it onto Cleo's:

```bash
git switch -c try-rebase --no-track origin/team/sensors
git rebase origin/team/wheels
```

**Predict:** Dev's branch has three commits, `wip`, the speed limit and `fix typo`. Which one stops the rebase?

<details>
<summary>Check your answer</summary>

The second, as `git status` shows you. A rebase replays commits one at a time, so `wip` went through without trouble and the one that changed `config.py` stopped it.

```text
Last commands done (2 commands done):
   pick 43a9f98 # wip
   pick 82fd853 # Lower the speed limit so the bump sensor has time to react
Next command to do (1 remaining command):
   pick 19a8eb7 # fix typo
```

</details>

Now look at the file:

```bash
cat config.py
```

```text
<<<<<<< HEAD
MAX_SPEED = 1.5  # metres per second: the new wheels can take it
||||||| parent of 82fd853 (Lower the speed limit so the bump sensor has time to react)
MAX_SPEED = 1.0  # metres per second
=======
MAX_SPEED = 0.5  # metres per second: slow enough to stop before a bump
>>>>>>> 82fd853 (Lower the speed limit so the bump sensor has time to react)
```

**Predict:** you're on Dev's branch. So is Dev's change `HEAD`?

<details>
<summary>Check your answer</summary>

No, and this catches everyone out. During a rebase, `HEAD` is the branch you're landing **on** (Cleo's). The commit being replayed, Dev's, is the bottom half. So `--ours` and `--theirs` are swapped compared with a merge. [Part 6 has a table](/tutorials/git-conflicts/#conflicts-during-a-rebase).

</details>

Resolve it as before (make it 0.8), then:

```bash
git add config.py
git rebase --continue
git lg -6
```

**Checkpoint:** a straight line, with Dev's three commits on top of Cleo's.

## Task 6: A conflict with no markers

Two people each updated the same 3D model.

```bash
git switch -c try-bracket --no-track origin/team/bracket-a
git merge origin/team/bracket-b
```

```text
warning: Cannot merge binary files: parts/bracket.stl (HEAD vs. origin/team/bracket-b)
CONFLICT (add/add): Merge conflict in parts/bracket.stl
```

Run `git status --short`. Binary files can't be combined, so one person's version has to win. Ben's has thicker walls, and Cleo's has extra mounting holes. Say you pick Cleo's, the incoming one:

```bash
git restore --theirs parts/bracket.stl
git add parts/bracket.stl
git merge --continue
```

**Predict:** was Ben's work lost?

<details>
<summary>Check your answer</summary>

It's gone from the current file, but not from history. Get it back any time with `git show origin/team/bracket-a:parts/bracket.stl > old-bracket.stl`. But someone will have to redo Ben's walls in CAD, starting from Cleo's model. So agree who's editing a part **before** starting. That's the real lesson here.

</details>

## Task 7: A conflict from a stash

```bash
git switch main
sed -i 's/MAX_SPEED = 1.0/MAX_SPEED = 2.0/' config.py
git status --short
git switch team/wheels
```

On macOS, use `sed -i ''`, or just edit the file by hand. The switch is refused: your edit would be overwritten. So set it aside and try again:

```bash
git stash push -m "try a faster speed"
git switch team/wheels
git stash pop
```

```text
CONFLICT (content): Merge conflict in config.py
The stash entry is kept in case you need it again.
```

Your stash is safe, because Git kept it. Say you've changed your mind and want the file as it was on this branch:

```bash
git restore --staged config.py
git restore config.py
git status
git stash list
git stash drop
git switch main
```

**Checkpoint:** a clean status and an empty `git stash list`.

## On your own

**Challenge 1.** Make a conflict from nothing. On a new branch from `main`, change `NAME` in `config.py`, and commit it. Then on another branch from `main`, change it to something else, and commit it. Merge them, keeping **both** names joined together.

<details>
<summary>Show a solution</summary>

```bash
git switch -c name-a main
sed -i 's/"Scout"/"Scout Alpha"/' config.py
git commit -am "Name Scout Alpha"
git switch -c name-b main
sed -i 's/"Scout"/"Scout Bravo"/' config.py
git commit -am "Name Scout Bravo"
git merge name-a
```

Edit `config.py` to read `NAME = "Scout Alpha Bravo"` and remove the markers. Then:

```bash
git add config.py
git diff --check --cached
git merge --continue
python3 robot.py
```

</details>

**Challenge 2.** Merge `origin/team/sensors` into a fresh branch from `origin/team/wheels`, keeping Dev's speed limit, using a single command to resolve the file. Don't open an editor.

<details>
<summary>Show a solution</summary>

```bash
git switch -c keep-dev --no-track origin/team/wheels
git merge origin/team/sensors
git restore --theirs config.py
git add config.py
git merge --continue
cat config.py
```

`--theirs` in a merge is what's coming in, which is Dev's. Taking a whole side like this also drops any other change in that file from your side.

</details>

**Challenge 3.** Repeat Challenge 2 as a rebase of Dev's branch onto Cleo's, again keeping Dev's speed.

<details>
<summary>Show a solution</summary>

```bash
git switch -c keep-dev-rebase --no-track origin/team/sensors
git rebase origin/team/wheels
git restore --theirs config.py
git add config.py
git rebase --continue
cat config.py
```

It's still `--theirs`, since in a rebase "theirs" is the commit being replayed, which is Dev's. That's the swap, and now you've seen it for real.

</details>

When you've finished, you can delete the branches you made or the whole clone. You'll use the clone again in [the next lab](/tutorials/git-lab-break-and-fix/).
