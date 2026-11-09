---
title: "Merge conflicts without the panic"
author: "Rob Finnis"
date: 2026-11-04
excerpt: "Read conflict markers, resolve them with confidence, get out safely when you need to, and deal with the awkward cases: rebases, deleted files, lockfiles and CAD files that can't be merged."
level: "Intermediate"
duration: "About 45 minutes"
needs:
  - "Comfortable with merging and rebasing (part 4)"
  - "A practice repository"
series: "Git and GitHub"
part: 6
topic: "Git"
tags: ["Git", "Conflicts", "Merging"]
---
> **Learn by doing:** [Lab 4](/tutorials/git-lab-conflicts/) has conflicts set up and ready for you to resolve, including binary files.

A conflict means two people changed the same lines, and Git won't guess which to keep. It's a question, not an error. Nothing is broken, and you can always back out.

## Make one to practise on

The best time to learn this is when nothing's at stake. Run this in an empty folder:

```bash
git init conflict-practice
cd conflict-practice

echo "speed = 1" > motor.py
git add motor.py
git commit -m "Add motor speed"

git switch -c faster
echo "speed = 2" > motor.py
git commit -am "Speed up"

git switch main
echo "speed = 9" > motor.py
git commit -am "Speed up a lot"

git merge faster
```

```text
Auto-merging motor.py
CONFLICT (content): Merge conflict in motor.py
Automatic merge failed; fix conflicts and then commit the result.
```

## Your way out

Whatever is happening, you can get back to where you started:

```bash
git merge --abort
git rebase --abort
git cherry-pick --abort
```

Use the one that matches the operation you were running. `git status` always tells you which that is. A conflict from `git stash pop` has no abort command, but it has [its own way out](#a-stash-conflicts-when-you-bring-it-back). Knowing there's an exit makes the rest much less stressful.

## Find out what's going on

```bash
git status
```

```text
On branch main
You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Unmerged paths:
  (use "git add <file>..." to mark resolution)
	both modified:   motor.py
```

To list only the conflicted files:

```bash
git diff --name-only --diff-filter=U
```

The labels tell you what happened: `both modified` is the usual kind, while `both added`, `deleted by us` and `deleted by them` have their own sections below.

## Read the markers

Git has written both versions into the file:

```text
<<<<<<< HEAD
speed = 9
||||||| 9b07a5d
speed = 1
=======
speed = 2
>>>>>>> faster
```

| Section | What it is |
| --- | --- |
| `<<<<<<< HEAD` down to `\|\|\|\|\|\|\|` | Your side: the branch you were on |
| `\|\|\|\|\|\|\|` down to `=======` | The original, before either change |
| `=======` down to `>>>>>>> faster` | The incoming side: the branch you're merging |

You only see the middle section if you set `merge.conflictStyle zdiff3` in [part 1](/tutorials/git-setup/#step-4-set-sensible-defaults). It's worth having, because the original tells you what each side was trying to do. Here, one person changed 1 to 9 and the other changed 1 to 2.

## Resolve it

1. **Understand both changes.** If you don't know why the other change was made, look it up:

   ```bash
   git log --merge -p motor.py
   ```

2. **Edit the file to what it should be.** That could be one side, the other, or a combination of both, and it's often the third. Delete all the marker lines. There's no special syntax, and Git doesn't care how you get there. The file just has to be correct.

   ```python
   speed = 2
   ```

3. **Mark it as resolved:**

   ```bash
   git add motor.py
   ```

4. **Check that you've got them all,** because Git happily commits leftover markers:

   ```bash
   git diff --check --cached
   ```

   If anything is left, this prints `leftover conflict marker`.

5. **Finish:**

   ```bash
   git merge --continue
   ```

6. **Test it.** Git only knows about lines of text. Two changes can merge without a conflict and still break the code, and a robot is a bad place to find out. Build it and run it.

### Use your editor

VS Code shows **Accept Current**, **Accept Incoming** and **Accept Both** above each conflict, plus a three-pane merge editor. Other editors have something similar. To open your configured tool, run `git mergetool`. Be wary of clicking Accept for each conflict without reading it: picking whole sides is how working code gets lost.

### Take one whole side

When you know that one version of a file is right:

```bash
git restore --ours motor.py      # keep the version from your side
git restore --theirs motor.py    # keep the version from the other side
git add motor.py
```

## Conflicts during a rebase

The same markers, the same fix, with two differences that catch people out.

**First, conflicts come one commit at a time.** After resolving each one, continue, and the next commit may conflict too:

```bash
git add motor.py
git rebase --continue
```

Commits may appear to be in a strange state in the middle of this. That's normal: Git is partway through replaying them. Don't start other work until it finishes. `git status` shows how far along you are.

```text
interactive rebase in progress; onto 71ac2e3
You are currently rebasing branch 'faster' on '71ac2e3'.
  (fix conflicts and then run "git rebase --continue")
  (use "git rebase --skip" to skip this patch)
  (use "git rebase --abort" to check out the original branch)
```

**Second, "ours" and "theirs" swap round.** A rebase replays your commits onto the other branch. So while it runs, `HEAD` is the other branch and "theirs" is **your** commit:

```text
<<<<<<< HEAD
speed = 9                  <- from main, the branch you're rebasing onto
=======
speed = 2                  <- your commit
>>>>>>> f03a907 (Speed up)
```

| While you are… | `--ours` / `HEAD` is | `--theirs` / bottom part is |
| --- | --- | --- |
| Merging `feature` into `main` | `main`, where you're standing | `feature`, what's coming in |
| Rebasing `feature` onto `main` | `main`, what you're landing on | `feature`, your own commit |

If the same conflict keeps coming back on every commit in a rebase, abort and merge instead, or [squash your commits first](/tutorials/git-power-tools/#tidy-your-commits-with-interactive-rebase) so there's only one to replay.

## The awkward kinds

### A file was deleted on one side

```text
CONFLICT (modify/delete): del.py deleted in feature and modified in HEAD.  Version HEAD of del.py left in tree.
```

Decide if the file should exist. One of these resolves it:

```bash
git add del.py      # keep it
git rm del.py       # delete it
```

### Both sides added the same file

`both added` has markers, like a normal conflict. There's just no original to compare with. Combine them by hand or take one side.

### Binary files: STL, CAD, images

Very common in robotics, and Git can't help:

```text
warning: Cannot merge binary files: part.stl (HEAD vs. arm-update)
CONFLICT (add/add): Merge conflict in part.stl
```

There are no markers, because there's nothing readable to mark. **You have to pick one version, and the other person's work on that file doesn't come along.** So look at both first, then pick:

```bash
git restore --ours part.stl       # or --theirs
git add part.stl
```

If both sets of changes are needed, someone has to redo one in SolidWorks or Fusion, starting from the other's version, and export again. Prevent this by agreeing on Discord who is editing which part before you start, by splitting models into separate files, or with [Git LFS file locking](/tutorials/git-power-tools/#large-files-with-git-lfs). Keep in mind too that KiCad and similar project files are text, but merging them by hand can produce a corrupt design. Treat them like binary files.

### Generated files and lockfiles

Never edit `package-lock.json`, `Cargo.lock` and similar by hand. Take either side, then let the tool rebuild it:

```bash
git restore --theirs package-lock.json
npm install
git add package-lock.json
```

Jupyter notebooks are JSON and conflict badly. Clear their outputs before committing, or look at [nbdime](https://nbdime.readthedocs.io), a merge tool made for them.

### A stash conflicts when you bring it back

```text
CONFLICT (content): Merge conflict in w.py
The stash entry is kept in case you need it again.
```

Fix it like any other conflict. Then `git restore --staged w.py`, because a stash doesn't need a commit, and remove the stash once you're happy with `git stash drop`. To go back instead, use `git restore --staged --worktree w.py`. Your stash is still safe either way.

### Conflicts on a pull request

GitHub says `This branch has conflicts that must be resolved`. You have two options.

**In your terminal,** which always works. Fetch the latest, then merge or rebase as in [part 5](/tutorials/git-ahead-behind/#your-branch-is-behind-main). Fix the conflicts, then push.

```bash
git fetch upstream
git merge upstream/main
# resolve, git add, git merge --continue
git push
```

**On GitHub,** with the **Resolve conflicts** button. This works for simple text conflicts. It makes a merge commit on your branch, so run `git pull` afterwards. You can't build or test there, though, so prefer the terminal for code.

## Remember your fixes with rerere

If you keep resolving the same conflict, for example when rebasing a long branch, turn on "reuse recorded resolution":

```bash
git config --global rerere.enabled true
```

Git then records how you resolved each conflict and reapplies it the next time:

```text
Resolved 'motor.py' using previous resolution.
```

It still stops so you can check and then `git add` the file. It's safe to leave on.

## Fewer conflicts in the first place

- Keep branches short, and update them from `main` regularly.
- Pull requests should be small and do one thing.
- Don't reformat a whole file in the same commit as a real change. If a formatting pass is needed, do it on its own and warn people.
- Agree on a formatter, so editors don't reformat each other's work on save.
- Remember that changes to neighbouring lines count as overlapping, so keep unrelated settings apart where you can.
- Tell people what you're working on: an issue or a Discord message costs nothing.
- Split big files. A 2,000-line `main.py` conflicts every time. Five modules rarely do.
