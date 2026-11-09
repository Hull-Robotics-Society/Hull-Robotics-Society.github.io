---
title: "Look after your personal GitHub account"
author: "Rob Finnis"
date: 2026-11-04
excerpt: "Create and configure your own repositories, choose a licence, add collaborators, protect your work, keep your account secure and turn your profile into something worth showing an employer."
level: "Beginner"
duration: "About 45 minutes"
needs:
  - "A GitHub account with an SSH key (part 1)"
  - "A project you would like to put online, or the practice repository from part 3"
series: "Git and GitHub"
part: 8
topic: "Git"
tags: ["GitHub", "Repositories", "Security"]
---
Your personal account is yours for life, long after university. Everything in it belongs to you, and you decide who gets access. This part covers how to run it. [Part 9](/tutorials/git-org-member/) covers working in an organisation, which adds shared ownership and finer-grained permissions.

| | Personal account | Organisation |
| --- | --- | --- |
| Owned by | One person | A group, with several owners |
| Who can log in | You | Nobody: members use their own accounts |
| Permissions | You, plus collaborators | Roles and teams, per repository |
| If someone leaves | You still own it | The organisation still owns it |
| Good for | Your own projects, your portfolio | Society and team projects |

## Create a repository

On GitHub, press **+ → New repository**, or from the terminal:

```bash
gh repo create line-follower --private --source=. --remote=origin --push
```

The form asks a few questions:

- **Owner:** your account, or an organisation you can create repositories in.
- **Name:** lower case with hyphens. `line-follower` beats `Untitled-Project-FINAL-2`.
- **Public or private:** see the next section.
- **README, `.gitignore`, licence:** tick these only if you're **starting** here and will clone it next. If you've got an existing local project, leave them all off and [push as in part 3](/tutorials/git-everyday/#connect-a-new-repository-to-github). Otherwise you'll end up with [unrelated histories](/tutorials/git-ahead-behind/#refusing-to-merge-unrelated-histories).

### Public or private?

**Public** repositories are visible to everyone, and they're a free portfolio. **Private** ones are visible only to you and those you invite. You can change this later under **Settings → General → Danger Zone**.

> **Coursework:** putting assessed work in a public repository can count as helping others to cheat, even after you've handed it in. Keep it private unless your module's rules clearly allow otherwise, and check the university's academic misconduct policy if you're unsure. Going public doesn't hide old commits either, so read through your history before you do.

Before you make something public, check the **whole history** for secrets, not just the latest files. [Part 7 explains what to do](/tutorials/git-undo/#you-pushed-a-password-or-key) if you find any.

## Make it worth finding

### Write a README

A `README.md` in the top folder appears on your repository's front page. Cover what someone needs to know:

```markdown
# Line follower

A small robot that follows a black line using two IR sensors and an Arduino Nano.

![The finished robot](docs/robot.jpg)

## What you need
- Arduino Nano, L298N motor driver, two IR sensors

## Getting started
1. Wire it up as shown in `docs/wiring.png`
2. Open `line_follower.ino` in the Arduino IDE and upload it

## Status
Works on gentle curves. Sharp corners are next.
```

Add a photo. A robot that's visibly working beats any amount of text.

### Choose a licence

**Without a licence, your code is under full copyright by default.** People can look at it on GitHub, but they have no right to use it. If you want others to use your work, add one:

| Licence | In short |
| --- | --- |
| MIT | Do what you like, just keep the notice. Simple and common. |
| Apache 2.0 | Like MIT, plus an explicit patent grant. |
| GPL 3.0 | Anything built on it must also be open source under GPL. |
| CC BY 4.0 | For documents, images and models rather than code. |

Press **Add file → Create new file**, name it `LICENSE`, and GitHub offers a **Choose a license template** button. [choosealicense.com](https://choosealicense.com) goes into more detail. Using someone else's code means following their licence too.

### Fill in the About box

The gear icon beside **About** on the repository page sets a description, a website link and topics such as `arduino` and `ros2`. Topics are how people find projects.

## Your profile

- **Profile README:** make a public repository with **exactly your username** as its name. Its `README.md` appears at the top of your profile page. Say what you do and link your best projects.
- **Pinned repositories:** on your profile, **Customize your pins** picks up to six to show first. Choose work you can talk about in an interview.
- **Contribution graph:** those green squares count commits on a repository's default branch, and commits count only if their email is linked to your account. If yours look empty, [check your email setting](/tutorials/git-setup/#step-3-tell-git-who-you-are). Commits on a fork count only once they've been merged into the original.
- **Your own website:** a repository named `your-username.github.io` is published at that address by GitHub Pages. For other repositories, go to **Settings → Pages**. The site you're reading now is hosted this way.

## Work with other people on your repository

Invite people at **Settings → Collaborators → Add people**. On a personal repository, permissions are simple: collaborators can push, merge and manage issues, while only you control settings, and deletion and transfer of the repository. There are no finer roles. If you need those, [move it to an organisation](#move-a-repository).

Anyone can **fork** a public repository and open a pull request. They don't need your permission or an invitation.

### Should you use branches when you work alone?

You can push straight to `main`, and for a small project that's fine. Branches are still worth it when:

- `main` needs to stay working, such as code on a robot you're about to demo.
- You're trying something you might abandon.
- You want the practice for shared projects, or the record a pull request leaves behind.

Opening a pull request against yourself is a good way to read your own changes before they land.

### Protect main

Under **Settings → Rules → Rulesets → New branch ruleset**, you can block force pushes and deletions on `main`. Rules like this work on public repositories on the free plan. Private repositories need a paid plan such as Pro. [Part 10 covers the options](/tutorials/git-org-owner/#protect-main).

## The rest of the repository tabs

- **Issues:** a to-do list everyone can see. Write down bugs and ideas. Referring to `#12` in a commit or pull request links them up.
- **Projects:** a kanban board built on your issues.
- **Actions:** runs commands on GitHub's computers when you push, such as tests. Standard runners are free on public repositories. [This site's check](https://github.com/Hull-Robotics-Society/Hull-Robotics-Society.github.io/blob/main/.github/workflows/check.yml) is a short example.
- **Releases:** packaged versions linked to a [tag](/tutorials/git-power-tools/#tags-and-releases), for example a firmware file people can download.
- **Wiki:** longer documentation, separate from the code. Many projects prefer a `docs/` folder, since it goes through the same review as the code.

## Keep up with notifications

Notifications can pile up. On any repository, **Watch** controls what you hear about: **Participating and @mentions** is a sensible default, and **All activity** suits only the projects you maintain. **Stars** are bookmarks and don't notify you. Under **Settings → Notifications**, you can choose email or web only, and the email address for each organisation.

## Keep your account safe

Your account is a way into everything you've got access to, including the society's repositories. Once a term, look through these:

- **Settings → Password and authentication:** is two-factor on, and do you know where your recovery codes are?
- **Settings → SSH and GPG keys:** delete keys for laptops you no longer have.
- **Settings → Sessions:** sign out anything you don't recognise.
- **Settings → Applications:** remove apps you've stopped using.
- **Settings → Developer settings → Personal access tokens:** delete old ones.
- **Settings → Security log:** a record of what your account has done.
- **Your own repositories, under Security:** GitHub can warn about vulnerable dependencies and leaked secrets. Turn on **Dependabot alerts** and **Secret scanning** in **Settings → Advanced Security**.

### Personal access tokens

Some tools need a token rather than an SSH key, and on a Raspberry Pi or a robot one can be a sensible choice. Use a **fine-grained** token, limited to the one repository it needs, with the fewest permissions and an expiry date. Tokens are passwords, so treat them like passwords: never commit them.

Better still for a robot, use a **deploy key**: an SSH key for just one repository, added under that repository's **Settings → Deploy keys**. If the robot gets lost, your account is unaffected.

### Sign your commits (optional)

Anyone can set `user.name` to your name and commit. A signature proves it was you, and GitHub shows a **Verified** badge. You can use your existing SSH key:

```bash
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
```

On GitHub, add the same public key again at **Settings → SSH and GPG keys → New SSH key**, this time with **Key type** set to **Signing Key**.

## Keep separate identities

Perhaps you want your personal email on your projects and a different one on work for an employer or placement. Git can switch by folder. Add this to `~/.gitconfig`:

```ini
[user]
    name = Your Name
    email = 12345678+your-username@users.noreply.github.com

[includeIf "gitdir:~/work/"]
    path = ~/.gitconfig-work
```

Then in `~/.gitconfig-work`:

```ini
[user]
    email = you@company.example
```

Any repository below `~/work/` now uses that email. To check, run `git config user.email` inside one.

## Move a repository

- **Rename:** **Settings → General**. GitHub redirects the old address, but update your local copies anyway with `git remote set-url origin` and the new address.
- **Rename the default branch:** under **Settings → Branches**. Then everyone runs:

  ```bash
  git branch -m master main
  git fetch origin
  git branch -u origin/main main
  git remote set-head origin -a
  ```

- **Transfer:** **Settings → General → Danger Zone → Transfer ownership** moves it to another account or an organisation, with its issues, pull requests and stars. A good route when a personal project becomes a society one, as long as you can create repositories there.
- **Archive:** makes a repository read-only and marks it as finished. It's better than deleting: links keep working, and the work stays visible.
- **Delete:** you have 90 days to restore it from **Settings → Repositories → Deleted repositories**, with some exceptions for forks. After that it's gone. If in doubt, archive.

## A checklist for each new project

- Repository created, with a sensible name and visibility
- `.gitignore` in place **before** the first big commit
- README with a photo and how to get started
- Licence, if others should be able to use it
- Description and topics in the About box
- `main` protected, if others work on it too
