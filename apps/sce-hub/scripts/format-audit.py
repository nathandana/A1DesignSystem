"""Reconstruct the supplied audit's typed text, headings and tables from its PDF.

Layout measurements identify source formatting, not new findings. Output remains
in the protected report record; no audit text is included in application assets.
"""
import json
import re
import sys
from pypdf import PdfReader

reader = PdfReader(sys.argv[1])
sections = []
current = {'id': 'introduction', 'title': 'Introduction', 'blocks': [], 'pages': []}
intro = current
paragraph = []
last_line = None


def escape(text):
    return re.sub(r'([\\`*_[\]<>|])', r'\\\1', text)


def join_lines(lines):
    result = ''
    for line in lines:
        line = line.strip()
        if not line:
            continue
        if result.endswith('-`') and line.startswith('`'):
            result = result[:-1] + line[1:]
        else:
            result += ('' if not result or result.endswith('-') else ' ') + line
    return result


def flush_paragraph():
    global paragraph
    if paragraph:
        current['blocks'].append({'type': 'text', 'text': join_lines(paragraph)})
        paragraph = []


def styled(chunk, links):
    text, x, y, size, font = chunk
    raw = text
    text = escape(text)
    if 'Mono' in font:
        text = '`' + raw + '`'
    elif 'Bold' in font:
        stripped = text.strip()
        text = (' ' if text.startswith(' ') else '') + '**' + stripped + '**' + (' ' if text.endswith(' ') else '')
    for rect, uri in links:
        if rect[0] - 1 <= x <= rect[2] and rect[1] - 2 <= y <= rect[3]:
            text = '[' + text.strip() + '](' + uri.replace(' ', '%20').replace(')', '%29') + ')'
            break
    return text


for number, page in enumerate(reader.pages, 1):
    chunks, links = [], []
    for annotation in page.get('/Annots', []):
        annotation = annotation.get_object()
        uri = annotation.get('/A', {}).get('/URI', '')
        if uri.startswith(('https://', 'http://')):
            links.append((list(map(float, annotation['/Rect'])), uri))

    def visitor(text, cm, tm, font, size):
        if text.strip() and tm[5] > 40:  # Omit repeating PDF footers/page numbers.
            chunks.append((text.rstrip('\n'), float(tm[4]), float(tm[5]), float(size), str((font or {}).get('/BaseFont', ''))))

    page.extract_text(visitor_text=visitor)
    index = 0
    while index < len(chunks):
        chunk = chunks[index]
        text, x, y, size, font = chunk
        if size >= 24:  # Document title is supplied by the page header.
            index += 1
            continue
        if size >= 13:
            flush_paragraph()
            last_line = None
            if size >= 18:
                current = {'id': 'section-' + str(len(sections) + 1), 'title': text.strip(), 'blocks': [], 'pages': [number]}
                sections.append(current)
            else:
                current['blocks'].append({'type': 'text', 'text': '### ' + escape(text.strip())})
            if number not in current['pages']:
                current['pages'].append(number)
            index += 1
            continue
        if number not in current['pages']:
            current['pages'].append(number)
        # Tables have 10-point bold headers at their inset left edge.
        if size == 10 and 'Bold' in font and 56 < x < 62:
            flush_paragraph()
            header, columns = [], []
            while index < len(chunks) and chunks[index][3] == 10 and 'Bold' in chunks[index][4] and abs(chunks[index][2] - y) < 1:
                header.append(escape(chunks[index][0].strip()))
                columns.append(chunks[index][1])
                index += 1
            rows, cells, previous_column = [], [[] for _ in columns], -1
            cell_y = [None for _ in columns]
            while index < len(chunks) and chunks[index][3] <= 10:
                cell = chunks[index]
                column = max(i for i, left in enumerate(columns) if cell[1] >= left - 1)
                if column < previous_column:
                    rows.append([join_lines(parts) for parts in cells])
                    cells, cell_y = [[] for _ in columns], [None for _ in columns]
                rendered = styled(cell, links)
                if cells[column] and cell_y[column] is not None and abs(cell_y[column] - cell[2]) < 1:
                    cells[column][-1] += rendered
                else:
                    cells[column].append(rendered)
                cell_y[column] = cell[2]
                previous_column = column
                index += 1
            if any(cells):
                rows.append([join_lines(parts) for parts in cells])
            # A repeated header across a page break continues the same table.
            previous = current['blocks'][-1] if current['blocks'] else None
            if previous and previous.get('type') == 'table' and previous['header'] == header:
                previous['rows'].extend(rows)
            else:
                current['blocks'].append({'type': 'table', 'header': header, 'rows': rows})
            last_line = None
            continue
        # Same-baseline fragments retain inline bold, code and source links.
        line = []
        while index < len(chunks) and abs(chunks[index][2] - y) < 1 and chunks[index][3] < 13:
            line.append(chunks[index]); index += 1
        bullet = line[0][0] in ('\uf0b7', '•')
        if bullet:
            flush_paragraph()
            line = line[1:]
        elif last_line and last_line[0] == number and last_line[1] - y > 18:
            flush_paragraph()
        rendered = ''.join(styled(item, links) for item in line)
        rendered = re.sub(r'(\*\*[SC]\d{2}\*\*)(?=\[)', r'\1 ', rendered)
        rendered = re.sub(r'(\*\*[^*]+:\*\*)(?=\[|\w)', r'\1 ', rendered)
        if bullet:
            rendered = '- ' + rendered
        paragraph.append(rendered)
        last_line = (number, y)
flush_paragraph()


def markdown(blocks):
    result = []
    for block in blocks:
        if block['type'] == 'table':
            result.append('\n'.join(['| ' + ' | '.join(block['header']) + ' |', '| ' + ' | '.join('---' for _ in block['header']) + ' |'] + ['| ' + ' | '.join(row) + ' |' for row in block['rows']]))
        else:
            result.append(block['text'])
    return '\n\n'.join(result)

print(json.dumps({'version': 1, 'intro': markdown(intro['blocks']), 'sections': [{**{k: v for k, v in section.items() if k != 'blocks'}, 'markdown': markdown(section['blocks'])} for section in sections], 'tables': [{'section': section['title'], 'columns': block['header'], 'rows': len(block['rows'])} for section in sections for block in section['blocks'] if block['type'] == 'table']}))
