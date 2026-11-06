---
title: "Undo almost anything: reset, revert, reflog and stash"
date: 2026-11-04
excerpt: "Pick the right undo for each mistake, recover commits you thought you had lost, and deal with the serious ones: leaked passwords, huge files and detached HEAD."
level: "Intermediate"
duration: "About 60 minutes"
needs:
  - "Comfortable with commits and branches (parts 2 to 4)"
  - "A practice repository"
series: "Git and GitHub"
part: 7
topic: "Git"
tags: ["Git", "Recovery", "Reset"]
aiAssisted: true
---
> **Learn by doing:** [Lab 5](/tutorials/git-lab-break-and-fix/) has you lose work on purpose, then recover it.

Once something is committed, it's very hard to lose in Git, even after a bad reset. What you **can** lose for good is work you never committed. So the first rule of recovering from a mistake is to stop and copy what you have.

```bash
cp -r my-project my-project-backup
```

Copying the whole folder, with its `.git` inside, gives you a free second attempt at anything on this page.

## The right tool for each mistake

The key question is **has anyone else got it?** If a commit is only on your laptop, or on your own branch, you can rewrite history. If it's on a shared branch, add a new commit that undoes it instead.

| I want to… | Command | Danger |
| --- | --- | --- |
| Throw away edits to a file | `git restore motor.py` | **Permanent** |
| Unstage a file, keep the edits | `git restore --staged motor.py` | None |
| Get a file back from an old commit | `git restore --source=HEAD~3 motor.py` | Overwrites the current file |
| Change the last commit's message or files | `git commit --amend` | Rewrites history |
| Undo the last commit, keep the work staged | `git reset --soft HEAD~1` | Rewrites history |
| Undo the last commit, keep the work unstaged | `git reset HEAD~1` | Rewrites history |
| Undo the last commit and delete the work | `git reset --hard HEAD~1` | Deletes uncommitted work |
| Undo a commit that's already shared | `git revert 5e825b1` | None: adds a new commit |
| Undo a merged pull request | [Revert it](#undo-a-merged-pull-request) | None: adds a new commit |
| Bring one commit over from another branch | `git cherry-pick 5e825b1` | Might conflict |
| Delete untracked files | `git clean -fd` | **Permanent** |
| Get back something I "lost" | [`git reflog`](#your-safety-net-the-reflog) | None |

If the commit is already on GitHub on your own branch, you can still use amend or reset. Follow it with [`git push --force-with-lease`](/tutorials/git-ahead-behind/#you-rewrote-your-own-history).

## The three kinds of reset

`git reset` moves your branch's label to another commit. The options decide what happens to your files.

| Option | Branch moves | Staging area | Working folder | Use it to |
| --- | --- | --- | --- | --- |
| `--soft` | Yes | Kept | Kept | Redo the commit, or combine several into one |
| (none) | Yes | Cleared | Kept | Re-think what to stage |
| `--hard` | Yes | Cleared | **Overwritten** | Throw it all away |

After these two commits:

```text
84efdbc Add range check
39521d0 Add sensor
```

Here's what `git status --short` shows after each:

```bash
git reset --soft HEAD~1
```

```text
M  sensor.py
```

```bash
git reset HEAD~1
```

```text
 M sensor.py
```

```bash
git reset --hard HEAD~1
```

```text
HEAD is now at 39521d0 Add sensor
```

The commit you reset away isn't really gone yet, as the reflog below shows. Uncommitted edits wiped by `--hard` are another matter: no record of those exists. **Run `git status` before any `--hard`, and commit or stash anything you care about.**

To squash everything since you branched into one commit, a common use of `--soft`:

```bash
git reset --soft origin/main
git commit -m "Add arm controller"
```

## Undo a commit others already have

`git revert` makes a **new** commit that does the opposite of an old one. Nobody's history changes, so it's always safe, and it's the only option on a protected `main`.

```bash
git revert 84efdbc
```

```text
344220b Revert "Add range check"
84efdbc Add range check
39521d0 Add sensor
```

### Undo a merged pull request

On GitHub, a merged pull request has a **Revert** button. It creates a new branch and a new pull request that undoes everything. That's the easiest way, and it goes through review like any other change.

To revert a merge commit from the terminal, you must say which parent is the "main line". It's nearly always 1:

```bash
git revert -m 1 e2f2294
```

Without `-m`, you get `error: commit ... is a merge but no -m option was given.` A squash merge is an ordinary commit, so `git revert` works on it with no `-m`.

> Git remembers that a reverted merge's commits are already in the history. Merging the same branch again later won't bring them back. To re-land that work, revert the revert, then add your fixes on top.

## Your safety net: the reflog

The **reflog** records everywhere `HEAD` has been on your laptop: every commit, reset, rebase and switch. Even when no branch points at a commit, the reflog still does.

```bash
git reflog
```

```text
39521d0 HEAD@{0}: reset: moving to HEAD~1
84efdbc HEAD@{1}: commit: Add range check
39521d0 HEAD@{2}: commit: Add sensor
```

To undo that reset, go back to the entry from before it:

```bash
git reset --hard HEAD@{1}
```

It's your first stop for most disasters. Find the entry from before things went wrong, and go back to it, or put a new branch there and look around first.

### A rebase went wrong

Find the entry from before the rebase started, usually marked `rebase (start)`. The one just below it is where you want to go:

```bash
git reflog
git reset --hard HEAD@{5}
```

### You deleted a branch

The commits are still there. Find the last one, then bring the label back:

```bash
git reflog
git switch -c feature/arm HEAD@{1}
```

`git branch -D` also prints the hash it deleted (`Deleted branch feature/arm (was e269db2).`), which you can use directly.

### You dropped a stash

Stashes are commits too. Dropped ones aren't in the reflog, but `git fsck` lists unreachable commits, and you can look through them with `git show`:

```bash
git fsck --no-reflogs --lost-found | grep commit
git show f2a9eca
git stash apply f2a9eca
```

### How long this lasts

Reflog entries last 90 days, or 30 for commits no branch can reach, and after that Git may clean them up. **The reflog is local:** it isn't pushed, and a fresh clone doesn't have it. It only knows about what happened in this copy.

## Set work aside with git stash

You're in the middle of something, and you need to switch branch or pull. Stash saves your uncommitted changes and gives you a clean folder:

```bash
git stash push -m "half-done arm limits"    # tracked files only
git stash push -u -m "with new files"       # include untracked files too

git stash list                              # see what you have
git stash show --stat stash@{0}             # what's in one
git stash pop                               # reapply the newest and remove it
git stash apply stash@{1}                   # reapply one and keep it
git stash drop stash@{1}                    # delete one
git stash branch feature/arm stash@{0}      # turn one into a branch
```

Stashes are for minutes or hours, because they're easy to forget about. If you'll need it tomorrow, make a commit on a branch.

## Copy a commit with cherry-pick

`git cherry-pick` copies one commit onto your current branch. It's useful when a fix landed on the wrong branch:

```bash
git switch main
git cherry-pick 94a897b
```

For several commits at once, list them or give a range. `A^..B` includes commit A:

```bash
git cherry-pick 94a897b e269db2
git cherry-pick A^..B
```

If it conflicts, resolve it [as usual](/tutorials/git-conflicts/#resolve-it) and run `git cherry-pick --continue`, or use `--abort` to back out.

### You committed to the wrong branch

Copy the commit over, then remove it from where it was. This works if the wrong branch hasn't been pushed:

```bash
git switch right-branch
git cherry-pick wrong-branch
git switch wrong-branch
git reset --hard HEAD~1
```

If the wrong branch is `main`, it's simpler: see [You committed to main by mistake](/tutorials/git-ahead-behind/#you-committed-to-main-by-mistake).

## Delete untracked files

`git clean` deletes files Git isn't tracking. **It doesn't go to the bin, and the reflog can't help.** Always do a dry run with `-n` first:

```bash
git clean -nd      # show what would go
git clean -fd      # delete files and folders
git clean -fdx     # also delete ignored files, like build folders
```

## Detached HEAD

You switched to a tag or an old commit, and Git says:

```text
HEAD detached at 5ec104e
```

You aren't on a branch, so no label moves when you commit. Looking around is perfectly fine, and getting out is one command:

```bash
git switch main
```

If you made commits while detached, Git warns you as you leave:

```text
Warning: you are leaving 1 commit behind, not connected to
any of your branches:

  fb92c36 work on detached

If you want to keep it by creating a new branch, this may be a good time
to do so with:

 git branch <new-branch-name> fb92c36
```

Do what it says, right away. If it's already scrolled off the screen, the commit is in `git reflog`. If you're still detached and want to keep what you've done:

```bash
git switch -c feature/experiment
```

## You pushed a password or key

**Treat the secret as compromised the moment it's pushed.** Bots scan public repositories constantly, and deleting it won't help anyone who already has a copy. Work through this order:

1. **Change it first.** Revoke the API key, change the password, or delete the SSH key. This is the only step that really fixes the problem, so do it before anything else.
2. **Check whether it was used.** Look at the service's logs for anything you don't recognise.
3. **Tell someone.** If it's a society repository, tell an owner straight away. Nobody will be annoyed about an honest mistake, but they will be about a late one.
4. **Remove it from history,** if you need to. A later commit that deletes it leaves it visible in every old commit. Rewriting history takes [git-filter-repo](https://github.com/newren/git-filter-repo):

   ```bash
   pip install git-filter-repo
   git filter-repo --path .env --invert-paths
   git remote add origin git@github.com:OWNER/REPO.git
   git push origin --force --all
   ```

   `filter-repo` removes the `origin` remote as a precaution, and this is why you add it back. Every commit from that point changes, so all collaborators must clone again, and any protection on `main` must be lifted temporarily by an owner. Forks and old clones keep the secret, and GitHub may need a [support request](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository) to clear cached views. This is why step 1 comes first.

GitHub's push protection blocks many well-known kinds of key before they get in, with an error starting `GH013` and `Push cannot contain secrets`. If you see it, remove the secret from your commits and push again. Don't use the option to allow the secret unless it really is a test value.

To keep secrets out in the first place, read them from environment variables or a `.env` file, and list that file in `.gitignore`.

## You committed a huge file

GitHub warns about files over 50 MiB and refuses any over 100 MiB:

```text
remote: error: File logs/run3.bag is 240.00 MB; this exceeds GitHub's file size limit of 100.00 MB
remote: error: GH001: Large files detected.
```

Deleting the file in a new commit doesn't help: **the push includes the whole history,** and the file is still in an earlier commit. If you haven't managed to push it, take those commits apart and make them again without it:

```bash
git reset --soft origin/main
git restore --staged logs/run3.bag
echo "*.bag" >> .gitignore
git add .gitignore
git commit -m "Add test run results"
git push
```

This squashes your unpushed commits into one, and your files stay as they are. Files that really belong in the repository can use [Git LFS](/tutorials/git-power-tools/#large-files-with-git-lfs). Large files already on GitHub need the `git filter-repo` approach above.

## Wrong name or email on a commit

Fix the setting for next time:

```bash
git config user.email "12345678+your-username@users.noreply.github.com"
```

Then fix the last commit if you haven't pushed it:

```bash
git commit --amend --reset-author --no-edit
```

For several unpushed commits, have Git re-commit each one in a rebase:

```bash
git rebase HEAD~3 --exec "git commit --amend --reset-author --no-edit"
```

If GitHub rejected the push with `GH007: Your push would publish a private email address`, this is the fix.

## When in doubt

1. Stop running commands.
2. `git status`, to see whether something's in progress.
3. `git reflog`, to see how you got here.
4. Copy the folder.
5. Use `--abort` if an operation is in progress, or `reset` to a reflog entry if not.
6. Ask on the society's Discord, and include the output of `git status` and `git lg`. Everybody has done this, including whoever's going to help you.
