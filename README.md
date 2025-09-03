# Hull University Robotics Society Website

This is the official website for the Hull University Robotics Society.  
It showcases our projects, research, tutorials, and events.

## Structure

- `_pages/` — Main site pages (research, tutorials, projects, etc.)
- `_projects/` — Project collections
- `_neuro/` — Neuroscience research articles
- `_tutorials/` — Tutorials and workshop guides
- `_data/` — Site data files
- `images/` — Image assets for the website

## Editing and Committing Changes

1. **Clone the repository (gh-pages branch):**
   ```sh
   git clone --branch gh-pages https://github.com/Hull-Robotics-Society/Hull-Robotics-Society.github.io.git
   cd Hull-Robotics-Society.github.io
   ```

## Local Setup for Editing (Jekyll)

### Windows

1. Install [Ruby+Devkit](https://rubyinstaller.org/downloads/) (recommended version: 3.x).
2. Open a new command prompt and run:
   ```sh
   gem install bundler
   ```
3. Install Jekyll and dependencies:
   ```sh
   bundle install
   ```
4. Start the local server:
   ```sh
   bundle exec jekyll serve
   ```
5. Visit `http://localhost:4000` in your browser.

### Linux (Ubuntu/Debian/Fedora/Arch)

1. Install Ruby and build tools:
   ```sh
   sudo apt update
   sudo apt install ruby-full build-essential zlib1g-dev
   ```
   *(Fedora/Arch: use your package manager for ruby and build tools)*

2. Install Bundler:
   ```sh
   gem install bundler
   ```

3. Install Jekyll and dependencies:
   ```sh
   bundle install
   ```

4. Start the local server:
   ```sh
   bundle exec jekyll serve
   ```

5. Visit `http://localhost:4000` in your browser.

### macOS

1. Install Homebrew (if not already installed):
   ```sh
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
2. Install Ruby:
   ```sh
   brew install ruby
   ```
3. Add Ruby to your PATH (if needed), then install Bundler:
   ```sh
   gem install bundler
   ```
4. Install Jekyll and dependencies:
   ```sh
   bundle install
   ```
5. Start the local server:
   ```sh
   bundle exec jekyll serve
   ```
6. Visit `http://localhost:4000` in your browser.

## Notes

- All content is written in Markdown.
- Use descriptive commit messages.
- For new pages, ensure you set the correct front matter (see existing files for examples).
- If you add a new collection, update `_config.yml` accordingly.
