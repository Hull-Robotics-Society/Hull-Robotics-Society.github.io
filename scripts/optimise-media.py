"""Shrink photos and videos in public/ before committing them.

Pass the files or folders you just added; they are optimised in place:
    - photos wider than 1600 px are scaled down and re-compressed (kept as they are if that wouldn't help),
    - videos are re-encoded to H.264 MP4 (max 1280 px on the long side) and get a poster image
      with the same name (.jpg), which the gallery uses as the preview.

Requires ffmpeg and ffprobe on PATH. Safe to re-run: videos that already have a poster are skipped.
(This script was first used to move the old Jekyll media into public/.)

Usage:
    python scripts/optimise-media.py public/images/varsity-2027
    python scripts/optimise-media.py public/media/dalek/new-clip.mov
"""
import json
import pathlib
import shutil
import subprocess
import sys

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


def optimise(src):
    """
    Optimise one file in place.

    Parameters:
        src: photo or video below public/

    Returns:
        (size before, size after) in bytes
    """
    before = src.stat().st_size
    ext = src.suffix.lower()
    if ext in ('.jpg', '.jpeg', '.png'):
        tmp = src.with_name(src.stem + '.tmp' + src.suffix)
        image(src, tmp)
        tmp.replace(src)
        return before, src.stat().st_size
    if ext in ('.mp4', '.mov', '.webm', '.m4v'):
        out = src.with_suffix('.mp4')
        if out.with_suffix('.jpg').exists():
            return before, before
        tmp = src.with_name(src.stem + '.tmp.mp4')
        video(src, tmp)
        tmp.with_suffix('.jpg').replace(out.with_suffix('.jpg'))
        tmp.replace(out)
        if out != src:
            src.unlink()
        return before, out.stat().st_size
    return before, before


def main():
    paths = [pathlib.Path(a) for a in sys.argv[1:]]
    if not paths:
        sys.exit(__doc__)

    files = sorted(f for p in paths for f in ([p] if p.is_file() else p.rglob('*')) if f.is_file() and '.tmp.' not in f.name)
    total_before = total_after = 0
    for f in files:
        before, after = optimise(f)
        total_before += before
        total_after += after
        print('%-70s %8.1f MB -> %6.1f MB' % (f, before / 1e6, after / 1e6), flush=True)

    print('total %.1f MB -> %.1f MB' % (total_before / 1e6, total_after / 1e6))


if __name__ == '__main__':
    main()
