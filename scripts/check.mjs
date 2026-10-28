// npm run check: looks over the content for things that are easy to miss before publishing.
// Errors (exit code 1) break the site or leave placeholder text on it; warnings are worth a look.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const content = path.join(root, 'src/content');
const pub = path.join(root, 'public');

const MAX_IMAGE_MB = 1;
const MAX_VIDEO_MB = 25;

const errors = [];
const warnings = [];
const rel = p => path.relative(root, p).replace(/\\/g, '/');

/** Every file below a folder, as forward-slash paths relative to it. */
function files(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir, { recursive: true, withFileTypes: true })
        .filter(d => d.isFile())
        .map(d => path.relative(dir, path.join(d.parentPath, d.name)).replace(/\\/g, '/'));
}

/** The few front matter fields the checks need, without a YAML parser. */
function frontMatter(text) {
    const block = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
    const field = name => block.match(new RegExp(`^${name}:\\s*"?([^"#\\r\\n]*?)"?\\s*(#.*)?$`, 'm'))?.[1].trim();
    return { date: field('date'), cover: field('cover'), slug: field('slug'), film: /^film:/m.test(block) };
}

// Content entries and their media folders (src/content/<path>.md → public/media/<path>/)
const entries = files(content).filter(f => f.endsWith('.md')).map(f => {
    const text = fs.readFileSync(path.join(content, f), 'utf8');
    return { file: `src/content/${f}`, collection: f.split('/')[0], media: `media/${f.replace(/\.md$/, '')}`, text, ...frontMatter(text) };
});

// 1. Placeholder text left from the templates or the old site
for (const e of entries) {
    e.text.split(/\r?\n/).forEach((line, i) => {
        if (/\bTODO\b|image-path\/|\]\(#\)/.test(line)) errors.push(`${e.file}:${i + 1} still has placeholder text: ${line.trim().slice(0, 80)}`);
    });
}

/** Pixel size of a .jpg, .png or .mp4 in public/, read from the file header; undefined for anything else. */
function pixelSize(src) {
    const file = path.join(pub, decodeURIComponent(src).replace(/^\//, ''));
    if (!fs.existsSync(file)) return undefined;
    const b = fs.readFileSync(file);
    if (b.readUInt32BE(0) === 0x89504e47) return [b.readUInt32BE(16), b.readUInt32BE(20)];
    if (b[0] === 0xff && b[1] === 0xd8) {
        for (let i = 2; i < b.length - 9;) {
            const marker = b[i + 1];
            if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
            i += 2 + b.readUInt16BE(i + 2);
        }
    }
    // MP4: the video track's header box (tkhd) ends with its width and height as 16.16 fixed-point numbers
    for (let i = b.indexOf('tkhd'); i > 3; i = b.indexOf('tkhd', i + 4)) {
        const end = i - 4 + b.readUInt32BE(i - 4);
        const size = [b.readUInt32BE(end - 8) >>> 16, b.readUInt32BE(end - 4) >>> 16];
        if (size[0] && size[1]) return size;
    }
    return undefined;
}

// 1b. Layouts and syntax from the old Jekyll site, which the new design does not support.
// Code blocks are skipped, so examples of HTML or shell comments in tutorials are fine.
const jekyllKeys = ['layout', 'permalink', 'author_profile', 'toc', 'toc_sticky', 'toc_label', 'header', 'classes', 'sidebar', 'categories', 'redirect_from', 'excerpt_separator', 'read_time', 'share', 'related'];
for (const e of entries) {
    const lines = e.text.split(/\r?\n/);
    const end = lines.indexOf('---', 1);
    let code = false;
    let row = false;
    lines.forEach((line, i) => {
        const at = `${e.file}:${i + 1}`;
        if (i > 0 && i < end) {
            const key = line.match(/^(\w+):/)?.[1];
            if (jekyllKeys.includes(key)) warnings.push(`${at} "${key}:" is from the old site and is ignored; remove it`);
            return;
        }
        if (/^\s*(```|~~~)/.test(line)) code = !code;
        if (code || i <= end) return;
        const prose = line.replace(/`[^`]*`/g, '');
        if (/\sstyle=|\salign=|<center|<font/i.test(prose)) errors.push(`${at} has a hand-made layout (style=, align=, <center>); use <figure> and <div class="media-row"> instead (see the README)`);
        if (/\{%|\{\{|\{:/.test(prose)) errors.push(`${at} has Jekyll template syntax ({% %}, {{ }} or {: }), which shows up as text`);
        if (/^# /.test(line)) errors.push(`${at} uses a "# " heading; the page title is the only top-level heading, so start sections with "## "`);
        if (/^\s*<\/(div|figure|video|section|p)>\s*$/.test(line) && lines[i + 1]?.trim() && !/^\s*</.test(lines[i + 1])) {
            errors.push(`${at} needs an empty line after </…>, otherwise the next line is shown as raw text`);
        }
        if (/^(>\s*)?\*?(Above|Below):/.test(line)) warnings.push(`${at} is a caption written as text; put it in <figcaption> inside the <figure> instead`);
        if (/<video\b/.test(prose) && !/poster=/.test(prose)) warnings.push(`${at} has a <video> without a poster= preview image`);

        // Pictures in a .media-row only line up when they state their real size
        if (/class="media-row"/.test(line)) row = true;
        else if (row && /<\/div>/.test(line)) row = false;
        for (const [tag] of row ? prose.matchAll(/<(img|video)\b[^>]*>/g) : []) {
            const src = tag.match(/\ssrc="([^"]+)"/)?.[1];
            const real = src && pixelSize(src);
            if (!real) continue;
            const [w, h] = ['width', 'height'].map(a => +(tag.match(new RegExp(`\\s${a}="(\\d+)"`))?.[1] ?? 0));
            if (!w || !h || Math.abs(w / h / (real[0] / real[1]) - 1) > .02) {
                errors.push(`${at} needs the real size of ${src.split('/').pop()} in the row: width="${real[0]}" height="${real[1]}"`);
            }
        }
    });
}

// 2. Events and journal posts get their address from the file name, so names must be unique across year folders
for (const collection of ['events', 'journal']) {
    const seen = new Map();
    for (const e of entries.filter(x => x.collection === collection)) {
        const id = e.slug ?? path.posix.basename(e.file, '.md');
        if (seen.has(id)) errors.push(`${e.file} and ${seen.get(id)} would both be /${collection}/${id}/`);
        seen.set(id, e.file);
    }
}

// 3. Events and journal posts filed under the wrong academic year (1 August to 31 July)
for (const e of entries.filter(x => ['events', 'journal'].includes(x.collection) && x.date)) {
    const [y, m] = e.date.split('-').map(Number);
    const start = m >= 8 ? y : y - 1;
    const year = `${start}-${String((start + 1) % 100).padStart(2, '0')}`;
    const folder = e.file.split('/')[3];
    if (folder !== year) warnings.push(`${e.file} is dated ${e.date}, so it belongs in the ${year} folder`);
}

// 4. Paths to files in public/ that do not exist (front matter, Markdown, data files and templates)
const sources = [
    ...entries.map(e => ({ file: e.file, text: e.text })),
    ...['src/data', 'src/components', 'src/layouts', 'src/pages', 'src/styles'].flatMap(dir =>
        files(path.join(root, dir)).map(f => ({ file: `${dir}/${f}`, text: fs.readFileSync(path.join(root, dir, f), 'utf8') })))
];
// Code blocks and YAML comments only talk about paths; `gallery:` lists folders without the leading slash
const linkText = text => text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`\n]*`/g, '')
    .replace(/^\s*#.*$/gm, '')
    .replace(/^gallery:.*$/gm, line => line.replace(/(?<=[[,]\s*)(?=media\/|images\/)/g, '/'));
const references = new Set();
for (const s of sources) {
    for (const [, ref] of linkText(s.text).matchAll(/(?<![\w.~-])\/((?:media|images)\/[^\s"'`)\]>,|]+)/g)) {
        if (/[{<$]/.test(ref)) continue;
        const clean = decodeURIComponent(ref).replace(/[.:;]+$/, '');
        references.add(clean.replace(/\/$/, ''));
        if (!fs.existsSync(path.join(pub, clean))) errors.push(`${s.file} links to /${clean}, which is not in public/`);
    }
}

// 5. Film nights without a poster, and posters without a credit
const credits = JSON.parse(fs.readFileSync(path.join(root, 'src/data/credits.json'), 'utf8')).credits.map(c => c.path.replace(/^\//, ''));
const credited = p => credits.some(c => p === c || p.startsWith(c.endsWith('/') ? c : c + '/'));
for (const e of entries.filter(x => x.film)) {
    const own = files(path.join(pub, e.media)).find(f => /^(poster|cover)\.(jpe?g|png|webp)$/i.test(f));
    const poster = e.cover?.replace(/^\//, '') ?? (own && `${e.media}/${own}`);
    if (!poster) errors.push(`${e.file} is a film night without a poster (save it as public/${e.media}/poster.jpg)`);
    else if (!credited(poster)) warnings.push(`/${poster} has no entry in src/data/credits.json (who owns the poster?)`);
}

// 6. Media that no page uses: not in an entry's folder, not linked, not in a gallery folder
const entryFolders = new Set(entries.map(e => e.media));
const filmFolders = new Set(entries.filter(e => e.film).map(e => e.media));
const isUsed = file => {
    const stem = file.replace(/\.[^.]+$/, '');
    const owner = [...entryFolders].find(f => file.startsWith(f + '/'));
    if (owner && filmFolders.has(owner)) {
        // Film night pages only show the poster
        if (/\/(poster|cover)\.\w+$/.test(file)) return true;
    } else if (owner) {
        return true;
    }
    return [...references].some(r => file === r || file.startsWith(r + '/') || `${stem}.mp4` === r);
};
const media = files(path.join(pub, 'media')).map(f => `media/${f}`);
const images = files(path.join(pub, 'images')).map(f => `images/${f}`).filter(f => !f.startsWith('images/committee/'));
for (const file of [...media, ...images]) {
    if (isUsed(file)) continue;
    // Site design files are often used by name only (in CSS or code)
    const name = path.posix.basename(file);
    if (file.startsWith('images/') && sources.some(s => s.text.includes(name))) continue;
    warnings.push(`public/${file} is not used by any page`);
}
for (const folder of new Set(media.map(f => f.split('/').slice(0, -1).join('/')))) {
    const owner = [...entryFolders].some(f => folder === f || folder.startsWith(f + '/'));
    const linked = [...references].some(r => r === folder || r.startsWith(folder + '/') || folder.startsWith(r + '/'));
    if (!owner && !linked && folder.split('/').length > 2) warnings.push(`public/${folder}/ does not belong to any page (renamed or deleted entry?)`);
}

// 7. Large files and videos without a poster frame
for (const file of [...media, ...images]) {
    const mb = fs.statSync(path.join(pub, file)).size / 1048576;
    const video = /\.(mp4|mov|webm)$/i.test(file);
    if (/\.(jpe?g|png|webp)$/i.test(file) && mb > MAX_IMAGE_MB || video && mb > MAX_VIDEO_MB) {
        warnings.push(`public/${file} is ${mb.toFixed(1)} MB; shrink it with: python scripts/optimise-media.py public/${file}`);
    }
    if (/\.mov$/i.test(file)) warnings.push(`public/${file} is a .mov; browsers need .mp4 (python scripts/optimise-media.py converts it)`);
    if (/\.mp4$/i.test(file) && !media.concat(images).some(f => /\.jpe?g$/i.test(f) && f.replace(/\.[^.]+$/, '') === file.replace(/\.mp4$/i, ''))) {
        warnings.push(`public/${file} has no poster frame (python scripts/optimise-media.py makes one)`);
    }
}

for (const [label, list] of [['Errors', errors], ['Warnings', warnings]]) {
    if (!list.length) continue;
    console.log(`\n${label} (${list.length}):`);
    list.forEach(x => console.log(`  - ${x}`));
}
console.log(`\nChecked ${entries.length} pages and ${media.length + images.length} media files: ${errors.length} errors, ${warnings.length} warnings.`);
if (errors.length) process.exitCode = 1;
