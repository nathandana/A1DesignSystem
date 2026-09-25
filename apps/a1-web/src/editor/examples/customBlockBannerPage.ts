/**
 * Homepage example inspired by the supplied Nexus concept.
 * Only the visual product banner uses CustomBlock; all supporting content uses A1 nodes.
 */
import type { PageDefinition } from '../pageTypes';

export const customBlockBannerPage: PageDefinition = {
  schemaVersion: '1.0.0',
  page: {
    id: 'custom-block-banner-example',
    name: 'Custom banner',
    description: 'A homepage with one custom product banner and standard A1 content everywhere else.',
    layout: {
      type: 'PageLayout',
      regions: [{
        id: 'main', name: 'Main', nodes: [
          {
            id: 'catalyst-banner', type: 'CustomBlock',
            props: {
              title: 'Catalyst product banner',
              height: 'lg',
              markup: `<section class="a1-catalyst-banner" aria-labelledby="catalyst-title">
  <div class="a1-catalyst-copy">
    <p class="a1-catalyst-kicker">Nexus Innovations presents</p>
    <h1 id="catalyst-title">Meet Catalyst.</h1>
    <p class="a1-catalyst-lede">A focused mobile experience built to turn a spark into momentum.</p>
    <p class="a1-catalyst-note">Fast. Intuitive. Connected.</p>
  </div>
  <div class="a1-catalyst-product" aria-hidden="true">
    <span class="a1-catalyst-orbit a1-catalyst-orbit-outer"></span>
    <span class="a1-catalyst-orbit a1-catalyst-orbit-inner"></span>
    <div class="a1-catalyst-phone">
      <span class="a1-catalyst-speaker"></span>
      <div class="a1-catalyst-screen">
        <span class="a1-catalyst-ring a1-catalyst-ring-outer"></span>
        <span class="a1-catalyst-ring a1-catalyst-ring-middle"></span>
        <span class="a1-catalyst-ring a1-catalyst-ring-inner"></span>
        <span class="a1-catalyst-core"></span>
      </div>
    </div>
  </div>
  <div class="a1-catalyst-signal" aria-hidden="true">
    <span></span><span></span><span></span>
  </div>
</section>`,
              css: `/* The banner is the only custom region. Every visual value uses A1 tokens. */
body {
  margin: 0;
  overflow: hidden;
  background: var(--semantic-color-surface-inverse);
  color: var(--semantic-color-text-inverse);
}
.a1-catalyst-banner {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--component-custom-block-height-sm)), 1fr));
  align-items: center;
  gap: var(--semantic-spacing-gap-xl);
  min-block-size: 100vh;
  padding: var(--semantic-spacing-gap-xl);
  overflow: hidden;
  background:
    radial-gradient(circle at 78% 34%, color-mix(in srgb, var(--semantic-color-action-background) 42%, transparent), transparent 38%),
    radial-gradient(circle at 18% 82%, color-mix(in srgb, var(--semantic-color-text-accent) 26%, transparent), transparent 44%),
    linear-gradient(135deg, var(--semantic-color-surface-inverse), color-mix(in srgb, var(--semantic-color-surface-inverse) 72%, var(--semantic-color-action-background)));
}
.a1-catalyst-copy {
  position: relative;
  z-index: 2;
  display: grid;
  gap: var(--semantic-spacing-gap-md);
  max-inline-size: var(--component-custom-block-height-md);
}
.a1-catalyst-copy p,
.a1-catalyst-copy h1 { margin: 0; }
.a1-catalyst-kicker {
  color: var(--semantic-color-action-foreground);
  font-size: var(--semantic-font-size-body-sm);
  font-weight: var(--semantic-font-weight-heading);
}
.a1-catalyst-copy h1 {
  font-size: clamp(var(--semantic-font-size-display-xl), 9vw, var(--semantic-font-size-display-x-jumbo));
  font-weight: var(--semantic-font-weight-display);
  line-height: var(--semantic-font-line-height-display);
}
.a1-catalyst-lede {
  max-inline-size: var(--component-custom-block-height-md);
  color: var(--semantic-color-text-inverse);
  font-size: var(--semantic-font-size-body-lg);
}
.a1-catalyst-note {
  color: var(--semantic-color-action-foreground);
  font-size: var(--semantic-font-size-body-sm);
  font-weight: var(--semantic-font-weight-heading);
}
.a1-catalyst-product {
  position: relative;
  display: grid;
  place-items: center;
  min-block-size: var(--component-custom-block-height-md);
  isolation: isolate;
}
.a1-catalyst-phone {
  position: relative;
  z-index: 2;
  inline-size: min(52%, var(--component-custom-block-height-sm));
  aspect-ratio: 1 / 2;
  padding: var(--semantic-spacing-gap-xs);
  border: var(--component-button-focus-ring-width) solid var(--semantic-color-border-strong);
  border-radius: var(--component-button-pill-border-radius);
  background: var(--semantic-color-surface-raised);
  box-shadow:
    calc(-1 * var(--semantic-spacing-gap-sm)) var(--semantic-spacing-gap-md) var(--semantic-spacing-gap-xl) color-mix(in srgb, var(--semantic-color-surface-inverse) 78%, transparent),
    0 0 var(--semantic-spacing-gap-xl) color-mix(in srgb, var(--semantic-color-action-background) 52%, transparent);
  transform: rotate(8deg) skewY(-3deg);
}
.a1-catalyst-speaker {
  position: absolute;
  z-index: 2;
  inset-block-start: var(--semantic-spacing-gap-md);
  inset-inline: 38%;
  block-size: var(--component-custom-block-border-width);
  border-radius: var(--component-button-pill-border-radius);
  background: var(--semantic-color-border-strong);
}
.a1-catalyst-screen {
  position: relative;
  display: grid;
  place-items: center;
  inline-size: 100%;
  block-size: 100%;
  overflow: hidden;
  border-radius: var(--component-button-pill-border-radius);
  background:
    radial-gradient(circle, color-mix(in srgb, var(--semantic-color-action-background) 40%, transparent), transparent 48%),
    var(--semantic-color-surface-inverse);
}
.a1-catalyst-ring,
.a1-catalyst-orbit {
  position: absolute;
  border-radius: 50%;
  border: var(--component-custom-block-border-width) solid var(--semantic-color-action-border);
}
.a1-catalyst-ring-outer { inline-size: 72%; aspect-ratio: 1; }
.a1-catalyst-ring-middle { inline-size: 54%; aspect-ratio: 1; border-color: var(--semantic-color-text-accent); }
.a1-catalyst-ring-inner { inline-size: 34%; aspect-ratio: 1; border-color: var(--semantic-color-border-strong); }
.a1-catalyst-core {
  inline-size: var(--semantic-spacing-gap-xl);
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--semantic-color-action-background);
  box-shadow: 0 0 var(--semantic-spacing-gap-xl) var(--semantic-color-action-background);
}
.a1-catalyst-orbit { z-index: 1; border-color: color-mix(in srgb, var(--semantic-color-action-border) 58%, transparent); }
.a1-catalyst-orbit-outer { inline-size: 92%; aspect-ratio: 1; transform: rotate(-18deg) scaleY(.42); }
.a1-catalyst-orbit-inner { inline-size: 66%; aspect-ratio: 1; transform: rotate(24deg) scaleY(.5); border-color: color-mix(in srgb, var(--semantic-color-text-accent) 58%, transparent); }
.a1-catalyst-signal {
  position: absolute;
  inset-inline-start: var(--semantic-spacing-gap-xl);
  inset-block-end: var(--semantic-spacing-gap-xl);
  display: flex;
  align-items: end;
  gap: var(--semantic-spacing-gap-xs);
}
.a1-catalyst-signal span {
  inline-size: var(--component-button-focus-ring-width);
  block-size: var(--semantic-spacing-gap-xs);
  border-radius: var(--component-button-pill-border-radius);
  background: var(--semantic-color-action-background);
}
.a1-catalyst-signal span:nth-child(2) { block-size: var(--semantic-spacing-gap-md); }
.a1-catalyst-signal span:nth-child(3) { block-size: var(--semantic-spacing-gap-lg); }`,
              js: '',
            },
          },
          {
            id: 'catalyst-intro', type: 'Section',
            props: { padding: { xs: 'md', md: 'xl' }, contentWidth: 'lg', gap: 'lg' },
            a11y: { labelledBy: 'catalyst-intro-title' },
            children: [
              { id: 'catalyst-intro-copy', type: 'Stack', props: { gap: 'sm' }, children: [
                { id: 'catalyst-intro-title', type: 'Heading', props: { as: 'h2', id: 'catalyst-intro-title', size: 'lg' }, content: { fallback: 'Built for the way ideas move' } },
                { id: 'catalyst-intro-body', type: 'Paragraph', props: { size: 'lg', color: 'muted' }, content: { fallback: 'Catalyst brings speed, clarity and connection into one focused experience. The banner sets the mood; A1 components carry the rest of the story.' } },
              ] },
              { id: 'catalyst-features', type: 'Grid', props: { columns: { xs: 1, md: 3 }, gap: 'md' }, children: [
                { id: 'catalyst-speed', type: 'Card', props: { icon: 'speed' }, children: [
                  { id: 'catalyst-speed-title', type: 'Heading', props: { as: 'h3', size: 'sm' }, content: { fallback: 'Fast by design' } },
                  { id: 'catalyst-speed-body', type: 'Paragraph', props: { color: 'muted' }, content: { fallback: 'Move from a first thought to useful action with less friction.' } },
                ] },
                { id: 'catalyst-interface', type: 'Card', props: { icon: 'touch_app' }, children: [
                  { id: 'catalyst-interface-title', type: 'Heading', props: { as: 'h3', size: 'sm' }, content: { fallback: 'Natural interactions' } },
                  { id: 'catalyst-interface-body', type: 'Paragraph', props: { color: 'muted' }, content: { fallback: 'Clear controls and thoughtful defaults keep attention on the work.' } },
                ] },
                { id: 'catalyst-connected', type: 'Card', props: { icon: 'language' }, children: [
                  { id: 'catalyst-connected-title', type: 'Heading', props: { as: 'h3', size: 'sm' }, content: { fallback: 'Connected everywhere' } },
                  { id: 'catalyst-connected-body', type: 'Paragraph', props: { color: 'muted' }, content: { fallback: 'Keep the people and tools that matter within easy reach.' } },
                ] },
              ] },
            ],
          },
          {
            id: 'catalyst-cta', type: 'Section',
            props: { padding: { xs: 'md', md: 'xl' }, surface: 'panel', contentWidth: 'md', gap: 'md' },
            a11y: { labelledBy: 'catalyst-cta-title' },
            children: [
              { id: 'catalyst-cta-title', type: 'Heading', props: { as: 'h2', id: 'catalyst-cta-title', size: 'lg' }, content: { fallback: 'See what Catalyst can do' } },
              { id: 'catalyst-cta-body', type: 'Paragraph', props: { size: 'lg', color: 'muted' }, content: { fallback: 'Explore the product story or start with a guided introduction.' } },
              { id: 'catalyst-cta-actions', type: 'ButtonContainer', props: { align: 'start' }, children: [
                { id: 'catalyst-primary-action', type: 'Button', props: { variant: 'primary', icon: 'arrow_forward', iconPosition: 'end' }, content: { fallback: 'Explore Catalyst' } },
                { id: 'catalyst-secondary-action', type: 'Button', props: { variant: 'secondary', icon: 'play_circle', iconPosition: 'start' }, content: { fallback: 'Watch the overview' } },
              ] },
            ],
          },
        ],
      }],
    },
  },
};
