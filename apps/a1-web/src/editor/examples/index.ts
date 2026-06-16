import type { PageDefinition } from '../pageTypes';
import { editorExamplePage } from './editorExamplePage';
import { onboardingPage } from './onboardingPage';
import { landingPage } from './landingPage';

export interface EditorExample {
  id: string;
  label: string;
  icon: string;
  definition: PageDefinition;
}

export const BLANK_PAGE: PageDefinition = {
  schemaVersion: '1.0.0',
  page: {
    id: 'blank',
    name: 'Untitled',
    layout: {
      type: 'PageLayout',
      regions: [
        { id: 'main', name: 'Main', nodes: [] },
      ],
    },
  },
};

/**
 * Build a blank page definition with a unique internal `page.id`, so every
 * custom page is self-consistent (the shared BLANK_PAGE would give them all the
 * literal id "blank"). The routing id and page.id are kept in sync.
 */
export function makeBlankPage(id: string, name = 'Untitled'): PageDefinition {
  return {
    schemaVersion: '1.0.0',
    page: {
      id,
      name,
      layout: {
        type: 'PageLayout',
        regions: [
          { id: 'main', name: 'Main', nodes: [] },
        ],
      },
    },
  };
}

export const NEW_PAGE_ID = 'new-page';

export const EDITOR_EXAMPLES: EditorExample[] = [
  {
    id: 'component-showcase',
    label: 'Component showcase',
    icon: 'widgets',
    definition: editorExamplePage,
  },
  {
    id: 'onboarding-flow',
    label: 'Onboarding flow',
    icon: 'rocket_launch',
    definition: onboardingPage,
  },
  {
    id: 'landing-page',
    label: 'Landing page',
    icon: 'web',
    definition: landingPage,
  },
];

export const DEFAULT_EXAMPLE_ID = EDITOR_EXAMPLES[0].id;
