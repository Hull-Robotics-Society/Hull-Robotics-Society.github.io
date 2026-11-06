---
title: "Git command reference and error index"
date: 2026-11-04
excerpt: "Every command from the series on one page, plus an index of error messages with what they mean and how to fix them. Search it with Ctrl+F, or paste your error into the site search."
level: "Beginner"
duration: "Keep it handy"
needs:
  - "Nothing: this page is for looking things up"
series: "Git and GitHub"
part: 12
topic: "Git"
tags: ["Git", "Reference", "Errors"]
aiAssisted: true
---
The shortest possible version of the series. Each section links to the part that explains it. Your first stop when stuck is always:

```bash
git status
git lg
git reflog
```

None of those change anything. `git lg` is the alias from [part 1](/tutorials/git-setup/#step-4-set-sensible-defaults).

## The whole pipeline

```bash
git fetch upstream                                       # 1. see what's new
git switch -c feature/arm --no-track upstream/main       # 2. branch (with write access: pull, then switch -c)
git status                                               # 3. work, and check
git add -p                                               # 4. stage what belongs together
git diff --staged                                        # 5. read it
git commit -m "Add arm limits"                           # 6. record it
git fetch upstream                                       # 7. check for changes on main
git rebase upstream/main                                 # 8. update, if needed
git push -u origin HEAD                                  # 9. share, then open a pull request
# 10. checks pass, review, merge
git switch main                                          # 11. tidy up
git fetch --all --prune
git merge --ff-only upstream/main
git push origin main
git branch -d feature/arm
```

## Set up

From [part 1](/tutorials/git-setup/).

| Command | What it does |
| --- | --- |
| `git config --global user.name "Name"` | Set your name |
| `git config --global user.email "email"` | Set your email |
| `git config --list --show-origin` | Show all settings, and where they come from |
| `git init` | Make this folder a repository |
| `git clone URL` | Copy a repository |
| `git clone --recurse-submodules URL` | Copy one with its submodules |
| `ssh-keygen -t ed25519` | Create an SSH key |
| `ssh -T git@github.com` | Test your connection to GitHub |

## Look around

These change nothing. From [part 3](/tutorials/git-everyday/#read-the-history).

| Command | What it does |
| --- | --- |
| `git status` | Branch, ahead and behind, changed files |
| `git status --short --branch` | The same, briefly |
| `git diff` | Changes not yet staged |
| `git diff --staged` | Changes staged for the next commit |
| `git diff main...feature` | What `feature` changed since it branched |
| `git log --oneline --graph --all` | The whole history as a graph |
| `git log -p FILE` | One file's history, with its changes |
| `git log -S"text"` | Commits that added or removed this text |
| `git log --grep="word"` | Search commit messages |
| `git show HASH` | One commit |
| `git show HEAD:FILE` | A file as it is in a commit |
| `git blame FILE` | Who last changed each line |
| `git reflog` | Everywhere `HEAD` has been |
| `git branch -vv` | Branches, their upstreams, ahead and behind |
| `git remote -v` | Remotes and their addresses |

## Save your work

From [part 3](/tutorials/git-everyday/).

| Command | What it does |
| --- | --- |
| `git add FILE` | Stage a file |
| `git add -p` | Stage piece by piece |
| `git add -A` | Stage everything |
| `git commit -m "message"` | Commit what's staged |
| `git commit -am "message"` | Stage all tracked changes, then commit |
| `git commit --amend` | Replace the last commit |
| `git rm FILE` | Delete a file and stage that |
| `git rm --cached FILE` | Stop tracking, keep the file |
| `git mv OLD NEW` | Rename, and stage that |

## Branch

From [part 4](/tutorials/git-branches/).

| Command | What it does |
| --- | --- |
| `git switch NAME` | Move to a branch |
| `git switch -c NAME` | Create a branch and move to it |
| `git switch -c NAME --no-track upstream/main` | Start from the organisation's `main` |
| `git switch -` | Back to the previous branch |
| `git branch -m NEW` | Rename the current branch |
| `git branch -d NAME` | Delete a merged branch |
| `git branch -D NAME` | Delete a branch regardless |
| `git branch --merged main` | Branches already in `main` |
| `git merge NAME` | Merge a branch into this one |
| `git merge --ff-only NAME` | Merge only if it's a fast-forward |
| `git merge --abort` | Back out of a merge |
| `git rebase NAME` | Replay this branch on top of another |
| `git rebase --continue` | Carry on after fixing a conflict |
| `git rebase --abort` | Back out of a rebase |
| `git rebase --onto NEW OLD` | Move commits after `OLD` onto `NEW` |
| `git cherry-pick HASH` | Copy one commit here |

## Share

From [part 3](/tutorials/git-everyday/#share-your-work) and [part 5](/tutorials/git-ahead-behind/).

| Command | What it does |
| --- | --- |
| `git remote add NAME URL` | Add a remote |
| `git remote set-url origin URL` | Change a remote's address |
| `git fetch` | Update your memory of the remote (always safe) |
| `git fetch --all --prune` | The same for all remotes, forgetting deleted branches |
| `git pull` | Fetch, then update this branch |
| `git pull --rebase` | Fetch, then replay your commits on top |
| `git pull --no-rebase` | Fetch, then make a merge commit |
| `git fetch upstream` | Update your memory of the organisation, from a fork |
| `git merge upstream/main` | Sync your fork's branch with the organisation's `main` |
| `git rebase upstream/main` | The same, replaying your commits on top |
| `git push` | Send commits |
| `git push -u origin HEAD` | First push of a new branch |
| `git push --force-with-lease` | Replace your branch after rewriting it |
| `git push origin --delete NAME` | Delete a branch on GitHub |
| `git branch -u origin/NAME` | Set this branch's upstream |
| `git branch --unset-upstream` | Remove this branch's upstream |
| `git rev-list --left-right --count A...B` | Count commits only on A and only on B |
| `git log --oneline @{u}..HEAD` | Commits you haven't pushed |
| `git log --oneline HEAD..@{u}` | Commits you haven't pulled |

### Sync a branch on a fork with the organisation's main

[Part 9 explains this](/tutorials/git-org-member/#sync-your-branch-with-the-organisations-main). `git status` won't show this, so check with `rev-list`. The first number should end up as 0.

```bash
git switch feature/arm
git fetch upstream
git rev-list --left-right --count upstream/main...HEAD
git merge upstream/main
git push
```

Or, if the branch is only yours, replace the last two lines with these:

```bash
git rebase upstream/main
git push --force-with-lease
```

## Undo

From [part 7](/tutorials/git-undo/).

| Command | What it does |
| --- | --- |
| `git restore FILE` | Throw away edits (**permanent**) |
| `git restore --staged FILE` | Unstage, keep the edits |
| `git restore --source=HASH FILE` | Get a file from an old commit |
| `git reset --soft HEAD~1` | Undo a commit, keep it staged |
| `git reset HEAD~1` | Undo a commit, keep the edits |
| `git reset --hard HEAD~1` | Undo a commit and its edits |
| `git reset --hard HEAD@{1}` | Go back to where you just were |
| `git revert HASH` | New commit that undoes an old one |
| `git revert -m 1 HASH` | The same, for a merge commit |
| `git stash push -u -m "note"` | Set work aside |
| `git stash list` | See what's set aside |
| `git stash pop` | Bring it back, and remove it |
| `git clean -nd` | Preview deleting untracked files |
| `git clean -fd` | Delete untracked files (**permanent**) |

## Conflicts

From [part 6](/tutorials/git-conflicts/).

| Command | What it does |
| --- | --- |
| `git diff --name-only --diff-filter=U` | List conflicted files |
| `git restore --ours FILE` | Take our side |
| `git restore --theirs FILE` | Take their side |
| `git add FILE` | Mark as resolved |
| `git diff --check --cached` | Check for leftover markers |
| `git merge --continue` | Finish the merge |
| `git mergetool` | Open your merge tool |

## Power tools

From [part 11](/tutorials/git-power-tools/).

| Command | What it does |
| --- | --- |
| `git rebase -i HEAD~3` | Edit your last three commits |
| `git commit --fixup HASH` | Mark a commit to be folded in later |
| `git rebase -i --autosquash BASE` | Fold in those commits |
| `git bisect start` | Begin searching for a bad commit |
| `git bisect run COMMAND` | Search automatically |
| `git worktree add ../DIR -b NAME` | Second folder on a new branch |
| `git submodule update --init --recursive` | Fetch submodules |
| `git lfs track "*.stl"` | Store this file type with LFS |
| `git tag -a v1.0.0 -m "note"` | Tag this commit |
| `git push origin v1.0.0` | Push a tag |
| `git clone --depth 1 URL` | Clone only the latest commit |

## GitHub CLI

Optional. From [part 1](/tutorials/git-setup/#step-6-install-the-github-cli-optional).

| Command | What it does |
| --- | --- |
| `gh auth login` | Log in |
| `gh repo create NAME --private` | Make a repository |
| `gh repo fork OWNER/REPO --clone` | Fork and clone, with remotes set up |
| `gh pr create` | Open a pull request |
| `gh pr status` | Your pull requests |
| `gh pr checks` | The checks on this branch's pull request |
| `gh pr checkout 123` | Get someone's pull request |
| `gh release create v1.0.0` | Make a release |

## Error index

Find the first line that looks like yours. Paste your error into the site's search too.

### Pushing

| Message | Meaning | Fix |
| --- | --- | --- |
| `! [rejected] (fetch first)` | GitHub has commits you don't | [Pull them in first](/tutorials/git-ahead-behind/#someone-else-pushed) |
| `! [rejected] (non-fast-forward)` | Someone pushed, or you rebased | [Find out which](/tutorials/git-ahead-behind/#diverged-from-your-upstream) |
| `! [rejected] (stale info)` | Someone pushed since your last fetch | [Fetch and look](/tutorials/git-ahead-behind/#you-rewrote-your-own-history) |
| `fatal: The current branch X has no upstream branch` | First push of this branch | [`git push -u origin X`](/tutorials/git-ahead-behind/#the-current-branch-has-no-upstream-branch) |
| `fatal: The upstream branch of your current branch does not match` | Tracking the wrong branch | [Unset and push to your fork](/tutorials/git-ahead-behind/#your-branch-tracks-the-wrong-upstream) |
| `error: src refspec main does not match any` | No such branch here | [Check the name](/tutorials/git-ahead-behind/#src-refspec-main-does-not-match-any) |
| `remote: error: GH001: Large files detected` | A file over 100 MiB | [Take it out of your commits](/tutorials/git-undo/#you-committed-a-huge-file) |
| `remote: error: GH006: Protected branch update failed` | Pushed straight to protected `main` | [Move your commits to a branch](/tutorials/git-ahead-behind/#you-committed-to-main-by-mistake) |
| `remote: error: GH007: Your push would publish a private email address` | Your real email is on a commit | [Fix your email and the commit](/tutorials/git-undo/#wrong-name-or-email-on-a-commit) |
| `remote: error: GH013: Repository rule violations found` | A ruleset refused it | Read the next lines for which rule. For secrets, see [leaked secrets](/tutorials/git-undo/#you-pushed-a-password-or-key). |

### Pulling and merging

| Message | Meaning | Fix |
| --- | --- | --- |
| `fatal: Not possible to fast-forward, aborting` | Both sides have moved | [Choose rebase or merge](/tutorials/git-ahead-behind/#someone-else-pushed) |
| `fatal: Need to specify how to reconcile divergent branches` | The same, without `pull.ff` set | [Choose rebase or merge](/tutorials/git-ahead-behind/#someone-else-pushed) |
| `Your local changes ... would be overwritten by merge` | Uncommitted edits in the way | [Commit or stash](/tutorials/git-ahead-behind/#behind-your-upstream) |
| `Your local changes ... would be overwritten by checkout` | The same, when switching | [Commit or stash](/tutorials/git-undo/#set-work-aside-with-git-stash) |
| `CONFLICT (content): Merge conflict in FILE` | Same lines changed on both sides | [Resolve it](/tutorials/git-conflicts/#resolve-it) |
| `CONFLICT (modify/delete)` | Edited on one side, deleted on the other | [Keep or delete it](/tutorials/git-conflicts/#a-file-was-deleted-on-one-side) |
| `warning: Cannot merge binary files` | STL, image or similar | [Pick one version](/tutorials/git-conflicts/#binary-files-stl-cad-images) |
| `fatal: refusing to merge unrelated histories` | Two separate starting points | [Allow it once](/tutorials/git-ahead-behind/#refusing-to-merge-unrelated-histories) |
| `no such ref was fetched` | The branch was deleted on GitHub | [Upstream gone](/tutorials/git-ahead-behind/#the-upstream-is-gone) |
| `error: You have not concluded your merge` | You're in the middle of a merge | Finish it with `git merge --continue`, or `git merge --abort` |
| `error: Pulling is not possible because you have unmerged files` | A conflict is still open | [Resolve it](/tutorials/git-conflicts/#resolve-it) or abort |
| `error: cannot pull with rebase: You have unstaged changes` | Uncommitted edits | Commit or stash, or use `git pull --rebase --autostash` |

### Status and branches

| Message | Meaning | Fix |
| --- | --- | --- |
| `Your branch is ahead of 'origin/X' by N commits` | You have unpushed commits | [Push, or check you're on the right branch](/tutorials/git-ahead-behind/#ahead-of-your-upstream) |
| `Your branch is behind 'origin/X' by N commits` | GitHub has more | [`git pull`](/tutorials/git-ahead-behind/#behind-your-upstream) |
| `Your branch and 'origin/X' have diverged` | Both have moved | [Find out why](/tutorials/git-ahead-behind/#diverged-from-your-upstream) |
| `Your branch is based on 'origin/X', but the upstream is gone` | Deleted on GitHub | [Delete or push again](/tutorials/git-ahead-behind/#the-upstream-is-gone) |
| `HEAD detached at HASH` | You aren't on a branch | [Switch back](/tutorials/git-undo/#detached-head) |
| `error: the branch 'X' is not fully merged` | Possibly a squash merge | [Check, then use `-D`](/tutorials/git-ahead-behind/#after-a-squash-merge) |
| `fatal: invalid reference: X` | No such branch to switch to | Check `git branch -a`. Run `git fetch`, or add `-c` to create it. |
| `fatal: a branch named 'X' already exists` | That name is taken | Choose another, or `git switch X` |
| `error: cannot delete branch 'X' used by worktree at PATH` | It's checked out, here or in a worktree | Switch away first, or remove the worktree |
| `interactive rebase in progress` | A rebase is under way | [Continue or abort](/tutorials/git-conflicts/#conflicts-during-a-rebase) |

### Access and setup

| Message | Meaning | Fix |
| --- | --- | --- |
| `Permission denied (publickey)` | GitHub doesn't recognise your SSH key | [Set up your key](/tutorials/git-setup/#step-5-connect-your-computer-with-an-ssh-key) |
| `ERROR: Permission to OWNER/REPO.git denied to you` | No write access | [Use a fork](/tutorials/git-org-member/#the-fork-workflow) |
| `ERROR: Repository not found` | Wrong address, or private with no access | Check `git remote -v` |
| `remote: Support for password authentication was removed` | Passwords don't work for Git | [Use an SSH key](/tutorials/git-setup/#step-5-connect-your-computer-with-an-ssh-key) |
| `Host key verification failed` | SSH doesn't trust `github.com` yet | Run `ssh -T git@github.com` and check the fingerprint |
| `ssh: connect to host github.com port 22: Connection timed out` | The network blocks SSH | [Use port 443](/tutorials/git-setup/#if-ssh-is-blocked) |
| `Author identity unknown` | No name or email set | [Set your identity](/tutorials/git-setup/#step-3-tell-git-who-you-are) |
| `fatal: not a git repository` | You're in the wrong folder | `cd` into the project |
| `error: remote origin already exists` | The name is taken | `git remote set-url origin URL` |
| `fatal: pathspec 'X' did not match any files` | No such file, or the wrong folder | Check the spelling and where you are |
| `nothing to commit, working tree clean` | There's nothing to commit | Check you saved the file and it isn't ignored |
| `fatal: Unable to create '.../.git/index.lock': File exists` | Git crashed, or is running elsewhere | Close other Git tools. If none are running, delete that file. |

### Stuck in an editor

| What you see | How to get out |
| --- | --- |
| Vim, with `~` down the side | `Esc`, then `:wq` and Enter to save, or `:cq` and Enter to cancel |
| nano | `Ctrl+O`, Enter, then `Ctrl+X` |
| `(END)` at the bottom | That's the pager. Press `q`. |
