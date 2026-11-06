---
title: "Handle three branches at once"
date: 2026-11-04
excerpt: "Lights, wheels and sensors are all in progress and all aimed at main. Land them one at a time and watch the numbers change as each merge leaves the others further behind. Works solo or as a team of three."
level: "Advanced"
duration: "About 90 minutes"
needs:
  - "Your fork of git-practice, from Lab 6"
  - "Labs 3 and 4, or the same experience"
  - "Optional: two friends, for the team version"
series: "Git hands-on labs"
part: 7
topic: "Git"
tags: ["Git", "Practice", "Teamwork"]
aiAssisted: true
---
This is what a real project feels like. Three pieces of work are in progress at once, and all of them started from the same `main`. Nothing's wrong with any of them, but as soon as one lands, the others are behind. One of them will conflict.

Everything in this lab happens **in your own fork**. You're merging into your fork's `main`, so you can't disturb anybody, and you'll put it all back at the end.

<figure class="diagram">
  <svg viewBox="0 0 400 190" role="img" aria-label="main runs along the bottom. Three branches, lights, wheels and sensors, all split from the same commit on main. Each has its own commits. Lights touches robot.py. Wheels and sensors both touch config.py.">
    <path class="dg-wire" d="M20 160H380" />
    <path class="dg-link" d="M80 160L140 30H240" />
    <path class="dg-link" d="M80 160L140 80H240" />
    <path class="dg-link" d="M80 160L140 125H290" />
    <circle class="dg-box" cx="30" cy="160" r="8" /><circle class="dg-key" cx="80" cy="160" r="8" />
    <circle class="dg-box" cx="170" cy="30" r="8" /><circle class="dg-box" cx="240" cy="30" r="8" />
    <circle class="dg-box" cx="170" cy="80" r="8" /><circle class="dg-box" cx="240" cy="80" r="8" />
    <circle class="dg-box" cx="170" cy="125" r="8" /><circle class="dg-box" cx="230" cy="125" r="8" /><circle class="dg-box" cx="290" cy="125" r="8" />
    <text class="dg-m" x="256" y="22">lights</text><text class="dg-s" x="256" y="40">robot.py</text>
    <text class="dg-m" x="256" y="72">wheels</text><text class="dg-s" x="256" y="90">config.py</text>
    <text class="dg-m" x="304" y="118">sensors</text><text class="dg-s" x="304" y="136">config.py</text>
    <text class="dg-m" x="344" y="182">main</text>
  </svg>
  <figcaption>Three branches from one starting point. Two of them change the same line of the same file, and they don't know it yet.</figcaption>
</figure>

## Set up

Go to your clone of your fork, and make sure `main` matches the organisation:

```bash
cd my-practice
git switch main
git fetch --all --prune
git merge --ff-only upstream/main
git push origin main
```

If `--ff-only` refuses, your fork's `main` has extra commits, from Lab 6's challenge, say. [Reset it](/tutorials/git-ahead-behind/#your-forks-main-is-ahead-of-the-organisation) first.

Make your own copy of each teammate's work, and put them on your fork:

```bash
git switch -c lights --no-track upstream/team/lights
git switch -c wheels --no-track upstream/team/wheels
git switch -c sensors --no-track upstream/team/sensors
git switch main
git push -u origin lights wheels sensors
git branch -vv
```

**Doing this with friends?** Skip to [the team version](#the-team-version) first.

## Task 1: Measure where everything stands

You'll run this after every step. Do it now, and write down the numbers:

```bash
for b in lights wheels sensors; do echo "$b: $(git rev-list --left-right --count main...$b)"; done
```

The numbers mean behind, then ahead. Yours may differ in the first column, depending on how many people have finished Lab 6:

```text
lights: 3	2
wheels: 3	2
sensors: 3	3
```

So `lights` has two commits of its own, and it's three behind `main`. Now look at what each one touches:

```bash
git diff main...lights --stat
git diff main...wheels --stat
git diff main...sensors --stat
```

**Predict:** you're going to land all three in this order: lights, wheels, sensors. Which one will conflict, and why not the others?

<details>
<summary>Check your answer</summary>

`sensors`. `wheels` lands first and changes the speed limit line. When `sensors` arrives, it's trying to change that same line from the same original. `lights` only touches `robot.py` and its own new file, so it doesn't collide with anyone. Merge them in another order and a different one gets the conflict, but there'll always be one.

</details>

## Task 2: Open three pull requests

Open one for each branch, **against your own fork**. With the CLI, using your own username:

```bash
gh pr create --repo your-username/git-practice --base main --head lights --title "Add lights" --body "Ben's work."
gh pr create --repo your-username/git-practice --base main --head wheels --title "Add wheels" --body "Cleo's work."
gh pr create --repo your-username/git-practice --base main --head sensors --title "Add the bump sensor" --body "Dev's work."
gh pr list --repo your-username/git-practice
```

On the website, open your fork's **Pull requests** tab → **New pull request**. GitHub proposes the organisation as the base. **Change base repository to your own fork,** choose the branch, and create it. Repeat for each.

**Checkpoint:** three open pull requests on your fork. Go to the `sensors` one and read it. GitHub says it can merge cleanly at this stage, because nothing has landed yet.

## Task 3: Land lights

Merge it, with the CLI, or by pressing **Merge pull request** and then **Delete branch**. Use **Create a merge commit** for this lab.

```bash
gh pr merge lights --repo your-username/git-practice --merge --delete-branch
```

Back in your terminal:

```bash
git status
```

**Predict:** you're on `main`. A pull request has just merged into your fork's `main`. What does `git status` say?

<details>
<summary>Check your answer</summary>

`up to date`, again, since you haven't fetched. Your laptop doesn't know about any of this.

</details>

Now catch up, and measure again:

```bash
git fetch --all --prune
git status
git pull
git branch -vv
for b in wheels sensors; do echo "$b: $(git rev-list --left-right --count main...$b)"; done
```

```text
  lights  bde0cf6 [origin/lights: gone] Show the lights in Scout's status

wheels: 6	2
sensors: 6	3
```

`wheels` and `sensors` were 3 behind, and now they're 6: lights' two commits, plus the merge commit. **Neither branch has changed, but both are further behind.** That's all "behind" means. Tidy up:

```bash
git branch -d lights
python3 robot.py
```

## Task 4: Land wheels

Check GitHub first. The `wheels` pull request still says it can merge, even though it's behind. Being behind isn't a problem until it's a conflict.

Merge it, then catch up:

```bash
gh pr merge wheels --repo your-username/git-practice --merge --delete-branch
git fetch --all --prune
git pull
git branch -d wheels
python3 robot.py
git rev-list --left-right --count main...sensors
```

```text
Name: Scout
Speed limit: 1.5 m/s
Lights on: True
9	3
```

## Task 5: The third branch

Refresh the `sensors` pull request. It now says `This branch has conflicts that must be resolved`, and the **Merge** button is greyed out. The check is whether `sensors` can combine with today's `main`, and it can't.

You could press **Resolve conflicts** on GitHub. Use your terminal, since you can run the code there. You've got a choice to make.

**Predict:** this is your own branch, and nobody else is using it. Should you rebase or merge?

<details>
<summary>Check your answer</summary>

Either is fine, and rebasing is the usual choice on your own branch, as it gives a cleaner result. If someone else were using the branch, you'd merge. Do it with a rebase here, and try the other way in the challenges.

</details>

```bash
git switch sensors
git status
git rebase origin/main
```

```text
Rebasing (1/3)Rebasing (2/3)Auto-merging config.py
CONFLICT (content): Merge conflict in config.py
error: could not apply 82fd853... Lower the speed limit so the bump sensor has time to react
```

Open `config.py`, and read the two sides. Which is which? (Remember [the swap](/tutorials/git-lab-conflicts/#task-5-the-same-conflict-in-a-rebase).) Agree with your teammates, or yourself, on 0.8:

```python
# Scout's settings
NAME = "Scout"
MAX_SPEED = 0.8  # metres per second: agreed by Cleo and Dev
```

```bash
git add config.py
git diff --check --cached
git rebase --continue
git status
```

**Predict:** you've just rebased onto the latest `main`, so everything's fixed. So why does `git status` look like this?

```text
Your branch and 'origin/sensors' have diverged,
and have 12 and 3 different commits each, respectively.
```

Your first number may be different, depending on how far `main` has moved.

<details>
<summary>Check your answer</summary>

Your branch is compared with its **own copy on your fork**, which hasn't changed. It has Dev's 3 old commits, and you now have 3 new ones on top of the 9 you've brought in from `main`. Scary numbers, and exactly what you expected. A normal `git push` is refused, as you've seen. It's your own branch, so:

```bash
git push --force-with-lease
```

</details>

**Checkpoint:** go back to the pull request. The conflict has gone, and the commits and files have updated themselves. In your terminal:

```bash
git rev-list --left-right --count origin/main...HEAD
```

```text
0	3
```

Zero behind, three ahead: the ideal shape for a pull request. Merge it, and finish up:

```bash
gh pr merge sensors --repo your-username/git-practice --merge --delete-branch
git switch main
git fetch --all --prune
git pull
git branch -d sensors
python3 robot.py
git lg -12
```

```text
Name: Scout
Speed limit: 0.8 m/s
Lights on: True
```

All three made it. Take a moment with that `git lg`: you can read the story of the whole project in it.

## Task 6: Put it all back

Your fork's `main` is now ahead of the organisation by all that work. If you were to open a pull request to the organisation, it would all come along, so reset it:

```bash
git rev-list --left-right --count main...upstream/main
git reset --hard upstream/main
git push --force-with-lease origin main
git status
```

**Checkpoint:** `git rev-list` would now print `0	0`. You can run this whole lab again whenever you want. It's not a bad idea to try it in a different order, to see which branch gets the conflict.

## On your own

**Challenge 1.** Run the lab again, landing `sensors` before `wheels`, and using a **merge** rather than a rebase to fix the conflict. What's different about `git status` afterwards, and about the push?

<details>
<summary>Show a solution</summary>

When `wheels` has the conflict, run:

```bash
git switch wheels
git merge origin/main
# fix config.py
git add config.py
git merge --continue
git status
git push
```

`git status` says `ahead`, rather than `diverged`, and a normal `git push` works. A merge only adds to history, whereas a rebase replaces it. Your branch's history is messier, though, and a squash merge would then tidy that up.

</details>

**Challenge 2.** While `sensors` is mid-conflict, you need to check something on `main`. Without aborting, use a worktree to look at `main`'s `config.py` in another folder.

<details>
<summary>Show a solution</summary>

```bash
git worktree add ../scout-main --detach origin/main
cat ../scout-main/config.py
git worktree remove ../scout-main
```

A [worktree](/tutorials/git-power-tools/#work-on-two-branches-at-once-with-worktrees) is a second working folder for the same repository. Your half-finished rebase isn't touched at all.

</details>

**Challenge 3.** A fourth emergency. While the others wait, the status output must say `Robot:` instead of `Name:`, right now. Fix it in `robot.py` on a `hotfix/name` branch in a worktree, based on `origin/main`. Land it first, and then bring `sensors` up to date.

<details>
<summary>Show a solution</summary>

```bash
git fetch origin
git worktree add ../scout-hotfix -b hotfix/name --no-track origin/main
cd ../scout-hotfix
sed -i 's/f"Name: {NAME}"/f"Robot: {NAME}"/' robot.py
git commit -am "Label the name as Robot"
git push -u origin HEAD
gh pr create --repo your-username/git-practice --base main --head hotfix/name --title "Label the name as Robot" --body "Urgent."
gh pr merge hotfix/name --repo your-username/git-practice --merge --delete-branch
cd ../my-practice
git worktree remove ../scout-hotfix
git branch -D hotfix/name
git fetch origin
git switch sensors
git rebase origin/main
```

That change is in a different file, so Git works it out alone. If you'd renamed `NAME` in `config.py` instead, you'd get a conflict, even though it's a different line from the speed limit. **Git treats changes to neighbouring lines as overlapping.** Try it and see.

</details>

## The team version

This lab is better with people. In a group of three, each takes a branch and a teammate's name: Ben (lights), Cleo (wheels) and Dev (sensors).

1. **One person forks** the practice repository, then invites the other two at **Settings → Collaborators → Add people**.
2. **Everyone clones that fork,** rather than one of their own. Then they check out their own branch, after the fork's owner has pushed all three branches:

   ```bash
   git clone git@github.com:fork-owner/git-practice.git team-scout
   cd team-scout
   git switch wheels
   ```

3. **Each person makes one real change** on their branch, such as a comment or a new status line, commits and pushes. Each opens their own pull request against the fork's `main`.
4. **Everyone reviews someone else's work,** and leaves one comment. Have them change something in response.
5. **Decide the merge order out loud,** then merge one at a time. After each merge, everyone runs `git fetch` and the measuring command from Task 1, and compares numbers.
6. **Dev and Cleo have a real conversation** about the speed limit. One of them resolves the conflict. The other reviews the result before it's merged.

It should get a little chaotic, and that's the lesson. To cause some extra trouble, have two people change the same line of `robot.py`, or have someone force push a branch that a teammate is also working on, and see what happens to them.

This also makes a good society workshop: three people to a laptop group, about an hour, with committee members walking round to help with conflicts.

## Where next

You've now caused, seen and fixed nearly everything that goes wrong in day-to-day Git. For the society's own projects, the route's the same as in these labs. See [Contributing to an organisation](/tutorials/git-org-member/), and pick a repository from [our organisation](https://github.com/Hull-Robotics-Society). If you get stuck on something real, there's the [error index](/tutorials/git-reference/#error-index), or ask on Discord.
