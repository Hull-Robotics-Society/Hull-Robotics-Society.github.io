"""One-off migration of the Jekyll collections into Astro content collections.

Reads the old _dalek/, _OSRC/, _blogs/, events/ ... folders and writes cleaned Markdown
with new front matter into src/content/. Old permalinks are kept as `slug`, so existing
links keep working. Run once from the repository root, before the old folders are deleted.

Usage:
    python scripts/migrate-content.py
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'src' / 'content'

EMOJI = re.compile('[\U0001F000-\U0001FFFF☀-➿️]')


def read(path):
    """
    Split a Jekyll file into front matter and body.

    Parameters:
        path: Markdown file

    Returns:
        (dict of simple front matter keys, body string)
    """
    text = path.read_text(encoding='utf-8')
    m = re.match(r'---\s*\n(.*?)\n---\s*\n?(.*)', text, re.S)
    fm = {}
    for line in m.group(1).splitlines():
        k = re.match(r'^([A-Za-z_]+)\s*:\s*(.*)$', line)
        if k:
            fm[k.group(1)] = k.group(2).strip().strip('"').strip("'").strip()
    tags = re.findall(r'^\s+-\s+(.+)$', m.group(1).split('tags:')[1], re.M) if 'tags:' in m.group(1) else []
    fm['tags'] = [t.strip() for t in tags if not t.strip().endswith(':')]
    return fm, m.group(2)


def clean(body):
    """
    Remove Jekyll-only markup from a Markdown body.

    Parameters:
        body: Markdown text

    Returns:
        cleaned Markdown text
    """
    body = re.sub(r'<!--.*?-->', '', body, flags=re.S)
    body = re.sub(r'^.*-->\s*$', '', body, flags=re.M)
    body = re.sub(r'\{%-?.*?-?%\}', '', body, flags=re.S)
    body = re.sub(r'^.*class="back-to-[a-z]+-btn".*$\n?', '', body, flags=re.M)
    body = re.sub(r'^\{:.*\}\s*$', '', body, flags=re.M)
    body = body.replace('https://www.youtube.com/embed/', 'https://www.youtube-nocookie.com/embed/')
    body = re.sub(r'\A\s*(---\s*\n)?\s*#\s[^\n]*\n', '', body)
    body = re.sub(r'\n{3,}', '\n\n', body).strip()
    return body + '\n'


def q(value):
    """
    Quote a string for YAML.

    Parameters:
        value: text

    Returns:
        double-quoted YAML scalar
    """
    value = EMOJI.sub('', value).strip()
    return '"' + value.replace('\\', '\\\\').replace('"', '\\"') + '"'


def write(rel, fields, body):
    """
    Write one content entry.

    Parameters:
        rel: path below src/content
        fields: list of (key, YAML value) pairs, values already formatted
        body: Markdown body
    """
    path = OUT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    lines = ['---'] + ['%s: %s' % (k, v) for k, v in fields if v not in (None, '', '""', '[]')] + ['---', '']
    path.write_text('\n'.join(lines) + clean(body), encoding='utf-8')
    print('wrote', rel)


def ylist(items):
    return '[' + ', '.join(q(i) for i in items) + ']' if items else ''


# ---------- project build logs ----------
LOGS = {
    '_dalek': 'dalek',
    '_OSRC': 'OSRC',
    '_baxter': 'baxter',
    '_pepper': 'pepper',
    '_transformer': 'transformer'
}
for folder, project in LOGS.items():
    files = sorted((ROOT / folder).glob('*.md')) + sorted((ROOT / folder).glob('*/*.md'))
    for f in files:
        fm, body = read(f)
        entry = fm['permalink'].strip('/').split('/')[-1]
        write(
            'logs/%s/%s.md' % (project.lower(), entry.lower()),
            [
                ('title', q(fm['title'])),
                ('slug', '%s/%s' % (project, entry)),
                ('project', project.lower()),
                ('date', fm.get('date', '')[:10]),
                ('excerpt', q(fm.get('excerpt', ''))),
                ('tags', ylist(fm['tags']))
            ],
            body
        )

# ---------- research ----------
for f in sorted((ROOT / '_neuro').glob('*.md')):
    fm, body = read(f)
    entry = fm['permalink'].strip('/').split('/')[-1]
    write(
        'research/neuro/%s.md' % entry,
        [
            ('title', q(fm['title'])),
            ('slug', 'neuro/%s' % entry),
            ('area', 'neuro'),
            ('date', fm['date'][:10]),
            ('excerpt', q(fm['excerpt'])),
            ('tags', ylist(fm['tags']))
        ],
        body
    )

# ---------- journal ----------
JOURNAL = {
    'daleks-day-out2026.md': ('varsity-2026', '/images/varsity/dalek-crepe.jpg', 'Showcase'),
    'freshers-day-2026.md': ('freshers-day-2026', '/media/freshers/set_up.jpg', 'Fair'),
    'graduation-2025-26.md': ('graduation-2025-26', '/images/graduation/pepper-grad.png', 'Showcase'),
    'our-2025.md': ('our-2025', '/images/dalek/50-years/dalek50-5.jpeg', ''),
    'our-2026.md': ('our-2026', '/images/dalek/100-leaders/dalek-100-03.jpg', '')
}
for name, (slug, cover, event) in JOURNAL.items():
    fm, body = read(ROOT / '_blogs' / name)
    write(
        'journal/%s.md' % slug,
        [
            ('title', q(fm['title'])),
            ('slug', slug),
            ('date', fm['date'][:10]),
            ('excerpt', q(fm['excerpt'])),
            ('cover', q(cover)),
            ('eventType', q(event))
        ],
        body
    )

# ---------- events ----------
EVENTS = {
    'events/daleks-day-out.md': ('daleks-day-out', 'Showcase', '2025-05-15', '14:00', '16:00', 'Beverley Leisure Centre, Beverley', '/images/dalek-100-leaders.jpg'),
    'events/freshers-2025.md': ('freshers-2025', 'Fair', '', '', '', '', ''),
    'events/refreshers-2025.md': ('refreshers-2025', 'Fair', '', '', '', '', ''),
    'events/taster-2025.md': ('kicad-thymio-session', 'Workshop', '', '', '', 'Robot Lab, Applied Science building', ''),
    'events/weekly-meetup.md': ('weekly-meetup', 'Project night', '', '17:00', '19:00', 'Robot Lab, Applied Science building', '/images/projects.png'),
    '_films/klaus-screening.md': ('klaus-screening', 'Film night', '', '', '', '', '/images/klaus.jpg'),
    '_films/lotr-fellowship-screening.md': ('lotr-fellowship-christmas-2025', 'Film night', '', '', '', '', '/images/lotr-fellowship.jpg'),
    '_films/terminator-screening.md': ('terminator-screening', 'Film night', '', '', '', '', '/images/terminator.png'),
    '_films/wall-e-screening.md': ('walle-screening', 'Film night', '', '', '', '', '/images/wall-e.jpg')
}
for rel, (slug, kind, date, start, end, where, cover) in EVENTS.items():
    fm, body = read(ROOT / rel)
    recurring = slug == 'weekly-meetup'
    write(
        'events/%s.md' % slug,
        [
            ('title', q('Weekly Project Night' if recurring else fm['title'])),
            ('slug', slug),
            ('type', q(kind)),
            ('date', date or fm.get('date', '')[:10]),
            ('recurring', 'weekly' if recurring else ''),
            ('weekday', '1' if recurring else ''),
            ('start', q(start)),
            ('end', q(end)),
            ('location', q(where)),
            ('excerpt', q(re.sub(r'[*_]', '', fm.get('excerpt', '')))),
            ('cover', q(cover))
        ],
        body
    )

# ---------- tutorials ----------
fm, body = read(ROOT / '_tutorials' / '01-keychain-freshers.md')
write(
    'tutorials/keychain.md',
    [
        ('title', q('Design a light-up PCB keychain')),
        ('slug', 'keychain'),
        ('date', fm['date'][:10]),
        ('excerpt', q('Simulate an LED circuit in TinkerCAD, move it into KiCad and route a board you can send off for manufacturing.')),
        ('level', q('Beginner')),
        ('duration', q('About 60 minutes')),
        ('needs', q('A laptop with KiCad installed')),
        ('session', q('Give It A Go')),
        ('cover', q('/images/keychain.png')),
        ('tags', ylist(['KiCad', 'TinkerCAD', 'Electronics']))
    ],
    body
)
