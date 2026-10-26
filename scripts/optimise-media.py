"""One-off media optimisation for the Jekyll -> Astro migration.

Copies images/, media/ and assets/videos/ into public/ under the same paths, so every
existing /images/... and /media/... link keeps working, but:
    - photos wider than 1600 px are scaled down and re-compressed,
    - videos are re-encoded to H.264 (max 1280 px on the long side) with a poster frame.

Requires ffmpeg and ffprobe on PATH. Safe to re-run: existing outputs are skipped.

Usage:
    python scripts/optimise-media.py
"""
import json
import pathlib
import shutil
import subprocess

ROOT = pathlib.Path(__file__).resolve().parent.parent
SOURCES = [
    'images',
    'media',
    'assets/videos'
]
OUT = ROOT / 'public'
MAX_IMAGE = 1600
MAX_VIDEO = 1280


def probe(path):
    """
    Read the width and height of the first video stream.

    Parameters:
        path: file to inspect

    Returns:
        (width, height) in pixels
    """
    out = subprocess.run(
        ['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'json', str(path)],
        capture_output=True,
        text=True,
        check=True
    )
    stream = json.loads(out.stdout)['streams'][0]
    return stream['width'], stream['height']


def image(src, dst):
    """
    Scale and re-compress one photo; small files and SVGs are copied as they are.

    Parameters:
        src: source image
        dst: target path in public/
    """
    if src.suffix.lower() == '.svg' or src.stat().st_size < 150_000:
        shutil.copy2(src, dst)
        return

    w, h = probe(src)
    scale = 'scale=%d:-2' % MAX_IMAGE if w > MAX_IMAGE else 'scale=iw:ih'
    args = ['-q:v', '4'] if src.suffix.lower() in ('.jpg', '.jpeg') else ['-compression_level', '9']
    subprocess.run(
        ['ffmpeg', '-v', 'error', '-y', '-i', str(src), '-vf', scale, *args, str(dst)],
        check=True
    )
    if dst.stat().st_size > src.stat().st_size:
        shutil.copy2(src, dst)


def video(src, dst):
    """
    Re-encode one video for the web and write a poster image next to it.

    Parameters:
        src: source video
        dst: target path in public/
    """
    w, h = probe(src)
    scale = 'scale=%d:-2' % MAX_VIDEO if w >= h else 'scale=-2:%d' % MAX_VIDEO
    if max(w, h) <= MAX_VIDEO:
        scale = 'scale=trunc(iw/2)*2:trunc(ih/2)*2'

    subprocess.run(
        ['ffmpeg', '-v', 'error', '-y', '-i', str(src), '-vf', scale,
         '-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-pix_fmt', 'yuv420p',
         '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', str(dst)],
        check=True
    )
    subprocess.run(
        ['ffmpeg', '-v', 'error', '-y', '-ss', '1', '-i', str(dst), '-frames:v', '1', '-q:v', '5', str(dst.with_suffix('.jpg'))],
        check=True
    )


def main():
    before = after = 0
    for folder in SOURCES:
        for src in sorted((ROOT / folder).rglob('*')):
            if not src.is_file():
                continue

            dst = OUT / src.relative_to(ROOT)
            dst.parent.mkdir(parents=True, exist_ok=True)
            ext = src.suffix.lower()
            if not dst.exists():
                if ext in ('.jpg', '.jpeg', '.png', '.svg'):
                    image(src, dst)
                elif ext in ('.mp4', '.mov', '.webm'):
                    video(src, dst)
                else:
                    shutil.copy2(src, dst)

            before += src.stat().st_size
            after += dst.stat().st_size
            print('%-70s %8.1f MB -> %6.1f MB' % (src.relative_to(ROOT), src.stat().st_size / 1e6, dst.stat().st_size / 1e6), flush=True)

    print('total %.0f MB -> %.0f MB' % (before / 1e6, after / 1e6))


if __name__ == '__main__':
    main()
