// npm run new: asks a few questions, then creates a Markdown file from templates/ in the right
// folder, plus its media folder below public/media/. Nothing is committed.
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { stdin, stdout } from 'node:process';

const root = path.resolve(import.meta.dirname, '..');
const site = JSON.parse(fs.readFileSync(path.join(root, 'src/data/site.json'), 'utf8'));

const kinds = [
    { key: 'event', label: 'Event (workshop, showcase, social, …)', template: 'event.md', collection: 'events', byYear: true },
    { key: 'film', label: 'Film night', template: 'film-night.md', collection: 'events', byYear: true },
    { key: 'journal', label: 'Journal post', template: 'journal.md', collection: 'journal', byYear: true },
    { key: 'log', label: 'Build log entry', template: 'log.md', collection: 'logs' },
    { key: 'tutorial', label: 'Tutorial', template: 'tutorial.md', collection: 'tutorials' },
    { key: 'project', label: 'Project', template: 'project.md', collection: 'projects' }
];
const eventTypes = ['Workshop', 'Showcase', 'Fair', 'Social', 'Competition', 'Project meeting', 'Project day', 'Executive'];

/** "Movie Night: WALL·E!" → "movie-night-wall-e" */
const slugify = text => text
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Academic years run from 1 August to 31 July: 2026-11-09 → "2026-27" */
function academicYear(date) {
    const [y, m] = date.split('-').map(Number);
    const start = m >= 8 ? y : y - 1;
    return `${start}-${String((start + 1) % 100).padStart(2, '0')}`;
}

/** Every Markdown file below a folder, with its path relative to that folder. */
function markdownFiles(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir, { recursive: true })
        .map(f => f.replace(/\\/g, '/'))
        .filter(f => f.endsWith('.md'));
}

// Answers are queued as they arrive, so typed and piped input both work
const rl = readline.createInterface({ input: stdin });
const lines = [];
const waiting = [];
rl.on('line', line => waiting.length ? waiting.shift()(line) : lines.push(line));
rl.on('close', () => waiting.splice(0).forEach(resolve => resolve(null)));

async function ask(question, fallback = '') {
    stdout.write(fallback ? `${question} [${fallback}]: ` : `${question}: `);
    const line = lines.length ? lines.shift() : await new Promise(resolve => waiting.push(resolve));
    if (line === null) throw new Error('Cancelled, nothing was created.');
    return line.trim() || fallback;
}

async function choose(question, options) {
    console.log(`\n${question}`);
    options.forEach((o, i) => console.log(`  ${i + 1}) ${o}`));
    for (;;) {
        const n = Number(await ask('Number'));
        if (n >= 1 && n <= options.length) return n - 1;
        console.log(`Please type a number from 1 to ${options.length}.`);
    }
}

async function main() {
    console.log('Create a new page for the HullRS website.');
    const kind = kinds[await choose('What do you want to add?', kinds.map(k => k.label))];

    let type = 'Film night';
    if (kind.key === 'event') type = eventTypes[await choose('Which type of event?', eventTypes)];

    let project = '';
    if (kind.key === 'log') {
        const ids = markdownFiles(path.join(root, 'src/content/projects')).map(f => f.replace(/\.md$/, '').toLowerCase());
        project = ids[await choose('Which project?', ids)];
    }

    console.log('');
    const title = await ask(kind.key === 'film' ? 'Film title' : 'Title');
    if (!title) throw new Error('A title is needed.');

    const today = new Date().toISOString().slice(0, 10);
    let date;
    for (;;) {
        date = await ask(kind.key === 'project' ? 'Start date (YYYY-MM-DD)' : 'Date (YYYY-MM-DD)', today);
        if (/^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(Date.parse(date))) break;
        console.log('Please write the date as YYYY-MM-DD, e.g. 2026-11-20.');
    }

    const slug = slugify(await ask('Web address (the part after the last /)', slugify(kind.key === 'film' ? `${title} screening` : title)));
    if (!slug) throw new Error('The web address needs at least one letter or digit.');

    // Events and journal posts are filed by academic year; the address only uses the file name, so it must be unique
    const base = path.join(root, 'src/content', kind.collection);
    const folder = kind.byYear ? academicYear(date) : kind.key === 'log' ? project : '';
    const taken = markdownFiles(base).some(f => path.posix.basename(f, '.md').toLowerCase() === slug && (kind.byYear || path.posix.dirname(f) === (folder || '.')));
    if (taken) throw new Error(`There is already a ${kind.collection} entry called "${slug}". Pick another web address.`);

    const file = path.join(base, folder, `${slug}.md`);
    const rel = path.relative(root, file).replace(/\\/g, '/');
    const media = 'media/' + rel.replace(/^src\/content\//, '').replace(/\.md$/, '');
    const order = markdownFiles(path.join(root, 'src/content/projects')).length + 1;

    const values = { title: title.replace(/"/g, '\\"'), type, date, location: site.location, project, media, slug, order };
    const text = fs.readFileSync(path.join(root, 'templates', kind.template), 'utf8')
        .replace(/\{\{(\w+)\}\}/g, (_, key) => String(values[key] ?? ''));

    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, text);
    fs.mkdirSync(path.join(root, 'public', media), { recursive: true });

    const url = {
        events: `/events/${slug}/`,
        journal: `/journal/${slug}/`,
        logs: `/projects/${project}/${slug}/`,
        tutorials: `/tutorials/${slug}/`,
        projects: `/projects/${slug}/`
    }[kind.collection];

    console.log(`
Created  ${rel}
Media    public/${media}/  (empty until you add photos or videos)
Address  ${url}

Next: fill in every TODO, run "npm run dev" to preview, then "npm run check".`);
}

main()
    .catch(err => {
        console.error(`\n${err.message}`);
        process.exitCode = 1;
    })
    .finally(() => rl.close());
