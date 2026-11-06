---
title: "Contribute to a GitHub organisation"
date: 2026-11-04
excerpt: "The full route from an idea to merged code in a shared project: permissions, forks and branches, pull requests, reviews, failing checks and cleaning up, using this website as the worked example."
level: "Intermediate"
duration: "About 90 minutes"
needs:
  - "Comfortable with branches and ahead/behind (parts 4 and 5)"
  - "A GitHub account with an SSH key and two-factor turned on"
  - "Node.js 22.23.4 or newer, for the worked example on this website"
series: "Git and GitHub"
part: 9
topic: "Git"
tags: ["GitHub", "Organisations", "Pull requests"]
aiAssisted: true
---
> **Learn by doing:** [Lab 6](/tutorials/git-lab-fork-pr/) takes you through a real pull request to the society's practice repository, and [Lab 7](/tutorials/git-lab-three-branches/) has you handle three branches at once.

The society's code lives in the [Hull-Robotics-Society](https://github.com/Hull-Robotics-Society) organisation. An organisation owns repositories on behalf of a group, so they stay put when people graduate. This part covers how to work in one as a contributor. [Part 10](/tutorials/git-org-owner/) covers running one.

The steps work for any organisation. For a shorter version of the society's fork route, see the [How to contribute](https://github.com/Hull-Robotics-Society/Tutorials/blob/main/%5B05%5D%20Github/How-To-Contribute.md) note in the Tutorials repository.

## What you can do depends on your role

Joining an organisation doesn't automatically let you push everywhere. Access is set per repository, and comes as one of five roles, each with everything from the one above:

| Role | What it adds |
| --- | --- |
| **Read** | View and clone, fork, open issues, comment, and review pull requests |
| **Triage** | Label, assign and close issues and pull requests, without touching code |
| **Write** | Push branches, merge pull requests, approve reviews that count, manage releases |
| **Maintain** | Manage the repository's description, topics, merge settings and Pages |
| **Admin** | Everything: settings, access, branch rules, deleting and transferring |

You can have a role because of the organisation's base permission, a team you're on, or a direct invitation. If there's more than one, you get the highest.

**How to tell what you have:** a **Settings** tab on the repository page means you have Maintain or Admin. A green **Merge** button on a pull request means you have at least Write. The simplest test is to try pushing a branch: `Permission denied` or `403` means no write access.

You also don't need to be a member at all. **Anybody can fork a public repository and open a pull request.** Membership is mostly about what you can do without a fork, and what you can approve.

## Join the organisation

1. An owner invites you by your GitHub username or email.
2. Accept via the email, or at `github.com/orgs/Hull-Robotics-Society/invitation`. It expires after seven days, so ask for another if you miss it.
3. Your membership starts out private. If you want it on your profile, go to the organisation's **People** page and set yourself to **Public**.

Members can use `@Hull-Robotics-Society/team-name` to mention a whole team, and can be asked to review.

## Fork or branch?

Two workflows lead to the same pull request. The repository's own guide, or a committee member, can tell you which one it uses.

| | Fork workflow | Branch workflow |
| --- | --- | --- |
| Needs write access? | No | Yes |
| Where your branch lives | A copy under your account | The organisation's repository |
| Remotes | `origin` is your fork, `upstream` is the organisation | `origin` is the organisation |
| Good for | Outside contributors, and this website | A team working closely on one project |
| Extra chore | Keeping your fork up to date | Tidying up old branches |

## The fork workflow

<figure class="diagram">
  <svg viewBox="0 0 400 250" role="img" aria-label="Three boxes in a triangle. The organisation's repository is at the top. Your fork is at the bottom right, your laptop at the bottom left. Fetch brings commits from the organisation to your laptop. Push sends commits from your laptop to your fork. A pull request asks the organisation to take commits from your fork.">
    <rect class="dg-key" x="90" y="6" width="220" height="56" rx="8" />
    <text class="dg-t dg-c" x="200" y="30">Hull-Robotics-Society</text>
    <text class="dg-m dg-c" x="200" y="50">upstream</text>
    <rect class="dg-box" x="6" y="180" width="130" height="56" rx="8" />
    <text class="dg-t dg-c" x="71" y="204">Your laptop</text>
    <text class="dg-s dg-c" x="71" y="224">your clone</text>
    <rect class="dg-box" x="264" y="180" width="130" height="56" rx="8" />
    <text class="dg-t dg-c" x="329" y="204">Your fork</text>
    <text class="dg-m dg-c" x="329" y="224">origin</text>
    <path class="dg-wire" d="M140 62L78 172" /><polygon class="dg-tip" points="74,180 74,170 83,175" />
    <text class="dg-m" x="14" y="118">git fetch</text>
    <text class="dg-m" x="14" y="134">upstream</text>
    <path class="dg-link" d="M136 208H256" /><polygon class="dg-tip" points="264,208 255,203 255,213" />
    <text class="dg-m dg-c" x="200" y="200">git push</text>
    <path class="dg-link" d="M322 180L262 70" /><polygon class="dg-tip" points="258,62 258,72 267,67" />
    <text class="dg-m" x="302" y="118">pull</text>
    <text class="dg-m" x="302" y="134">request</text>
  </svg>
  <figcaption>You can't push to the organisation, so your commits travel the long way round. Its commits reach you directly.</figcaption>
</figure>

### Fork and clone

Press **Fork** on the repository's GitHub page, and leave **Copy the main branch only** ticked. Then clone **your** fork, not the original:

```bash
git clone git@github.com:your-username/Hull-Robotics-Society.github.io.git
cd Hull-Robotics-Society.github.io
```

Or with one command, which also sets up the remotes:

```bash
gh repo fork Hull-Robotics-Society/Hull-Robotics-Society.github.io --clone
```

### Set up your remotes

Your clone only knows about your fork. Add the organisation's repository, and call it `upstream` by convention:

```bash
git remote add upstream git@github.com:Hull-Robotics-Society/Hull-Robotics-Society.github.io.git
git remote -v
```

```text
origin    git@github.com:your-username/Hull-Robotics-Society.github.io.git (fetch)
origin    git@github.com:your-username/Hull-Robotics-Society.github.io.git (push)
upstream  git@github.com:Hull-Robotics-Society/Hull-Robotics-Society.github.io.git (fetch)
upstream  git@github.com:Hull-Robotics-Society/Hull-Robotics-Society.github.io.git (push)
```

Do this once for each clone.

### Start each piece of work from the organisation's main

```bash
git fetch upstream
git switch -c feature/git-tutorials --no-track upstream/main
```

**`--no-track` matters.** Without it, the branch [tracks the wrong upstream](/tutorials/git-ahead-behind/#your-branch-tracks-the-wrong-upstream). Starting from `upstream/main` also means it doesn't matter if your fork's `main` is out of date.

### Make your changes and push to your fork

```bash
# edit, then
git add -p
git commit -m "Add a Git tutorial series"
git push -u origin HEAD
```

`HEAD` here is shorthand for "the branch I'm on". The output includes a link for opening the pull request.

### Keep your fork's main tidy

Keep `main` on your fork as an exact copy of the organisation's, and never commit to it. To update it, press **Sync fork → Update branch** on your fork's page, or run:

```bash
git switch main
git fetch upstream
git merge --ff-only upstream/main
git push origin main
```

`git status` on your fork's `main` can say `up to date` even when you're far behind the organisation. [Part 5 explains why](/tutorials/git-ahead-behind/#your-fork-is-behind-the-organisation).

### Sync your branch with the organisation's main

You've been working on `feature/arm` for a week, and the organisation's `main` has moved on. Your pull request may say it's out of date or has conflicts, or you may just need something that's landed. Your branch needs those commits.

First, be clear what each thing is, because there are four copies involved:

| Name | Where it is | What it is |
| --- | --- | --- |
| `upstream/main` | Your laptop's memory of the organisation | **What you want to sync with** |
| `origin/feature/arm` | Your laptop's memory of your fork | Your branch as last pushed |
| `feature/arm` | Your laptop | The branch you're working on |
| `main` and `origin/main` | Your laptop and your fork | **Not involved**, and probably out of date |

#### Step 1: See how far behind you are

Commit or stash anything you're in the middle of, then:

```bash
git switch feature/arm
git fetch upstream
git status
```

```text
On branch feature/arm
Your branch is up to date with 'origin/feature/arm'.
```

**This is true, and it doesn't answer your question.** Even straight after that fetch, `git status` only compares your branch with its copy on your fork. It never looks at the organisation. To do that, ask directly:

```bash
git rev-list --left-right --count upstream/main...HEAD
git log --oneline HEAD..upstream/main
```

```text
2	1

3da3c33 Add Tom to the crew
93602bd Add Priya to the crew
```

That's 2 behind the organisation and 1 ahead, and the two commits you're missing.

#### Step 2: Bring the commits in

Choose one. Both give you the same code.

**Merge,** if anyone else is using your branch, a review is under way, or you're unsure. It adds to your history, so a normal push works:

```bash
git merge upstream/main
git push
```

**Rebase,** if the branch is only yours and you want a tidy result. It replaces your commits, so you have to force push:

```bash
git rebase upstream/main
git status
git push --force-with-lease
```

After a rebase, `git status` reports that your branch has diverged, and it looks alarming:

```text
Your branch and 'origin/feature/arm' have diverged,
and have 3 and 1 different commits each, respectively.
  (use "git pull" if you want to integrate the remote branch with yours)
```

That's expected, because your branch and its copy on your fork really are different now. **Don't run `git pull` here,** whatever the hint says. It would bring your old commits back. [Part 5 has the details](/tutorials/git-ahead-behind/#you-rewrote-your-own-history).

If either one stops with a conflict, [resolve it](/tutorials/git-conflicts/#resolve-it) as usual, then run `git merge --continue` or `git rebase --continue`. To change your mind, use `--abort`.

#### Step 3: Check it worked

```bash
git rev-list --left-right --count upstream/main...HEAD
```

```text
0	2
```

**The first number should be 0,** which means you have everything from the organisation's `main`. The second is your own work, plus the merge commit if you merged. Your pull request updates itself as soon as you push, so there's no need to open a new one. Build and test it again too, as the code around your change has moved.

#### Mistakes to avoid

- **Merging `main` rather than `upstream/main`.** Your local `main` is probably out of date, so this appears to work and does nothing:

  ```text
  $ git merge main
  Already up to date.
  ```

  Check with the `rev-list` command above: the first number hasn't changed.

- **Thinking you have to update your fork's `main` first.** You don't. `upstream/main` comes straight from the organisation, so `feature/arm` can be fully up to date while your fork's `main` is still behind. Keep `main` tidy [as above](#keep-your-forks-main-tidy) when it suits you. They're separate jobs.

- **Expecting Sync fork to do this.** Pressing **Sync fork** on your fork's `main` updates your fork's `main`, and your feature branch doesn't change.

- **Running `git pull` to sync.** A plain `git pull` on your branch fetches from `origin`, your fork, so it won't bring in anything from the organisation. To pull from the organisation in one go, name it: `git pull --rebase upstream main`.

#### The button on GitHub

If there are no conflicts, a pull request may show **Update branch**, and its dropdown offers **Update with merge commit** or **Update with rebase**. It does the same as the above, but on your fork, without your laptop. So your laptop is now behind:

```bash
git fetch origin
git status
```

```text
Your branch is behind 'origin/feature/arm' by 2 commits, and can be fast-forwarded.
```

Run `git pull` before doing anything else. If you've made commits in the meantime, you'll have `diverged` instead, and `git pull` will stop and ask. Use `git pull --no-rebase` after a merge update, or `git pull --rebase` after a rebase update.

#### If the push is refused over HTTPS

If the organisation's commits change a file in `.github/workflows/`, and you push using HTTPS with a token, GitHub can refuse with `refusing to allow a Personal Access Token to create or update workflow`. That token needs the `workflow` permission. Pushing over SSH avoids this.

[Lab 6 has you practise all of this](/tutorials/git-lab-fork-pr/#task-8-keep-your-branch-in-sync-while-you-wait).

## The branch workflow

With write access, it's simpler, because there's only one remote:

```bash
git clone git@github.com:Hull-Robotics-Society/Dalek.git
cd Dalek
git switch -c fix/head-servo
# edit, then
git add -p
git commit -m "Reverse the head servo direction"
git push -u origin HEAD
```

Update before each new branch:

```bash
git switch main
git pull
```

Before you start, check which branch is the default. Most repositories use `main`, but older ones may use `master`, such as [InMoov-Simulator](https://github.com/Hull-Robotics-Society/InMoov-Simulator). Don't assume: a pull request aimed at the wrong branch is a common mistake.

## Open a pull request

A **pull request** (or PR) proposes merging your branch into another branch. It's where discussion, review and checks happen.

1. Open the repository on GitHub. A yellow banner offers **Compare & pull request**. If not, use the **Pull requests** tab → **New pull request**, and for a fork choose **compare across forks**.
2. **Check the four dropdowns at the top.** They read: base repository, base branch ← head repository, compare branch. The base should be the organisation's repository and `main`. The head should be your repository and your branch.
3. Write a title that says what it does: "Add a Git tutorial series", not "Update" or "patch-3".
4. Fill in the description (below).
5. Leave **Allow edits and access to secrets by maintainers** ticked on a fork, so that maintainers can make small fixes to your branch.
6. Press **Create pull request**, or use the arrow beside it for **Create draft pull request** if it isn't ready yet. Drafts run checks, but can't be merged until you press **Ready for review**.

From the terminal, `gh pr create` asks the same questions.

### A description reviewers will thank you for

```markdown
## What and why
The arm hit the bench in Tuesday's demo. The speed limit was only applied in
manual mode, and this applies it in all modes.

## How I tested it
Ran the arm through the full sweep in both modes on Baxter's left arm.

## Screenshots
(a photo or video, if anything visible changed)

Closes #14
```

`Closes #14` closes that issue automatically when the pull request is merged.

### Good pull requests are small

A 50-line pull request gets a careful review the same day. A 2,000-line one gets a skim next week, or nothing. One change per pull request: if you notice something else that needs fixing, make a separate one.

If it's a big change, open an issue first and check people want it before spending a month on it.

## Automated checks

Most repositories run automated checks on every pull request. On this website, every pull request runs [`npm run check` and a full build](https://github.com/Hull-Robotics-Society/Hull-Robotics-Society.github.io/blob/main/.github/workflows/check.yml). The result shows at the bottom of the pull request.

- **A red cross:** press **Details** and read the log. Usually the last few lines tell you what's wrong.
- **To fix it:** commit the fix to the same branch and push. The checks run again. Don't open a new pull request.
- **`Approve workflows to run`:** first-time contributors from a fork need a maintainer to press this before checks start. This is a security measure, so give them a nudge if it's been a while.
- **Secrets:** workflows started from a fork don't get the repository's secrets, and their token can only read. A check needing a secret can fail on a fork when it passes in the original repository.

Run the checks yourself before pushing, and you'll save everybody a round trip.

## Being reviewed

A reviewer can **Comment**, **Approve** or **Request changes**. On a protected branch like this site's `main`, an approval from someone with write access is needed before merging.

Changes go on the same branch, and the pull request updates itself:

```bash
git add -p
git commit -m "Clamp the speed before sending it"
git push
```

- **Suggestions:** reviewers can propose an exact change. **Commit suggestion** applies it on GitHub, so run `git pull` afterwards, or your next push will be rejected.
- **Conversations:** press **Resolve conversation** once dealt with. If you didn't do what was asked, say why first.
- **Rebasing during review:** it makes reviewers' earlier comments harder to follow. Prefer adding commits while a review's under way, and tidy up at the end if the repository wants that.
- **Disagreement is normal:** comments are about the code. If you think a suggestion is wrong, say why. If a thread gets long, talk it through on Discord or in the lab.
- **If it goes quiet:** wait a couple of days, then ask politely. Everyone's a student with deadlines.

## Reviewing other people's work

You don't need permission to review, and it's a good way to learn a codebase. On the **Files changed** tab, click a line to comment. Then press **Review changes** when you've finished.

To run someone's pull request yourself, use its number:

```bash
gh pr checkout 123
```

Or with plain Git, using a special reference GitHub provides for every pull request:

```bash
git fetch upstream pull/123/head:pr-123
git switch pr-123
```

Look for whether it does what it claims, and whether it'd be safe on a real robot. Point out what's good too. Leave the formatting to a formatter. If you have write access, remember that approving means you've actually read it.

## Merging

If you're allowed to merge, you'll see up to three options on the green button. A repository may offer only some of them, so follow its practice.

| Option | What ends up on main | Good for |
| --- | --- | --- |
| **Create a merge commit** | All your commits, plus a merge commit | Keeping full history. Commits stay recognisable, so `git branch -d` works. |
| **Squash and merge** | One new commit with everything | Messy branches with "fix typo" commits. Needs [a little care afterwards](/tutorials/git-ahead-behind/#after-a-squash-merge). |
| **Rebase and merge** | Copies of your commits in a straight line | Tidy branches with meaningful commits. |

If a merge is blocked, the box at the bottom of the pull request tells you why: an approval is missing, a check failed, there are conflicts, or the branch is out of date. For the last two, [sync your branch with the organisation's main](#sync-your-branch-with-the-organisations-main), and see [part 6](/tutorials/git-conflicts/#conflicts-on-a-pull-request) for the conflicts.

## Clean up after a merge

Press **Delete branch** on the merged pull request, if GitHub hasn't done it for you. Then on your laptop:

```bash
git switch main
git fetch --all --prune
git merge --ff-only upstream/main      # or: git pull, with the branch workflow
git push origin main                   # fork workflow only
git branch -d feature/git-tutorials
```

If `git branch -d` says `not fully merged` after a squash merge, that's [expected](/tutorials/git-ahead-behind/#after-a-squash-merge). Check with `git diff main feature/git-tutorials` and use `-D`.

Then start your next piece of work on a **new** branch.

## Worked example: change this website

The whole cycle on this site, from fork to pull request. You need [Node.js](https://nodejs.org) installed, and the [README](https://github.com/Hull-Robotics-Society/Hull-Robotics-Society.github.io#readme) explains more.

```bash
# Once: fork on GitHub, then
git clone git@github.com:your-username/Hull-Robotics-Society.github.io.git
cd Hull-Robotics-Society.github.io
git remote add upstream git@github.com:Hull-Robotics-Society/Hull-Robotics-Society.github.io.git
npm install

# For each change
git fetch upstream
git switch -c tutorial/my-workshop --no-track upstream/main
npm run new          # choose Tutorial and answer the questions
npm run dev          # preview at localhost:4321 and edit the new file
npm run check        # fix anything it reports
git status
git add src/content/tutorials/my-workshop.md
git commit -m "Add a tutorial for my workshop"
git push -u origin HEAD
```

Then open the pull request as above. The checks run, a committee member reviews it, and merging into `main` publishes the site in about two minutes. Opening a pull request publishes nothing, so you can't break the live site by trying.

For a one-file correction, there's an even shorter route: **Spotted a mistake? Edit this page on GitHub** at the bottom of any page here. GitHub forks the repository, makes a branch and opens the pull request for you.

## When access is the problem

| Message | What it means | What to do |
| --- | --- | --- |
| `ERROR: Permission to Hull-Robotics-Society/x.git denied to your-username` | You don't have write access | Use a fork, or ask for access |
| `remote: Permission to ... denied` with `403` | The same, over HTTPS | Same |
| `Permission denied (publickey)` | GitHub doesn't know this key | [Check your SSH setup](/tutorials/git-setup/#step-5-connect-your-computer-with-an-ssh-key) |
| `ERROR: Repository not found` | Wrong address, or private and you've no access | Check the spelling and `git remote -v` |
| `GH006: Protected branch update failed` | You pushed directly to a protected branch | [Move your work to a branch](/tutorials/git-ahead-behind/#you-committed-to-main-by-mistake) |
| `GH013: Repository rule violations found` | A ruleset blocked it | Read the lines below it for which rule |
| `GH007: Your push would publish a private email address` | Your commit has your real email | [Fix the commit](/tutorials/git-undo/#wrong-name-or-email-on-a-commit) |

## Be a good contributor

- Search the issues before starting, and say you're working on something so that nobody duplicates it.
- Read the repository's `README` and `CONTRIBUTING` first.
- Match the style of the code around you, even if you'd do it differently.
- Test on real hardware when you can, and say so when you can't.
- Don't commit secrets, large recordings or generated files.
- Check licences before you copy code in.
- Finish or hand over what you've started. If you've lost interest, say so: that's useful to know, and fine.
