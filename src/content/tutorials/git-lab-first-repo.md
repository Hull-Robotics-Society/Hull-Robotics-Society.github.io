---
title: "Build your first repository from the command line"
date: 2026-11-04
excerpt: "Make a repository, add folders and files, commit them, ignore what doesn't belong and push it all to GitHub, typing every command yourself."
level: "Beginner"
duration: "About 45 minutes"
needs:
  - "Git set up with an SSH key (Git and GitHub, part 1)"
  - "A terminal, and no graphical Git tools for now"
  - "A GitHub account"
series: "Git hands-on labs"
part: 1
topic: "Git"
tags: ["Git", "Practice", "CLI"]
aiAssisted: true
---
Reading about Git and using Git are different skills. These labs are for practising: you do the work, make the mistakes on purpose, and find out what really happens. If you want the explanations behind them, they're in the [Git and GitHub](/tutorials/git-setup/) series.

## How the labs work

| Lab | What you do | Needs |
| --- | --- | --- |
| 1 | Build a repository from nothing and push it | Your own GitHub account |
| 2 | [Branch, merge and rebase](/tutorials/git-lab-branches/) | Lab 1's repository |
| 3 | [Make your own ahead, behind and diverged](/tutorials/git-lab-ahead-behind/) | Lab 1's repository |
| 4 | [Cause and fix merge conflicts](/tutorials/git-lab-conflicts/) | The practice repository |
| 5 | [Break things and recover them](/tutorials/git-lab-break-and-fix/) | The practice repository |
| 6 | [Fork, branch and open a real pull request](/tutorials/git-lab-fork-pr/) | A fork of the practice repository |
| 7 | [Handle three branches at once](/tutorials/git-lab-three-branches/) | Your fork, and optionally two friends |

Four rules make them worthwhile:

1. **Type the commands. Don't paste them.** Your fingers learn what your eyes skip over.
2. **Run `git status` constantly.** It's free, it changes nothing, and it tells you where you stand.
3. **Answer the Predict questions before you open the answer.** Being wrong and finding out why is how this sticks.
4. **Try the challenges without looking.** Every answer is there when you need it.

Your commit hashes will differ from the ones shown, which is normal. Messages may vary slightly between Git versions.

## Task 1: Start from nothing

Make a folder and go into it:

```bash
mkdir git-lab
cd git-lab
git status
```

```text
fatal: not a git repository (or any parent up to mount point /)
```

This folder isn't a repository yet, so Git has nothing to say. Fix that, and look again:

```bash
git init
git status
```

```text
On branch main

No commits yet

nothing to commit (create/copy files and use "git add" to track)
```

**Checkpoint:** run `ls -a`. You should see a `.git` folder. That's the whole repository.

## Task 2: Make your first commit

Create a file:

```bash
echo "# My robot" > README.md
git status
```

**Predict:** will Git save this file in your next commit, as things stand?

<details>
<summary>Check your answer</summary>

No. It's listed under `Untracked files`, so Git can see it but isn't looking after it. `git status --short` shows this as `?? README.md`.

</details>

Stage it, then compare:

```bash
git add README.md
git status --short
```

```text
A  README.md
```

The `A` in the left column means it's staged. Now record it:

```bash
git commit -m "Add README"
git log
```

```text
commit 69d3e3ee2db103d050610e404687045e6dc3562d
Author: Sam <sam@example.com>
Date:   Wed Nov 4 19:06:18 2026 +0000

    Add README
```

**Checkpoint:** `git status` says `nothing to commit, working tree clean`.

## Task 3: Add folders and files

Make an empty folder, then look:

```bash
mkdir docs
git status
```

**Predict:** will `git status` mention `docs`?

<details>
<summary>Check your answer</summary>

No. It still says `working tree clean`, because **Git tracks files, not folders**. An empty folder doesn't exist as far as Git is concerned. People often add an empty file called `.gitkeep` to keep a folder in a repository.

</details>

Now add a nested folder and some files:

```bash
mkdir -p src/sensors
echo "print('Hello from my robot')" > src/robot.py
echo "bump = False" > src/sensors/bump.py
echo "Wiring notes go here" > docs/wiring.md
git status --short
```

```text
?? docs/
?? src/
```

Git shows new folders as one line, however many files they hold. You'll make **two** commits here, one per idea. Stage just the code:

```bash
git add src
git status --short
```

```text
A  src/robot.py
A  src/sensors/bump.py
?? docs/
```

Staging a folder stages everything in it. Commit that, then do the docs:

```bash
git commit -m "Add robot code"
git add docs
git commit -m "Add wiring notes"
git log --oneline
```

```text
e381e7b Add wiring notes
b3e8f36 Add robot code
69d3e3e Add README
```

## Task 4: Change files and see what changed

Change two files at once:

```bash
echo "print('Now with more speed')" >> src/robot.py
echo "Motor goes on pin 5" >> docs/wiring.md
git status --short
```

```text
 M docs/wiring.md
 M src/robot.py
```

The `M` in the **right** column means changed but not staged. See exactly what changed in one file:

```bash
git diff src/robot.py
```

```diff
@@ -1 +1,2 @@
 print('Hello from my robot')
+print('Now with more speed')
```

These two changes are unrelated, so they belong in separate commits. Stage one:

```bash
git add src/robot.py
git status --short
```

```text
 M docs/wiring.md
M  src/robot.py
```

**Predict:** you run `git diff` now. Which file does it show? And `git diff --staged`?

<details>
<summary>Check your answer</summary>

`git diff` shows `docs/wiring.md`, the part that's still unstaged. `git diff --staged` shows `src/robot.py`, what the next commit will contain. Try both.

</details>

Commit each one:

```bash
git commit -m "Print a message about speed"
git add docs/wiring.md
git commit -m "Add the motor pin"
```

## Task 5: Undo small mistakes

Ruin a file, then bring it back:

```bash
echo "mistake mistake mistake" >> docs/wiring.md
git status --short
git restore docs/wiring.md
git status --short
cat docs/wiring.md
```

The mistake is gone, and `git status` is clean. **`git restore` can't be undone,** so be sure before you use it on real work.

Now commit with a typo in the message, then fix it:

```bash
echo "A README for my robot" >> README.md
git add README.md
git commit -m "Updte README"
git commit --amend -m "Update README"
git log --oneline -2
```

Only do `--amend` on commits you haven't pushed. You'll see why in [Lab 3](/tutorials/git-lab-ahead-behind/).

## Task 6: Keep secrets and junk out

Create two things that should never be committed:

```bash
echo "super-secret-password" > secrets.txt
mkdir build
echo "compiled" > build/robot.bin
git status --short
```

```text
?? build/
?? secrets.txt
```

One careless `git add .` and that password is in your history for good. Tell Git to ignore them:

```bash
printf 'secrets.txt\nbuild/\n' > .gitignore
git status --short
```

```text
?? .gitignore
```

They've gone from the list, and only the `.gitignore` remains. Commit it, so everyone working on the project gets the same rules:

```bash
git add .gitignore
git commit -m "Ignore secrets and build output"
```

**Checkpoint:** `git log --oneline` shows seven commits, and `ls` still shows `secrets.txt` and `build`. Ignoring hides them from Git and doesn't delete them.

## Task 7: Put it on GitHub

Your history is only on your laptop. Create an **empty** repository to push to. With the [GitHub CLI](/tutorials/git-setup/#step-6-install-the-github-cli-optional), you can stay in the terminal:

```bash
gh repo create git-lab --private --source=. --remote=origin
```

Or on the website, press **+ → New repository**, name it `git-lab`, **leave every box unticked**, and create it. Then connect it, using your own username:

```bash
git remote add origin git@github.com:your-username/git-lab.git
```

Check the connection, and see what `git status` says:

```bash
git remote -v
git status
```

**Predict:** does `git status` mention GitHub yet?

<details>
<summary>Check your answer</summary>

No. You've saved an address, but your `main` isn't linked to anything until the first push. Nothing has left your laptop.

</details>

Push it:

```bash
git push -u origin main
git status
```

```text
On branch main
Your branch is up to date with 'origin/main'.
```

That new line appears because `-u` linked your `main` to `origin/main`. Refresh the repository page on GitHub: all your commits and folders are there.

**Checkpoint:** can you see `secrets.txt` or `build` on GitHub? You shouldn't be able to. If you can, stop and read [You pushed a password or key](/tutorials/git-undo/#you-pushed-a-password-or-key).

## Task 8: The disaster drill

This is what it was all for. Pretend your laptop has just died:

```bash
cd ..
rm -rf git-lab
ls
```

Your project has gone. Get it back, using your own username:

```bash
git clone git@github.com:your-username/git-lab.git
cd git-lab
git log --oneline
ls -a
```

**Predict:** is `secrets.txt` back?

<details>
<summary>Check your answer</summary>

No, because it was never committed. Everything you committed and pushed has come back, with its whole history. This is the difference between a backup and a file on your laptop. It's also why anything needed to rebuild the project should be committed, and why secrets should be stored somewhere else, such as a password manager.

</details>

## On your own

No commands this time. Try each challenge, and use `git status` as you go.

**Challenge 1.** Add a `tests` folder containing a file called `test_robot.py`, commit it, and push it. Finish with `git status` saying you're up to date.

<details>
<summary>Show a solution</summary>

```bash
mkdir tests
echo "assert True" > tests/test_robot.py
git add tests
git commit -m "Add a first test"
git status
git push
git status
```

The first `git status` says `ahead of 'origin/main' by 1 commit`. That's how you know you've got something to push.

</details>

**Challenge 2.** Create `src/motor.py` and `notes.txt`, then commit only `src/motor.py`. Delete `notes.txt` afterwards without using Git, because it was never tracked.

<details>
<summary>Show a solution</summary>

```bash
echo "speed = 1" > src/motor.py
echo "remember the batteries" > notes.txt
git add src/motor.py
git status --short
git commit -m "Add the motor"
rm notes.txt
git status
```

</details>

**Challenge 3.** Find out which commits changed `docs/wiring.md`, then look at what the most recent of those did.

<details>
<summary>Show a solution</summary>

```bash
git log --oneline -- docs/wiring.md
git show HEAD -- docs/wiring.md
```

The second command only works if the latest commit touched that file. Otherwise, use the hash from the first command in place of `HEAD`: `git show e381e7b`.

</details>

**Challenge 4.** Rename `src/motor.py` to `src/motors.py`, and commit it so that `git log --follow` can still trace its history.

<details>
<summary>Show a solution</summary>

```bash
git mv src/motor.py src/motors.py
git status --short
git commit -m "Rename the motor module"
git log --oneline --follow -- src/motors.py
```

`git status --short` shows `R` for renamed.

</details>

Keep this repository. [The next lab](/tutorials/git-lab-branches/) uses it.
