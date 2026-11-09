---
title: "Break things and get them back"
author: "Rob Finnis"
date: 2026-11-04
excerpt: "Destroy commits with reset, delete branches, get lost in detached HEAD, then recover everything with the reflog. Finish by tidying a messy branch and hunting a hidden bug with bisect."
level: "Intermediate"
duration: "About 75 minutes"
needs:
  - "A clone of git-practice, from Lab 4"
  - "Python 3, for the bug hunt"
series: "Git hands-on labs"
part: 5
topic: "Git"
tags: ["Git", "Practice", "Recovery"]
---
The best time to find out you can recover from a disaster is before you've had one. Here you'll cause each disaster on purpose, in a repository that doesn't matter. After this, `git reset --hard` should be less scary.

```bash
cd git-practice
git switch main
git status
```

If `git status` isn't clean, run `git restore .` Then make three commits to play with:

```bash
git switch -c lab5
echo "one" >> notes.txt
git add notes.txt
git commit -m "Add note one"
echo "two" >> notes.txt
git commit -am "Add note two"
echo "three" >> notes.txt
git commit -am "Add note three"
git log --oneline -4
```

## Disaster 1: You reset too far

```bash
git reset --hard HEAD~2
git log --oneline -2
cat notes.txt
```

```text
e9f5fa8 Add note one
606ecd3 Add a note on where to get help
one
```

Two commits have disappeared from your log, and from the file. `git log` won't help you now.

**Predict:** have they gone for good?

<details>
<summary>Check your answer</summary>

No. Commits aren't deleted by moving a label. Only the label moved, and Git kept a diary of it.

</details>

Read the diary:

```bash
git reflog -4
```

```text
e9f5fa8 HEAD@{0}: reset: moving to HEAD~2
cec6da9 HEAD@{1}: commit: Add note three
8ecabb6 HEAD@{2}: commit: Add note two
e9f5fa8 HEAD@{3}: commit: Add note one
```

`HEAD@{1}` is where you were just before the reset. Go back:

```bash
git reset --hard HEAD@{1}
git log --oneline -4
cat notes.txt
```

**Checkpoint:** all three notes are back.

## Disaster 2: You deleted a branch

First squash the last two commits with a soft reset, which keeps your work staged:

```bash
git reset --soft HEAD~2
git status --short
git commit -m "Add notes two and three"
git log --oneline -3
```

Now delete the whole branch, unmerged work and all:

```bash
git switch main
git branch -D lab5
git branch
```

```text
Deleted branch lab5 (was 447b36a).
```

**Challenge:** get the branch back, with its commits. You've seen everything you need.

<details>
<summary>Show a solution</summary>

```bash
git reflog -3
git switch -c lab5 HEAD@{1}
git log --oneline -3
```

The reflog entry from before `moving from lab5 to main` is your last commit on the branch. You could also use the hash from the `Deleted branch` message: `git switch -c lab5 447b36a`.

</details>

## Disaster 3: Committed to the wrong branch

```bash
git switch main
echo "fix" > important-fix.txt
git add important-fix.txt
git commit -m "Important fix"
git status
```

```text
Your branch is ahead of 'origin/main' by 1 commit.
```

This should have been on a branch. **Challenge:** move it to a new branch called `fix/important`, and put `main` back where it was, with the commit surviving.

<details>
<summary>Show a solution</summary>

```bash
git switch -c fix/important
git switch main
git reset --hard origin/main
git status
git log --oneline -1 fix/important
```

The order matters: make the label **before** you move `main`.

</details>

## Disaster 4: Detached HEAD

Go and look at some old code:

```bash
git switch --detach HEAD~2
git status
```

```text
HEAD detached at bb850aa
```

Having a look around is fine. Now the mistake: you start working here.

```bash
echo "a brilliant idea" > idea.txt
git add idea.txt
git commit -m "Experiment"
git switch main
```

```text
Warning: you are leaving 1 commit behind, not connected to
any of your branches:

  41302d1 Experiment
```

**Challenge:** clear the screen with `clear` so the hash is gone, then rescue that commit onto a branch called `experiment`.

<details>
<summary>Show a solution</summary>

```bash
git reflog -3
git switch -c experiment HEAD@{1}
git log --oneline -1
ls
git switch main
```

If you were still detached, `git switch -c experiment` would have been all you needed.

</details>

## Disaster 5: A bad commit everyone already has

If a bad commit is on a shared branch, you can't rewrite it: others have it. Add a new commit that undoes it:

```bash
git switch lab5
git revert --no-edit HEAD
git log --oneline -3
cat notes.txt
```

```text
245fbfd Revert "Add notes two and three"
447b36a Add notes two and three
e9f5fa8 Add note one
```

**Predict:** compare with Disaster 1. Why is revert safe to push, when `reset --hard` followed by a force push isn't?

<details>
<summary>Check your answer</summary>

Revert only adds to history. Everyone else's copies stay valid, and a normal `git push` works. A reset takes commits away, so anyone who has them now has a history that disagrees with yours.

</details>

## Disaster 6: Wrecked files

Overwrite a real file, and add some junk:

```bash
echo "garbage" > config.py
echo "temp" > temp.txt
mkdir temp-dir
echo "temp" > temp-dir/file.txt
git status --short
```

Bring back the file, then preview before deleting the junk:

```bash
git restore config.py
git clean -nd
```

```text
Would remove temp-dir/
Would remove temp.txt
```

```bash
git clean -fd
git status
```

**Warning:** `git restore` and `git clean` are the two commands here the reflog **can't** undo, because they act on work Git has never saved. That's why you should commit often: **anything committed can be recovered, and anything uncommitted might not be.**

## Tidy a messy branch

Dev's branch has an untidy history. Make your own copy to clean up:

```bash
git switch -c tidy-sensors --no-track origin/team/sensors
git log --oneline -4
```

```text
19a8eb7 fix typo
82fd853 Lower the speed limit so the bump sensor has time to react
43a9f98 wip
d078679 Add the crew folder and its check
```

That `wip` and `fix typo` shouldn't reach `main`. The aim is two clean commits: "Add the bump sensor", which includes the typo fix, followed by the speed limit. Start an interactive rebase:

```bash
git rebase -i HEAD~3
```

Your editor shows the commits, **oldest first**:

```git-rebase
pick 43a9f98 # wip
pick 82fd853 # Lower the speed limit so the bump sensor has time to react
pick 19a8eb7 # fix typo
```

Change it to this. Move the `fix typo` line up, and change the first word on two lines:

```git-rebase
reword 43a9f98 # wip
fixup 19a8eb7 # fix typo
pick 82fd853 # Lower the speed limit so the bump sensor has time to react
```

Save and close. Git stops for the new message: replace `wip` with `Add the bump sensor`, then save and close again.

```bash
git log --oneline -3
git diff origin/team/sensors tidy-sensors --stat
cat sensors.py
```

```text
8c3bfde Lower the speed limit so the bump sensor has time to react
26c860b Add the bump sensor
d078679 Add the crew folder and its check
```

**Checkpoint:** the `git diff` prints **nothing**. You have a completely different history and exactly the same code. And `sensors.py` says `return`, because the typo never officially happened.

If your editor closes and it all goes wrong, `git rebase --abort` gets you out, and `git reflog` is there afterwards.

## The bug hunt

Scout's speed limit has become dangerously high on the `bug-hunt` branch.

```bash
git switch bug-hunt
python3 scripts/check_speed.py
git rev-list --count main..bug-hunt
git log --oneline -5
```

```text
Unsafe speed limit: 15.0
32
```

There are 32 commits, with messages that are no help at all. Reading them by hand would take a while. `git bisect` needs about five checks. Tell it where to start:

```bash
git bisect start
git bisect bad
git bisect good HEAD~32
```

```text
Bisecting: 15 revisions left to test after this (roughly 4 steps)
[fce48cb3226a2f08efe43c9f5c0c177108112cd1] Log test run 16
```

Git has checked out the middle commit. Test it, and report back:

```bash
python3 scripts/check_speed.py
```

If it prints `OK`, type `git bisect good`. If it prints `Unsafe`, type `git bisect bad`. **Keep repeating those two steps until Git names the culprit.**

**Predict:** before you start, how many times do you think you'll have to test?

<details>
<summary>Check your answer</summary>

About five. Each test halves the suspects: 32, 16, 8, 4, 2, 1. Over 1,000 commits it'd only take about ten.

</details>

```text
06fd77ab3af24993a4be09d61be3100d79b9dbe9 is the first 'bad' commit
    Tidy up the test log
```

Look at what that "tidy up" really did, then go back:

```bash
git show 06fd77a
git bisect reset
```

Now do it again, and let Git run the test itself. The script exits with an error for bad, which is all it needs:

```bash
git bisect start
git bisect bad
git bisect good HEAD~32
git bisect run python3 scripts/check_speed.py
git bisect reset
```

**Checkpoint:** you get the same commit, without typing `good` or `bad` once. This is why a test script is such a good thing to have.

## On your own

**Challenge 1.** Reset your `lab5` branch back past the revert, using `git reset`, with the undone work left **unstaged** in your folder.

<details>
<summary>Show a solution</summary>

```bash
git switch lab5
git reset HEAD~1
git status --short
```

Without `--soft` or `--hard`, the branch moves, and your files stay as they are with the changes unstaged. Tidy up with `git restore notes.txt`.

</details>

**Challenge 2.** Drop a stash, then get it back.

<details>
<summary>Show a solution</summary>

```bash
echo "precious" >> notes.txt
git stash push -m "precious work"
git stash drop
git fsck --no-reflogs --lost-found | grep commit
```

Look through the listed hashes using `git show`. The `Dropped` message also printed the hash. When you find it:

```bash
git stash apply HASH
```

</details>

**Challenge 3.** Interactive rebase again. On a new branch from `origin/team/wheels`, reverse the order of the two commits, then drop the one that adds `wheels.py`.

<details>
<summary>Show a solution</summary>

```bash
git switch -c reorder --no-track origin/team/wheels
git rebase -i HEAD~2
```

Swap the two lines and save. Then:

```bash
git log --oneline -3
git rebase -i HEAD~2
```

Change `pick` to `drop` on `Add wheel dimensions`, and save. `ls` shows `wheels.py` has gone.

</details>

**Challenge 4.** Find the bad commit from the bug hunt another way, with no bisect, by searching for the text that changed.

<details>
<summary>Show a solution</summary>

```bash
git log --oneline -S"15.0" origin/bug-hunt -- config.py
```

This lists commits that added or removed that text. It works when you know what you're looking for. Bisect works when all you know is that something broke.

</details>

Next, it's time to make a contribution that someone else will read: [fork the practice repository](/tutorials/git-lab-fork-pr/).
