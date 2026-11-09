---
title: "Branches, merging and rebasing"
author: "Rob Finnis"
date: 2026-11-04
excerpt: "Work on several things at once, bring them back together, and know when to merge and when to rebase, with the one rule that keeps rebasing safe."
level: "Beginner"
duration: "About 60 minutes"
needs:
  - "A practice repository with a few commits (part 3)"
series: "Git and GitHub"
part: 4
topic: "Git"
tags: ["Git", "Branches", "Rebase"]
---
> **Learn by doing:** [Lab 2](/tutorials/git-lab-branches/) has you make each of these shapes yourself.

A branch lets you try something without disturbing the working version. On a robot project, this means the code in `main` still drives the robot while you rewrite the arm controller somewhere else.

Remember from [part 2](/tutorials/git-how-it-works/#a-branch-is-just-a-sticky-note) that a branch is only a label on a commit. Nothing here copies your files.

## Create and switch branches

```bash
git branch                     # list local branches
git branch -a                  # include remote-tracking branches
git branch -vv                 # with their upstream and last commit

git switch -c feature/arm      # create a branch and move onto it
git switch main                # move to an existing branch
git switch -                   # go back to the previous branch
```

Older guides use `git checkout` for this. `git checkout -b x` and `git switch -c x` do the same thing. `checkout` still works, but it does so many different jobs that `switch` and `restore` were added to split them up. This series uses the newer ones.

### Branch names

Short, lower case and hyphenated, with a prefix that says what kind of work it is: `feature/arm-ik`, `fix/bump-sensor`, `docs/setup-guide`. Spaces aren't allowed. Note that `feature` and `feature/arm` can't both exist as branches, because Git stores those names like files and folders.

### Start from an up-to-date place

Most trouble with branches starts here. A new branch begins at wherever you are now, so always update first:

```bash
git switch main
git pull
git switch -c feature/arm
```

Branching from a `main` you last updated three weeks ago means starting three weeks behind.

### Uncommitted changes come with you

Edits you haven't committed don't belong to any branch, so they follow you when you switch. If they would be overwritten, Git refuses to switch:

```text
error: Your local changes to the following files would be overwritten by checkout:
	motor.py
Please commit your changes or stash them before you switch branches.
```

Commit them, or set them aside with [`git stash`](/tutorials/git-undo/#set-work-aside-with-git-stash).

### Rename and delete

```bash
git branch -m new-name                 # rename the current branch
git branch -d feature/arm              # delete it, if it's been merged
git branch -D feature/arm              # delete it, even if it hasn't
git push origin --delete feature/arm   # delete it on GitHub
```

You can't delete the branch you're on, so switch away first. Renaming a branch that's already on GitHub leaves the old name there and still linked. Push the new name, then delete the old one:

```bash
git branch -m feature/better-name
git push origin -u feature/better-name
git push origin --delete feature/old-name
```

## Bring work together with merge

`git merge` brings another branch's commits **into the branch you are on**. So first switch to the branch that should receive the work:

```bash
git switch main
git merge feature/arm
```

What happens next depends on the shape of the history.

<figure class="diagram">
  <svg viewBox="0 0 400 260" role="img" aria-label="Top: a fast-forward merge, where main simply moves along a straight line of commits to catch up with feature. Bottom: a merge commit M with two parents, joining main and feature after they went different ways.">
    <text class="dg-t" x="4" y="16">Fast-forward</text>
    <text class="dg-s" x="4" y="34">main hasn't moved, so its label slides forward</text>
    <path class="dg-wire" d="M40 80H250" />
    <circle class="dg-box" cx="40" cy="80" r="14" /><text class="dg-m dg-c" x="40" y="84">A</text>
    <circle class="dg-box" cx="110" cy="80" r="14" /><text class="dg-m dg-c" x="110" y="84">B</text>
    <circle class="dg-key" cx="180" cy="80" r="14" /><text class="dg-m dg-c" x="180" y="84">C</text>
    <circle class="dg-key" cx="250" cy="80" r="14" /><text class="dg-m dg-c" x="250" y="84">D</text>
    <text class="dg-m" x="272" y="84">main, feature</text>
    <text class="dg-t" x="4" y="136">Merge commit</text>
    <text class="dg-s" x="4" y="154">both moved, so a new commit joins them</text>
    <path class="dg-wire" d="M40 212H110L180 182H250L320 212" />
    <path class="dg-wire" d="M110 212H250L320 212" />
    <circle class="dg-box" cx="40" cy="212" r="14" /><text class="dg-m dg-c" x="40" y="216">A</text>
    <circle class="dg-box" cx="110" cy="212" r="14" /><text class="dg-m dg-c" x="110" y="216">B</text>
    <circle class="dg-box" cx="180" cy="182" r="14" /><text class="dg-m dg-c" x="180" y="186">C</text>
    <circle class="dg-box" cx="250" cy="182" r="14" /><text class="dg-m dg-c" x="250" y="186">D</text>
    <circle class="dg-box" cx="215" cy="212" r="14" /><text class="dg-m dg-c" x="215" y="216">E</text>
    <circle class="dg-key" cx="320" cy="212" r="14" /><text class="dg-m dg-c" x="320" y="216">M</text>
    <text class="dg-m" x="340" y="216">main</text>
    <text class="dg-m" x="268" y="178">feature</text>
  </svg>
  <figcaption>C and D were made on feature; E on main. A merge commit (M) has two parents and records that the branches joined.</figcaption>
</figure>

**Fast-forward:** if `main` hasn't moved since you branched, Git just slides the `main` label forward. There's no new commit and no chance of conflict.

**Merge commit:** if both branches have moved, Git combines them and makes a new commit with two parents. If the same lines were changed on both sides, you get a [merge conflict](/tutorials/git-conflicts/).

You can choose how strict to be:

```bash
git merge --ff-only feature/arm    # only if it's a fast-forward, otherwise stop
git merge --no-ff feature/arm      # always make a merge commit
git merge --abort                  # stop a merge in progress, go back to before
```

## Rewrite on top with rebase

`git rebase` is the alternative. Instead of joining two lines, it **replays your commits on top of another branch**, as if you'd started your work later.

```bash
git switch feature/arm
git rebase main
```

<figure class="diagram">
  <svg viewBox="0 0 400 200" role="img" aria-label="Before: feature has commits C and D branching from B, while main has moved on to E. After rebase: feature has new commits C prime and D prime sitting on top of E in one straight line.">
    <text class="dg-t" x="4" y="16">Before</text>
    <path class="dg-wire" d="M40 66H180" /><path class="dg-wire" d="M110 66L180 32H250" />
    <circle class="dg-box" cx="40" cy="66" r="14" /><text class="dg-m dg-c" x="40" y="70">A</text>
    <circle class="dg-box" cx="110" cy="66" r="14" /><text class="dg-m dg-c" x="110" y="70">B</text>
    <circle class="dg-box" cx="180" cy="66" r="14" /><text class="dg-m dg-c" x="180" y="70">E</text>
    <circle class="dg-key" cx="180" cy="32" r="14" /><text class="dg-m dg-c" x="180" y="36">C</text>
    <circle class="dg-key" cx="250" cy="32" r="14" /><text class="dg-m dg-c" x="250" y="36">D</text>
    <text class="dg-m" x="270" y="36">feature</text>
    <text class="dg-m" x="200" y="70">main</text>
    <text class="dg-t" x="4" y="116">After git rebase main</text>
    <path class="dg-wire" d="M40 160H320" />
    <circle class="dg-box" cx="40" cy="160" r="14" /><text class="dg-m dg-c" x="40" y="164">A</text>
    <circle class="dg-box" cx="110" cy="160" r="14" /><text class="dg-m dg-c" x="110" y="164">B</text>
    <circle class="dg-box" cx="180" cy="160" r="14" /><text class="dg-m dg-c" x="180" y="164">E</text>
    <circle class="dg-key" cx="250" cy="160" r="14" /><text class="dg-m dg-c" x="250" y="164">C'</text>
    <circle class="dg-key" cx="320" cy="160" r="14" /><text class="dg-m dg-c" x="320" y="164">D'</text>
    <text class="dg-m dg-c" x="180" y="192">main</text>
    <text class="dg-m dg-c" x="320" y="192">feature</text>
  </svg>
  <figcaption>C' and D' have the same changes as C and D, but they're new commits with new hashes.</figcaption>
</figure>

The result is a neat straight line. The catch is in the caption: because commits can't change, a rebase creates **new** commits. C and D are abandoned. If anyone else was using them, or they're already on GitHub, your branch and the remote copy now disagree.

If it goes wrong partway through:

```bash
git rebase --abort       # stop and go back to how it was
git rebase --continue    # after resolving a conflict, carry on
git rebase --skip        # drop the commit that's being applied
```

## Merge or rebase?

The rule that keeps you safe:

> **Don't rebase commits other people may have built on.** On your own feature branch, rebase freely. Never rebase `main` or a branch you share, unless everyone on it has agreed.

| | `git merge` | `git rebase` |
| --- | --- | --- |
| History | Records what really happened, with merge commits | One straight line |
| Existing commits | Unchanged | Replaced by new ones |
| After pushing the branch | A normal `git push` works | Needs [`git push --force-with-lease`](/tutorials/git-ahead-behind/#you-rewrote-your-own-history) |
| Conflicts | Resolved once, all together | Resolved commit by commit, possibly several times |
| Best for | Shared branches, anything others use | Your own branch before opening a pull request |
| If unsure | Pick this | |

Neither is "correct". Teams choose by habit, so follow the repository you're working in. If nobody has said, merge: it can't lose or duplicate anyone's work.

## Updating your branch from main

While you work, `main` keeps moving. Here's how to bring those changes into your branch. Fetch first, then use `origin/main` rather than your local `main`, which may be out of date:

```bash
git switch feature/arm
git fetch origin

# Either merge them in...
git merge origin/main

# ...or replay your work on top
git rebase origin/main
```

Part 5 goes into [when this is needed](/tutorials/git-ahead-behind/#your-branch-is-behind-main).

## Compare branches

Two dots and three dots mean different things, and both are useful:

```bash
git log --oneline main..feature/arm     # commits on feature/arm that main doesn't have
git log --oneline feature/arm..main     # commits on main that feature/arm doesn't have
git diff main...feature/arm             # what feature/arm changed since it branched
git diff main feature/arm               # plain difference between the two tips
git branch --merged main                # branches already fully in main
git branch --no-merged main             # branches with work not in main
```

`git diff main...feature/arm` with three dots is what a GitHub pull request shows. It's almost always the one you want, because it ignores changes that happened on `main` since you branched.

## Practise

Try both kinds of merge and a rebase. In your practice repository:

```bash
# A fast-forward
git switch -c feature/hello
echo "print('hello')" >> robot.py
git commit -am "Say hello"
git switch main
git merge feature/hello
git lg

# A merge commit: both branches move
git switch -c feature/bye
echo "print('bye')" >> robot.py
git commit -am "Say bye"
git switch main
echo "Notes" >> README.md
git commit -am "Add notes"
git merge --no-edit feature/bye
git lg

# A rebase: both branches move, then line them up
git switch -c feature/wave
echo "print('wave')" >> robot.py
git commit -am "Wave"
git switch main
echo "More notes" >> README.md
git commit -am "Add more notes"
git switch feature/wave
git rebase main
git lg
```

Look at `git lg` after each step and find the shapes from the diagrams. Then tidy up:

```bash
git switch main
git merge feature/wave
git branch -d feature/hello feature/bye feature/wave
```

So far, everything's been on one laptop. The next part is where it gets interesting: other people, GitHub and everything being ahead of or behind everything else.
