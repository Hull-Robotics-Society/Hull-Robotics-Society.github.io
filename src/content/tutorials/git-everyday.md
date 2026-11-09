---
title: "The everyday loop: from first commit to push"
author: "Rob Finnis"
date: 2026-11-04
excerpt: "Start or clone a repository, stage exactly what you mean to, write commits people can read, ignore the files that don't belong, and push your work."
level: "Beginner"
duration: "About 60 minutes"
needs:
  - "Git set up with an SSH key (part 1)"
  - "A folder you can experiment in"
series: "Git and GitHub"
part: 3
topic: "Git"
tags: ["Git", "Commits"]
---
> **Learn by doing:** [Lab 1](/tutorials/git-lab-first-repo/) has you build a repository from nothing and push it, using every command here.

This is the loop you'll run many times a day. Follow along in a practice repository, because nothing here can affect anyone else until you push.

## Start a repository

There are two ways to begin: from an existing project or from scratch.

**Copy a project that already exists** with `git clone`. This creates a folder, downloads the full history and sets up `origin`:

```bash
git clone git@github.com:Hull-Robotics-Society/Dalek.git
cd Dalek
```

**Start from scratch** with `git init`:

```bash
mkdir line-follower
cd line-follower
git init
```

> Don't run `git init` inside a folder that's already in a repository, and don't run it in your home folder. If `git status` lists your whole Documents folder, that's what happened. Delete the stray `.git` folder to undo it, after checking it's the one you just made.

## Check where you are

`git status` is the most useful command in Git. It changes nothing and tells you the branch, how you compare with GitHub, and what's changed. It even suggests next steps. Run it before and after anything you're unsure of.

```text
On branch main
Your branch is up to date with 'origin/main'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	modified:   motor.py

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   README.md

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	sensor.py
```

Those three groups match the areas from [part 2](/tutorials/git-how-it-works/#the-three-places-your-work-can-be):

- **Changes to be committed:** in the staging area, ready to go.
- **Changes not staged:** edited in your working folder, but they won't go into the next commit.
- **Untracked:** new files Git has never been told about.

For a shorter version, `git status --short` uses two columns: the left is staged, the right is unstaged.

```text
M  motor.py
 M README.md
?? sensor.py
```

## See what you changed

```bash
git diff              # changed but not yet staged
git diff --staged     # staged, what the next commit will contain
git diff HEAD         # both together
git diff motor.py     # just one file
```

Read `git diff --staged` before you commit. It catches debug prints, stray passwords and files you didn't mean to touch.

## Stage what you mean to commit

```bash
git add motor.py         # one file
git add src/             # everything in a folder
git add -p               # choose changes piece by piece
git add -A               # every change in the repository
```

`git add -p` shows each changed chunk and asks what to do with it: `y` to stage it, `n` to skip it, `s` to split it into smaller chunks, `q` to quit. It's how you turn a messy afternoon into two tidy commits.

Be careful with `git add -A` and `git add .`. They pick up everything, including that 2 GB rosbag you left in the folder. Check `git status` first, and set up `.gitignore` as shown below.

To take something back out of the staging area without losing your edits:

```bash
git restore --staged motor.py
```

## Commit

```bash
git commit -m "Limit motor speed when the bump sensor fires"
```

Without `-m`, Git opens your editor. To stage every tracked file that changed and commit in one go, use `git commit -am "message"`. It skips brand-new files, which you must `git add` first.

### Write messages your future self can use

In six months you'll be searching the history for when something broke. "Fixed stuff" won't help.

```text
Limit motor speed when the bump sensor fires

The arm hit the bench during Tuesday's demo because the speed limit
only applied in manual mode. Apply it in every mode.

Closes #14
```

- The first line is a summary of about 50 characters, written as an instruction: "Add", "Fix", "Limit". It should complete the sentence "This commit will…".
- Leave a blank line, then explain **why** if it isn't obvious. The diff already shows what changed.
- On GitHub, `Closes #14` closes that issue once the commit reaches the default branch.

### Keep commits small

Each commit should do one thing, and the project should still work after it. Small commits are easier to review, to undo with `git revert`, and to search with [`git bisect`](/tutorials/git-power-tools/#find-the-commit-that-broke-it-with-git-bisect). Commit whenever you reach a point you might want to return to, usually many times a day.

### Fix the commit you just made

If you spot a typo in the message, or forgot a file, and **you haven't pushed yet**:

```bash
git add forgotten-file.py
git commit --amend -m "Limit motor speed when the bump sensor fires"
```

This replaces the last commit with a new one. If you've already pushed it, see [part 7](/tutorials/git-undo/#the-right-tool-for-each-mistake) first.

## Tell Git what to ignore

A `.gitignore` file lists things that should never be committed. Create it early, because Git doesn't ignore a file it's already tracking.

```text
# Python
__pycache__/
*.pyc
.venv/

# ROS 2 workspaces
build/
install/
log/

# Arduino and PlatformIO
.pio/

# Editors and systems
.vscode/
.DS_Store
Thumbs.db

# Secrets and recordings: never commit these
.env
*.pem
*.bag
```

The rules work like this:

- A trailing `/` means a folder.
- `*` matches anything within a name.
- A line starting with `!` makes an exception.
- Lines starting with `#` are comments.

Commit `.gitignore` itself, so everyone shares it. [github/gitignore](https://github.com/github/gitignore) has ready-made lists for most languages, including ROS and Arduino.

### You already committed something you shouldn't have

Adding a tracked file to `.gitignore` does nothing on its own. Tell Git to stop tracking it but keep the file on disk:

```bash
echo "build/" >> .gitignore
git rm -r --cached build
git add .gitignore
git commit -m "Stop tracking the build folder"
```

The files stay in the old commits, which is fine for build output. **If the file holds a password or key, this isn't enough:** see [leaked secrets](/tutorials/git-undo/#you-pushed-a-password-or-key).

## Move and delete files

```bash
git mv old-name.py new-name.py    # rename and stage it
git rm old-file.py                # delete and stage it
git rm --cached secret.txt        # stop tracking, keep the file
```

You don't have to use these. If you rename a file normally and `git add` both names, Git still works out that it was a rename.

## Share your work

### Connect a new repository to GitHub

Create an **empty** repository on GitHub: untick the README, licence and `.gitignore` options. [Unrelated histories](/tutorials/git-ahead-behind/#refusing-to-merge-unrelated-histories) is what happens if you don't. Then:

```bash
git remote add origin git@github.com:your-username/line-follower.git
git push -u origin main
```

`-u` links your `main` to `origin/main`, so from now on `git push` and `git pull` need no extra words. If you set `push.autoSetupRemote` in part 1, a plain `git push` does this too.

### Push and pull

```bash
git push        # send your commits to GitHub
git pull        # fetch from GitHub and update your current branch
```

If your push is rejected, nothing is lost and nothing was sent. [Part 5](/tutorials/git-ahead-behind/) covers why it happens and what to do.

### Look at remotes

```bash
git remote -v                # list remotes and their addresses
git remote show origin       # branches and how they relate
git remote rename old new
git remote remove old
```

## Read the history

```bash
git log                          # full history, newest first
git log --oneline                # one line each
git lg                           # the graph alias from part 1
git log -p motor.py              # one file, with its changes
git log --since=1.week           # recent work
git log --author="Ada"           # by one person
git log --grep="bump"            # search commit messages
git log -S"max_speed"            # commits that added or removed this text
git show 5e825b1                 # one commit in full
git show HEAD:motor.py           # a file as it is in a commit
git blame motor.py               # who last changed each line
```

If a long output fills the screen, Git opens a pager. Scroll with the arrow keys and press `q` to leave.

## Practise the whole loop

Work through this once from start to finish in a new folder:

```bash
mkdir git-practice
cd git-practice
git init

echo "# Git practice" > README.md
git status
git add README.md
git commit -m "Add README"

echo "print('hello robot')" > robot.py
echo "__pycache__/" > .gitignore
git status --short
git add robot.py .gitignore
git diff --staged
git commit -m "Add robot script and ignore caches"

git lg
```

Then create an empty repository on GitHub and push to it using the commands above. Refresh the page: your two commits are there.

## The loop in one screen

```bash
git switch main              # start from the main branch
git pull                     # get the latest work
git switch -c fix/bump       # make a branch (next part)
# edit files
git status                   # what changed?
git diff                     # what exactly?
git add -p                   # stage what belongs together
git diff --staged            # read it one last time
git commit -m "Fix bump"     # record it
git push                     # share it
```

The one line here you haven't met yet is the branch. That's the next part.
