---
title: "Git power tools: clean history, faster debugging, big projects"
author: "Rob Finnis"
date: 2026-11-04
excerpt: "Interactive rebase, bisect, blame, worktrees, submodules for ROS workspaces, Git LFS for CAD files, tags and releases, hooks and more."
level: "Advanced"
duration: "About 90 minutes"
needs:
  - "Comfortable with branches, rebasing and recovery (parts 4 to 7)"
  - "A practice repository you don't mind breaking"
series: "Git and GitHub"
part: 11
topic: "Git"
tags: ["Git", "Rebase", "Submodules"]
---
> **Learn by doing:** [Lab 5](/tutorials/git-lab-break-and-fix/#tidy-a-messy-branch) has you try interactive rebase and bisect on a branch set up for it.

You can get a long way without these. Each one solves a specific problem, so read the headings and pick up the ones you need. The sections don't depend on each other.

## Stage part of a file

`git add -p` goes through your changes chunk by chunk, so one messy editing session can become several clean commits:

```bash
git add -p
```

At each prompt, press `y` to stage, `n` to skip, `s` to split the chunk further, `e` to edit it by hand, or `q` to finish. `git restore -p` and `git stash -p` work the same way, for throwing away or stashing pieces.

## Tidy your commits with interactive rebase

Before you open a pull request, you can reorder, combine, reword or delete your commits. **As with any rebase, do this only on commits that are yours alone.**

```bash
git rebase -i HEAD~3
```

Your editor opens with a list, **oldest first**, the opposite of `git log`:

```git-rebase
pick 5d7f841 # Add sensor
pick 13024ad # wip
pick 63a1d87 # fix typo
```

Older versions of Git leave out the `#`. Change the words on the left, or move lines around, then save and close. The commonly used commands:

| Command | What it does |
| --- | --- |
| `pick` | Keep the commit as it is |
| `reword` | Keep it, and stop to change the message |
| `edit` | Stop at this commit so you can change it |
| `squash` | Combine with the commit above, and combine the messages |
| `fixup` | Combine with the commit above, and discard this message |
| `drop` | Delete the commit |

So to fold the last two into the first:

```git-rebase
pick 5d7f841 # Add sensor
fixup 13024ad # wip
fixup 63a1d87 # fix typo
```

```text
Successfully rebased and updated refs/heads/feature/sensor.
```

If it's gone wrong, `git rebase --abort` while it's running, or [`git reflog`](/tutorials/git-undo/#your-safety-net-the-reflog) afterwards. If the branch was already pushed, finish with `git push --force-with-lease`.

### Fixup commits for later

You spot a mistake in an earlier commit while working. Instead of trying to remember it, mark a commit to be folded in later, then let Git do the sorting:

```bash
git add motor.py
git commit --fixup 5d7f841
git rebase -i --autosquash origin/main
```

### Split a commit in two

In the rebase list, mark the commit `edit`. When it stops:

```bash
git reset HEAD~1
git add -p
git commit -m "First part"
git add -p
git commit -m "Second part"
git rebase --continue
```

## Find the commit that broke it with git bisect

The robot worked last month, and now it doesn't. There are 200 commits in between. `git bisect` does a binary search, so you only test about 8 of them.

```bash
git bisect start
git bisect bad                 # the current commit is broken
git bisect good v1.2.0         # this old one worked
```

```text
Bisecting: 3 revisions left to test after this (roughly 2 steps)
[a6191e4a7f2a9fa305f33f2d06df3a5647f0d515] Tune the PID gains
```

Git checks out a commit in the middle. Test it, and report the result. Repeat until it names the culprit:

```bash
git bisect good    # or
git bisect bad     # or, if it can't be tested
git bisect skip
```

```text
7f2970f09b09a68a0dfd08fb0894c64cf0e91434 is the first 'bad' commit
```

Afterwards, get back with `git bisect reset`.

**If you can test with a script, Git can do it all for you.** The script must exit with 0 for good and anything else for bad:

```bash
git bisect run python -m pytest tests/test_motor.py
```

This is one more reason to keep commits small and working: a bisect that lands on a 900-line commit hasn't told you much.

## Find out who changed what, and why

```bash
git blame motor.py                 # who last changed each line
git blame -w -C motor.py           # ignore whitespace, follow moved code
git blame -L 40,60 motor.py        # only these lines
git log -L :set_speed:motor.py     # the history of one function
git log -S"max_speed" --oneline    # commits that added or removed this text
git log -G"max_.*" --oneline       # commits whose changes match this pattern
git log --follow -- motor.py       # keep going across renames
git grep -n "max_speed"            # search the current files
git grep -n "max_speed" v1.2.0     # search an old version
git shortlog -sn                   # commits per person
```

`blame` isn't about blame. Use it to find the commit and read its message, and find out what the person was trying to do.

GitHub shows the same on any file with the **Blame** button.

## Work on two branches at once with worktrees

You're halfway through something when an urgent bug comes up. A **worktree** gives you a second folder on another branch, sharing the same repository, so nothing needs stashing or rebuilding:

```bash
git worktree add ../robot-hotfix -b hotfix/estop
cd ../robot-hotfix
# fix, commit, push
cd ../robot
git worktree remove ../robot-hotfix
git worktree list
```

This is especially useful for ROS or C++ projects with long build times, where switching branch would trigger a full rebuild. A branch can be checked out in only one worktree at a time.

## Submodules

A **submodule** keeps another repository in a folder of yours, pinned to one exact commit. It's useful in a ROS 2 workspace that depends on a specific version of someone's package.

```bash
git submodule add git@github.com:Hull-Robotics-Society/ros-controller.git src/ros-controller
git commit -m "Add ros-controller as a submodule"
```

This adds a `.gitmodules` file and a pointer to the commit:

```ini
[submodule "src/ros-controller"]
    path = src/ros-controller
    url = git@github.com:Hull-Robotics-Society/ros-controller.git
```

Everyday commands, and the pitfalls:

```bash
# Clone a project along with its submodules
git clone --recurse-submodules git@github.com:OWNER/REPO.git

# You cloned without it, and the folder's empty
git submodule update --init --recursive

# After a git pull changed the pointers
git submodule update --recursive

# Move a submodule to the newest commit of its branch
git submodule update --remote src/ros-controller
git add src/ros-controller
git commit -m "Update ros-controller"

# See what each one points at
git submodule status
```

- **Empty folder after cloning?** That's the classic problem, and `git submodule update --init --recursive` fixes it.
- **Submodules usually sit in detached HEAD.** To change one, go in, run `git switch main`, commit and push there, then come back and commit the new pointer in the outer project. Push the submodule first, or nobody else can get the commit you're pointing at.
- **To remove one:** `git rm src/ros-controller`, then commit.

Submodules add a chore for everyone who uses the project. If you only need a package at build time, consider a package manager, or for ROS a `.repos` file with [vcstool](https://github.com/dirk-thomas/vcstool).

## Large files with Git LFS

Git keeps every version of every file forever, and a clone downloads all of them. So every edit to a 50 MB model adds up to another 50 MB, forever. **Git LFS** stores large files on a separate server and leaves a small pointer in the repository:

```bash
git lfs install
git lfs track "*.stl" "*.sldprt"
git add .gitattributes
git add part.stl
git commit -m "Add arm part"
git lfs ls-files
```

What actually goes into Git is this:

```text
version https://git-lfs.github.com/spec/v1
oid sha256:c406f4457dd06489feddc1745d71fde1673d503c453826d2af85e82fdc249ee1
size 6
```

Set it up **before** adding big files. It doesn't shrink what's already in your history. `git lfs migrate import --include="*.stl"` can convert existing files, but it rewrites all history, with [everything that means](/tutorials/git-ahead-behind/#someone-else-rewrote-the-branch).

> **Check before you turn this on.** Everyone using the repository then needs LFS installed. GitHub's plans include a limited LFS quota for storage and downloads, and on a fork, LFS pushes use the fork owner's. And tools reading raw file links get the pointer, not the model. The [3D viewer on this website](/projects/dalek/) reads STL files that way, so moving a project's STL files to LFS would break its viewer. For this reason, small STL files that rarely change are often better left as they are.

### Lock files that can't be merged

[Binary files can't be merged](/tutorials/git-conflicts/#binary-files-stl-cad-images), so if two people edit one, somebody's work gets thrown away. LFS can lock them:

```bash
git lfs track "*.sldprt" --lockable
git lfs lock parts/arm.sldprt
git lfs locks
git lfs unlock parts/arm.sldprt
```

Lockable files are read-only until locked, which reminds people to check first.

Finally, some files belong outside Git altogether, like rosbags and training datasets. Put them on shared storage or a GitHub Release, and keep a link in the README.

## Tags and releases

A **tag** is a permanent label on a commit: "this is what ran at the Freshers Fair". A branch label moves, and a tag doesn't.

```bash
git tag -a v1.1.0 -m "Freshers Fair firmware"    # annotated, the recommended kind
git tag v1.1.0-test                              # lightweight, just a label
git tag                                          # list them
git show v1.1.0                                  # see one
git push origin v1.1.0                           # tags don't get pushed by default
git push origin --tags                           # push all of them
git tag -d v1.1.0-test                           # delete locally
git push origin --delete v1.1.0-test             # delete on GitHub
git describe --tags                              # nearest tag to here
git switch --detach v1.1.0                       # look at the code as it was then
```

Version numbers usually follow [semantic versioning](https://semver.org), `MAJOR.MINOR.PATCH`: raise PATCH for fixes, MINOR for new features, MAJOR when you've broken compatibility.

A **Release** on GitHub is a tag with notes and downloads attached, such as firmware or a compiled ROS package. Create one on the repository's **Releases** page, or with:

```bash
gh release create v1.1.0 --generate-notes firmware.hex
```

`--generate-notes` writes the notes from merged pull requests, one more reason for good titles.

## Automate checks with hooks

Hooks are scripts Git runs at certain moments. Here's one that stops a commit containing conflict markers. Save it as `.git/hooks/pre-commit` and make it executable with `chmod +x`:

```bash
#!/bin/sh
if git diff --cached | grep -qE '^\+(<<<<<<<|>>>>>>>)'; then
    echo "Conflict markers in staged changes"
    exit 1
fi
```

Anything other than exit 0 stops the commit. `pre-commit`, `commit-msg` and `pre-push` are the most common. Skip them once with `git commit --no-verify`.

The `.git/hooks` folder isn't shared when you push. To share hooks, commit them to a folder and have each person run this once:

```bash
git config core.hooksPath .githooks
```

The [pre-commit](https://pre-commit.com) tool is a popular way to manage this. Remember that a hook runs on the contributor's machine, so anything that really must pass belongs in GitHub Actions too.

## Automate checks with GitHub Actions

Actions run on GitHub's machines, so they can't be skipped. A file in `.github/workflows/` says when to run and what to do. This one tests a Python project on every pull request:

```yaml
name: Tests
on:
  pull_request:
    branches: [main]
permissions:
  contents: read
jobs:
  test:
    name: Run tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-python@v7
        with:
          python-version: "3.12"
      - run: pip install -r requirements.txt
      - run: pytest
```

An owner can then [require the check to pass](/tutorials/git-org-owner/#protect-main) before merging. For the real thing, see [this site's workflow](https://github.com/Hull-Robotics-Society/Hull-Robotics-Society.github.io/blob/main/.github/workflows/check.yml).

## Handle huge repositories

```bash
# Only the latest commit: fast, good for robots and CI
git clone --depth 1 git@github.com:OWNER/REPO.git

# Get the rest of the history later
git fetch --unshallow

# Full history, but file contents download only when needed
git clone --filter=blob:none git@github.com:OWNER/REPO.git

# Only some folders
git clone --filter=blob:none --sparse git@github.com:OWNER/REPO.git
cd REPO
git sparse-checkout set "src/arm_controller" docs

# Only one branch
git clone --single-branch --branch main git@github.com:OWNER/REPO.git
```

A `--depth 1` clone on a Raspberry Pi can save a lot of time and storage. If your project needs to deploy to a robot, a shallow clone of a tag is a simple way to do it.

## Tell Git about your files with .gitattributes

A `.gitattributes` file, committed to the repository, sets how files are handled, for everyone:

```text
# Normalise line endings, whatever system people use
* text=auto

# Shell scripts need LF, or they fail on a Raspberry Pi
*.sh text eol=lf

# Never try to diff or merge these
*.stl binary
*.png binary

# Hide generated files from pull request diffs on GitHub
package-lock.json linguist-generated
```

A script edited on Windows that fails on a Pi with `bad interpreter: /bin/bash^M` is a line ending problem. The `eol=lf` line prevents it.

## Handy settings and shortcuts

```bash
git config --global alias.st "status --short --branch"
git config --global alias.undo "reset --soft HEAD~1"
git config --global rerere.enabled true       # remember conflict fixes
git config --global rebase.autoStash true     # stash and unstash around rebases
git config --global rebase.autoSquash true    # always apply fixup! commits
git config --global help.autocorrect prompt   # offer to fix typos in commands
git config --global branch.sort -committerdate  # newest branches first
git maintenance start                         # keep big repositories fast
```

```bash
git switch -                       # back to the previous branch
git range-diff @{u}...HEAD         # what really changed in a rebase
git diff --word-diff               # show changed words, not lines
git log --oneline --all --graph    # the full picture
git archive -o code.zip HEAD       # a clean copy without .git
git help rebase                    # the full manual for any command
```

`git range-diff` is useful after a rebase. It compares the old and new versions of each commit, which a plain diff can't do.
