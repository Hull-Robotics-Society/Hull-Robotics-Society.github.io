---
title: "Set up Git and your GitHub account"
date: 2026-11-04
excerpt: "Install Git, tell it who you are, secure your GitHub account and connect the two with an SSH key, with defaults that keep you out of trouble later."
level: "Beginner"
duration: "About 45 minutes"
needs:
  - "A laptop you can install software on"
  - "An email address you will still have after you graduate"
  - "A phone or password manager for two-factor authentication"
series: "Git and GitHub"
part: 1
topic: "Git"
tags: ["Git", "GitHub", "SSH"]
aiAssisted: true
---
Most Git tutorials show you `add`, `commit` and `push`, then stop just before things get difficult. This series keeps going: branches that are ahead of and behind `main`, rejected pushes, merge conflicts, undoing mistakes, and working in a GitHub organisation as a member and as an owner.

Every command and message in this series was run on Git 2.56. If your version is older, some wording may differ slightly, but the behaviour is the same.

## How this series is organised

Work through parts 1 to 4 in order if you are new. After that, jump to whatever you need.

**This series explains. The [Git hands-on labs](/tutorials/git-lab-first-repo/) are where you practise.** Once you've finished this page, you can go straight to Lab 1, and come back here to read about anything that puzzles you.

| Part | What it covers | Read it when |
| --- | --- | --- |
| 1 | [Setup](/tutorials/git-setup/) | You are starting out or have a new laptop |
| 2 | [How Git thinks](/tutorials/git-how-it-works/) | Git feels like magic spells |
| 3 | [The everyday loop](/tutorials/git-everyday/) | You want to save and share work |
| 4 | [Branches, merging and rebasing](/tutorials/git-branches/) | You want to work on two things at once |
| 5 | [Ahead, behind and diverged](/tutorials/git-ahead-behind/) | `git status` or GitHub says something confusing |
| 6 | [Merge conflicts](/tutorials/git-conflicts/) | Git has stopped and left markers in your files |
| 7 | [Undoing things](/tutorials/git-undo/) | You have made a mistake or lost work |
| 8 | [Your personal GitHub account](/tutorials/git-personal-github/) | You want to look after your own repositories |
| 9 | [Contributing to an organisation](/tutorials/git-org-member/) | You want to contribute to the society's code |
| 10 | [Running an organisation](/tutorials/git-org-owner/) | You are on the committee or own an organisation |
| 11 | [Power tools](/tutorials/git-power-tools/) | You want a cleaner history and faster debugging |
| 12 | [Command reference and error index](/tutorials/git-reference/) | You have an error message to look up |

## Git and GitHub are different things

**Git** is a program on your computer. It records the history of a folder and works without an internet connection.

**GitHub** is a website that hosts Git repositories and adds things Git doesn't have: pull requests, issues, reviews, permissions and organisations. GitLab and Codeberg do a similar job.

You can use Git without GitHub, but not the other way round. When something goes wrong, working out which of the two is complaining is often half the fix. Messages that start with `remote:` come from GitHub. Everything else comes from Git on your machine.

## Step 1: Install Git

Pick your system, then check that it worked.

```bash
# Ubuntu, Debian
sudo apt install git

# Fedora
sudo dnf install git

# Arch
sudo pacman -S git

# macOS (or use: brew install git)
xcode-select --install

# Windows, in PowerShell (or use the installer from git-scm.com)
winget install --id Git.Git -e
```

```bash
git --version
```

On Windows, the install also gives you **Git Bash**. Use it for this series, because every example is written for a Bash-style terminal.

## Step 2: Create your GitHub account

Sign up at [github.com](https://github.com). A few choices here are worth a moment's thought:

- **Username:** it appears in your profile address and on all your work, and employers will see it. Pick something you'll be happy with in five years. You can change it later, but old links to your profile stop working.
- **Primary email:** use a personal address. Add your university address as a second email, so you can still use the account after your university address stops working. Losing access to the only email on an account is a common way to lose the account.
- **Student benefits:** with a university email you can apply for the [GitHub Student Developer Pack](https://education.github.com/pack).

### Turn on two-factor authentication

Go to **Settings → Password and authentication → Two-factor authentication**. GitHub requires this for accounts that contribute code, and the society's repositories count, so do it now.

An authenticator app or a passkey both work well. **Download your recovery codes and store them somewhere other than your phone.** Without your second factor and without those codes, you can permanently lose access to your account.

## Step 3: Tell Git who you are

Every commit records a name and an email address. Git stamps them on your work permanently, so set them before your first commit.

```bash
git config --global user.name "Your Name"
```

If you are happy for your email address to be public, you can use it directly. Most people shouldn't, because anyone can read the address on a public commit. GitHub gives you a private alternative:

1. Go to **Settings → Emails**.
2. Tick **Keep my email addresses private**.
3. Tick **Block command line pushes that expose my email**.
4. Copy the address shown there. It looks like `12345678+your-username@users.noreply.github.com`.

```bash
git config --global user.email "12345678+your-username@users.noreply.github.com"
```

GitHub links a commit to your profile by matching this email, so if your commits show a grey silhouette instead of your picture, this setting is the first thing to check.

To see what Git has, and which file each setting came from:

```bash
git config --list --show-origin
```

## Step 4: Set sensible defaults

These settings prevent most of the problems in part 5. Run them once and forget about them.

```bash
# New repositories start on a branch called main
git config --global init.defaultBranch main

# Never make a surprise merge or rebase when pulling. Stop and let me decide.
git config --global pull.ff only

# The first push of a new branch just works, with no --set-upstream needed
git config --global push.autoSetupRemote true

# Forget remote branches that were deleted on GitHub
git config --global fetch.prune true

# Show the common ancestor in merge conflicts, which makes them easier to read
git config --global merge.conflictStyle zdiff3

# A readable picture of your history: git lg
git config --global alias.lg "log --oneline --graph --decorate --all"
```

Line endings differ between systems, and mismatches make whole files look changed. Set one of these:

```bash
# Linux and macOS
git config --global core.autocrlf input

# Windows
git config --global core.autocrlf true
```

Finally, choose the editor Git opens when it needs you to write a commit message. If you don't, you may land in Vim with no idea how to leave. (If that happens: press `Esc`, type `:wq` and press Enter.)

```bash
# VS Code
git config --global core.editor "code --wait"

# nano
git config --global core.editor "nano"
```

> `pull.ff only` makes `git pull` stop with an error when your branch and GitHub's have both moved on. That is deliberate. Part 5 explains [what to do when it stops](/tutorials/git-ahead-behind/#diverged-from-your-upstream), and it's far easier than untangling a merge you didn't know had happened.

## Step 5: Connect your computer with an SSH key

GitHub stopped accepting account passwords for Git operations in 2021. If you use one, you get this:

```text
remote: Support for password authentication was removed on August 13, 2021.
```

An SSH key is the simplest replacement. It's a pair of files: a **private key** that stays on your laptop and a **public key** you give to GitHub. Create the pair:

```bash
ssh-keygen -t ed25519 -C "your-laptop-name"
```

Press Enter to accept the default location, then choose a passphrase. The passphrase protects the key if your laptop is ever stolen.

Now add the key to the SSH agent, so you don't have to type the passphrase every time:

```bash
# Linux and Git Bash on Windows
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# macOS
eval "$(ssh-agent -s)"
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
```

Print the **public** key, the file ending in `.pub`:

```bash
cat ~/.ssh/id_ed25519.pub
```

On GitHub, go to **Settings → SSH and GPG keys → New SSH key**, give it a name like "Personal laptop", paste the key and save.

Test the connection:

```bash
ssh -T git@github.com
```

The first time, SSH asks if you trust `github.com`. Check that the fingerprint matches [the ones GitHub publishes](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints), then type `yes`. Success looks like this, and the part about shell access is normal:

```text
Hi your-username! You've successfully authenticated, but GitHub does not provide shell access.
```

> **Never share or commit the file without `.pub`.** Anyone who has your private key can act as you. Each computer should have its own key, so that if you lose a laptop, you delete one key from GitHub and everything else keeps working.

### SSH or HTTPS addresses

Every repository has two addresses. With SSH set up, use the SSH one:

```text
git@github.com:Hull-Robotics-Society/Dalek.git       SSH
https://github.com/Hull-Robotics-Society/Dalek.git   HTTPS
```

If you cloned with the wrong one, you can switch without cloning again:

```bash
git remote set-url origin git@github.com:OWNER/REPO.git
```

### If SSH is blocked

Some networks block SSH's usual port, and you get a timeout on `ssh -T git@github.com`. GitHub also accepts SSH on port 443. Add this to `~/.ssh/config`:

```text
Host github.com
    Hostname ssh.github.com
    Port 443
    User git
```

You could also use HTTPS with the GitHub CLI below, which stores a login token for Git.

## Step 6: Install the GitHub CLI (optional)

`gh` lets you create repositories and pull requests from the terminal. It's optional, and this series always shows the website route too. [Install it](https://cli.github.com), then log in:

```bash
gh auth login
```

Choose GitHub.com, then SSH, and follow the prompts.

## Check everything works

Run this in a terminal. It clones this website's public repository, then shows where you are and its history.

```bash
git clone git@github.com:Hull-Robotics-Society/Hull-Robotics-Society.github.io.git
cd Hull-Robotics-Society.github.io
git status
git lg
```

If `git status` says `On branch main` and `git lg` draws a history, you are ready. You can delete the folder afterwards: it's only a copy.

| What you see | What it means |
| --- | --- |
| `Permission denied (publickey)` | GitHub doesn't recognise your key. Check `ssh-add -l` lists it and that the `.pub` file is on your GitHub account. |
| `command not found: git` | Git isn't installed, or the terminal was opened before it was installed. Open a new one. |
| `Author identity unknown` | You skipped step 3. |
