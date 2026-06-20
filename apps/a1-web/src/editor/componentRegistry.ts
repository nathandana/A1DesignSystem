/**
 * Component registry — the ONLY components the page renderer may instantiate.
 *
 * Keys are the locked-down A1 component names from `ComponentType`; values are
 * the real A1 React components. Anything not in this map renders the
 * `UnsupportedComponent` fallback in `pageRenderer.tsx`. Arbitrary HTML tags
 * (`div`, `p`, `span`, …) are intentionally NOT supported.
 *
 * To allow a new component: add its name to `ComponentType` in `pageTypes.ts`
 * and add the real component here. The `Record<ComponentType, …>` typing forces
 * this map to cover exactly the names in the contract.
 */
import {
  Accordion,
  Banner,
  Bleed,
  Blockquote,
  BottomDrawer,
  Breadcrumb,
  Button,
  ButtonContainer,
  Calendar,
  Card,
  CheckboxGroup,
  ChoiceGroup,
  CircularProgress,
  Cluster,
  Code,
  CreditCardField,
  DateField,
  DefinitionList,
  Divider,
  FieldRow,
  Figure,
  Fieldset,
  Grid,
  Heading,
  Icon,
  IconButton,
  Inset,
  Link,
  List,
  ListItem,
  MessageBadge,
  MessageEmptyState,
  NumberField,
  PageLayout,
  PageNav,
  Pagination,
  Paragraph,
  PhoneField,
  RadioGroup,
  Section,
  SegmentedControl,
  SelectField,
  Slider,
  Spacer,
  Stack,
  StatusBar,
  StepTracker,
  StickyActions,
  Switch,
  TextField,
  TextareaField,
  TimeField,
  TopHeader,
  ZipField,
} from '@gtivr4/a1-design-system-react';
import type { ComponentType as ReactComponentType } from 'react';
import type { ComponentType } from './pageTypes';
import { EditorDataTable, EditorOutlet, EditorSlot, EditorTabs, EditorToolbar, EditorTreeMenu } from './editorComponents.jsx';

export const componentRegistry: Record<ComponentType, ReactComponentType<any>> = {
  // Layout
  PageLayout,
  Section,
  Stack,
  Grid,
  Cluster,
  Card,
  Bleed,
  Inset,
  Spacer,
  ButtonContainer,
  // Typography & media
  Heading,
  Paragraph,
  Blockquote,
  Code,
  Divider,
  List,
  ListItem,
  Icon,
  Figure,
  // Navigation & actions
  Link,
  Button,
  IconButton,
  Switch,
  SegmentedControl,
  // Feedback
  Banner,
  MessageBadge,
  MessageEmptyState,
  StatusBar,
  CircularProgress,
  StepTracker,
  // Inputs
  TextField,
  TextareaField,
  SelectField,
  NumberField,
  DateField,
  TimeField,
  PhoneField,
  ZipField,
  CreditCardField,
  Fieldset,
  CheckboxGroup,
  RadioGroup,
  ChoiceGroup,
  // Data
  DefinitionList,
  Pagination,
  Calendar,
  // Navigation
  Breadcrumb,
  TopHeader,
  BottomDrawer,
  StickyActions,
  PageNav,
  // Disclosure
  Accordion,
  // Actions & controls (config-as-props adapters + real components)
  Slider,
  Tabs: EditorTabs,
  Toolbar: EditorToolbar,
  // Inputs
  FieldRow,
  // Data
  TreeMenu: EditorTreeMenu,
  DataTable: EditorDataTable,
  // Pattern authoring
  Slot: EditorSlot,
  // Shared project layout
  Outlet: EditorOutlet,
};
