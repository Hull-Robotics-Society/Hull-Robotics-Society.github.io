---
title: "Run a GitHub organisation as an owner"
date: 2026-11-04
excerpt: "Roles, teams and base permissions, protecting main, safe settings for Actions and secrets, onboarding and offboarding members, and handing a student organisation to next year's committee."
level: "Advanced"
duration: "About 60 minutes"
needs:
  - "Experience of contributing through pull requests (part 9)"
  - "Owner access to an organisation, or a free test organisation of your own"
series: "Git and GitHub"
part: 10
topic: "Git"
tags: ["GitHub", "Organisations", "Administration"]
aiAssisted: true
---
Owners can do anything to everything in the organisation, including deleting it. In a student society, the group changes every year, and the people who set things up will graduate. So the aim is to leave an organisation that's safe and that next year's committee can understand.

> **Practise first.** Organisations are free. Create a test one at **+ → New organization** and try these settings there. You don't want to find out what a setting does on the live one.

Menus below are under the organisation's **Settings** unless they say otherwise. GitHub moves things occasionally, so if something isn't where this page says, look it up in [GitHub's documentation](https://docs.github.com/en/organizations).

## Who can do what

### Organisation roles

These are about the organisation as a whole:

| Role | What they can do |
| --- | --- |
| **Owner** | Everything, including admin access to every repository. GitHub advises having at least two. |
| **Member** | The default. Can create repositories and projects, unless you turn that off. |
| **Moderator** | A member who can also block non-members, limit interactions and hide comments on public repositories. |
| **Billing manager** | Manages billing, with no access to code. |
| **Security manager** | Sees security alerts and manages security settings everywhere, with read access to all repositories. |
| **GitHub App manager** | Manages the settings of the organisation's GitHub Apps. |
| **Outside collaborator** | Not a member: has access only to the repositories they're invited to. |

### Repository roles

Access to each repository is one of **Read, Triage, Write, Maintain** or **Admin**. [Part 9 lists them](/tutorials/git-org-member/#what-you-can-do-depends-on-your-role). A person's access comes from up to three places, and **the highest one wins**:

1. The organisation's **base permission**, for all members.
2. Any **team** they're on that has access to the repository.
3. A direct invitation to the repository.

So you can't use a team to give someone less than the base permission. Set the base low, and grant more through teams.

### A sensible setup for a society

| Who | Role | Why |
| --- | --- | --- |
| President, plus one or two technical committee members | Owner | Two at the very least, so that nobody's a single point of failure |
| Everyone else | Member | No admin powers |
| Base permission | Read | Everyone can read and fork, and nobody can push by accident |
| Team for each project | Write on its repositories | The people on the Dalek can push to the Dalek |
| Project leads | Maintain, or Admin on their repository | They can run their own project |
| Someone helping with one repository | Outside collaborator, or fork | They don't need to be a member |

Set the base at **Member privileges → Base permissions**. The options are **No permission**, **Read**, **Write** and **Admin**. Avoid Admin, and think twice about Write: it lets any member push to any repository that doesn't have a protected branch.

> **Owner is not a reward.** Being on the committee, or being the most experienced, doesn't mean someone needs it. Fewer owners means fewer accounts that can do serious damage if compromised.

## Teams

Create them under the organisation's **Teams** tab. A team has members and a set of repositories, each with a role. They're worth using, even with few people:

- When someone joins or leaves a project, you change one list, not ten repositories.
- `@Hull-Robotics-Society/dalek` notifies everyone on the team, and a team can be asked to review.
- Teams can be nested: a child team inherits the parent's access.
- A team can have maintainers, so project leads can look after their own team without any owner rights.

Grant a team access on the team's **Repositories** tab, or in a repository's **Settings → Collaborators and teams**. Name teams after what they do, like `dalek` or `website`. Avoid year-specific names like `committee-2026`.

## People

### Add members

**People → Invite member**, then choose **Member** or **Owner** and their teams. Invite by GitHub username rather than email if you can, to be sure you've got the right person. Invitations expire after seven days.

Decide who gets in. A sensible rule is that anyone who has joined the society and made a first contribution can be a member, while a public repository already lets anyone else contribute by fork.

### Require two-factor authentication

Turn this on at **Authentication security → Require two-factor authentication for everyone in your organization**. GitHub already requires it for most code contributors, but this enforces it.

Before pressing it, see who hasn't got it: the **People** page can filter on this. Members without it lose access to the organisation's resources until they turn it on. **Outside collaborators without it are removed,** along with their forks of private repositories. They can be reinstated within three months if they turn it on. So warn people a week ahead.

### Member privileges

At **Member privileges**, go through these:

| Setting | Suggestion | Why |
| --- | --- | --- |
| Base permissions | Read | See above |
| Repository creation | Allow, public only if you've no private projects | Students should be able to start things, though tidy up each year |
| Repository forking (private) | Off, unless needed | Forks of private code outlive membership |
| Allow members to delete or transfer repositories | **Off** | Only owners should be able to do this |
| Allow members to change repository visibility | **Off** | Stops private work going public by accident |
| Pages creation | Public only | |

### When someone leaves

Finishing the degree doesn't mean someone has to go: alumni are often the most useful people to ask. But go through membership each summer:

- **People → Remove from organization** for anyone who's no longer active. Their forks of public repositories stay theirs, and their commits and history stay in place. Forks of private repositories are deleted.
- Anyone leaving under a cloud: remove them at once, then change any secrets they could read.
- Move their open pull requests and issues to someone else.
- If they're still helping on one project, **Convert to outside collaborator** keeps just that access.

## Protect main

The most valuable setting you have. Without it, anyone with write access can push straight to `main`, force push over it or delete it. This website's `main` is protected.

There are two systems: **rulesets** (the newer one) and **branch protection rules** (the older one). They work together, and the stricter rule wins. Rulesets are the better choice for new setups, since anyone with read access can see the rules. They can also be switched off without being deleted.

In the repository's **Settings → Rules → Rulesets → New ruleset → New branch ruleset**:

1. Give it a name, such as `Protect main`, and set **Enforcement status** to **Active**.
2. Under **Target branches**, press **Add target → Include default branch**.
3. Tick these rules:

| Rule | Set it to | Why |
| --- | --- | --- |
| **Restrict deletions** | On | Nobody deletes `main` by accident |
| **Block force pushes** | On | Nobody overwrites history |
| **Require a pull request before merging** | On, with 1 required approval | Everything gets a second pair of eyes |
| **Dismiss stale pull request approvals when new commits are pushed** | On | An approval covers what was reviewed, not what came later |
| **Require approval of the most recent reviewable push** | Optional | Someone other than the last pusher must approve |
| **Require all comments to be resolved** (it may read "conversation resolution") | Optional | No comments are left unanswered |
| **Require status checks to pass before merging** | On, once you have checks | Broken builds can't merge |
| **Require branches to be up to date before merging** | Usually off | When on, each merge makes every other open pull request need updating |
| **Require linear history** | Optional | Blocks merge commits, so squash or rebase only |
| **Require signed commits** | Usually off | A barrier for newcomers, with little benefit here |

For a status check, you enter the job's name. This site's is `Content check and build`, from `name:` in [check.yml](https://github.com/Hull-Robotics-Society/Hull-Robotics-Society.github.io/blob/main/.github/workflows/check.yml). A check has to have run at least once before GitHub can suggest its name.

4. Under **Bypass list**, add as few as possible. Bear in mind that if a rule is blocking everyone during an emergency, an owner can always change the ruleset.

**Plans:** on the free organisation plan, these rules work on **public** repositories. Protecting private repositories, and using code owners on them, needs a paid plan. Applying one ruleset across the whole organisation needs Enterprise, so on the free plan, set them up repository by repository. See [GitHub's plans](https://docs.github.com/en/get-started/learning-about-github/githubs-plans) for what's current.

**A small team's trap:** one required approval means someone else must be around. Make sure at least two people on each project have write access, or pull requests will sit there until someone notices.

### Merge settings

At the repository's **Settings → General → Pull Requests**:

- Choose which merge buttons to offer. Squash is a good default for a beginner-heavy project, as it keeps `main` readable no matter how messy the branch was. Allow fewer options rather than more, so that everyone does the same thing.
- **Automatically delete head branches:** turn on, so merged branches don't pile up.
- **Always suggest updating pull request branches:** turn on, so people see the **Update branch** button.

### Code owners

A `CODEOWNERS` file automatically asks the right people to review. Put it in `.github/`, the root or `docs/`:

```text
# The last matching line wins
*                       @Hull-Robotics-Society/committee
/src/content/tutorials/ @Hull-Robotics-Society/website
/.github/workflows/     @Hull-Robotics-Society/owners
```

Owners must have write access to the repository, and a team must be visible. Add **Require review from code owners** to the ruleset, and their approval becomes mandatory. It's useful for workflows, where a change can affect everything.

## Community files for every repository

A public repository named `.github` in the organisation supplies defaults for any repository that lacks its own. The society already has one, and it contains the organisation's front page at `profile/README.md`. You can add:

| File | Purpose |
| --- | --- |
| `profile/README.md` | Shown on the organisation's front page |
| `CONTRIBUTING.md` | How to contribute, linked when someone opens a pull request |
| `CODE_OF_CONDUCT.md` | Expected behaviour |
| `SECURITY.md` | How to report a vulnerability privately |
| `SUPPORT.md` | Where to ask for help |
| `.github/ISSUE_TEMPLATE/` | Forms for issues |
| `.github/PULL_REQUEST_TEMPLATE.md` | Starting text for each pull request |

A simple pull request template gets you better pull requests from everyone:

```markdown
## What and why

## How I tested it

## Checklist
- [ ] No secrets, large recordings or generated files
- [ ] Docs updated if behaviour changed
```

Licences can't be defaults: each repository needs its own.

## GitHub Actions and secrets

Workflows run code with access to your repository, so review changes to `.github/workflows/` like you would anything else that could do damage.

At **Actions → General** for the organisation (and each repository):

- **Workflow permissions:** set the default to **Read repository contents and packages permissions**. Workflows that need more can ask for it. This site's check does this with `permissions: contents: read`.
- **Fork pull request workflows:** require approval for first-time contributors at the least. Before you press **Approve workflows to run**, read any change to `.github/workflows/`.
- **Allowed actions:** consider limiting these to actions from GitHub and verified creators.

For secrets:

- Keep them at **Secrets and variables → Actions**, never in code. You can't read a secret back, so note who created it and where it came from.
- Give each secret to as few repositories as you can.
- Change them when someone with access leaves.
- Workflows from forks don't receive secrets by default. **Don't use the `pull_request_target` trigger** to get round this unless you know exactly what it does: it can hand your secrets to a stranger's code.

Also turn on these for each repository, at **Settings → Advanced Security**: Dependabot alerts, secret scanning and push protection.

## Third-party access

- **Third-party access → OAuth application policy:** restrict it, so apps can't reach organisation data until an owner has approved them.
- **Personal access tokens:** set a policy, and require approval for fine-grained tokens if you can, or at least set a maximum lifetime.
- **GitHub Apps:** go through them each year, and uninstall anything nobody recognises.

Use a **deploy key** for a single robot or server, not somebody's personal token. When a person's account is what's powering something, it stops working when they leave. For automation at the organisation level, use a GitHub App or a dedicated machine account with limited access.

## Look after the repositories

- **Archive** finished projects at **Settings → General → Danger Zone**. They become read-only and stay findable. It's better than deleting.
- **Rename** the default branch for consistency if you like. Two of the society's repositories still use `master`, and there's no rush, as nothing's wrong with it. If you do it, GitHub retargets open pull requests, but [everyone has to update their clones](/tutorials/git-personal-github/#move-a-repository).
- **Transfer** a repository in from someone's personal account when a project becomes a society one. **Check the licence first**, and ask everyone who contributed if it's going to change. A transfer keeps redirects, issues and stars.
- **Pin** your six best repositories on the organisation's front page, via **Customize pins**.
- **Topics and descriptions** on every repository make the organisation easy to browse.
- **Licences:** a repository without one can't legally be reused. Go through them and add one.

### Things that are hard to undo

| Action | Can you undo it? |
| --- | --- |
| Deleting a repository | Within 90 days at **Deleted repositories**, unless it's in a fork network with other active repositories. Team permissions don't come back. |
| Renaming the organisation | Old links stop working in time, and all automation needs updating. Don't, unless you must. |
| Removing a member | Mostly: reinvite them. Their teams and private forks can be reinstated if you do it within three months. |
| Making a private repository public | Not really. Anyone may have copied it. Secrets in its history count as leaked. |
| Force pushing over `main` | Sometimes, from a teammate's clone or the reflog on the machine that pushed. |
| Deleting the organisation | Treat it as permanent. |

## Handing over to next year's committee

Student organisations fail here. Someone graduates, the only owner's gone, and nobody can change anything. Getting an organisation back from GitHub after losing all its owners is slow and may not work. Add this to your AGM checklist:

**Before the AGM**

- [ ] At least two owners remain who aren't graduating this year.
- [ ] The incoming President and a technical member have accounts with two-factor on, and recovery codes stored.
- [ ] The organisation's contact and billing email is a society address that passes on with the committee, not someone's personal one.
- [ ] The README or a wiki explains what each repository is, how the site is deployed, and where secrets are used.

**At handover**

- [ ] Make the new owners owners, and check they can open **Settings**.
- [ ] Walk them through the rulesets and how the website gets published, and have them merge a real pull request.
- [ ] Hand over anything outside GitHub that the repositories rely on, such as domain names, API accounts and Discord webhooks.
- [ ] Change any secrets the outgoing committee created that were personal to them.

**After handover**

- [ ] Outgoing owners step down to member, or leave if they prefer.
- [ ] Review **People**, **Teams**, outside collaborators and apps, and remove anyone no longer involved.
- [ ] Archive dead repositories.
- [ ] Check that automation running on a former member's token still works, and replace it.
- [ ] Update `src/data/committee.json` on this website.

Don't create a shared "committee" login. Passwords and two-factor on shared accounts are hard to keep safe, nobody can tell who did what, and it goes wrong when someone leaves. Each person uses their own account.

## Keeping an eye on things

The **Audit log** (**Logs → Audit log**) records who did what, when: invitations, role changes, deleted repositories and more. Check it when something changes unexpectedly.

A short yearly check:

- [ ] Fewer than five owners, and all of them still active
- [ ] Two-factor required
- [ ] Base permission still set to what you want
- [ ] `main` protected on repositories people actively use
- [ ] No unknown apps or tokens
- [ ] Dependabot alerts dealt with

## In an emergency

**Someone's account has been compromised, or a secret has leaked:**

1. Remove the person from the organisation, or demote them. You can add them back later.
2. Change any secrets they could read, starting with whatever can reach outside GitHub.
3. Read the audit log and recent pushes.
4. Check for new workflows, deploy keys, webhooks and apps. Attackers add these so they can come back.
5. Revert anything bad, then let everyone know what happened.

**Someone force-pushed over `main`, or it's been damaged:** anyone who pulled recently has the old commits. Find the last good commit in a clone, or in the old hash shown in the repository's **Activity** view. Then an owner temporarily disables the rule, restores `main`, and turns the rule back on. Afterwards, ask how it was possible, and protect it.

```bash
git push origin 5e825b1:main --force-with-lease
```

**A repository's been deleted:** restore it at **Deleted repositories**. GitHub may take up to an hour to list it, and you'll need to reapply team access.
