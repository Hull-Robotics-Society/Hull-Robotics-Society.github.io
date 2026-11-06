---
title: "How Git thinks: commits, branches and HEAD"
date: 2026-11-04
excerpt: "The small mental model behind every Git command. Once you can picture commits, pointers and the three copies of a branch, Git's messages start to make sense."
level: "Beginner"
duration: "About 30 minutes"
needs:
  - "Git installed (part 1)"
series: "Git and GitHub"
part: 2
topic: "Git"
tags: ["Git", "Concepts"]
aiAssisted: true
---
People get stuck with Git because they memorise commands without a picture of what those commands do. The picture is small. This part has no exercises you can break, so read it once and come back whenever something later on stops making sense.

## A repository is a folder with a history

Run `git init` in a folder, or clone a project, and you get a hidden `.git` folder. That's the repository: every version of every file, all the branches, everything. The files you see and edit are just one version, checked out for you to work on.

Two things follow from this:

- Deleting the `.git` folder deletes the history and leaves only the current files.
- **Your clone is a complete copy.** It isn't a window onto GitHub. You can commit, branch and read the whole history on a train with no signal.

## The three places your work can be

A change passes through three areas on your computer, then a fourth when you share it.

<figure class="diagram">
  <svg viewBox="0 0 400 150" role="img" aria-label="Four boxes in a row: working folder, staging area, local repository, GitHub. git add moves work from the first to the second, git commit from the second to the third, git push from the third to the fourth. git pull brings work from GitHub back to the working folder.">
    <rect class="dg-box" x="2" y="14" width="86" height="56" rx="8" />
    <text class="dg-t dg-c" x="45" y="38">Working</text>
    <text class="dg-t dg-c" x="45" y="56">folder</text>
    <rect class="dg-box" x="104" y="14" width="86" height="56" rx="8" />
    <text class="dg-t dg-c" x="147" y="38">Staging</text>
    <text class="dg-t dg-c" x="147" y="56">area</text>
    <rect class="dg-key" x="206" y="14" width="86" height="56" rx="8" />
    <text class="dg-t dg-c" x="249" y="38">Local</text>
    <text class="dg-t dg-c" x="249" y="56">repository</text>
    <rect class="dg-box" x="308" y="14" width="90" height="56" rx="8" />
    <text class="dg-t dg-c" x="353" y="47">GitHub</text>
    <path class="dg-link" d="M88 42H98" /><polygon class="dg-tip" points="104,42 96,37 96,47" />
    <path class="dg-link" d="M190 42H200" /><polygon class="dg-tip" points="206,42 198,37 198,47" />
    <path class="dg-link" d="M292 42H302" /><polygon class="dg-tip" points="308,42 300,37 300,47" />
    <text class="dg-m dg-c" x="96" y="90">add</text>
    <text class="dg-m dg-c" x="198" y="90">commit</text>
    <text class="dg-m dg-c" x="300" y="90">push</text>
    <path class="dg-wire" d="M353 70V122H45V76" /><polygon class="dg-tip" points="45,70 40,78 50,78" />
    <text class="dg-m dg-c" x="199" y="142">pull: fetch, then update your files</text>
  </svg>
  <figcaption>Commands move your work from left to right. Nothing reaches GitHub until you push.</figcaption>
</figure>

- **Working folder:** the real files. Your editor changes them here, and Git has recorded nothing yet.
- **Staging area** (or "the index"): a draft of your next commit. `git add` copies changes here. This lets you commit two of the five files you changed, or even part of a file.
- **Local repository:** the permanent history on your laptop. `git commit` turns the staging area into a commit here.
- **GitHub:** only gets your commits when you `git push`.

Forgetting that last point is the classic beginner mistake: a commit isn't backed up, and nobody can see it, until you push.

## A commit is a snapshot with a parent

A commit stores four things:

- a snapshot of all the tracked files
- a message
- an author and a date
- a link to the commit that came before it, its **parent**

From those, Git computes a long ID called a **hash**, such as `5e825b1…`. Commands accept the first seven or so characters. Because the hash is calculated from everything in the commit, including the parent's hash, **a commit can never be changed**. "Editing" a commit really makes a new one with a new hash.

Remember that. It's the reason a rebase makes `git push` fail, which comes up in [part 5](/tutorials/git-ahead-behind/#you-rewrote-your-own-history).

## A branch is just a sticky note

This is the idea that unlocks the rest of Git. A branch isn't a copy of your files or a series of commits. It's **a label pointing at one commit**. That is why creating a branch is instant.

<figure class="diagram">
  <svg viewBox="0 0 400 150" role="img" aria-label="Three commits A, B and C in a line. A label main points at C and a label HEAD points at main. A second label feature also points at C.">
    <path class="dg-wire" d="M60 104H200" />
    <circle class="dg-box" cx="60" cy="104" r="17" /><text class="dg-m dg-c" x="60" y="108">A</text>
    <circle class="dg-box" cx="130" cy="104" r="17" /><text class="dg-m dg-c" x="130" y="108">B</text>
    <circle class="dg-key" cx="200" cy="104" r="17" /><text class="dg-m dg-c" x="200" y="108">C</text>
    <rect class="dg-key" x="165" y="46" width="70" height="26" rx="6" /><text class="dg-m dg-c" x="200" y="64">main</text>
    <path class="dg-link" d="M200 72V82" /><polygon class="dg-tip" points="200,87 195,79 205,79" />
    <rect class="dg-box" x="165" y="6" width="70" height="26" rx="6" /><text class="dg-m dg-c" x="200" y="24">HEAD</text>
    <path class="dg-link" d="M200 32V40" /><polygon class="dg-tip" points="200,46 195,38 205,38" />
    <rect class="dg-box" x="258" y="91" width="80" height="26" rx="6" /><text class="dg-m dg-c" x="298" y="108">feature</text>
    <path class="dg-link" d="M258 104H224" /><polygon class="dg-tip" points="218,104 226,99 226,109" />
  </svg>
  <figcaption>Two branches at the same commit. Each commit links back to its parent. HEAD marks where you are.</figcaption>
</figure>

When you commit, Git creates the new commit and moves the label you are on forward to it. The other label stays where it was, and that's how two branches come apart.

## HEAD means "you are here"

**HEAD** normally points at a branch, and the branch points at a commit. So `HEAD` means "the commit I'm on right now". You can count back from it:

- `HEAD~1` is the parent of where you are.
- `HEAD~3` is three commits back.

If HEAD points straight at a commit instead of at a branch, you are in **detached HEAD** state. Commits you make there belong to no branch, and they're easy to lose. [Part 7 explains how to get out](/tutorials/git-undo/#detached-head).

## Remotes and the three copies of a branch

A **remote** is a saved address for another copy of the repository. When you clone, Git names that address `origin`.

Here is the part most tutorials skip, and it causes most of the confusion in Git. After a clone, there are **three** different things called "main":

<figure class="diagram">
  <svg viewBox="0 0 400 190" role="img" aria-label="Three rows. main on GitHub has commits A B C D. origin/main on your laptop has A B C, the last time you checked. main on your laptop has A B C E, your own branch.">
    <rect class="dg-zone" x="0" y="0" width="400" height="56" rx="8" />
    <text class="dg-t" x="12" y="24">main on GitHub</text>
    <text class="dg-s" x="12" y="43">the real thing</text>
    <text class="dg-m" x="270" y="33">A  B  C  D</text>
    <rect class="dg-box" x="1" y="66" width="398" height="56" rx="8" />
    <text class="dg-t" x="12" y="90">origin/main on your laptop</text>
    <text class="dg-s" x="12" y="109">what GitHub had at your last fetch</text>
    <text class="dg-m" x="270" y="99">A  B  C</text>
    <rect class="dg-key" x="1" y="132" width="398" height="56" rx="8" />
    <text class="dg-t" x="12" y="156">main on your laptop</text>
    <text class="dg-s" x="12" y="175">your own branch</text>
    <text class="dg-m" x="270" y="165">A  B  C  E</text>
  </svg>
  <figcaption>All three can be different at once. Here, someone pushed D, you committed E, and your laptop doesn't yet know about D.</figcaption>
</figure>

**`origin/main` is your laptop's memory of GitHub.** Git calls it a remote-tracking branch. You never commit to it directly, and it only updates when you talk to GitHub with `git fetch`, `git pull` or `git push`.

So when `git status` says `Your branch is up to date with 'origin/main'`, it means "up to date with what I remembered last time". GitHub may have moved on hours ago. Git doesn't check the network on its own. Hold on to that thought for [part 5](/tutorials/git-ahead-behind/).

**Upstream** is the name for the remote branch your local branch is linked to. Your `main` usually has `origin/main` as its upstream, and that's why a plain `git push` knows where to go and `git status` knows what to compare with. See every link with:

```bash
git branch -vv
```

## Fetch, pull and push

With that picture, three commands become clear:

| Command | What it changes | Safe to run any time? |
| --- | --- | --- |
| `git fetch` | Only `origin/main`, your memory of GitHub | Yes. It never touches your files or your branches. |
| `git pull` | Runs `git fetch`, then updates your current branch | Mostly. It can stop or conflict. |
| `git push` | The branch on GitHub | GitHub rejects it if it would lose commits. |

If you take one habit from this page: **when in doubt, `git fetch`, then `git status`.** You can't break anything with those two commands.

## Things to remember

- A clone is a full copy, and commits stay on your laptop until you push.
- Commits can't change. "Changing" one makes a new one.
- A branch is a movable label on a commit.
- `main` and `origin/main` are two different things, and `origin/main` is only as fresh as your last fetch.
