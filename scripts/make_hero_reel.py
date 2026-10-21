"""Cut the hero showreel: ~1.8 s moments from the featured videos, 16:9, looped, no audio.

Run: python -I scripts/make_hero_reel.py
Writes public/assets/videos/hero-reel-<hash>.{webm,mp4} + poster (hashed names, so a new cut is never served
from a visitor's cache) and src/content/heroReel.json
(clip start times + labels, so the viewfinder can show which project is on screen and link to it).
Sources are the masters in Downloads, Portfolio-Archive and Z: on Solomon's PC.

- Each moment is an exact frame count at 30 fps, so it can end on the source's own cut instead of flashing the next
  shot, and the JSON start times match the video exactly.
- Vertical (9:16) masters give a full-width 16:9 band at a per-moment height (yoff, 0 top .. 1 bottom).
- Colour: every input is scaled with its own matrix and range into BT.709 limited and the outputs are tagged BT.709
  (left to itself ffmpeg reads untagged masters as BT.601 and shifts them); accurate_rnd removes a +1-1.6 level
  red/blue lift from swscale's default chroma rounding.
- The poster goes YUV -> RGB with the BT.709 matrix before WebP (WebP decodes with BT.601).
Round 2 (2026-10-21): cut A, picked blind by three judges over the old cut and an alternative.
"""
import hashlib
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VID = ROOT / 'public/assets/videos'
FPS = 30
CLIP = 1.8  # nominal seconds per moment (54 frames)
W, H = 1280, 720
DL = 'C:/Users/Administrator/Downloads/'
VE = 'Z:/Creative Projects & Footage/Video_Exports/'
PA = 'C:/Users/Administrator/Portfolio-Archive/'
AIR = 'D:/Blender_Ecosystem/LAURIER_GAMEDAY_2026_DELIVERY_STAGING/01_OCT17_CARLETON_SENIOR-DAY/FINAL_DELIVERABLES_FOR_EVAN/02_AIR_MASTERS_PRORES_422HQ/'
SRC = {
    'barbershop-promo': PA + 'logo work + desc_/RONCUTS.mp4',  # 85 Mbps master, 1080x1920
    'club-event': DL + 'Video/NYE EVENT FINAL.mp4',
    'no-captains-orders': DL + 'Video/SaveInta.com_AQNn3y06MVItQqrHLg9Y6_RuNiPABvg8C5Ux1jO3JEDRveZ-JM8ZUK27qbf_QEALWbJrDAhZoaqflpyT4U2hpaMj.mp4',
    'laurier-basketball': PA + '_triage/selection/local-copies/lakehead.mp4',  # = G:/My Drive/laurier v lakehead ... v2.mp4
    'tec': DL + 'Video/10KMOSS TEC APR 14 REF 1_5.mp4',  # 4K REF export; the release download runs 3.59 s later
    'laurier-opener': AIR + '01_LaurierVsCarleton_Cinematic_Opener_ProRes422HQ.mov',  # aired Oct 17
    'kenoh-mexico': VE + 'jv_kenoh_mexico.mp4',
    'vair-drop': PA + 'logo work + desc_/vair studios 1.mp4',
    'moksha-festival': DL + 'Video/moksha promo v4.mp4',
    'kenoh-fanned-out': DL + 'KENOH - FANNED OUT final.mp4',
}
SLUG = {'laurier-opener': 'laurier-gameday'}  # source key -> site.ts slug, where they differ
TAGS = ['-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv']

# (source key, start second, label, frames at 30 fps, yoff for a 9:16 master). Start times sit just after a source cut.
# The client's own world first: barbershop transformation, club, a product ad and game night inside 7 s;
# Moksha (edit only) comes late.
MOMENTS = [
    ('barbershop-promo', 49.90, 'Barbershop promo', 52, 0.30),  # gold-mask razor line-up, then the finished fade; ends on its cut
    ('club-event', 18.01, 'NYE club night', 47, 0.50),  # DJ hands: laptop, mixer, decks; stops 2 frames before the white flash
    ('no-captains-orders', 7.38, 'No Captain’s Orders', 54, None),  # CG wine erupts around the bottle (stops before the dissolve)
    ('laurier-basketball', 20.70, 'Laurier basketball', 54, 0.28),  # drive, layup, the ball drops through the net
    ('tec', 52.76, '10k Moss – TEC', 54, None),  # money rain in the built teal loading-bay set
    ('laurier-opener', 3.00, 'Laurier game day', 54, None),  # glossy 3D Golden Hawks helmet in purple smoke
    ('kenoh-mexico', 129.50, 'JV & Kenoh – Mexico', 54, None),  # wide-angle duo, white kitchen
    ('vair-drop', 19.55, 'Vair Studios', 54, None),  # two drop hoodies walk off up the teal stairs (after the leak fades)
    ('moksha-festival', 37.06, 'Moksha festival', 54, None),  # performer, glow-stick crowd, stage and CO2
    ('kenoh-fanned-out', 121.92, 'Kenoh – Fanned Out', 54, None),  # hood up at the Escalade door, golden hour
]


def probe(src):
    j = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height',
                                   '-of', 'json', src], capture_output=True, text=True).stdout)['streams'][0]
    return j['width'], j['height']


def color_in(src):
    """How a browser reads the source: its own tag, or BT.709 limited for untagged HD."""
    out = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=color_space,color_range',
                          '-of', 'default=nw=1', src], capture_output=True, text=True).stdout
    tags = dict(line.split('=', 1) for line in out.split() if '=' in line)  # ffprobe picks the field order, so read by name
    return ('bt601' if tags.get('color_space') in ('bt470bg', 'smpte170m') else 'bt709'), ('pc' if tags.get('color_range') == 'pc' else 'tv')


def chain(i, key, yoff, frames):
    """Input i -> exactly `frames` frames of 1280x720 yuv420p BT.709 limited at 30 fps."""
    src = SRC[key]
    w, h = probe(src)
    pre = ''
    if w / h < 16 / 9 and yoff is not None:  # tall master: take a full-width 16:9 band at the moment's height
        bh = round(w * 9 / 16 / 2) * 2
        pre = f'crop={w}:{bh}:0:{round((h - bh) * yoff / 2) * 2},'
    m, r = color_in(src)
    return (f'[{i}:v]{pre}scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos+accurate_rnd:in_color_matrix={m}:out_color_matrix=bt709'
            f':in_range={r}:out_range=tv,crop={W}:{H},setsar=1,fps={FPS},trim=end_frame={frames},setpts=PTS-STARTPTS,format=yuv420p[v{i}]')


inputs, chains = [], []
for i, (key, t, _, frames, yoff) in enumerate(MOMENTS):
    inputs += ['-ss', f'{t:.3f}', '-t', f'{frames / FPS + 0.5:.3f}', '-i', SRC[key]]
    chains.append(chain(i, key, yoff, frames))
graph = ';'.join(chains) + ';' + ''.join(f'[v{i}]' for i in range(len(MOMENTS))) + f'concat=n={len(MOMENTS)}:v=1:a=0[out]'

base = ['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', graph, '-map', '[out]', '-an']
subprocess.run([*base, '-c:v', 'libx264', '-preset', 'slow', '-crf', '29', '-maxrate', '1.7M', '-bufsize', '3.4M', *TAGS,
                '-movflags', '+faststart', str(VID / 'hero-reel.mp4')], check=True)
subprocess.run([*base, '-c:v', 'libvpx-vp9', '-b:v', '1.5M', '-crf', '42', '-row-mt', '1', *TAGS, str(VID / 'hero-reel.webm')], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', '0.4', '-i', str(VID / 'hero-reel.mp4'), '-frames:v', '1', '-vf',
                f'scale={W}:{H}:in_color_matrix=bt709:in_range=tv,format=bgra', '-c:v', 'libwebp', '-quality', '80',
                str(VID / 'hero-reel-poster.webp')], check=True)

total = sum(m[3] for m in MOMENTS)
n = int(subprocess.run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_frames',
                        '-of', 'csv=p=0', str(VID / 'hero-reel.mp4')], capture_output=True, text=True).stdout)
assert n == total, f'{n} frames in the mp4, expected {total}: clip start times would drift'

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

clips, frame = [], 0
for key, _, label, frames, _ in MOMENTS:
    clips.append({'start': round(frame / FPS, 2), 'slug': SLUG.get(key, key), 'label': label})
    frame += frames
(ROOT / 'src/content/heroReel.json').write_text(json.dumps({'clipSeconds': CLIP, **names, 'clips': clips}, ensure_ascii=False, indent=1), encoding='utf-8')
for path in names.values():
    print(path, f'{(ROOT / "public" / path.lstrip("/")).stat().st_size / 1e6:.2f} MB')
