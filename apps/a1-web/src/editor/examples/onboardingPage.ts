/**
 * Onboarding flow example.
 *
 * Structure:
 *   PageLayout
 *     └─ region "main"
 *         ├─ Section (welcome)  → Stack → Heading + Paragraph
 *         ├─ Section (steps)    → Heading + Stack(column) → Card × 3
 *         └─ Section (cta)      → Button
 */
import type { PageDefinition } from '../pageTypes';

export const onboardingPage: PageDefinition = {
  schemaVersion: '0.1.0',
  page: {
    id: 'onboarding-page',
    name: 'Onboarding Flow',
    description: 'A step-by-step onboarding experience.',
    layout: {
      type: 'PageLayout',
      props: {},
      regions: [
        {
          id: 'main',
          name: 'Main',
          nodes: [
            // ── Welcome section ───────────────────────────────────────────
            {
              id: 'welcome',
              type: 'Section',
              props: {
                padding: 'lg',
                surface: 'panel',
                contentWidth: 'sm',
                gap: 'sm',
              },
              a11y: { labelledBy: 'onboarding-welcome-title' },
              children: [
                {
                  id: 'welcome-stack',
                  type: 'Stack',
                  props: { direction: 'column', gap: 'sm' },
                  children: [
                    {
                      id: 'welcome-heading',
                      type: 'Heading',
                      props: { as: 'h1', id: 'onboarding-welcome-title', size: 'xl' },
                      content: { fallback: "Welcome — let's get you set up" },
                    },
                    {
                      id: 'welcome-body',
                      type: 'Paragraph',
                      props: { size: 'lg', color: 'muted' },
                      content: {
                        fallback:
                          "This should only take a few minutes. Follow the steps below and you'll be ready to go.",
                      },
                    },
                  ],
                },
              ],
            },

            // ── Steps section ─────────────────────────────────────────────
            {
              id: 'steps',
              type: 'Section',
              props: { padding: 'lg', contentWidth: 'sm', gap: 'md' },
              a11y: { labelledBy: 'onboarding-steps-title' },
              children: [
                {
                  id: 'steps-heading',
                  type: 'Heading',
                  props: { as: 'h2', id: 'onboarding-steps-title', size: 'md' },
                  content: { fallback: 'Three steps to get started' },
                },
                {
                  id: 'steps-stack',
                  type: 'Stack',
                  props: { direction: 'column', gap: 'md' },
                  children: [
                    {
                      id: 'step-1',
                      type: 'Card',
                      props: { icon: 'person_add' },
                      children: [
                        {
                          id: 'step-1-stack',
                          type: 'Stack',
                          props: { direction: 'column', gap: 'xs' },
                          children: [
                            {
                              id: 'step-1-heading',
                              type: 'Heading',
                              props: { as: 'h3', size: 'sm' },
                              content: { fallback: '1. Create your account' },
                            },
                            {
                              id: 'step-1-body',
                              type: 'Paragraph',
                              props: { size: 'sm', color: 'muted' },
                              content: {
                                fallback:
                                  'Fill in your name, email, and a password to create your account.',
                              },
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: 'step-2',
                      type: 'Card',
                      props: { icon: 'tune' },
                      children: [
                        {
                          id: 'step-2-stack',
                          type: 'Stack',
                          props: { direction: 'column', gap: 'xs' },
                          children: [
                            {
                              id: 'step-2-heading',
                              type: 'Heading',
                              props: { as: 'h3', size: 'sm' },
                              content: { fallback: '2. Set up your workspace' },
                            },
                            {
                              id: 'step-2-body',
                              type: 'Paragraph',
                              props: { size: 'sm', color: 'muted' },
                              content: {
                                fallback:
                                  'Choose your preferences, add a logo, and configure your team settings.',
                              },
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: 'step-3',
                      type: 'Card',
                      props: { icon: 'group_add' },
                      children: [
                        {
                          id: 'step-3-stack',
                          type: 'Stack',
                          props: { direction: 'column', gap: 'xs' },
                          children: [
                            {
                              id: 'step-3-heading',
                              type: 'Heading',
                              props: { as: 'h3', size: 'sm' },
                              content: { fallback: '3. Invite your team' },
                            },
                            {
                              id: 'step-3-body',
                              type: 'Paragraph',
                              props: { size: 'sm', color: 'muted' },
                              content: {
                                fallback:
                                  "Add teammates by email. They'll receive an invite and can join immediately.",
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

            // ── CTA section ───────────────────────────────────────────────
            {
              id: 'cta',
              type: 'Section',
              props: { padding: 'lg', contentWidth: 'sm' },
              children: [
                {
                  id: 'cta-button',
                  type: 'Button',
                  props: { variant: 'primary', icon: 'arrow_forward', iconPosition: 'end' },
                  content: { fallback: 'Create my account' },
                  actions: { onClick: { type: 'navigate', target: '/' } },
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
