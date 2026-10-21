"""Convert PNG/JPG under the given folders to WebP (max 1600px wide) and delete the originals."""
import sys
from pathlib import Path
from PIL import Image

total_in = total_out = 0
for folder in sys.argv[1:]:
    for src in sorted(Path(folder).rglob('*')):
        if src.suffix.lower() not in ('.png', '.jpg', '.jpeg'):
            continue
        dst = src.with_suffix('.webp')
        with Image.open(src) as im:
            if im.width > 1600:
                im = im.resize((1600, round(im.height * 1600 / im.width)), Image.LANCZOS)
            im.save(dst, 'WEBP', quality=82, method=6)
        total_in += src.stat().st_size
        total_out += dst.stat().st_size
        src.unlink()
print(f'{total_in / 1e6:.1f} MB -> {total_out / 1e6:.1f} MB')
