import clinicGuide from '@priority-guide/guides/clinic.json';
import incidentGuide from '@priority-guide/guides/incident.json';
import libraryGuide from '@priority-guide/guides/library.json';
import trailGuide from '@priority-guide/guides/trail.json';

export interface GuideItem {
  kind?: 'group' | 'item';
  type?: string;
  componentType?: string;
  title: string;
  content: string;
  annotations?: string[];
  links?: string[];
  linkedGuideId?: string;
  children?: GuideItem[];
}

export interface PriorityGuide {
  $schema?: string;
  id: string;
  tab: string;
  icon: string;
  title: string;
  pageType: string;
  context: string;
  problemStatement: string;
  audience: string;
  userGoal: string;
  businessGoal: string;
  contextDetails: { label: string; value: string; checkable?: boolean; checked?: boolean }[];
  items: GuideItem[];
}

export const workflow = [
  ['01', 'Name the page goal', 'What should a person understand, decide, or do here?'],
  ['02', 'List real content', 'Add only content and functionality that helps the user and the business goal.'],
  ['03', 'Rank the hierarchy', 'Move the most critical information to the top and challenge everything below it.'],
  ['04', 'Annotate behavior', 'Capture interactions, states, links, and responsive notes before prototyping.'],
] as const;

export const guides = [
  clinicGuide,
  libraryGuide,
  incidentGuide,
  trailGuide,
] as PriorityGuide[];
