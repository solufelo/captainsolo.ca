"""Cut the hero showreel: ~1.8 s moments from the featured videos, looped, no audio, in two shapes from one moment list:
16:9 for wide screens and 9:16 for phones (same frame counts, so the clip labels line up in both).

Run: python -I scripts/make_hero_reel.py
Writes public/assets/videos/hero-reel-<hash>{,-tall}.{webm,mp4} + posters (hashed names, so a new cut is never served
from a visitor's cache) and src/content/heroReel.json
(clip start times + labels, so the viewfinder can show which project is on screen and link to it).
Sources are the masters in Downloads, Portfolio-Archive and Z: on Solomon's PC.

- Each moment is an exact frame count at 30 fps, so it can end on the source's own cut instead of flashing the next
  shot, and the JSON start times match the video exactly.
- Wide cut: vertical (9:16) masters give a full-width 16:9 band at a per-moment height (yoff, 0 top .. 1 bottom).
  Phone cut: vertical masters fill the frame; 16:9 masters give a full-height 9:16 window at x (0 left .. 1 right),
  or panning from one x to another to follow the subject.
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
import tempfile
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

# (source key, start second, label, frames at 30 fps, yoff for a 9:16 master in the wide cut, x for a 16:9 master in the
# phone cut: one value, or (from, to) to pan; None = a 9:16 master, which fills the phone frame). Start times sit just
# after a source cut. The client's own world first: barbershop transformation, club, a product ad and game night inside
# 7 s; Moksha (edit only) comes late.
MOMENTS = [
    ('barbershop-promo', 49.90, 'Barbershop promo', 52, 0.30, None),  # gold-mask razor line-up, then the finished fade; ends on its cut
    ('club-event', 18.01, 'NYE club night', 47, 0.50, None),  # DJ hands: laptop, mixer, decks; stops 2 frames before the white flash
    ('no-captains-orders', 7.38, 'No Captain’s Orders', 54, None, 0.5),  # CG wine erupts around the bottle (stops before the dissolve)
    ('laurier-basketball', 20.70, 'Laurier basketball', 54, 0.28, None),  # drive, layup, the ball drops through the net
    ('tec', 52.76, '10k Moss – TEC', 54, None, 0.4),  # money rain in the built teal loading-bay set; the artist sits left of centre
    ('laurier-opener', 3.00, 'Laurier game day', 54, None, 0.35),  # glossy 3D Golden Hawks helmet in purple smoke; keeps the hawk
    ('kenoh-mexico', 129.50, 'J.V & Kenoh – Mexico', 54, None, (1.0, 0.75)),  # wide two-shot; the phone cut follows the red cap
    ('vair-drop', 19.55, 'Vair Studios', 54, None, 0.85),  # two drop hoodies walk off up the teal stairs; the phone keeps one VAIR back
    ('moksha-festival', 37.06, 'Moksha festival', 54, None, 0.4),  # performer, glow-stick crowd, stage and CO2
    ('kenoh-fanned-out', 121.92, 'Kenoh – Fanned Out', 54, None, 0.45),  # hood up at the Escalade door, golden hour
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


def chain(i, key, yoff, frames, xs, tall):
    """Input i -> exactly `frames` frames at 30 fps, BT.709 limited: 1280x720, or 720x1280 for the phone cut."""
    src = SRC[key]
    w, h = probe(src)
    ow, oh = (H, W) if tall else (W, H)
    pre = ''
    if not tall and w / h < 16 / 9 and yoff is not None:  # tall master: take a full-width 16:9 band at the moment's height
        bh = round(w * 9 / 16 / 2) * 2
        pre = f'crop={w}:{bh}:0:{round((h - bh) * yoff / 2) * 2},'
    if tall and xs is not None:  # wide master: a full-height 9:16 window, panning across the moment when given (from, to)
        cw = round(h * 9 / 16 / 2) * 2
        x0, x1 = xs if isinstance(xs, tuple) else (xs, xs)
        pre = f"crop={cw}:{h}:'({w}-{cw})*({x0}+({x1}-{x0})*min(max(t,0)/{frames / FPS:.3f},1))':0,"
    m, r = color_in(src)
    return (f'[{i}:v]{pre}scale={ow}:{oh}:force_original_aspect_ratio=increase:flags=lanczos+accurate_rnd:in_color_matrix={m}:out_color_matrix=bt709'
            f':in_range={r}:out_range=tv,crop={ow}:{oh},setsar=1,fps={FPS},trim=end_frame={frames},setpts=PTS-STARTPTS,format=yuv420p[v{i}]')


def encode(tall):
    """Write VID/hero-reel{-tall}.{mp4,webm} and its poster; the mp4 must hold exactly the moments' frames."""
    tag = '-tall' if tall else ''
    inputs, chains = [], []
    for i, (key, t, _, frames, yoff, xs) in enumerate(MOMENTS):
        inputs += ['-ss', f'{t:.3f}', '-t', f'{frames / FPS + 0.5:.3f}', '-i', SRC[key]]
        chains.append(chain(i, key, yoff, frames, xs, tall))
    graph = ';'.join(chains) + ';' + ''.join(f'[v{i}]' for i in range(len(MOMENTS))) + f'concat=n={len(MOMENTS)}:v=1:a=0[out]'
    base = ['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', graph, '-map', '[out]', '-an']
    mp4 = VID / f'hero-reel{tag}.mp4'
    subprocess.run([*base, '-c:v', 'libx264', '-preset', 'slow', '-crf', '29', '-maxrate', '1.7M', '-bufsize', '3.4M', *TAGS,
                    '-movflags', '+faststart', str(mp4)], check=True)
    webm = str(VID / f'hero-reel{tag}.webm')
    if tall:
        # Phones: two passes keep the one-pass picture (VMAF 97.3 on the phone model, worst frame better) at 2.0 MB instead of
        # 2.7 MB, the biggest download on a phone's first visit (2026-10-22 audit; 540x960 at 600k scored 89.7).
        vp9 = ['-c:v', 'libvpx-vp9', '-b:v', '900k', '-crf', '42', '-row-mt', '1', '-auto-alt-ref', '1', '-lag-in-frames', '25', *TAGS]
        with tempfile.TemporaryDirectory() as tmp:
            log = str(Path(tmp) / 'vp9')
            subprocess.run([*base, *vp9, '-pass', '1', '-passlogfile', log, '-f', 'null', '-'], check=True)
            subprocess.run([*base, *vp9, '-pass', '2', '-passlogfile', log, webm], check=True)
    else:
        subprocess.run([*base, '-c:v', 'libvpx-vp9', '-b:v', '1.5M', '-crf', '42', '-row-mt', '1', *TAGS, webm], check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', '0.4', '-i', str(mp4), '-frames:v', '1', '-vf',
                    'scale=in_color_matrix=bt709:in_range=tv,format=bgra', '-c:v', 'libwebp', '-quality', '80',
                    str(VID / f'hero-reel{tag}-poster.webp')], check=True)
    total = sum(m[3] for m in MOMENTS)
    n = int(subprocess.run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_frames',
                            '-of', 'csv=p=0', str(mp4)], capture_output=True, text=True).stdout)
    assert n == total, f'{mp4.name}: {n} frames, expected {total}: clip start times would drift'


encode(tall=False)
encode(tall=True)

# content-hash all four cuts (the names are cached for a year, so a re-encoded phone cut needs a new one); drop older cuts
digest = hashlib.sha1(b''.join((VID / f'hero-reel{t}.{e}').read_bytes() for t in ('', '-tall') for e in ('mp4', 'webm'))).hexdigest()[:8]
for old in VID.glob('hero-reel-*'):
    if re.fullmatch(r'hero-reel-[0-9a-f]{8}(-tall)?(-poster)?\.(mp4|webm|webp)', old.name):
        old.unlink()
names = {'': {}, '-tall': {}}
for tag in names:
    for kind, src in [('webm', f'hero-reel{tag}.webm'), ('mp4', f'hero-reel{tag}.mp4'), ('poster', f'hero-reel{tag}-poster.webp')]:
        dst = src.replace('hero-reel', f'hero-reel-{digest}', 1)
        (VID / src).rename(VID / dst)
        names[tag][kind] = f'/assets/videos/{dst}'

clips, frame = [], 0
for key, _, label, frames, _, _ in MOMENTS:
    clips.append({'start': round(frame / FPS, 2), 'slug': SLUG.get(key, key), 'label': label})
    frame += frames
reel = {'clipSeconds': CLIP, **names[''], 'tall': names['-tall'], 'clips': clips}
(ROOT / 'src/content/heroReel.json').write_text(json.dumps(reel, ensure_ascii=False, indent=1), encoding='utf-8')
for path in [*names[''].values(), *names['-tall'].values()]:
    print(path, f'{(ROOT / "public" / path.lstrip("/")).stat().st_size / 1e6:.2f} MB')
