---
title: "Branch, merge and rebase"
date: 2026-11-04
excerpt: "Watch files appear and vanish as you switch branches, make a fast-forward, a merge commit and a rebase yourself, and push a branch to GitHub."
level: "Beginner"
duration: "About 45 minutes"
needs:
  - "The git-lab repository from Lab 1"
  - "Branches, merging and rebasing read through (Git and GitHub, part 4), or read it alongside"
series: "Git hands-on labs"
part: 2
topic: "Git"
tags: ["Git", "Practice", "Branches"]
aiAssisted: true
---
You'll work in the `git-lab` repository from [Lab 1](/tutorials/git-lab-first-repo/). Keep `git lg` close at hand throughout: seeing the shape of your history is the point of this lab. If you haven't got that alias from [part 1](/tutorials/git-setup/#step-4-set-sensible-defaults), add it now:

```bash
git config --global alias.lg "log --oneline --graph --decorate --all"
```

Start here, with everything clean:

```bash
cd git-lab
git switch main
git status
```

## Task 1: See a branch work

Make a branch and add a file on it:

```bash
git switch -c feature/lights
echo "lights = True" > src/lights.py
git add src/lights.py
git commit -m "Add lights"
git lg -3
```

```text
* df2672e (HEAD -> feature/lights) Add lights
* 122c3bf (origin/main, main) Add a first test
* 9822f3c Ignore secrets and build output
```

Look at the labels in brackets: `feature/lights` has moved forward, and `main` hasn't.

**Predict:** you switch back to `main` and run `ls src`. Is `lights.py` there?

```bash
git switch main
ls src
```

<details>
<summary>Check your answer</summary>

No, it's gone from your folder, because `main` has never heard of it. Switch back with `git switch feature/lights`, run `ls src`, and it returns. Git rewrites your working folder to match whichever branch you're on.

</details>

## Task 2: A fast-forward merge

`main` hasn't moved since you branched, so there's nothing to combine.

```bash
git switch main
git merge feature/lights
```

```text
Updating 122c3bf..df2672e
Fast-forward
 src/lights.py | 1 +
 1 file changed, 1 insertion(+)
```

**Checkpoint:** run `git lg -3`. There's no new commit, and `main` has just slid forward to join `feature/lights`.

A merged branch is finished with, so delete the label. The commits stay.

```bash
git branch -d feature/lights
```

## Task 3: A merge commit

This time, both branches will move.

```bash
git switch -c feature/horn
echo "horn = True" > src/horn.py
git add src
git commit -m "Add horn"

git switch main
echo "Press the big button to stop" >> README.md
git commit -am "Add stop instructions"
git lg -4
```

```text
* b390c78 (feature/horn) Add horn
| * 14eff5d (HEAD -> main) Add stop instructions
|/
* df2672e Add lights
```

The lines have split. Now ask Git how far apart they are:

```bash
git rev-list --left-right --count main...feature/horn
git log --oneline main..feature/horn
git log --oneline feature/horn..main
```

**Predict:** what numbers does `git rev-list` print, and which commit does each `git log` list?

<details>
<summary>Check your answer</summary>

It prints `1` and `1`: one commit only on `main`, one only on `feature/horn`. `main..feature/horn` means "on `feature/horn` but not `main`", so that's `Add horn`. The other way round gives `Add stop instructions`. So `feature/horn` is one ahead of and one behind `main`, the same wording GitHub uses.

</details>

Merge it, and see the shape:

```bash
git merge --no-edit feature/horn
git lg -5
```

```text
*   872b413 (HEAD -> main) Merge branch 'feature/horn'
|\
| * b390c78 (feature/horn) Add horn
* | 14eff5d Add stop instructions
|/
* df2672e Add lights
```

Tidy up with `git branch -d feature/horn`.

## Task 4: A rebase

Same starting shape, different method. This time you'll replay your work on top of `main`.

```bash
git switch -c feature/arm
echo "arm = 1" > src/arm.py
git add src
git commit -m "Add arm"
echo "arm = 2" >> src/arm.py
git commit -am "Add second joint"

git switch main
echo "Charge the battery first" >> README.md
git commit -am "Add charging note"
```

Note down the hash of your latest commit on the branch, then rebase it:

```bash
git switch feature/arm
git log --oneline -1
git rebase main
git log --oneline -1
```

**Predict:** same message, so is it the same hash?

<details>
<summary>Check your answer</summary>

No. The message is the same, but a commit's hash depends on its parent, and the parent has changed. So rebasing has created **new** commits. Everything about [why you shouldn't rebase shared work](/tutorials/git-branches/#merge-or-rebase) follows from this.

```text
4f3d7fb Add second joint
56f233c Add second joint
```

</details>

Look at the result:

```bash
git lg -4
```

```text
* 56f233c (HEAD -> feature/arm) Add second joint
* 8649f99 Add arm
* 95e7b05 (main) Add charging note
*   872b413 Merge branch 'feature/horn'
```

It's a straight line, as if you'd started after the charging note. So what kind of merge comes next?

```bash
git switch main
git merge feature/arm
git branch -d feature/arm
```

**Checkpoint:** the output says `Fast-forward`. Rebasing first is what made that possible.

## Task 5: Push a branch

So far your branches have only been on your laptop.

```bash
git status
git switch -c feature/camera
echo "camera = True" > src/camera.py
git add src
git commit -m "Add camera"
git status
```

**Predict:** on `feature/camera`, does `git status` mention `origin`?

<details>
<summary>Check your answer</summary>

No. A new branch has no upstream until its first push, and there's no copy on GitHub to compare with. On `main`, by contrast, `git status` says `ahead of 'origin/main' by 7 commits` or thereabouts, because you've been merging without pushing.

</details>

Push the branch, and see what links up:

```bash
git push
git branch -vv
```

```text
* feature/camera 8cebe2b [origin/feature/camera] Add camera
  main           56f233c [origin/main: ahead 7] Add second joint
```

If `git push` gave you `no upstream branch`, you haven't got `push.autoSetupRemote` set. Follow its suggestion, or set it as in [part 1](/tutorials/git-setup/#step-4-set-sensible-defaults).

Look on GitHub: there's a branch menu above the file list, with `feature/camera` in it. Press **Compare & pull request** if it's offered and read what's shown, but don't create one yet.

Now merge it, and clean up in both places:

```bash
git switch main
git merge --no-edit feature/camera
git push
git push origin --delete feature/camera
git branch -d feature/camera
git branch -a
```

```text
* main
  remotes/origin/main
```

**Checkpoint:** `git status` says `up to date`, and the only branch is `main`, locally and on GitHub.

## On your own

**Challenge 1.** Make a branch called `feature/wheels`, with a new file and two commits. Merge it into `main` so that a merge commit exists, even though `main` hasn't moved. Then delete the branch.

<details>
<summary>Show a solution</summary>

```bash
git switch -c feature/wheels
echo "wheels = 4" > src/wheels.py
git add src
git commit -m "Add wheels"
echo "wheels = 6" > src/wheels.py
git commit -am "Use six wheels"
git switch main
git merge --no-ff --no-edit feature/wheels
git lg -4
git branch -d feature/wheels
```

`--no-ff` forces a merge commit where a fast-forward would've happened.

</details>

**Challenge 2.** Create a branch, commit to it, then delete it with `-d` without merging. Read the error. Then delete it anyway.

<details>
<summary>Show a solution</summary>

```bash
git switch -c throwaway
echo "x" > x.txt
git add x.txt
git commit -m "Something I don't want"
git switch main
git branch -d throwaway
git branch -D throwaway
```

`-d` refuses with `not fully merged`, because deleting it would make the commit hard to find. `-D` does it anyway. [Lab 5](/tutorials/git-lab-break-and-fix/) shows how to get such a commit back.

</details>

**Challenge 3.** Rename a branch that's already on GitHub. Make `feature/oldname`, push it, rename it to `feature/newname`, and end with only the new name on GitHub.

<details>
<summary>Show a solution</summary>

```bash
git switch -c feature/oldname
git commit --allow-empty -m "Empty commit to rename"
git push
git branch -m feature/newname
git push origin -u feature/newname
git push origin --delete feature/oldname
git status
```

Right after `git branch -m`, `git status` still says `origin/feature/oldname`. The rename is local until you push it. To tidy up: `git switch main`, then delete `feature/newname` locally and on GitHub.

</details>

Push your `main` and carry on to [Lab 3](/tutorials/git-lab-ahead-behind/), where you'll get into trouble on purpose.
