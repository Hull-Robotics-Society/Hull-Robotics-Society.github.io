#!/usr/bin/env bash
# Builds the practice repository used by the "Git hands-on labs" tutorials: a pretend robot called
# Scout, with teammates' branches set up to merge cleanly or conflict on purpose.
# Used once to create Hull-Robotics-Society/git-practice, and kept so it can be rebuilt.
#
#   bash scripts/seed-git-practice.sh ../git-practice
#
# Dates and names are fixed, so every run gives the same commits. Nothing is pushed.
set -euo pipefail

target="${1:?Usage: seed-git-practice.sh <new folder>}"
if [ -e "$target" ]; then echo "$target already exists" >&2; exit 1; fi

git init -q -b main "$target"
cd "$target"
git config core.autocrlf false
git config commit.gpgsign false

day=0
commit() { # commit "<person>" "<message>"
    day=$((day + 1))
    local stamp
    stamp="$(printf '2026-09-%02dT12:00:00+0000' $(( (day % 28) + 1 )))"
    GIT_AUTHOR_NAME="$1" GIT_AUTHOR_EMAIL="$(echo "$1" | tr '[:upper:]' '[:lower:]')@example.com" GIT_AUTHOR_DATE="$stamp" \
    GIT_COMMITTER_NAME="$1" GIT_COMMITTER_EMAIL="$(echo "$1" | tr '[:upper:]' '[:lower:]')@example.com" GIT_COMMITTER_DATE="$stamp" \
        git commit -q -m "$2"
}

# ---------- main ----------
cat > README.md <<'EOF'
# Git practice

A safe place to practise Git. **Scout** is a pretend robot: nothing here runs on real hardware, and you can't break anything that matters.

This repository goes with the [Git hands-on labs](https://hull-robotics-society.github.io/tutorials/git-lab-first-repo/) from the Hull University Robotics Society. Start there.

## What's in it

| Where | What it is |
| --- | --- |
| `robot.py` | Prints Scout's status. Run it with `python3 robot.py` to see what a branch changed. |
| `config.py` | Scout's settings. Teammates disagree about these. |
| `crew/` | One file per person who has finished the fork lab. Yours goes here. |
| `team/lights`, `team/wheels`, `team/sensors` | Three teammates' work in progress, happening at once. |
| `team/bracket-a`, `team/bracket-b` | Two versions of a 3D model that can't be merged. |
| `bug-hunt` | A long history with a bug hidden in it. |

## The rules

- Practise on **your own fork or clone**. Merge, rebase and force push there as much as you like.
- Only one kind of pull request comes back to this repository: adding your own file to `crew/`. The fork lab explains how.
- Leave the `team/` branches and `bug-hunt` as they are, so they still work for the next person.
EOF
cat > LICENSE <<'EOF'
MIT License

Copyright (c) 2026 Hull University Robotics Society

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF
cat > .gitignore <<'EOF'
__pycache__/
*.pyc
.venv/
.env
EOF
cat > .gitattributes <<'EOF'
* text=auto eol=lf
*.stl binary
EOF
git add -A
commit Ada "Add README and licence"

cat > config.py <<'EOF'
# Scout's settings
NAME = "Scout"
MAX_SPEED = 1.0  # metres per second
EOF
cat > robot.py <<'EOF'
from config import NAME, MAX_SPEED


def status():
    return [
        f"Name: {NAME}",
        f"Speed limit: {MAX_SPEED} m/s",
    ]


if __name__ == "__main__":
    for line in status():
        print(line)
EOF
git add -A
commit Ada "Add Scout's status script"

mkdir -p crew scripts .github/workflows
cat > crew/README.md <<'EOF'
# The crew

Everyone who has finished the fork lab has a file here. Name yours after your GitHub username, in lower case, such as `crew/your-username.md`, and copy the layout of `example.md`.
EOF
cat > crew/example.md <<'EOF'
# Example Person

Favourite robot: Baxter
EOF
cat > scripts/check_crew.py <<'EOF'
"""Checks the files in crew/. Run it from the top folder: python3 scripts/check_crew.py"""
import pathlib
import re
import sys

problems = []
for path in sorted(pathlib.Path("crew").glob("*")):
    if path.name == "README.md":
        continue
    if not re.fullmatch(r"[a-z0-9-]+\.md", path.name):
        problems.append(f"{path}: name it in lower case, like your-username.md")
        continue
    lines = path.read_text(encoding="utf-8").splitlines()
    if not lines or not lines[0].startswith("# "):
        problems.append(f"{path}: the first line should be '# Your name'")
    if not any(line.startswith("Favourite robot: ") for line in lines):
        problems.append(f"{path}: add a line starting 'Favourite robot: '")

for problem in problems:
    print(problem)
print(f"{len(problems)} problem(s) found" if problems else "All crew files look good")
sys.exit(1 if problems else 0)
EOF
cat > scripts/check_speed.py <<'EOF'
"""Exits with an error if Scout's speed limit is unsafe. Used in the bug hunt."""
import sys

sys.path.insert(0, ".")
from config import MAX_SPEED

if MAX_SPEED > 2:
    print(f"Unsafe speed limit: {MAX_SPEED}")
    sys.exit(1)
print(f"Speed limit OK: {MAX_SPEED}")
EOF
cat > .github/workflows/check.yml <<'EOF'
name: Check crew files

on:
    pull_request:
        branches: [main]

permissions:
    contents: read

jobs:
    check:
        name: Crew files
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v7
            - run: python3 scripts/check_crew.py
EOF
git add -A
commit Ada "Add the crew folder and its check"
branch_point="$(git rev-parse HEAD)"

cat >> README.md <<'EOF'

## Stuck?

Ask on the society's [Discord](https://discord.gg/DaNcZb7zvd), and include the output of `git status`.
EOF
git add -A
commit Ada "Add a note on where to get help"

# ---------- team/lights: merges cleanly with everything ----------
git switch -q -c team/lights "$branch_point"
cat > lights.py <<'EOF'
def lights_on(speed):
    return speed > 0
EOF
git add -A
commit Ben "Add a lights module"
sed -i 's/^from config import NAME, MAX_SPEED$/from config import NAME, MAX_SPEED\nfrom lights import lights_on/' robot.py
sed -i 's/^        f"Speed limit: {MAX_SPEED} m\/s",$/        f"Speed limit: {MAX_SPEED} m\/s",\n        f"Lights on: {lights_on(MAX_SPEED)}",/' robot.py
git add -A
commit Ben "Show the lights in Scout's status"

# ---------- team/wheels: wants Scout faster, clashes with team/sensors in config.py ----------
git switch -q -c team/wheels "$branch_point"
cat > wheels.py <<'EOF'
WHEEL_DIAMETER = 0.2  # metres
EOF
git add -A
commit Cleo "Add wheel dimensions"
sed -i 's/^MAX_SPEED = 1.0  # metres per second$/MAX_SPEED = 1.5  # metres per second: the new wheels can take it/' config.py
git add -A
commit Cleo "Raise the speed limit for the new wheels"

# ---------- team/sensors: wants Scout slower, with untidy commits to clean up ----------
git switch -q -c team/sensors "$branch_point"
cat > sensors.py <<'EOF'
def bump_detected():
    retrun False
EOF
git add -A
commit Dev "wip"
sed -i 's/^MAX_SPEED = 1.0  # metres per second$/MAX_SPEED = 0.5  # metres per second: slow enough to stop before a bump/' config.py
git add -A
commit Dev "Lower the speed limit so the bump sensor has time to react"
sed -i 's/retrun/return/' sensors.py
git add -A
commit Dev "fix typo"

# ---------- team/bracket-a and -b: a binary file that can't be merged ----------
printf_stl() { printf 'solid bracket-%s\0binary model data %s\0' "$1" "$1" > parts/bracket.stl; }
git switch -q -c team/bracket-a "$branch_point"
mkdir -p parts
printf_stl a
git add -A
commit Ben "Add the arm bracket, thicker walls"
git switch -q -c team/bracket-b "$branch_point"
mkdir -p parts
printf_stl b
git add -A
commit Cleo "Add the arm bracket, extra mounting holes"

# ---------- bug-hunt: one of these commits quietly makes Scout unsafe ----------
git switch -q -c bug-hunt "$branch_point"
for i in $(seq 1 32); do
    echo "Test run $i: all fine" >> test-log.txt
    if [ "$i" -eq 19 ]; then
        sed -i 's/^MAX_SPEED = 1.0  # metres per second$/MAX_SPEED = 15.0  # metres per second/' config.py
        git add -A
        commit Dev "Tidy up the test log"
    else
        git add -A
        commit Dev "Log test run $i"
    fi
done

git switch -q main
git config --unset core.autocrlf
git config --unset commit.gpgsign
echo "Created $target"
git log --oneline --graph --all --max-count=14
