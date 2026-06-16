/**
 * Marketing landing page example.
 *
 * Structure:
 *   PageLayout
 *     └─ region "main"
 *         ├─ Section (hero, gradient) → Stack → Heading + Paragraph + Stack(row) → Button × 2
 *         └─ Section (features)       → Heading + Stack(row) → Card × 3
 */
import type { PageDefinition } from '../pageTypes';

export const landingPage: PageDefinition = {
  schemaVersion: '0.1.0',
  page: {
    id: 'landing-page',
    name: 'Landing Page',
    description: 'A marketing landing page with a hero and feature highlights.',
    layout: {
      type: 'PageLayout',
      props: {},
      regions: [
        {
          id: 'main',
          name: 'Main',
          nodes: [
            // ── Hero section ──────────────────────────────────────────────
            {
              id: 'hero',
              type: 'Section',
              props: {
                padding: 'xl',
                surface: 'panel',
                gradient: 'accent',
                gradientPosition: 'bottom-left',
                contentWidth: 'md',
                gap: 'lg',
              },
              a11y: { labelledBy: 'landing-hero-title' },
              children: [
                {
                  id: 'hero-stack',
                  type: 'Stack',
                  props: { direction: 'column', gap: 'md' },
                  children: [
                    {
                      id: 'hero-title',
                      type: 'Heading',
                      props: {
                        as: 'h1',
                        id: 'landing-hero-title',
                        type: 'display',
                        size: { xs: 'xl', md: 'xxl' },
                      },
                      content: { fallback: 'Design systems that scale with your team' },
                    },
                    {
                      id: 'hero-body',
                      type: 'Paragraph',
                      props: { size: 'lg', color: 'muted' },
                      content: {
                        fallback:
                          'A1 gives you tokens, components, and patterns that work across web, native, and print — designed once, used everywhere.',
                      },
                    },
                    {
                      id: 'hero-actions',
                      type: 'Stack',
                      props: { direction: { xs: 'column', sm: 'row' }, gap: 'sm' },
                      children: [
                        {
                          id: 'hero-cta-primary',
                          type: 'Button',
                          props: { variant: 'primary', icon: 'arrow_forward', iconPosition: 'end' },
                          content: { fallback: 'Get started free' },
                          actions: { onClick: { type: 'navigate', target: '/get-started' } },
                        },
                        {
                          id: 'hero-cta-secondary',
                          type: 'Button',
                          props: { variant: 'secondary', icon: 'play_circle', iconPosition: 'start' },
                          content: { fallback: 'Watch a demo' },
                          actions: { onClick: { type: 'appAction', target: 'openDemoVideo' } },
                        },
                      ],
                    },
                  ],
                },
              ],
            },

            // ── Features section ──────────────────────────────────────────
            {
              id: 'features',
              type: 'Section',
              props: { padding: 'xl', contentWidth: 'lg', gap: 'lg' },
              a11y: { labelledBy: 'landing-features-title' },
              children: [
                {
                  id: 'features-heading',
                  type: 'Heading',
                  props: { as: 'h2', id: 'landing-features-title', size: 'lg' },
                  content: { fallback: 'Everything in one system' },
                },
                {
                  id: 'features-row',
                  type: 'Stack',
                  props: { direction: { xs: 'column', md: 'row' }, gap: 'md' },
                  children: [
                    {
                      id: 'feature-tokens',
                      type: 'Card',
                      props: { icon: 'palette' },
                      children: [
                        {
                          id: 'feature-tokens-stack',
                          type: 'Stack',
                          props: { direction: 'column', gap: 'xs' },
                          children: [
                            {
                              id: 'feature-tokens-heading',
                              type: 'Heading',
                              props: { as: 'h3', size: 'sm' },
                              content: { fallback: 'Design tokens' },
                            },
                            {
                              id: 'feature-tokens-body',
                              type: 'Paragraph',
                              props: { size: 'sm', color: 'muted' },
                              content: {
                                fallback:
                                  'Color, spacing, typography, and motion defined once as DTCG tokens and consumed across every platform.',
                              },
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: 'feature-components',
                      type: 'Card',
                      props: { icon: 'widgets' },
                      children: [
                        {
                          id: 'feature-components-stack',
                          type: 'Stack',
                          props: { direction: 'column', gap: 'xs' },
                          children: [
                            {
                              id: 'feature-components-heading',
                              type: 'Heading',
                              props: { as: 'h3', size: 'sm' },
                              content: { fallback: 'A1 components' },
                            },
                            {
                              id: 'feature-components-body',
                              type: 'Paragraph',
                              props: { size: 'sm', color: 'muted' },
                              content: {
                                fallback:
                                  'Accessible, theme-aware React components covering layout, navigation, inputs, feedback, and data.',
                              },
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: 'feature-editor',
                      type: 'Card',
                      props: { icon: 'edit_note' },
                      children: [
                        {
                          id: 'feature-editor-stack',
                          type: 'Stack',
                          props: { direction: 'column', gap: 'xs' },
                          children: [
                            {
                              id: 'feature-editor-heading',
                              type: 'Heading',
                              props: { as: 'h3', size: 'sm' },
                              content: { fallback: 'Page editor' },
                            },
                            {
                              id: 'feature-editor-body',
                              type: 'Paragraph',
                              props: { size: 'sm', color: 'muted' },
                              content: {
                                fallback:
                                  'Author pages as structured JSON. The definition is the source of truth — rendered, exported, and version-controlled.',
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
