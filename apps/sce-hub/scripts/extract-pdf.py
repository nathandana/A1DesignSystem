"""Local optional pypdf extractor. Supports JSON page output or pdftotext's CLI shape."""
import json
import sys
from pypdf import PdfReader

args = [arg for arg in sys.argv[1:] if arg not in ('-layout', '-', '--json')]
if len(args) != 1:
    raise SystemExit('Usage: extract-pdf.py [--json] [-layout] input.pdf [-]')
reader = PdfReader(args[0])
pages = [{'number': i + 1, 'text': page.extract_text() or ''} for i, page in enumerate(reader.pages)]
if '--json' in sys.argv:
    print(json.dumps(pages))
else:
    print('\n\n'.join(page['text'] for page in pages))
