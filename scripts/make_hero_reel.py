"""Cut the hero showreel: short moments from the four reels, cropped to 4:5, looped, no audio.

Run: python -I scripts/make_hero_reel.py
Writes public/assets/videos/hero-reel-<hash>.{webm,mp4} + poster (hashed names, so a new cut is never served
from a visitor's cache) and src/content/heroReel.json
(clip start times + labels, so the viewfinder can show which project is on screen and link to it).
"""
import hashlib
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VID = ROOT / 'public/assets/videos'
CLIP = 1.6  # seconds per moment
W, H = 640, 800  # 4:5

# (source reel, start second, project slug, label). Moments picked from the frame contact sheets.
MOMENTS = [
    ('barbershop-promo', 37.5, 'barbershop-promo', 'Barbershop promo'),
    ('mens-basketball', 2.5, 'mens-basketball', 'Men’s basketball'),
    ('club-event', 42.6, 'club-event', 'Club night'),
    ('womens-basketball', 35.2, 'womens-basketball', 'Women’s basketball'),
    ('barbershop-promo', 57.4, 'barbershop-promo', 'Barbershop promo'),
    ('club-event', 2.4, 'club-event', 'Club night'),
    ('mens-basketball', 41.8, 'mens-basketball', 'Men’s basketball'),
]

inputs, chains = [], []
for i, (src, t, _, _) in enumerate(MOMENTS):
    inputs += ['-ss', str(t), '-t', str(CLIP), '-i', str(VID / f'{src}.mp4')]
    # source is 720x1280: crop a 4:5 window slightly above centre, then scale
    chains.append(f'[{i}:v]crop=720:900:0:170,scale={W}:{H},setsar=1,fps=30,format=yuv420p[v{i}]')
graph = ';'.join(chains) + ';' + ''.join(f'[v{i}]' for i in range(len(MOMENTS))) + f'concat=n={len(MOMENTS)}:v=1:a=0[out]'

base = ['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', graph, '-map', '[out]', '-an']
subprocess.run([*base, '-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-movflags', '+faststart', str(VID / 'hero-reel.mp4')], check=True)
subprocess.run([*base, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '38', '-row-mt', '1', str(VID / 'hero-reel.webm')], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', '0.4', '-i', str(VID / 'hero-reel.mp4'), '-frames:v', '1', '-c:v', 'libwebp', '-quality', '80',
                str(VID / 'hero-reel-poster.webp')], check=True)

# content-hash the outputs; drop older cuts
digest = hashlib.sha1((VID / 'hero-reel.mp4').read_bytes()).hexdigest()[:8]
for old in VID.glob('hero-reel-*'):
    if re.fullmatch(r'hero-reel-[0-9a-f]{8}(-poster)?\.(mp4|webm|webp)', old.name):
        old.unlink()
names = {}
for kind, src in [('webm', 'hero-reel.webm'), ('mp4', 'hero-reel.mp4'), ('poster', 'hero-reel-poster.webp')]:
    dst = src.replace('hero-reel', f'hero-reel-{digest}', 1)
    (VID / src).rename(VID / dst)
    names[kind] = f'/assets/videos/{dst}'

clips = [{'start': round(i * CLIP, 2), 'slug': slug, 'label': label} for i, (_, _, slug, label) in enumerate(MOMENTS)]
(ROOT / 'src/content/heroReel.json').write_text(json.dumps({'clipSeconds': CLIP, **names, 'clips': clips}, ensure_ascii=False, indent=1), encoding='utf-8')
for path in names.values():
    print(path, f'{(ROOT / "public" / path.lstrip("/")).stat().st_size / 1e6:.2f} MB')
