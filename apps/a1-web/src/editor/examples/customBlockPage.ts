/** Authored sample content. The spatial seat map is the model gap; the surrounding page uses A1. */
import type { PageDefinition } from '../pageTypes';

export const customBlockPage: PageDefinition = {
  schemaVersion: '1.0.0',
  page: {
    id: 'custom-block-example',
    name: 'Custom block',
    description: 'An interactive seating map built with isolated HTML, token-based CSS and JavaScript.',
    layout: {
      type: 'PageLayout',
      regions: [{
        id: 'main', name: 'Main', nodes: [
          {
            id: 'custom-example-intro', type: 'Section',
            props: { padding: { xs: 'sm', md: 'lg' }, contentWidth: 'lg', gap: 'sm' },
            children: [
              { id: 'custom-example-badge', type: 'MessageBadge', props: { status: 'info', subtle: true, size: 'sm', icon: 'code' }, content: { fallback: 'Custom block example' } },
              { id: 'custom-example-heading', type: 'Heading', props: { as: 'h1', size: 'xl' }, content: { fallback: 'Make room for something custom' } },
              { id: 'custom-example-description', type: 'Paragraph', props: { size: 'lg' }, content: { fallback: 'A spatial seating map with its own layout and live interaction, wrapped in a regular A1 page.' } },
              { id: 'custom-example-instructions', type: 'Paragraph', props: { size: 'sm' }, content: { fallback: 'Open Preview to choose seats. In Edit, select the block to explore or change its HTML, CSS and JavaScript.' } },
            ],
          },
          {
            id: 'custom-example-demo', type: 'Section',
            props: { padding: { xs: 'sm', md: 'lg' }, contentWidth: 'lg' },
            children: [{
              id: 'custom-seat-map', type: 'CustomBlock',
              props: {
                title: 'Interactive seating map', height: 'lg',
                markup: `<main class="a1-seat-experience">
  <header class="a1-seat-header">
    <p class="a1-seat-eyebrow">Studio sessions · A fictional event</p>
    <h1>A seat for your next idea.</h1>
    <p>Choose your spot. See your selection come to life.</p>
  </header>
  <div class="a1-seat-layout">
    <section class="a1-seat-map" aria-label="Choose seats" aria-describedby="seat-help">
      <div class="a1-seat-stage">The stage</div>
      <div class="a1-seat-rows"></div>
      <ul class="a1-seat-legend" aria-label="Seat states">
        <li><span class="a1-seat-key" aria-hidden="true"></span>Available</li>
        <li><span class="a1-seat-key a1-seat-key-selected" aria-hidden="true">✓</span>Selected</li>
        <li><span class="a1-seat-key a1-seat-key-unavailable" aria-hidden="true">×</span>Unavailable</li>
      </ul>
    </section>
    <aside class="a1-seat-summary" aria-labelledby="selection-heading">
      <p class="a1-seat-eyebrow">Your selection</p>
      <h2 id="selection-heading">Find your perspective</h2>
      <p id="seat-help">Select any available seat, or use Tab and Space. Select it again to remove it.</p>
      <div class="a1-seat-result" role="status" aria-atomic="true">
        <strong class="a1-seat-count">0</strong>
        <span>Seats selected</span>
        <p class="a1-seat-selection">No seats selected.</p>
      </div>
      <button class="a1-seat-reset" type="button" disabled>Clear selection</button>
      <p class="a1-seat-note">Just a demo. No seats are reserved.</p>
    </aside>
  </div>
</main>`,
                css: `/* These styles belong only to this document. Tokens follow the A1 theme. */
body {
  margin: 0;
  background: var(--semantic-color-surface-page);
  color: var(--semantic-color-text-default);
  font-size: var(--semantic-font-size-body-sm);
  line-height: var(--semantic-font-line-height-body);
}
button { font: inherit; }
h1, h2, p { margin: 0; }
.a1-seat-experience { padding: var(--semantic-spacing-gap-lg); }
.a1-seat-header { display: grid; gap: var(--semantic-spacing-gap-xs); margin-block-end: var(--semantic-spacing-gap-lg); }
.a1-seat-eyebrow { font-weight: var(--semantic-font-weight-heading); }
h1 { font-size: var(--semantic-font-size-display-xl); line-height: var(--semantic-font-line-height-display); letter-spacing: normal; }
h2 { font-size: var(--semantic-font-size-heading-sm); line-height: var(--semantic-font-line-height-heading); }
.a1-seat-layout { display: flex; flex-wrap: wrap; gap: var(--semantic-spacing-gap-lg); align-items: start; }
.a1-seat-map { flex: 2 1 var(--component-custom-block-height-md); min-inline-size: 0; }
.a1-seat-stage {
  padding: var(--semantic-spacing-gap-sm);
  margin-block-end: var(--semantic-spacing-gap-lg);
  border-block-end: var(--component-button-focus-ring-width) solid var(--semantic-color-text-accent);
  border-radius: 0 0 50% 50%;
  background: var(--semantic-color-action-surface);
  text-align: center;
  font-weight: var(--semantic-font-weight-heading);
}
.a1-seat-rows { display: grid; gap: var(--semantic-spacing-gap-sm); padding-block-end: var(--semantic-spacing-gap-md); }
.a1-seat-row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)) var(--semantic-spacing-gap-sm) repeat(3, minmax(0, 1fr)); gap: var(--semantic-spacing-gap-xs); }
.a1-seat:nth-child(4) { grid-column: 5; }
.a1-seat:nth-child(1), .a1-seat:nth-child(6) { transform: translateY(calc(-1 * var(--semantic-spacing-gap-xs))); }
.a1-seat {
  position: relative;
  min-inline-size: 0;
  min-block-size: var(--component-button-min-height);
  padding: 0;
  border: var(--component-button-secondary-border-width) solid var(--component-button-secondary-border);
  border-radius: var(--component-button-border-radius);
  background: var(--component-button-secondary-background);
  color: var(--component-button-secondary-foreground);
  cursor: pointer;
}
.a1-seat:hover:not(:disabled):not([aria-pressed="true"]) { background: var(--component-button-secondary-background-hover); color: var(--component-button-secondary-foreground-hover); }
.a1-seat[aria-pressed="true"] { background: var(--component-button-primary-background); color: var(--component-button-primary-foreground); }
.a1-seat-check { display: none; position: absolute; inset-block-start: 0; inset-inline-end: 0; font-size: var(--semantic-font-size-body-xs); line-height: 1; }
.a1-seat[aria-pressed="true"] .a1-seat-check { display: inline; }
.a1-seat:disabled { border-color: var(--semantic-color-border-subtle); background: var(--semantic-color-surface-raised); color: var(--semantic-color-text-default); cursor: not-allowed; text-decoration: line-through; }
button:focus-visible { outline: var(--component-button-focus-ring-width) solid var(--component-button-focus-ring); outline-offset: var(--component-button-focus-ring-offset); }
.a1-seat-legend { display: flex; flex-wrap: wrap; gap: var(--semantic-spacing-gap-md); padding: 0; margin: var(--semantic-spacing-gap-md) 0 0; list-style: none; }
.a1-seat-legend li { display: flex; align-items: center; gap: var(--semantic-spacing-gap-xs); }
.a1-seat-key { display: inline-grid; place-items: center; inline-size: var(--semantic-spacing-gap-md); block-size: var(--semantic-spacing-gap-md); border: var(--component-button-secondary-border-width) solid var(--component-button-secondary-border); border-radius: var(--component-button-small-border-radius); font-size: var(--semantic-font-size-body-xs); line-height: 1; }
.a1-seat-key-selected { background: var(--component-button-primary-background); color: var(--component-button-primary-foreground); }
.a1-seat-key-unavailable { background: var(--semantic-color-surface-raised); border-color: var(--semantic-color-border-subtle); }
.a1-seat-summary { flex: 1 1 var(--component-custom-block-height-sm); min-inline-size: 0; display: grid; gap: var(--semantic-spacing-gap-sm); padding: var(--semantic-spacing-gap-md); border-radius: var(--semantic-radius-control); background: var(--semantic-color-surface-panel); }
.a1-seat-result { display: grid; gap: var(--semantic-spacing-gap-xs); padding-block: var(--semantic-spacing-gap-sm); }
.a1-seat-count { font-size: var(--semantic-font-size-display-xxl); font-weight: var(--semantic-font-weight-display); line-height: var(--semantic-font-line-height-display); }
.a1-seat-selection { min-block-size: var(--semantic-font-line-height-body); overflow-wrap: anywhere; }
.a1-seat-reset { min-block-size: var(--component-button-min-height); padding: var(--component-button-padding-block) var(--component-button-padding-inline); border: var(--component-button-secondary-border-width) solid var(--component-button-secondary-border); border-radius: var(--component-button-border-radius); background: var(--component-button-secondary-background); color: var(--component-button-secondary-foreground); cursor: pointer; }
.a1-seat-reset:disabled { opacity: var(--component-button-disabled-opacity); cursor: default; }
.a1-seat-note { font-size: var(--semantic-font-size-body-xs); }`,
                js: `// Local state only. Nothing is sent to a server or stored between previews.
const unavailable = new Set(['A2', 'B4', 'B5', 'D1']);
const selected = new Set();
const rows = document.querySelector('.a1-seat-rows');
const reset = document.querySelector('.a1-seat-reset');

function updateSelection() {
  document.querySelector('.a1-seat-count').textContent = String(selected.size);
  document.querySelector('.a1-seat-selection').textContent = selected.size
    ? [...selected].sort().join(' · ')
    : 'No seats selected.';
  reset.disabled = selected.size === 0;
}

for (const rowName of ['A', 'B', 'C', 'D']) {
  const row = document.createElement('div');
  row.className = 'a1-seat-row';
  for (let number = 1; number <= 6; number += 1) {
    const seatId = rowName + number;
    const seat = document.createElement('button');
    seat.type = 'button';
    seat.className = 'a1-seat';
    seat.textContent = seatId;
    seat.disabled = unavailable.has(seatId);
    seat.setAttribute('aria-label', 'Seat ' + seatId + (seat.disabled ? ', unavailable' : ''));
    if (!seat.disabled) seat.setAttribute('aria-pressed', 'false');
    const check = document.createElement('span');
    check.className = 'a1-seat-check';
    check.setAttribute('aria-hidden', 'true');
    check.textContent = '✓';
    seat.append(check);
    seat.addEventListener('click', () => {
      if (selected.has(seatId)) selected.delete(seatId);
      else selected.add(seatId);
      seat.setAttribute('aria-pressed', String(selected.has(seatId)));
      updateSelection();
    });
    row.append(seat);
  }
  rows.append(row);
}

reset.addEventListener('click', () => {
  selected.clear();
  document.querySelectorAll('.a1-seat[aria-pressed]').forEach((seat) => seat.setAttribute('aria-pressed', 'false'));
  updateSelection();
  document.querySelector('.a1-seat:not(:disabled)').focus();
});`,
              },
            }],
          },
          {
            id: 'custom-example-capabilities', type: 'Section',
            props: { padding: { xs: 'sm', md: 'lg' }, contentWidth: 'lg', surface: 'panel', gap: 'md' },
            children: [
              { id: 'custom-example-capabilities-heading', type: 'Heading', props: { as: 'h2', size: 'lg' }, content: { fallback: 'What this block demonstrates' } },
              { id: 'custom-example-capabilities-grid', type: 'Grid', props: { columns: { xs: 1, md: 3 }, gap: 'md' }, children: [
                { id: 'custom-example-layout-card', type: 'Card', props: { icon: 'event_seat' }, children: [
                  { id: 'custom-example-layout-title', type: 'Heading', props: { as: 'h3', size: 'sm' }, content: { fallback: 'A layout beyond the catalog' } },
                  { id: 'custom-example-layout-copy', type: 'Paragraph', content: { fallback: 'Curved seating rows, a central aisle and a stage form a spatial control. The summary stacks below the map in narrow frames.' } },
                ] },
                { id: 'custom-example-interaction-card', type: 'Card', props: { icon: 'touch_app' }, children: [
                  { id: 'custom-example-interaction-title', type: 'Heading', props: { as: 'h3', size: 'sm' }, content: { fallback: 'Working local interaction' } },
                  { id: 'custom-example-interaction-copy', type: 'Paragraph', content: { fallback: 'JavaScript builds the seats, tracks selection and updates a live summary. Native buttons provide keyboard access and expose selected states.' } },
                ] },
                { id: 'custom-example-isolation-card', type: 'Card', props: { icon: 'palette' }, children: [
                  { id: 'custom-example-isolation-title', type: 'Heading', props: { as: 'h3', size: 'sm' }, content: { fallback: 'Custom, still connected to A1' } },
                  { id: 'custom-example-isolation-copy', type: 'Paragraph', content: { fallback: 'Colors, type, spacing and focus rings use A1 tokens. The block’s styles and script stay inside its sandbox. These surrounding cards remain ordinary A1 components.' } },
                ] },
              ] },
            ],
          },
        ],
      }],
    },
  },
};
