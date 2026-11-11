"""Create screen-sized WebP copies; preserve original source files."""
import json
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
files = sorted((root / 'assets/img/recuerdo').glob('*.webp'))
files += sorted((root / 'assets/img/recuerdo/collage').glob('*.webp'))
files += sorted((root / 'assets/img/nebo').glob('*.webp'))
files += [root / 'assets/img/cases/aspro-05@2x.webp']
sources = {}
for path in files:
    # Only files displayed in the current cases need responsive copies.
    if path.name.startswith('logo_') or path.name == 'hero.webp':
        continue
    with Image.open(path) as image:
        width, height = image.size
        variants = []
        for target in (640, 1280, 1920):
            if target >= width:
                continue
            dest = path.parent / 'responsive' / f'{path.stem}-{target}.webp'
            dest.parent.mkdir(exist_ok=True)
            resized = image.resize((target, round(height * target / width)), Image.Resampling.LANCZOS)
            resized.save(dest, 'WEBP', quality=88, method=6)
            variants.append({'src': '/' + dest.relative_to(root).as_posix(), 'width': target})
        variants.append({'src': '/' + path.relative_to(root).as_posix(), 'width': width})
        sources['/' + path.relative_to(root).as_posix()] = {'width': width, 'height': height, 'variants': variants}
(root / 'assets/js/case-images.js').write_text('window.CASE_IMAGE_SOURCES = ' + json.dumps(sources, ensure_ascii=False, separators=(',', ':')) + ';\n')
print(f'Prepared {len(sources)} case images')
