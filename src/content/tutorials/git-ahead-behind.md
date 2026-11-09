---
title: "Ahead, behind and diverged: when branches disagree"
author: "Rob Finnis"
date: 2026-11-06
excerpt: "The part other tutorials skip. What every ahead, behind and diverged message really means, why pushes get rejected, and the exact fix for each situation."
level: "Intermediate"
duration: "About 75 minutes"
needs:
  - "Comfortable with commits and branches (parts 2 to 4)"
  - "A repository on GitHub to try things on"
series: "Git and GitHub"
part: 5
topic: "Git"
tags: ["Git", "Troubleshooting", "Branches"]
---
> **Learn by doing:** [Lab 3](/tutorials/git-lab-ahead-behind/) has you cause nearly everything on this page on purpose, using two clones of your own repository.

You run `git push` and it's rejected. GitHub says your branch is "3 commits ahead of, 5 commits behind main". `git status` says everything is up to date, and it isn't. This page explains all of that, situation by situation.

Nothing in this part is an emergency. A rejected push has sent nothing and lost nothing. Git is stopping because going ahead would lose someone's commits.

## Ask the right question

Ahead and behind always compare **two** things, and the confusion usually comes from not knowing which two. There are three comparisons in everyday use:

| Comparison | Where you see it | What it tells you |
| --- | --- | --- |
| Your branch and its upstream | `git status` | Whether your laptop and GitHub agree about **this branch** |
| Your branch and `main` | The branch page and pull request on GitHub | Whether **your feature** has fallen behind the project |
| Your fork and the organisation | The "Sync fork" banner on GitHub | Whether **your fork** has fallen behind the original |

A branch can be up to date with its upstream and 40 commits behind `main` at the same time. `git status` will cheerfully say `up to date`, because `main` isn't what it's comparing with.

There are four possible states, whichever two things you compare:

<figure class="diagram">
  <svg viewBox="0 0 400 236" role="img" aria-label="Four small history diagrams. Up to date: main and origin/main are at the same commit. Ahead: main has one extra commit. Behind: origin/main has one extra commit. Diverged: main and origin/main each have a commit the other lacks.">
    <g transform="translate(0,0)">
      <rect class="dg-zone" width="195" height="112" rx="8" />
      <text class="dg-t" x="12" y="22">Up to date</text>
      <path class="dg-wire" d="M22 68H94" />
      <circle class="dg-box" cx="22" cy="68" r="8" /><circle class="dg-box" cx="58" cy="68" r="8" /><circle class="dg-key" cx="94" cy="68" r="8" />
      <text class="dg-m" x="108" y="62">main</text><text class="dg-m" x="108" y="80">origin/main</text>
    </g>
    <g transform="translate(205,0)">
      <rect class="dg-zone" width="195" height="112" rx="8" />
      <text class="dg-t" x="12" y="22">Ahead</text>
      <path class="dg-wire" d="M22 68H94" />
      <circle class="dg-box" cx="22" cy="68" r="8" /><circle class="dg-box" cx="58" cy="68" r="8" /><circle class="dg-key" cx="94" cy="68" r="8" />
      <text class="dg-m" x="108" y="72">main</text><text class="dg-m dg-c" x="58" y="96">origin/main</text>
    </g>
    <g transform="translate(0,124)">
      <rect class="dg-zone" width="195" height="112" rx="8" />
      <text class="dg-t" x="12" y="22">Behind</text>
      <path class="dg-wire" d="M22 68H94" />
      <circle class="dg-box" cx="22" cy="68" r="8" /><circle class="dg-key" cx="58" cy="68" r="8" /><circle class="dg-box" cx="94" cy="68" r="8" />
      <text class="dg-m" x="108" y="72">origin/main</text><text class="dg-m dg-c" x="58" y="96">main</text>
    </g>
    <g transform="translate(205,124)">
      <rect class="dg-zone" width="195" height="112" rx="8" />
      <text class="dg-t" x="12" y="22">Diverged</text>
      <path class="dg-wire" d="M22 68H58L94 48M58 68L94 88" />
      <circle class="dg-box" cx="22" cy="68" r="8" /><circle class="dg-box" cx="58" cy="68" r="8" /><circle class="dg-key" cx="94" cy="48" r="8" /><circle class="dg-box" cx="94" cy="88" r="8" />
      <text class="dg-m" x="108" y="52">main</text><text class="dg-m" x="108" y="92">origin/main</text>
    </g>
  </svg>
  <figcaption>The green commit is where you are. Diverged just means ahead and behind at the same time.</figcaption>
</figure>

## Get the true picture first

`git status` only knows what your laptop last heard from GitHub. So start every investigation with a fetch, which is always safe:

```bash
git fetch --all
git status
```

To see the commits involved rather than a number, use these. `@{u}` is shorthand for "this branch's upstream":

```bash
git log --oneline @{u}..HEAD     # commits you have that the upstream doesn't
git log --oneline HEAD..@{u}     # commits the upstream has that you don't
git lg                           # the whole picture as a graph
```

And for the numbers, with any two branches:

```bash
git rev-list --left-right --count origin/main...HEAD
```

```text
5	3
```

The left number is commits only on the left-hand name, the right number only on the right. So this branch is 5 behind `origin/main` and 3 ahead.

## Quick lookup

| What you see | Meaning | Fix |
| --- | --- | --- |
| `Your branch is up to date` | Agrees with your last fetch | [Fetch to be sure](#up-to-date-might-not-be-true) |
| `Your branch is ahead of 'origin/x' by 2 commits` | You have commits to share | [`git push`](#ahead-of-your-upstream) |
| `Your branch is behind 'origin/x' by 2 commits` | GitHub has commits you don't | [`git pull`](#behind-your-upstream) |
| `have diverged` | Both have moved | [Find out why, then choose](#diverged-from-your-upstream) |
| `! [rejected] (fetch first)` | Someone pushed before you | [Pull, then push](#someone-else-pushed) |
| `! [rejected] (non-fast-forward)` | Your history doesn't contain theirs | [Check which case](#diverged-from-your-upstream) |
| `! [rejected] (stale info)` | Your force push would lose someone's work | [Fetch and look](#you-rewrote-your-own-history) |
| `fatal: Need to specify how to reconcile divergent branches` | `git pull` won't guess | [Choose rebase or merge](#someone-else-pushed) |
| `fatal: Not possible to fast-forward, aborting` | Same, with `pull.ff only` set | [Choose rebase or merge](#someone-else-pushed) |
| `This branch is out-of-date with the base branch` | `main` moved since you branched | [Update your branch](#your-branch-is-behind-main) |
| `3 commits ahead of, 5 commits behind` on GitHub | Normal for a feature branch | [Your branch is behind main](#your-branch-is-behind-main) |
| `up to date`, but the pull request says out of date | Your fork's branch is behind the organisation | [Compare with `upstream/main`](#your-forks-branch-is-behind-the-organisation) |
| `is not fully merged` | Often a squash merge | [After a squash merge](#after-a-squash-merge) |
| `the upstream is gone` | Branch deleted on GitHub | [Upstream gone](#the-upstream-is-gone) |
| `The upstream branch of your current branch does not match` | Tracking the wrong branch | [Wrong upstream](#your-branch-tracks-the-wrong-upstream) |
| `refusing to merge unrelated histories` | Two separate starting points | [Unrelated histories](#refusing-to-merge-unrelated-histories) |

## You and your upstream

These are about one branch that exists in two places: on your laptop and on GitHub.

### Up to date might not be true

```text
On branch main
Your branch is up to date with 'origin/main'.
```

This means "up to date with what I knew at my last fetch". GitHub could be ten commits further on. Fetch, and it may change:

```text
Your branch is behind 'origin/main' by 10 commits, and can be fast-forwarded.
```

### Ahead of your upstream

```text
Your branch is ahead of 'origin/main' by 1 commit.
  (use "git push" to publish your local commits)
```

You made commits and haven't shared them. On your own branch, push them:

```bash
git push
```

If this is `main` in the society's repository, stop. You almost certainly [committed there by mistake](#you-committed-to-main-by-mistake).

### Behind your upstream

```text
Your branch is behind 'origin/main' by 1 commit, and can be fast-forwarded.
  (use "git pull" to update your local branch)
```

Others have pushed, and you have no new commits of your own, so your label can just slide forward:

```bash
git pull
```

If you have uncommitted edits that would be overwritten, it stops and tells you:

```text
error: Your local changes to the following files would be overwritten by merge:
	w.py
Please commit your changes or stash them before you merge.
Aborting
```

Commit them, or stash them and bring them back afterwards:

```bash
git stash push -m "half-done"
git pull
git stash pop
```

### Diverged from your upstream

You'll usually meet this as a rejected push:

```text
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'github.com:your-username/robot.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref.
```

Fetch and check `git status`:

```text
Your branch and 'origin/main' have diverged,
and have 1 and 1 different commits each, respectively.
```

The first number is yours, the second is GitHub's. **Before you do anything, work out why.** This command labels each commit: `>` is yours, `<` is theirs, and `=` marks commits that have the same change on both sides.

```bash
git log --oneline --left-right --cherry-mark @{u}...HEAD
```

There are three possible causes, and the fix is different for each.

**Different commits, by someone else:** see [Someone else pushed](#someone-else-pushed).

```text
> 53e85ec Add bump sensor
< 1962fd5 Update README
```

**The same work, reworded or rebased by you:** see [You rewrote your own history](#you-rewrote-your-own-history). Note the `=` marks.

```text
= ac26be1 Add arm
= 46224d7 Add arm controller
```

**Commits you've never seen on a shared branch, with your work unchanged:** see [Someone else rewrote the branch](#someone-else-rewrote-the-branch).

#### Someone else pushed

The normal case when you share a branch, or use two laptops. Your commits need to be combined with theirs, and you have two choices. If your commits aren't on GitHub yet, it's safe to rebase them, and it keeps the history straight:

```bash
git pull --rebase
git push
```

```text
* beac0bc Add bump sensor
* 1962fd5 Update README
* 54cc470 Add motor control
```

Or make a merge commit, which is the safer choice if your commits contain merges or you aren't comfortable with rebasing:

```bash
git pull --no-rebase
git push
```

Either way you may hit a [merge conflict](/tutorials/git-conflicts/). This is the message you get if you run plain `git pull` with [the settings from part 1](/tutorials/git-setup/#step-4-set-sensible-defaults). It's Git asking you to choose between those two commands:

```text
hint: Diverging branches can't be fast-forwarded, you need to either:
hint:
hint: 	git merge --no-ff
hint:
hint: or:
hint:
hint: 	git rebase
fatal: Not possible to fast-forward, aborting.
```

Without that setting, the message is `fatal: Need to specify how to reconcile divergent branches`, and it needs the same choice.

#### You rewrote your own history

After a rebase or an amend, your commits have new hashes, so `git status` reports diverged even though you did the right thing. A normal push is rejected:

```text
 ! [rejected]        feature/arm -> feature/arm (non-fast-forward)
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart.
```

**The hint is misleading here. Don't run `git pull`:** that would merge your old commits back in, and you'd have every commit twice. If this is your own branch, replace the copy on GitHub:

```bash
git push --force-with-lease
```

`--force-with-lease` means "overwrite GitHub's copy, but only if it's still what I last saw". If someone pushed in the meantime, it refuses:

```text
 ! [rejected]        feature/arm -> feature/arm (stale info)
```

That's the safety catch working. Run `git fetch`, look at what they added, and rebase onto it with `git rebase origin/feature/arm` before trying again.

> **Never use plain `git push --force`.** It overwrites whatever is there, including commits you've never seen. And never force push to `main`, or to a branch someone else is working on, without asking them. In the society's repositories, `main` is protected, so GitHub will refuse anyway.

Editors that fetch automatically in the background, like VS Code, can weaken the lease, because Git then thinks you've "seen" commits you haven't looked at. For extra safety, add `--force-if-includes`:

```bash
git push --force-with-lease --force-if-includes
```

#### Someone else rewrote the branch

A teammate rebased a branch you share and force-pushed. If you have no commits of your own on it, just move to their version:

```bash
git fetch
git reset --hard @{u}
```

If you have commits of your own, replay them on the new version:

```bash
git pull --rebase
```

Git recognises and drops the commits that already exist upstream. Then push normally. Afterwards, agree not to rebase shared branches.

## Your branch and main

This is the second comparison, and it's the one GitHub shows on a branch page and on pull requests.

### Your branch is ahead of main

```text
This branch is 4 commits ahead of main.
```

That's the whole point of a feature branch. Nothing to fix.

### Your branch is behind main

```text
This branch is 4 commits ahead of, 12 commits behind main.
```

Twelve commits have reached `main` since you branched. **This isn't an error, and you often don't need to do anything.** You need to update your branch when:

- GitHub says the pull request has conflicts.
- The repository requires branches to be up to date, and you see `This branch is out-of-date with the base branch`.
- You need something that's been added to `main`.
- It's been a while, and you want to test against the current code. Regularly updating means smaller conflicts.

<figure class="diagram">
  <svg viewBox="0 0 400 130" role="img" aria-label="A feature branch splits from main at commit B and has two commits, C and D. main has moved on to commits E and F. So feature is two ahead and two behind main.">
    <path class="dg-wire" d="M30 90H270M100 90L170 40H240" />
    <circle class="dg-box" cx="30" cy="90" r="14" /><text class="dg-m dg-c" x="30" y="94">A</text>
    <circle class="dg-box" cx="100" cy="90" r="14" /><text class="dg-m dg-c" x="100" y="94">B</text>
    <circle class="dg-box" cx="185" cy="90" r="14" /><text class="dg-m dg-c" x="185" y="94">E</text>
    <circle class="dg-box" cx="270" cy="90" r="14" /><text class="dg-m dg-c" x="270" y="94">F</text>
    <circle class="dg-key" cx="170" cy="40" r="14" /><text class="dg-m dg-c" x="170" y="44">C</text>
    <circle class="dg-key" cx="240" cy="40" r="14" /><text class="dg-m dg-c" x="240" y="44">D</text>
    <text class="dg-m" x="260" y="44">feature: 2 ahead</text>
    <text class="dg-m" x="290" y="94">main</text>
    <text class="dg-s" x="185" y="122" text-anchor="middle">E and F are the commits feature is behind by</text>
  </svg>
  <figcaption>Ahead and behind are counted from the commit where the two lines split.</figcaption>
</figure>

See exactly what's different:

```bash
git fetch origin
git log --oneline HEAD..origin/main      # what you're behind by
git log --oneline origin/main..HEAD      # what you're ahead by
```

Now update, by rebase or merge. **Use `origin/main`, not `main`.** Your local `main` is probably out of date too, and merging it can look as if it worked while bringing in nothing new.

If you're the only one on the branch, rebase:

```bash
git rebase origin/main
git push --force-with-lease
```

If others are using the branch, or a pull request is already under review and your reviewers would rather not lose their place, merge:

```bash
git merge origin/main
git push
```

Both end in the same code. [Part 4 compares them](/tutorials/git-branches/#merge-or-rebase).

If you work from a fork, your remote for the organisation is called `upstream`, so use `upstream/main`. See [Your fork's branch is behind the organisation](#your-forks-branch-is-behind-the-organisation).

### The Update branch button

On a pull request, GitHub may offer an **Update branch** button. It merges `main` into your branch **on GitHub**, so GitHub is now ahead of your laptop. If you keep working without pulling, your next push is rejected. Afterwards, run:

```bash
git pull
```

If you've made more commits in the meantime, you'll need `git pull --rebase` instead.

### You committed to main by mistake

Very common. You forgot to make a branch, and now `main` is ahead:

```text
On branch main
Your branch is ahead of 'origin/main' by 3 commits.
```

Pushing to the society's `main` wouldn't work anyway:

```text
remote: error: GH006: Protected branch update failed for refs/heads/main.
```

A branch is just a label, so the fix is to put a new label on your work and move `main` back. This loses nothing, provided you make the branch first:

```bash
git switch -c feature/rescue      # label your commits
git switch main
git reset --hard origin/main      # move main back
git switch feature/rescue         # carry on here
```

Check with `git lg`, then push the new branch. If you work from a fork, use `upstream/main` in place of `origin/main`.

If you made edits but haven't committed yet, it's even easier. Uncommitted work follows you, so `git switch -c feature/rescue` is all you need.

### Your branch started from an old main

You branched from a `main` that was weeks out of date, so your pull request includes changes you didn't make, or starts far behind. Rebase your own commits onto the current one:

```bash
git fetch origin
git rebase origin/main
git push --force-with-lease
```

If the pull request shows other people's commits as well as yours, you branched from another feature branch. List your own commits with `git log --oneline`, then cut them off the other branch. Here `other-feature` is the branch you accidentally started from:

```bash
git rebase --onto origin/main other-feature
git push --force-with-lease
```

## Forks

With a fork there are three copies: the organisation's repository, your fork on GitHub, and your laptop. Git only compares your laptop with whichever remote your branch is linked to, and that's normally your fork. [Part 9 has the full workflow](/tutorials/git-org-member/#the-fork-workflow).

### Your fork is behind the organisation

This is the most misleading message in Git:

```text
On branch main
Your branch is up to date with 'origin/main'.
```

Here `origin` is your fork. Your laptop and your fork agree, and they're both months behind the organisation. To see that, compare with the organisation's copy:

```bash
git fetch upstream
git rev-list --left-right --count main...upstream/main
```

```text
0	37
```

To catch up, either press **Sync fork → Update branch** on your fork's GitHub page and `git pull`, or do it from the terminal:

```bash
git switch main
git fetch upstream
git merge --ff-only upstream/main
git push origin main
```

### Your fork's main is ahead of the organisation

GitHub says `This branch is 2 commits ahead of Hull-Robotics-Society/...:main`, or **Sync fork** warns that it would discard commits. You committed to your fork's `main`, which then stops being a clean copy of the organisation's. `--ff-only` refuses to continue here, and rightly so:

```bash
git fetch upstream
git switch main
git branch rescue                        # keep the commits, if you want them
git reset --hard upstream/main
git push --force-with-lease origin main
```

Your fork is yours, so force pushing to its `main` is fine. Keep your fork's `main` clean from now on, and do all your work on branches.

### Your fork's branch is behind the organisation

You're on `feature/arm` in your fork, and `git status` says all is well, even straight after a fetch:

```text
Your branch is up to date with 'origin/feature/arm'.
```

Meanwhile, your pull request says it's out of date. Both are right: `git status` compares your branch with its copy on **your fork**, and the pull request compares it with the **organisation's** `main`. Compare with the organisation, then bring its commits in:

```bash
git fetch upstream
git rev-list --left-right --count upstream/main...HEAD
git merge upstream/main
git push
```

Or use `git rebase upstream/main` followed by `git push --force-with-lease` if the branch is only yours. You don't need to update your fork's `main` first. [Part 9 has the full walkthrough](/tutorials/git-org-member/#sync-your-branch-with-the-organisations-main), including the mistakes to avoid.

## After a pull request is merged

### After a squash merge

Say the pull request was merged with **Squash and merge**. GitHub made one new commit on `main` containing all your changes, but your original commits aren't in `main`. So Git doesn't know that the work is merged:

```text
error: the branch 'feature/arm' is not fully merged
hint: If you are sure you want to delete it, run 'git branch -D feature/arm'
```

Check that no code would be lost, then delete it. If the diff is empty, your branch has nothing `main` doesn't:

```bash
git fetch upstream
git switch main
git merge --ff-only upstream/main
git diff main feature/arm
git branch -D feature/arm
```

### You kept committing after a squash merge

If you carry on working on a squash-merged branch, then a rebase tries to replay all the old commits and conflicts with its own squashed copy. Replay only the new ones, by saying how many there are. Here, one:

```bash
git rebase --onto origin/main HEAD~1
```

To avoid this altogether, start a fresh branch from `main` after each merged pull request.

### The upstream is gone

```text
Your branch is based on 'origin/feature/arm', but the upstream is gone.
```

The branch was deleted on GitHub, usually automatically after merging. `git branch -vv` shows it as `[origin/feature/arm: gone]`. A pull fails with `no such ref was fetched`.

If the work was merged, delete your local copy, following the squash steps above. If you still want the branch, push it again:

```bash
git push -u origin feature/arm
```

To list every branch in this state:

```bash
git branch -vv | grep ': gone]'
```

## Other messages about branches

### Your branch tracks the wrong upstream

A trap when working from a fork. If you create a branch from a remote branch, Git links it to that branch:

```bash
git switch -c feature/x upstream/main
```

```text
branch 'feature/x' set up to track 'upstream/main'.
```

Now `git status` compares with `upstream/main`, and pushing fails:

```text
fatal: The upstream branch of your current branch does not match
the name of your current branch.
```

**Don't follow its suggestion of pushing to `upstream`.** Unlink the branch and push to your fork:

```bash
git branch --unset-upstream
git push -u origin HEAD
```

To avoid this in future, add `--no-track` when creating the branch:

```bash
git switch -c feature/x --no-track upstream/main
```

### The current branch has no upstream branch

```text
fatal: The current branch feature/arm has no upstream branch.
```

The branch only exists on your laptop. Git's suggestion is right here:

```bash
git push -u origin feature/arm
```

The `push.autoSetupRemote` setting from part 1 makes this unnecessary.

### Refusing to merge unrelated histories

```text
fatal: refusing to merge unrelated histories
```

You ran `git init` and committed, and you also created the repository on GitHub with a README. So there are two histories with no common start. Usually you can bring them together once:

```bash
git pull --no-rebase --allow-unrelated-histories origin main
git push -u origin main
```

If you see this anywhere other than a brand-new repository, stop and check that your remote points where you expect, with `git remote -v`. It can mean you are about to merge two different projects.

### src refspec main does not match any

```text
error: src refspec main does not match any
```

Git can't find a local branch with that name. Either you haven't committed anything yet, or your branch has a different name. Older projects often use `master`, and a couple of the society's older repositories still do. Check `git branch`, then push the name you actually have, or rename it:

```bash
git branch -m master main
```

## Habits that prevent most of this

- Run `git fetch` before you trust `git status`.
- Start every piece of work on a new branch from an up-to-date `main`.
- Never commit to `main` in a shared repository or a fork.
- Keep branches short-lived. A branch that lasts three days is easy. One that lasts three months is a project of its own.
- Push at the end of every session, so your work is backed up and your laptop isn't the only copy.
- When Git prints a hint, read it, but check it fits your situation. The `git pull` hint after a rebase is the classic wrong one.
