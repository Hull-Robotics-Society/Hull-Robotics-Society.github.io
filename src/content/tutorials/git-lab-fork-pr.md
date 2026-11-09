---
title: "Fork, branch and open a real pull request"
author: "Rob Finnis"
date: 2026-11-06
excerpt: "Fork the society's practice repository, add yourself to the crew on your own branch, get a check passing, open a pull request back to the organisation and clean up afterwards."
level: "Intermediate"
duration: "About 60 minutes"
needs:
  - "Labs 1 to 3, or the same experience"
  - "A GitHub account with an SSH key"
  - "Python 3, to run the check (optional, GitHub runs it too)"
  - "The GitHub CLI, if you want to stay in the terminal (optional)"
series: "Git hands-on labs"
part: 6
topic: "Git"
tags: ["Git", "Practice", "Pull requests"]
---
You don't need to be a member of the society to do this one. You'll follow the same route as a contribution to any open source project: fork, branch, change, check, pull request, review, merge, tidy up. At the end, your name is in the society's [git-practice](https://github.com/Hull-Robotics-Society/git-practice) repository.

[Contributing to an organisation](/tutorials/git-org-member/) explains the reasoning, and it's worth having open alongside this.

## Task 1: Fork it

A fork is your own copy on GitHub, under your account.

With the GitHub CLI, from a folder outside any other repository:

```bash
gh repo fork Hull-Robotics-Society/git-practice --clone --default-branch-only
cd git-practice
```

Or on the website, open [git-practice](https://github.com/Hull-Robotics-Society/git-practice), press **Fork** and accept the defaults. Then clone **your fork**, not the original, with your own username:

```bash
git clone git@github.com:your-username/git-practice.git my-practice
cd my-practice
```

The labs call this folder `my-practice`, to keep it apart from your clone from Lab 4. If `gh` called yours `git-practice`, rename it with `mv`, or just bear that in mind. Delete or rename the Lab 4 clone first if the names clash.

## Task 2: Connect the original

```bash
git remote -v
git branch -a
```

If you used the website, you'll see only your fork:

```text
origin	git@github.com:your-username/git-practice.git (fetch)
origin	git@github.com:your-username/git-practice.git (push)
```

Your clone doesn't know about the organisation, and it won't hear of anything that happens there. Add it (the CLI has already done this for you, so skip this if `upstream` is listed):

```bash
git remote add upstream git@github.com:Hull-Robotics-Society/git-practice.git
git fetch upstream
git branch -a
```

**Predict:** you can read from `upstream`. Could you push to it?

<details>
<summary>Check your answer</summary>

Not unless you've been given write access. Your SSH key proves who you are, and the organisation decides what you can do. That's why your work travels through your fork. Try `git push upstream main` if you like: if you aren't allowed, it's refused with `Permission to Hull-Robotics-Society/git-practice.git denied`.

</details>

## Task 3: Make a branch for your work

**Never work on `main` in a fork.** Start from the organisation's latest, using your own GitHub username in lower case:

```bash
git switch -c crew/your-username --no-track upstream/main
git status
```

**Predict:** what happens without `--no-track`?

<details>
<summary>Check your answer</summary>

Your branch would be linked to `upstream/main`. A plain `git push` would then fail with `The upstream branch of your current branch does not match`. See [Your branch tracks the wrong upstream](/tutorials/git-ahead-behind/#your-branch-tracks-the-wrong-upstream). Try it on a throwaway branch and see.

</details>

## Task 4: Make your change, wrongly

You'll add a file in `crew/`, but get it slightly wrong to see the check catch it. Use your own username for the file name:

```bash
echo "Your Name" > crew/your-username.md
echo "" >> crew/your-username.md
echo "Favourite robot: Pepper" >> crew/your-username.md
git status --short
python3 scripts/check_crew.py
```

```text
crew/your-username.md: the first line should be '# Your name'
1 problem(s) found
```

This is the same script GitHub runs on pull requests. Find problems here and you save everyone a round trip. Look at `crew/example.md`, then fix your file in your editor so that it starts with `# Your Name`:

```bash
python3 scripts/check_crew.py
```

```text
All crew files look good
```

## Task 5: Commit and push to your fork

```bash
git status --short
git add crew/your-username.md
git diff --staged
git commit -m "Add your-username to the crew"
git push -u origin HEAD
```

**Checkpoint:** see exactly what your pull request will contain. Both of these should show just your one file and your one commit:

```bash
git log --oneline upstream/main..HEAD
git diff upstream/main...HEAD --stat
```

```text
43a3486 Add your-username to the crew

 crew/your-username.md | 3 +++
 1 file changed, 3 insertions(+)
```

If you see other files or commits, stop and sort that out before opening the pull request. It usually means you started from the wrong place. [Your branch started from an old main](/tutorials/git-ahead-behind/#your-branch-started-from-an-old-main) has the fix.

## Task 6: Open the pull request

With the GitHub CLI:

```bash
gh pr create --repo Hull-Robotics-Society/git-practice --base main --head your-username:crew/your-username --title "Add your-username to the crew" --body "Completed the fork lab."
```

Or on the website, open your fork, press **Compare & pull request**, and **read the bar at the top**. It should say:

```text
base repository: Hull-Robotics-Society/git-practice   base: main
head repository: your-username/git-practice           compare: crew/your-username
```

Give it a clear title and a line of description, then press **Create pull request**.

**Checkpoint:** your pull request appears in [the organisation's list](https://github.com/Hull-Robotics-Society/git-practice/pulls). Read its **Files changed** tab, as a reviewer would. Your first one may show `Approve workflows to run`, which a maintainer has to press before the check starts.

## Task 7: Respond to review

Say a reviewer asks you to add what you're learning Git for. **Don't open a new pull request.** Commit to the same branch:

```bash
echo "Learning Git for the Dalek project" >> crew/your-username.md
python3 scripts/check_crew.py
git add crew/your-username.md
git commit -m "Say what I'm learning Git for"
git push
```

Refresh the pull request page, and your new commit is there. A pull request follows a **branch**, not a commit.

## Task 8: Keep your branch in sync while you wait

Your pull request is waiting for review, and meanwhile the organisation's `main` keeps moving. This happens on every real project, so practise it now, without touching your pull request. You'll use a practice branch, started from an old commit so that it's definitely behind:

```bash
git switch -c catch-up --no-track d078679
echo "catch-up notes" > catch-up.txt
git add catch-up.txt
git commit -m "Add catch-up notes"
git push -u origin HEAD
```

Now get the latest from the organisation, and see where you stand:

```bash
git fetch upstream
git status
```

**Predict:** you've just fetched, and you're well behind the organisation. What does `git status` say?

<details>
<summary>Check your answer</summary>

```text
Your branch is up to date with 'origin/catch-up'.
```

Up to date with **your fork's** copy. `git status` only compares a branch with its upstream, and that's on your fork, so it will never mention the organisation.

</details>

Ask the question directly. The first number is how far behind the organisation you are, and the second is your own work:

```bash
git rev-list --left-right --count upstream/main...HEAD
git log --oneline HEAD..upstream/main
```

**Try the wrong way first.** Lots of people merge their local `main`, without noticing it's weeks old. Make a branch to play the part of an out-of-date `main`, and merge that:

```bash
git branch stale-main d078679
git merge stale-main
git rev-list --left-right --count upstream/main...HEAD
```

**Predict:** did that help?

<details>
<summary>Check your answer</summary>

No. It prints `Already up to date`, and the first number hasn't changed. That message only means you have everything in the branch you named, so it's easy to believe you've synced when you haven't. Your real `main` may well be fresher than this, but you'd have to check. Using `upstream/main` means you don't need to.

</details>

Delete the stand-in with `git branch -d stale-main`.

Now do it properly, with a merge:

```bash
git merge --no-edit upstream/main
git status
git push
git rev-list --left-right --count upstream/main...HEAD
```

**Checkpoint:** the first number is `0`. You now have everything from the organisation, and your fork's `main` didn't come into it: you never switched to it, and you didn't need to update it first.

### The same thing, with a rebase

```bash
git switch -c catch-up-2 --no-track d078679
echo "more notes" > catch-up-2.txt
git add catch-up-2.txt
git commit -m "Add more notes"
git push -u origin HEAD
git rebase upstream/main
git status
```

```text
Your branch and 'origin/catch-up-2' have diverged,
and have 2 and 1 different commits each, respectively.
```

Your first number may be different. **Predict:** the hint says to use `git pull`. Should you?

<details>
<summary>Check your answer</summary>

No. Your commit has a new hash now, and your fork still has the old one. Pulling would merge the old one back in, and you'd have both. This is your own branch, so replace the copy on your fork:

```bash
git push --force-with-lease
git rev-list --left-right --count upstream/main...HEAD
```

The result is `0` and `1`: nothing missing, and one tidy commit of your own.

</details>

Tidy up both practice branches, here and on your fork. Then switch back to your real branch, or to `main`:

```bash
git switch main
git push origin --delete catch-up catch-up-2
git branch -D catch-up catch-up-2
```

If the organisation has moved while your real pull request has been waiting, you can now sync that branch in just the same way. [Part 9 has the full guide](/tutorials/git-org-member/#sync-your-branch-with-the-organisations-main).

## Task 9: After it's merged

A committee member will review and merge your pull request, which may take a few days. It might be a squash merge. Then come back and tidy up:

```bash
git fetch --all --prune
git status
git switch main
git status
```

**Predict:** you're on `main`, and your pull request has been merged. What does `git status` say? Is your work in your `main`?

<details>
<summary>Check your answer</summary>

```text
Your branch is up to date with 'origin/main'.
```

It says up to date, and your work **isn't there**. `origin` is your fork, which has no idea anything happened in the organisation. This is the [most misleading message in Git](/tutorials/git-ahead-behind/#your-fork-is-behind-the-organisation). Check for yourself:

```bash
git rev-list --left-right --count main...upstream/main
```

```text
0	2
```

Two behind the organisation: your merged commit, plus someone else's.

</details>

Update your `main`, and your fork's:

```bash
git merge --ff-only upstream/main
git status
git push origin main
git status
ls crew
```

Your file's in the list. Now delete your branch:

```bash
git branch -d crew/your-username
```

**Predict:** if it was a squash merge, what does that command do?

<details>
<summary>Check your answer</summary>

```text
error: the branch 'crew/your-username' is not fully merged
```

A squash merge creates a new commit, so Git can't tell your commits were merged. Check that your branch has nothing `main` doesn't, then use `-D`. The check only lists differences in the other direction: here, a file someone else added.

```bash
git diff main crew/your-username --stat
git branch -D crew/your-username
```

</details>

Press **Delete branch** on the pull request as well, if it hasn't happened automatically. Congratulations: you've done the full cycle, and it's the same one you'd follow for a real project.

## On your own

**Challenge 1.** Make a small improvement in your fork without troubling a maintainer. Open a pull request **against your own fork's `main`**, and merge it yourself. Be careful: GitHub offers the organisation as the base by default.

<details>
<summary>Show a solution</summary>

```bash
git switch -c fix/readme --no-track upstream/main
echo "Practising in my own fork." >> README.md
git commit -am "Note that this is a practice fork"
git push -u origin HEAD
gh pr create --repo your-username/git-practice --base main --head fix/readme --title "Note that this is a practice fork" --body "Practice."
gh pr merge fix/readme --repo your-username/git-practice --merge --delete-branch
```

On the website, change **base repository** to your own fork in the dropdown. Afterwards, `main` in your fork is ahead of the organisation. Challenge 2 sorts that out.

</details>

**Challenge 2.** Your fork's `main` is now different from the organisation's. Get it back to an exact copy.

<details>
<summary>Show a solution</summary>

```bash
git switch main
git fetch --all --prune
git rev-list --left-right --count main...upstream/main
git reset --hard upstream/main
git push --force-with-lease origin main
```

This discards your fork's extra commits, which is fine in a fork you own. Never do it to a shared branch.

</details>

**Challenge 3.** Sync a branch when it conflicts. Make a branch from `d078679`, add a line to the end of `README.md`, commit and push it. Then bring it up to date with the organisation's `main`, keeping both your line and theirs, and update your fork's copy.

<details>
<summary>Show a solution</summary>

```bash
git switch -c catch-up-3 --no-track d078679
echo "My note at the end of the README" >> README.md
git commit -am "Add a note to the README"
git push -u origin HEAD
git fetch upstream
git rebase upstream/main
```

The organisation added its own text at the end of `README.md`, so this conflicts. Open the file, keep both, and delete the marker lines. Then:

```bash
git add README.md
git diff --check --cached
git rebase --continue
git push --force-with-lease
git rev-list --left-right --count upstream/main...HEAD
```

The first number should be `0`. Tidy up with `git switch main`, `git push origin --delete catch-up-3` and `git branch -D catch-up-3`.

</details>

**Challenge 4.** Review a stranger's work. Pick an open pull request in [the organisation's list](https://github.com/Hull-Robotics-Society/git-practice/pulls), fetch it by its number, and run the check on it.

<details>
<summary>Show a solution</summary>

```bash
git fetch upstream pull/123/head:pr-123
git switch pr-123
python3 scripts/check_crew.py
git diff upstream/main...HEAD
git switch main
git branch -D pr-123
```

Or, with the CLI: `gh pr checkout 123`. Leave a friendly comment if everything looks good. You don't need permission to review.

</details>

Next, the one you've been working towards: [three branches at once](/tutorials/git-lab-three-branches/).
