"""Phone-sized copies of the media case pages play on their own, and the size of every gallery still.

Run: python -I scripts/phone_media.py   (again after adding or replacing a loop or a gallery image; the build fails
on a page that points at a missing file)
- Loops (a project's `loop` and any .mp4 in a gallery) -> <name>-phone.mp4, fitted inside 960x960 at x264 CRF 26 capped
  at 2 Mbps (a 1.2 Mbps cap starved the busiest footage: VMAF 89 on CANWE). Work.tsx serves it to screens up to 760 px
  wide; the 1080p Laurier opener alone was 7.6 MB on a phone (now 1.1 MB).
- Gallery stills wider than 1200 px -> <name>-phone.webp, 1200 px wide (Work.tsx offers it in srcset). Stills of the
  projects the home strip draws from (its stills('...') calls in Home.tsx) taller than 760 px -> <name>-strip.webp,
  760 px tall: the strip shows them at most 380 px tall.
- src/content/imageSizes.json: [width, height] of every gallery still, so pages hold its space before it loads.
Outputs newer than their source are kept.
"""
import json
import re
import subprocess
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PUB = ROOT / 'public'
LOOP_BOX, PHONE_W, STRIP_H = 960, 1200, 760  # PHONE_W and STRIP_H are repeated in Work.tsx and Strip.tsx

site = (ROOT / 'src/content/site.ts').read_text(encoding='utf-8')
loops = re.findall(r"loop: '(/assets/[^']+\.mp4)'", site)
# slug -> gallery paths; the lookahead keeps a match inside one project
galleries = {slug: re.findall(r"'(/assets/[^']+)'", g) for slug, g in re.findall(r"slug: '([^']+)'(?:(?!slug: ')[\s\S])*?gallery: \[([^\]]*)\]", site)}
gallery = [p for g in galleries.values() for p in g]
home = (ROOT / 'src/pages/Home.tsx').read_text(encoding='utf-8')
strip = {p for call in re.findall(r'stills\(([^)]*)\)', home) for slug in re.findall(r"'([^']+)'", call) for p in galleries[slug]}


def stale(src, dst):
    return not dst.exists() or dst.stat().st_mtime < src.stat().st_mtime


def colour(src):
    """The source's matrix and range as a browser reads them: its own tags, or BT.709 limited when untagged."""
    out = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=color_space,color_range',
                          '-of', 'default=nw=1', str(src)], capture_output=True, text=True).stdout
    tags = dict(line.split('=', 1) for line in out.split() if '=' in line)
    return ('bt601' if tags.get('color_space') in ('bt470bg', 'smpte170m') else 'bt709'), ('pc' if tags.get('color_range') == 'pc' else 'tv')


for p in sorted(set(loops) | {g for g in gallery if g.endswith('.mp4')}):
    src = PUB / p.lstrip('/')
    dst = src.with_name(src.stem + '-phone.mp4')
    if not stale(src, dst):
        continue
    m, r = colour(src)
    # explicit matrices and tags: this ffmpeg reads untagged input as BT.601 and ignores -color_* flags on output
    vf = (f"scale='min({LOOP_BOX},iw)':'min({LOOP_BOX},ih)':force_original_aspect_ratio=decrease:force_divisible_by=2"
          f':flags=lanczos+accurate_rnd:in_color_matrix={m}:out_color_matrix=bt709:in_range={r}:out_range=tv,'
          'setparams=range=tv:color_primaries=bt709:color_trc=bt709:colorspace=bt709')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(src), '-vf', vf, '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '26',
                    '-maxrate', '2M', '-bufsize', '4M', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(dst)], check=True)
    print(f'{dst.name}: {src.stat().st_size / 1e6:.1f} -> {dst.stat().st_size / 1e6:.1f} MB', flush=True)

sizes = {}
for p in sorted({g for g in gallery if g.endswith('.webp')}):
    src = PUB / p.lstrip('/')
    with Image.open(src) as im:
        w, h = sizes[p] = im.size
        for suffix, k in (('-phone', PHONE_W / w), ('-strip', STRIP_H / h if p in strip else 1)):
            dst = src.with_name(src.stem + suffix + '.webp')
            if k >= 1 or not stale(src, dst):
                continue
            alpha = im.mode == 'RGBA'
            # resize with premultiplied alpha, so transparent edges don't pick up dark fringes
            small = (im.convert('RGBa') if alpha else im.convert('RGB')).resize((round(w * k), round(h * k)), Image.LANCZOS)
            extra = {'icc_profile': im.info['icc_profile']} if im.info.get('icc_profile') else {}
            (small.convert('RGBA') if alpha else small).save(dst, 'WEBP', quality=82, method=6, **extra)
            print(f'{dst.name}: {src.stat().st_size // 1024} -> {dst.stat().st_size // 1024} KB', flush=True)

(ROOT / 'src/content/imageSizes.json').write_text(
    '{\n' + ',\n'.join(f'  {json.dumps(p)}: [{w}, {h}]' for p, (w, h) in sizes.items()) + '\n}\n', encoding='utf-8')
print(len(sizes), 'gallery stills sized')
