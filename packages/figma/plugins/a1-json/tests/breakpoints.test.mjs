import assert from 'node:assert/strict';
import test from 'node:test';
import {
  breakpointForWidth,
  collectAuthoredBreakpoints,
  formatResponsiveGridColumns,
  normalizeResponsiveColumns,
  parseResponsiveGridColumnsName,
  responsiveColumnsAt,
  responsiveGridItemSpanAt,
  responsiveGridName,
  stripResponsiveGridColumnsName,
} from '../src/pure/breakpoints.js';

test('normalizes responsive Grid columns to positive integer breakpoints', () => {
  assert.deepEqual(normalizeResponsiveColumns({ xs: 1, sm: 0, md: 2, bogus: 9, lg: 3.5, xl: 4 }), { xs: 1, md: 2, xl: 4 });
  assert.equal(normalizeResponsiveColumns({ sm: 0 }), null);
  assert.equal(normalizeResponsiveColumns([1, 2]), null);
});

test('reads inherited responsive columns at a breakpoint', () => {
  const columns = { xs: 1, md: 2, xl: 4 };
  assert.equal(responsiveColumnsAt(columns, 'xs'), 1);
  assert.equal(responsiveColumnsAt(columns, 'lg'), 2);
  assert.equal(responsiveColumnsAt(columns, 'xl'), 4);
  assert.equal(responsiveColumnsAt({ md: 3 }, 'xs'), 3);
});

test('formats and parses responsive Grid name suffixes', () => {
  assert.equal(formatResponsiveGridColumns({ xs: 1, md: 2, xl: 4 }), '{xs:1, md:2, xl:4}');
  assert.equal(stripResponsiveGridColumnsName('Product Grid - {xs:1, md:2}'), 'Product Grid');
  assert.equal(stripResponsiveGridColumnsName('Grid {xs:1}'), 'Grid');
  assert.deepEqual(parseResponsiveGridColumnsName('Product Grid - {xs:1, md:2, xl:4}'), { xs: 1, md: 2, xl: 4 });
  assert.equal(parseResponsiveGridColumnsName('Product Grid - {xs:nope}'), null);
  assert.equal(responsiveGridName('Product Grid - {xs:1}', { xs: 1, lg: 3 }), 'Product Grid - {xs:1, lg:3}');
});

test('resolves responsive GridItem spans', () => {
  assert.equal(responsiveGridItemSpanAt({ xs: 1, md: 'full' }, 'lg', 6), 6);
  assert.equal(responsiveGridItemSpanAt({ md: 2 }, 'xs'), 2);
  assert.equal(responsiveGridItemSpanAt('full', 'md', 4), 4);
  assert.equal(responsiveGridItemSpanAt(3, 'md'), 3);
  assert.equal(responsiveGridItemSpanAt(0, 'md'), null);
});

test('maps widths and authored responsive objects to breakpoints', () => {
  assert.equal(breakpointForWidth(500), 'xs');
  assert.equal(breakpointForWidth(900), 'md');
  assert.equal(breakpointForWidth(1500), 'lg');
  assert.equal(breakpointForWidth(-1, 'xl'), 'xl');
  assert.deepEqual([...collectAuthoredBreakpoints({ props: { columns: { xs: 1, md: 2 } }, span: { lg: 3 } })].sort(), ['lg', 'md', 'xs']);
});
