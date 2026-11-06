---
title: "Make your own ahead, behind and diverged"
date: 2026-11-04
excerpt: "Clone one repository twice and act as two people. Cause rejected pushes, diverged branches and stale status on purpose, then fix each one."
level: "Intermediate"
duration: "About 75 minutes"
needs:
  - "The git-lab repository on GitHub, from Labs 1 and 2"
  - "Two terminal windows side by side, if you can"
series: "Git hands-on labs"
part: 3
topic: "Git"
tags: ["Git", "Practice", "Troubleshooting"]
aiAssisted: true
---
Ahead, behind and diverged only happen when more than one copy of a repository exists. You don't need a teammate to see that: **clone your own repository twice** and be two people. This lab makes every message from [Ahead, behind and diverged](/tutorials/git-ahead-behind/) appear in front of you.

## Set up two laptops

Run this in a folder outside `git-lab`, with your own username. Make sure `git-lab`'s `main` is pushed first.

```bash
mkdir two-laptops
cd two-laptops
git clone git@github.com:your-username/git-lab.git laptop-a
git clone git@github.com:your-username/git-lab.git laptop-b
```

Open a second terminal. From now on:

- Terminal **A** is in `two-laptops/laptop-a`.
- Terminal **B** is in `two-laptops/laptop-b`.

Each block below says which to use. This lab expects the [settings from part 1](/tutorials/git-setup/#step-4-set-sensible-defaults). Check `git config --global pull.ff` prints `only`, or some messages will differ.

## Round 1: Ahead

**Terminal A**

```bash
echo "Note from A" >> README.md
git commit -am "Note from laptop A"
git status
git log --oneline @{u}..HEAD
```

```text
Your branch is ahead of 'origin/main' by 1 commit.
```

`@{u}` means "my upstream", so that `log` lists exactly what you're about to send. Push it:

```bash
git push
git status
```

**Checkpoint:** A says `up to date with 'origin/main'`.

## Round 2: The status that lies

**Terminal B.** GitHub now has a commit B has never seen.

**Predict:** what will `git status` say here, in B?

```bash
git status
```

<details>
<summary>Check your answer</summary>

```text
Your branch is up to date with 'origin/main'.
```

That's wrong, or at least out of date. Git doesn't check the network when you run `git status`. It's comparing with B's memory of GitHub from when it was cloned. **This is the most important thing in the lab.**

</details>

Now ask GitHub:

```bash
git fetch
git status
git log --oneline HEAD..@{u}
```

```text
Your branch is behind 'origin/main' by 1 commit, and can be fast-forwarded.
```

The fetch changed nothing but `origin/main`, B's memory. See for yourself: `README.md` hasn't changed. Catch up:

```bash
git pull
git status
```

## Round 3: The rejected push

You'll set up the classic collision. A pushes first, and B has work of its own.

**Terminal A**

```bash
echo "Second note from A" >> docs/wiring.md
git commit -am "Second note from A"
git push
```

**Terminal B** (no fetching this time)

```bash
echo "print('note from B')" >> src/robot.py
git commit -am "Change from laptop B"
git status
```

**Predict:** `git status` says ahead by 1, and it looks fine. What happens when you push?

```bash
git push
```

<details>
<summary>Check your answer</summary>

```text
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'github.com:your-username/git-lab.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally.
```

GitHub refuses because accepting your push would throw away A's commit. **Nothing was lost and nothing was sent.**

</details>

Fetch, and see the true state:

```bash
git fetch
git status
git lg -3
```

```text
Your branch and 'origin/main' have diverged,
and have 1 and 1 different commits each, respectively.

* 573fc0a (HEAD -> main) Change from laptop B
| * ca722f5 (origin/main, origin/HEAD) Second note from A
|/
* 097df5a Note from laptop A
```

There's the fork in the road: two commits with the same parent. Try the obvious fix:

```bash
git pull
```

```text
fatal: Not possible to fast-forward, aborting.
```

That's your `pull.ff only` setting making you choose. Your commit isn't on GitHub yet, so it's safe to rebase it on top of A's:

```bash
git pull --rebase
git lg -3
git push
```

```text
* acfadc9 (HEAD -> main) Change from laptop B
* ca722f5 (origin/main, origin/HEAD) Second note from A
* 097df5a Note from laptop A
```

**Checkpoint:** the line's straight, and your commit has a new hash (compare with the one before). `git status` is up to date.

## Round 4: The same thing with a merge

**Terminal A**

```bash
git pull
echo "Third note from A" >> docs/wiring.md
git commit -am "Third note from A"
git push
```

**Terminal B**

```bash
echo "print('second from B')" >> src/robot.py
git commit -am "Second change from B"
git fetch
git status
git pull --no-rebase --no-edit
git lg -4
git push
```

```text
*   710683a (HEAD -> main) Merge branch 'main' of github.com:your-username/git-lab
|\
| * 33b33a4 (origin/main, origin/HEAD) Third note from A
* | 31a3d30 Second change from B
|/
* acfadc9 Change from laptop B
```

**Predict:** you changed different files in rounds 3 and 4. What would've happened had both laptops changed the same line?

<details>
<summary>Check your answer</summary>

A merge conflict, in either `--rebase` or `--no-rebase`. You'll get to those in [Lab 4](/tutorials/git-lab-conflicts/).

</details>

Before you go on, run `git pull` in **Terminal A**, so both laptops are level.

## Round 5: Rewriting what you've pushed

**Terminal A**

```bash
git switch -c feature/rewrite
echo "rewrite" > rewrite.txt
git add rewrite.txt
git commit -m "Add rewrit file"
git push
```

You spot the typo and amend it, even though it's already pushed:

```bash
git commit --amend -m "Add rewrite file"
git status
```

**Predict:** you've only changed a message. What does `git status` report?

<details>
<summary>Check your answer</summary>

```text
Your branch and 'origin/feature/rewrite' have diverged,
and have 1 and 1 different commits each, respectively.
```

An amend makes a new commit, so your branch and GitHub's now disagree. Git doesn't know one is a corrected version of the other.

</details>

This command shows the difference. `=` means both commits make the same change:

```bash
git log --oneline --left-right --cherry-mark @{u}...HEAD
```

```text
= d82e155 Add rewrite file
= 71f0470 Add rewrit file
```

Try to push:

```bash
git push
```

```text
 ! [rejected]        feature/rewrite -> feature/rewrite (non-fast-forward)
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. If you want to integrate the remote changes,
hint: use 'git pull' before pushing again.
```

**The hint is misleading. Don't pull here,** or you'd merge the old commit back in. It's your own branch, so replace the copy on GitHub:

```bash
git push --force-with-lease
```

### Now see the lease save you

**Terminal B.** A teammate starts building on that branch:

```bash
git fetch
git switch feature/rewrite
echo "from B" >> rewrite.txt
git commit -am "B adds to the rewrite file"
git push
```

**Terminal A.** You don't know about B's commit. You amend again and try to force push:

```bash
git commit --amend -m "Add the rewrite file"
git push --force-with-lease
```

```text
 ! [rejected]        feature/rewrite -> feature/rewrite (stale info)
```

**Predict:** what would a plain `git push --force` have done?

<details>
<summary>Check your answer</summary>

It would have succeeded, and **deleted B's commit from GitHub**. B would have had no warning. The lease refused because GitHub's branch wasn't where A last saw it. That's why you should always use `--force-with-lease`.

</details>

See what you missed, and take B's version:

```bash
git fetch
git log --oneline --left-right --cherry-mark @{u}...HEAD
git reset --hard origin/feature/rewrite
git status
```

Clean up in **Terminal A**, then fetch in **Terminal B** and switch back to `main`:

```bash
git switch main
git push origin --delete feature/rewrite
git branch -D feature/rewrite
```

## Round 6: Committed to main by mistake

**Terminal A**

```bash
git pull
echo "oops" >> README.md
git commit -am "Should have been on a branch"
git status
```

On a protected branch, the push would be refused. Rescue the commit: label it, then move `main` back.

```bash
git switch -c feature/rescue
git switch main
git reset --hard origin/main
git status
git log --oneline -1 feature/rescue
```

**Checkpoint:** `main` is up to date with `origin/main`, and your commit is safe on `feature/rescue`. Nothing was lost, because you made the label first. Delete it with `git branch -D feature/rescue`.

## Round 7: The branch that vanished

**Terminal A**

```bash
git switch -c feature/short-lived
echo "short" > short.txt
git add short.txt
git commit -m "Short-lived work"
git push
```

**Terminal B.** This is what GitHub's **Delete branch** button does after a merge:

```bash
git push origin --delete feature/short-lived
```

**Terminal A**

**Predict:** what will `git status` say before you fetch? And after?

```bash
git status
git fetch
git status
git branch -vv
git pull
```

<details>
<summary>Check your answer</summary>

Before fetching: `up to date`, the same trick as round 2. After:

```text
Your branch is based on 'origin/feature/short-lived', but the upstream is gone.
```

`git pull` then fails with `no such ref was fetched`. Your local branch and its commits are fine. It's only the GitHub copy that's gone.

</details>

Clean up:

```bash
git switch main
git branch -D feature/short-lived
```

## On your own

Set these up by yourself, using both terminals. Before you run each fix, say out loud what you expect. It sounds silly, and it works.

**Challenge 1.** Get laptop B to report `behind by 3 commits`. Find out what those commits are before you pull them.

<details>
<summary>Show a solution</summary>

Make and push three commits in A. Then in B:

```bash
git fetch
git status
git log --oneline HEAD..@{u}
git diff HEAD @{u} --stat
git pull
```

</details>

**Challenge 2.** Get to `have 2 and 3 different commits each` on `main`, then get both laptops level, with straight-line history.

<details>
<summary>Show a solution</summary>

Make and push three commits in A, without pulling in B. Make two commits in B, on different files. Then in B:

```bash
git fetch
git status
git pull --rebase
git push
```

And in A, run `git pull`. Both should show the same `git log --oneline -1`.

</details>

**Challenge 3.** Make uncommitted changes in B that block `git pull`. Read the error, and get the changes back afterwards, without committing them first.

<details>
<summary>Show a solution</summary>

In A, change `README.md`, commit and push. In B, change `README.md` without committing. Then in B:

```bash
git pull
git stash push -m "my edits"
git pull
git stash pop
```

The first pull stops with `Your local changes to the following files would be overwritten by merge`. If your edits touch the same lines, `git stash pop` conflicts. [Lab 4](/tutorials/git-lab-conflicts/) covers what to do.

</details>

**Challenge 4.** Reproduce `refusing to merge unrelated histories`, without harming your real repository.

<details>
<summary>Show a solution</summary>

In a new folder outside `two-laptops`:

```bash
git init unrelated
cd unrelated
echo "local" > local.txt
git add local.txt
git commit -m "Local start"
git remote add origin git@github.com:your-username/git-lab.git
git pull --no-rebase origin main
```

Git refuses, because the two share no commit. Don't push from here: delete the folder when you're done.

</details>

You can now delete `two-laptops`. It's all on GitHub.
