"""Read saved PDF-viewer HTML as inert text; never execute its scripts."""
import json
import re
import sys
from html.parser import HTMLParser

class AuditParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.pages = []
        self.depth = 0
        self.active = None
        self.skip = 0
        self.spans = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ('script', 'style'):
            self.skip += 1
        if tag == 'span':
            x = re.search(r'left:.*?\*([\d.]+)px', attrs.get('style', ''))
            self.spans.append(float(x.group(1)) if x else None)
        if tag == 'div':
            self.depth += 1
            if attrs.get('data-artifact-pdf-page') == 'true':
                self.active = {'number': int(attrs['data-page-number']), 'text': [], 'runs': [], 'depth': self.depth}
    def handle_endtag(self, tag):
        if tag in ('script', 'style'):
            self.skip -= 1
        if tag == 'span' and self.spans:
            self.spans.pop()
        if tag == 'div':
            if self.active and self.depth == self.active['depth']:
                self.pages.append({'number': self.active['number'], 'text': '\n'.join(self.active['text']), 'runs': self.active['runs']})
                self.active = None
            self.depth -= 1
    def handle_data(self, text):
        if self.active and not self.skip and text.strip():
            self.active['text'].append(text.strip())
            if self.spans and self.spans[-1] is not None:
                self.active['runs'].append({'x': self.spans[-1], 'text': text.strip()})

parser = AuditParser()
with open(sys.argv[1], encoding='utf8') as source:
    parser.feed(source.read())
findings = []
for page in parser.pages:
    runs = page.pop('runs')
    columns = {r['text']: r['x'] for r in runs if r['text'] in ('Priority', 'Verified finding', 'Recommended correction')}
    if len(columns) != 3:
        continue
    current = None
    for run in runs:
        text, x = run['text'], run['x']
        if re.fullmatch(r'A\d{2}', text) and x < columns['Priority']:
            if current:
                findings.append(current)
            current = {'id': text, 'severity': '', 'title': [], 'recommendation': [], 'sourcePage': page['number']}
        elif current:
            if x < columns['Priority']:
                findings.append(current)
                current = None
            elif text in ('High', 'Medium', 'Low') and x < columns['Verified finding']:
                current['severity'] = text
            elif x >= columns['Recommended correction']:
                current['recommendation'].append(text)
            elif x >= columns['Verified finding']:
                current['title'].append(text)
    if current:
        findings.append(current)
for finding in findings:
    finding['title'] = ' '.join(finding['title'])
    finding['recommendation'] = ' '.join(finding['recommendation'])
print(json.dumps({'pages': parser.pages, 'findings': [f for f in findings if f['title'] and f['severity']]}))
