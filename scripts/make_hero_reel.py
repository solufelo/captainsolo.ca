"""Cut the hero showreel: 1.8 s moments from the featured videos, 16:9, looped, no audio.

Run: python -I scripts/make_hero_reel.py
Writes public/assets/videos/hero-reel-<hash>.{webm,mp4} + poster (hashed names, so a new cut is never served
from a visitor's cache) and src/content/heroReel.json
(clip start times + labels, so the viewfinder can show which project is on screen and link to it).
Sources are the masters in Downloads and Portfolio-Archive on Solomon's PC.
"""
import hashlib
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VID = ROOT / 'public/assets/videos'
CLIP = 1.8  # seconds per moment
W, H = 1280, 720
DL = 'C:/Users/Administrator/Downloads/Video/'
SRC = {
    'ten-fold': DL + 'tgk - ten fold v2_5.mp4',
    'tec': DL + "10k Moss - 'TEC' (Official Music Video).mp4",
    'july-6': DL + 'Dela - JULY 6 (Official Music Video).mp4',
    'moksha-festival': DL + 'moksha promo v4.mp4',
    'laurier-gameday': DL + '01_Hawk_Opener_v024_Native1080p_SoundV3_Shake_Master.mp4',
    'vair-drop': 'C:/Users/Administrator/Portfolio-Archive/logo work + desc_/vair studios 1.mp4',
}
# Ten Fold is framed in a rounded film gate: zoom past its black edges.
ZOOM = {'ten-fold': 0.9}

# (project slug, start second, label). Moments from the triage loop windows.
MOMENTS = [
    ('ten-fold', 103.0, 'TGK – Ten Fold'),
    ('tec', 11.0, '10k Moss – TEC'),
    ('july-6', 81.0, 'Dela – July 6'),
    ('vair-drop', 18.0, 'Vair Studios'),
    ('laurier-gameday', 7.9, 'Laurier game day'),
    ('ten-fold', 106.6, 'TGK – Ten Fold'),
    ('tec', 13.2, '10k Moss – TEC'),
    ('moksha-festival', 42.0, 'Moksha festival'),
    ('july-6', 85.8, 'Dela – July 6'),
    ('laurier-gameday', 14.6, 'Laurier game day'),
]

inputs, chains = [], []
for i, (slug, t, _) in enumerate(MOMENTS):
    inputs += ['-ss', str(t), '-t', str(CLIP), '-i', SRC[slug]]
    z = ZOOM.get(slug, 1)
    crop = f'crop=iw*{z}:ih*{z},' if z != 1 else ''
    chains.append(f'[{i}:v]{crop}scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos,crop={W}:{H},setsar=1,fps=30,format=yuv420p[v{i}]')
graph = ';'.join(chains) + ';' + ''.join(f'[v{i}]' for i in range(len(MOMENTS))) + f'concat=n={len(MOMENTS)}:v=1:a=0[out]'

base = ['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', graph, '-map', '[out]', '-an']
subprocess.run([*base, '-c:v', 'libx264', '-preset', 'slow', '-crf', '29', '-maxrate', '1.7M', '-bufsize', '3.4M', '-movflags', '+faststart', str(VID / 'hero-reel.mp4')], check=True)
subprocess.run([*base, '-c:v', 'libvpx-vp9', '-b:v', '1.5M', '-crf', '42', '-row-mt', '1', str(VID / 'hero-reel.webm')], check=True)
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

clips = [{'start': round(i * CLIP, 2), 'slug': slug, 'label': label} for i, (slug, _, label) in enumerate(MOMENTS)]
(ROOT / 'src/content/heroReel.json').write_text(json.dumps({'clipSeconds': CLIP, **names, 'clips': clips}, ensure_ascii=False, indent=1), encoding='utf-8')
for path in names.values():
    print(path, f'{(ROOT / "public" / path.lstrip("/")).stat().st_size / 1e6:.2f} MB')
