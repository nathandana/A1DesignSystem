import assert from 'node:assert/strict';
import test from 'node:test';
import {
  PROJECT_SCREEN_GAP,
  PROJECT_SECTION_GAP,
  PROJECT_SECTION_PADDING,
  horizontalProjectSectionLayout,
  nextProjectSectionY,
} from '../src/pure/project-layout.js';

test('packs every project screen horizontally with A1 spacing and no overlap', () => {
  const layout = horizontalProjectSectionLayout([
    { width: 320, height: 800 },
    { width: 768, height: 640 },
    { width: 1440, height: 1200 },
  ]);

  assert.deepEqual(layout.items, [
    { x: PROJECT_SECTION_PADDING, y: PROJECT_SECTION_PADDING, width: 320, height: 800 },
    { x: PROJECT_SECTION_PADDING + 320 + PROJECT_SCREEN_GAP, y: PROJECT_SECTION_PADDING, width: 768, height: 640 },
    { x: PROJECT_SECTION_PADDING + 320 + PROJECT_SCREEN_GAP + 768 + PROJECT_SCREEN_GAP, y: PROJECT_SECTION_PADDING, width: 1440, height: 1200 },
  ]);
  assert.equal(layout.width, (PROJECT_SECTION_PADDING * 2) + 320 + 768 + 1440 + (PROJECT_SCREEN_GAP * 2));
  assert.equal(layout.height, (PROJECT_SECTION_PADDING * 2) + 1200);

  for (let index = 1; index < layout.items.length; index += 1) {
    const previous = layout.items[index - 1];
    const current = layout.items[index];
    assert.ok(previous.x + previous.width < current.x);
  }
});

test('stacks named page sections vertically without overlap', () => {
  const firstY = 240;
  const firstHeight = 1200;
  const secondY = nextProjectSectionY(firstY, firstHeight);
  assert.equal(secondY, firstY + firstHeight + PROJECT_SECTION_GAP);
  assert.ok(firstY + firstHeight < secondY);
});

test('normalizes invalid screen dimensions before calculating section bounds', () => {
  const layout = horizontalProjectSectionLayout([{ width: 0, height: Number.NaN }]);
  assert.deepEqual(layout.items[0], {
    x: PROJECT_SECTION_PADDING,
    y: PROJECT_SECTION_PADDING,
    width: 1,
    height: 1,
  });
  assert.equal(layout.width, (PROJECT_SECTION_PADDING * 2) + 1);
  assert.equal(layout.height, (PROJECT_SECTION_PADDING * 2) + 1);
});
