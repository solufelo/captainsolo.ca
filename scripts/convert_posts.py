"""One-off: turn the scraped June 2026 build (pages.json) into src/content/posts.json (+ post-bodies.json, the text).

Run: python -I scripts/convert_posts.py <pages.json> src/content/posts.json
"""
import html
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

OLD_ORIGINS = ('https://captainsolo-ca.pages.dev', 'https://captainsolo.ca')
KEEP = {'h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li', 'a', 'strong', 'em', 'b', 'i', 'blockquote', 'code', 'pre',
        'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img', 'figure', 'figcaption', 'br', 'hr', 'time'}
VOID = {'img', 'br', 'hr'}
# Old wrappers that carried meaning through Tailwind classes, mapped to the new site's classes.
CLASS_MAP = [('bg-gradient', 'aside', 'cta'), ('border-l-4', 'div', 'callout'),
             ('border-2', 'div', 'box'), ('bg-gray-100', 'div', 'box'), ('bg-blue-50', 'div', 'box')]
DROP_SUBTREE = {'nav', 'header', 'script', 'style', 'svg', 'button', 'form', 'input'}


class Cleaner(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out, self.stack, self.drop = [], [], 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if self.drop:
            if tag not in VOID:
                self.drop += 1
            return
        if tag in DROP_SUBTREE or (tag == 'h1'):
            if tag not in VOID:
                self.drop = 1
            return
        cls = a.get('class') or ''
        mapped = next(((t, c) for key, t, c in CLASS_MAP if key in cls), None) if tag in ('div', 'section') else None
        if mapped:
            self.out.append(f'<{mapped[0]} class="{mapped[1]}">')
            self.stack.append(mapped[0])
            return
        if tag not in KEEP:
            self.stack.append(None)  # unwrap
            return
        keep = {}
        if tag == 'a':
            href = a.get('href') or ''
            for o in OLD_ORIGINS:
                if href.startswith(o):
                    href = href[len(o):] or '/'
            keep['href'] = href
            if href.startswith('http'):
                keep['target'] = '_blank'
                keep['rel'] = 'noopener noreferrer'
        elif tag == 'img':
            src = a.get('src') or ''
            if src.startswith('/images/'):  # scripts/to_webp.py converted these
                src = re.sub(r'\.(png|jpe?g)$', '.webp', src)
            keep = {'src': src, 'alt': a.get('alt') or '', 'loading': 'lazy'}
        elif tag == 'time' and a.get('datetime'):
            keep['datetime'] = a['datetime']
        elif tag in ('td', 'th'):
            keep = {k: v for k, v in a.items() if k in ('colspan', 'rowspan')}
        attr = ''.join(f' {k}="{html.escape(v, quote=True)}"' for k, v in keep.items())
        self.out.append(f'<{tag}{attr}>')
        if tag not in VOID:
            self.stack.append(tag)

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if self.drop:
            self.drop -= 1
            return
        if self.stack:
            t = self.stack.pop()
            if t:
                self.out.append(f'</{t}>')

    def handle_data(self, data):
        if not self.drop:
            self.out.append(html.escape(data, quote=False))


def clean(fragment):
    c = Cleaner()
    c.feed(fragment)
    s = ''.join(c.out)
    parts = re.split(r'(<code>[\s\S]*?</code>)', s)
    s = ''.join(x if x.startswith('<code>') else re.sub(r'\s+', ' ', x) for x in parts)
    # The old site styled multi-line prompts as blocks; give them real <pre>.
    s = re.sub(r'<code>([^<]*\n[^<]*)</code>', lambda m: '<pre><code>' + m.group(1).strip() + '</code></pre>', s)
    s = s.replace('View Fullscreen', '')
    s = re.sub(r'<h3>[^<]*Table of Contents</h3>', '', s)  # its list lived in a dropped <nav>
    s = re.sub(r'<(p|li|h[2-4]|strong|em|div|aside)[^>]*>\s*</\1>', '', s)  # empty leftovers
    return s.strip()


def drop_related(fragment):
    # "Related Articles" sections are regenerated from metadata in the new site.
    return re.sub(r'<section[^>]*>\s*<h2[^>]*>\s*Related (Articles|Posts|Reading)[\s\S]*?</section>', '', fragment)


def cards(blog_html):
    out = {}
    for m in re.finditer(r'<a[^>]*href="(/blog/[^"]+)"[^>]*>([\s\S]*?)</a>', blog_html):
        slug, inner = m.group(1).split('/')[-1], m.group(2)
        texts = lambda pat: [html.unescape(re.sub('<[^>]+>', '', x)).strip() for x in re.findall(pat, inner)]
        spans, h3, ps = texts(r'<span[^>]*>([\s\S]*?)</span>'), texts(r'<h3[^>]*>([\s\S]*?)</h3>'), texts(r'<p[^>]*>([\s\S]*?)</p>')
        dt = re.search(r'datetime="([^"]+)"', inner)
        if h3 and slug not in out:
            out[slug] = {'category': spans[0] if spans else '', 'readTime': spans[1] if len(spans) > 1 else '',
                         'title': h3[0], 'excerpt': ps[0] if ps else '', 'date': dt.group(1) if dt else ''}
    return out


def main(src, dst):
    data = json.load(open(src, encoding='utf-8'))
    pages = data['result']
    meta = cards(pages['/blog']['main'])
    posts = []
    for route in data['slugs']:
        slug = route.split('/')[-1]
        page = pages[route]
        body = clean(drop_related(page['main']))
        assert len(body) > 1500, (slug, len(body))
        m = meta[slug]
        posts.append({'slug': slug, **m, 'heading': page['h1'].strip(),
                      'seoTitle': page['title'], 'description': page['description'] or m['excerpt'], 'html': body})
    posts.sort(key=lambda p: p['date'], reverse=True)
    for p in posts:
        print(p['date'], p['category'].ljust(26), p['slug'], len(p['html']))
    # the text goes in its own file, which only the post page loads (src/content/postBody.ts)
    bodies = {p['slug']: p.pop('html') for p in posts}
    json.dump(posts, open(dst, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    json.dump(bodies, open(Path(dst).with_name('post-bodies.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main(*sys.argv[1:3])
