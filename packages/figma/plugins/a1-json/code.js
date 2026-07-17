// A1 Design System – Component JSON (proof of concept, A1-1651)
//
// Two-way bridge between A1 Figma components and the A1 page-definition JSON
// used by the a1-web editor (apps/a1-web/src/editor/pageTypes.ts):
//
//   Export — select an A1 component instance and emit it as a page-definition
//   ComponentNode. Import — paste page-definition JSON and render every
//   supported node as an instance of the matching Figma component.
//
// Supported component sets: Button, Icon Button, Button Container, Link, Card, Banner,
// Badge, Chip, Chip Group, Figure, Definition List, Blockquote, Section, Bottom Sheet, Text Field, Search Field,
// Textarea, Select, Switch, Segmented Control, Tabs, Accordion, Tooltip, Pagination,
// Empty State, Divider, Menu, Dialog, Radio Group, Checkbox Group, Page Nav,
// Top Header, and Page Layout,
// plus standalone A1-styled text
// exported as Heading, Paragraph, or (when blue and underlined) Link. Section
// is split in two on the Figma side (the Section set + a separate content-width
// carrier), so its exporter and importer translate contentWidth between the
// shapes. The exporters/importers are keyed by component-set name so additional
// public A1 assets can be added without touching the plumbing. Export runs
// automatically when the selection or the selected instance's configuration
// changes.
//
// Run via Plugins > Development > Import plugin from manifest.

// ─── A1 contract (packages/react/src/components/button/Button.d.ts) ─────────

const BUTTON_VARIANTS = ['primary', 'secondary', 'tertiary', 'destructive', 'success'];
const BUTTON_SIZES = ['sm', 'md', 'lg'];
const ICON_BUTTON_VARIANTS = ['tertiary', 'secondary', 'destructive', 'success'];
const ICON_BUTTON_SIZES = ['sm', 'md', 'lg'];
const ICON_SIZES = ['xs', 'sm', 'md', 'lg', 'xl', 'jumbo', 'xJumbo'];
const ICON_SIZE_PIXELS = { xs: 16, sm: 20, md: 24, lg: 32, xl: 40, jumbo: 64, xJumbo: 96 };
const BUTTON_CONTAINER_ALIGNS = ['start', 'center', 'end'];
// Figma-only inspection states that have no React prop (see
// packages/react/ai/figma-workflow.md, Button gap table).
const VISUAL_ONLY_STATES = ['hover', 'focus', 'pressed'];
// Known node id of the Button component set in the A1 Figma file; the name
// lookup below is the fallback for copies of the file.
const BUTTON_SET_ID = '123:701';

// Section (packages/react/src/components/section/Section.d.ts). In Figma the
// Section model is split in two: the Section component set carries the
// Surface/Padding variants, while contentWidth lives separately — either a
// nested content-width component instance or the ContentWidth variable
// collection's mode — so export/import translate between the two shapes.
const SECTION_SURFACES = ['page', 'panel', 'raised'];
const SECTION_PADDINGS = ['none', 'xs', 'sm', 'md', 'lg'];
const SECTION_WIDTHS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
const SECTION_CONTENT_WIDTH_PIXELS = { xs: 456, sm: 640, md: 800, lg: 960, xl: 1120, '2xl': 1440 };
const SECTION_GAPS = ['xs', 'sm', 'md', 'lg', 'xl'];
const NINE_POSITIONS = ['center', 'top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left', 'top-left'];
// TEXT documentation properties on the Figma Section component (see the
// Section table in figma-workflow.md) mapped to their React props. Values
// equal to the React default are omitted from the JSON.
const SECTION_TEXT_PROPS = {
  Gradient: { prop: 'gradient', allowed: ['accent', 'highlight', 'info', 'success', 'warn'] },
  GradientPosition: { prop: 'gradientPosition', allowed: NINE_POSITIONS, default: 'center' },
  Height: { prop: 'height', allowed: ['screen', 'hero'] },
  Align: { prop: 'align', allowed: ['left', 'center', 'right'] },
  BorderSize: { prop: 'borderSize', allowed: ['xs', 'sm', 'md', 'lg'] },
  BorderStyle: { prop: 'borderStyle', allowed: ['solid', 'dashed', 'dotted'], default: 'solid' },
  BorderVariant: { prop: 'borderVariant', allowed: ['subtle', 'strong', 'accent'], default: 'subtle' },
  Radius: { prop: 'radius', allowed: ['sm', 'md', 'lg', 'xl'], default: 'none' },
  BackgroundImage: { prop: 'backgroundImage' },
  BackgroundFit: { prop: 'backgroundFit', allowed: ['cover', 'contain', 'tile'], default: 'cover' },
  BackgroundPosition: { prop: 'backgroundPosition', allowed: NINE_POSITIONS, default: 'center' },
  BackgroundOverlay: { prop: 'backgroundOverlay', allowed: ['darken', 'lighten'] },
  BackgroundOverlayStrength: { prop: 'backgroundOverlayStrength', allowed: ['sm', 'md', 'lg'], default: 'md' },
};

const TEXT_FIELD_SIZES = ['comfortable', 'default', 'compact'];
const SWITCH_SIZES = ['comfortable', 'default', 'compact'];
const SEGMENTED_SIZES = ['sm', 'md', 'lg'];
const TABS_VARIANTS = ['line', 'pills', 'segment', 'progress', 'folder'];
const TABS_SIZES = ['default', 'compact'];
const TABS_LEVELS = [1, 2];
const TABS_LABEL_MODES = ['all', 'selected'];
const TABS_ITEMS_SLOT_NAME = 'Tabs';
const TAB_ICON_POSITIONS = ['start', 'end', 'above'];
const TAB_STATUSES = ['none', 'in-progress', 'completed', 'error', 'warn', 'warning'];
const ACCORDION_SIZES = ['sm', 'md', 'lg'];
const TOOLTIP_PLACEMENTS = ['top', 'right', 'bottom', 'left'];
const PAGINATION_SIZES = ['sm', 'md', 'lg'];
const PAGE_NAV_MAX_SECTIONS = 5;
const TREE_MENU_MAX_ITEMS = 12;
const TREE_MENU_ITEM_SET_NAMES = new Set(['Tree Menu Item', 'Tree Item', 'TreeMenu Item', 'TreeMenuItem']);
const TREE_MENU_VARIANTS = ['expanded', 'collapsed'];
const EMPTY_STATE_SCALES = ['page', 'section', 'card'];
const SELECT_SIZES = ['comfortable', 'default', 'compact'];
const SELECT_STATES = ['default', 'error', 'disabled'];
const DIVIDER_ORIENTATIONS = ['horizontal', 'vertical'];
const DIVIDER_VARIANTS = ['subtle', 'strong', 'accent'];
const DIVIDER_LINE_STYLES = ['solid', 'dashed', 'dotted'];
const DIVIDER_SIZES = ['xs', 'sm', 'md', 'lg'];
const GROUP_SIZES = ['comfortable', 'default', 'compact'];
const DIALOG_SIZES = ['sm', 'md', 'lg', 'xl'];
const DIALOG_STATUSES = ['none', 'success', 'error', 'warn', 'info', 'neutral'];
const CARD_SURFACES = ['default', 'accent'];
const BADGE_STATUSES = ['neutral', 'info', 'success', 'warn', 'error'];
const BADGE_SIZES = ['sm', 'md', 'lg'];
const BADGE_DEFAULT_ICONS = {
  neutral: 'info',
  info: 'info',
  success: 'check_circle',
  warn: 'warning',
  error: 'error',
};
const BLOCKQUOTE_VARIANTS = ['border', 'filled', 'feature', 'minimal', 'accent', 'pull', 'ruled'];
const BANNER_VARIANTS = ['inline', 'system', 'calendar'];
const BANNER_STATUSES = ['neutral', 'info', 'success', 'warn', 'error'];
const DEFINITION_LIST_DIRECTIONS = ['row', 'column'];
const DEFINITION_LIST_SIZES = ['sm', 'md', 'lg'];
const LINK_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
const LINK_WEIGHTS = ['normal', 'medium', 'semibold', 'bold'];
const LINK_ICON_POSITIONS = ['start', 'end'];
// The Figma Figure asset intentionally uses a compact subset of React's
// larger size/ratio surface to avoid a 64-variant matrix.
const FIGURE_SIZES = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl'];
const FIGURE_ASPECT_RATIOS = ['16:9', '4:3', '1:1', '3:4', '9:16'];
// These are maximum widths, matching the React Figure size scale. The Figure
// itself remains flexible in an auto-layout parent; only its outer boundary is
// capped. Aspect ratios belong to the nested image, never to that boundary.
const FIGURE_MAX_WIDTHS = { '2xs': 128, xs: 192, sm: 320, md: 480, lg: 640, xl: 800 };
const FIGURE_RATIO_VALUES = { '16:9': 16 / 9, '4:3': 4 / 3, '1:1': 1, '3:4': 3 / 4, '9:16': 9 / 16 };
const TEXT_FIELD_VISUAL_STATES = ['hover', 'focus'];
const MENU_ITEM_VISUAL_STATES = ['hover', 'focus', 'pressed'];
const GROUP_SLOT_CONFIG = {
  RadioGroup: { slotName: 'Radio Items', min: 2, max: 20 },
  CheckboxGroup: { slotName: 'Checkbox Items', min: 1, max: 20 },
  TopHeader: { slotName: 'Nav Items', min: 0, max: 8 },
  TopHeaderActions: { slotName: 'Actions', min: 0, max: 6 },
  ChipGroup: { slotName: 'Chip slot', min: 1, max: 12 },
};
const STACK_DIRECTIONS = ['column', 'column-reverse', 'row', 'row-reverse'];
const STACK_ALIGNS = ['stretch', 'start', 'center', 'end', 'baseline'];
const STACK_JUSTIFIES = ['start', 'center', 'end', 'between', 'around', 'evenly'];
const STACK_GAPS = [0, 1, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 64, 96, 128];
const STACK_SEMANTIC_GAPS = { xs: 8, sm: 12, md: 16, lg: 24, xl: 40 };
const STACK_GAP_VARIABLE_NAMES = {
  0: 'gap/none',
  1: 'gap/1',
  2: 'gap/2',
  4: 'gap/4',
  6: 'gap/6',
  8: 'gap/xs',
  12: 'gap/sm',
  16: 'gap/md',
  20: 'gap/20',
  24: 'gap/lg',
  32: 'gap/32',
  40: 'gap/xl',
  64: 'gap/64',
  96: 'gap/96',
  128: 'gap/128',
};
const SECTION_GAP_PIXELS = { xs: 8, sm: 12, md: 16, lg: 24, xl: 40 };
const STACK_ALIGN_FROM_FIGMA = { MIN: 'start', CENTER: 'center', MAX: 'end', BASELINE: 'baseline' };
const STACK_ALIGN_TO_FIGMA = { start: 'MIN', center: 'CENTER', end: 'MAX', baseline: 'BASELINE' };
const STACK_JUSTIFY_FROM_FIGMA = { MIN: 'start', CENTER: 'center', MAX: 'end', SPACE_BETWEEN: 'between' };
const STACK_JUSTIFY_TO_FIGMA = { start: 'MIN', center: 'CENTER', end: 'MAX', between: 'SPACE_BETWEEN' };
const SUPPORTED_COMPONENT_MESSAGE = 'Icon, Button, Icon Button, Button Container, Link, Breadcrumb, Card, Banner, Badge, Chip, Chip Group, Figure, Definition List, Blockquote, Code, Inline, Section, Bottom Sheet, Text Field, Search Field, Textarea, Select, Switch, Segmented Control, Tabs, Accordion, Tooltip, Pagination, Empty State, Divider, Menu, Dialog, Radio Group, Checkbox Group, Page Nav, Tree Menu, Top Header, Page Layout, Stack and Grid auto-layout frames, and standalone styled text';
const LOCAL_FIGMA_IMAGE_MAX_BYTES = 4_000_000;
const DETACHED_COMPONENT_NAMESPACE = 'a1_json';
const DETACHED_COMPONENT_KEY = 'componentName';
const DETACHED_BANNER_PROPS_KEY = 'bannerProps';
const GRID_RESPONSIVE_COLUMNS_KEY = 'gridResponsiveColumns';
const A1_BREAKPOINT_KEY = 'a1Breakpoint';
const A1_LIBRARY_MANIFEST_STORAGE_KEY = 'a1_figma_library_manifest_v1';
const A1_COMPONENT_KEY_REGISTRY_STORAGE_KEY = A1_LIBRARY_MANIFEST_STORAGE_KEY;
const A1_BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl'];
const A1_BREAKPOINT_WIDTHS = { xs: 480, sm: 640, md: 1024, lg: 1440, xl: 1600 };
const INLINE_ELEMENTS = ['all', 'strong', 'b', 'em', 'i', 'u', 's', 'del', 'ins', 'mark', 'small', 'sub', 'sup', 'abbr', 'cite', 'q', 'time', 'code', 'kbd', 'samp', 'var', 'muted', 'accent'];
let localFigureAssets = new Map();
let activeRenderBreakpoint = '';
let clientComponentKeyRegistryPromise = null;
const gapVariableWarnings = new Set();
const JSON_TYPE_BY_COMPONENT_NAME = {
  'Icon Button': 'IconButton',
  'Button Container': 'ButtonContainer',
  Select: 'SelectField',
  Badge: 'MessageBadge',
  Breadcrumb: 'Breadcrumb',
  'Definition List': 'DefinitionList',
  Code: 'Code',
  Inline: 'Inline',
  'Text Field': 'TextField',
  'Search Field': 'SearchField',
  Textarea: 'TextareaField',
  Switch: 'Switch',
  'Segmented Control': 'SegmentedControl',
  Tabs: 'Tabs',
  Accordion: 'Accordion',
  Tooltip: 'Tooltip',
  Pagination: 'Pagination',
  'Empty State': 'MessageEmptyState',
  'Radio Group': 'RadioGroup',
  'Checkbox Group': 'CheckboxGroup',
  'Page Nav': 'PageNav',
  'Tree Menu': 'TreeMenu',
  'Top Header': 'TopHeader',
  'Page Layout': 'PageLayout',
  'Bottom Sheet': 'BottomSheet',
  Chip: 'ChipGroup',
  'Chip Group': 'ChipGroup',
  'Data Table': 'DataTable',
  'Choice Group': 'ChoiceGroup',
};
const FIGMA_COMPONENT_NAME_ALIASES = {
  Button: ['Button'],
  'Icon Button': ['Icon Button', 'IconButton'],
  'Button Container': ['Button Container', 'ButtonContainer', 'Button Group', 'ButtonGroup'],
  Link: ['Link'],
  Breadcrumb: ['Breadcrumb', 'Bread Crumb'],
  Card: ['Card'],
  Banner: ['Banner'],
  Badge: ['Badge', 'Message Badge', 'MessageBadge'],
  Figure: ['Figure'],
  'Definition List': ['Definition List', 'DefinitionList'],
  'Definition List Item': ['Definition List Item', 'DefinitionListItem'],
  Blockquote: ['Blockquote', 'BlockQuote', 'Block Quote'],
  Code: ['Code'],
  Inline: ['Inline', 'Inline Text', 'InlineText'],
  Section: ['Section'],
  'Text Field': ['Text Field', 'TextField'],
  'Search Field': ['Search Field', 'SearchField'],
  Textarea: ['Textarea', 'Text Area', 'TextareaField', 'Textarea Field'],
  Select: ['Select', 'SelectField', 'Select Field'],
  Switch: ['Switch'],
  'Segmented Control': ['Segmented Control', 'SegmentedControl'],
  'Segmented Control Item': ['Segmented Control Item', 'SegmentedControl Item', 'SegmentedControlItem'],
  Tab: ['Tab', 'Tab Item', 'Tabs Item'],
  'Tab Item': ['Tab Item', 'Tab', 'Tabs Item'],
  Tabs: ['Tabs'],
  Accordion: ['Accordion'],
  Tooltip: ['Tooltip'],
  Pagination: ['Pagination'],
  'Empty State': ['Empty State', 'EmptyState', 'Message Empty State', 'MessageEmptyState'],
  Divider: ['Divider'],
  Menu: ['Menu'],
  Dialog: ['Dialog'],
  'Menu Item': ['Menu Item', 'MenuItem'],
  'Radio Option': ['Radio Option', 'RadioOption'],
  'Checkbox Option': ['Checkbox Option', 'CheckboxOption'],
  'Radio Group': ['Radio Group', 'RadioGroup'],
  'Checkbox Group': ['Checkbox Group', 'CheckboxGroup'],
  'Page Nav': ['Page Nav', 'PageNav'],
  'Page Nav Item': ['Page Nav Item', 'PageNav Item', 'PageNavItem'],
  'Tree Menu': ['Tree Menu', 'TreeMenu'],
  'Tree Menu Item': ['Tree Menu Item', 'TreeMenu Item', 'TreeMenuItem', 'Tree Item', 'TreeItem'],
  'Top Header': ['Top Header', 'TopHeader'],
  'Top Header Nav Item': ['Top Header Nav Item', 'TopHeader Nav Item', 'TopHeaderNavItem'],
  'Page Layout': ['Page Layout', 'PageLayout'],
  'Bottom Sheet': ['Bottom Sheet', 'BottomSheet', 'Bottom Sheet Component'],
  Chip: ['Chip'],
  'Chip Group': ['Chip Group', 'ChipGroup'],
  'Data Table': ['Data Table', 'DataTable'],
  'Data Table Header Cell': ['Data Table Header Cell', 'DataTable Header Cell', 'DataTableHeaderCell'],
  'Data Table Cell': ['Data Table Cell', 'DataTable Cell', 'DataTableCell'],
  'Choice Group': ['Choice Group', 'ChoiceGroup'],
  'Choice Option': ['Choice Option', 'ChoiceOption'],
};

// Figma plugin runtimes can import published library assets by key, but they
// cannot reliably search enabled libraries by display name. Keep this manifest
// synced with packages/figma/plugins/a1-json/a1-library-manifest.json after the
// A1 Design System library is published so consumer files can import real A1
// components, text styles, and variables without creating local assets.
const A1_FIGMA_LIBRARY_MANIFEST = {
  schemaVersion: '1.0',
  library: {
    name: 'A1 Design System',
    fileKey: 'zFjqo3SwHbkXwtCOoQCVMA',
    updatedAt: '2026-07-16T00:00:00.000Z',
  },
  componentSets: {
    'Page Layout': 'd82ef3aba30e8b4d1d58e3a5ae5707560f541da3',
    'Top Header': 'b29c94908da66c1e1470579729f621f4ac387ba2',
    'Top Header Nav Item': '42492a243fd3a676f5280e5b1e5c93a8f8acd473',
    Section: '68dc12cd4b1ac196b3760d6a2ae4b08de7e6f3e3',
    Stack: '',
    Grid: '',
    Divider: '1ee9483d2205bc0afa3f57c233eaedf63198c931',
    Heading: '',
    Paragraph: '',
    Link: 'a09495424aa0f98e80b1269a132278e125c403b5',
    Breadcrumb: '',
    Card: '7e852bd775ddad05b029273190deb4a53495d3c7',
    Figure: 'aff5652e13cb6683be4bd739418ef44cec3a7697',
    Blockquote: '5974e12793486e3a14e7c7a2230a3cd0873fe220',
    Code: '',
    Inline: '',
    'Definition List': 'f76746e1de219d521b602fc3f317dd03f114bb21',
    'Definition List Item': 'ce961eccb8ad3774f4b5d2e152672bdf1a3b67c6',
    'Empty State': '6c1709cca520d7f8a2f3f9fecf5b3f851c78a835',
    Badge: '75610ade739d2212122a3c527cc310f7fa5f03e7',
    Banner: '9fb3f80af9b1ced16081e13f1bfc281f0d638430',
    'Text Field': '1cd82ac5885adeb99522d00339b419400eb8af78',
    'Search Field': 'b31a09b374032f1136996829cf0401e3e2e1488b',
    Textarea: 'e5332238529186823e407d571c5b187005eee330',
    Select: '69866387be40269a2e0c4562d5aa6ce2f99226fe',
    Switch: 'd36da4007002b002f37ad6ff696abea5003f8569',
    'Radio Group': '0de620856257bb4988362cbd1ea58f25d7d8e6d0',
    'Radio Option': '75223d565ebde535b58dca7c4056c535319be8c8',
    'Checkbox Group': '9ae5010b086c5b208591a578daeeec298b2365ec',
    'Checkbox Option': '5492be70b0bb91dad3621d7bd2e5590f239887f7',
    Button: 'da0f0db105c1ef1dbe698853a3832fe46e360e1f',
    'Icon Button': '57ac131e905e1128c07357880aef71b5ee4523f5',
    'Button Container': 'de7e9b9a007d0e846c3e99d8d324d764cbe81868',
    'Segmented Control': '39d48c57f2b1b51339966db6b5298ba60612f227',
    'Segmented Control Item': '5fa75519b6e7cdaed489bc3d96ad827c7350c76f',
    Tab: '226e1f976d34b7c07d1ab9d70847fcb61b47fc75',
    'Tab Item': '226e1f976d34b7c07d1ab9d70847fcb61b47fc75',
    Chip: '80ef0f702d4be8336673e1dca8b203ded72d0edf',
    'Data Table Header Cell': '0306b31325e9efd0285ce4f3bb2cc83cd43ef93b',
    'Data Table Cell': '13afac0ac9aa20a04ca40da56b1f6e4d3a1a2455',
    'Choice Option': '14ef0c68c313915551f530b138b8b7ea52de72c2',
    'Page Nav Item': '114eb38f3b237c2bcebb63eca790051e1fbf81d1',
    'Tree Menu Item': '9cf319073738842be1669f336043ccd31f67ca68',
    Pagination: '58ae0a1f6a3f31c19ee3d86bf5874fed431a8127',
    'Menu Item': '084d9c2f1bea89b00e7d027f2a7ca0a7c9e51fd9',
    Tooltip: 'bf8663c9aa7880b7083cf7604964c62622b33e69',
    Accordion: '19499d1ef073b61a2f8b2e9967f647437ff6c41c',
    Dialog: '8fa31267ebf46c2186f59b353745ba08e63c9fcd',
  },
  components: {
    Tabs: '5d546b02b22c470e9dfbe56681b6702f69a5f902',
    Menu: 'cc29ada43150ce4a2cf3a6830fbfea00b155e537',
    'Page Nav': '6717777701583a261a08ae2a5dda2002306ceed9',
    'Tree Menu': '85b776f9b30d2949efb84865445517993a3777ff',
    'Bottom Sheet': '',
    'Chip Group': '9dc343087a890bad29c827b48d451f2c83dead56',
    'Data Table': '4434a4cbc527493705f2195368e984834fd3a726',
    'Choice Group': '01023c8436a7328bde010c6e624a32a67ae37cfc',
    'A1 Audit Report Card': '2f8a918e426ceb3a1cd3587ce289c9ae636f3f3d',
  },
  textStyles: {
    'Body/LG': '9f266ee604b73b55a38874edc7d625a577c9055b',
    'Body/MD': 'eaff0648ee751d2317d6e98dad0a923600b61330',
    'Body/SM': '22a35ef10624899ae3799d84ec4d9f2c9f2bf0d1',
    'Breadcrumb/current': 'd4965a8e0263e1c58493618bd868dcbb339116f8',
    'Button/lg': '0546dbf0291ae4f538897986bbfcf06b48f2e4a6',
    'Button/md': '54aa7319053e9a4d202df084a419bbdd713920f9',
    'Button/sm': '70b097c4740986ffea6d3fcd999f1e8da1c5442f',
    'Chip/sm': '43c2ffcd79447672a2e98d933e5e3c5cfc9e0dc0',
    'Chip/md': '5e726918966cecc92f43b9cf89a066744204ca5e',
    'Chip/lg': '12058f52531347fcff9524c8ebdf9f1f81a01c41',
    'Chip/Group label': 'a64eb90649ceae389b918f354eb2fe9ef957be7a',
    'Choice/Label compact': 'c0b444acc47b847cba2a005c1b62829385ece30a',
    'Choice/Label default': '9520fb4bcded3ad4a6245847b6ee3958f63bb66f',
    'Choice/Label comfortable': '898ccbf12d47e8d6e3a059cbf158cf23d22b120f',
    'Choice/Subtext compact': '2284bbadb088c89bc07619aa6d3fa6587433c490',
    'Code/sm': '77df0cd55fa3cb8ccd6425a702a3e6ae8b34170b',
    'Data Table/Header': 'db0b4f1dff9c5f8514fe42f9ff47149114489ae5',
    'Field/Label/LG': 'd862402c7bcb64476bfcd8c6df2062dc7f97dc85',
    'Field/Label/MD': 'f23c4eea472fdf87a020f05e24c8df9655d87367',
    'Field/Label/SM': 'a8a66a560c8c76a39cccf9c315e191d5afbb9f1b',
    'Heading/MD': '4bb109513898fb957c3421b8518e77523510d04b',
    'Link/lg/bold': 'dbbacce65241cd9d0999828f1da479dec64e1a21',
    'Link/lg/medium': 'd82cc09fd07ef2d8bd510aa5c13cbaee2abd1fc8',
    'Link/lg/normal': '2cbd5a6943489d5c53dfdc4fd8cf5228cb425459',
    'Link/lg/semibold': 'd1d21d92f06bec1e4cb5d5845f25917d22f58c8e',
    'Link/md/bold': '81738e242b2962648b3b5a944beed0f3a1328d36',
    'Link/md/medium': '2eb46c66b70625072718cd1e4b6f93eb23c15c7a',
    'Link/md/normal': 'fcf2edf419640a25aaa3a1ee2a1dedabf15e0978',
    'Link/md/semibold': 'f68c75c5420168d3abcd42eeb37cf65eade45266',
    'Link/sm/bold': '4bbaf80a1011b6f6e78b34222f6a00e384c67205',
    'Link/sm/medium': 'c434bf775bda5adb44604e2de71a6e456265885a',
    'Link/sm/normal': '83d28cb3d2365bda739f329bc5f0865dbf17e083',
    'Link/sm/semibold': 'c6cc901d9b82385fce2dadad5213b02388d73192',
    'Link/xl/bold': '652b808944f45409099c1a727591cd34769a332d',
    'Link/xl/medium': 'a8c7c1f0da83774e3f4e1681a38568f3c0117b74',
    'Link/xl/normal': 'acddcc23ece8debe9dbe38d4ceab946be076e2fc',
    'Link/xl/semibold': '2e7ab77f7ff258575ce4f27651c2c42dd40e0faf',
    'Link/xs/bold': 'bbeab1475d9de523bc9b430fe44b476a3bb51dbb',
    'Link/xs/medium': 'db82d3299fc6737932186903e252b6de6edb006a',
    'Link/xs/normal': '6b2e72b24d33c456edcd87e155bfd50497469a45',
    'Link/xs/semibold': '71961bf343161091e73d0a9b37210c9bc917ce40',
    'Menu/Section label': 'ec7de2a34db9144b2a207b250e8c5f7861a0081d',
    'Nav/Stacked label': 'ae86763616fb6acfc49f8a85dd72c48d69a64375',
    'Page Nav/Heading': '8e44127bd0bab0f77eafb2a23f3fc5613257b587',
    'Side Nav/Active label': 'f67ba56ee8a7b4943265449e8bcce816bc08fe4f',
    'Tab/Label': '3123a295d5712a23364e54b3b763403ee4d3ef74',
    'Tab/Step number': 'c060acb63f218ce854ef0e270030455618375c0a',
    'Top Header/Nav label': '5570777b3e535b46f2d936e522f08ab233fc87eb',
    'body/lg': 'b7296d29c9a7af16269c9ee11e48b9f14277f42e',
    'body/md': '847de208310f51881fb2e22c44dbe2d0b21ccfa2',
    'body/sm': '496e9eb43f479d32e62e74c0902e49be9f711841',
    'body/xl': 'ff20ec67b70091bf3bd7cbb84a72961bcc907b9c',
    'body/xs': '7c72a7fdc3a3f3f6806e528d2bbfd34ad642cc73',
    'display/jumbo': '0d590b8204c32a1b3089cd2f9aa8a221f2caafa0',
    'display/lg': 'daffb3240d5ccd726171d31884b154d6f783eedd',
    'display/md': '8244c9eb661eae7bb09beda5d91e23a21ded43dc',
    'display/sm': 'af6d910406fa13d132dc6af5e4c1bab62afa71a4',
    'display/xJumbo': '7bd1721c9fa6a4bd010fcf4575d255a8a64fe109',
    'display/xl': '0b46077fa81b5802422fddba1038daaf116fc445',
    'display/xxl': '79a0d7f1e71e83b1a59af12f572ae29a0176a999',
    'heading/lg': '8ba6eb9702d59588ed43ac9d7eb02d97c01ce724',
    'heading/md': 'c89a84184412fbc98606ea7fdfbf55eaa0354976',
    'heading/sm': '992e824ed56da23e698a994f7c0c1a56f3d19878',
    'heading/xl': '971b1c66a45ead25eabf148687e54864b58b3be6',
    'heading/xs': 'bb9c83ef68f2ffd22c8de3fb6976302a61ac743a',
  },
  variables: {
    color: {
      'color/link/default': '67b3fd5210a7d9c7d55db43a719f701c1a29e16f',
      'color/link/hover': '78682b349b3866b8dd16bb8fbb98e764e37ede46',
      'color/link/pressed': 'c584501c8761fca3f271ac32e6f041ca8cf70307',
      'color/text/accent': '9f8756c1a8aba0a090043e9c8055c755f359dcc3',
      'color/text/default': 'caedd67fb36f8d52f47f9418468bd4e1e09905ca',
      'color/text/inverse': '68f1f69eb46ff2e4b46d39c8d73d0c59fa9478ae',
      'color/text/muted': '5c2fe7ec6ed7e0839e66052090870593adfdcb4c',
      'link/color': 'e84b98b292b913379f6791354da2cc20aff43500',
    },
    float: {
      'gap/2': '3c0e7bcf606c9c8b58666c56a695e10875567492',
      'gap/32': 'db75dd6d219d403a893fad87a79535e4d07d3108',
      'gap/4': '5c0cafd054616f28b0e1bd273dab171d7ff65e89',
      'gap/lg': '026fe530183b7e8b339f8124a80f5f9cffac0652',
      'gap/md': 'a49ca80206b1fbd92a69d9f3f9e13beec16a44a4',
      'gap/none': 'ca54a6f1de50bf862dd5d0d4cfdd675af9c7d5bc',
      'gap/sm': '29040c6ec3756256e4e581ab5b6ec468aa2eda27',
      'gap/xl': 'eb6007078b1ede6229d22df313c125ce297f66a1',
      'gap/xs': 'f4f06ed50620e3ac4dc0c18e0aed5880f3ad2b2c',
      'spacing/1': '56157c3a9493c8cddf0515fe26afd906faa84bad',
      'spacing/12': '85641d32fb01545a584ec1998a13f35c005a0949',
      'spacing/128': 'a4ae61541798a66111b7cb96b700095386553fc3',
      'spacing/16': 'df5aae6a41feeefae9531ff3c3714cd548f6d398',
      'spacing/2': '6d3fba326cbd90c0feb5f43b7281706229e6b44d',
      'spacing/20': '0901786c040daed6f954c94808ffc372004cbe8a',
      'spacing/24': 'df00806ce0bc1fb98828382240878d06cb95d89e',
      'spacing/32': 'cbb995b22a0f39f4c2605029d7d72e0a9c6b3f93',
      'spacing/4': 'a7301a220a40ed552a5d85bd4f2778b175941b9c',
      'spacing/40': 'f5ad410d19cec163e0506cfa641b61416b7717f2',
      'spacing/6': 'b383a0d99d1c0004c62d49933222bac77e391bac',
      'spacing/64': '52f659fc3382d10105f5a051edfac3ea2743e437',
      'spacing/8': '9f65e2232c3b2956ff2be0832862b099b4d975f6',
      'spacing/96': '93f0aec4c9ab22bc8303593f4ec8f025627eab8d',
    },
  },
};
const A1_FIGMA_COMPONENT_SET_KEYS = A1_FIGMA_LIBRARY_MANIFEST.componentSets;
const A1_FIGMA_COMPONENT_KEYS = A1_FIGMA_LIBRARY_MANIFEST.components;
const A1_FIGMA_TEXT_STYLE_KEYS = A1_FIGMA_LIBRARY_MANIFEST.textStyles;
const A1_FIGMA_COLOR_VARIABLE_KEYS = A1_FIGMA_LIBRARY_MANIFEST.variables.color;
const A1_FIGMA_FLOAT_VARIABLE_KEYS = A1_FIGMA_LIBRARY_MANIFEST.variables.float;
const A1_COMPONENT_SET_ONLY_NAMES = new Set(Object.keys(A1_FIGMA_COMPONENT_SET_KEYS));
const A1_FIGMA_COMPONENT_SET_KEY_VALUES = new Set(Object.values(A1_FIGMA_COMPONENT_SET_KEYS).filter((value) => typeof value === 'string' && value.trim()));
const A1_FIGMA_COMPONENT_KEY_VALUES = new Set(Object.values(A1_FIGMA_COMPONENT_KEYS).filter((value) => typeof value === 'string' && value.trim()));

// ─── Shared helpers ──────────────────────────────────────────────────────────

// Component property keys carry a "#nodeId" suffix for TEXT / BOOLEAN /
// INSTANCE_SWAP properties ("Label#12:3"); variant properties are plain.
function plainKey(key) {
  return key.split('#')[0];
}

function readProperties(instance) {
  const out = {};
  const props = instance.componentProperties || {};
  for (const key of Object.keys(props)) out[plainKey(key)] = props[key];
  return out;
}

function componentSetName(instanceNode) {
  try {
    const main = instanceNode && instanceNode.mainComponent;
    const set = main && main.parent && main.parent.type === 'COMPONENT_SET' ? main.parent : null;
    return set ? set.name : main ? main.name : '';
  } catch {
    // Figma may retain a stale internal instance sublayer immediately after a
    // component property or variant replacement. It is not a public component.
    return '';
  }
}

function componentProperty(instance, name, type) {
  const wanted = canonicalKey(name);
  const raw = instance.componentProperties || {};
  for (const key of Object.keys(raw)) {
    if (canonicalKey(key) !== wanted) continue;
    if (type && raw[key].type !== type) continue;
    return { key, property: raw[key] };
  }
  return null;
}

function componentPropertyValue(instance, name, type) {
  const found = componentProperty(instance, name, type);
  return found ? found.property.value : undefined;
}

function queueComponentProperty(instance, assignments, name, value, type, warnings, description) {
  const found = componentProperty(instance, name, type);
  if (!found) {
    warnings.push(`${description || name} could not be applied — no matching Figma property was found.`);
    return;
  }
  assignments[found.key] = value;
}

function queueOptionalComponentProperty(instance, assignments, name, value, type) {
  const found = componentProperty(instance, name, type);
  if (!found) return false;
  assignments[found.key] = value;
  return true;
}

function applyQueuedProperties(instance, assignments, warnings, description) {
  if (Object.keys(assignments).length === 0) return;
  try {
    instance.setProperties(assignments);
  } catch (error) {
    warnings.push(`${description || 'Component properties'} could not be applied: ${error.message}`);
  }
}

function componentId(type, instance) {
  return type.replace(/[A-Z]/g, (letter) => '-' + letter.toLowerCase()).replace(/^-/, '') + '-' + instance.id.replace(/[^a-zA-Z0-9]+/g, '-');
}

function slugifyOptionValue(label, usedValues) {
  const base = String(label || 'option')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'option';
  let value = base;
  let index = 2;
  while (usedValues.has(value)) value = `${base}-${index++}`;
  usedValues.add(value);
  return value;
}

function componentNameCandidates(name) {
  const base = String(name || '').trim();
  const aliases = FIGMA_COMPONENT_NAME_ALIASES[base] || [];
  const compact = base.replace(/\s+/g, '');
  const spaced = base.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  return [...new Set([base, ...aliases, compact, spaced].filter(Boolean))];
}

function figmaComponentNameMatches(actualName, requestedName) {
  const actual = String(actualName || '').trim();
  if (!actual) return false;
  const actualKey = canonicalKey(actual);
  const actualCompact = compactKey(actual);
  const parts = actual.split(/[\\/›>]+/).map((part) => part.trim()).filter(Boolean);
  const partKeys = parts.map(canonicalKey);
  const partCompacts = parts.map(compactKey);
  return componentNameCandidates(requestedName).some((candidate) => {
    const candidateKey = canonicalKey(candidate);
    const candidateCompact = compactKey(candidate);
    return actualKey === candidateKey
      || actualCompact === candidateCompact
      || partKeys.includes(candidateKey)
      || partCompacts.includes(candidateCompact);
  });
}

function sourceComponentSet(node) {
  try {
    if (!node) return null;
    if (node.type === 'COMPONENT_SET') return node;
    if (node.type === 'COMPONENT') return node.parent && node.parent.type === 'COMPONENT_SET' ? node.parent : null;
    if (node.type === 'INSTANCE') {
      const main = node.mainComponent;
      return main && main.parent && main.parent.type === 'COMPONENT_SET' ? main.parent : null;
    }
  } catch {
    return null;
  }
  return null;
}

function sourceStandaloneComponent(node) {
  try {
    if (!node) return null;
    if (node.type === 'COMPONENT') return node.parent && node.parent.type === 'COMPONENT_SET' ? null : node;
    if (node.type === 'INSTANCE') {
      const main = node.mainComponent;
      return main && (!main.parent || main.parent.type !== 'COMPONENT_SET') ? main : null;
    }
  } catch {
    return null;
  }
  return null;
}

function keyMatchesConfiguredComponentSetName(key, name) {
  if (!key) return false;
  const expected = configuredLibraryKeyForName(A1_FIGMA_COMPONENT_SET_KEYS, name);
  return expected ? key === expected : A1_FIGMA_COMPONENT_SET_KEY_VALUES.has(key);
}

function keyMatchesConfiguredComponentName(key, name) {
  if (!key) return false;
  const expected = configuredLibraryKeyForName(A1_FIGMA_COMPONENT_KEYS, name);
  return expected ? key === expected : A1_FIGMA_COMPONENT_KEY_VALUES.has(key);
}

function sourceMatchesA1ComponentSetName(source, name) {
  const set = sourceComponentSet(source);
  return Boolean(set && figmaComponentNameMatches(set.name, name) && keyMatchesConfiguredComponentSetName(localPublishedKey(set), name));
}

function sourceMatchesA1StandaloneComponentName(source, name) {
  const component = sourceStandaloneComponent(source);
  return Boolean(component && figmaComponentNameMatches(component.name, name) && keyMatchesConfiguredComponentName(localPublishedKey(component), name));
}

function sourceMatchesA1ComponentName(source, name) {
  return sourceMatchesA1ComponentSetName(source, name) || sourceMatchesA1StandaloneComponentName(source, name);
}

function findComponentSet(name) {
  const local = figma.root.findOne((node) =>
    node.type === 'COMPONENT_SET'
    && figmaComponentNameMatches(node.name, name)
    && sourceMatchesA1ComponentSetName(node, name));
  if (local) return local;
  const importedInstance = figma.root.findOne((node) => {
    if (node.type !== 'INSTANCE') return false;
    try {
      const main = node.mainComponent;
      const set = main && main.parent && main.parent.type === 'COMPONENT_SET' ? main.parent : null;
      return Boolean(set && sourceMatchesA1ComponentSetName(set, name));
    } catch {
      return false;
    }
  });
  if (!importedInstance || importedInstance.type !== 'INSTANCE') return null;
  try {
    const main = importedInstance.mainComponent;
    return main && main.parent && main.parent.type === 'COMPONENT_SET' ? main.parent : null;
  } catch {
    return null;
  }
}

function findComponent(name) {
  const local = figma.root.findOne((node) =>
    node.type === 'COMPONENT'
    && figmaComponentNameMatches(node.name, name)
    && sourceMatchesA1StandaloneComponentName(node, name));
  if (local) return local;
  const importedInstance = figma.root.findOne((node) => {
    if (node.type !== 'INSTANCE') return false;
    try {
      const main = node.mainComponent;
      return Boolean(main && sourceMatchesA1StandaloneComponentName(main, name));
    } catch {
      return false;
    }
  });
  if (!importedInstance || importedInstance.type !== 'INSTANCE') return null;
  try {
    return importedInstance.mainComponent || null;
  } catch {
    return null;
  }
}

function findComponentSource(name) {
  const set = findComponentSet(name);
  if (set) return set.defaultVariant;
  if (A1_COMPONENT_SET_ONLY_NAMES.has(name)) return null;
  return findComponent(name);
}

const libraryComponentSourceCache = new Map();

function libraryDescriptionTextValues(description) {
  const values = [];
  const add = (value) => {
    if (typeof value === 'string' && value.trim()) values.push(value.trim());
  };
  if (!description || typeof description !== 'object') return values;
  for (const key of [
    'name',
    'componentName',
    'componentSetName',
    'componentSet',
    'setName',
    'parentName',
    'libraryName',
    'sourceName',
    'description',
  ]) {
    const value = description[key];
    if (typeof value === 'string') add(value);
    else if (value && typeof value === 'object') add(value.name);
  }
  return values;
}

function libraryComponentNameScore(description, requestedName) {
  const requestedNames = componentNameCandidates(requestedName);
  const candidateNames = libraryDescriptionTextValues(description);
  let score = 0;
  for (const requested of requestedNames) {
    if (!requested) continue;
    const requestedKey = canonicalKey(requested);
    const requestedCompact = compactKey(requested);
    for (const rawName of candidateNames) {
      const candidate = String(rawName || '').trim();
      if (!candidate) continue;
      const candidateKey = canonicalKey(candidate);
      const candidateCompact = compactKey(candidate);
      if (candidate === requested || candidateKey === requestedKey || candidateCompact === requestedCompact) score = Math.max(score, 100);
      const parts = candidate.split(/[\\/›>]+/).map((part) => part.trim()).filter(Boolean);
      const partKeys = parts.map(canonicalKey);
      const partCompacts = parts.map(compactKey);
      if (partKeys[0] === requestedKey || partCompacts[0] === requestedCompact) score = Math.max(score, 95);
      if (partKeys[partKeys.length - 1] === requestedKey || partCompacts[partCompacts.length - 1] === requestedCompact) score = Math.max(score, 90);
      if (partKeys.includes(requestedKey) || partCompacts.includes(requestedCompact)) score = Math.max(score, 85);
      if (candidateKey.startsWith(`${requestedKey}/`) || candidateKey.startsWith(`${requestedKey},`) || candidateKey.startsWith(`${requestedKey}:`) || candidateCompact.startsWith(requestedCompact)) {
        score = Math.max(score, 80);
      }
    }
  }
  const libraryName = String(description && (description.libraryName || (description.library && description.library.name)) || '');
  if (score > 0 && /a1|A1 Design System/i.test(libraryName)) score += 5;
  return score;
}

function libraryDescriptionLooksLikeA1(description) {
  if (!description || typeof description !== 'object') return false;
  const key = typeof description.key === 'string' ? description.key.trim() : '';
  if (key && (A1_FIGMA_COMPONENT_SET_KEY_VALUES.has(key) || A1_FIGMA_COMPONENT_KEY_VALUES.has(key))) return true;
  const libraryName = String(description.libraryName || (description.library && description.library.name) || '').trim();
  return /\bA1\b|A1 Design System/i.test(libraryName);
}

function bestLibraryDescription(items, name) {
  return (items || [])
    .map((item) => ({ item, score: libraryComponentNameScore(item, name) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)[0]?.item || null;
}

function bestA1LibraryDescription(items, name) {
  return bestLibraryDescription((items || []).filter(libraryDescriptionLooksLikeA1), name);
}

function componentSourceFromImported(imported) {
  if (!imported) return null;
  if (imported.type === 'COMPONENT_SET') return imported.defaultVariant || imported.children[0] || null;
  if (imported.type === 'COMPONENT') {
    return imported.parent && imported.parent.type === 'COMPONENT_SET'
      ? imported.parent.defaultVariant || imported
      : imported;
  }
  return null;
}

function configuredLibraryKeyForName(map, name) {
  for (const candidate of componentNameCandidates(name)) {
    const direct = map[candidate];
    if (typeof direct === 'string' && direct.trim()) return direct.trim();
    const matchingName = Object.keys(map).find((key) => figmaComponentNameMatches(key, candidate));
    const matchingValue = matchingName ? map[matchingName] : '';
    if (typeof matchingValue === 'string' && matchingValue.trim()) return matchingValue.trim();
  }
  return '';
}

function configuredLibraryKeyNames(name) {
  return componentNameCandidates(name)
    .filter((candidate) => A1_FIGMA_COMPONENT_SET_KEYS[candidate] !== undefined || A1_FIGMA_COMPONENT_KEYS[candidate] !== undefined);
}

function hasConfiguredLibraryKeyForName(name) {
  return Boolean(
    configuredLibraryKeyForName(A1_FIGMA_COMPONENT_SET_KEYS, name)
    || configuredLibraryKeyForName(A1_FIGMA_COMPONENT_KEYS, name)
  );
}

function emptyLibraryManifest() {
  return {
    schemaVersion: '1.0',
    library: { ...A1_FIGMA_LIBRARY_MANIFEST.library },
    componentSets: {},
    components: {},
    textStyles: {},
    variables: { color: {}, float: {} },
  };
}

function normalizeLibraryManifest(value) {
  const out = emptyLibraryManifest();
  if (!value || typeof value !== 'object') return out;
  if (value.library && typeof value.library === 'object') out.library = { ...out.library, ...value.library };
  out.componentSets = value.componentSets && typeof value.componentSets === 'object' ? value.componentSets : {};
  out.components = value.components && typeof value.components === 'object' ? value.components : {};
  out.textStyles = value.textStyles && typeof value.textStyles === 'object' ? value.textStyles : {};
  const variables = value.variables && typeof value.variables === 'object' ? value.variables : {};
  out.variables = {
    color: variables.color && typeof variables.color === 'object' ? variables.color : {},
    float: variables.float && typeof variables.float === 'object' ? variables.float : {},
  };
  return out;
}

async function readClientComponentKeyRegistry() {
  if (!clientComponentKeyRegistryPromise) {
    clientComponentKeyRegistryPromise = figma.clientStorage.getAsync(A1_COMPONENT_KEY_REGISTRY_STORAGE_KEY)
      .then((value) => {
        const manifest = normalizeLibraryManifest(value);
        return manifest;
      })
      .catch(() => emptyLibraryManifest());
  }
  return clientComponentKeyRegistryPromise;
}

async function importConfiguredLibraryComponentSource(name) {
  const stored = await readClientComponentKeyRegistry();
  const setKey = configuredLibraryKeyForName({ ...stored.componentSets, ...A1_FIGMA_COMPONENT_SET_KEYS }, name);
  if (setKey && typeof figma.importComponentSetByKeyAsync === 'function') {
    const imported = await figma.importComponentSetByKeyAsync(setKey);
    return componentSourceFromImported(imported);
  }
  const componentKey = configuredLibraryKeyForName({ ...stored.components, ...A1_FIGMA_COMPONENT_KEYS }, name);
  if (componentKey && typeof figma.importComponentByKeyAsync === 'function') {
    const imported = await figma.importComponentByKeyAsync(componentKey);
    return componentSourceFromImported(imported);
  }
  return null;
}

async function importLibraryComponentSetSource(name) {
  if (!figma.teamLibrary
    || typeof figma.teamLibrary.getAvailableComponentSetsAsync !== 'function'
    || typeof figma.importComponentSetByKeyAsync !== 'function') {
    return null;
  }
  const componentSets = await figma.teamLibrary.getAvailableComponentSetsAsync();
  const description = bestA1LibraryDescription(componentSets, name);
  if (!description || !description.key) return null;
  const imported = await figma.importComponentSetByKeyAsync(description.key);
  return componentSourceFromImported(imported);
}

async function importLibraryComponentSource(name, warnings) {
  if (libraryComponentSourceCache.has(name)) return libraryComponentSourceCache.get(name);
  let source = null;
  try {
    source = await importConfiguredLibraryComponentSource(name);
    if (source && (sourceMatchesA1ComponentName(source, name) || !hasConfiguredLibraryKeyForName(name))) {
      libraryComponentSourceCache.set(name, source);
      return source;
    }
  } catch (error) {
    if (warnings) warnings.push(`Could not import "${name}" from the A1 manifest: ${error.message}`);
  }

  source = findComponentSource(name);
  if (source) {
    libraryComponentSourceCache.set(name, source);
    return source;
  }
  try {
    source = await importLibraryComponentSetSource(name);
    if (source && sourceMatchesA1ComponentName(source, name)) {
      libraryComponentSourceCache.set(name, source);
      return source;
    }
    if (!figma.teamLibrary || typeof figma.teamLibrary.getAvailableComponentsAsync !== 'function' || typeof figma.importComponentByKeyAsync !== 'function') {
      if (warnings) {
        const configuredNames = configuredLibraryKeyNames(name);
        const registryHint = configuredNames.length
          ? `The built-in A1 registry has no usable key for ${configuredNames.join(' / ')}.`
          : `The built-in A1 registry has no entry for "${name}".`;
        warnings.push(`Figma cannot search enabled component libraries by name in this runtime, so "${name}" was not imported. ${registryHint} Update the checked-in A1 registry when the published library changes.`);
      }
      libraryComponentSourceCache.set(name, null);
      return null;
    }
    const components = await figma.teamLibrary.getAvailableComponentsAsync();
    const description = bestA1LibraryDescription(components, name);
    if (!description || !description.key) {
      if (warnings) warnings.push(`No enabled Figma library component matched "${name}" (tried: ${componentNameCandidates(name).join(', ')}).`);
      libraryComponentSourceCache.set(name, null);
      return null;
    }
    const imported = await figma.importComponentByKeyAsync(description.key);
    source = componentSourceFromImported(imported);
    if (source && sourceMatchesA1ComponentName(source, name)) {
      libraryComponentSourceCache.set(name, source);
      return source;
    }
    if (source && hasConfiguredLibraryKeyForName(name)) {
      if (warnings) warnings.push(`Imported "${name}" did not match the A1 Design System manifest, so it was ignored.`);
      libraryComponentSourceCache.set(name, null);
      return null;
    }
    libraryComponentSourceCache.set(name, source || null);
    return source || null;
  } catch (error) {
    if (warnings) warnings.push(`Could not import "${name}" from enabled Figma libraries: ${error.message}`);
    libraryComponentSourceCache.set(name, null);
    return null;
  }
}

async function findComponentSourceAsync(name, warnings) {
  return importLibraryComponentSource(name, warnings);
}

function localPublishedKey(node) {
  if (!node || typeof node.key !== 'string') return '';
  const key = node.key.trim();
  return key && key !== 'undefined' ? key : '';
}

function findLocalComponentSetForRegistry(name) {
  return figma.root.findOne((node) => node.type === 'COMPONENT_SET' && figmaComponentNameMatches(node.name, name));
}

function findLocalStandaloneComponentForRegistry(name) {
  return figma.root.findOne((node) =>
    node.type === 'COMPONENT'
    && (!node.parent || node.parent.type !== 'COMPONENT_SET')
    && figmaComponentNameMatches(node.name, name));
}

async function buildLocalLibraryManifest() {
  const componentSets = {};
  const components = {};
  const textStyles = {};
  const colorVariables = {};
  const floatVariables = {};
  const missing = [];
  const names = [...new Set([
    ...Object.keys(A1_FIGMA_COMPONENT_SET_KEYS),
    ...Object.keys(A1_FIGMA_COMPONENT_KEYS),
    ...Object.keys(FIGMA_COMPONENT_NAME_ALIASES),
  ])].sort((a, b) => a.localeCompare(b));

  for (const name of names) {
    const set = findLocalComponentSetForRegistry(name);
    const setKey = localPublishedKey(set);
    if (setKey) {
      componentSets[name] = setKey;
      continue;
    }
    const component = findLocalStandaloneComponentForRegistry(name);
    const componentKey = localPublishedKey(component);
    if (componentKey) {
      components[name] = componentKey;
      continue;
    }
    missing.push(name);
  }

  try {
    const styles = await figma.getLocalTextStylesAsync();
    for (const style of styles) {
      const key = localPublishedKey(style);
      if (!key || !style.name) continue;
      textStyles[style.name] = key;
    }
  } catch {
    // Text styles are exported when the source file exposes published keys.
  }

  try {
    const variables = typeof figma.variables.getLocalVariablesAsync === 'function'
      ? [
        ...await figma.variables.getLocalVariablesAsync('COLOR'),
        ...await figma.variables.getLocalVariablesAsync('FLOAT'),
      ]
      : [];
    for (const variable of variables) {
      const key = localPublishedKey(variable);
      if (!key || !variable.name) continue;
      if (variable.resolvedType === 'COLOR') colorVariables[variable.name] = key;
      if (variable.resolvedType === 'FLOAT') floatVariables[variable.name] = key;
    }
  } catch {
    // Variables are exported when the source file exposes published keys.
  }

  return {
    schemaVersion: '1.0',
    library: {
      ...A1_FIGMA_LIBRARY_MANIFEST.library,
      updatedAt: new Date().toISOString(),
    },
    componentSets,
    components,
    textStyles,
    variables: {
      color: colorVariables,
      float: floatVariables,
    },
    missing,
  };
}

function formatLibraryManifest(registry) {
  const formatObject = (values) => {
    const entries = Object.keys(values || {})
      .sort((a, b) => a.localeCompare(b))
      .map((key) => [key, values[key]])
      .filter(([, value]) => typeof value === 'string' && value.trim())
      .reduce((out, [key, value]) => ({ ...out, [key]: value }), {});
    return entries;
  };
  return JSON.stringify({
    schemaVersion: registry.schemaVersion || '1.0',
    library: registry.library || A1_FIGMA_LIBRARY_MANIFEST.library,
    componentSets: formatObject(registry.componentSets),
    components: formatObject(registry.components),
    textStyles: formatObject(registry.textStyles),
    variables: {
      color: formatObject(registry.variables && registry.variables.color),
      float: formatObject(registry.variables && registry.variables.float),
    },
  }, null, 2);
}

async function handleExportComponentKeys() {
  const registry = await buildLocalLibraryManifest();
  await figma.clientStorage.setAsync(A1_COMPONENT_KEY_REGISTRY_STORAGE_KEY, registry);
  clientComponentKeyRegistryPromise = Promise.resolve(normalizeLibraryManifest(registry));
  const text = formatLibraryManifest(registry);
  const found = Object.keys(registry.componentSets).length + Object.keys(registry.components).length;
  const textStyleCount = Object.keys(registry.textStyles).length;
  const variableCount = Object.keys(registry.variables.color).length + Object.keys(registry.variables.float).length;
  const warnings = registry.missing.length
    ? [`${registry.missing.length} known A1 component names did not have published local keys in this file: ${registry.missing.slice(0, 12).join(', ')}${registry.missing.length > 12 ? ', …' : ''}`]
    : [];
  postPluginMessage({
    type: 'component-key-registry-result',
    text,
    warnings,
    message: `Exported A1 library manifest: ${found} component key${found === 1 ? '' : 's'}, ${textStyleCount} text style key${textStyleCount === 1 ? '' : 's'}, and ${variableCount} variable key${variableCount === 1 ? '' : 's'}.`,
  });
}

// Resolve an INSTANCE_SWAP value (a component id) to a Material Symbols name.
// Icon components are named after the glyph; variants inside an icon set are
// named "Prop=value", so prefer the parent set's name in that case.
function iconNameFromSwapValue(value) {
  if (!value || typeof value !== 'string') return null;
  const node = figma.getNodeById(value);
  if (!node) return null;
  const name = node.name.includes('=') && node.parent && node.parent.type === 'COMPONENT_SET'
    ? node.parent.name
    : node.name;
  return name.split('/').pop().trim() || null;
}

// Instance-swap properties can retain their set default after a variant
// replacement, while the visible child instance has the actual Material icon.
// Prefer that live child when exporting Badge (and retain the property lookup
// as a fallback for older asset versions).
function iconNameFromInstance(instance, childName = 'Icon') {
  // Do not use `findOne` here. Figma can retain a just-replaced instance
  // sublayer in its native traversal; merely reading that proxy's `name`
  // throws outside the callback's normal try/catch. Re-fetch every descendant
  // by id before looking at it instead.
  const root = liveNode(instance);
  if (!root || root.type !== 'INSTANCE') return null;
  const queue = [...stackFlowChildren(root)];
  const visited = new Set();
  while (queue.length) {
    const candidate = liveNode(queue.shift());
    if (!candidate || visited.has(candidate.id)) continue;
    visited.add(candidate.id);
    try {
      if (candidate.type === 'INSTANCE' && candidate.name === childName) {
        const component = candidate.mainComponent;
        return component ? iconNameFromSwapValue(component.id) : null;
      }
      if ('children' in candidate) queue.push(...stackFlowChildren(candidate));
    } catch {
      // The sublayer changed during a variant swap. Skip only this icon.
    }
  }
  return null;
}

function findIconComponent(iconName) {
  const match = figma.root.findOne((node) =>
    (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') &&
    (node.name === iconName || node.name.split('/').pop().trim() === iconName));
  if (!match) return null;
  return match.type === 'COMPONENT_SET' ? match.defaultVariant : match;
}

function sourcePageName(node) {
  try {
    for (let current = node; current; current = current.parent) {
      if (current.type === 'PAGE') return current.name || '';
    }
  } catch {
    return '';
  }
  return '';
}

function materialIconNameCandidate(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const parenthesized = raw.match(/\bicon\s*\(([^)]+)\)/i);
  const tail = parenthesized ? parenthesized[1] : raw.split('/').pop().trim();
  const normalized = tail.replace(/^Material Symbols?\s*[-:/]\s*/i, '').trim();
  if (!normalized || /^[a-z]+=[^/]+$/i.test(normalized)) return '';
  const key = canonicalKey(normalized);
  if (['icon', 'navicon', 'default', 'regular', 'outlined', 'filled', 'true', 'false'].includes(key)) return '';
  return normalized;
}

function materialIconNameFromSource(component, instanceName = '') {
  if (!component) return '';
  try {
    const set = component.parent && component.parent.type === 'COMPONENT_SET' ? component.parent : null;
    const pageName = canonicalKey(sourcePageName(set || component));
    const setName = set ? set.name : '';
    const componentName = component.name || '';
    const sourceKey = canonicalKey(`${pageName} ${setName} ${componentName}`);
    const iconSourceLike = /material|symbol|icon/.test(sourceKey);
    const nameCandidate = materialIconNameCandidate(setName)
      || materialIconNameCandidate(componentName)
      || materialIconNameCandidate(instanceName);
    return iconSourceLike && nameCandidate ? nameCandidate : '';
  } catch {
    return '';
  }
}

function sourceLooksLikeMaterialIcon(component, requestedName = '') {
  const name = materialIconNameFromSource(component, requestedName);
  if (!name) return false;
  return !requestedName || compactKey(name) === compactKey(requestedName);
}

async function findMaterialIconComponentAsync(iconName, warnings) {
  const requested = materialIconNameCandidate(iconName);
  if (!requested) return null;
  const local = findIconComponent(requested);
  if (local && (sourceLooksLikeMaterialIcon(local, requested) || materialIconNameCandidate(local.name) === requested)) return local;

  if (!figma.teamLibrary || typeof figma.teamLibrary.getAvailableComponentSetsAsync !== 'function') return local || null;

  try {
    if (typeof figma.importComponentSetByKeyAsync === 'function') {
      const sets = await figma.teamLibrary.getAvailableComponentSetsAsync();
      const description = bestA1LibraryDescription(sets, requested);
      if (description && description.key) {
        const imported = await figma.importComponentSetByKeyAsync(description.key);
        const source = componentSourceFromImported(imported);
        if (source && sourceLooksLikeMaterialIcon(source, requested)) return source;
      }
    }
    if (typeof figma.teamLibrary.getAvailableComponentsAsync === 'function' && typeof figma.importComponentByKeyAsync === 'function') {
      const components = await figma.teamLibrary.getAvailableComponentsAsync();
      const description = bestA1LibraryDescription(components, requested);
      if (description && description.key) {
        const imported = await figma.importComponentByKeyAsync(description.key);
        const source = componentSourceFromImported(imported);
        if (source && sourceLooksLikeMaterialIcon(source, requested)) return source;
      }
    }
  } catch (error) {
    if (warnings) warnings.push(`Material icon "${requested}" could not be imported from the A1 library: ${error.message}`);
  }
  return local || null;
}

function materialIconNameFromInstance(instance) {
  const live = liveNode(instance);
  if (!live || live.type !== 'INSTANCE') return '';
  try {
    const main = live.mainComponent;
    if (!main) return '';
    const instanceName = canonicalKey(live.name || '');
    const compactInstanceName = compactKey(live.name || '');
    const componentName = canonicalKey(componentSetName(live) || '');
    const mainName = canonicalKey(main.name || '');
    const materialSetLike = /material|symbol|icon/.test(componentName);
    const iconLayerLike = instanceName === 'icon'
      || instanceName.endsWith(' icon')
      || instanceName.includes('icon ')
      || compactInstanceName.startsWith('icon');
    const pageIconName = materialIconNameFromSource(main, live.name || '');
    if (pageIconName) return pageIconName;
    const layerIconName = iconLayerLike ? materialIconNameCandidate(live.name || '') : '';
    const iconName = layerIconName
      || iconNameFromSwapValue(main.id)
      || (materialSetLike || iconLayerLike ? (main.name || componentSetName(live) || live.name || '').split('/').pop().trim() : '');
    // A1 components consistently nest Material Symbols as layers named Icon,
    // Nav icon, etc. Standalone Material-symbol instances often expose the
    // glyph as the component/set name. Treat those as valid audit internals
    // without making arbitrary external component instances exportable.
    if ((iconLayerLike || materialSetLike) && iconName) return iconName;
    if ((iconLayerLike || materialSetLike) && (mainName === 'icon' || componentName === 'icon')) return 'icon';
  } catch {
    return '';
  }
  return '';
}

// setProperties on a TEXT property re-renders the label, which requires the
// label's font to be loaded first.
async function loadInstanceFonts(instance) {
  const texts = instance.findAll((node) => node.type === 'TEXT');
  await Promise.all(texts
    .filter((text) => text.fontName !== figma.mixed)
    .map((text) => figma.loadFontAsync(text.fontName)));
}

const WARNING_SUMMARY_LIMIT = 18;

function warningText(value) {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function compactWarnings(warnings, limit = WARNING_SUMMARY_LIMIT) {
  if (!Array.isArray(warnings)) return [];
  const counts = new Map();
  for (const warning of warnings) {
    const text = warningText(warning);
    if (!text) continue;
    counts.set(text, (counts.get(text) || 0) + 1);
  }
  const compacted = [...counts.entries()].map(([text, count]) =>
    count > 1 ? `${text} (${count}×)` : text);
  if (compacted.length <= limit) return compacted;
  const hidden = compacted.length - limit;
  return [
    ...compacted.slice(0, limit),
    `${hidden} additional unique warning${hidden === 1 ? '' : 's'} omitted. Run Audit for the full finding list.`,
  ];
}

function compactWarningMessage(message) {
  if (typeof message !== 'string' || !message.includes('\n')) return message;
  return compactWarnings(message.split('\n')).join('\n');
}

function postPluginMessage(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    figma.ui.postMessage(payload);
    return;
  }
  const message = { ...payload };
  if (Array.isArray(message.warnings)) {
    const originalWarnings = message.warnings.map(warningText).filter(Boolean);
    const originalMessage = originalWarnings.join('\n');
    message.warnings = compactWarnings(originalWarnings);
    if (typeof message.message === 'string' && message.message === originalMessage) {
      message.message = message.warnings.join('\n');
    }
  }
  if (typeof message.message === 'string') message.message = compactWarningMessage(message.message);
  figma.ui.postMessage(message);
}

function postError(message) {
  postPluginMessage({ type: 'error', message });
}

// The component-set name (or bare component name) an instance belongs to, if
// it has a registered exporter.
function registeredSetName(instanceNode) {
  try {
    const detachedName = instanceNode && typeof instanceNode.getSharedPluginData === 'function'
      ? instanceNode.getSharedPluginData(DETACHED_COMPONENT_NAMESPACE, DETACHED_COMPONENT_KEY)
      : '';
    if (detachedName && EXPORTERS[detachedName]) return detachedName;
  } catch {
    // A stale Figma node can reject plugin-data reads while an instance swaps.
  }
  const name = componentSetName(instanceNode);
  return EXPORTERS[name] ? name : null;
}

function isA1ComponentInstance(instanceNode, componentName) {
  const instance = liveNode(instanceNode);
  if (!instance || instance.type !== 'INSTANCE') return false;
  try {
    const detachedName = typeof instance.getSharedPluginData === 'function'
      ? instance.getSharedPluginData(DETACHED_COMPONENT_NAMESPACE, DETACHED_COMPONENT_KEY)
      : '';
    if (detachedName === componentName) return true;
  } catch {
    // Detached metadata is a convenience marker, not the source of truth.
  }

  const source = findComponentSource(componentName);
  if (!source) return false;
  try {
    const main = instance.mainComponent;
    if (!main) return false;
    if (main.id === source.id) return true;
    const mainSet = main.parent && main.parent.type === 'COMPONENT_SET' ? main.parent : null;
    const sourceSet = source.parent && source.parent.type === 'COMPONENT_SET' ? source.parent : null;
    return Boolean(mainSet && sourceSet && mainSet.id === sourceSet.id);
  } catch {
    return false;
  }
}

// Figma can emit a document-change event after replacing an instance sublayer
// but before its selection tree has settled. Never read layout/component fields
// from that stale proxy: re-fetch it by id and skip it if it no longer exists.
function liveNode(node) {
  try {
    if (!node || typeof node.id !== 'string') return null;
    return figma.getNodeById(node.id) || null;
  } catch {
    return null;
  }
}

function stackFlowChildren(frame) {
  let children = [];
  try {
    children = frame && frame.children ? frame.children : [];
  } catch {
    return [];
  }
  return children
    .map(liveNode)
    .filter(Boolean)
    .filter((child) => {
      try {
        return child.layoutPositioning !== 'ABSOLUTE';
      } catch {
        return false;
      }
    });
}

// ── Variable-collection helpers (ContentWidth / Gap / Color modes) ──────────

function localCollection(name) {
  return figma.variables.getLocalVariableCollections().find((collection) => collection.name === name) || null;
}

function collectionModeName(collection, modeId) {
  const mode = collection.modes.find((entry) => entry.modeId === modeId);
  return mode ? mode.name : null;
}

// The explicitly applied mode of a named collection on the node or any frame /
// instance inside it (the ContentWidth mode may sit on the Section instance or
// on the inner _content frame). Returns null when the mode is only inherited.
function explicitCollectionMode(root, collectionName) {
  const collection = localCollection(collectionName);
  if (!collection) return null;
  const liveRoot = root && root.type === 'INSTANCE' ? currentInstance(root) : root;
  let descendants = [];
  try {
    descendants = liveRoot.findAll((node) => node.type === 'FRAME' || node.type === 'INSTANCE');
  } catch {
    return null;
  }
  const nodes = [liveRoot].concat(descendants);
  for (const node of nodes) {
    try {
      const modes = node.explicitVariableModes || {};
      if (modes[collection.id]) return collectionModeName(collection, modes[collection.id]);
    } catch {
      // A component variant swap can leave an internal frame/instance handle
      // stale until Figma completes the document-change turn.
    }
  }
  return null;
}

function applyCollectionMode(target, collectionName, wantedModeName) {
  const collection = localCollection(collectionName);
  if (!collection) return false;
  const mode = collection.modes.find((entry) => entry.name === wantedModeName);
  if (!mode) return false;
  try {
    target.setExplicitVariableModeForCollection(collection, mode.modeId);
    return true;
  } catch (error) {
    return false;
  }
}

function pushGapVariableWarning(warnings, message) {
  if (!warnings || gapVariableWarnings.has(message)) return;
  gapVariableWarnings.add(message);
  warnings.push(message);
}

function localFloatVariables() {
  try {
    if (typeof figma.variables.getLocalVariables === 'function') {
      return figma.variables.getLocalVariables('FLOAT');
    }
  } catch {
    return [];
  }
  return [];
}

async function importConfiguredFloatVariable(name) {
  if (!figma.variables || typeof figma.variables.importVariableByKeyAsync !== 'function') return null;
  try {
    const stored = await readClientComponentKeyRegistry();
    const map = { ...A1_FIGMA_FLOAT_VARIABLE_KEYS, ...stored.variables.float };
    const key = configuredVariableKeyForName(map, name);
    return key ? await figma.variables.importVariableByKeyAsync(key) : null;
  } catch {
    return null;
  }
}

async function ensureGapFloatVariable(gap, warnings) {
  const value = nearestStackGap(Number(gap));
  const name = STACK_GAP_VARIABLE_NAMES[value] || `gap/${value}`;
  const variable = localFloatVariables().find((candidate) =>
    candidate
      && candidate.name === name);
  if (variable) return variable;
  const imported = await importConfiguredFloatVariable(name);
  if (imported) return imported;
  if (!localCollection('Spacing')) {
    pushGapVariableWarning(warnings, 'Spacing variable collection was not found. The plugin will not create local variables, so Stack/Grid gaps were normalized with pixel values only.');
  } else {
    pushGapVariableWarning(warnings, `Spacing variable "${name}" was not found. The plugin will not create local variables, so ${value}px was used directly.`);
  }
  return null;
}

async function bindGapProperty(node, property, value, warnings, label) {
  const gap = nearestStackGap(Number(value));
  try {
    node[property] = gap;
  } catch (error) {
    warnings.push(`${label || property} could not be set to ${gap}px: ${error.message}`);
    return gap;
  }
  if (gap === 0) return gap;
  const variable = await ensureGapFloatVariable(gap, warnings);
  if (!variable) return gap;
  try {
    node.setBoundVariable(property, variable);
  } catch (error) {
    warnings.push(`${label || property} could not be bound to ${variable.name}: ${error.message}`);
  }
  return gap;
}

function propertyHasBoundVariable(node, property) {
  try {
    const bound = node && node.boundVariables && node.boundVariables[property];
    if (Array.isArray(bound)) return bound.some((entry) => entry && entry.id);
    return Boolean(bound && bound.id);
  } catch {
    return false;
  }
}

function gapNeedsVariableBinding(value) {
  return nearestStackGap(Number(value)) !== 0;
}

// ── Section property carriers (the split Section model) ─────────────────────
// The Figma Section is split across components: the outer Section set plus
// internal part instances such as "Section Content", which carries the
// contentWidth (and possibly padding) properties. Rather than guessing names,
// property lookups scan the section instance and every internal part instance
// (anything that isn't a registered component like Button), matching property
// keys case- and spacing-insensitively.

function canonicalKey(key) {
  return plainKey(key).replace(/[\s_-]+/g, '').toLowerCase();
}

function compactKey(key) {
  return plainKey(key).replace(/[^a-z0-9]+/gi, '').toLowerCase();
}

function looseNameMatch(candidateName, requestedName) {
  const candidate = String(candidateName || '');
  const requested = String(requestedName || '');
  if (!candidate || !requested) return false;
  const candidateCanonical = canonicalKey(candidate);
  const requestedCanonical = canonicalKey(requested);
  if (candidateCanonical === requestedCanonical || candidateCanonical.endsWith(requestedCanonical)) return true;
  const candidateCompact = compactKey(candidate);
  const requestedCompact = compactKey(requested);
  return candidateCompact === requestedCompact || candidateCompact.endsWith(requestedCompact);
}

// ── Free Figma text → Heading / Paragraph ──────────────────────────────────
// Figma deliberately models ordinary editorial copy as text layers with local
// styles instead of component instances. These helpers make that convention
// serializable without treating text inside an A1 component as a separate node.
const HEADING_SIZES = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
const DISPLAY_SIZES = ['sm', 'md', 'lg', 'xl', 'xxl', 'jumbo', 'xjumbo'];
const PARAGRAPH_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
const HEADING_FONT_SIZES = { xs: 18, sm: 20, md: 24, lg: 28, xl: 32, xxl: 40 };
const DISPLAY_FONT_SIZES = { sm: 24, md: 28, lg: 32, xl: 40, xxl: 56, jumbo: 72, xjumbo: 96 };
const PARAGRAPH_FONT_SIZES = { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 };

function nearestTextSize(scale, fontSize, fallback) {
  if (typeof fontSize !== 'number') return fallback;
  return Object.keys(scale).reduce((nearest, size) =>
    Math.abs(scale[size] - fontSize) < Math.abs(scale[nearest] - fontSize) ? size : nearest, fallback);
}

function nearestTextSizeDistance(scale, fontSize, fallback) {
  const size = nearestTextSize(scale, fontSize, fallback);
  return typeof fontSize === 'number' ? Math.abs(scale[size] - fontSize) : Infinity;
}

function inferredTextFamily(fontSize, likelyHeading) {
  if (!likelyHeading) return 'body';
  // Figma Display and Heading are separate A1 families. When there is no
  // local A1 style to tell us which one it is, choose Display only when its
  // scale is genuinely closer; ties retain Heading's semantic default.
  const headingDistance = nearestTextSizeDistance(HEADING_FONT_SIZES, fontSize, 'md');
  const displayDistance = nearestTextSizeDistance(DISPLAY_FONT_SIZES, fontSize, 'md');
  return displayDistance < headingDistance ? 'display' : 'heading';
}

function textFontStyleName(text) {
  try {
    if (!text || text.fontName === figma.mixed) return '';
    return String(text.fontName && text.fontName.style || '');
  } catch {
    return '';
  }
}

function textLayerPlainContent(text) {
  try {
    return typeof text.characters === 'string' ? text.characters.trim() : '';
  } catch {
    return '';
  }
}

function textLooksLikeShortTitle(text) {
  const content = textLayerPlainContent(text);
  if (!content) return false;
  const lines = content.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length > 2 || content.length > 90) return false;
  return !/[.!?]\s*$/.test(content);
}

function textLayerNameSuggestsHeading(text) {
  try {
    return /\b(heading|headline|title|display|hero|h[1-6])\b/i.test(String(text && text.name || ''));
  } catch {
    return false;
  }
}

function textLooksLikeHeading(text, fontSize) {
  if (typeof fontSize !== 'number') return textLayerNameSuggestsHeading(text);
  if (textLayerNameSuggestsHeading(text)) return true;
  if (fontSize >= 24) return true;
  const shortTitle = textLooksLikeShortTitle(text);
  if (fontSize >= 20 && shortTitle) return true;
  if (fontSize >= 18 && shortTitle && /medium|semi|demi|bold|black/i.test(textFontStyleName(text))) return true;
  return false;
}

function textStyleName(text) {
  if (!text.textStyleId || text.textStyleId === figma.mixed) return '';
  const style = figma.getStyleById(text.textStyleId);
  return style && style.type === 'TEXT' ? style.name : '';
}

function textAlignment(text) {
  const alignment = text.textAlignHorizontal;
  if (alignment === 'CENTER') return 'center';
  if (alignment === 'RIGHT') return 'right';
  return 'left';
}

function conversionTextAlignment(text, warnings, label = 'Converted text') {
  try {
    if (text.textAlignHorizontal === 'CENTER') return 'center';
    if (text.textAlignHorizontal === 'RIGHT') return 'right';
    if (text.textAlignHorizontal === 'LEFT') return 'left';
    if (text.textAlignHorizontal === 'JUSTIFIED') {
      warnings.push(`${label} uses justified text alignment, which A1 Heading/Body does not support; left alignment was used.`);
    }
  } catch {
    // Fall through to the default alignment below.
  }
  return 'left';
}

function textColorTokenFromVariable(variable) {
  // `canonicalKey` intentionally keeps `/` for component/style paths. Color
  // variables use that separator (`color/text/accent`), so normalize it before
  // matching semantic token suffixes.
  const name = variable && canonicalKey(variable.name).replaceAll('/', '');
  if (name && name.endsWith('textdefault')) return 'default';
  if (name && name.endsWith('textmuted')) return 'muted';
  if (name && name.endsWith('textaccent')) return 'accent';
  return null;
}

function isLinkColorVariable(variable) {
  const name = variable && canonicalKey(variable.name);
  return Boolean(name && (name === canonicalKey('link/color') || name.endsWith(canonicalKey('link/color'))));
}

function visibleSolidTextPaint(text) {
  return Array.isArray(text.fills)
    ? text.fills.find((entry) => entry && entry.type === 'SOLID' && entry.visible !== false)
    : null;
}

function firstSolidTextPaint(text) {
  const direct = visibleSolidTextPaint(text);
  if (direct) return direct;
  if (!text || !text.characters || typeof text.getRangeFills !== 'function') return null;
  try {
    const fills = text.getRangeFills(0, text.characters.length);
    const rangePaint = Array.isArray(fills)
      ? fills.find((entry) => entry && entry.type === 'SOLID' && entry.visible !== false)
      : null;
    if (rangePaint) return rangePaint;
    // A mixed range can decline to expose a single fill array. Any single
    // character supplies a valid paint carrier for the full AutoFix binding.
    for (let index = 0; index < text.characters.length; index += 1) {
      const characterFills = text.getRangeFills(index, index + 1);
      const characterPaint = Array.isArray(characterFills)
        ? characterFills.find((entry) => entry && entry.type === 'SOLID' && entry.visible !== false)
        : null;
      if (characterPaint) return characterPaint;
    }
    return null;
  } catch {
    return null;
  }
}

function textColorToken(text) {
  const paint = visibleSolidTextPaint(text);
  const variableId = paint && paint.boundVariables && paint.boundVariables.color && paint.boundVariables.color.id;
  const variable = variableId && figma.variables.getVariableById(variableId);
  // The JSON model deliberately carries the component's semantic color prop
  // (`color: "muted"`), never a rendered color. This maps to the Figma
  // `color/text/muted` variable and lets every A1 renderer resolve its own
  // theme. Figma's variable path includes the `color/` namespace, so match its
  // semantic suffix rather than assuming a shortened variable name.
  return textColorTokenFromVariable(variable);
}

function textUsesLinkColor(text) {
  const paint = visibleSolidTextPaint(text);
  return paintUsesLinkColor(paint);
}

function paintUsesLinkColor(paint) {
  const variableId = paint && paint.boundVariables && paint.boundVariables.color && paint.boundVariables.color.id;
  return Boolean(variableId && isLinkColorVariable(figma.variables.getVariableById(variableId)));
}

function isBluePaint(paint) {
  const color = paint && paint.color;
  return Boolean(color && color.b > color.g && color.b > color.r);
}

function isBlackPaint(paint) {
  const color = paint && paint.color;
  return Boolean(color && color.r === 0 && color.g === 0 && color.b === 0);
}

function isBlueUnderlinedText(text) {
  if (!text || text.textDecoration !== 'UNDERLINE') return false;
  if (textUsesLinkColor(text)) return true;
  // A manually-authored blue or blue-violet underline is an intentional link
  // cue. The AutoFix below replaces it with the A1 Link style and token rather
  // than preserving a raw paint value in JSON.
  return isBluePaint(visibleSolidTextPaint(text));
}

function inlineLinkRanges(text) {
  if (!text || !text.characters || typeof text.getRangeTextDecoration !== 'function' || typeof text.getRangeFills !== 'function') return [];
  const ranges = [];
  let open = null;
  const close = (end) => {
    if (!open) return;
    ranges.push({ start: open.start, end, needsFix: open.needsFix });
    open = null;
  };

  for (let index = 0; index < text.characters.length; index += 1) {
    let isLink = false;
    let needsFix = true;
    try {
      const decoration = text.getRangeTextDecoration(index, index + 1);
      const fills = text.getRangeFills(index, index + 1);
      const paint = Array.isArray(fills) ? fills.find((entry) => entry && entry.type === 'SOLID' && entry.visible !== false) : null;
      // Within a Heading or Paragraph, an underline is the explicit authored
      // inline-link cue. The surrounding component owns typography; AutoFix
      // normalizes the range itself to Link's semantic color token.
      isLink = decoration === 'UNDERLINE';
      needsFix = !paintUsesLinkColor(paint);
    } catch {
      // Range inspection is unavailable for a transient mixed-text selection.
      // The layer can still export as ordinary Heading or Paragraph text.
      isLink = false;
    }
    if (isLink && !open) open = { start: index, needsFix };
    else if (isLink && open) open.needsFix = open.needsFix || needsFix;
    else close(index);
  }
  close(text.characters.length);
  return ranges;
}

function resolvedVariableColor(variable, modeId, seen = new Set()) {
  if (!variable || seen.has(variable.id)) return null;
  seen.add(variable.id);
  const values = variable.valuesByMode || {};
  const value = values[modeId] || values[Object.keys(values)[0]];
  if (value && typeof value.r === 'number' && typeof value.g === 'number' && typeof value.b === 'number') return value;
  if (value && value.type === 'VARIABLE_ALIAS' && value.id) {
    return resolvedVariableColor(figma.variables.getVariableById(value.id), modeId, seen);
  }
  return null;
}

function colorDistance(first, second) {
  const opacityA = first.opacity === undefined ? 1 : first.opacity;
  const opacityB = second.a === undefined ? 1 : second.a;
  return Math.hypot(first.color.r - second.r, first.color.g - second.g, first.color.b - second.b, opacityA - opacityB);
}

async function nearestTextColorToken(text, allowedTokens) {
  const paint = visibleSolidTextPaint(text);
  if (!paint || !paint.color) return null;
  const variables = await figma.variables.getLocalVariablesAsync('COLOR');
  let nearest = null;
  for (const variable of variables) {
    const token = textColorTokenFromVariable(variable);
    if (!token || !allowedTokens.includes(token)) continue;
    for (const modeId of Object.keys(variable.valuesByMode || {})) {
      const color = resolvedVariableColor(variable, modeId);
      if (!color) continue;
      const distance = colorDistance(paint, color);
      if (!nearest || distance < nearest.distance) nearest = { token, distance };
    }
  }
  return nearest && nearest.token;
}

function currentTextNode(text) {
  const current = text && figma.getNodeById(text.id);
  return current && current.type === 'TEXT' ? current : text;
}

function headingElementForSize(size) {
  return ({ xs: 'h6', sm: 'h5', md: 'h4', lg: 'h3', xl: 'h2', xxl: 'h1' })[size] || 'h2';
}

function inferredLinkWeight(text) {
  if (!text || text.fontName === figma.mixed) return 'normal';
  const style = String(text.fontName.style || '').toLowerCase();
  if (/black|bold/.test(style)) return 'bold';
  if (/semibold|demi/.test(style)) return 'semibold';
  if (/medium/.test(style)) return 'medium';
  return 'normal';
}

function linkTextSuggestion(text) {
  const style = textStyleName(text).trim().toLowerCase();
  const styleMatch = /^link\/(xs|sm|md|lg|xl)\/(normal|medium|semibold|bold)$/.exec(style);
  const fontSize = text.fontSize === figma.mixed ? undefined : text.fontSize;
  const styleSize = styleMatch && styleMatch[1];
  const requestedSize = styleSize || nearestTextSize(PARAGRAPH_FONT_SIZES, fontSize, 'md');
  const requestedWeight = styleMatch ? styleMatch[2] : inferredLinkWeight(text);
  const hasCanonicalStyleSize = Boolean(styleMatch && typeof fontSize === 'number' && Math.abs(PARAGRAPH_FONT_SIZES[styleSize] - fontSize) < 0.01);
  const hasLinkColor = textUsesLinkColor(text);
  const issues = [];

  if (!styleMatch || !hasCanonicalStyleSize) {
    issues.push(`Blue underlined text looks like an A1 Link; Link/${requestedSize}/${requestedWeight} is the nearest match.`);
  }
  if (!hasLinkColor) issues.push('Its fill is not bound to the A1 link/color token.');
  if (!['LEFT', 'CENTER', 'RIGHT'].includes(text.textAlignHorizontal)) {
    issues.push('Its horizontal alignment is not supported by A1 Link text.');
  }

  return {
    type: 'Link',
    props: { size: requestedSize, weight: requestedWeight },
    issues,
    styleName: `link/${requestedSize}/${requestedWeight}`,
    color: 'link',
    align: textAlignment(text),
  };
}

function textSuggestion(text) {
  if (isBlueUnderlinedText(text)) return linkTextSuggestion(text);
  const style = textStyleName(text).trim().toLowerCase();
  const styleMatch = /^(heading|display|body)\/(xs|sm|md|lg|xl|xxl|jumbo|xjumbo)$/.exec(style);
  if (!styleMatch && auditA1TextStyleName(style)) {
    return {
      type: 'Paragraph',
      props: { size: 'md' },
      issues: [],
      styleName: style,
      color: textColorToken(text) || 'default',
      align: textAlignment(text),
    };
  }
  const fontSize = text.fontSize === figma.mixed ? undefined : text.fontSize;
  const likelyHeading = styleMatch
    ? styleMatch[1] !== 'body'
    : textLooksLikeHeading(text, fontSize);
  const family = styleMatch ? styleMatch[1] : inferredTextFamily(fontSize, likelyHeading);
  const scale = family === 'body' ? PARAGRAPH_FONT_SIZES : family === 'display' ? DISPLAY_FONT_SIZES : HEADING_FONT_SIZES;
  const allowed = family === 'body' ? PARAGRAPH_SIZES : family === 'display' ? DISPLAY_SIZES : HEADING_SIZES;
  const styleSize = styleMatch && allowed.includes(styleMatch[2]) ? styleMatch[2] : null;
  // A Figma text style can stay attached while its font size is locally
  // overridden. Treat the actual numeric size as authoritative so AutoFix
  // selects the nearest A1 option instead of reapplying the stale style size.
  const hasCanonicalStyleSize = styleSize && typeof fontSize === 'number' && Math.abs(scale[styleSize] - fontSize) < 0.01;
  const requestedSize = hasCanonicalStyleSize
    ? styleSize
    : nearestTextSize(scale, fontSize, family === 'body' ? 'md' : 'md');
  const detectedColor = textColorToken(text);
  const color = family === 'body' && detectedColor === 'accent' ? 'default' : detectedColor;
  const align = textAlignment(text);
  const issues = [];
  const inlineLinks = inlineLinkRanges(text);
  if (!styleMatch || !styleSize) {
    issues.push(`No A1 ${family === 'body' ? 'body' : family} text style is applied; ${family}/${requestedSize} is the nearest match.`);
  } else if (!hasCanonicalStyleSize) {
    const actualSize = typeof fontSize === 'number' ? `${fontSize}px` : 'mixed text sizes';
    issues.push(`Its font size (${actualSize}) does not match ${family}/${styleSize}; ${family}/${requestedSize} is the nearest A1 size.`);
  }
  if (!color) issues.push('Its fill is not bound to an A1 text color token.');
  if (family === 'body' && detectedColor === 'accent') issues.push('Paragraph does not support the A1 accent text color; default text color will be used.');
  if (!['LEFT', 'CENTER', 'RIGHT'].includes(text.textAlignHorizontal)) issues.push('Its horizontal alignment is not supported by A1 text components.');
  if (inlineLinks.some((link) => link.needsFix)) {
    issues.push('Blue underlined inline text looks like an A1 Link; AutoFix will bind each Link range to the link/color token.');
  }
  const props = family === 'body'
    ? { size: requestedSize, ...(color === 'muted' ? { color } : {}), ...(align !== 'left' ? { align } : {}) }
    : { as: family === 'display' ? 'h1' : headingElementForSize(requestedSize), type: family === 'display' ? 'display' : 'heading', size: requestedSize === 'xjumbo' ? 'xJumbo' : requestedSize, ...(color ? { color } : {}), ...(align !== 'left' ? { align } : {}) };
  return {
    type: family === 'body' ? 'Paragraph' : 'Heading',
    props,
    issues,
    styleName: `${family}/${requestedSize}`,
    color: color || 'default',
    align,
    inlineLinks,
  };
}

function exportTextNode(text) {
  // Figma can retain a selected-node handle across a fill-variable edit. Read
  // the current node again so manual color changes export the live binding.
  const current = currentTextNode(text);
  const suggestion = textSuggestion(current);
  const inlineLinks = suggestion.type === 'Link'
    ? []
    : (suggestion.inlineLinks || []).map(({ start, end }) => ({ start, end }));
  return {
    node: {
      id: componentId(suggestion.type, current),
      type: suggestion.type,
      props: suggestion.props,
      content: { fallback: current.characters, ...(inlineLinks.length ? { inlineLinks } : {}) },
    },
    warnings: suggestion.issues,
    review: suggestion.issues.length ? { issues: suggestion.issues, suggestion } : null,
  };
}

// ── Free auto-layout frames → Stack / Grid ────────────────────────────────
// Figma does not use a component instance for the general-purpose Stack. A
// normal authored auto-layout Frame is its counterpart. Component internals
// are deliberately excluded, while a frame placed in a native SLOT remains
// exportable: the slot is the component's editable content boundary.
function isAutoLayoutFrame(node) {
  return Boolean(node && node.type === 'FRAME' && ['HORIZONTAL', 'VERTICAL'].includes(node.layoutMode));
}

function isGridFrame(node) {
  return Boolean(node && node.type === 'FRAME' && node.layoutMode === 'GRID' && !isComponentImplementationNode(node));
}

function isComponentImplementationNode(node) {
  try {
    for (let parent = node && node.parent; parent && parent.type !== 'PAGE'; parent = parent.parent) {
      if (parent.type === 'SLOT') return false;
      if (['INSTANCE', 'COMPONENT', 'COMPONENT_SET'].includes(parent.type)) return true;
    }
    return false;
  } catch {
    return true;
  }
}

function isStackFrame(node) {
  return isAutoLayoutFrame(node) && !isComponentImplementationNode(node);
}

function figmaNumber(value, fallback = 0) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) return numeric;
  }
  return fallback;
}

function nearestStackGap(value) {
  const numericValue = figmaNumber(value, NaN);
  if (!Number.isFinite(numericValue)) return 16;
  return STACK_GAPS.reduce((nearest, gap) =>
    Math.abs(gap - numericValue) < Math.abs(nearest - numericValue) ? gap : nearest, STACK_GAPS[0]);
}

function stackGapFromFigma(value, warnings) {
  if (STACK_GAPS.includes(value)) return value;
  const nearest = nearestStackGap(value);
  warnings.push(`itemSpacing=${value} is not in the A1 Stack spacing scale — nearest A1 gap (${nearest}) was exported.`);
  return nearest;
}

function stackGapToFigma(value, warnings) {
  if (typeof value === 'string' && STACK_SEMANTIC_GAPS[value] !== undefined) return STACK_SEMANTIC_GAPS[value];
  if (STACK_GAPS.includes(value)) return value;
  warnings.push(`gap=${JSON.stringify(value)} is not in the A1 Stack spacing scale — 16 was used.`);
  return 16;
}

function staticStackValue(value, allowed, fallback, name, warnings) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const responsiveValue = value.xs;
    if (allowed.includes(responsiveValue)) {
      warnings.push(`Responsive ${name} has no Figma representation — its xs value (${responsiveValue}) was used.`);
      return responsiveValue;
    }
    warnings.push(`Responsive ${name} has no Figma representation — ${fallback} was used.`);
    return fallback;
  }
  if (value === undefined) return fallback;
  if (allowed.includes(value)) return value;
  warnings.push(`${name}=${JSON.stringify(value)} is not supported — ${fallback} was used.`);
  return fallback;
}

function stripStackPropsName(name) {
  return String(name || 'Stack')
    .replace(/\s*[-–—]\s*\{\s*direction\s*:\s*(?:row|column|row-reverse|column-reverse)\s*,\s*wrap\s*:\s*(?:true|false)\s*\}\s*$/i, '')
    .trim() || 'Stack';
}

function stackPropsName(baseName, direction, wrap) {
  const appliedDirection = direction === 'row' ? 'row' : 'column';
  return `${stripStackPropsName(baseName)} - {direction:${appliedDirection}, wrap:${wrap ? 'true' : 'false'}}`;
}

function syncStackPropsName(frame) {
  if (!frame) return;
  const direction = frame.layoutMode === 'HORIZONTAL' ? 'row' : 'column';
  const wrap = frame.layoutMode === 'HORIZONTAL' && frame.layoutWrap === 'WRAP';
  try {
    frame.name = stackPropsName(frame.name || 'Stack', direction, wrap);
  } catch {
    // Ignore stale or immutable layer names.
  }
}

function stackUsesStretch(frame) {
  const flowChildren = stackFlowChildren(frame);
  return flowChildren.length > 0 && flowChildren.every((child) => {
    try {
      return child.layoutAlign === 'STRETCH';
    } catch {
      return false;
    }
  });
}

function hasStackPadding(frame) {
  return ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'].some((key) => figmaNumber(frame[key]) !== 0);
}

function firstVisibleSolidPaint(paints) {
  return Array.isArray(paints)
    ? paints.find((paint) => paint && paint.type === 'SOLID' && paint.visible !== false && (paint.opacity === undefined || paint.opacity > 0))
    : null;
}

function isNearWhite(paint) {
  const color = paint && paint.color;
  return Boolean(color && color.r >= 0.94 && color.g >= 0.94 && color.b >= 0.94);
}

// A deliberately conservative heuristic. An authored Card may use either a
// border or the common borderless white-surface treatment (the blue Figma
// selection outline is not an authored border), so require a second content
// item for the borderless form.
function cardSuggestion(frame) {
  if (!frame || frame.type !== 'FRAME' || isComponentImplementationNode(frame)) return null;
  const children = (() => {
    try { return [...frame.children]; } catch { return []; }
  })();
  const padding = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']
    .map((key) => figmaNumber(frame[key]));
  const hasPadding = padding.some((value) => value >= 4);
  const hasSurface = isNearWhite(firstVisibleSolidPaint(frame.fills));
  const hasBorder = Boolean(firstVisibleSolidPaint(frame.strokes)) && figmaNumber(frame.strokeWeight) > 0;
  const looksLikeBorderlessCard = !hasBorder && children.length >= 2;
  if (!children.length || !hasPadding || !hasSurface || (!hasBorder && !looksLikeBorderlessCard)) return null;

  return {
    issues: [
      `This padded white frame${hasBorder ? ' with a border' : ' with grouped content'} looks like an A1 Card.`,
      'AutoFix will try to replace the frame with the A1 Card component and move its existing content into the Card Content Slot.',
    ],
    fixes: ['convert to Card'],
  };
}

function pageLayoutCandidateHeader(frame) {
  if (!frame || frame.type !== 'FRAME') return null;
  try {
    return [...frame.children].find((child) => child && child.type === 'INSTANCE' && registeredSetName(child) === 'Top Header') || null;
  } catch {
    return null;
  }
}

function pageLayoutCandidateContent(frame, header) {
  try {
    return [...frame.children].filter((child) => child && child.id !== header?.id && child.visible !== false);
  } catch {
    return [];
  }
}

function pageLayoutSuggestion(frame) {
  if (!frame || frame.type !== 'FRAME' || isComponentImplementationNode(frame)) return null;
  const header = pageLayoutCandidateHeader(frame);
  if (!header) return null;
  const contentChildren = pageLayoutCandidateContent(frame, header);
  if (contentChildren.length === 0) return null;
  return {
    issues: [
      'This frame contains a Top Header and page content, so it looks like an A1 Page Layout.',
      'AutoFix will try to replace the frame with the A1 Page Layout component, apply the Top Header configuration, and move the remaining content into the Page Content Slot.',
    ],
    fixes: ['convert to Page Layout'],
  };
}

// Like textSuggestion, this only describes the closest portable A1 contract.
// A separate explicit action applies the safe Figma repairs; padding is
// intentionally review-only because removing it changes the frame's content
// box and should be modelled by an Inset in A1 instead.
function stackSuggestion(frame) {
  const issues = [];
  const fixes = [];
  const itemSpacing = figmaNumber(frame.itemSpacing);
  const counterAxisSpacing = figmaNumber(frame.counterAxisSpacing);
  const nearestGap = nearestStackGap(itemSpacing);
  if (!STACK_GAPS.includes(itemSpacing)) {
    issues.push(`Item spacing ${frame.itemSpacing} is outside the A1 Stack scale; ${nearestGap} is the nearest supported gap.`);
    fixes.push('item spacing');
  } else if (gapNeedsVariableBinding(itemSpacing) && !propertyHasBoundVariable(frame, 'itemSpacing')) {
    issues.push(`Item spacing ${frame.itemSpacing} uses an A1 value but is not bound to a Figma gap variable.`);
    fixes.push('item spacing variable');
  }
  if (frame.layoutWrap === 'WRAP' && frame.layoutMode !== 'HORIZONTAL') {
    issues.push('Figma wrapping is only supported by A1 Stack in a horizontal direction; wrapping will be turned off.');
    fixes.push('wrap direction');
  }
  if (frame.layoutWrap === 'WRAP' && counterAxisSpacing !== nearestGap) {
    issues.push(`Wrap row spacing ${frame.counterAxisSpacing} differs from the single A1 Stack gap; ${nearestGap} will be used for both.`);
    fixes.push('wrap row spacing');
  } else if (frame.layoutWrap === 'WRAP' && gapNeedsVariableBinding(counterAxisSpacing) && !propertyHasBoundVariable(frame, 'counterAxisSpacing')) {
    issues.push(`Wrap row spacing ${frame.counterAxisSpacing} uses an A1 value but is not bound to a Figma gap variable.`);
    fixes.push('wrap row spacing variable');
  }
  const flowChildren = stackFlowChildren(frame);
  const stretchedChildren = flowChildren.filter((child) => child.layoutAlign === 'STRETCH');
  if (stretchedChildren.length > 0 && stretchedChildren.length < flowChildren.length) {
    issues.push('Mixed child stretch settings cannot be represented by one Stack align value; the parent alignment will be used for all children.');
    fixes.push('child alignment');
  }
  if (hasStackPadding(frame)) {
    issues.push('Frame padding has no Stack prop. Keep it in Figma or move it to an A1 Inset after export.');
  }
  const align = stackUsesStretch(frame) ? 'stretch' : (STACK_ALIGN_FROM_FIGMA[frame.counterAxisAlignItems] || 'start');
  return { issues, fixes, nearestGap, align };
}

async function applyStackSuggestion(frame, suggestion, warnings) {
  await bindGapProperty(frame, 'itemSpacing', suggestion.nearestGap, warnings, 'Stack item spacing');
  if (frame.layoutWrap === 'WRAP') {
    if (frame.layoutMode !== 'HORIZONTAL') frame.layoutWrap = 'NO_WRAP';
    else await bindGapProperty(frame, 'counterAxisSpacing', suggestion.nearestGap, warnings, 'Stack wrap row spacing');
  }
  const flowChildren = stackFlowChildren(frame);
  const stretchedChildren = flowChildren.filter((child) => child.layoutAlign === 'STRETCH');
  if (stretchedChildren.length > 0 && stretchedChildren.length < flowChildren.length) {
    setStackChildrenAlignment(frame, suggestion.align, warnings);
  }
  syncStackPropsName(frame);
}

function exportStack(frame, ancestors = new Set()) {
  const warnings = [];
  const props = {};
  const direction = frame.layoutMode === 'HORIZONTAL' ? 'row' : 'column';
  const gap = stackGapFromFigma(frame.itemSpacing, warnings);
  const align = stackUsesStretch(frame) ? 'stretch' : (STACK_ALIGN_FROM_FIGMA[frame.counterAxisAlignItems] || 'start');
  const justify = STACK_JUSTIFY_FROM_FIGMA[frame.primaryAxisAlignItems] || 'start';

  if (direction !== 'column') props.direction = direction;
  if (gap !== 16) props.gap = gap;
  if (align !== 'stretch') props.align = align;
  if (justify !== 'start') props.justify = justify;
  if (frame.layoutMode === 'HORIZONTAL' && frame.layoutWrap === 'WRAP') props.wrap = true;
  if (typeof frame.layoutGrow === 'number' && frame.layoutGrow > 0) props.grow = true;

  if (hasStackPadding(frame)) {
    warnings.push('Frame padding has no Stack prop and was omitted; wrap the Stack in an Inset when that spacing is intentional.');
  }
  if (frame.layoutWrap === 'WRAP' && figmaNumber(frame.counterAxisSpacing) > 0 && figmaNumber(frame.counterAxisSpacing) !== figmaNumber(frame.itemSpacing)) {
    warnings.push('Figma wrap row spacing differs from item spacing; Stack has one gap value, so item spacing was used.');
  }

  if (ancestors.has(frame.id)) {
    warnings.push('A circular Stack child reference was skipped during export.');
  }
  const childAncestors = new Set(ancestors);
  childAncestors.add(frame.id);
  const children = ancestors.has(frame.id) ? [] : exportFreeContent(frame, warnings, childAncestors);
  return {
    node: {
      id: componentId('Stack', frame),
      type: 'Stack',
      ...(Object.keys(props).length ? { props } : {}),
      ...(children.length ? { children } : {}),
    },
    warnings,
  };
}

function gridGapFromFigma(value, axis, warnings) {
  const gap = stackGapFromFigma(value, warnings);
  if (!STACK_GAPS.includes(value)) {
    warnings[warnings.length - 1] = `${axis}=${value} is not in the A1 Grid spacing scale — nearest A1 gap (${gap}) was exported.`;
  }
  return gap;
}

function gridGapPropFromFigma(value, axis, warnings) {
  const gap = gridGapFromFigma(value, axis, warnings);
  const semantic = Object.entries(STACK_SEMANTIC_GAPS)
    .find(([, semanticValue]) => semanticValue === gap);
  return { value: gap, prop: semantic ? semantic[0] : gap };
}

function gridChildWarnings(frame, warnings) {
  if (frame.gridItemsPositioning && frame.gridItemsPositioning !== 'ROW_AUTO_FLOW') {
    warnings.push('Manual Figma grid placement is not represented by A1 Grid; children were exported in their layer order.');
  }
}

function gridItemSpanPropsFromFigmaChild(child) {
  const props = {};
  const columnSpan = figmaNumber(child && child.gridColumnSpan, NaN);
  const rowSpan = figmaNumber(child && child.gridRowSpan, NaN);
  if (Number.isInteger(columnSpan) && columnSpan > 1) props.span = columnSpan;
  if (Number.isInteger(rowSpan) && rowSpan > 1) props.rowSpan = rowSpan;
  return props;
}

function gridItemHasSpanProps(props) {
  return props && Object.keys(props).length > 0;
}

function isGridItemBridgeFrame(node) {
  if (!node || typeof node !== 'object') return false;
  try {
    if (typeof node.getSharedPluginData === 'function' &&
      node.getSharedPluginData(DETACHED_COMPONENT_NAMESPACE, DETACHED_COMPONENT_KEY) === 'GridItem') {
      return true;
    }
  } catch {
    // Shared plugin data is an optimization only.
  }
  try {
    return typeof node.getPluginData === 'function' && node.getPluginData('a1-json-type') === 'GridItem';
  } catch {
    return false;
  }
}

function gridSuggestion(frame) {
  const issues = [];
  const fixes = [];
  const rawRowGap = figmaNumber(frame.gridRowGap, NaN);
  const rawColumnGap = figmaNumber(frame.gridColumnGap, NaN);
  const rowGap = nearestStackGap(rawRowGap);
  const columnGap = nearestStackGap(rawColumnGap);
  if (!STACK_GAPS.includes(rawRowGap)) {
    issues.push(`Grid row gap ${frame.gridRowGap} is outside the A1 spacing scale; ${rowGap} is the nearest supported gap.`);
    fixes.push('row gap');
  } else if (gapNeedsVariableBinding(rawRowGap) && !propertyHasBoundVariable(frame, 'gridRowGap')) {
    issues.push(`Grid row gap ${frame.gridRowGap} uses an A1 value but is not bound to a Figma gap variable.`);
    fixes.push('row gap variable');
  }
  if (!STACK_GAPS.includes(rawColumnGap)) {
    issues.push(`Grid column gap ${frame.gridColumnGap} is outside the A1 spacing scale; ${columnGap} is the nearest supported gap.`);
    fixes.push('column gap');
  } else if (gapNeedsVariableBinding(rawColumnGap) && !propertyHasBoundVariable(frame, 'gridColumnGap')) {
    issues.push(`Grid column gap ${frame.gridColumnGap} uses an A1 value but is not bound to a Figma gap variable.`);
    fixes.push('column gap variable');
  }
  return { issues, fixes, rowGap, columnGap };
}

async function applyGridSuggestion(frame, suggestion, warnings) {
  await bindGapProperty(frame, 'gridRowGap', suggestion.rowGap, warnings, 'Grid row gap');
  await bindGapProperty(frame, 'gridColumnGap', suggestion.columnGap, warnings, 'Grid column gap');
}

function normalizeResponsiveColumns(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const out = {};
  for (const key of A1_BREAKPOINTS) {
    const columns = value[key];
    if (Number.isInteger(columns) && columns > 0) out[key] = columns;
  }
  return Object.keys(out).length > 0 ? out : null;
}

function formatResponsiveGridColumns(columns) {
  const responsiveColumns = normalizeResponsiveColumns(columns);
  if (!responsiveColumns) return '';
  return `{${A1_BREAKPOINTS
    .filter((breakpoint) => Number.isInteger(responsiveColumns[breakpoint]) && responsiveColumns[breakpoint] > 0)
    .map((breakpoint) => `${breakpoint}:${responsiveColumns[breakpoint]}`)
    .join(', ')}}`;
}

function stripResponsiveGridColumnsName(name) {
  // The dash separator is optional: hand-authored names like "Grid {xs:2}"
  // must strip too, or re-syncing metadata accumulates suffix groups.
  return String(name || 'Grid')
    .replace(/\s*(?:[-–—]\s*)?\{\s*(?:(?:['"]?(?:xs|sm|md|lg|xl)['"]?)\s*:\s*\d+\s*,?\s*)+\}\s*$/i, '')
    .trim() || 'Grid';
}

function parseResponsiveGridColumnsName(name) {
  const match = String(name || '').match(/\{\s*([^{}]+)\s*\}\s*$/);
  if (!match) return null;
  const columns = {};
  for (const part of match[1].split(',')) {
    const pair = part.trim().match(/^['"]?(xs|sm|md|lg|xl)['"]?\s*:\s*(\d+)$/i);
    if (!pair) return null;
    const breakpoint = pair[1].toLowerCase();
    const value = Number(pair[2]);
    if (!Number.isInteger(value) || value < 1) return null;
    columns[breakpoint] = value;
  }
  return normalizeResponsiveColumns(columns);
}

function responsiveGridName(baseName, columns) {
  const suffix = formatResponsiveGridColumns(columns);
  return suffix ? `${stripResponsiveGridColumnsName(baseName)} - ${suffix}` : stripResponsiveGridColumnsName(baseName);
}

function syncResponsiveGridColumnsMetadata(frame, columns) {
  const responsiveColumns = normalizeResponsiveColumns(columns);
  if (!frame || !responsiveColumns) return null;
  try {
    frame.setPluginData(GRID_RESPONSIVE_COLUMNS_KEY, JSON.stringify(responsiveColumns));
  } catch {
    // Plugin data is a compatibility backup; the layer name is the visible source.
  }
  try {
    frame.name = responsiveGridName(frame.name || 'Grid', responsiveColumns);
  } catch {
    // Ignore stale or immutable layer names.
  }
  return responsiveColumns;
}

function defineResponsiveGridBreakpoints(frame, columns, sourceWidth, warnings, requestedColumns = null) {
  const count = Number(columns);
  if (!frame || !Number.isInteger(count) || count < 1) return null;
  const widthBreakpoint = breakpointForWidth(sourceWidth, count > 2 ? 'lg' : count > 1 ? 'md' : 'xs');
  const minBreakpoint = count > 2 ? 'lg' : count > 1 ? 'md' : 'xs';
  const minIndex = A1_BREAKPOINTS.indexOf(minBreakpoint);
  const widthIndex = A1_BREAKPOINTS.indexOf(widthBreakpoint);
  const currentBreakpoint = A1_BREAKPOINTS[Math.max(minIndex, widthIndex)] || minBreakpoint;
  const requested = normalizeResponsiveColumns(requestedColumns);
  const existing = requested || readResponsiveGridColumns(frame);
  const responsiveColumns = existing ? { ...existing } : {};
  if (!existing) {
    responsiveColumns.xs = 1;
    if (count > 2) responsiveColumns.md = Math.min(2, count);
  }
  responsiveColumns[currentBreakpoint] = count;
  const normalized = syncResponsiveGridColumnsMetadata(frame, responsiveColumns);
  try {
    frame.setPluginData(A1_BREAKPOINT_KEY, currentBreakpoint);
  } catch {
    // The visible name suffix still carries the responsive contract.
  }
  if (normalized && warnings) {
    warnings.push(`Grid breakpoints were defined as ${formatResponsiveGridColumns(normalized)}. Use Build to create or sync breakpoint frames.`);
  }
  return normalized;
}

function responsiveColumnsAt(value, breakpoint) {
  const columns = normalizeResponsiveColumns(value);
  if (!columns) return null;
  const targetIndex = Math.max(0, A1_BREAKPOINTS.indexOf(breakpoint));
  let inherited = null;
  for (let index = 0; index <= targetIndex; index += 1) {
    const key = A1_BREAKPOINTS[index];
    if (Number.isInteger(columns[key]) && columns[key] > 0) inherited = columns[key];
  }
  if (inherited !== null) return inherited;
  for (const key of A1_BREAKPOINTS) {
    if (Number.isInteger(columns[key]) && columns[key] > 0) return columns[key];
  }
  return null;
}

function responsiveGridItemSpanAt(value, breakpoint, fullSpan = null) {
  const normalize = (candidate) => {
    if (candidate === 'full') return Number.isInteger(fullSpan) && fullSpan > 0 ? fullSpan : null;
    return Number.isInteger(candidate) && candidate > 0 ? candidate : null;
  };
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const targetIndex = Math.max(0, A1_BREAKPOINTS.indexOf(breakpoint));
    let inherited = null;
    for (let index = 0; index <= targetIndex; index += 1) {
      const key = A1_BREAKPOINTS[index];
      const candidate = normalize(value[key]);
      if (candidate !== null) inherited = candidate;
    }
    if (inherited !== null) return inherited;
    for (const key of A1_BREAKPOINTS) {
      const candidate = normalize(value[key]);
      if (candidate !== null) return candidate;
    }
    return null;
  }
  return normalize(value);
}

function readBreakpointData(node) {
  if (!node) return '';
  try {
    if (typeof node.getPluginData === 'function') {
      const localValue = node.getPluginData(A1_BREAKPOINT_KEY);
      if (A1_BREAKPOINTS.includes(localValue)) return localValue;
      const legacyValue = node.getPluginData('a1-breakpoint');
      if (A1_BREAKPOINTS.includes(legacyValue)) return legacyValue;
    }
  } catch {
    // Ignore stale node handles.
  }
  try {
    if (typeof node.getSharedPluginData === 'function') {
      const sharedValue = node.getSharedPluginData(DETACHED_COMPONENT_NAMESPACE, A1_BREAKPOINT_KEY);
      if (A1_BREAKPOINTS.includes(sharedValue)) return sharedValue;
    }
  } catch {
    // Ignore stale node handles.
  }
  try {
    const match = typeof node.name === 'string' && node.name.match(/(?:^|[·\s/-])(xs|sm|md|lg|xl)$/i);
    if (match && A1_BREAKPOINTS.includes(match[1].toLowerCase())) return match[1].toLowerCase();
  } catch {
    // Ignore stale node handles.
  }
  return '';
}

function breakpointForNode(node, fallback = 'xs') {
  if (A1_BREAKPOINTS.includes(activeRenderBreakpoint)) return activeRenderBreakpoint;
  for (let current = node; current; current = current.parent) {
    const breakpoint = readBreakpointData(current);
    if (breakpoint) return breakpoint;
  }
  return A1_BREAKPOINTS.includes(fallback) ? fallback : 'xs';
}

function breakpointForWidth(width, fallback = 'md') {
  if (typeof width !== 'number' || !Number.isFinite(width) || width <= 0) return fallback;
  return A1_BREAKPOINTS.reduce((nearest, breakpoint) => {
    const nearestWidth = A1_BREAKPOINT_WIDTHS[nearest] || width;
    const candidateWidth = A1_BREAKPOINT_WIDTHS[breakpoint] || width;
    return Math.abs(candidateWidth - width) < Math.abs(nearestWidth - width) ? breakpoint : nearest;
  }, fallback);
}

function collectAuthoredBreakpoints(value, found = new Set()) {
  if (Array.isArray(value)) {
    for (const item of value) collectAuthoredBreakpoints(item, found);
    return found;
  }
  if (!value || typeof value !== 'object') return found;
  const keys = Object.keys(value);
  const responsiveKeys = keys.filter((key) => A1_BREAKPOINTS.includes(key));
  if (responsiveKeys.length > 0 && responsiveKeys.length === keys.length) {
    for (const key of responsiveKeys) found.add(key);
  }
  for (const item of Object.values(value)) collectAuthoredBreakpoints(item, found);
  return found;
}

function readResponsiveGridColumns(frame) {
  const nameColumns = parseResponsiveGridColumnsName(frame && frame.name);
  if (nameColumns) return nameColumns;
  try {
    const raw = frame.getPluginData(GRID_RESPONSIVE_COLUMNS_KEY);
    return raw ? normalizeResponsiveColumns(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

function gridExportId(frame) {
  try {
    const jsonId = frame.getPluginData('a1-json-id');
    if (jsonId) return jsonId;
  } catch {
    // Ignore stale grid handles.
  }
  const baseName = stripResponsiveGridColumnsName(frame && frame.name);
  if (baseName && baseName !== 'Grid') return baseName;
  return componentId('Grid', frame);
}

function exportGrid(frame, ancestors = new Set()) {
  const warnings = [];
  const props = {};
  const columns = figmaNumber(frame.gridColumnCount, NaN);
  const rowGap = gridGapPropFromFigma(figmaNumber(frame.gridRowGap, NaN), 'gridRowGap', warnings);
  const columnGap = gridGapPropFromFigma(figmaNumber(frame.gridColumnGap, NaN), 'gridColumnGap', warnings);
  const align = STACK_ALIGN_FROM_FIGMA[frame.counterAxisAlignItems] || 'stretch';

  const responsiveColumns = readResponsiveGridColumns(frame);
  if (responsiveColumns) {
    const breakpoint = breakpointForNode(frame);
    props.columns = { ...responsiveColumns };
    syncResponsiveGridColumnsMetadata(frame, props.columns);
    if (Number.isInteger(columns) && columns > 0 && columns !== responsiveColumnsAt(responsiveColumns, breakpoint)) {
      props.columns[breakpoint] = columns;
      syncResponsiveGridColumnsMetadata(frame, props.columns);
      warnings.push(`Grid columns were exported as a responsive object; the ${breakpoint} preview was updated to ${columns}.`);
    }
  } else if (Number.isInteger(columns) && columns > 0) props.columns = columns;
  else warnings.push('Figma Grid has no valid column count; A1 Grid will use its default columns.');
  if (rowGap.value === columnGap.value) {
    props.gap = rowGap.prop;
  } else {
    props.rowGap = rowGap.prop;
    props.columnGap = columnGap.prop;
  }
  if (align !== 'stretch') props.alignItems = align;
  if (hasStackPadding(frame)) {
    warnings.push('Frame padding has no Grid prop and was omitted; wrap the Grid in an A1 Inset when that spacing is intentional.');
  }
  gridChildWarnings(frame, warnings);

  if (ancestors.has(frame.id)) warnings.push('A circular Grid child reference was skipped during export.');
  const childAncestors = new Set(ancestors);
  childAncestors.add(frame.id);
  const children = ancestors.has(frame.id) ? [] : exportGridChildren(frame, warnings, childAncestors);
  return {
    node: {
      id: gridExportId(frame),
      type: 'Grid',
      ...(Object.keys(props).length ? { props } : {}),
      ...(children.length ? { children } : {}),
    },
    warnings,
  };
}

function exportNodeAsFreeContent(node, warnings, ancestors = new Set()) {
  const exported = [];
  const walk = (current, branchAncestors) => {
    try {
      if (!current) return;
      if (current.id && branchAncestors.has(current.id)) {
        warnings.push(`A circular child reference at "${current.name}" was skipped during export.`);
        return;
      }
      const componentName = registeredSetName(current);
      if (componentName) {
        const result = EXPORTERS[componentName](current);
        exported.push(result.node);
        warnings.push(...result.warnings);
        return;
      }
      if (current.type === 'INSTANCE' && materialIconNameFromInstance(current)) {
        const result = exportIcon(current);
        exported.push(result.node);
        warnings.push(...result.warnings);
        return;
      }
      if (isGridItemBridgeFrame(current) && 'children' in current) {
        const nextAncestors = new Set(branchAncestors);
        if (current.id) nextAncestors.add(current.id);
        for (const child of current.children) walk(child, nextAncestors);
        return;
      }
      if (isStackFrame(current)) {
        const result = exportStack(current, branchAncestors);
        exported.push(result.node);
        warnings.push(...result.warnings);
        return;
      }
      if (isGridFrame(current)) {
        const result = exportGrid(current, branchAncestors);
        exported.push(result.node);
        warnings.push(...result.warnings);
        return;
      }
      if (current.type === 'TEXT') {
        const result = exportTextNode(current);
        exported.push(result.node);
        warnings.push(...result.warnings);
        return;
      }
      if ('children' in current) {
        const nextAncestors = new Set(branchAncestors);
        if (current.id) nextAncestors.add(current.id);
        for (const child of current.children) walk(child, nextAncestors);
      }
    } catch (error) {
      warnings.push(`A child Figma no longer exposes was skipped during export: ${error.message}`);
    }
  };
  walk(node, new Set(ancestors));
  return exported;
}

function exportGridChildren(frame, warnings, ancestors = new Set()) {
  const exported = [];
  const parentAncestors = new Set(ancestors);
  if (frame.id) parentAncestors.add(frame.id);
  for (const child of frame.children || []) {
    const childNodes = exportNodeAsFreeContent(child, warnings, parentAncestors);
    const spanProps = gridItemSpanPropsFromFigmaChild(child);
    if (gridItemHasSpanProps(spanProps) && childNodes.length > 0) {
      exported.push({
        id: componentId('GridItem', child),
        type: 'GridItem',
        props: spanProps,
        children: childNodes,
      });
    } else {
      exported.push(...childNodes);
    }
  }
  return exported;
}

function exportFreeContent(root, warnings, ancestors = new Set()) {
  const exported = [];
  const tabAttachments = [];
  const walk = (node, branchAncestors) => {
    try {
      if (!node) return;
      if (node.id && branchAncestors.has(node.id)) {
        warnings.push(`A circular child reference at "${node.name}" was skipped during export.`);
        return;
      }
      const tabName = tabAttachmentName(node);
      if (tabName) {
        const attachmentWarnings = [];
        tabAttachments.push({
          label: tabName,
          key: tabAttachmentKey(tabName),
          nodeName: node.name || tabName,
          children: exportNodeAsFreeContent(node, attachmentWarnings, branchAncestors),
        });
        warnings.push(...attachmentWarnings);
        return;
      }
      const componentName = registeredSetName(node);
      // A supported instance—or a deliberately detached Banner with editable
      // JSON slot content—owns its implementation layers. Export it as one
      // node before treating generic auto-layout frames as Stacks.
      if (componentName) {
        const result = EXPORTERS[componentName](node);
        exported.push(result.node);
        warnings.push(...result.warnings);
        return;
      }
      if (node.type === 'INSTANCE' && materialIconNameFromInstance(node)) {
        const result = exportIcon(node);
        exported.push(result.node);
        warnings.push(...result.warnings);
        return;
      }
      if (isStackFrame(node)) {
        const result = exportStack(node, branchAncestors);
        exported.push(result.node);
        warnings.push(...result.warnings);
        return;
      }
      if (isGridFrame(node)) {
        const result = exportGrid(node, branchAncestors);
        exported.push(result.node);
        warnings.push(...result.warnings);
        return;
      }
      if (node.type === 'TEXT') {
        const result = exportTextNode(node);
        exported.push(result.node);
        warnings.push(...result.warnings);
        return;
      }
      if ('children' in node) {
        const nextAncestors = new Set(branchAncestors);
        if (node.id) nextAncestors.add(node.id);
        for (const child of node.children) walk(child, nextAncestors);
      }
    } catch (error) {
      warnings.push(`A child Figma no longer exposes was skipped during export: ${error.message}`);
    }
  };
  const rootAncestors = new Set(ancestors);
  if (root.id) rootAncestors.add(root.id);
  for (const child of root.children || []) walk(child, rootAncestors);
  const unusedAttachments = attachMarkedTabContent(exported, tabAttachments, warnings);
  for (const attachment of unusedAttachments) exported.push(...attachment.children);
  return exported;
}

function exportContainerNode(root) {
  const warnings = [];
  const children = exportFreeContent(root, warnings);
  if (children.length === 0) warnings.push('This container has no supported A1 instances or standalone text layers to export.');
  return {
    // A screen selection is an interchange bundle, not an invented layout
    // component. In particular, plain Heading and Paragraph nodes must land on
    // the A1 canvas without a synthetic Section (and its surface/padding).
    node: { nodes: children },
    warnings,
  };
}

function canExportContainer(node, ancestors = new Set()) {
  try {
    if (!node) return false;
    if (isStackFrame(node) || isGridFrame(node)) return true;
    if (!('children' in node)) return false;
    if (node.id && ancestors.has(node.id)) return false;
    const nextAncestors = new Set(ancestors);
    if (node.id) nextAncestors.add(node.id);
    return (node.children || []).some((child) => {
      try {
        return child.type === 'TEXT'
          || isStackFrame(child)
          || isGridFrame(child)
          || (child.type === 'INSTANCE' && Boolean(registeredSetName(child)))
          || (child.type === 'INSTANCE' && Boolean(materialIconNameFromInstance(child)))
          || canExportContainer(child, nextAncestors);
      } catch {
        // Ignore a transient sublayer that Figma removed during this change.
        return false;
      }
    });
  } catch {
    return false;
  }
}

function sectionPropertyCarriers(root) {
  const carriers = [root];
  let descendants = [];
  try {
    descendants = root.findAll((node) => node.type === 'INSTANCE');
  } catch {
    return carriers;
  }
  for (const instanceNode of descendants) {
    if (registeredSetName(instanceNode)) continue;
    try {
      // Force Figma to resolve the handle now. Replaced internal sublayers can
      // remain in findAll results for one document-change turn.
      void instanceNode.componentProperties;
      carriers.push(instanceNode);
    } catch {
      // The current Section root is enough; omit a stale internal carrier.
    }
  }
  return carriers;
}

// Find a component property by canonical name across the carriers. Returns
// { node, key, property } with the original key, usable with setProperties.
function findSectionProperty(carriers, names, type) {
  for (const node of carriers) {
    let raw;
    try {
      raw = node.componentProperties || {};
    } catch {
      continue;
    }
    for (const key of Object.keys(raw)) {
      if (!names.includes(canonicalKey(key))) continue;
      if (type && raw[key].type !== type) continue;
      return { node, key, property: raw[key] };
    }
  }
  return null;
}

// Set a variant property wherever it lives (outer set or an internal part —
// nested instance properties are settable as overrides).
function assignSectionVariant(carriers, names, value) {
  const found = findSectionProperty(carriers, names, 'VARIANT');
  if (!found) return false;
  try {
    found.node.setProperties({ [found.key]: value });
    return true;
  } catch (error) {
    return false;
  }
}

// ─── Export: Figma instance → page-definition node ──────────────────────────

function exportButton(instance) {
  const properties = readProperties(instance);
  const warnings = [];
  const props = {};

  const variant = properties.Variant && properties.Variant.value;
  const size = properties.Size && properties.Size.value;
  const state = properties.State && properties.State.value;
  const iconPosition = properties.IconPosition && properties.IconPosition.value;
  const showIcon = properties['Show icon'] &&
    (properties['Show icon'].value === true || properties['Show icon'].value === 'true');

  // Defaults (variant=primary, size=md, iconPosition=start) are omitted, the
  // same convention the a1-web configurator snippets use.
  if (BUTTON_VARIANTS.includes(variant) && variant !== 'primary') props.variant = variant;
  if (BUTTON_SIZES.includes(size) && size !== 'md') props.size = size;
  if (state === 'disabled') props.disabled = true;
  if (state === 'loading') props.loading = true;
  if (VISUAL_ONLY_STATES.includes(state)) {
    warnings.push(`State=${state} is a visual-only Figma state — no prop was emitted.`);
  }
  if (showIcon) {
    const iconName = iconNameFromSwapValue(properties.Icon && properties.Icon.value);
    if (iconName) {
      props.icon = iconName;
      if (iconPosition === 'end') props.iconPosition = 'end';
      warnings.push(`Icon name "${iconName}" was read from the swapped component's name — confirm it is a Material Symbols name.`);
    } else {
      warnings.push('The icon instance could not be resolved to a component name — icon omitted.');
    }
  }

  const label = properties.Label && typeof properties.Label.value === 'string'
    ? properties.Label.value
    : 'Button';

  const node = {
    id: 'button-' + instance.id.replace(/[^a-zA-Z0-9]+/g, '-'),
    type: 'Button',
    content: { fallback: label },
  };
  if (Object.keys(props).length > 0) node.props = props;
  return { node, warnings };
}

function exportIconButton(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  const variant = componentPropertyValue(instance, 'Variant', 'VARIANT');
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  const iconName = iconNameFromInstance(instance, 'Icon') ||
    iconNameFromSwapValue(componentPropertyValue(instance, 'Icon', 'INSTANCE_SWAP'));

  if (ICON_BUTTON_VARIANTS.includes(variant) && variant !== 'tertiary') props.variant = variant;
  if (ICON_BUTTON_SIZES.includes(size) && size !== 'md') props.size = size;
  if (iconName) props.icon = iconName;
  else {
    // The library asset's visible default is Material Symbols "star". Retain
    // that known visual fallback so the required React icon prop is never
    // omitted from an otherwise valid exported IconButton node.
    props.icon = 'star';
    warnings.push('Icon Button icon could not be resolved; exported the visible default Material icon "star".');
  }

  const label = componentText(instance, 'Aria label', 'Icon button');
  return {
    node: {
      id: componentId('IconButton', instance),
      type: 'IconButton',
      props: { ...props, label },
    },
    warnings,
  };
}

function exportLink(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  const weight = componentPropertyValue(instance, 'Weight', 'VARIANT');
  const iconPosition = componentPropertyValue(instance, 'Icon position', 'VARIANT');
  const showIcon = componentPropertyValue(instance, 'Show icon', 'BOOLEAN');

  if (LINK_SIZES.includes(size)) props.size = size;
  if (LINK_WEIGHTS.includes(weight)) props.weight = weight;
  if (showIcon === true) {
    const iconName = iconNameFromInstance(instance, 'Icon') || iconNameFromSwapValue(componentPropertyValue(instance, 'Icon', 'INSTANCE_SWAP'));
    if (iconName) {
      props.icon = iconName;
      if (iconPosition === 'end') props.iconPosition = 'end';
    } else {
      warnings.push('Link icon is visible but its Material icon component could not be resolved.');
    }
  }

  const label = componentText(instance, 'Label', 'Link');
  return {
    node: {
      id: componentId('Link', instance),
      type: 'Link',
      ...(Object.keys(props).length ? { props } : {}),
      content: { fallback: label },
    },
    warnings,
  };
}

function namedSlot(instance, name) {
  const wanted = canonicalKey(name);
  // The current Card library can expose its native Content Slot either as a
  // SLOT node or as the equivalent named auto-layout Frame in an instance.
  // Treat both as the same editable boundary; only Card uses the `Content`
  // alias, so other component slots remain exact-name lookups.
  const names = wanted === 'contentslot'
    ? new Set(['contentslot', 'content', 'cardcontent', 'cardcontentslot'])
    : new Set([wanted]);
  // Figma can replace an instance sublayer while an export is walking a
  // containing Section or Stack. `findOne` then throws while reading the
  // obsolete child's name instead of returning no result. A missing slot is a
  // recoverable representation limitation, so refresh the outer instance and
  // treat an unavailable internal layer as absent rather than aborting the
  // whole JSON export.
  try {
    const liveInstance = instance && instance.type === 'INSTANCE'
      ? currentInstance(instance)
      : instance;
    return liveInstance && liveInstance.findOne((node) => {
      try {
        if (!names.has(canonicalKey(node.name))) return false;
        return node.type === 'SLOT' || node.type === 'FRAME' || node.type === 'GROUP';
      } catch {
        return false;
      }
    }) || null;
  } catch {
    return null;
  }
}

function nativeSlot(instance, name) {
  const wanted = canonicalKey(name);
  const liveInstance = instance && instance.type === 'INSTANCE'
    ? currentInstance(instance)
    : instance;
  if (!liveInstance) return null;
  try {
    const slots = liveInstance.findAll((node) => {
      try {
        if (node.type !== 'SLOT' && node.type !== 'FRAME' && node.type !== 'GROUP') return false;
        if (canonicalKey(node.name) === wanted) return true;
        const refs = node.componentPropertyReferences || {};
        return Object.values(refs).some((value) => canonicalKey(String(value || '')).startsWith(wanted));
      } catch {
        return false;
      }
    });
    return slots.find((slot) => canonicalKey(slot.name) === wanted) || slots[0] || null;
  } catch {
    return namedSlot(liveInstance, name);
  }
}

function componentText(instance, name, fallback = '') {
  const value = componentPropertyValue(instance, name, 'TEXT');
  return typeof value === 'string' ? value : fallback;
}

function componentBoolean(instance, name, fallback = false) {
  const value = componentPropertyValue(instance, name, 'BOOLEAN');
  return typeof value === 'boolean' ? value : fallback;
}

function exportCard(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  const surface = componentPropertyValue(instance, 'Surface', 'VARIANT');
  if (CARD_SURFACES.includes(surface) && surface !== 'default') props.surface = surface;
  const showIcon = componentPropertyValue(instance, 'Show icon', 'BOOLEAN');
  if (showIcon === true) {
    const iconName = iconNameFromSwapValue(componentPropertyValue(instance, 'Icon', 'INSTANCE_SWAP'));
    if (iconName) props.icon = iconName;
    else warnings.push('Card icon is visible but its swapped icon component could not be resolved.');
  }
  const slot = namedSlot(instance, 'Content Slot');
  const children = slot ? exportFreeContent(slot, warnings) : [];
  if (!slot) warnings.push('Card Content Slot was not found — children were not exported.');
  const node = { id: componentId('Card', instance), type: 'Card' };
  if (Object.keys(props).length > 0) node.props = props;
  if (children.length > 0) node.children = children;
  return { node, warnings };
}

function detachedBannerProps(node) {
  try {
    const raw = node.getSharedPluginData(DETACHED_COMPONENT_NAMESPACE, DETACHED_BANNER_PROPS_KEY);
    const value = raw ? JSON.parse(raw) : null;
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}

function namedTextLayerValue(root, name, fallback = '') {
  try {
    const text = root.findOne((node) => node.type === 'TEXT' && node.name === name);
    return text && typeof text.characters === 'string' ? text.characters : fallback;
  } catch {
    return fallback;
  }
}

function namedTextLayerValueAny(root, names, fallback = '') {
  const wanted = new Set((names || []).map((name) => canonicalKey(name)));
  try {
    const text = root.findOne((node) =>
      node.type === 'TEXT'
      && node.visible !== false
      && wanted.has(canonicalKey(node.name || '')));
    return text && typeof text.characters === 'string' ? text.characters : fallback;
  } catch {
    return fallback;
  }
}

function exportBanner(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  const detached = instance.type !== 'INSTANCE';
  const savedProps = detached ? detachedBannerProps(instance) : {};
  const variant = detached ? (savedProps.variant || 'inline') : componentPropertyValue(instance, 'Variant', 'VARIANT');
  const status = detached ? (savedProps.status || 'neutral') : componentPropertyValue(instance, 'Status', 'VARIANT');
  if (BANNER_VARIANTS.includes(variant) && variant !== 'inline') props.variant = variant;
  if (BANNER_STATUSES.includes(status) && status !== 'neutral') props.status = status;

  const title = (detached ? namedTextLayerValue(instance, 'Title', savedProps.title || '') : componentText(instance, 'Title', '')).trim();
  if (title) props.title = title;

  if (variant === 'calendar') {
    const eyebrow = (detached ? namedTextLayerValue(instance, 'Eyebrow', savedProps.eyebrow || '') : componentText(instance, 'Eyebrow', '')).trim();
    const savedDate = savedProps.date && typeof savedProps.date === 'object' ? savedProps.date : {};
    const month = (detached ? namedTextLayerValue(instance, 'Month', savedDate.month || '') : componentText(instance, 'Month', '')).trim();
    const day = (detached ? namedTextLayerValue(instance, 'Day', savedDate.day || '') : componentText(instance, 'Day', '')).trim();
    if (eyebrow) props.eyebrow = eyebrow;
    if (month || day) props.date = { ...(month ? { month } : {}), ...(day ? { day } : {}) };
  }

  const slot = namedSlot(instance, 'Content Slot');
  const children = slot ? exportFreeContent(slot, warnings) : [];
  if (!slot) warnings.push('Banner Content Slot was not found — children were not exported.');
  const node = { id: componentId('Banner', instance), type: 'Banner' };
  if (Object.keys(props).length > 0) node.props = props;
  if (children.length > 0) node.children = children;
  return { node, warnings };
}

function exportBadge(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  const status = componentPropertyValue(instance, 'Status', 'VARIANT');
  const subtle = componentPropertyValue(instance, 'Subtle', 'VARIANT');
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  if (BADGE_STATUSES.includes(status) && status !== 'neutral') props.status = status;
  if (subtle === 'true' || subtle === true) props.subtle = true;
  // Keep size explicit for Badge. Unlike most default props it materially
  // affects the visual density of a compact status chip, and omitting `md`
  // makes a Figma → JSON → Figma exchange lose that authored choice.
  if (BADGE_SIZES.includes(size)) props.size = size;
  if (!componentBoolean(instance, 'Show icon', true)) {
    props.icon = null;
  } else {
    const defaultIcon = BADGE_DEFAULT_ICONS[BADGE_STATUSES.includes(status) ? status : 'neutral'];
    const iconName = iconNameFromInstance(instance) || iconNameFromSwapValue(componentPropertyValue(instance, 'Icon', 'INSTANCE_SWAP'));
    if (iconName && iconName !== defaultIcon) props.icon = iconName;
    else if (!iconName) warnings.push('Badge icon is visible but its Material icon component could not be resolved.');
  }
  const node = {
    id: componentId('MessageBadge', instance),
    type: 'MessageBadge',
    content: { fallback: componentText(instance, 'Label', 'Badge') },
  };
  if (Object.keys(props).length > 0) node.props = props;
  return { node, warnings };
}

function exportFigure(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = { src: componentText(instance, 'Source', '') };
  const alt = componentText(instance, 'Alt', '');
  const caption = componentText(instance, 'Caption', '');
  const showCaption = componentBoolean(instance, 'Show caption', true);
  if (alt) props.alt = alt;
  if (caption && showCaption) props.caption = caption;
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  const aspectRatio = componentPropertyValue(instance, 'Aspect ratio', 'VARIANT');
  // Preserve the explicitly selected compact Figure size as JSON. Omitting
  // `sm` makes the playground treat it as an unconstrained Figure instead of
  // retaining the Figma component's selected max-width.
  if (FIGURE_SIZES.includes(size)) props.size = size;
  if (FIGURE_ASPECT_RATIOS.includes(aspectRatio) && aspectRatio !== '16:9') props.aspectRatio = aspectRatio;
  return { node: { id: componentId('Figure', instance), type: 'Figure', props }, warnings };
}

function definitionItemText(value, fallback = '') {
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (value && typeof value === 'object' && typeof value.fallback === 'string') return value.fallback;
  return fallback;
}

function definitionItemFromFigma(item, index, warnings) {
  try {
    if (item.type === 'INSTANCE' && componentSetName(item) === 'Definition List Item') {
      const liveItem = currentInstance(item);
      const label = componentText(liveItem, 'Label', '');
      const value = componentText(liveItem, 'Value', '');
      if (label || value) {
        return {
          id: `definition-item-${liveItem.id.replace(/[^a-zA-Z0-9]+/g, '-')}`,
          label,
          value,
        };
      }
    }
    // Keep legacy frame rows readable after the new item component ships.
    const label = item.findOne((node) => node.type === 'TEXT' && canonicalKey(node.name) === 'label');
    const value = item.findOne((node) => node.type === 'TEXT' && canonicalKey(node.name) === 'value');
    if (label && value) {
      return {
        id: `definition-item-${item.id.replace(/[^a-zA-Z0-9]+/g, '-')}`,
        label: label.characters,
        value: value.characters,
      };
    }
  } catch {
    // A Figma instance replacement can briefly invalidate a slot child. The
    // outer export continues and reports the omitted row below.
  }
  warnings.push(`Definition item ${index + 1} is missing a Label or Value and was skipped.`);
  return null;
}

function exportDefinitionList(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  const direction = componentPropertyValue(instance, 'Direction', 'VARIANT');
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  if (DEFINITION_LIST_DIRECTIONS.includes(direction) && direction !== 'row') props.direction = direction;
  // Keep the explicit Figma choice, including the React default, so a designer's
  // selected size round-trips predictably through the bridge.
  if (DEFINITION_LIST_SIZES.includes(size)) props.size = size;
  const slot = namedSlot(instance, 'Items Slot');
  const items = slot
    ? slot.children.filter((child) => {
      try {
        return child.visible !== false && (
          (child.type === 'INSTANCE' && componentSetName(child) === 'Definition List Item') ||
          (child.type === 'FRAME' && canonicalKey(child.name) === 'definitionitem')
        );
      } catch {
        return false;
      }
    }).map((child, index) => definitionItemFromFigma(child, index, warnings)).filter(Boolean)
    : [];
  if (!slot) warnings.push('Definition List Items Slot was not found — items were not exported.');
  props.items = items;
  return { node: { id: componentId('DefinitionList', instance), type: 'DefinitionList', props }, warnings };
}

function exportDefinitionListItem(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  const direction = componentPropertyValue(instance, 'Direction', 'VARIANT');
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  if (DEFINITION_LIST_DIRECTIONS.includes(direction) && direction !== 'row') props.direction = direction;
  if (DEFINITION_LIST_SIZES.includes(size)) props.size = size;
  const item = definitionItemFromFigma(instance, 0, warnings);
  props.items = item ? [item] : [];
  return { node: { id: componentId('DefinitionList', instance), type: 'DefinitionList', props }, warnings };
}

function exportBlockquote(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  const variant = componentPropertyValue(instance, 'Variant', 'VARIANT');
  const cite = componentText(instance, 'Citation', '');
  const citeUrl = componentText(instance, 'Citation URL', '');
  const showCitation = componentBoolean(instance, 'Show citation', true);
  if (BLOCKQUOTE_VARIANTS.includes(variant) && variant !== 'border') props.variant = variant;
  if (cite && showCitation) props.cite = cite;
  if (citeUrl && showCitation) props.citeUrl = citeUrl;
  const node = {
    id: componentId('Blockquote', instance),
    type: 'Blockquote',
    content: { fallback: componentText(instance, 'Quote', 'Add a quote') },
  };
  if (Object.keys(props).length > 0) node.props = props;
  return { node, warnings };
}

function codeTextValue(instance) {
  const direct = componentText(instance, 'Code',
    componentText(instance, 'Content',
      componentText(instance, 'Value',
        componentText(instance, 'Text', ''))));
  if (direct) return direct;
  try {
    const texts = currentInstance(instance).findAll((node) => node.type === 'TEXT' && node.visible !== false);
    const candidates = texts
      .map((text) => (typeof text.characters === 'string' ? text.characters : ''))
      .map((value) => value.trim())
      .filter(Boolean)
      .filter((value) => !/^(copy|show more|show less)$/i.test(value));
    return candidates.sort((a, b) => b.length - a.length)[0] || '';
  } catch {
    return '';
  }
}

function exportCode(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  const variant = componentPropertyValue(instance, 'Variant', 'VARIANT');
  if (variant === 'inline' || variant === 'block') props.variant = variant;
  const wrapping = componentBoolean(instance, 'Wrapping', undefined);
  if (typeof wrapping === 'boolean') props.wrapping = wrapping;
  const editable = componentBoolean(instance, 'Editable', undefined);
  if (typeof editable === 'boolean') props.editable = editable;
  const copyCode = componentBoolean(instance, 'Copy code', componentBoolean(instance, 'Copy Code', undefined));
  if (typeof copyCode === 'boolean') props.copyCode = copyCode;
  const copyText = componentText(instance, 'Copy text', componentText(instance, 'Copy Text', '')).trim();
  if (copyText) props.copyText = copyText;
  const collapsedLines = componentPropertyValue(instance, 'Collapsed lines', 'TEXT') || componentPropertyValue(instance, 'Collapsed Lines', 'TEXT');
  const numericCollapsedLines = Number(collapsedLines);
  if (Number.isFinite(numericCollapsedLines) && numericCollapsedLines > 0) props.collapsedLines = numericCollapsedLines;
  return {
    node: {
      id: componentId('Code', instance),
      type: 'Code',
      props,
      content: { fallback: codeTextValue(instance) || 'Code sample' },
    },
    warnings,
  };
}

function inlineTextValue(instance) {
  const direct = componentText(instance, 'Markdown',
    componentText(instance, 'Content',
      componentText(instance, 'Value',
        componentText(instance, 'Text', ''))));
  if (direct) return direct;
  try {
    const texts = currentInstance(instance).findAll((node) => node.type === 'TEXT' && node.visible !== false);
    const candidates = texts
      .map((text) => (typeof text.characters === 'string' ? text.characters : ''))
      .map((value) => value.trim())
      .filter(Boolean);
    return candidates.sort((a, b) => b.length - a.length)[0] || '';
  } catch {
    return '';
  }
}

function inlineElementValue(value) {
  const normalized = String(value || '').trim();
  if (!normalized) return '';
  const compact = normalized.toLowerCase().replace(/\s+/g, '-');
  return INLINE_ELEMENTS.includes(compact) ? compact : '';
}

function exportInline(instance) {
  instance = currentInstance(instance);
  const props = {};
  const element = inlineElementValue(
    componentPropertyValue(instance, 'Inline element', 'VARIANT')
      || componentPropertyValue(instance, 'Element', 'VARIANT')
      || componentPropertyValue(instance, 'Type', 'VARIANT')
      || componentText(instance, 'Inline element', '')
  );
  if (element && element !== 'all') props.inlineElement = element;
  return {
    node: {
      id: componentId('Inline', instance),
      type: 'Inline',
      props,
      content: { fallback: inlineTextValue(instance) || 'Inline text' },
    },
    warnings: [],
  };
}

// Export every registered descendant instance (e.g. Buttons inside a Section)
// as child nodes, skipping instances nested inside an already-exported one.
function exportRegisteredDescendants(root, warnings) {
  const exported = [];
  const covered = new Set();
  for (const instanceNode of root.findAll((n) => n.type === 'INSTANCE')) {
    const name = registeredSetName(instanceNode);
    if (!name) continue;
    let insideExported = false;
    for (let parent = instanceNode.parent; parent; parent = parent.parent) {
      if (covered.has(parent.id)) { insideExported = true; break; }
    }
    if (insideExported) continue;
    const result = EXPORTERS[name](instanceNode);
    exported.push(result.node);
    for (const warning of result.warnings) warnings.push(warning);
    covered.add(instanceNode.id);
  }
  return exported;
}

// Section is the one registered component whose meaningful page content lives
// in a nested Section Content instance. Its real editable carrier is the
// `Section Content Slot` SLOT node — not the legacy `_content` frame assumed
// by the first bridge implementation. Export that slot with the same ordered
// traversal used for a selected frame: direct A1-styled text becomes
// Heading/Paragraph and registered instances (such as Buttons) keep their
// complete JSON props.
function sectionContentContainer(instance) {
  const isContentSlot = (node) => node.type === 'SLOT' && canonicalKey(node.name) === 'sectioncontentslot';
  const sectionContent = instance.findOne((node) =>
    node.type === 'INSTANCE' && componentSetName(node) === 'Section Content');
  if (sectionContent) {
    const slot = sectionContent.findOne(isContentSlot);
    if (slot) return slot;
  }
  // Keep compatibility with pre-slot library copies and detached legacy
  // instances, then accept a slot found directly under the selected root.
  return instance.findOne(isContentSlot)
    || instance.findOne((node) => node.type === 'FRAME' && node.name === '_content')
    || null;
}

function sectionGapCarrier(instance) {
  const content = sectionContentContainer(instance);
  if (content && ['HORIZONTAL', 'VERTICAL'].includes(content.layoutMode)) return content;
  const sectionContent = instance.findOne((node) =>
    node.type === 'INSTANCE' && componentSetName(node) === 'Section Content');
  if (sectionContent && ['HORIZONTAL', 'VERTICAL'].includes(sectionContent.layoutMode)) return sectionContent;
  return sectionContent && sectionContent.findOne((node) =>
    ['FRAME', 'SLOT'].includes(node.type) && ['HORIZONTAL', 'VERTICAL'].includes(node.layoutMode)) || null;
}

function nearestSectionGap(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 'md';
  return SECTION_GAPS.reduce((nearest, gap) =>
    Math.abs(SECTION_GAP_PIXELS[gap] - value) < Math.abs(SECTION_GAP_PIXELS[nearest] - value) ? gap : nearest, 'xs');
}

function sectionDeclaredGap(instance) {
  const carriers = sectionPropertyCarriers(instance);
  const variant = findSectionProperty(carriers, ['gap'], 'VARIANT');
  const mode = explicitCollectionMode(instance, 'Gap');
  if (variant && SECTION_GAPS.includes(variant.property.value)) return variant.property.value;
  return SECTION_GAPS.includes(mode) ? mode : null;
}

// Sections use semantic gap props. Their editable Figma content carrier may
// nevertheless have an arbitrary numeric itemSpacing, so normalize that value
// to the semantic gap that Section will actually serialize.
function sectionSuggestion(instance) {
  const carrier = sectionGapCarrier(instance);
  if (!carrier) return { issues: [], fixes: [], carrier: null, gap: null };
  const declaredGap = sectionDeclaredGap(instance);
  const nearestGap = nearestSectionGap(carrier.itemSpacing);
  const gap = declaredGap || nearestGap;
  const targetSpacing = SECTION_GAP_PIXELS[gap];
  const issues = [];
  const fixes = [];
  if (carrier.itemSpacing !== targetSpacing) {
    const source = declaredGap
      ? `Section gap="${declaredGap}"`
      : `Content spacing ${carrier.itemSpacing}`;
    issues.push(`${source} does not match the A1 Section gap scale; ${gap} (${targetSpacing}px) is the closest compatible value.`);
    fixes.push('content gap');
  }
  return { issues, fixes, carrier, gap };
}

function applySectionSuggestion(instance, suggestion, warnings) {
  if (!suggestion.carrier || !suggestion.gap) return;
  try {
    suggestion.carrier.itemSpacing = SECTION_GAP_PIXELS[suggestion.gap];
  } catch (error) {
    warnings.push(`Section content spacing could not be updated directly: ${error.message}`);
  }
  const carriers = sectionPropertyCarriers(instance);
  const applied = assignSectionVariant(carriers, ['gap'], suggestion.gap)
    || applyCollectionMode(instance, 'Gap', suggestion.gap);
  if (!applied) {
    warnings.push(`No Section Gap property or Gap mode was found; normalized the editable content spacing to ${suggestion.gap} only.`);
  }
}

function exportSectionChildren(instance, warnings) {
  const content = sectionContentContainer(instance);
  if (content) return exportFreeContent(content, warnings);

  // Older Section library instances may not yet expose the named content
  // frame. Retain the previous best-effort Button/component export instead of
  // silently producing an empty Section.
  warnings.push('Section Content Slot was not found — exported supported component descendants only.');
  return exportRegisteredDescendants(instance, warnings);
}

function exportSection(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  const carriers = sectionPropertyCarriers(instance);

  const surface = findSectionProperty(carriers, ['surface'], 'VARIANT');
  if (surface && SECTION_SURFACES.includes(surface.property.value)) {
    props.surface = surface.property.value;
  } else if (!surface) {
    warnings.push('No Surface property found on the Section or its parts — surface omitted.');
  }

  const padding = findSectionProperty(carriers, ['padding'], 'VARIANT');
  if (padding && SECTION_PADDINGS.includes(padding.property.value)) {
    // md is the React default and is omitted from the JSON.
    if (padding.property.value !== 'md') props.padding = padding.property.value;
  } else {
    warnings.push('No Padding property found on the Section or its parts — padding omitted.');
  }

  // contentWidth translation — the split half of the Figma Section model:
  // prefer a width variant on the Section or an internal part (e.g. the
  // "Section Content" component), then fall back to an explicit ContentWidth
  // variable mode on the instance or its inner frames.
  const width = findSectionProperty(carriers, ['contentwidth', 'width'], 'VARIANT');
  const modeWidth = explicitCollectionMode(instance, 'ContentWidth');
  if (width && SECTION_WIDTHS.includes(width.property.value)) {
    props.contentWidth = width.property.value;
  } else if (SECTION_WIDTHS.includes(modeWidth)) {
    props.contentWidth = modeWidth;
  } else {
    warnings.push('No content-width property or explicit ContentWidth mode found — contentWidth omitted.');
  }

  const gapVariant = findSectionProperty(carriers, ['gap'], 'VARIANT');
  const gapMode = explicitCollectionMode(instance, 'Gap');
  if (gapVariant && SECTION_GAPS.includes(gapVariant.property.value)) props.gap = gapVariant.property.value;
  else if (SECTION_GAPS.includes(gapMode)) props.gap = gapMode;
  else {
    const gapCarrier = sectionGapCarrier(instance);
    if (gapCarrier) {
      const detectedGap = nearestSectionGap(gapCarrier.itemSpacing);
      if (detectedGap !== 'md') props.gap = detectedGap;
      if (gapCarrier.itemSpacing !== SECTION_GAP_PIXELS[detectedGap]) {
        warnings.push(`Section content itemSpacing=${gapCarrier.itemSpacing} is not an A1 semantic gap; nearest gap="${detectedGap}" was exported.`);
      }
    }
  }

  // A1 inverse corresponds only to an explicitly applied Dark Color mode.
  // Other modes (including inherited/default modes) leave inverse absent.
  const colorMode = explicitCollectionMode(instance, 'Color');
  if (colorMode === 'Dark') {
    props.inverse = true;
    warnings.push('inverse: true was derived from the explicit "Dark" Color mode on the section.');
  }

  // TEXT documentation properties (Gradient, Align, borders, background…).
  for (const key of Object.keys(SECTION_TEXT_PROPS)) {
    const def = SECTION_TEXT_PROPS[key];
    const found = findSectionProperty(carriers, [canonicalKey(key)], 'TEXT');
    const raw = found && typeof found.property.value === 'string' ? found.property.value.trim() : '';
    if (!raw || raw === def.default) continue;
    if (def.allowed && !def.allowed.includes(raw)) {
      warnings.push(`${key}="${raw}" is not a valid value — ignored.`);
      continue;
    }
    props[def.prop] = raw;
  }
  const sidesFound = findSectionProperty(carriers, ['bordersides'], 'TEXT');
  const sidesRaw = sidesFound && typeof sidesFound.property.value === 'string' ? sidesFound.property.value.trim() : '';
  if (sidesRaw && sidesRaw !== 'all') {
    let sides;
    try {
      sides = JSON.parse(sidesRaw);
    } catch (error) {
      sides = sidesRaw.split(/[\s,]+/);
    }
    if (Array.isArray(sides)) {
      sides = sides.filter((side) => ['top', 'right', 'bottom', 'left'].includes(side));
      if (sides.length > 0 && sides.length < 4) props.borderSides = sides;
    }
  }

  const children = exportSectionChildren(instance, warnings);
  const node = {
    id: 'section-' + instance.id.replace(/[^a-zA-Z0-9]+/g, '-'),
    type: 'Section',
  };
  if (Object.keys(props).length > 0) node.props = props;
  if (children.length > 0) node.children = children;
  return { node, warnings };
}

// Button Container is a responsive action layout in React. The Figma asset
// exposes its wide-layout alignment as an Align variant and carries its
// representative Button instances in a named frame. The frame is deliberately
// named like a slot so exported children remain ordered and easy to reconcile.
function buttonContainerSlot(instance) {
  return instance.findOne((node) =>
    (node.type === 'FRAME' || node.type === 'SLOT') && canonicalKey(node.name) === 'buttonslot') || null;
}

function exportButtonContainer(instance) {
  const warnings = [];
  const props = {};
  const align = componentPropertyValue(instance, 'Align', 'VARIANT');
  if (BUTTON_CONTAINER_ALIGNS.includes(align)) {
    if (align !== 'start') props.align = align;
  } else {
    warnings.push('No supported Align property was found on the Button Container — align was omitted.');
  }

  const liveInstance = currentInstance(instance);
  const slot = buttonContainerSlot(liveInstance);
  const children = slot ? exportFreeContent(slot, warnings) : [];
  if (!slot) warnings.push('Button Slot was not found — Button children were not exported.');

  const node = { id: componentId('ButtonContainer', instance), type: 'ButtonContainer' };
  if (Object.keys(props).length > 0) node.props = props;
  if (children.length > 0) node.children = children;
  return { node, warnings };
}

function exportTextField(instance) {
  const warnings = [];
  const props = {};
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  const state = componentPropertyValue(instance, 'State', 'VARIANT');
  const showLabel = componentPropertyValue(instance, 'Show label', 'BOOLEAN');
  const showHint = componentPropertyValue(instance, 'Show hint', 'BOOLEAN');
  const label = componentPropertyValue(instance, 'Label', 'TEXT');
  const value = componentPropertyValue(instance, 'Value', 'TEXT');
  const hint = componentPropertyValue(instance, 'Hint', 'TEXT');
  const error = componentPropertyValue(instance, 'Error', 'TEXT');

  if (TEXT_FIELD_SIZES.includes(size) && size !== 'default') props.size = size;
  if (showLabel !== false && typeof label === 'string' && label) props.label = label;
  if (typeof value === 'string' && value) props.defaultValue = value;
  if (state === 'required') props.required = true;
  if (state === 'disabled') props.disabled = true;
  if (state === 'readOnly') props.readOnly = true;
  if (state === 'error') {
    if (typeof error === 'string' && error) props.error = error;
    else warnings.push('State=error has no Error text — the error prop was omitted.');
  } else if (showHint !== false && typeof hint === 'string' && hint) {
    props.hint = hint;
  }
  if (TEXT_FIELD_VISUAL_STATES.includes(state)) {
    warnings.push(`State=${state} is a visual-only Figma state — no prop was emitted.`);
  }

  return {
    node: { id: componentId('TextField', instance), type: 'TextField', props },
    warnings,
  };
}

// These newer component sets intentionally keep editable copy in named text
// layers instead of adding a component-property matrix for every label. The
// bridge reads and writes those stable layer names, while variants continue to
// carry the semantic visual state.
function namedTextValue(instance, name, fallback = '') {
  return namedTextLayerValue(currentInstance(instance), name, fallback);
}

async function writeNamedText(instance, name, value, warnings, owner) {
  const live = currentInstance(instance);
  let text = null;
  try {
    text = live.findOne((node) => node.type === 'TEXT' && canonicalKey(node.name) === canonicalKey(name));
  } catch {
    text = null;
  }
  if (!text) {
    warnings.push(`${owner} ${name} text layer was not found — the value was not applied.`);
    return false;
  }
  try {
    if (text.fontName !== figma.mixed) await figma.loadFontAsync(text.fontName);
    text.characters = String(value || '');
    return true;
  } catch (error) {
    warnings.push(`${owner} ${name} could not be updated: ${error.message}`);
    return false;
  }
}

async function writeFirstNamedText(instance, names, value, warnings, owner) {
  const live = currentInstance(instance);
  let text = null;
  let matchedName = '';
  for (const name of names) {
    try {
      text = live.findOne((node) => node.type === 'TEXT' && canonicalKey(node.name) === canonicalKey(name));
      if (text) {
        matchedName = name;
        break;
      }
    } catch {
      text = null;
    }
  }
  if (!text) {
    warnings.push(`${owner} text layer was not found — tried ${names.join(', ')}.`);
    return false;
  }
  try {
    if (text.fontName !== figma.mixed) await figma.loadFontAsync(text.fontName);
    text.characters = String(value || '');
    return true;
  } catch (error) {
    warnings.push(`${owner} ${matchedName} could not be updated: ${error.message}`);
    return false;
  }
}

function setVariant(instance, name, value, warnings, owner) {
  const live = currentInstance(instance);
  const assignments = {};
  queueComponentProperty(live, assignments, name, value, 'VARIANT', warnings, `${owner} ${name}`);
  applyQueuedProperties(live, assignments, warnings, `${owner} properties`);
}

function exportSearchField(instance) {
  const props = {};
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  if (TEXT_FIELD_SIZES.includes(size) && size !== 'default') props.size = size;
  const label = namedTextValue(instance, 'Label').trim();
  const value = namedTextValue(instance, 'Value').trim();
  if (label) props.label = label;
  if (value) props.defaultValue = value;
  return { node: { id: componentId('SearchField', instance), type: 'SearchField', props }, warnings: [] };
}

async function applySearchField(instance, node, warnings) {
  const props = node.props || {};
  setVariant(instance, 'Size', TEXT_FIELD_SIZES.includes(props.size) ? props.size : 'default', warnings, 'Search Field');
  if (typeof props.label === 'string') await writeNamedText(instance, 'Label', props.label, warnings, 'Search Field');
  if (typeof props.defaultValue === 'string') await writeNamedText(instance, 'Value', props.defaultValue, warnings, 'Search Field');
  for (const key of ['value', 'onSearch', 'onClear', 'autoComplete', 'readOnly', 'disabled']) {
    if (props[key] !== undefined) warnings.push(`SearchField "${key}" is runtime-only and was not represented in Figma.`);
  }
}

async function importSearchField(node, warnings) {
  const instance = await createComponentInstance('Search Field', warnings);
  await applySearchField(instance, node, warnings);
  return instance;
}

function exportTextarea(instance) {
  const props = {};
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  if (TEXT_FIELD_SIZES.includes(size) && size !== 'default') props.size = size;
  const label = componentText(instance, 'Label', namedTextValue(instance, 'Label')).trim();
  const showValue = componentBoolean(instance, 'Show value', false);
  const value = componentText(instance, 'Value', namedTextValue(instance, 'Value'));
  const showHint = componentBoolean(instance, 'Show hint', false);
  const hint = componentText(instance, 'Hint', namedTextValue(instance, 'Hint')).trim();
  const showCount = componentBoolean(instance, 'Show count', false);
  const count = componentText(instance, 'Count', namedTextValue(instance, 'Count')).trim();
  const required = componentBoolean(instance, 'Required', false);
  if (label) props.label = label;
  if (required) props.required = true;
  if (showValue && value) props.defaultValue = value;
  if (showHint && hint) props.hint = hint;
  if (showCount) {
    props.showCount = true;
    const maximum = count.match(/\/\s*(\d+)\s*$/);
    if (maximum) props.maxLength = Number(maximum[1]);
  }
  return { node: { id: componentId('TextareaField', instance), type: 'TextareaField', props }, warnings: [] };
}

async function applyTextarea(instance, node, warnings) {
  const props = node.props || {};
  const live = currentInstance(instance);
  const assignments = {};
  const defaultValue = typeof props.defaultValue === 'string' ? props.defaultValue : '';
  const hasValue = defaultValue.length > 0;
  const hint = typeof props.hint === 'string' ? props.hint : '';
  const hasHint = hint.length > 0;
  const hasMaximum = Number.isFinite(props.maxLength) && props.maxLength >= 0;
  const showCount = props.showCount === true || hasMaximum;
  const count = hasMaximum ? `${defaultValue.length} / ${props.maxLength}` : String(defaultValue.length);

  queueComponentProperty(live, assignments, 'Size', TEXT_FIELD_SIZES.includes(props.size) ? props.size : 'default', 'VARIANT', warnings, 'Textarea Size');
  queueComponentProperty(live, assignments, 'Label', typeof props.label === 'string' ? props.label : 'Message', 'TEXT', warnings, 'Textarea Label');
  queueComponentProperty(live, assignments, 'Value', defaultValue, 'TEXT', warnings, 'Textarea Value');
  queueComponentProperty(live, assignments, 'Show value', hasValue, 'BOOLEAN', warnings, 'Textarea Show value');
  queueComponentProperty(live, assignments, 'Hint', hint || 'Supporting text', 'TEXT', warnings, 'Textarea Hint');
  queueComponentProperty(live, assignments, 'Show hint', hasHint, 'BOOLEAN', warnings, 'Textarea Show hint');
  queueComponentProperty(live, assignments, 'Count', count, 'TEXT', warnings, 'Textarea Count');
  queueComponentProperty(live, assignments, 'Show count', showCount, 'BOOLEAN', warnings, 'Textarea Show count');
  queueComponentProperty(live, assignments, 'Required', props.required === true, 'BOOLEAN', warnings, 'Textarea Required');
  applyQueuedProperties(live, assignments, warnings, 'Textarea properties');

  for (const key of ['value', 'rows', 'readOnly', 'disabled']) {
    if (props[key] !== undefined) warnings.push(`TextareaField "${key}" is not represented by the compact Figma component.`);
  }
}

async function importTextarea(node, warnings) {
  const instance = await createComponentInstance('Textarea', warnings);
  await applyTextarea(instance, node, warnings);
  return instance;
}

function exportSwitch(instance) {
  const props = {};
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  const checked = componentPropertyValue(instance, 'Checked', 'VARIANT');
  if (SWITCH_SIZES.includes(size) && size !== 'default') props.size = size;
  if (checked === 'true' || checked === true) props.defaultChecked = true;
  const label = componentText(instance, 'Label', namedTextValue(instance, 'Label')).trim();
  const hint = componentText(instance, 'Hint', namedTextValue(instance, 'Hint')).trim();
  const error = componentText(instance, 'Error', namedTextValue(instance, 'Error')).trim();
  const showHint = componentBoolean(instance, 'Show hint', false);
  const showError = componentBoolean(instance, 'Show error', false);
  if (label) props.label = label;
  if (showError && error) props.error = error;
  else if (showHint && hint) props.hint = hint;
  return { node: { id: componentId('Switch', instance), type: 'Switch', props }, warnings: [] };
}

async function applySwitch(instance, node, warnings) {
  const props = node.props || {};
  const live = currentInstance(instance);
  const assignments = {};
  const hint = typeof props.hint === 'string' ? props.hint : '';
  const error = typeof props.error === 'string' ? props.error : '';
  const showError = error.length > 0;
  const showHint = hint.length > 0 && !showError;
  queueComponentProperty(live, assignments, 'Size', SWITCH_SIZES.includes(props.size) ? props.size : 'default', 'VARIANT', warnings, 'Switch Size');
  queueComponentProperty(live, assignments, 'Checked', props.checked === true || props.defaultChecked === true ? 'true' : 'false', 'VARIANT', warnings, 'Switch Checked');
  queueComponentProperty(live, assignments, 'Label', typeof props.label === 'string' ? props.label : 'Enable option', 'TEXT', warnings, 'Switch Label');
  queueComponentProperty(live, assignments, 'Hint', hint || 'Supporting text', 'TEXT', warnings, 'Switch Hint');
  queueComponentProperty(live, assignments, 'Show hint', showHint, 'BOOLEAN', warnings, 'Switch Show hint');
  queueComponentProperty(live, assignments, 'Error', error || 'This setting requires attention.', 'TEXT', warnings, 'Switch Error');
  queueComponentProperty(live, assignments, 'Show error', showError, 'BOOLEAN', warnings, 'Switch Show error');
  applyQueuedProperties(live, assignments, warnings, 'Switch properties');
  if (props.checked !== undefined) warnings.push('Switch controlled checked state is represented as the current Figma Checked visual.');
}

async function importSwitch(node, warnings) {
  const instance = await createComponentInstance('Switch', warnings);
  await applySwitch(instance, node, warnings);
  return instance;
}

function segmentedLabels(instance) {
  try {
    return currentInstance(instance).findAll((node) => node.type === 'TEXT' && ['label', 'selectedlabel'].includes(canonicalKey(node.name)))
      .map((node) => node.characters).filter(Boolean);
  } catch {
    return [];
  }
}

function segmentedItemInstances(instance) {
  const current = currentInstance(instance);
  const slot = namedSlot(current, 'Content Slot');
  const root = slot || current;
  try {
    return stackFlowChildren(root).filter((child) => child.type === 'INSTANCE' && componentSetName(child) === 'Segmented Control Item');
  } catch {
    return [];
  }
}

function segmentedOptionLabel(option, fallback) {
  if (typeof option === 'string') return option;
  if (option && typeof option.label === 'string') return option.label;
  return fallback;
}

function segmentedOptionValue(option, label, usedValues) {
  if (option && typeof option === 'object' && typeof option.value === 'string' && option.value) {
    usedValues.add(option.value);
    return option.value;
  }
  return slugifyOptionValue(label, usedValues);
}

async function writeTextLayerValue(text, value, warnings, owner) {
  try {
    if (text.fontName !== figma.mixed) await figma.loadFontAsync(text.fontName);
    text.characters = String(value || '');
  } catch (error) {
    warnings.push(`${owner} ${text.name} could not be updated: ${error.message}`);
  }
}

function segmentedItemLabelColorVariable(item) {
  try {
    const label = currentInstance(item).findOne((node) => node.type === 'TEXT' && canonicalKey(node.name) === 'label');
    const paint = label && Array.isArray(label.fills) ? label.fills.find((entry) => entry && entry.type === 'SOLID') : null;
    const variableId = paint && paint.boundVariables && paint.boundVariables.color && paint.boundVariables.color.id;
    return variableId ? figma.variables.getVariableById(variableId) : null;
  } catch {
    return null;
  }
}

function bindSegmentedItemIconColor(item, warnings, owner) {
  const colorVariable = segmentedItemLabelColorVariable(item);
  if (!colorVariable) return;
  let live = currentInstance(item);
  const icon = live.findOne((node) => node.type === 'INSTANCE' && node.name === 'Icon');
  if (!icon) return;
  const paintNodes = icon.findAll((node) => 'fills' in node || 'strokes' in node);
  for (const paintNode of paintNodes) {
    try {
      if ('fills' in paintNode && Array.isArray(paintNode.fills) && paintNode.fills.length) {
        paintNode.fills = paintNode.fills.map((paint) => (
          paint && paint.type === 'SOLID'
            ? figma.variables.setBoundVariableForPaint({ ...paint }, 'color', colorVariable)
            : paint
        ));
      }
      if ('strokes' in paintNode && Array.isArray(paintNode.strokes) && paintNode.strokes.length) {
        paintNode.strokes = paintNode.strokes.map((paint) => (
          paint && paint.type === 'SOLID'
            ? figma.variables.setBoundVariableForPaint({ ...paint }, 'color', colorVariable)
            : paint
        ));
      }
    } catch (error) {
      warnings.push(`${owner} icon color could not be rebound: ${error.message}`);
    }
  }
}

function exportSegmentedControl(instance) {
  const props = {};
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  if (SEGMENTED_SIZES.includes(size) && size !== 'md') props.size = size;
  const values = new Set();
  const itemInstances = segmentedItemInstances(instance);
  const options = itemInstances.length
    ? itemInstances.map((item, index) => {
      const content = componentPropertyValue(item, 'Content', 'VARIANT');
      const showIcon = componentBoolean(item, 'Show icon', content === 'icon label' || content === 'icon only');
      const showLabel = componentBoolean(item, 'Show label', content !== 'icon only');
      const label = componentText(item, 'Label', namedTextLayerValue(item, 'Label', item.name || `Option ${index + 1}`)).trim() || `Option ${index + 1}`;
      const option = { value: slugifyOptionValue(label, values), label };
      if (showIcon) {
        const icon = iconNameFromInstance(item, 'Icon')
          || iconNameFromSwapValue(componentPropertyValue(item, 'Icon', 'INSTANCE_SWAP'))
          || componentText(item, 'Icon', namedTextLayerValue(item, 'Icon', '')).trim();
        if (icon) option.icon = icon;
        if (!showLabel) option.ariaLabel = label;
      }
      return option;
    })
    : segmentedLabels(instance).map((label) => ({ value: slugifyOptionValue(label, values), label }));
  if (options.length) {
    props.options = options;
    const selectedIndex = itemInstances.findIndex((item) => {
      const selected = componentPropertyValue(item, 'Selected', 'VARIANT');
      return selected === 'true' || selected === true;
    });
    props.value = options[selectedIndex >= 0 ? selectedIndex : 0].value;
    if (itemInstances.length) {
      const labelVisibility = itemInstances.map((item) => componentBoolean(item, 'Show label', componentPropertyValue(item, 'Content', 'VARIANT') !== 'icon only'));
      const iconCapable = options.some((option) => typeof option.icon === 'string' && option.icon);
      if (iconCapable && labelVisibility.every((visible) => visible === false)) props.labelMode = 'none';
      else if (iconCapable && selectedIndex >= 0 && labelVisibility.every((visible, index) => index === selectedIndex ? visible !== false : visible === false)) props.labelMode = 'selected';
    }
  }
  return { node: { id: componentId('SegmentedControl', instance), type: 'SegmentedControl', props }, warnings: [] };
}

async function applySegmentedControl(instance, node, warnings) {
  const props = node.props || {};
  const size = SEGMENTED_SIZES.includes(props.size) ? props.size : 'md';
  setVariant(instance, 'Size', size, warnings, 'Segmented Control');
  if (Array.isArray(props.options)) {
    const normalized = [];
    const usedValues = new Set();
    for (let index = 0; index < props.options.length; index += 1) {
      const option = props.options[index];
      const label = segmentedOptionLabel(option, `Option ${index + 1}`);
      normalized.push({
        label,
        value: segmentedOptionValue(option, label, usedValues),
        icon: option && typeof option === 'object' && typeof option.icon === 'string' ? option.icon : null,
      });
    }
    const selectedIndex = Math.max(0, normalized.findIndex((option) => option.value === props.value));
    const itemInstances = segmentedItemInstances(instance);
    if (itemInstances.length) {
      for (let index = 0; index < Math.min(itemInstances.length, normalized.length); index += 1) {
        const item = itemInstances[index];
        const option = normalized[index];
        const assignments = {};
        const hasIcon = Boolean(option.icon);
        const showLabel = props.labelMode === 'none'
          ? !hasIcon
          : props.labelMode === 'selected'
            ? index === selectedIndex || !hasIcon
            : true;
        const content = hasIcon ? (showLabel ? 'icon label' : 'icon only') : 'label';
        queueComponentProperty(item, assignments, 'Size', size, 'VARIANT', warnings, `Segmented Control option ${index + 1} size`);
        queueComponentProperty(item, assignments, 'Selected', index === selectedIndex ? 'true' : 'false', 'VARIANT', warnings, `Segmented Control option ${index + 1} selected`);
        if (componentProperty(item, 'Content', 'VARIANT')) queueComponentProperty(item, assignments, 'Content', content, 'VARIANT', warnings, `Segmented Control option ${index + 1} content`);
        queueComponentProperty(item, assignments, 'Label', option.label, 'TEXT', warnings, `Segmented Control option ${index + 1} label`);
        queueComponentProperty(item, assignments, 'Show label', showLabel, 'BOOLEAN', warnings, `Segmented Control option ${index + 1} label visibility`);
        queueComponentProperty(item, assignments, 'Show icon', hasIcon, 'BOOLEAN', warnings, `Segmented Control option ${index + 1} icon visibility`);
        if (hasIcon) {
          const icon = findIconComponent(option.icon);
          if (icon) queueComponentProperty(item, assignments, 'Icon', icon.id, 'INSTANCE_SWAP', warnings, `Segmented Control option ${index + 1} icon`);
          else warnings.push(`No Material icon component named "${option.icon}" exists in this file — option ${index + 1} keeps the default glyph.`);
        }
        applyQueuedProperties(item, assignments, warnings, `Segmented Control option ${index + 1} properties`);
        bindSegmentedItemIconColor(item, warnings, `Segmented Control option ${index + 1}`);
      }
      if (normalized.length !== itemInstances.length) warnings.push(`Segmented Control has ${itemInstances.length} editable options; JSON supplied ${normalized.length}. Use Render on canvas to change the option count.`);
    } else {
      const textLayers = currentInstance(instance).findAll((child) => child.type === 'TEXT' && ['label', 'selectedlabel'].includes(canonicalKey(child.name)));
      for (let index = 0; index < Math.min(textLayers.length, normalized.length); index += 1) {
        await writeTextLayerValue(textLayers[index], normalized[index].label, warnings, 'Segmented Control');
      }
      if (normalized.length !== textLayers.length) warnings.push(`Segmented Control has ${textLayers.length} editable options; JSON supplied ${normalized.length}. Use Render on canvas to change the option count.`);
      if (normalized.some((option) => option.icon)) warnings.push('This legacy Segmented Control asset has no item icon properties; option icons were not represented.');
    }
  }
}

async function importSegmentedControl(node, warnings) {
  const instance = await createComponentInstance('Segmented Control', warnings);
  await applySegmentedControl(instance, node, warnings);
  return instance;
}

function tabsItemsFromProps(props) {
  const source = Array.isArray(props.items) ? props.items : Array.isArray(props.tabs) ? props.tabs : [];
  const usedValues = new Set();
  return source
    .filter((item) => item && typeof item === 'object')
    .map((item, index) => {
      const label = typeof item.label === 'string' && item.label.trim() ? item.label.trim() : `Tab ${index + 1}`;
      const value = typeof item.id === 'string' && item.id
        ? item.id
        : typeof item.value === 'string' && item.value
          ? item.value
          : slugifyOptionValue(label, usedValues);
      usedValues.add(value);
      return {
        ...item,
        id: value,
        value,
        label,
      };
    });
}

function normalizedTabsVariant(value) {
  const raw = String(value || '').trim().toLowerCase();
  return TABS_VARIANTS.includes(raw) ? raw : '';
}

function tabAttachmentName(node) {
  try {
    const match = String(node && node.name ? node.name : '').match(/\{\s*tab\s*=\s*([^}]+?)\s*\}/i);
    return match ? match[1].trim() : '';
  } catch {
    return '';
  }
}

function tabAttachmentKey(value) {
  return compactKey(String(value || ''));
}

function tabItemMatchKeys(item) {
  const keys = new Set();
  for (const value of [item && item.id, item && item.value, item && item.label]) {
    const key = tabAttachmentKey(value);
    if (key) keys.add(key);
  }
  return keys;
}

function nodeIsDescendantOf(node, ancestor) {
  try {
    for (let current = node; current; current = current.parent) {
      if (current && ancestor && current.id === ancestor.id) return true;
      if (current.type === 'PAGE') break;
    }
  } catch {
    return false;
  }
  return false;
}

function attachMarkedTabContent(exportedNodes, attachments, warnings) {
  if (!attachments || attachments.length === 0) return [];
  const unused = new Set(attachments);
  const visit = (node) => {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'Tabs') {
      const props = node.props || {};
      const items = tabsItemsFromProps(props);
      if (items.length) {
        const nextItems = items.map((item) => {
          const keys = tabItemMatchKeys(item);
          const matches = attachments.filter((attachment) => keys.has(attachment.key));
          if (!matches.length) return item;
          const children = [];
          if (Array.isArray(item.children)) children.push(...item.children);
          for (const match of matches) {
            children.push(...match.children);
            unused.delete(match);
          }
          return { ...item, children };
        });
        node.props = { ...props, items: nextItems };
      }
    }
    if (Array.isArray(node.children)) node.children.forEach(visit);
    if (node.props && Array.isArray(node.props.items)) {
      node.props.items.forEach((item) => {
        if (item && Array.isArray(item.children)) item.children.forEach(visit);
      });
    }
  };
  exportedNodes.forEach(visit);
  for (const attachment of unused) {
    warnings.push(`No Tabs item matched {tab=${attachment.label}} on "${attachment.nodeName}" — exported that content in place instead.`);
  }
  return [...unused];
}

function tabsConnectedPanelCount(instance) {
  const itemKeys = new Set();
  for (const item of tabsItemInstances(instance)) {
    const label = componentText(item, 'Label', namedTextLayerValue(item, 'Label', item.name || '')).trim();
    for (const key of tabItemMatchKeys({ id: tabsItemValue(item, label, new Set()), label })) itemKeys.add(key);
  }
  if (!itemKeys.size) return 0;
  const seenMarkers = new Set();
  const countInScope = (scope) => {
    let count = 0;
    const check = (node) => {
      try {
        if (!node || node.id === instance.id || nodeIsDescendantOf(node, instance)) return;
        if (seenMarkers.has(node.id)) return;
        const key = tabAttachmentKey(tabAttachmentName(node));
        if (key && itemKeys.has(key)) {
          seenMarkers.add(node.id);
          count += 1;
        }
      } catch {
        // Ignore transient nodes while auditing.
      }
    };
    check(scope);
    try {
      if (scope && typeof scope.findAll === 'function') {
        for (const node of scope.findAll((candidate) => Boolean(tabAttachmentName(candidate)))) check(node);
      }
    } catch {
      return count;
    }
    return count;
  };
  try {
    for (let scope = instance && instance.parent; scope && scope.type !== 'PAGE'; scope = scope.parent) {
      const count = countInScope(scope);
      if (count > 0) return count;
    }
    return countInScope(figma.currentPage);
  } catch {
    return 0;
  }
}

function tabsSlotCandidates(instance) {
  const current = currentInstance(instance);
  if (!current) return [];
  try {
    return current.findAll((node) => {
      try {
        return node.type === 'SLOT' || node.type === 'FRAME' || node.type === 'GROUP';
      } catch {
        return false;
      }
    });
  } catch {
    return [];
  }
}

function slotHasTabItems(slot) {
  try {
    return slot.findAll((node) => node.type === 'INSTANCE' && ['Tab Item', 'Tab'].includes(componentSetName(node))).length > 0;
  } catch {
    return false;
  }
}

function tabsItemSlot(instance) {
  const current = currentInstance(instance);
  const exact = tabsSlotCandidates(current).find((slot) => {
    try {
      return canonicalKey(slot.name) === canonicalKey(TABS_ITEMS_SLOT_NAME) && typeof slot.appendChild === 'function';
    } catch {
      return false;
    }
  });
  if (exact) return exact;

  let firstItem = null;
  try {
    firstItem = current.findOne((node) => node.type === 'INSTANCE' && ['Tab Item', 'Tab'].includes(componentSetName(node)));
  } catch {
    firstItem = null;
  }
  if (firstItem && firstItem.parent && 'appendChild' in firstItem.parent) return firstItem.parent;

  const named = ['Tab Items', 'Tabs Items', 'Tab List', 'Tabs List', 'Tab Bar', 'Tabs Bar', 'Tab Slot', 'Tabs Slot', 'Items']
    .map((name) => nativeSlot(current, name) || namedSlot(current, name))
    .find(Boolean);
  if (named) return named;

  return tabsSlotCandidates(current).find((slot) => {
    const key = canonicalKey(slot.name);
    return slotHasTabItems(slot)
      || ((key.includes('tab') || key.includes('tabs')) && (key.includes('item') || key.includes('list') || key.includes('bar') || key.includes('nav')));
  }) || null;
}

function tabsItemInstances(instance) {
  const current = currentInstance(instance);
  const slot = tabsItemSlot(current);
  const root = slot || current;
  try {
    return root.findAll((node) => {
      try {
        return node.type === 'INSTANCE' && ['Tab Item', 'Tab'].includes(componentSetName(node));
      } catch {
        return false;
      }
    });
  } catch {
    return [];
  }
}

function tabsItemValue(item, label, usedValues) {
  try {
    const stored = item.getPluginData('a1-tab-value');
    if (stored) {
      usedValues.add(stored);
      return stored;
    }
  } catch {
    // Stored values are a convenience; labels are the visible source.
  }
  const value = componentText(item, 'Value', namedTextLayerValue(item, 'Value', '')).trim();
  if (value) {
    usedValues.add(value);
    return value;
  }
  return slugifyOptionValue(label, usedValues);
}

function tabItemSelected(item) {
  for (const name of ['Selected', 'Active']) {
    const found = componentProperty(item, name);
    if (!found) continue;
    const value = found.property.value;
    return value === true || value === 'true' || value === 'selected' || value === 'active';
  }
  return false;
}

function exportTabItem(item, index, usedValues, warnings) {
  const label = componentText(item, 'Label', namedTextLayerValue(item, 'Label', item.name || `Tab ${index + 1}`)).trim() || `Tab ${index + 1}`;
  const value = tabsItemValue(item, label, usedValues);
  const out = { id: value, label };
  const showIcon = componentBoolean(item, 'Show icon', false);
  if (showIcon) {
    const icon = iconNameFromInstance(item, 'Icon') || iconNameFromSwapValue(componentPropertyValue(item, 'Icon', 'INSTANCE_SWAP'));
    if (icon) out.icon = icon;
    else warnings.push(`Tab "${label}" shows an icon, but its Material icon could not be resolved.`);
    const iconPosition = componentPropertyValue(item, 'Icon position', 'VARIANT');
    if (TAB_ICON_POSITIONS.includes(iconPosition) && iconPosition !== 'start') out.iconPosition = iconPosition;
  }
  const showCount = componentBoolean(item, 'Show count', false);
  const count = componentText(item, 'Count', namedTextLayerValue(item, 'Count', '')).trim();
  if (showCount && count) out.count = count;
  const status = componentPropertyValue(item, 'Status', 'VARIANT');
  if (TAB_STATUSES.includes(status) && status !== 'none') out.status = status === 'warning' ? 'warn' : status;
  return out;
}

function exportTabs(instance) {
  const warnings = [];
  const props = {};
  const variant = normalizedTabsVariant(componentPropertyValue(instance, 'Variant', 'VARIANT'));
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  const level = Number(componentPropertyValue(instance, 'Level', 'VARIANT') || componentPropertyValue(instance, 'Level', 'TEXT'));
  const labelMode = componentPropertyValue(instance, 'Label mode', 'VARIANT');
  const equalHeight = componentPropertyValue(instance, 'Equal height', 'BOOLEAN');
  if (TABS_VARIANTS.includes(variant) && variant !== 'line') props.variant = variant;
  if (TABS_SIZES.includes(size) && size !== 'default') props.size = size;
  if (TABS_LEVELS.includes(level) && level !== 1) props.level = level;
  if (TABS_LABEL_MODES.includes(labelMode) && labelMode !== 'all') props.labelMode = labelMode;
  if (equalHeight === true) props.equalHeight = true;

  const usedValues = new Set();
  const items = tabsItemInstances(instance).map((item, index) => exportTabItem(item, index, usedValues, warnings));
  if (items.length) {
    props.items = items;
    const selectedIndex = tabsItemInstances(instance).findIndex(tabItemSelected);
    props.value = items[selectedIndex >= 0 ? selectedIndex : 0].id;
  } else {
    warnings.push('Tabs item slot was not found — exported an empty items array.');
    props.items = [];
  }

  return { node: { id: componentId('Tabs', instance), type: 'Tabs', props }, warnings };
}

async function reconcileTabsItemInstances(instance, requestedCount, warnings) {
  const current = currentInstance(instance);
  const slot = tabsItemSlot(current);
  let items = tabsItemInstances(current);
  const itemSource = await findComponentSourceAsync('Tab Item', warnings) || await findComponentSourceAsync('Tab', warnings);
  if (!slot || !itemSource) {
    if (requestedCount !== items.length) {
      warnings.push(`Tabs has ${items.length} editable tab item(s); JSON supplied ${requestedCount}. Add a Tab Item slot/component to let the plugin reconcile item count.`);
    }
    return items;
  }
  const wanted = Math.max(1, Math.min(requestedCount, 12));
  if (requestedCount > 12) warnings.push(`Tabs supports up to 12 Figma tab items; ${requestedCount - 12} additional JSON item(s) were not rendered.`);
  while (items.length < wanted) {
    const liveSlot = tabsItemSlot(currentInstance(instance));
    if (!liveSlot) break;
    liveSlot.appendChild(itemSource.createInstance());
    items = tabsItemInstances(currentInstance(instance));
  }
  while (items.length > wanted) {
    const liveItems = tabsItemInstances(currentInstance(instance));
    liveItems[liveItems.length - 1].remove();
    items = tabsItemInstances(currentInstance(instance));
  }
  return items;
}

function queueTabSelectedProperty(item, assignments, selected) {
  for (const name of ['Selected', 'Active']) {
    const found = componentProperty(item, name);
    if (!found) continue;
    assignments[found.key] = found.property.type === 'BOOLEAN' ? selected : selected ? 'true' : 'false';
    return true;
  }
  return false;
}

async function applyTabItem(item, tab, selected, index, warnings) {
  const live = currentInstance(item);
  const assignments = {};
  try {
    live.setPluginData('a1-tab-value', tab.id || tab.value || '');
  } catch {
    // Value plugin data is only used to make round-trips stable.
  }
  queueOptionalComponentProperty(live, assignments, 'Label', tab.label, 'TEXT');
  queueOptionalComponentProperty(live, assignments, 'Value', tab.id || tab.value || '', 'TEXT');
  queueTabSelectedProperty(live, assignments, selected);
  const icon = typeof tab.icon === 'string' && tab.icon ? tab.icon : '';
  queueOptionalComponentProperty(live, assignments, 'Show icon', Boolean(icon), 'BOOLEAN');
  if (icon) {
    const iconComponent = findIconComponent(icon);
    if (iconComponent) queueOptionalComponentProperty(live, assignments, 'Icon', iconComponent.id, 'INSTANCE_SWAP');
    else warnings.push(`No Material icon component named "${icon}" exists in this file — tab ${index + 1} keeps its default glyph.`);
  }
  const iconPosition = TAB_ICON_POSITIONS.includes(tab.iconPosition) ? tab.iconPosition : 'start';
  queueOptionalComponentProperty(live, assignments, 'Icon position', iconPosition, 'VARIANT');
  const count = tab.count === undefined || tab.count === null ? '' : String(tab.count);
  queueOptionalComponentProperty(live, assignments, 'Count', count, 'TEXT');
  queueOptionalComponentProperty(live, assignments, 'Show count', count !== '', 'BOOLEAN');
  const status = TAB_STATUSES.includes(tab.status) ? (tab.status === 'warning' ? 'warn' : tab.status) : 'none';
  queueOptionalComponentProperty(live, assignments, 'Status', status, 'VARIANT');
  applyQueuedProperties(live, assignments, warnings, `Tabs item ${index + 1} properties`);
  if (!componentProperty(live, 'Label', 'TEXT')) await writeNamedText(live, 'Label', tab.label, warnings, `Tabs item ${index + 1}`);
}

function tabsPanelChildrenForNode(node, activeValue) {
  const props = node.props || {};
  if (Array.isArray(props.panels)) {
    const panel = props.panels.find((entry) => entry && typeof entry === 'object' && (entry.id === activeValue || entry.value === activeValue));
    if (panel && Array.isArray(panel.children)) return panel.children;
  }
  const tabs = tabsItemsFromProps(props);
  const activeTab = tabs.find((tab) => tab.id === activeValue || tab.value === activeValue);
  if (activeTab && Array.isArray(activeTab.children)) return activeTab.children;
  return Array.isArray(node.children) ? node.children : [];
}

async function warnUnsupportedTabsPanelChildren(children, warnings) {
  if (!children.length) return;
  warnings.push('Tabs panel children are not represented in the current A1 Figma Tabs component; only Tab items were rendered.');
}

async function applyTabs(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const live = currentInstance(instance);
  const assignments = {};
  const variant = normalizedTabsVariant(props.variant) || 'line';
  const size = props.size === 'compact' ? 'compact' : 'default';
  const level = TABS_LEVELS.includes(Number(props.level)) ? Number(props.level) : 1;
  const labelMode = TABS_LABEL_MODES.includes(props.labelMode) ? props.labelMode : 'all';
  queueOptionalComponentProperty(live, assignments, 'Variant', variant, 'VARIANT');
  queueOptionalComponentProperty(live, assignments, 'Size', size, 'VARIANT');
  queueOptionalComponentProperty(live, assignments, 'Level', String(level), 'VARIANT')
    || queueOptionalComponentProperty(live, assignments, 'Level', String(level), 'TEXT');
  queueOptionalComponentProperty(live, assignments, 'Label mode', labelMode, 'VARIANT');
  queueOptionalComponentProperty(live, assignments, 'Equal height', props.equalHeight === true, 'BOOLEAN');
  applyQueuedProperties(live, assignments, warnings, 'Tabs properties');

  const tabs = tabsItemsFromProps(props);
  const items = await reconcileTabsItemInstances(instance, tabs.length || 1, warnings);
  const activeValue = typeof props.value === 'string' && props.value ? props.value : tabs[0]?.id || tabs[0]?.value || '';
  for (let index = 0; index < Math.min(items.length, tabs.length); index += 1) {
    await applyTabItem(items[index], tabs[index], tabs[index].id === activeValue || tabs[index].value === activeValue, index, warnings);
  }
  if (tabs.length === 0) warnings.push('Tabs JSON had no props.items array; the default Figma tab item was retained.');
  await warnUnsupportedTabsPanelChildren(tabsPanelChildrenForNode(node, activeValue), warnings);
  for (const key of ['onChange', 'className']) {
    if (props[key] !== undefined) warnings.push(`Tabs "${key}" is runtime-only and was not represented in Figma.`);
  }
}

async function importTabs(node, warnings) {
  const instance = await createComponentInstance('Tabs', warnings);
  await applyTabs(instance, node, warnings);
  return instance;
}

function exportAccordion(instance) {
  const props = {};
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  const open = componentPropertyValue(instance, 'Open', 'VARIANT');
  if (ACCORDION_SIZES.includes(size) && size !== 'md') props.size = size;
  if (open === 'true' || open === true) props.defaultOpen = true;
  const label = namedTextValue(instance, 'Label').trim();
  const subtext = namedTextValue(instance, 'Subtext').trim();
  if (label) props.label = label;
  if (subtext) props.subtext = subtext;
  const warnings = [];
  const slot = nativeSlot(instance, 'Content Slot');
  const children = slot ? exportFreeContent(slot, warnings) : [];
  if (!slot) warnings.push('Accordion Content Slot was not found — children were not exported.');
  return { node: { id: componentId('Accordion', instance), type: 'Accordion', props, ...(children.length ? { children } : {}) }, warnings };
}

async function applyAccordion(instance, node, warnings) {
  const props = node.props || {};
  setVariant(instance, 'Size', ACCORDION_SIZES.includes(props.size) ? props.size : 'md', warnings, 'Accordion');
  setVariant(instance, 'Open', props.open === true || props.defaultOpen === true ? 'true' : 'false', warnings, 'Accordion');
  if (typeof props.label === 'string') await writeNamedText(instance, 'Label', props.label, warnings, 'Accordion');
  if (typeof props.subtext === 'string') await writeNamedText(instance, 'Subtext', props.subtext, warnings, 'Accordion');
}

async function importAccordion(node, warnings) {
  const instance = await createComponentInstance('Accordion', warnings);
  await applyAccordion(instance, node, warnings);
  if (Array.isArray(node.children) && node.children.length) {
    const props = node.props || {};
    const shouldRemainCollapsed = props.open !== true && props.defaultOpen !== true;
    const slot = nativeSlot(instance, 'Content Slot');
    if (!slot && shouldRemainCollapsed) {
      setVariant(instance, 'Open', 'true', warnings, 'Accordion');
    }
    await replaceNativeSlotChildren(instance, 'Content Slot', node.children, warnings, 'Accordion');
    if (shouldRemainCollapsed) setVariant(instance, 'Open', 'false', warnings, 'Accordion');
  }
  return instance;
}

function exportTooltip(instance) {
  const props = {};
  const placement = componentPropertyValue(instance, 'Placement', 'VARIANT');
  if (TOOLTIP_PLACEMENTS.includes(placement) && placement !== 'top') props.placement = placement;
  return { node: { id: componentId('Tooltip', instance), type: 'Tooltip', props: { ...props, content: namedTextValue(instance, 'Content', 'Helpful supporting text') } }, warnings: ['Tooltip trigger content is runtime-only and is not included in the standalone Figma surface export.'] };
}

async function applyTooltip(instance, node, warnings) {
  const props = node.props || {};
  setVariant(instance, 'Placement', TOOLTIP_PLACEMENTS.includes(props.placement) ? props.placement : 'top', warnings, 'Tooltip');
  if (typeof props.content === 'string') await writeNamedText(instance, 'Content', props.content, warnings, 'Tooltip');
}

async function importTooltip(node, warnings) {
  const instance = await createComponentInstance('Tooltip', warnings);
  await applyTooltip(instance, node, warnings);
  warnings.push('Tooltip was rendered as its visual surface; add its trigger relationship in Figma manually.');
  return instance;
}

function exportPagination(instance) {
  const props = {};
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  if (PAGINATION_SIZES.includes(size) && size !== 'md') props.size = size;
  const labels = namedTextValue(instance, 'Label', '');
  const all = currentInstance(instance).findAll((node) => node.type === 'TEXT' && canonicalKey(node.name) === 'label').map((node) => node.characters);
  const pages = all.filter((value) => /^\\d+$/.test(value)).map(Number);
  props.page = pages[1] || pages[0] || 1;
  props.totalPages = pages.length ? Math.max(...pages) : 1;
  return { node: { id: componentId('Pagination', instance), type: 'Pagination', props }, warnings: labels ? [] : [] };
}

async function applyPagination(instance, node, warnings) {
  const props = node.props || {};
  setVariant(instance, 'Size', PAGINATION_SIZES.includes(props.size) ? props.size : 'md', warnings, 'Pagination');
  if (props.page !== undefined || props.totalPages !== undefined) warnings.push('Pagination page range is represented by editable visual labels; its item count is fixed in the Figma component.');
}

async function importPagination(node, warnings) {
  const instance = await createComponentInstance('Pagination', warnings);
  await applyPagination(instance, node, warnings);
  return instance;
}

function pageNavItemsContainer(instance) {
  const current = currentInstance(instance);
  try {
    const exact = current.findOne((node) => node.type === 'FRAME' && node.name === 'Items');
    if (exact) return exact;
  } catch {
    return null;
  }
  try {
    return current.findOne((node) =>
      node.type === 'FRAME'
      && canonicalKey(node.name).includes('items')
      && node.findOne((child) => child.type === 'INSTANCE' && componentSetName(child) === 'Page Nav Item'));
  } catch {
    return null;
  }
}

function pageNavItemInstances(instance) {
  const container = pageNavItemsContainer(instance);
  if (!container) return [];
  try {
    const direct = container.children.filter((node) => node.type === 'INSTANCE' && componentSetName(node) === 'Page Nav Item');
    return direct.length ? direct : container.findAll((node) => node.type === 'INSTANCE' && componentSetName(node) === 'Page Nav Item');
  } catch {
    return [];
  }
}

function pageNavSectionsFromProps(props) {
  const sections = Array.isArray(props.sections) ? props.sections : [];
  const used = new Set();
  return sections
    .filter((section) => section && typeof section === 'object')
    .map((section, index) => {
      const label = typeof section.label === 'string' && section.label.trim() ? section.label.trim() : `Section ${index + 1}`;
      const id = typeof section.id === 'string' && section.id.trim()
        ? section.id.trim()
        : slugifyOptionValue(label, used);
      used.add(id);
      return {
        id,
        label,
        level: Number(section.level) === 2 ? 2 : 1,
      };
    });
}

function exportPageNav(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  const label = namedTextValue(instance, 'On this page', '').trim();
  if (label && label !== 'On this page') props.label = label;

  const usedIds = new Set();
  const sections = [];
  const items = pageNavItemInstances(instance).filter((item) => item.visible !== false);
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const itemLabel = componentPropertyValue(item, 'Label', 'TEXT') || namedTextLayerValue(item, 'Section heading', item.name || `Section ${index + 1}`);
    const section = {
      id: slugifyOptionValue(itemLabel, usedIds),
      label: itemLabel,
    };
    const level = Number(componentPropertyValue(item, 'Level', 'VARIANT'));
    if (level === 2) section.level = 2;
    const state = componentPropertyValue(item, 'State', 'VARIANT');
    if (state === 'active') warnings.push(`Page Nav item "${itemLabel}" is visually active in Figma; active section is runtime-owned and was not exported.`);
    sections.push(section);
  }
  if (sections.length) props.sections = sections;
  else warnings.push('Page Nav items were not found — exported an empty sections array.');
  return { node: { id: componentId('PageNav', instance), type: 'PageNav', props }, warnings };
}

async function applyPageNav(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const label = typeof props.label === 'string' && props.label.trim() ? props.label.trim() : 'On this page';
  await writeNamedText(instance, 'On this page', label, warnings, 'Page Nav');

  const sections = pageNavSectionsFromProps(props);
  const items = pageNavItemInstances(instance);
  if (!items.length) {
    warnings.push('Page Nav Items frame was not found — sections were not applied.');
    return instance;
  }
  if (sections.length > items.length) {
    warnings.push(`Page Nav Figma component has ${items.length} editable item rows; ${sections.length - items.length} additional section(s) were not rendered. Add an item slot if Page Nav needs variable section counts.`);
  }
  const visibleCount = Math.min(Math.max(sections.length, 1), Math.min(items.length, PAGE_NAV_MAX_SECTIONS));
  for (let index = 0; index < items.length; index += 1) {
    const item = currentInstance(items[index]);
    const section = sections[index] || { label: `Section ${index + 1}`, level: 1 };
    try {
      item.visible = index < visibleCount;
    } catch {
      // Visibility overrides on instance children can be unavailable while Figma refreshes.
    }
    if (index >= visibleCount) continue;
    const assignments = {};
    queueComponentProperty(item, assignments, 'Label', section.label, 'TEXT', warnings, `Page Nav item ${index + 1} label`);
    queueComponentProperty(item, assignments, 'Level', String(section.level === 2 ? 2 : 1), 'VARIANT', warnings, `Page Nav item ${index + 1} level`);
    queueComponentProperty(item, assignments, 'State', index === 0 ? 'active' : 'default', 'VARIANT', warnings, `Page Nav item ${index + 1} state`);
    applyQueuedProperties(item, assignments, warnings, `Page Nav item ${index + 1} properties`);
  }
  for (const runtimeProp of ['activeId', 'onNavigate', 'className']) {
    if (props[runtimeProp] !== undefined) warnings.push(`PageNav "${runtimeProp}" is runtime-owned and was not represented in Figma.`);
  }
  return instance;
}

async function importPageNav(node, warnings) {
  const instance = await createComponentInstance('Page Nav', warnings);
  await applyPageNav(instance, node, warnings);
  return instance;
}

function isTreeMenuItemInstance(node) {
  try {
    if (!node || node.type !== 'INSTANCE') return false;
    const name = registeredSetName(node) || componentSetName(node);
    return TREE_MENU_ITEM_SET_NAMES.has(name);
  } catch {
    return false;
  }
}

function treeMenuItemInstances(instance) {
  try {
    return currentInstance(instance).findAll((node) => isTreeMenuItemInstance(node));
  } catch {
    return [];
  }
}

function treeMenuItemLabel(item, fallback) {
  return componentText(item, 'Label', '')
    || namedTextLayerValueAny(item, ['Label', 'Title', 'Name'], '')
    || fallback;
}

function treeMenuItemDepth(item) {
  const rawLevel = componentPropertyValue(item, 'Level', 'VARIANT')
    ?? componentPropertyValue(item, 'Level', 'TEXT');
  const rawDepth = componentPropertyValue(item, 'Depth', 'VARIANT')
    ?? componentPropertyValue(item, 'Depth', 'TEXT')
    ?? componentPropertyValue(item, 'Indent', 'VARIANT')
    ?? componentPropertyValue(item, 'Indent', 'TEXT');
  const parse = (value) => {
    if (value === undefined || value === null || value === '') return null;
    const match = String(value).match(/-?\d+/);
    if (!match) return null;
    return Math.max(0, Number(match[0]));
  };
  const level = parse(rawLevel);
  if (level !== null) return Math.max(0, level - 1);
  const depth = parse(rawDepth);
  return depth === null ? 0 : depth;
}

function treeMenuState(item) {
  return String(
    componentPropertyValue(item, 'State', 'VARIANT')
    ?? componentPropertyValue(item, 'Selected', 'VARIANT')
    ?? componentPropertyValue(item, 'Active', 'VARIANT')
    ?? '',
  ).toLowerCase();
}

function treeMenuItemExpanded(item) {
  for (const name of ['Expanded', 'Open']) {
    const bool = componentPropertyValue(item, name, 'BOOLEAN');
    if (typeof bool === 'boolean') return bool;
    const variant = componentPropertyValue(item, name, 'VARIANT');
    if (typeof variant === 'string') {
      const value = variant.toLowerCase();
      if (['true', 'yes', 'open', 'expanded'].includes(value)) return true;
      if (['false', 'no', 'closed', 'collapsed'].includes(value)) return false;
    }
  }
  return false;
}

function treeMenuNestedItemsFromFlat(flatItems) {
  const roots = [];
  const stack = [];
  for (const entry of flatItems) {
    const item = entry.item;
    const depth = Math.max(0, entry.depth || 0);
    while (stack.length > depth) stack.pop();
    if (stack.length === 0) roots.push(item);
    else {
      const parent = stack[stack.length - 1];
      parent.children = parent.children || [];
      parent.children.push(item);
    }
    stack[depth] = item;
  }
  return roots;
}

function cleanTreeMenuItem(item) {
  const cleaned = { ...item };
  if (Array.isArray(cleaned.children)) {
    cleaned.children = cleaned.children.map(cleanTreeMenuItem).filter(Boolean);
    if (cleaned.children.length === 0) delete cleaned.children;
  }
  return cleaned;
}

function flattenTreeMenuItems(items, depth = 0, out = []) {
  if (!Array.isArray(items)) return out;
  for (const raw of items) {
    if (!raw || typeof raw !== 'object') continue;
    const label = typeof raw.label === 'string' && raw.label.trim() ? raw.label.trim() : `Item ${out.length + 1}`;
    const item = {
      id: typeof raw.id === 'string' && raw.id.trim() ? raw.id.trim() : slugifyOptionValue(label, new Set(out.map((entry) => entry.item.id))),
      label,
    };
    if (typeof raw.icon === 'string' && raw.icon.trim()) item.icon = raw.icon.trim();
    if (typeof raw.href === 'string' && raw.href.trim()) item.href = raw.href.trim();
    if (raw.disabled === true) item.disabled = true;
    out.push({ depth, item });
    flattenTreeMenuItems(raw.children, depth + 1, out);
  }
  return out;
}

function exportTreeMenu(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};

  const variant = componentPropertyValue(instance, 'Variant', 'VARIANT')
    ?? componentPropertyValue(instance, 'Mode', 'VARIANT');
  if (TREE_MENU_VARIANTS.includes(variant) && variant !== 'expanded') props.variant = variant;
  const showExpandControls = componentPropertyValue(instance, 'Show expand controls', 'BOOLEAN')
    ?? componentPropertyValue(instance, 'Expand controls', 'BOOLEAN');
  if (showExpandControls === true) props.showExpandControls = true;
  const draggable = componentPropertyValue(instance, 'Draggable', 'BOOLEAN');
  if (draggable === true) props.draggable = true;

  const usedIds = new Set();
  const flatItems = [];
  const expandedIds = [];
  let selectedId = '';
  const itemRows = treeMenuItemInstances(instance).filter((item) => item.visible !== false);
  for (let index = 0; index < itemRows.length; index += 1) {
    const row = itemRows[index];
    const label = treeMenuItemLabel(row, `Item ${index + 1}`);
    const id = slugifyOptionValue(label, usedIds);
    const item = { id, label };
    const icon = iconNameFromInstance(row, 'Icon')
      || iconNameFromSwapValue(componentPropertyValue(row, 'Icon', 'INSTANCE_SWAP'));
    if (icon) item.icon = icon;
    const href = componentPropertyValue(row, 'Href', 'TEXT')
      || componentPropertyValue(row, 'URL', 'TEXT')
      || componentPropertyValue(row, 'Url', 'TEXT');
    if (typeof href === 'string' && href.trim()) item.href = href.trim();
    const state = treeMenuState(row);
    if (state.includes('disabled')) item.disabled = true;
    if (!selectedId && (state.includes('selected') || state.includes('active'))) selectedId = id;
    if (treeMenuItemExpanded(row)) expandedIds.push(id);
    flatItems.push({ depth: treeMenuItemDepth(row), item });
  }

  const items = treeMenuNestedItemsFromFlat(flatItems).map(cleanTreeMenuItem);
  if (items.length > 0) props.items = items;
  else warnings.push('No visible Tree Menu item rows were found — exported an empty items array.');
  if (selectedId) props.selectedId = selectedId;
  if (expandedIds.length > 0) props.expandedIds = expandedIds;
  return { node: { id: componentId('TreeMenu', instance), type: 'TreeMenu', props }, warnings };
}

function treeMenuItemsFromProps(props) {
  const items = Array.isArray(props.items) ? props.items : [];
  return flattenTreeMenuItems(items);
}

function applyTreeMenuItem(instance, entry, props, warnings, index) {
  const item = entry.item;
  const selected = typeof props.selectedId === 'string' && props.selectedId === item.id;
  const expanded = Array.isArray(props.expandedIds) && props.expandedIds.includes(item.id);
  const state = item.disabled === true ? 'disabled' : selected ? 'selected' : 'default';
  const assignments = {};
  queueComponentProperty(instance, assignments, 'Label', item.label, 'TEXT', warnings, `Tree Menu item ${index + 1} label`);
  queueOptionalComponentProperty(instance, assignments, 'State', state, 'VARIANT')
    || queueOptionalComponentProperty(instance, assignments, 'Selected', selected ? 'true' : 'false', 'VARIANT');
  queueOptionalComponentProperty(instance, assignments, 'Level', String(entry.depth + 1), 'VARIANT')
    || queueOptionalComponentProperty(instance, assignments, 'Depth', String(entry.depth), 'VARIANT')
    || queueOptionalComponentProperty(instance, assignments, 'Indent', String(entry.depth), 'VARIANT');
  queueOptionalComponentProperty(instance, assignments, 'Expanded', expanded, 'BOOLEAN')
    || queueOptionalComponentProperty(instance, assignments, 'Expanded', expanded ? 'true' : 'false', 'VARIANT')
    || queueOptionalComponentProperty(instance, assignments, 'Open', expanded, 'BOOLEAN')
    || queueOptionalComponentProperty(instance, assignments, 'Open', expanded ? 'true' : 'false', 'VARIANT');
  const icon = typeof item.icon === 'string' ? item.icon : '';
  queueOptionalComponentProperty(instance, assignments, 'Show icon', Boolean(icon), 'BOOLEAN');
  if (icon) {
    const iconComponent = findIconComponent(icon);
    if (iconComponent) queueOptionalComponentProperty(instance, assignments, 'Icon', iconComponent.id, 'INSTANCE_SWAP');
    else warnings.push(`No icon component named "${icon}" exists in this file — Tree Menu item "${item.label}" keeps the default glyph.`);
  }
  if (typeof item.href === 'string' && item.href) {
    queueOptionalComponentProperty(instance, assignments, 'Href', item.href, 'TEXT')
      || queueOptionalComponentProperty(instance, assignments, 'URL', item.href, 'TEXT')
      || warnings.push(`Tree Menu item "${item.label}" href is runtime-owned unless the Figma item exposes an Href/URL property.`);
  }
  applyQueuedProperties(instance, assignments, warnings, `Tree Menu item ${index + 1} properties`);
}

async function applyTreeMenu(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const assignments = {};
  queueOptionalComponentProperty(instance, assignments, 'Variant', TREE_MENU_VARIANTS.includes(props.variant) ? props.variant : 'expanded', 'VARIANT')
    || queueOptionalComponentProperty(instance, assignments, 'Mode', TREE_MENU_VARIANTS.includes(props.variant) ? props.variant : 'expanded', 'VARIANT');
  queueOptionalComponentProperty(instance, assignments, 'Show expand controls', props.showExpandControls === true, 'BOOLEAN')
    || queueOptionalComponentProperty(instance, assignments, 'Expand controls', props.showExpandControls === true, 'BOOLEAN');
  queueOptionalComponentProperty(instance, assignments, 'Draggable', props.draggable === true, 'BOOLEAN');
  applyQueuedProperties(instance, assignments, warnings, 'Tree Menu properties');

  const allItems = treeMenuItemsFromProps(props);
  const items = allItems.slice(0, TREE_MENU_MAX_ITEMS);
  const rows = treeMenuItemInstances(instance);
  if (allItems.length > TREE_MENU_MAX_ITEMS) {
    warnings.push(`Tree Menu supports ${TREE_MENU_MAX_ITEMS} imported item rows; additional JSON items were not rendered.`);
  }
  if (!rows.length) {
    if (items.length > 0) warnings.push('Tree Menu item rows were not found — item data was not applied to the Figma component.');
    return instance;
  }
  if (items.length > rows.length) {
    warnings.push(`Tree Menu Figma component has ${rows.length} editable item row${rows.length === 1 ? '' : 's'}; ${items.length - rows.length} additional JSON item(s) were not rendered.`);
  }
  for (let index = 0; index < rows.length; index += 1) {
    const row = currentInstance(rows[index]);
    const entry = items[index];
    try { row.visible = Boolean(entry); } catch { /* nested visibility can be locked */ }
    if (!entry) continue;
    applyTreeMenuItem(row, entry, props, warnings, index);
  }
  for (const runtimeProp of ['onSelect', 'onExpandedChange', 'onHoverChange', 'onItemContextMenu', 'onMove', 'editingId', 'onRenameStart', 'onRenameCommit', 'onRenameCancel']) {
    if (props[runtimeProp] !== undefined) warnings.push(`TreeMenu "${runtimeProp}" is runtime-owned and was not represented in Figma.`);
  }
  return instance;
}

async function importTreeMenu(node, warnings) {
  const instance = await createComponentInstance('Tree Menu', warnings);
  await applyTreeMenu(instance, node, warnings);
  return instance;
}

function exportEmptyState(instance) {
  instance = currentInstance(instance);
  const props = {};
  const scale = componentPropertyValue(instance, 'Scale', 'VARIANT');
  if (EMPTY_STATE_SCALES.includes(scale) && scale !== 'section') props.scale = scale;
  const iconName = iconNameFromInstance(instance, 'Icon') || iconNameFromSwapValue(componentPropertyValue(instance, 'Icon', 'INSTANCE_SWAP'));
  if (iconName && iconName !== 'inbox') props.icon = iconName;
  const title = namedTextValue(instance, 'Title').trim();
  const description = namedTextValue(instance, 'Description').trim();
  if (title) props.title = title;
  if (description) props.description = description;
  return { node: { id: componentId('MessageEmptyState', instance), type: 'MessageEmptyState', props }, warnings: [] };
}

async function applyEmptyState(instance, node, warnings) {
  const props = node.props || {};
  setVariant(instance, 'Scale', EMPTY_STATE_SCALES.includes(props.scale) ? props.scale : 'section', warnings, 'Empty State');
  const iconName = typeof props.icon === 'string' && props.icon.trim() ? props.icon.trim() : 'inbox';
  const icon = findIconComponent(iconName);
  if (icon) {
    const assignments = {};
    queueComponentProperty(currentInstance(instance), assignments, 'Icon', icon.id, 'INSTANCE_SWAP', warnings, 'Empty State icon');
    applyQueuedProperties(currentInstance(instance), assignments, warnings, 'Empty State properties');
  } else {
    warnings.push(`No Material icon component named "${iconName}" exists in this file — the Empty State inbox glyph was retained.`);
  }
  if (typeof props.title === 'string') await writeNamedText(instance, 'Title', props.title, warnings, 'Empty State');
  if (typeof props.description === 'string') await writeNamedText(instance, 'Description', props.description, warnings, 'Empty State');
}

async function importEmptyState(node, warnings) {
  const instance = await createComponentInstance('Empty State', warnings);
  await applyEmptyState(instance, node, warnings);
  return instance;
}

function exportSelect(instance) {
  const warnings = [];
  const props = {};
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  const state = componentPropertyValue(instance, 'State', 'VARIANT');
  const label = componentPropertyValue(instance, 'Label', 'TEXT');
  const hint = componentPropertyValue(instance, 'Hint', 'TEXT');
  const error = componentPropertyValue(instance, 'Error message', 'TEXT');
  const value = componentPropertyValue(instance, 'Value', 'TEXT');
  const showValue = componentPropertyValue(instance, 'Show value', 'BOOLEAN');
  const required = componentPropertyValue(instance, 'Required', 'BOOLEAN');

  if (SELECT_SIZES.includes(size) && size !== 'default') props.size = size;
  if (typeof label === 'string' && label) props.label = label;
  if (required === true) props.required = true;
  if (state === 'disabled') props.disabled = true;
  if (state === 'error') {
    if (typeof error === 'string' && error) props.error = error;
    else warnings.push('Select State=error has no Error message text — the error prop was omitted.');
  } else if (typeof hint === 'string' && hint) {
    props.hint = hint;
  }
  if (!SELECT_STATES.includes(state)) warnings.push(`Select State=${state || 'unknown'} is not represented by the current Figma bridge.`);
  if (showValue === true) {
    props.showValue = true;
    if (typeof value === 'string' && value) props.defaultValue = value;
    else warnings.push('Select Show value is enabled but its Value text is empty.');
  }

  return {
    node: { id: componentId('SelectField', instance), type: 'SelectField', props },
    warnings,
  };
}

function exportDivider(instance) {
  const warnings = [];
  const props = {};
  const orientation = componentPropertyValue(instance, 'Orientation', 'VARIANT');
  const variant = componentPropertyValue(instance, 'Variant', 'VARIANT');
  const lineStyle = componentPropertyValue(instance, 'Line style', 'VARIANT');
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');

  if (DIVIDER_ORIENTATIONS.includes(orientation) && orientation !== 'horizontal') props.orientation = orientation;
  if (DIVIDER_VARIANTS.includes(variant) && variant !== 'subtle') props.variant = variant;
  if (DIVIDER_LINE_STYLES.includes(lineStyle) && lineStyle !== 'solid') props.lineStyle = lineStyle;
  if (DIVIDER_SIZES.includes(size) && size !== 'xs') props.size = size;

  return {
    node: { id: componentId('Divider', instance), type: 'Divider', ...(Object.keys(props).length ? { props } : {}) },
    warnings,
  };
}

function exportGroupOptions(instance, optionSetName, warnings) {
  const usedValues = new Set();
  const options = [];
  const selected = [];
  for (const optionInstance of instance.findAll((node) => node.type === 'INSTANCE' && componentSetName(node) === optionSetName)) {
    if (optionInstance.visible === false) continue;
    const label = componentPropertyValue(optionInstance, 'Label', 'TEXT') || 'Option';
    const value = slugifyOptionValue(label, usedValues);
    const option = { value, label };
    const hint = componentPropertyValue(optionInstance, 'Hint', 'TEXT');
    if (componentPropertyValue(optionInstance, 'Show hint', 'BOOLEAN') === true && typeof hint === 'string' && hint) option.hint = hint;
    if (componentPropertyValue(optionInstance, 'selected', 'VARIANT') === 'true') selected.push(value);
    const state = componentPropertyValue(optionInstance, 'state', 'VARIANT');
    if (state === 'hover') warnings.push(`Option "${label}" is in a visual-only hover state — no JSON prop was emitted.`);
    options.push(option);
  }
  return { options, selected };
}

function exportLegacyChoiceGroup(instance, type, optionSetName) {
  const warnings = [];
  const props = {};
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  const inline = componentPropertyValue(instance, 'Inline', 'VARIANT');
  const label = componentPropertyValue(instance, 'Label', 'TEXT');
  const hint = componentPropertyValue(instance, 'Helper', 'TEXT');
  const showHelper = componentPropertyValue(instance, 'Show helper', 'BOOLEAN');
  const required = componentPropertyValue(instance, 'Required', 'BOOLEAN');
  const { options, selected } = exportGroupOptions(instance, optionSetName, warnings);

  if (GROUP_SIZES.includes(size) && size !== 'default') props.size = size;
  if (inline === 'True') props.inline = true;
  if (typeof label === 'string' && label) props.label = label;
  if (typeof hint === 'string' && hint && showHelper !== false) props.hint = hint;
  if (required === true) props.required = true;
  if (options.length > 0) props.options = options;
  if (type === 'RadioGroup' && selected.length > 0) props.defaultValue = selected[0];
  if (type === 'CheckboxGroup' && selected.length > 0) props.defaultValue = selected;
  if (selected.length > 0) warnings.push('Option values are derived from visible option labels because the Figma component has no value property.');

  return { node: { id: componentId(type, instance), type, props }, warnings };
}

function exportRadioGroup(instance) {
  return exportLegacyChoiceGroup(instance, 'RadioGroup', 'Radio Option');
}

function exportCheckboxGroup(instance) {
  return exportLegacyChoiceGroup(instance, 'CheckboxGroup', 'Checkbox Option');
}

function exportMenuItem(instance, index, warnings) {
  const type = componentPropertyValue(instance, 'Type', 'VARIANT');
  if (type === 'Divider') return { id: `menu-divider-${index + 1}`, kind: 'divider' };
  const label = componentPropertyValue(instance, 'Label', 'TEXT') || (type === 'Menu Section' ? 'Section' : 'Menu item');
  if (type === 'Menu Section') return { id: `menu-section-${index + 1}`, kind: 'section', label };

  const item = { id: `menu-item-${index + 1}`, kind: 'item', label, icon: '', shortcut: '', destructive: false };
  const state = componentPropertyValue(instance, 'State', 'VARIANT');
  const showIcon = componentPropertyValue(instance, 'Show icon', 'BOOLEAN');
  const showShortcut = componentPropertyValue(instance, 'Show shortcut', 'BOOLEAN');
  if (showIcon === true) {
    const iconName = iconNameFromSwapValue(componentPropertyValue(instance, 'Icon', 'INSTANCE_SWAP'));
    if (iconName) item.icon = iconName;
    else warnings.push(`Menu item "${label}" has an icon that could not be resolved — icon omitted.`);
  }
  if (showShortcut === true) item.shortcut = componentPropertyValue(instance, 'Shortcut', 'TEXT') || '';
  if (state === 'destructive') item.destructive = true;
  if (state === 'active') item.active = true;
  if (state === 'disabled') item.disabled = true;
  if (MENU_ITEM_VISUAL_STATES.includes(state)) {
    warnings.push(`Menu item "${label}" is in a visual-only ${state} state — no state prop was emitted.`);
  }
  return item;
}

function exportMenu(instance) {
  const warnings = [];
  const items = instance
    .findAll((node) => node.type === 'INSTANCE' && componentSetName(node) === 'Menu Item' && node.visible !== false)
    .map((item, index) => exportMenuItem(item, index, warnings));
  const props = { items };
  if (items.length === 0) warnings.push('No visible Menu Item slot instances were found — exported an empty items array.');
  return { node: { id: componentId('Menu', instance), type: 'Menu', props }, warnings };
}

function dialogBodySlot(instance) {
  return nativeSlot(instance, 'Body Slot')
    || nativeSlot(instance, 'Dialog Body Slot')
    || nativeSlot(instance, 'Content Slot')
    || nativeSlot(instance, 'Body')
    || namedSlot(instance, 'Body Slot')
    || namedSlot(instance, 'Dialog Body Slot')
    || namedSlot(instance, 'Content Slot')
    || namedSlot(instance, 'Body')
    || instance.findOne((node) => node.type === 'SLOT' && canonicalKey(node.name) === 'bodyslot');
}

const DIALOG_FOOTER_CONTAINER_KEYS = new Set([
  'footer',
  'footerslot',
  'dialogfooter',
  'dialogfooterslot',
  'footeractions',
  'dialogfooteractions',
  'footerbuttonslot',
  'footerbuttons',
  'actionslot',
  'actionsslots',
]);

function isDialogFooterContainer(node) {
  try {
    if (!node || !['SLOT', 'FRAME', 'GROUP'].includes(node.type)) return false;
    const key = canonicalKey(node.name || '');
    if (DIALOG_FOOTER_CONTAINER_KEYS.has(key)) return true;
    return key.includes('footer') && (key.includes('slot') || key.includes('action') || key.includes('button'));
  } catch {
    return false;
  }
}

function dialogFooterSlot(instance) {
  const live = currentInstance(instance);
  return nativeSlot(live, 'Footer Slot')
    || nativeSlot(live, 'Dialog Footer Slot')
    || nativeSlot(live, 'Footer Actions')
    || nativeSlot(live, 'Footer')
    || namedSlot(live, 'Footer Slot')
    || namedSlot(live, 'Dialog Footer Slot')
    || namedSlot(live, 'Footer Actions')
    || namedSlot(live, 'Footer')
    || live.findOne(isDialogFooterContainer);
}

function isDialogFooterButton(node) {
  try {
    return node.type === 'INSTANCE' && registeredSetName(node) === 'Button' && node.visible !== false;
  } catch {
    return false;
  }
}

function hasDialogFooterAncestor(node, root) {
  for (let parent = node && node.parent; parent; parent = parent.parent) {
    if (parent.id === root.id) return false;
    if (isDialogFooterContainer(parent)) return true;
  }
  return false;
}

function dialogFooterButtons(instance) {
  const live = currentInstance(instance);
  const buttons = [];
  const seen = new Set();
  const addButton = (button) => {
    if (!button || seen.has(button.id)) return;
    seen.add(button.id);
    buttons.push(button);
  };
  const scan = (root) => {
    if (!root) return;
    try {
      if ('children' in root) root.children.filter(isDialogFooterButton).forEach(addButton);
      if ('findAll' in root) root.findAll(isDialogFooterButton).forEach(addButton);
    } catch {
      // Figma can expose stale inherited slot descendants during instance edits.
    }
  };

  scan(dialogFooterSlot(live));
  try {
    live
      .findAll((node) => isDialogFooterButton(node) && hasDialogFooterAncestor(node, live))
      .forEach(addButton);
  } catch {
    // Treat unavailable descendants as no extra buttons.
  }
  return buttons;
}

function dialogSlotBodyText(instance) {
  const slot = dialogBodySlot(instance);
  // Figma's default body child is inherited from the main component and cannot
  // be read reliably through an instance slot. The bridge-created replacement
  // is an editable local TEXT node, so prefer it for a faithful export.
  const replacement = slot && slot.children.find((node) => node.type === 'TEXT' && !node.id.startsWith('I'));
  if (replacement && replacement.type === 'TEXT') return replacement.characters;
  try {
    const text = slot && slot.findOne((node) => node.type === 'TEXT' && node.visible !== false);
    if (text && typeof text.characters === 'string') return text.characters;
  } catch {
    // Slot descendants can be stale immediately after component property edits.
  }
  return namedTextLayerValueAny(instance, ['Body', 'Dialog Body', 'Description', 'Content'], '') || null;
}

function dialogBodyChildren(instance, warnings) {
  const slot = dialogBodySlot(instance);
  if (!slot) {
    warnings.push('Dialog Body Slot was not found — body children were not exported.');
    return [];
  }
  return exportFreeContent(slot, warnings);
}

function dialogBooleanPropertyValue(instance, names) {
  for (const name of names) {
    const value = componentPropertyValue(instance, name, 'BOOLEAN');
    if (typeof value === 'boolean') return value;
  }
  return undefined;
}

function dialogCloseLayerVisible(instance) {
  const live = currentInstance(instance);
  const closeKeys = new Set(['close', 'closebutton', 'closeicon', 'dialogclose', 'dialogclosebutton']);
  try {
    const closeLayer = live.findOne((node) => {
      try {
        if (!node || node.type === 'PAGE') return false;
        const key = canonicalKey(node.name || '');
        if (closeKeys.has(key)) return true;
        if (node.type !== 'INSTANCE') return false;
        const name = canonicalKey(componentSetName(node));
        if (name !== 'iconbutton' && name !== 'button') return false;
        const label = canonicalKey(componentText(node, 'Label', componentText(node, 'Accessible label', '')));
        const icon = canonicalKey(iconNameFromInstance(node) || componentText(node, 'Icon', ''));
        return closeKeys.has(label) || icon === 'close';
      } catch {
        return false;
      }
    });
    return closeLayer ? closeLayer.visible !== false : undefined;
  } catch {
    return undefined;
  }
}

function queueDialogBooleanProperty(instance, assignments, names, value, warnings, description) {
  for (const name of names) {
    if (queueOptionalComponentProperty(instance, assignments, name, value, 'BOOLEAN')) return true;
  }
  warnings.push(`${description} could not be applied — no matching Figma property was found.`);
  return false;
}

function exportDialog(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  const status = componentPropertyValue(instance, 'Status', 'VARIANT');
  const title = componentText(instance, 'Title', namedTextLayerValueAny(instance, ['Title', 'Dialog Title', 'Heading'], '')).trim();
  const bodyChildren = dialogBodyChildren(instance, warnings);
  const body = bodyChildren.length > 0 ? null : (dialogSlotBodyText(instance) || componentText(instance, 'Body', '')).trim();
  const showClose = dialogBooleanPropertyValue(instance, ['Show close', 'Show close button', 'Close button', 'Close']) ?? dialogCloseLayerVisible(instance);
  const showFooter = dialogBooleanPropertyValue(instance, ['Show footer', 'Show footer actions', 'Footer', 'Footer actions']);

  if (DIALOG_SIZES.includes(size) && size !== 'md') props.size = size;
  if (DIALOG_STATUSES.includes(status) && status !== 'none') props.status = status;
  if (title) props.title = title;
  if (body) props.body = body;
  if (showClose === false) props.showClose = false;
  if (showFooter === false) props.showFooter = false;
  const footerActions = dialogFooterButtons(instance)
    .filter((button) => button.visible !== false)
    .map((button) => {
      const result = exportButton(button);
      warnings.push(...result.warnings);
      return result.node;
    });
  if (footerActions.length > 0) props.footerActions = footerActions;
  if (showFooter !== false && footerActions.length === 0) {
    warnings.push('No visible Button instances were found in the Dialog footer slot.');
  }
  if (status && status !== 'none') {
    warnings.push('Figma uses the status default icon; a custom Dialog icon cannot be round-tripped.');
  }
  const node = { id: componentId('Dialog', instance), type: 'Dialog', props };
  if (bodyChildren.length > 0) {
    node.children = bodyChildren;
  }
  return { node, warnings };
}

function isExportableNode(node) {
  if (!node) return false;
  if (registeredSetName(node)) return true;
  if (node.type === 'INSTANCE' && materialIconNameFromInstance(node)) return true;
  if (node.type === 'TEXT' || isStackFrame(node) || isGridFrame(node) || canExportContainer(node)) return true;
  return false;
}

function topmostExportableNode() {
  const selection = figma.currentPage.selection;
  if (selection.length !== 1) return null;
  let topmost = null;
  let node = liveNode(selection[0]);
  const visited = new Set();
  while (node) {
    try {
      if (node.type === 'PAGE') break;
      if (node.id && visited.has(node.id)) break;
      if (node.id) visited.add(node.id);
      if (isExportableNode(node)) topmost = node;
      node = node.parent;
    } catch {
      // The remaining ancestor chain is unavailable until Figma settles.
      break;
    }
  }
  return topmost;
}

function postExportResult({ auto, live, componentName, node, warnings, textReview }) {
  postPluginMessage({
    type: live ? 'live-preview' : 'export-result',
    auto: Boolean(auto),
    componentName,
    json: JSON.stringify(node, null, 2),
    warnings,
    ...(textReview ? { textReview } : {}),
  });
}

function runExport(auto, explicitTarget = null, live = false) {
  const selection = figma.currentPage.selection;
  if (!explicitTarget && selection.length !== 1) {
    if (!auto) postError('Select a single component instance to export.');
    return;
  }
  const target = liveNode(explicitTarget || selection[0]);
  if (!target) {
    if (!auto) postError('The selected layer changed before it could be exported. Select it again and retry.');
    return;
  }
  if (target.type === 'TEXT') {
    const { node, warnings, review } = exportTextNode(target);
    postExportResult({ auto, live, componentName: node.type, node, warnings, textReview: review });
    return;
  }
  if (isStackFrame(target)) {
    const { node, warnings } = exportStack(target);
    postExportResult({ auto, live, componentName: 'Stack', node, warnings });
    return;
  }
  if (isGridFrame(target)) {
    const { node, warnings } = exportGrid(target);
    postExportResult({ auto, live, componentName: 'Grid', node, warnings });
    return;
  }
  if (target.type === 'INSTANCE') {
    // A supported instance may itself contain text and Button slot content.
    // Export its component contract first; only unregistered frame/group
    // selections belong to the generic screen-content path below.
    const componentName = registeredSetName(target);
    if (componentName) {
      const { node, warnings } = EXPORTERS[componentName](target);
      postExportResult({ auto, live, componentName, node, warnings });
      return;
    }
    const iconName = materialIconNameFromInstance(target);
    if (iconName) {
      const { node, warnings } = exportIcon(target);
      postExportResult({ auto, live, componentName: 'Icon', node, warnings });
      return;
    }
  }
  if (canExportContainer(target)) {
    const { node, warnings } = exportContainerNode(target);
    postExportResult({ auto, live, componentName: 'Screen content', node, warnings });
    return;
  }
  if (target.type !== 'INSTANCE') {
    if (!auto) postError(`The selected layer ("${target.name}") is not a component instance or text layer.`);
    return;
  }
  const componentName = registeredSetName(target);
  if (!componentName) {
    const iconName = materialIconNameFromInstance(target);
    if (iconName) {
      const { node, warnings } = exportIcon(target);
      postExportResult({ auto, live, componentName: 'Icon', node, warnings });
      return;
    }
    if (!auto) postError(`The selected component is not supported yet. Supported: ${SUPPORTED_COMPONENT_MESSAGE}.`);
    return;
  }
  const { node, warnings } = EXPORTERS[componentName](target);
  postExportResult({ auto, live, componentName, node, warnings });
}

function figureImageMime(bytes) {
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'image/png';
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes.length >= 6 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return 'image/gif';
  return null;
}

function bytesToBase64(bytes) {
  const chunkSize = 0x8000;
  let binary = '';
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
}

async function sendSelectedFigureImageToPlayground() {
  const selection = figma.currentPage.selection;
  if (selection.length !== 1 || selection[0].type !== 'INSTANCE' || registeredSetName(selection[0]) !== 'Figure') {
    return postError('Select one Figure instance to send its image to the local Preview.');
  }
  const instance = currentInstance(selection[0]);
  const imageLayer = figureImageLayer(instance);
  const paint = imagePaintOn(imageLayer);
  if (!paint || !paint.imageHash) return postError('The selected Figure has no image fill to send.');
  const image = figma.getImageByHash(paint.imageHash);
  if (!image) return postError('The selected Figure image is unavailable.');
  const bytes = await image.getBytesAsync();
  if (bytes.byteLength === 0 || bytes.byteLength > LOCAL_FIGMA_IMAGE_MAX_BYTES) {
    return postError('The selected Figure image must be 4 MB or less for the local handoff.');
  }
  const type = figureImageMime(bytes);
  if (!type) return postError('The selected Figure image must be PNG, JPEG, or GIF for the local handoff.');
  const { node, warnings } = exportFigure(instance);
  const id = `figma_${paint.imageHash.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 96)}`;
  node.props.src = `a1img://${id}`;
  const sourceName = componentText(instance, 'Source', '').trim() || 'Figure image';
  postPluginMessage({
    type: 'figure-image-handoff',
    json: JSON.stringify(node, null, 2),
    asset: { id, name: sourceName.slice(0, 180), type, dataBase64: bytesToBase64(bytes) },
    warnings,
  });
}

// ─── Import: page-definition JSON → Figma instances ─────────────────────────

// Accept a single node, an array of nodes, or a full page definition / project
// bundle. A node with a type is always kept: supported types render as their
// Figma component. If the matching importer/library component is unavailable,
// rendering fails loudly instead of generating a local fallback layer.
// Recursion still stops at component nodes because their importers own their
// slots.
function collectSupportedNodes(value, found) {
  if (Array.isArray(value)) {
    for (const item of value) collectSupportedNodes(item, found);
    return;
  }
  if (!value || typeof value !== 'object') return;
  if (typeof value.type === 'string') {
    // Component nodes are renderable. PageLayout used to be treated only as
    // page schema and flattened, but it now has a real Figma shell component;
    // keep it intact so Render on canvas creates the app frame + content slot.
    found.push(value);
    return;
  }
  for (const key of ['children', 'nodes', 'regions', 'layout', 'page', 'pages', 'definition']) {
    if (value[key]) collectSupportedNodes(value[key], found);
  }
}

function setStackChildrenAlignment(frame, align, warnings) {
  for (const child of stackFlowChildren(frame)) {
    try {
      child.layoutAlign = align === 'stretch' ? 'STRETCH' : 'INHERIT';
    } catch (error) {
      warnings.push(`Could not set Stack child alignment: ${error.message}`);
    }
  }
}

function applyStackGrow(parent, child, sourceNode, warnings) {
  if (!sourceNode || sourceNode.type !== 'Stack' || !sourceNode.props || sourceNode.props.grow !== true) return;
  if (!parent || !['HORIZONTAL', 'VERTICAL'].includes(parent.layoutMode)) {
    warnings.push('Stack grow only applies inside a Figma auto-layout parent.');
    return;
  }
  try {
    child.layoutGrow = 1;
  } catch (error) {
    warnings.push(`Stack grow could not be applied: ${error.message}`);
  }
}

function fillImportedTextWidth(parent, child, sourceNode, warnings) {
  if (!sourceNode || !['Heading', 'Paragraph'].includes(sourceNode.type) || child.type !== 'TEXT') return;
  if (!parent) return;
  try {
    // Text is block content in A1. Stretch handles vertical auto-layout;
    // FILL handles Grid cells; grow is the horizontal-stack equivalent.
    if (parent.layoutMode === 'VERTICAL') {
      child.layoutAlign = 'STRETCH';
      child.layoutSizingHorizontal = 'FILL';
    }
    else if (parent.layoutMode === 'HORIZONTAL') child.layoutGrow = 1;
    // Figma accepts FILL for imported Grid children and resolves it to the
    // flexible track width, so text remains a true block in every layout.
    else if (parent.layoutMode === 'GRID') child.layoutSizingHorizontal = 'FILL';
    else return;
    child.textAutoResize = 'HEIGHT';
  } catch (error) {
    warnings.push(`Imported text could not be set to fill the parent width: ${error.message}`);
  }
}

// ── Fill vs hug sizing contract ──────────────────────────────────────────────
// Formalized in figma-workflow.md ("Sizing convention — fill vs hug"): these
// component types always FILL their container's inline axis when placed in an
// auto-layout or Grid parent. Divider is axis-dependent and handled by its own
// helper below. Everything in HUG_CONTENT_TYPES keeps its natural content size
// — Figma's default for a fresh instance — and must never be stretched.
const FILL_CONTAINER_TYPES = [
  'Stack', 'Grid', 'GridItem', 'Card', 'Banner', 'Blockquote', 'Figure', 'Accordion',
  'TextField', 'SearchField', 'SelectField', 'TextareaField',
  'RadioGroup', 'CheckboxGroup',
  'TopHeader', 'Section', 'MessageEmptyState', 'PageLayout', 'DataTable', 'ChipGroup', 'ChoiceGroup',
  'BottomSheet',
  // Not yet bridged — pre-classified so sizing is correct when importers land.
  'List', 'BottomDrawer', 'PageNav', 'TreeMenu',
  // Code is variant-dependent: block fills, inline hugs (guard below).
  'Code',
];
const HUG_CONTENT_TYPES = new Set([
  'Link', 'Button', 'IconButton', 'MessageBadge', 'Switch',
  'Pagination', 'SegmentedControl', 'Menu', 'DefinitionList',
  'Dialog', 'Tooltip',
  // Not yet bridged — pre-classified. SideNav is a fixed-width rail (280/52).
  'Inline', 'Breadcrumb', 'SideNav',
]);

function fillImportedContainerWidth(parent, child, sourceNode, warnings) {
  if (!sourceNode || HUG_CONTENT_TYPES.has(sourceNode.type)) return;
  if (!FILL_CONTAINER_TYPES.includes(sourceNode.type)) return;
  // Inline Code is a text chip; only the block variant is a filling panel.
  if (sourceNode.type === 'Code' && !(sourceNode.props && sourceNode.props.variant === 'block')) return;
  if (!parent || !['HORIZONTAL', 'VERTICAL', 'GRID'].includes(parent.layoutMode)) return;
  try {
    // Containers are block-level by default. In a Grid, FILL makes an item
    // occupy the available cell width; Figma rejects unsupported cases and
    // the warning preserves the imported layout rather than detaching it.
    if (parent.layoutMode === 'VERTICAL') {
      child.layoutAlign = 'STRETCH';
      child.layoutSizingHorizontal = 'FILL';
    }
    else if (parent.layoutMode === 'HORIZONTAL') child.layoutGrow = 1;
    // Grid children can use FILL after append; Figma resolves that against the
    // flexible track width, which keeps Cards and other block components full.
    else child.layoutSizingHorizontal = 'FILL';
  } catch (error) {
    warnings.push(`Imported ${sourceNode.type} could not be set to fill the parent width: ${error.message}`);
  }
}

function setNodeToFillParentWidth(node, label, warnings) {
  const parent = node && node.parent;
  if (!parent || parent.type === 'PAGE' || !['HORIZONTAL', 'VERTICAL', 'GRID'].includes(parent.layoutMode)) return;
  try {
    if (parent.layoutMode === 'VERTICAL') {
      node.layoutAlign = 'STRETCH';
      node.layoutSizingHorizontal = 'FILL';
    } else if (parent.layoutMode === 'HORIZONTAL') {
      node.layoutGrow = 1;
    } else {
      node.layoutSizingHorizontal = 'FILL';
    }
  } catch (error) {
    warnings.push(`${label || 'Converted component'} could not be set to fill the parent width: ${error.message}`);
  }
}

function fillImportedStackWidth(parent, child, sourceNode, warnings) {
  if (!sourceNode || sourceNode.type !== 'Stack' || child.type !== 'FRAME') return;
  if (!parent || !['HORIZONTAL', 'VERTICAL'].includes(parent.layoutMode)) return;
  try {
    // A1 Stacks are block-level layout primitives. In a vertical auto-layout,
    // stretch is Figma's Fill-container width. In a horizontal one, grow fills
    // the primary (width) axis instead.
    if (parent.layoutMode === 'VERTICAL') child.layoutAlign = 'STRETCH';
    else child.layoutGrow = 1;
  } catch (error) {
    warnings.push(`Imported Stack could not be set to fill the parent width: ${error.message}`);
  }
}

function fillImportedGridWidth(parent, child, sourceNode, warnings) {
  if (!sourceNode || sourceNode.type !== 'Grid' || child.type !== 'FRAME') return;
  if (!parent || !['HORIZONTAL', 'VERTICAL'].includes(parent.layoutMode)) return;
  try {
    if (parent.layoutMode === 'VERTICAL') child.layoutAlign = 'STRETCH';
    else child.layoutGrow = 1;
  } catch (error) {
    warnings.push(`Imported Grid could not be set to fill the parent width: ${error.message}`);
  }
}

function applyImportedGridItemSpan(parent, child, sourceNode, warnings) {
  if (!sourceNode || sourceNode.type !== 'GridItem') return;
  if (!parent || parent.layoutMode !== 'GRID') {
    warnings.push('GridItem span only applies when it is a direct child of an A1 Grid.');
    return;
  }
  const props = sourceNode.props || {};
  const breakpoint = breakpointForNode(parent);
  const columnCount = Number(parent.gridColumnCount);
  const span = responsiveGridItemSpanAt(props.span, breakpoint, Number.isInteger(columnCount) ? columnCount : null);
  const rowSpan = responsiveGridItemSpanAt(props.rowSpan, breakpoint);
  try {
    if (span !== null) child.gridColumnSpan = Math.max(1, Math.min(span, Number.isInteger(columnCount) && columnCount > 0 ? columnCount : span));
    if (rowSpan !== null) child.gridRowSpan = Math.max(1, rowSpan);
    child.layoutSizingHorizontal = 'FILL';
    if (child.type === 'TEXT') child.textAutoResize = 'HEIGHT';
  } catch (error) {
    warnings.push(`GridItem span could not be applied in Figma: ${error.message}`);
  }
}

function fillImportedButtonContainerWidth(parent, child, sourceNode, warnings) {
  if (!sourceNode || sourceNode.type !== 'ButtonContainer' || child.type !== 'INSTANCE') return;
  if (!parent || !['HORIZONTAL', 'VERTICAL'].includes(parent.layoutMode)) return;
  try {
    // Button Containers occupy the available layout width; their own alignment
    // still controls where the contained buttons sit inside that width.
    if (parent.layoutMode === 'VERTICAL') child.layoutAlign = 'STRETCH';
    else child.layoutGrow = 1;
  } catch (error) {
    warnings.push(`Imported Button Container could not be set to fill the parent width: ${error.message}`);
  }
}

function fillImportedDividerAxis(parent, child, sourceNode, warnings) {
  // A Divider fills along its own orientation: a horizontal rule fills the
  // available width; a vertical rule fills the available height of a row.
  if (!sourceNode || sourceNode.type !== 'Divider') return;
  if (!parent || !['HORIZONTAL', 'VERTICAL', 'GRID'].includes(parent.layoutMode)) return;
  const orientation = sourceNode.props && sourceNode.props.orientation === 'vertical' ? 'vertical' : 'horizontal';
  try {
    if (orientation === 'horizontal') {
      if (parent.layoutMode === 'VERTICAL') {
        child.layoutAlign = 'STRETCH';
        child.layoutSizingHorizontal = 'FILL';
      } else if (parent.layoutMode === 'HORIZONTAL') child.layoutGrow = 1;
      else child.layoutSizingHorizontal = 'FILL';
    } else if (parent.layoutMode === 'HORIZONTAL') {
      // Vertical divider in a row: stretch to the row height.
      child.layoutAlign = 'STRETCH';
    } else if (parent.layoutMode === 'GRID') {
      child.layoutSizingVertical = 'FILL';
    }
    // A vertical divider in a vertical stack keeps its natural height.
  } catch (error) {
    warnings.push(`Imported Divider could not be set to fill its ${orientation === 'vertical' ? 'height' : 'width'}: ${error.message}`);
  }
}

function appendImportedChild(parent, child, sourceNode, warnings) {
  parent.appendChild(child);
  fillImportedTextWidth(parent, child, sourceNode, warnings);
  fillImportedContainerWidth(parent, child, sourceNode, warnings);
  fillImportedStackWidth(parent, child, sourceNode, warnings);
  fillImportedGridWidth(parent, child, sourceNode, warnings);
  fillImportedButtonContainerWidth(parent, child, sourceNode, warnings);
  fillImportedDividerAxis(parent, child, sourceNode, warnings);
  applyImportedGridItemSpan(parent, child, sourceNode, warnings);
  applyStackGrow(parent, child, sourceNode, warnings);
}

async function renderImportedNode(node, warnings) {
  const importer = IMPORTERS[node.type];
  if (!importer) {
    throw new Error(`No Figma importer exists for A1 component type "${node.type}".`);
  }
  let layer;
  try {
    layer = await importer(node, warnings);
  } catch (error) {
    throw new Error(`"${node.type}" could not be created from the current Figma library: ${error.message}`);
  }
  // JSON ids are stable authoring identifiers. Showing them in Figma's layer
  // list makes rendered compositions traceable and makes updates unambiguous.
  if (typeof node.id === 'string' && node.id.trim()) {
    layer.name = node.id;
    if (typeof layer.setPluginData === 'function') layer.setPluginData('a1-json-id', node.id);
  }
  if (node.type === 'Grid') {
    const responsiveColumns = normalizeResponsiveColumns(node.props && node.props.columns);
    if (responsiveColumns) syncResponsiveGridColumnsMetadata(layer, responsiveColumns);
  }
  return layer;
}

async function applyStack(frame, node, warnings) {
  const props = node.props || {};
  const direction = staticStackValue(props.direction, STACK_DIRECTIONS, 'column', 'direction', warnings);
  const align = staticStackValue(props.align, STACK_ALIGNS, 'stretch', 'align', warnings);
  const justify = staticStackValue(props.justify, STACK_JUSTIFIES, 'start', 'justify', warnings);
  const gap = stackGapToFigma(props.gap === undefined ? 16 : props.gap, warnings);
  const wrap = props.wrap === true;

  frame.layoutMode = direction === 'row' || direction === 'row-reverse' ? 'HORIZONTAL' : 'VERTICAL';
  await bindGapProperty(frame, 'itemSpacing', gap, warnings, 'Stack item spacing');
  frame.primaryAxisAlignItems = STACK_JUSTIFY_TO_FIGMA[justify] || 'MIN';
  // Figma has no parent-level STRETCH enum. It represents stretch through
  // each child plus a fixed cross axis on the frame.
  frame.counterAxisAlignItems = align === 'stretch' ? 'MIN' : (STACK_ALIGN_TO_FIGMA[align] || 'MIN');

  if (align === 'stretch') {
    try {
      frame.counterAxisSizingMode = 'FIXED';
    } catch (error) {
      warnings.push(`Stack stretch could not fix the cross axis: ${error.message}`);
    }
  } else {
    try {
      frame.counterAxisSizingMode = 'AUTO';
    } catch (error) {
      warnings.push(`Stack cross-axis sizing could not be applied: ${error.message}`);
    }
  }
  frame.primaryAxisSizingMode = 'AUTO';
  // Stacks should remain content-driven vertically. This explicit modern
  // sizing value also covers horizontal stacks, where height is the cross axis.
  try {
    frame.layoutSizingVertical = 'HUG';
  } catch (error) {
    warnings.push(`Stack height could not be set to Hug contents: ${error.message}`);
  }
  setStackChildrenAlignment(frame, align, warnings);

  if (wrap && frame.layoutMode === 'HORIZONTAL') {
    frame.layoutWrap = 'WRAP';
    await bindGapProperty(frame, 'counterAxisSpacing', gap, warnings, 'Stack wrap row spacing');
  } else {
    frame.layoutWrap = 'NO_WRAP';
    if (wrap) warnings.push('Stack wrap is only representable by horizontal Figma auto layout; it was omitted for this direction.');
  }

  if (direction === 'row-reverse' || direction === 'column-reverse') {
    warnings.push(`direction="${direction}" has no Figma auto-layout equivalent; ${direction.replace('-reverse', '')} was used.`);
  }
  if (justify === 'around' || justify === 'evenly') {
    warnings.push(`justify="${justify}" has no Figma auto-layout equivalent; ${justify === 'evenly' ? 'between' : 'center'} was used.`);
    frame.primaryAxisAlignItems = justify === 'evenly' ? 'SPACE_BETWEEN' : 'CENTER';
  }
  return { align, wrap, direction };
}

async function importStack(node, warnings) {
  const frame = figma.createFrame();
  frame.name = 'Stack';
  frame.fills = [];
  frame.clipsContent = false;
  const { align } = await applyStack(frame, node, warnings);
  syncStackPropsName(frame);

  const children = [];
  collectSupportedNodes(node.children || [], children);
  if ((node.children || []).some((child) => child && typeof child === 'object' && child.type && !IMPORTERS[child.type])) {
    warnings.push('Unsupported Stack child types were not rendered.');
  }
  for (const childNode of children) {
    const child = await renderImportedNode(childNode, warnings);
    appendImportedChild(frame, child, childNode, warnings);
  }
  setStackChildrenAlignment(frame, align, warnings);
  return frame;
}

function gridGapToFigma(value, property, warnings) {
  const gap = stackGapToFigma(value, warnings);
  if (!(typeof value === 'string' && STACK_SEMANTIC_GAPS[value] !== undefined) && !STACK_GAPS.includes(value)) {
    warnings[warnings.length - 1] = `${property}=${JSON.stringify(value)} is not in the A1 Grid spacing scale — 16 was used.`;
  }
  return gap;
}

async function applyGrid(frame, node, warnings) {
  const props = node.props || {};
  const responsiveColumns = normalizeResponsiveColumns(props.columns);
  const previewBreakpoint = responsiveColumns
    ? breakpointForNode(frame)
    : 'lg';
  const requestedColumns = responsiveColumns
    ? responsiveColumnsAt(responsiveColumns, previewBreakpoint)
    : props.columns;
  const columns = Number.isInteger(requestedColumns) && requestedColumns > 0 ? requestedColumns : 1;
  const defaultGap = props.gap === undefined ? 16 : gridGapToFigma(props.gap, 'gap', warnings);
  const rowGap = props.rowGap === undefined ? defaultGap : gridGapToFigma(props.rowGap, 'rowGap', warnings);
  const columnGap = props.columnGap === undefined ? defaultGap : gridGapToFigma(props.columnGap, 'columnGap', warnings);
  const align = staticStackValue(props.alignItems, ['stretch', 'start', 'center', 'end'], 'stretch', 'alignItems', warnings);

  if (requestedColumns !== undefined && columns === 1 && (!Number.isInteger(requestedColumns) || requestedColumns < 1)) {
    warnings.push(`Grid columns=${JSON.stringify(props.columns)} is not supported by Figma — 1 was used.`);
  }
  if (responsiveColumns) {
    syncResponsiveGridColumnsMetadata(frame, responsiveColumns);
    frame.setPluginData(A1_BREAKPOINT_KEY, previewBreakpoint);
    warnings.push(`Responsive Grid columns were rendered at the ${previewBreakpoint} preview (${columns} column${columns === 1 ? '' : 's'}); the full sparse columns object is stored on the frame for export.`);
  } else {
    frame.setPluginData(GRID_RESPONSIVE_COLUMNS_KEY, '');
    frame.setPluginData(A1_BREAKPOINT_KEY, '');
  }
  frame.layoutMode = 'GRID';
  frame.gridAutoTracks = 'ROWS';
  frame.gridItemsPositioning = 'ROW_AUTO_FLOW';
  frame.gridColumnCount = columns;
  await bindGapProperty(frame, 'gridRowGap', rowGap, warnings, 'Grid row gap');
  await bindGapProperty(frame, 'gridColumnGap', columnGap, warnings, 'Grid column gap');
  // Grid columns are flexible fractions by default, matching a full-width
  // A1 Grid once its parent assigns the frame available width.
  frame.gridColumnSizes.forEach((track) => {
    track.type = 'FLEX';
    track.value = 1;
  });
  frame.counterAxisAlignItems = align === 'stretch' ? 'MIN' : (STACK_ALIGN_TO_FIGMA[align] || 'MIN');
  try {
    frame.layoutSizingVertical = 'HUG';
  } catch (error) {
    warnings.push(`Grid height could not be set to Hug contents: ${error.message}`);
  }
  if (props.layout && props.layout !== 'default') warnings.push(`Grid layout="${props.layout}" has no dedicated Figma Grid representation.`);
  if (props.autoRows) warnings.push('Grid autoRows has no portable Figma representation.');
}

async function importGrid(node, warnings) {
  const frame = figma.createFrame();
  frame.name = 'Grid';
  frame.fills = [];
  frame.clipsContent = false;
  await applyGrid(frame, node, warnings);

  const children = [];
  collectSupportedNodes(node.children || [], children);
  if ((node.children || []).some((child) => child && typeof child === 'object' && child.type && !IMPORTERS[child.type])) {
    warnings.push('Unsupported Grid child types were not rendered.');
  }
  for (const childNode of children) {
    const child = await renderImportedNode(childNode, warnings);
    appendImportedChild(frame, child, childNode, warnings);
  }
  return frame;
}

async function importGridItem(node, warnings) {
  const frame = figma.createFrame();
  frame.name = 'Grid Item';
  frame.fills = [];
  frame.clipsContent = false;
  frame.setPluginData('a1-json-type', 'GridItem');
  frame.setSharedPluginData(DETACHED_COMPONENT_NAMESPACE, DETACHED_COMPONENT_KEY, 'GridItem');
  await applyStack(frame, { props: { direction: 'column', gap: 'md', align: 'stretch' } }, warnings);

  const children = [];
  collectSupportedNodes(node.children || [], children);
  if ((node.children || []).some((child) => child && typeof child === 'object' && child.type && !IMPORTERS[child.type])) {
    warnings.push('Unsupported GridItem child types were not rendered.');
  }
  for (const childNode of children) {
    const child = await renderImportedNode(childNode, warnings);
    appendImportedChild(frame, child, childNode, warnings);
  }
  return frame;
}

function findButtonSet() {
  const byId = figma.getNodeById(BUTTON_SET_ID);
  if (byId && byId.type === 'COMPONENT_SET' && byId.name === 'Button') return byId;
  return findComponentSet('Button');
}

// Apply a Button node's props to an existing Button instance (used both when
// rendering a new instance and when updating the current selection).
async function applyButton(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const raw = instance.componentProperties || {};
  const keyFor = (prefix) => Object.keys(raw).find((key) => plainKey(key) === prefix);
  const assignments = {};

  const variantKey = keyFor('Variant');
  if (variantKey) assignments[variantKey] = BUTTON_VARIANTS.includes(props.variant) ? props.variant : 'primary';
  const sizeKey = keyFor('Size');
  if (sizeKey) assignments[sizeKey] = BUTTON_SIZES.includes(props.size) ? props.size : 'md';
  const stateKey = keyFor('State');
  if (stateKey) assignments[stateKey] = props.disabled === true ? 'disabled' : props.loading === true ? 'loading' : 'default';
  const positionKey = keyFor('IconPosition');
  if (positionKey) assignments[positionKey] = props.iconPosition === 'end' ? 'end' : 'start';

  const labelKey = keyFor('Label');
  if (labelKey && node.content && typeof node.content.fallback === 'string') {
    assignments[labelKey] = node.content.fallback;
  }
  const showIconKey = keyFor('Show icon');
  if (showIconKey) assignments[showIconKey] = typeof props.icon === 'string' && props.icon.length > 0;
  const iconKey = keyFor('Icon');
  if (iconKey && typeof props.icon === 'string' && props.icon.length > 0) {
    const iconComponent = findIconComponent(props.icon);
    if (iconComponent) assignments[iconKey] = iconComponent.id;
    else warnings.push(`No icon component named "${props.icon}" exists in this file — the default glyph is shown.`);
  }
  if (Object.keys(assignments).length > 0) instance.setProperties(assignments);

  for (const runtimeProp of ['fullWidth', 'href', 'as']) {
    if (props[runtimeProp] !== undefined) {
      warnings.push(`"${runtimeProp}" is a runtime prop with no Figma representation — ignored.`);
    }
  }
}

async function importButton(node, warnings) {
  const instance = await createComponentInstance('Button', warnings);
  await applyButton(instance, node, warnings);
  return instance;
}

async function applyIconButton(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const assignments = {};
  const variant = ICON_BUTTON_VARIANTS.includes(props.variant) ? props.variant : 'tertiary';
  const size = ICON_BUTTON_SIZES.includes(props.size) ? props.size : 'md';
  const iconName = typeof props.icon === 'string' && props.icon.trim() ? props.icon.trim() : null;
  const label = typeof props.label === 'string' && props.label.trim() ? props.label : 'Icon button';

  queueComponentProperty(instance, assignments, 'Variant', variant, 'VARIANT', warnings, 'Icon Button variant');
  queueComponentProperty(instance, assignments, 'Size', size, 'VARIANT', warnings, 'Icon Button size');
  queueComponentProperty(instance, assignments, 'Aria label', label, 'TEXT', warnings, 'Icon Button accessible label');
  if (iconName) {
    const icon = findIconComponent(iconName);
    if (icon) queueComponentProperty(instance, assignments, 'Icon', icon.id, 'INSTANCE_SWAP', warnings, 'Icon Button icon');
    else warnings.push(`No Material icon component named "${iconName}" exists in this file — the default Icon Button glyph was retained.`);
  } else {
    warnings.push('Icon Button requires an "icon" prop; the default Figma glyph was retained.');
  }
  applyQueuedProperties(instance, assignments, warnings, 'Icon Button properties');

  for (const runtimeProp of ['disabled', 'as', 'href', 'target', 'rel', 'onClick', 'className', 'id']) {
    if (props[runtimeProp] !== undefined) {
      warnings.push(`"${runtimeProp}" is a runtime prop with no Figma representation — ignored.`);
    }
  }
}

async function importIconButton(node, warnings) {
  const instance = await createComponentInstance('Icon Button', warnings);
  await applyIconButton(instance, node, warnings);
  return instance;
}

async function applyLink(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const assignments = {};
  const size = LINK_SIZES.includes(props.size) ? props.size : 'md';
  const weight = LINK_WEIGHTS.includes(props.weight) ? props.weight : 'normal';
  const iconPosition = LINK_ICON_POSITIONS.includes(props.iconPosition) ? props.iconPosition : 'start';
  const iconName = typeof props.icon === 'string' && props.icon.trim() ? props.icon.trim() : null;

  queueComponentProperty(instance, assignments, 'Size', size, 'VARIANT', warnings, 'Link size');
  queueComponentProperty(instance, assignments, 'Weight', weight, 'VARIANT', warnings, 'Link weight');
  queueComponentProperty(instance, assignments, 'Icon position', iconPosition, 'VARIANT', warnings, 'Link icon position');
  queueComponentProperty(instance, assignments, 'Show icon', Boolean(iconName), 'BOOLEAN', warnings, 'Link icon visibility');
  if (node.content && typeof node.content.fallback === 'string') {
    queueComponentProperty(instance, assignments, 'Label', node.content.fallback, 'TEXT', warnings, 'Link label');
  }
  if (iconName) {
    const icon = findIconComponent(iconName);
    if (icon) queueComponentProperty(instance, assignments, 'Icon', icon.id, 'INSTANCE_SWAP', warnings, 'Link icon');
    else warnings.push(`No Material icon component named "${iconName}" exists in this file — the default Link glyph was retained.`);
  }
  applyQueuedProperties(instance, assignments, warnings, 'Link properties');

  for (const runtimeProp of ['href', 'target', 'rel', 'as', 'onClick', 'className', 'id']) {
    if (props[runtimeProp] !== undefined) {
      warnings.push(`"${runtimeProp}" is a runtime prop with no Figma representation — ignored.`);
    }
  }
}

async function importLink(node, warnings) {
  const instance = await createComponentInstance('Link', warnings);
  await applyLink(instance, node, warnings);
  return instance;
}

function breadcrumbTextLayers(instance) {
  const live = currentInstance(instance);
  try {
    return live.findAll((node) => {
      if (node.type !== 'TEXT' || node.visible === false) return false;
      const name = canonicalKey(node.name || '');
      return !/(icon|chevron|separator|slash)/.test(name);
    });
  } catch {
    return [];
  }
}

function breadcrumbTextValues(instance) {
  const labels = [];
  try {
    for (const text of breadcrumbTextLayers(instance)) {
      const value = typeof text.characters === 'string' ? text.characters.trim() : '';
      if (!value) continue;
      if (labels.includes(value)) continue;
      labels.push(value);
    }
  } catch {
    // Stale nested handles can happen immediately after an instance swap.
  }
  return labels;
}

function exportBreadcrumb(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  const backLabel = componentText(instance, 'Back label', componentText(instance, 'Back Label', '')).trim();
  if (backLabel) props.backLabel = backLabel;

  const labels = [];
  for (let index = 1; index <= 8; index += 1) {
    const label = componentText(instance, `Item ${index}`, componentText(instance, `Label ${index}`, '')).trim();
    if (label) labels.push(label);
  }
  if (labels.length === 0) labels.push(...breadcrumbTextValues(instance));
  const filtered = labels.filter((label) => label && label !== backLabel);
  if (filtered.length > 0) {
    const usedIds = new Set();
    props.items = filtered.map((label, index) => {
      const item = {
        id: slugifyOptionValue(label, usedIds),
        label,
      };
      if (index < filtered.length - 1) item.href = '#';
      return item;
    });
  } else {
    warnings.push('Breadcrumb item labels could not be resolved from component properties or visible text layers.');
  }

  return { node: { id: componentId('Breadcrumb', instance), type: 'Breadcrumb', props }, warnings };
}

async function applyBreadcrumb(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const rawItems = Array.isArray(props.items) ? props.items : [];
  const items = rawItems
    .map((item, index) => ({
      id: typeof item.id === 'string' && item.id ? item.id : `item-${index + 1}`,
      label: typeof item.label === 'string' && item.label ? item.label : `Item ${index + 1}`,
      href: typeof item.href === 'string' ? item.href : undefined,
    }))
    .slice(0, 8);
  const assignments = {};
  const fallbackTextLayers = breadcrumbTextLayers(instance);
  if (typeof props.backLabel === 'string') {
    queueOptionalComponentProperty(instance, assignments, 'Back label', props.backLabel, 'TEXT')
      || queueOptionalComponentProperty(instance, assignments, 'Back Label', props.backLabel, 'TEXT');
  }
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const position = index + 1;
    const applied = queueOptionalComponentProperty(instance, assignments, `Item ${position}`, item.label, 'TEXT')
      || queueOptionalComponentProperty(instance, assignments, `Label ${position}`, item.label, 'TEXT');
    if (!applied) {
      // Fall back to ordered visible text layers for simpler Breadcrumb assets.
      const text = fallbackTextLayers[index];
      if (text) {
        try {
          if (text.fontName !== figma.mixed) await figma.loadFontAsync(text.fontName);
          text.characters = item.label;
        } catch (error) {
          warnings.push(`Breadcrumb item ${position} text layer could not be updated: ${error.message}`);
        }
      } else {
        await writeNamedText(instance, `Item ${position}`, item.label, warnings, `Breadcrumb item ${position}`);
      }
    }
  }
  applyQueuedProperties(instance, assignments, warnings, 'Breadcrumb properties');
  for (const item of items) {
    if (item.href) warnings.push(`Breadcrumb href for "${item.label}" is runtime navigation — not represented in Figma.`);
  }
}

async function importBreadcrumb(node, warnings) {
  const instance = await createComponentInstance('Breadcrumb', warnings);
  await applyBreadcrumb(instance, node, warnings);
  return instance;
}

async function createComponentInstance(name, warnings) {
  const source = await findComponentSourceAsync(name, warnings);
  if (!source) throw new Error(`No "${name}" component was found. The plugin tried local A1 components, the built-in A1 library key registry, and enabled Figma libraries. Confirm the A1 Design System library is enabled for this file, or update the checked-in registry if the published component key changed.`);
  return source.createInstance();
}

function supportedChildren(children, warnings, owner) {
  const collected = [];
  collectSupportedNodes(children || [], collected);
  if ((children || []).some((child) => child && typeof child === 'object' && child.type && !IMPORTERS[child.type])) {
    warnings.push(`${owner} contains unsupported child types; those children will not render.`);
  }
  return collected;
}

async function replaceNativeSlotChildren(instance, slotName, children, warnings, owner) {
  const expected = supportedChildren(children, warnings, owner);
  let slot = namedSlot(currentInstance(instance), slotName);
  if (!slot) {
    warnings.push(`${owner} ${slotName} was not found — children were not rendered.`);
    return;
  }
  for (const child of [...slot.children]) {
    try {
      child.remove();
    } catch (error) {
      try {
        child.visible = false;
      } catch (visibilityError) {
        warnings.push(`${owner} slot placeholder could not be cleared: ${visibilityError.message}`);
      }
    }
  }
  for (const childNode of expected) {
    const child = await renderImportedNode(childNode, warnings);
    slot = namedSlot(currentInstance(instance), slotName);
    if (!slot) {
      warnings.push(`${owner} ${slotName} could not be refreshed — remaining children were not rendered.`);
      return;
    }
    appendImportedChild(slot, child, childNode, warnings);
  }
}

async function applyCard(instance, node, warnings) {
  const props = node.props || {};
  const assignments = {};
  const surface = CARD_SURFACES.includes(props.surface) ? props.surface : 'default';
  queueComponentProperty(instance, assignments, 'Surface', surface, 'VARIANT', warnings, 'Card surface');
  const iconName = typeof props.icon === 'string' && props.icon.length > 0 ? props.icon : null;
  const showIcon = Boolean(iconName) && props.iconDisplay !== 'none';
  queueComponentProperty(instance, assignments, 'Show icon', showIcon, 'BOOLEAN', warnings, 'Card icon visibility');
  if (showIcon) {
    const icon = findIconComponent(iconName);
    if (icon) queueComponentProperty(instance, assignments, 'Icon', icon.id, 'INSTANCE_SWAP', warnings, 'Card icon');
    else warnings.push(`No icon component named "${iconName}" exists in this file — the Card icon was not swapped.`);
  }
  applyQueuedProperties(instance, assignments, warnings, 'Card properties');
  if (props.iconDisplay && props.iconDisplay !== 'default' && props.iconDisplay !== 'none') {
    warnings.push(`Card iconDisplay="${props.iconDisplay}" has no compact Figma representation; the inline icon was used.`);
  }
}

async function importCard(node, warnings) {
  const instance = await createComponentInstance('Card', warnings);
  await applyCard(instance, node, warnings);
  await replaceNativeSlotChildren(instance, 'Content Slot', node.children, warnings, 'Card');
  return instance;
}

function bannerSlotChildren(node) {
  if (Array.isArray(node.children)) return node.children;
  const fallback = node && node.content && typeof node.content.fallback === 'string'
    ? node.content.fallback.trim()
    : '';
  return fallback
    ? [{ id: `${node.id || 'banner'}-content`, type: 'Paragraph', props: { size: 'sm', color: 'muted' }, content: { fallback } }]
    : [];
}

function calendarDateParts(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return { month: value.month == null ? '' : String(value.month), day: value.day == null ? '' : String(value.day) };
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return {
        month: parsed.toLocaleString('en-US', { month: 'short' }),
        day: String(parsed.getDate()),
      };
    }
  }
  return null;
}

async function applyBanner(instance, node, warnings) {
  if (instance.type !== 'INSTANCE') {
    warnings.push('This Banner was detached to host editable Content Slot children; rerender it to apply variant or status changes.');
    return;
  }
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const assignments = {};
  const variant = BANNER_VARIANTS.includes(props.variant) ? props.variant : 'inline';
  const status = BANNER_STATUSES.includes(props.status) ? props.status : 'neutral';
  queueComponentProperty(instance, assignments, 'Variant', variant, 'VARIANT', warnings, 'Banner variant');
  queueComponentProperty(instance, assignments, 'Status', status, 'VARIANT', warnings, 'Banner status');
  if (typeof props.title === 'string') queueComponentProperty(instance, assignments, 'Title', props.title, 'TEXT', warnings, 'Banner title');
  if (variant === 'calendar') {
    if (typeof props.eyebrow === 'string') queueComponentProperty(instance, assignments, 'Eyebrow', props.eyebrow, 'TEXT', warnings, 'Banner eyebrow');
    const date = calendarDateParts(props.date);
    if (date) {
      queueComponentProperty(instance, assignments, 'Month', date.month, 'TEXT', warnings, 'Banner month');
      queueComponentProperty(instance, assignments, 'Day', date.day, 'TEXT', warnings, 'Banner day');
    } else if (props.date !== undefined) {
      warnings.push('Banner date must be an ISO date string or { month, day }; the calendar date was not updated.');
    }
  }
  applyQueuedProperties(instance, assignments, warnings, 'Banner properties');
  for (const runtimeProp of ['icon', 'action', 'onDismiss']) {
    if (props[runtimeProp] !== undefined) warnings.push(`Banner "${runtimeProp}" is runtime-only and was not applied in Figma.`);
  }
}

async function importBanner(node, warnings) {
  const instance = await createComponentInstance('Banner', warnings);
  await applyBanner(instance, node, warnings);
  const children = bannerSlotChildren(node);
  const hasExplicitContent = Array.isArray(node.children)
    || Boolean(node && node.content && typeof node.content.fallback === 'string' && node.content.fallback.trim());
  if (!hasExplicitContent) return instance;

  // Figma's plugin API cannot author native Slot nodes, and it rejects child
  // insertion into an ordinary frame inside an instance. Preserve the fully
  // configured Banner visual by detaching only when JSON actually supplies
  // editable slot content, then tag the frame so future exports retain its
  // Banner identity and prop contract.
  const detached = instance.detachInstance();
  detached.setSharedPluginData(DETACHED_COMPONENT_NAMESPACE, DETACHED_COMPONENT_KEY, 'Banner');
  detached.setSharedPluginData(DETACHED_COMPONENT_NAMESPACE, DETACHED_BANNER_PROPS_KEY, JSON.stringify(node.props || {}));
  await replaceNativeSlotChildren(detached, 'Content Slot', children, warnings, 'Banner');
  warnings.push('Banner was detached to render editable Content Slot children; rerender it to change visual Banner props.');
  return detached;
}

async function applyBadge(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const assignments = {};
  const status = BADGE_STATUSES.includes(props.status) ? props.status : 'neutral';
  queueComponentProperty(instance, assignments, 'Status', status, 'VARIANT', warnings, 'Badge status');
  queueComponentProperty(instance, assignments, 'Subtle', props.subtle === true ? 'true' : 'false', 'VARIANT', warnings, 'Badge subtle');
  const size = BADGE_SIZES.includes(props.size) ? props.size : 'md';
  queueComponentProperty(instance, assignments, 'Size', size, 'VARIANT', warnings, 'Badge size');
  const hasIconProp = Object.prototype.hasOwnProperty.call(props, 'icon');
  const iconName = typeof props.icon === 'string' && props.icon.length > 0
    ? props.icon
    : BADGE_DEFAULT_ICONS[status];
  queueComponentProperty(instance, assignments, 'Show icon', props.icon !== null, 'BOOLEAN', warnings, 'Badge icon visibility');
  if (node.content && typeof node.content.fallback === 'string') {
    queueComponentProperty(instance, assignments, 'Label', node.content.fallback, 'TEXT', warnings, 'Badge label');
  }
  applyQueuedProperties(instance, assignments, warnings, 'Badge properties');
  if (props.icon !== null) {
    const materialIcon = findIconComponent(iconName);
    const liveInstance = currentInstance(instance);
    const icon = liveInstance.findOne((child) => child.type === 'INSTANCE' && child.name === 'Icon');
    if (!materialIcon) {
      if (hasIconProp) warnings.push(`No Material icon component named "${iconName}" exists in this file — the Badge default icon was kept.`);
    } else if (!icon) {
      warnings.push('Badge Material icon could not be updated because the nested Icon instance was not found.');
    } else {
      try {
        icon.swapComponent(materialIcon);
      } catch (error) {
        warnings.push(`Badge Material icon could not be swapped: ${error.message}`);
      }
    }
  }
  if (props.size !== undefined && !BADGE_SIZES.includes(props.size)) warnings.push(`Badge size="${props.size}" is not available in Figma; md was used.`);
}

async function importBadge(node, warnings) {
  const instance = await createComponentInstance('Badge', warnings);
  await applyBadge(instance, node, warnings);
  return instance;
}

function iconSizeFromNode(node) {
  const pixels = Math.max(figmaNumber(node && node.width, 0), figmaNumber(node && node.height, 0));
  if (!pixels) return '';
  let best = 'md';
  let delta = Infinity;
  for (const [size, value] of Object.entries(ICON_SIZE_PIXELS)) {
    const next = Math.abs(pixels - value);
    if (next < delta) {
      best = size;
      delta = next;
    }
  }
  return best;
}

function applyIconSize(instance, size, warnings) {
  if (!ICON_SIZES.includes(size) || size === 'md') return;
  const pixels = ICON_SIZE_PIXELS[size];
  if (!pixels) return;
  try {
    instance.resize(pixels, pixels);
  } catch (error) {
    warnings.push(`Icon size="${size}" could not be applied in Figma: ${error.message}`);
  }
}

function exportIcon(instance) {
  const name = materialIconNameFromInstance(instance);
  const warnings = [];
  if (!name) warnings.push('The selected icon could not be resolved to a Material Symbols name.');
  const props = { name: name || 'star' };
  const size = iconSizeFromNode(instance);
  if (ICON_SIZES.includes(size) && size !== 'md') props.size = size;
  return {
    node: { id: componentId('Icon', instance), type: 'Icon', props },
    warnings,
  };
}

async function applyIcon(instance, node, warnings) {
  const props = node.props || {};
  const name = materialIconNameCandidate(props.name) || 'star';
  const source = await findMaterialIconComponentAsync(name, warnings);
  if (!source) {
    warnings.push(`No Material icon component named "${name}" was found in the A1 library or current file.`);
    return instance;
  }
  try {
    if (instance.mainComponent && instance.mainComponent.id !== source.id) instance.swapComponent(source);
  } catch (error) {
    warnings.push(`Icon could not be swapped to "${name}": ${error.message}`);
  }
  applyIconSize(currentInstance(instance), props.size, warnings);
  for (const prop of ['color', 'fill', 'weight', 'grade', 'opticalSize']) {
    if (props[prop] !== undefined) warnings.push(`Icon ${prop} is runtime-owned for raw Material icon instances and was not applied in Figma.`);
  }
  return currentInstance(instance);
}

async function importIcon(node, warnings) {
  const props = node.props || {};
  const name = materialIconNameCandidate(props.name) || 'star';
  const source = await findMaterialIconComponentAsync(name, warnings);
  if (!source) throw new Error(`No Material icon component named "${name}" was found in the A1 library or current file.`);
  const instance = source.createInstance();
  await applyIcon(instance, node, warnings);
  return instance;
}

function imagePaintOn(node) {
  try {
    return Array.isArray(node && node.fills)
      ? node.fills.find((paint) => paint.type === 'IMAGE' && paint.imageHash)
      : null;
  } catch {
    return null;
  }
}

function figureImageLayer(instance) {
  try {
    let namedImageLayer = null;
    const imagePaintLayer = instance.findOne((child) => {
      if (!['FRAME', 'RECTANGLE', 'INSTANCE'].includes(child.type)) return false;
      if (canonicalKey(child.name) === 'image' && !namedImageLayer) namedImageLayer = child;
      return Boolean(imagePaintOn(child));
    });
    return imagePaintLayer || namedImageLayer;
  } catch {
    return null;
  }
}

function localFigureAsset(src) {
  if (typeof src !== 'string' || !src.startsWith('a1img://')) return null;
  return localFigureAssets.get(src.slice('a1img://'.length)) || null;
}

function base64Bytes(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

async function applyLocalFigureImage(instance, src, warnings) {
  const asset = localFigureAsset(src);
  if (!asset) return false;
  try {
    const bytes = base64Bytes(asset.dataBase64);
    if (bytes.byteLength === 0 || bytes.byteLength > LOCAL_FIGMA_IMAGE_MAX_BYTES) {
      warnings.push('Local Figure image was not applied because it exceeds the 4 MB handoff limit.');
      return true;
    }
    const imageLayer = figureImageLayer(currentInstance(instance));
    if (!imageLayer) {
      warnings.push('Local Figure image was received, but the Figure Image layer was not found.');
      return true;
    }
    const image = figma.createImage(bytes);
    imageLayer.fills = [{ type: 'IMAGE', imageHash: image.hash, scaleMode: 'FILL' }];
    return true;
  } catch (error) {
    warnings.push(`Local Figure image could not be applied: ${error.message}`);
    return true;
  }
}

function applyFigureLayout(instance, size, aspectRatio, warnings) {
  const liveInstance = currentInstance(instance);
  const maxWidth = FIGURE_MAX_WIDTHS[size];
  if (maxWidth) {
    try {
      liveInstance.maxWidth = maxWidth;
      liveInstance.minWidth = null;
    } catch (error) {
      warnings.push(`Figure max width could not be applied: ${error.message}`);
    }
  }
  const image = figureImageLayer(liveInstance);
  const ratio = FIGURE_RATIO_VALUES[aspectRatio];
  if (!image || !ratio) return;
  try {
    // Variant replacement can leave the image with its old source width while
    // the outer Figure has already resolved to the selected size. Locking from
    // that stale width makes wide/tall ratios visibly wrong. The Figure is the
    // width authority; the Image fills it and derives only its height here.
    const width = Number.isFinite(liveInstance.width) && liveInstance.width > 0
      ? liveInstance.width
      : image.width;
    image.resizeWithoutConstraints(width, Math.round(width / ratio));
    image.lockAspectRatio();
  } catch (error) {
    warnings.push(`Figure image aspect ratio could not be locked: ${error.message}`);
  }
}

async function applyFigure(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const assignments = {};
  queueComponentProperty(instance, assignments, 'Source', typeof props.src === 'string' ? props.src : '', 'TEXT', warnings, 'Figure source');
  queueComponentProperty(instance, assignments, 'Alt', typeof props.alt === 'string' ? props.alt : '', 'TEXT', warnings, 'Figure alt text');
  const caption = typeof props.caption === 'string' ? props.caption : '';
  queueComponentProperty(instance, assignments, 'Caption', caption, 'TEXT', warnings, 'Figure caption');
  queueComponentProperty(instance, assignments, 'Show caption', Boolean(caption), 'BOOLEAN', warnings, 'Figure caption visibility');
  if (props.size !== undefined) {
    if (FIGURE_SIZES.includes(props.size)) queueComponentProperty(instance, assignments, 'Size', props.size, 'VARIANT', warnings, 'Figure size');
    else warnings.push(`Figure size="${props.size}" is not available in the compact Figma Figure asset.`);
  }
  if (props.aspectRatio !== undefined) {
    if (FIGURE_ASPECT_RATIOS.includes(props.aspectRatio)) queueComponentProperty(instance, assignments, 'Aspect ratio', props.aspectRatio, 'VARIANT', warnings, 'Figure aspect ratio');
    else warnings.push(`Figure aspectRatio="${props.aspectRatio}" is not available in the compact Figma Figure asset.`);
  }
  applyQueuedProperties(instance, assignments, warnings, 'Figure properties');
  applyFigureLayout(
    instance,
    FIGURE_SIZES.includes(props.size) ? props.size : 'sm',
    FIGURE_ASPECT_RATIOS.includes(props.aspectRatio) ? props.aspectRatio : '16:9',
    warnings,
  );
  const appliedLocalImage = await applyLocalFigureImage(instance, props.src, warnings);
  if (props.src && !appliedLocalImage) warnings.push('Figure source is retained as component metadata; edit the image fill directly in Figma when a visual needs to change.');
}

async function importFigure(node, warnings) {
  const instance = await createComponentInstance('Figure', warnings);
  await applyFigure(instance, node, warnings);
  return instance;
}

function definitionItemsFromJson(node, warnings) {
  const source = node.props && Array.isArray(node.props.items) ? node.props.items : [];
  return source.map((item, index) => {
    const label = definitionItemText(item && item.label, 'Label');
    const value = definitionItemText(item && (item.value !== undefined ? item.value : item.children), 'Value');
    if (!label && !value) {
      warnings.push(`Definition List item ${index + 1} has no serializable label or value and was skipped.`);
      return null;
    }
    return { label, value };
  }).filter(Boolean);
}

async function createDefinitionItem(item, direction, size = 'md') {
  const source = await findComponentSourceAsync('Definition List Item');
  if (source) {
    const instance = source.createInstance();
    await loadInstanceFonts(instance);
    const assignments = {};
    queueComponentProperty(instance, assignments, 'Direction', direction, 'VARIANT', [], 'Definition List Item direction');
    queueComponentProperty(instance, assignments, 'Size', size, 'VARIANT', [], 'Definition List Item size');
    queueComponentProperty(instance, assignments, 'Label', item.label, 'TEXT', [], 'Definition List Item label');
    queueComponentProperty(instance, assignments, 'Value', item.value, 'TEXT', [], 'Definition List Item value');
    if (Object.keys(assignments).length > 0) instance.setProperties(assignments);
    return instance;
  }
  throw new Error('No "Definition List Item" component was found. The plugin no longer generates local fallback components.');
}

async function replaceDefinitionItems(instance, node, warnings) {
  const items = definitionItemsFromJson(node, warnings);
  const direction = DEFINITION_LIST_DIRECTIONS.includes(node.props && node.props.direction) ? node.props.direction : 'row';
  const size = DEFINITION_LIST_SIZES.includes(node.props && node.props.size) ? node.props.size : 'md';
  let slot = namedSlot(currentInstance(instance), 'Items Slot');
  if (!slot) {
    warnings.push('Definition List Items Slot was not found — items were not rendered.');
    return;
  }
  for (const child of [...slot.children]) {
    try {
      child.remove();
    } catch (error) {
      try {
        child.visible = false;
      } catch (visibilityError) {
        warnings.push(`Definition List item placeholder could not be cleared: ${visibilityError.message}`);
      }
    }
  }
  for (const item of items) {
    const row = await createDefinitionItem(item, direction, size);
    slot = namedSlot(currentInstance(instance), 'Items Slot');
    if (!slot) {
      warnings.push('Definition List Items Slot could not be refreshed — remaining items were not rendered.');
      return;
    }
    slot.appendChild(row);
    row.layoutSizingHorizontal = 'FILL';
  }
}

async function applyDefinitionList(instance, node, warnings) {
  const props = node.props || {};
  const assignments = {};
  const direction = DEFINITION_LIST_DIRECTIONS.includes(props.direction) ? props.direction : 'row';
  const size = DEFINITION_LIST_SIZES.includes(props.size) ? props.size : 'md';
  queueComponentProperty(instance, assignments, 'Direction', direction, 'VARIANT', warnings, 'Definition List direction');
  queueComponentProperty(instance, assignments, 'Size', size, 'VARIANT', warnings, 'Definition List size');
  applyQueuedProperties(instance, assignments, warnings, 'Definition List properties');
  for (const prop of ['labelWidth', 'copyValue', 'copyLabel', 'copiedLabel', 'valueHeadingProps']) {
    if (props[prop] !== undefined) warnings.push(`Definition List ${prop} has no representation in the simple Figma component.`);
  }
}

async function importDefinitionList(node, warnings) {
  const instance = await createComponentInstance('Definition List', warnings);
  await applyDefinitionList(instance, node, warnings);
  await replaceDefinitionItems(instance, node, warnings);
  return instance;
}

async function applyBlockquote(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const assignments = {};
  const variant = BLOCKQUOTE_VARIANTS.includes(props.variant) ? props.variant : 'border';
  queueComponentProperty(instance, assignments, 'Variant', variant, 'VARIANT', warnings, 'Blockquote variant');
  if (node.content && typeof node.content.fallback === 'string') {
    queueComponentProperty(instance, assignments, 'Quote', node.content.fallback, 'TEXT', warnings, 'Blockquote quote');
  }
  const cite = typeof props.cite === 'string' ? props.cite : '';
  queueComponentProperty(instance, assignments, 'Citation', cite, 'TEXT', warnings, 'Blockquote citation');
  queueComponentProperty(instance, assignments, 'Citation URL', typeof props.citeUrl === 'string' ? props.citeUrl : '', 'TEXT', warnings, 'Blockquote citation URL');
  queueComponentProperty(instance, assignments, 'Show citation', Boolean(cite), 'BOOLEAN', warnings, 'Blockquote citation visibility');
  applyQueuedProperties(instance, assignments, warnings, 'Blockquote properties');
}

async function importBlockquote(node, warnings) {
  const instance = await createComponentInstance('Blockquote', warnings);
  await applyBlockquote(instance, node, warnings);
  return instance;
}

async function applyCode(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const assignments = {};
  const variant = props.variant === 'inline' ? 'inline' : 'block';
  queueOptionalComponentProperty(instance, assignments, 'Variant', variant, 'VARIANT');
  if (props.wrapping !== undefined) {
    queueOptionalComponentProperty(instance, assignments, 'Wrapping', props.wrapping === true, 'BOOLEAN');
  }
  if (props.editable !== undefined) {
    queueOptionalComponentProperty(instance, assignments, 'Editable', props.editable === true, 'BOOLEAN');
  }
  if (props.copyCode !== undefined) {
    queueOptionalComponentProperty(instance, assignments, 'Copy code', props.copyCode === true, 'BOOLEAN')
      || queueOptionalComponentProperty(instance, assignments, 'Copy Code', props.copyCode === true, 'BOOLEAN')
      || queueOptionalComponentProperty(instance, assignments, 'Show copy', props.copyCode === true, 'BOOLEAN')
      || queueOptionalComponentProperty(instance, assignments, 'Show copy button', props.copyCode === true, 'BOOLEAN');
  }
  if (typeof props.copyText === 'string') {
    queueOptionalComponentProperty(instance, assignments, 'Copy text', props.copyText, 'TEXT')
      || queueOptionalComponentProperty(instance, assignments, 'Copy Text', props.copyText, 'TEXT');
  }
  if (props.collapsedLines !== undefined) {
    queueOptionalComponentProperty(instance, assignments, 'Collapsed lines', String(props.collapsedLines), 'TEXT')
      || queueOptionalComponentProperty(instance, assignments, 'Collapsed Lines', String(props.collapsedLines), 'TEXT');
  }
  const value = node.content && typeof node.content.fallback === 'string'
    ? node.content.fallback
    : typeof props.children === 'string'
      ? props.children
      : 'Code sample';
  const appliedTextProperty = queueOptionalComponentProperty(instance, assignments, 'Code', value, 'TEXT')
    || queueOptionalComponentProperty(instance, assignments, 'Content', value, 'TEXT')
    || queueOptionalComponentProperty(instance, assignments, 'Value', value, 'TEXT')
    || queueOptionalComponentProperty(instance, assignments, 'Text', value, 'TEXT');
  applyQueuedProperties(instance, assignments, warnings, 'Code properties');
  if (!appliedTextProperty) {
    await writeFirstNamedText(instance, ['Code', 'Content', 'Value', 'Text'], value, warnings, 'Code text');
  }
  for (const runtimeProp of ['onChangeValue', 'className', 'id']) {
    if (props[runtimeProp] !== undefined) warnings.push(`"${runtimeProp}" is a runtime prop with no Figma representation — ignored.`);
  }
}

async function importCode(node, warnings) {
  const instance = await createComponentInstance('Code', warnings);
  await applyCode(instance, node, warnings);
  return instance;
}

async function applyInline(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const assignments = {};
  const requestedElement = typeof props.inlineElement === 'string' ? props.inlineElement : 'all';
  const element = INLINE_ELEMENTS.includes(requestedElement) ? requestedElement : 'all';
  queueOptionalComponentProperty(instance, assignments, 'Inline element', element, 'VARIANT')
    || queueOptionalComponentProperty(instance, assignments, 'Element', element, 'VARIANT')
    || queueOptionalComponentProperty(instance, assignments, 'Type', element, 'VARIANT');

  const value = node.content && typeof node.content.fallback === 'string'
    ? node.content.fallback
    : typeof props.children === 'string'
      ? props.children
      : 'Inline text';
  const appliedTextProperty = queueOptionalComponentProperty(instance, assignments, 'Markdown', value, 'TEXT')
    || queueOptionalComponentProperty(instance, assignments, 'Content', value, 'TEXT')
    || queueOptionalComponentProperty(instance, assignments, 'Value', value, 'TEXT')
    || queueOptionalComponentProperty(instance, assignments, 'Text', value, 'TEXT');
  applyQueuedProperties(instance, assignments, warnings, 'Inline properties');
  if (!appliedTextProperty) {
    await writeFirstNamedText(instance, ['Markdown', 'Content', 'Value', 'Text'], value, warnings, 'Inline text');
  }
  for (const runtimeProp of ['className', 'id']) {
    if (props[runtimeProp] !== undefined) warnings.push(`"${runtimeProp}" is a runtime prop with no Figma representation — ignored.`);
  }
}

async function importInline(node, warnings) {
  const instance = await createComponentInstance('Inline', warnings);
  await applyInline(instance, node, warnings);
  return instance;
}

async function applyButtonContainer(instance, node, warnings) {
  const props = node.props || {};
  const requestedAlign = props.align;
  if (requestedAlign && typeof requestedAlign === 'object') {
    warnings.push('"align" responsive objects have no Figma representation — start was used.');
  } else if (requestedAlign !== undefined && !BUTTON_CONTAINER_ALIGNS.includes(requestedAlign)) {
    warnings.push(`align="${requestedAlign}" is not supported — start was used.`);
  }
  const align = BUTTON_CONTAINER_ALIGNS.includes(requestedAlign) ? requestedAlign : 'start';
  const assignments = {};
  queueComponentProperty(instance, assignments, 'Align', align, 'VARIANT', warnings, 'Button Container alignment');
  applyQueuedProperties(instance, assignments, warnings, 'Button Container properties');

  for (const runtimeProp of ['size', 'fillButtons']) {
    if (props[runtimeProp] !== undefined) {
      warnings.push(`"${runtimeProp}" has no Button Container Figma representation — ignored.`);
    }
  }
}

function buttonContainerChildren(node, warnings) {
  const collected = [];
  collectSupportedNodes(node.children || [], collected);
  const buttons = collected.filter((child) => child.type === 'Button');
  if (collected.length !== buttons.length) {
    warnings.push('Only Button children are supported inside Button Container; unsupported children were omitted.');
  }
  return buttons;
}

async function importButtonContainer(node, warnings) {
  const instance = await createComponentInstance('Button Container', warnings);
  await applyButtonContainer(instance, node, warnings);
  const children = buttonContainerChildren(node, warnings);
  if (children.length === 0) return instance;

  const slot = buttonContainerSlot(instance);
  const existing = slot && 'children' in slot
    ? slot.children.filter((child) => buttonContainerSlotJsonType(child) === 'Button')
    : [];

  // Keep the component instance when its representative Button Slot has the
  // same number of actions. This is the normal JSON round-trip path: each
  // Button gets its own props/label without flattening the container.
  if (slot && existing.length === children.length) {
    for (let index = 0; index < children.length; index += 1) {
      await applyButton(existing[index], children[index], warnings);
    }
    return instance;
  }

  // A native Slot can accept structural changes while retaining the outer
  // component instance. Frame-based legacy Button Slots are no longer detached
  // into fallback layouts.
  if (slot && slot.type === 'SLOT') {
    for (const existingChild of [...slot.children]) {
      try {
        existingChild.remove();
      } catch (error) {
        try {
          existingChild.visible = false;
        } catch (visibilityError) {
          warnings.push(`Button Slot placeholder could not be cleared: ${visibilityError.message}`);
        }
      }
    }
    for (const child of children) slot.appendChild(await importButton(child, warnings));
    return instance;
  }

  throw new Error('Button Container children could not be changed because the component does not expose a native Button Slot. The plugin no longer detaches component instances as a fallback layout.');
}

function buttonContainerSlotJsonType(existing) {
  if (existing.type !== 'INSTANCE') return null;
  const componentName = registeredSetName(existing);
  return componentName ? (JSON_TYPE_BY_COMPONENT_NAME[componentName] || componentName) : null;
}

async function applyExistingButtonContainerChildren(instance, node, warnings) {
  const expected = buttonContainerChildren(node, warnings);
  if (expected.length === 0) return;
  const slot = buttonContainerSlot(instance);
  if (!slot || !('children' in slot)) {
    warnings.push('Button Slot was not found — Button children were not updated.');
    return;
  }
  const existing = slot.children.filter((child) => buttonContainerSlotJsonType(child) === 'Button');
  const count = Math.min(existing.length, expected.length);
  for (let index = 0; index < count; index += 1) {
    await applyButton(existing[index], expected[index], warnings);
  }
  if (existing.length !== expected.length) {
    warnings.push(`Button Container has ${existing.length} Button child${existing.length === 1 ? '' : 'ren'} but JSON has ${expected.length}; adding or removing actions requires Render on canvas.`);
  }
}

// Apply a Section node's props to an existing Section instance (used both when
// rendering a new instance and when updating the current selection).
async function applySection(sectionInstance, node, warnings) {
  const props = node.props || {};
  for (const responsiveProp of ['padding', 'align']) {
    if (props[responsiveProp] && typeof props[responsiveProp] === 'object') {
      warnings.push(`"${responsiveProp}" responsive object has no Figma representation — the default was used.`);
    }
  }
  await loadInstanceFonts(sectionInstance);

  // Properties are applied wherever they live — on the Section set itself or
  // on an internal part instance such as "Section Content" (the split model).
  // Each variant/property write can replace an internal instance layer, so
  // recompute the carriers before every read/write instead of retaining a
  // stale sublayer reference.
  const freshCarriers = () => sectionPropertyCarriers(currentInstance(sectionInstance));

  if (SECTION_SURFACES.includes(props.surface) && !assignSectionVariant(freshCarriers(), ['surface'], props.surface)) {
    warnings.push(`surface="${props.surface}" could not be applied — no Surface property found.`);
  }
  if (SECTION_PADDINGS.includes(props.padding) && !assignSectionVariant(freshCarriers(), ['padding'], props.padding)) {
    warnings.push(`padding="${props.padding}" could not be applied — no Padding property found.`);
  }
  // contentWidth — the split half of the Figma Section model: a width variant
  // on the Section or a part, then the ContentWidth variable mode as fallback.
  if (SECTION_WIDTHS.includes(props.contentWidth)) {
    const applied = assignSectionVariant(freshCarriers(), ['contentwidth', 'width'], props.contentWidth)
      || applyCollectionMode(currentInstance(sectionInstance), 'ContentWidth', props.contentWidth);
    if (!applied) warnings.push(`contentWidth="${props.contentWidth}" could not be applied — no content-width property or ContentWidth variable mode matched.`);
  }
  if (SECTION_GAPS.includes(props.gap)) {
    const applied = assignSectionVariant(freshCarriers(), ['gap'], props.gap)
      || applyCollectionMode(currentInstance(sectionInstance), 'Gap', props.gap);
    if (!applied) warnings.push(`gap="${props.gap}" could not be applied — no Gap property or variable mode matched.`);
  }
  if (props.inverse === true) {
    const applied = applyCollectionMode(currentInstance(sectionInstance), 'Color', 'Dark');
    if (!applied) warnings.push('inverse could not be applied — the Color collection has no Dark mode.');
  }

  // TEXT documentation properties, wherever the components expose them.
  for (const key of Object.keys(SECTION_TEXT_PROPS)) {
    const def = SECTION_TEXT_PROPS[key];
    const value = props[def.prop];
    if (typeof value !== 'string' || !value) continue;
    const found = findSectionProperty(freshCarriers(), [canonicalKey(key)], 'TEXT');
    if (!found) continue;
    try {
      found.node.setProperties({ [found.key]: value });
    } catch (error) {
      warnings.push(`${def.prop} could not be applied: ${error.message}`);
    }
  }
  if (Array.isArray(props.borderSides)) {
    const found = findSectionProperty(freshCarriers(), ['bordersides'], 'TEXT');
    if (found) {
      try {
        found.node.setProperties({ [found.key]: JSON.stringify(props.borderSides) });
      } catch (error) {
        warnings.push(`borderSides could not be applied: ${error.message}`);
      }
    }
  }
}

async function importSection(node, warnings) {
  const sectionInstance = await createComponentInstance('Section', warnings);
  await applySection(sectionInstance, node, warnings);

  // Child nodes: a Figma instance cannot receive new children, so a Section
  // with children is rendered into its Section Content Slot. Missing Figma
  // mappings fail loudly instead of becoming local placeholders.
  const childNodes = [];
  collectSupportedNodes(node.children || [], childNodes);
  if (childNodes.length > 0) {
    if ((node.children || []).some((child) => child && typeof child === 'object' && child.type && !IMPORTERS[child.type])) {
      warnings.push('Unsupported child types inside the Section were not rendered.');
    }

    // A1's current Section exposes a real native content Slot. Populate that
    // slot while the Section remains an instance so its intended layout,
    // clipping, and content-width carrier stay intact. This mirrors the
    // Dialog body/footer slot path and avoids appending payload layers behind
    // a detached Section's internal content frame.
    let slot = sectionContentContainer(currentInstance(sectionInstance));
    if (slot) {
      for (const existing of [...slot.children]) {
        try {
          existing.remove();
        } catch (error) {
          // Inherited slot content cannot always be removed from an instance;
          // hide representative placeholders before adding local JSON nodes.
          try {
            existing.visible = false;
          } catch (visibilityError) {
            warnings.push(`Section placeholder could not be cleared: ${visibilityError.message}`);
          }
        }
      }
      for (const child of childNodes) {
        const childInstance = await renderImportedNode(child, warnings);
        // Slot mutations can invalidate nested node handles, so resolve the
        // live Section Content Slot before every append.
        slot = sectionContentContainer(currentInstance(sectionInstance));
        if (!slot) {
          warnings.push('Section Content Slot could not be refreshed — remaining child nodes were not rendered.');
          break;
        }
        appendImportedChild(slot, childInstance, child, warnings);
      }
      return sectionInstance;
    }

    throw new Error('The Section Content Slot was not found. The plugin no longer detaches or generates fallback section layouts.');
  }
  return sectionInstance;
}

function sectionSlotJsonType(existing) {
  if (existing.type === 'TEXT') return textSuggestion(existing).type;
  if (existing.type !== 'INSTANCE') return null;
  const componentName = registeredSetName(existing);
  return componentName ? (JSON_TYPE_BY_COMPONENT_NAME[componentName] || componentName) : null;
}

// Updating a selected Section can safely update the real content already in
// its slot. It deliberately does not add/remove layers (that would require
// detaching or reshaping a component instance); instead it reconciles the
// ordered Heading/Paragraph/Button layers the designer has placed there.
async function applyExistingSectionChildren(sectionInstance, node, warnings) {
  const expected = [];
  collectSupportedNodes(node.children || [], expected);
  if (expected.length === 0) return;

  const slot = sectionContentContainer(sectionInstance);
  if (!slot || !('children' in slot)) {
    warnings.push('Section Content Slot was not found — child content was not updated.');
    return;
  }
  const existing = slot.children.filter((child) => sectionSlotJsonType(child));
  const count = Math.min(existing.length, expected.length);

  for (let index = 0; index < count; index += 1) {
    const current = existing[index];
    const child = expected[index];
    const currentType = sectionSlotJsonType(current);
    if (currentType !== child.type) {
      warnings.push(`Section child ${index + 1} is ${currentType || current.type}, not ${child.type} — it was not updated.`);
      continue;
    }
    if ((child.type === 'Heading' || child.type === 'Paragraph') && current.type === 'TEXT') {
      await applyTextSuggestion(current, textStyleRequestForNode(child), warnings);
      if (child.content && typeof child.content.fallback === 'string') {
        if (current.fontName !== figma.mixed) await figma.loadFontAsync(current.fontName);
        current.characters = child.content.fallback;
      }
    } else if (child.type === 'Button' && current.type === 'INSTANCE') {
      await applyButton(current, child, warnings);
    } else {
      warnings.push(`Section child ${index + 1} (${child.type}) is not yet updateable in place.`);
    }
  }

  if (existing.length !== expected.length) {
    warnings.push(`Section has ${existing.length} supported slot layer${existing.length === 1 ? '' : 's'} but JSON has ${expected.length}; adding or removing slot layers requires Render on canvas.`);
  }
}

async function applyTextField(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const state = props.error ? 'error'
    : props.disabled ? 'disabled'
      : props.readOnly ? 'readOnly'
        : props.required ? 'required'
          : 'default';
  const size = TEXT_FIELD_SIZES.includes(props.size) ? props.size : 'default';
  const assignments = {};
  queueComponentProperty(instance, assignments, 'Size', size, 'VARIANT', warnings);
  queueComponentProperty(instance, assignments, 'State', state, 'VARIANT', warnings);
  queueComponentProperty(instance, assignments, 'Show label', typeof props.label === 'string' && props.label.length > 0, 'BOOLEAN', warnings);
  if (typeof props.label === 'string') queueComponentProperty(instance, assignments, 'Label', props.label, 'TEXT', warnings);
  queueComponentProperty(instance, assignments, 'Show hint', !props.error && typeof props.hint === 'string' && props.hint.length > 0, 'BOOLEAN', warnings);
  if (typeof props.hint === 'string') queueComponentProperty(instance, assignments, 'Hint', props.hint, 'TEXT', warnings);
  if (typeof props.error === 'string') queueComponentProperty(instance, assignments, 'Error', props.error, 'TEXT', warnings);
  const defaultValue = typeof props.defaultValue === 'string' ? props.defaultValue : '';
  queueComponentProperty(instance, assignments, 'Value', defaultValue, 'TEXT', warnings);
  applyQueuedProperties(instance, assignments, warnings, 'Text Field properties');

  for (const runtimeProp of ['value', 'type', 'labelPosition', 'autoComplete', 'inputOverlay', 'id', 'className']) {
    if (props[runtimeProp] !== undefined) warnings.push(`"${runtimeProp}" has no Figma representation — ignored.`);
  }
}

async function importTextField(node, warnings) {
  const instance = await createComponentInstance('Text Field', warnings);
  await applyTextField(instance, node, warnings);
  return instance;
}

async function applySelect(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const state = props.error ? 'error' : props.disabled ? 'disabled' : 'default';
  const size = SELECT_SIZES.includes(props.size) ? props.size : 'default';
  const showValue = props.showValue === true;
  const assignments = {};

  queueComponentProperty(instance, assignments, 'Size', size, 'VARIANT', warnings, 'Select size');
  queueComponentProperty(instance, assignments, 'State', state, 'VARIANT', warnings, 'Select state');
  queueComponentProperty(instance, assignments, 'Show value', showValue, 'BOOLEAN', warnings, 'Select Show value');
  queueComponentProperty(instance, assignments, 'Required', props.required === true, 'BOOLEAN', warnings, 'Select Required');
  if (typeof props.label === 'string') queueComponentProperty(instance, assignments, 'Label', props.label, 'TEXT', warnings, 'Select label');
  if (typeof props.hint === 'string') queueComponentProperty(instance, assignments, 'Hint', props.hint, 'TEXT', warnings, 'Select hint');
  if (typeof props.error === 'string') queueComponentProperty(instance, assignments, 'Error message', props.error, 'TEXT', warnings, 'Select error message');
  if (showValue && typeof props.defaultValue === 'string' && props.defaultValue) {
    queueComponentProperty(instance, assignments, 'Value', props.defaultValue, 'TEXT', warnings, 'Select visible value');
  } else if (typeof props.defaultValue === 'string' && props.defaultValue) {
    warnings.push('Select defaultValue was not shown because showValue is false; set showValue: true to display it in Figma.');
  }
  applyQueuedProperties(instance, assignments, warnings, 'Select properties');
  for (const runtimeProp of ['value', 'options', 'labelPosition', 'name', 'autoComplete', 'id', 'className', 'onChange']) {
    if (props[runtimeProp] !== undefined) warnings.push(`"${runtimeProp}" has no Figma representation — ignored.`);
  }
}

async function importSelect(node, warnings) {
  const instance = await createComponentInstance('Select', warnings);
  await applySelect(instance, node, warnings);
  return instance;
}

function staticDividerOrientation(value, warnings) {
  if (DIVIDER_ORIENTATIONS.includes(value)) return value;
  if (value && typeof value === 'object') warnings.push('Responsive Divider orientation has no static Figma representation; horizontal was used.');
  else if (value !== undefined) warnings.push(`Unsupported Divider orientation "${value}" was ignored.`);
  return 'horizontal';
}

function applyDivider(instance, node, warnings) {
  const props = node.props || {};
  const assignments = {};
  queueComponentProperty(instance, assignments, 'Orientation', staticDividerOrientation(props.orientation, warnings), 'VARIANT', warnings, 'Divider orientation');
  queueComponentProperty(instance, assignments, 'Variant', DIVIDER_VARIANTS.includes(props.variant) ? props.variant : 'subtle', 'VARIANT', warnings, 'Divider variant');
  queueComponentProperty(instance, assignments, 'Line style', DIVIDER_LINE_STYLES.includes(props.lineStyle) ? props.lineStyle : 'solid', 'VARIANT', warnings, 'Divider line style');
  queueComponentProperty(instance, assignments, 'Size', DIVIDER_SIZES.includes(props.size) ? props.size : 'xs', 'VARIANT', warnings, 'Divider size');
  applyQueuedProperties(instance, assignments, warnings, 'Divider properties');

  for (const runtimeProp of ['space', 'decorative', 'className', 'id']) {
    if (props[runtimeProp] !== undefined) warnings.push(`"${runtimeProp}" has no Figma representation — ignored.`);
  }
}

async function importDivider(node, warnings) {
  const instance = await createComponentInstance('Divider', warnings);
  applyDivider(instance, node, warnings);
  return instance;
}

function groupOptionInstances(instance, optionSetName) {
  return instance.findAll((node) => node.type === 'INSTANCE' && componentSetName(node) === optionSetName);
}

function groupOptionInstancesInSlot(instance, slotName, optionSetName) {
  const slot = groupOptionSlot(currentInstance(instance), slotName);
  if (!slot) return [];
  const isOption = (node) => {
    try {
      return node.type === 'INSTANCE' && componentSetName(node) === optionSetName;
    } catch {
      return false;
    }
  };
  try {
    const direct = slot.children.filter(isOption);
    return direct.length > 0 ? direct : slot.findAll(isOption);
  } catch {
    return [];
  }
}

function currentInstance(instance) {
  const refreshed = figma.getNodeById(instance.id);
  return refreshed && refreshed.type === 'INSTANCE' ? refreshed : instance;
}

function groupOptionSlot(instance, slotName) {
  return instance.findOne((node) => node.type === 'SLOT' && node.name === slotName);
}

// The group components deliberately use Figma slots rather than a fixed set of
// rows. Reconcile the slot before applying property overrides so JSON changes
// add and remove real Radio/Checkbox Option instances instead of merely hiding
// the original three examples.
async function reconcileGroupOptionInstances(instance, type, optionSetName, requestedCount, warnings) {
  const slotConfig = GROUP_SLOT_CONFIG[type];
  const current = currentInstance(instance);
  const slot = slotConfig && groupOptionSlot(current, slotConfig.slotName);
  if (!slot) {
    warnings.push(`${type} option slot could not be found — items were not reconciled.`);
    if (type === 'TopHeader' || type === 'TopHeaderActions') return [];
    return groupOptionInstances(current, optionSetName);
  }

  const wanted = Math.max(slotConfig.min, Math.min(requestedCount, slotConfig.max));
  if (requestedCount < slotConfig.min) {
    warnings.push(`${type} requires at least ${slotConfig.min} Figma option rows; retained the minimum.`);
  }
  if (requestedCount > slotConfig.max) {
    warnings.push(`${type} supports at most ${slotConfig.max} Figma option rows; additional JSON options were not rendered.`);
  }

  let optionInstances = groupOptionInstancesInSlot(current, slotConfig.slotName, optionSetName);
  const optionSource = await findComponentSourceAsync(optionSetName, warnings);
  if (!optionSource) {
    warnings.push(`No "${optionSetName}" component set was found — items could not be added.`);
    return optionInstances;
  }
  while (optionInstances.length < wanted) {
    const liveGroup = currentInstance(instance);
    const liveSlot = groupOptionSlot(liveGroup, slotConfig.slotName);
    if (!liveSlot) break;
    liveSlot.appendChild(optionSource.createInstance());
    optionInstances = groupOptionInstancesInSlot(currentInstance(instance), slotConfig.slotName, optionSetName);
  }
  while (optionInstances.length > wanted) {
    const liveGroup = currentInstance(instance);
    const liveOptions = groupOptionInstancesInSlot(liveGroup, slotConfig.slotName, optionSetName);
    liveOptions[liveOptions.length - 1].remove();
    optionInstances = groupOptionInstancesInSlot(currentInstance(instance), slotConfig.slotName, optionSetName);
  }
  return optionInstances;
}

function selectedValuesForGroup(type, props) {
  if (type === 'RadioGroup') return typeof props.defaultValue === 'string' ? new Set([props.defaultValue]) : new Set();
  if (typeof props.defaultValue === 'string') return new Set([props.defaultValue]);
  return new Set(Array.isArray(props.defaultValue) ? props.defaultValue.filter((value) => typeof value === 'string') : []);
}

function groupOptionValue(option) {
  if (typeof option.value === 'string') return option.value;
  // `id` is accepted as a convenient compatibility path for a1-web's editor
  // config. Canonical page-definition JSON still uses `options[].value`.
  return typeof option.id === 'string' ? option.id : null;
}

async function applyLegacyChoiceGroup(instance, node, type, optionSetName, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const size = GROUP_SIZES.includes(props.size) ? props.size : 'default';
  const groupAssignments = {};
  queueComponentProperty(instance, groupAssignments, 'Size', size, 'VARIANT', warnings);
  queueComponentProperty(instance, groupAssignments, 'Inline', props.inline === true ? 'True' : 'False', 'VARIANT', warnings);
  queueComponentProperty(instance, groupAssignments, 'Required', props.required === true, 'BOOLEAN', warnings);
  if (typeof props.label === 'string') queueComponentProperty(instance, groupAssignments, 'Label', props.label, 'TEXT', warnings);
  if (typeof props.hint === 'string') queueComponentProperty(instance, groupAssignments, 'Helper', props.hint, 'TEXT', warnings);
  queueOptionalComponentProperty(instance, groupAssignments, 'Show helper', typeof props.hint === 'string' && props.hint.length > 0, 'BOOLEAN');
  applyQueuedProperties(instance, groupAssignments, warnings, `${type} properties`);

  const options = Array.isArray(props.options) ? props.options.filter((option) => option && typeof option === 'object') : [];
  const optionInstances = await reconcileGroupOptionInstances(instance, type, optionSetName, options.length, warnings);
  const selectedValues = selectedValuesForGroup(type, props);
  const matchedSelectedValues = new Set();
  if (props.disabled === true || props.error !== undefined || props.name !== undefined || props.value !== undefined) {
    warnings.push('disabled, error, name, and controlled value are runtime-only for the current Figma group component — ignored.');
  }

  for (let index = 0; index < optionInstances.length; index += 1) {
    const optionInstance = groupOptionInstances(currentInstance(instance), optionSetName)[index];
    const option = options[index];
    const label = typeof option?.label === 'string' && option.label ? option.label : `Option ${index + 1}`;
    const hint = typeof option?.hint === 'string' ? option.hint : '';
    const optionValue = option ? groupOptionValue(option) : null;
    const selected = Boolean(optionValue && selectedValues.has(optionValue));
    if (selected) matchedSelectedValues.add(optionValue);
    const optionAssignments = {};
    queueComponentProperty(optionInstance, optionAssignments, 'Label', label, 'TEXT', warnings, `Option ${index + 1} label`);
    queueComponentProperty(optionInstance, optionAssignments, 'Hint', hint, 'TEXT', warnings, `Option ${index + 1} hint`);
    queueComponentProperty(optionInstance, optionAssignments, 'Show hint', Boolean(hint), 'BOOLEAN', warnings, `Option ${index + 1} hint visibility`);
    queueComponentProperty(optionInstance, optionAssignments, 'Size', size, 'VARIANT', warnings, `Option ${index + 1} size`);
    queueComponentProperty(optionInstance, optionAssignments, 'selected', selected ? 'true' : 'false', 'VARIANT', warnings, `Option ${index + 1} selection`);
    applyQueuedProperties(optionInstance, optionAssignments, warnings, `Option ${index + 1} properties`);
    if (option?.disabled === true) warnings.push(`Option "${label}" is disabled in JSON, but option-level disabled is not represented by the Figma component.`);
  }
  for (const value of selectedValues) {
    if (!matchedSelectedValues.has(value)) warnings.push(`defaultValue "${value}" did not match an imported ${type} option value.`);
  }
}

async function importRadioGroup(node, warnings) {
  const instance = await createComponentInstance('Radio Group', warnings);
  await applyRadioGroup(instance, node, warnings);
  return instance;
}

async function importCheckboxGroup(node, warnings) {
  const instance = await createComponentInstance('Checkbox Group', warnings);
  await applyCheckboxGroup(instance, node, warnings);
  return instance;
}

async function applyRadioGroup(instance, node, warnings) {
  await applyLegacyChoiceGroup(instance, node, 'RadioGroup', 'Radio Option', warnings);
}

async function applyCheckboxGroup(instance, node, warnings) {
  await applyLegacyChoiceGroup(instance, node, 'CheckboxGroup', 'Checkbox Option', warnings);
}

function menuItemInstances(instance) {
  return instance.findAll((node) => node.type === 'INSTANCE' && componentSetName(node) === 'Menu Item');
}

function applyMenuItem(instance, item, warnings) {
  const isDivider = item.kind === 'divider';
  const isSection = item.kind === 'section';
  const label = typeof item.label === 'string' && item.label ? item.label : (isSection ? 'Section' : 'Menu item');
  const assignments = {};
  queueComponentProperty(instance, assignments, 'Type', isDivider ? 'Divider' : isSection ? 'Menu Section' : 'Menu Item', 'VARIANT', warnings, 'Menu item type');
  if (isDivider) {
    queueComponentProperty(instance, assignments, 'State', 'default', 'VARIANT', warnings, 'Menu divider state');
    applyQueuedProperties(instance, assignments, warnings, 'Menu divider properties');
    return;
  }
  queueComponentProperty(instance, assignments, 'Label', label, 'TEXT', warnings, 'Menu item label');
  if (isSection) {
    applyQueuedProperties(instance, assignments, warnings, 'Menu section properties');
    return;
  }

  const state = item.disabled === true ? 'disabled' : item.destructive === true ? 'destructive' : item.active === true ? 'active' : 'default';
  queueComponentProperty(instance, assignments, 'State', state, 'VARIANT', warnings, 'Menu item state');
  const icon = typeof item.icon === 'string' ? item.icon : '';
  queueComponentProperty(instance, assignments, 'Show icon', Boolean(icon), 'BOOLEAN', warnings, 'Menu item icon visibility');
  if (icon) {
    const iconComponent = findIconComponent(icon);
    if (iconComponent) queueComponentProperty(instance, assignments, 'Icon', iconComponent.id, 'INSTANCE_SWAP', warnings, 'Menu item icon');
    else warnings.push(`No icon component named "${icon}" exists in this file — the default glyph is shown.`);
  }
  const shortcut = typeof item.shortcut === 'string' ? item.shortcut : '';
  queueComponentProperty(instance, assignments, 'Shortcut', shortcut, 'TEXT', warnings, 'Menu item shortcut');
  queueComponentProperty(instance, assignments, 'Show shortcut', Boolean(shortcut), 'BOOLEAN', warnings, 'Menu item shortcut visibility');
  applyQueuedProperties(instance, assignments, warnings, 'Menu item properties');
}

async function applyMenu(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const sourceItems = Array.isArray(props.items) ? props.items : [];
  const items = sourceItems.filter((item) => item && typeof item === 'object');
  const rows = menuItemInstances(instance);
  if (items.length > rows.length) {
    warnings.push(`Menu supports ${rows.length} preconfigured Figma rows; ${items.length - rows.length} additional JSON item(s) were not rendered.`);
  }
  for (let index = 0; index < rows.length; index += 1) {
    const item = items[index];
    rows[index].visible = Boolean(item);
    if (item) applyMenuItem(rows[index], item, warnings);
  }
  for (const runtimeProp of ['open', 'onClose', 'anchorRef', 'trapFocus', 'modalOnMobile', 'aria-label']) {
    if (props[runtimeProp] !== undefined) warnings.push(`"${runtimeProp}" has no Figma representation — ignored.`);
  }
}

async function importMenu(node, warnings) {
  const instance = await createComponentInstance('Menu', warnings);
  await applyMenu(instance, node, warnings);
  return instance;
}

function clearDialogBodySlot(instance, warnings, reason = 'Dialog body slot') {
  let liveInstance = currentInstance(instance);
  let slot = dialogBodySlot(liveInstance);
  if (!slot) {
    warnings.push(`${reason} could not be found.`);
    return null;
  }

  // Remove prior bridge/local content. Figma invalidates nested references
  // after each slot mutation, so refresh the instance before the next pass.
  let existing = slot.children.find((child) => !child.id.startsWith('I'));
  while (existing) {
    existing.remove();
    liveInstance = currentInstance(instance);
    slot = dialogBodySlot(liveInstance);
    if (!slot) {
      warnings.push(`${reason} could not be refreshed.`);
      return null;
    }
    existing = slot.children.find((child) => !child.id.startsWith('I'));
  }
  for (const inherited of slot.children.filter((child) => child.id.startsWith('I'))) {
    try {
      inherited.visible = false;
    } catch (error) {
      warnings.push(`Dialog body placeholder could not be hidden: ${error.message}`);
    }
  }
  return slot;
}

async function replaceDialogBodySlotChildren(instance, children, warnings) {
  const supported = supportedChildren(children || [], warnings, 'Dialog body');
  let slot = clearDialogBodySlot(instance, warnings, 'Dialog body slot');
  if (!slot) {
    if (supported.length > 0) warnings.push('Dialog body children were not rendered.');
    return;
  }
  for (const child of supported) {
    const childInstance = await renderImportedNode(child, warnings);
    slot = dialogBodySlot(currentInstance(instance));
    if (!slot) {
      warnings.push('Dialog body slot could not be refreshed — remaining child nodes were not rendered.');
      break;
    }
    appendImportedChild(slot, childInstance, child, warnings);
  }
}

async function replaceDialogBodySlot(instance, body, warnings) {
  let liveInstance = currentInstance(instance);
  let slot = clearDialogBodySlot(instance, warnings, 'Dialog body slot');
  if (!slot) {
    warnings.push('Dialog body text was not rendered.');
    return;
  }

  const sourceSlot = liveInstance.mainComponent && dialogBodySlot(liveInstance.mainComponent);
  const sourceText = sourceSlot && sourceSlot.findOne((child) => child.type === 'TEXT');
  if (!sourceText || sourceText.type !== 'TEXT' || sourceText.fontName === figma.mixed) {
    warnings.push('Dialog body slot has no editable text template — body text was not rendered.');
    return;
  }

  // Insert a basic local text node first. Applying text style before insertion
  // causes Figma's slot API to invalidate the inherited placeholder reference.
  const replacement = figma.createText();
  await figma.loadFontAsync(sourceText.fontName);
  replacement.characters = body;
  slot.appendChild(replacement);

  liveInstance = currentInstance(instance);
  slot = dialogBodySlot(liveInstance);
  if (!slot) {
    warnings.push('Dialog body slot could not be refreshed after insertion.');
    return;
  }
  // Refresh after the visibility override, then copy source typography onto
  // the local slot text. This preserves the Dialog body appearance while
  // keeping the slot insertion stable.
  liveInstance = currentInstance(instance);
  slot = dialogBodySlot(liveInstance);
  const localText = slot && slot.children.find((child) => child.id === replacement.id);
  if (!localText || localText.type !== 'TEXT') {
    warnings.push('Dialog body text could not be styled after insertion.');
    return;
  }
  localText.name = 'Body text';
  localText.fontName = sourceText.fontName;
  localText.fontSize = sourceText.fontSize;
  localText.lineHeight = sourceText.lineHeight;
  localText.letterSpacing = sourceText.letterSpacing;
  localText.fills = [...sourceText.fills];
  localText.textAutoResize = sourceText.textAutoResize;
  localText.resize(sourceText.width, sourceText.height);
}

// `footerActions` is the JSON-safe representation of Dialog.footer. The
// renderer turns it back into a ButtonContainer; the Figma bridge reconciles
// the same list against the real Footer Slot so added and removed actions are
// preserved instead of being merely hidden examples.
async function reconcileDialogFooterButtons(instance, requestedCount, warnings) {
  let liveInstance = currentInstance(instance);
  let slot = dialogFooterSlot(liveInstance);
  if (!slot) {
    warnings.push('Dialog footer slot could not be found — footer actions were not rendered.');
    return [];
  }
  const buttonSource = await findComponentSourceAsync('Button', warnings);
  if (!buttonSource) {
    warnings.push('No "Button" component set was found — footer actions could not be rendered.');
    return dialogFooterButtons(liveInstance);
  }
  let buttons = dialogFooterButtons(liveInstance);
  while (buttons.length < requestedCount) {
    liveInstance = currentInstance(instance);
    slot = dialogFooterSlot(liveInstance);
    if (!slot) break;
    slot.appendChild(buttonSource.createInstance());
    buttons = dialogFooterButtons(currentInstance(instance));
  }
  while (buttons.length > requestedCount) {
    liveInstance = currentInstance(instance);
    buttons = dialogFooterButtons(liveInstance);
    const removable = buttons[buttons.length - 1];
    if (!removable) break;
    try {
      removable.remove();
    } catch (error) {
      // Inherited slot children cannot always be removed. Hiding them is still
      // faithful in the instance and keeps the JSON action list authoritative.
      removable.visible = false;
      warnings.push(`A default footer action could not be removed and was hidden instead: ${error.message}`);
      break;
    }
    buttons = dialogFooterButtons(currentInstance(instance));
  }
  return dialogFooterButtons(currentInstance(instance));
}

async function applyDialog(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const size = DIALOG_SIZES.includes(props.size) ? props.size : 'md';
  const status = DIALOG_STATUSES.includes(props.status) ? props.status : 'none';
  const assignments = {};
  queueComponentProperty(instance, assignments, 'Size', size, 'VARIANT', warnings);
  queueComponentProperty(instance, assignments, 'Status', status, 'VARIANT', warnings);
  if (typeof props.title === 'string') queueComponentProperty(instance, assignments, 'Title', props.title, 'TEXT', warnings);
  // `Body` is a legacy text property that is not bound to the live body slot.
  // Write body copy exclusively through `replaceDialogBodySlot` below.
  const footerActions = Array.isArray(props.footerActions)
    ? props.footerActions.filter((action) => action && action.type === 'Button')
    : null;
  if (Array.isArray(props.footerActions) && footerActions.length !== props.footerActions.length) {
    warnings.push('Only Button nodes are supported in Dialog footerActions; other footer nodes were ignored.');
  }
  queueDialogBooleanProperty(instance, assignments, ['Show close', 'Show close button', 'Close button', 'Close'], props.showClose !== false, warnings, 'Dialog close visibility');
  queueDialogBooleanProperty(instance, assignments, ['Show footer', 'Show footer actions', 'Footer', 'Footer actions'], props.showFooter !== false && (!footerActions || footerActions.length > 0), warnings, 'Dialog footer visibility');
  applyQueuedProperties(instance, assignments, warnings, 'Dialog properties');
  const bodyChildren = Array.isArray(node.children) ? node.children : [];
  if (bodyChildren.length > 0) await replaceDialogBodySlotChildren(instance, bodyChildren, warnings);
  else if (typeof props.body === 'string') await replaceDialogBodySlot(instance, props.body, warnings);
  if (footerActions) {
    const buttons = await reconcileDialogFooterButtons(instance, footerActions.length, warnings);
    for (let index = 0; index < footerActions.length && index < buttons.length; index += 1) {
      await applyButton(buttons[index], footerActions[index], warnings);
    }
  }
  for (const runtimeProp of ['open', 'onClose', 'footer', 'icon', 'id', 'className']) {
    if (props[runtimeProp] !== undefined) warnings.push(`"${runtimeProp}" has no Figma representation — ignored.`);
  }
}

async function importDialog(node, warnings) {
  const instance = await createComponentInstance('Dialog', warnings);
  await applyDialog(instance, node, warnings);
  return instance;
}

function textStyleCanonicalName(styleName) {
  const [familyRaw, sizeRaw, weightRaw] = String(styleName || '').split('/');
  const family = String(familyRaw || '').toLowerCase();
  const size = String(sizeRaw || 'md').toLowerCase();
  const weight = String(weightRaw || '').toLowerCase();
  const familyName = family === 'body' || family === 'paragraph'
    ? 'Body'
    : family === 'heading'
      ? 'Heading'
      : family === 'display'
        ? 'Display'
        : family === 'link'
          ? 'Link'
          : String(familyRaw || 'Body');
  const sizeName = size === 'xjumbo' ? 'XJumbo' : size === 'jumbo' ? 'Jumbo' : size.toUpperCase();
  if (family === 'link') {
    const weightName = weight ? weight.charAt(0).toUpperCase() + weight.slice(1) : 'Normal';
    return `${familyName}/${sizeName}/${weightName}`;
  }
  return `${familyName}/${sizeName}`;
}

function textStyleNameVariants(name) {
  const base = String(name || '').trim();
  const canonical = textStyleCanonicalName(base);
  const variants = [base, canonical];
  if (/^body\//i.test(base)) {
    variants.push(base.replace(/^body\//i, 'paragraph/'));
    variants.push(canonical.replace(/^Body\//, 'Paragraph/'));
  }
  if (/^paragraph\//i.test(base)) {
    variants.push(base.replace(/^paragraph\//i, 'body/'));
    variants.push(canonical.replace(/^Paragraph\//, 'Body/'));
  }
  return [...new Set(variants.filter(Boolean))];
}

function configuredTextStyleKeyForName(map, name) {
  const styleNames = textStyleNameVariants(name);
  for (const styleName of styleNames) {
    const direct = map[styleName];
    if (typeof direct === 'string' && direct.trim()) return direct.trim();
    const matchingName = Object.keys(map).find((key) => looseNameMatch(key, styleName));
    const matchingValue = matchingName ? map[matchingName] : '';
    if (typeof matchingValue === 'string' && matchingValue.trim()) return matchingValue.trim();
  }
  return '';
}

async function importConfiguredTextStyle(name) {
  if (typeof figma.importStyleByKeyAsync !== 'function') return null;
  try {
    const stored = await readClientComponentKeyRegistry();
    const key = configuredTextStyleKeyForName({ ...A1_FIGMA_TEXT_STYLE_KEYS, ...stored.textStyles }, name);
    return key ? await figma.importStyleByKeyAsync(key) : null;
  } catch {
    return null;
  }
}

function configuredVariableKeyForName(map, name) {
  const wanted = canonicalKey(name);
  for (const key of Object.keys(map || {})) {
    const value = map[key];
    if (typeof value !== 'string' || !value.trim()) continue;
    const candidate = canonicalKey(key);
    if (candidate === wanted || candidate.endsWith(wanted)) return value.trim();
  }
  return '';
}

async function importConfiguredColorVariable(token) {
  if (!figma.variables || typeof figma.variables.importVariableByKeyAsync !== 'function') return null;
  try {
    const stored = await readClientComponentKeyRegistry();
    const map = { ...A1_FIGMA_COLOR_VARIABLE_KEYS, ...stored.variables.color };
    const names = token === 'link'
      ? ['link/color', 'color/link', 'color/link/default', 'semantic/color/link', 'semantic/color/link/default']
      : [`text/${token}`, `color/text/${token}`, `semantic/color/text/${token}`];
    for (const name of names) {
      const key = configuredVariableKeyForName(map, name);
      if (key) return await figma.variables.importVariableByKeyAsync(key);
    }
  } catch {
    return null;
  }
  return null;
}

async function findLocalTextStyle(name) {
  const styles = await figma.getLocalTextStylesAsync();
  const styleNames = textStyleNameVariants(name);
  const matchesWanted = (style) => styleNames.some((styleName) => looseNameMatch(style && style.name, styleName));
  const local = styles.find(matchesWanted) || null;
  if (local) return local;
  const configured = await importConfiguredTextStyle(name);
  if (configured) return configured;
  try {
    if (!figma.teamLibrary || typeof figma.teamLibrary.getAvailableTextStylesAsync !== 'function' || typeof figma.importStyleByKeyAsync !== 'function') return null;
    const libraryStyles = await figma.teamLibrary.getAvailableTextStylesAsync();
    const style = libraryStyles.find(matchesWanted);
    return style && style.key ? await figma.importStyleByKeyAsync(style.key) : null;
  } catch {
    return null;
  }
}

async function findNearestLocalTextStyle(name) {
  const [family, requestedSize, requestedWeight] = String(name).toLowerCase().split('/');
  const familyAliases = family === 'body' ? ['body', 'paragraph'] : [family];
  const sizes = family === 'link'
    ? LINK_SIZES
    : family === 'display'
      ? DISPLAY_SIZES
      : family === 'heading'
        ? HEADING_SIZES
        : PARAGRAPH_SIZES;
  const requestedIndex = sizes.indexOf(requestedSize);
  if (requestedIndex < 0) return null;
  const styles = [...await figma.getLocalTextStylesAsync()];
  try {
    if (figma.teamLibrary && typeof figma.teamLibrary.getAvailableTextStylesAsync === 'function' && typeof figma.importStyleByKeyAsync === 'function') {
      const libraryStyles = await figma.teamLibrary.getAvailableTextStylesAsync();
      for (const entry of libraryStyles) {
        if (styles.some((style) => style.key && entry.key && style.key === entry.key)) continue;
        styles.push(entry);
      }
    }
  } catch {
    // Library styles are an enhancement. Fall back to local/imported styles.
  }
  try {
    const stored = await readClientComponentKeyRegistry();
    const configuredStyles = { ...A1_FIGMA_TEXT_STYLE_KEYS, ...stored.textStyles };
    for (const [styleName, key] of Object.entries(configuredStyles)) {
      if (typeof key !== 'string' || !key.trim()) continue;
      if (styles.some((style) => style.key && style.key === key)) continue;
      styles.push({ name: styleName, key });
    }
  } catch {
    // The checked-in manifest is an enhancement. Fall back to local/imported styles.
  }
  const candidates = styles
    .map((style) => {
      const compactName = compactKey(style.name);
      const parts = family === 'link'
        ? LINK_SIZES.flatMap((size) => LINK_WEIGHTS.map((weight) => {
          const suffix = compactKey(`link/${size}/${weight}`);
          return compactName.endsWith(suffix) ? ['link', size, weight] : null;
        })).find(Boolean) || String(style.name).toLowerCase().split('/')
        : familyAliases.flatMap((familyName) => sizes.map((size) => {
          const familySuffix = compactKey(`${familyName}/${size}`);
          return compactName.endsWith(familySuffix) ? [family, size] : null;
        })).find(Boolean) || String(style.name).toLowerCase().split('/');
      return { style, parts: family === 'link' ? parts.slice(-3) : parts.slice(-2) };
    })
    .filter((entry) => family === 'link'
      ? entry.parts.length === 3 && entry.parts[0] === family && sizes.includes(entry.parts[1]) && LINK_WEIGHTS.includes(entry.parts[2])
      : entry.parts.length === 2 && (entry.parts[0] === family || (family === 'body' && entry.parts[0] === 'paragraph')) && sizes.includes(entry.parts[1]))
    .map((entry) => ({
      ...entry,
      distance: Math.abs(sizes.indexOf(entry.parts[1]) - requestedIndex)
        + (family === 'link' && requestedWeight ? Math.abs(LINK_WEIGHTS.indexOf(entry.parts[2]) - LINK_WEIGHTS.indexOf(requestedWeight)) : 0),
    }));
  candidates.sort((a, b) => a.distance - b.distance);
  const nearest = candidates[0] ? candidates[0].style : null;
  if (!nearest) return null;
  if (nearest.id) return nearest;
  try {
    return nearest.key && typeof figma.importStyleByKeyAsync === 'function'
      ? await figma.importStyleByKeyAsync(nearest.key)
      : null;
  } catch {
    return null;
  }
}

async function findLibraryColorVariable(predicate) {
  try {
    if (!figma.teamLibrary || typeof figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync !== 'function' || typeof figma.teamLibrary.getVariablesInLibraryCollectionAsync !== 'function' || typeof figma.variables.importVariableByKeyAsync !== 'function') {
      return null;
    }
    const collections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
    for (const collection of collections) {
      const variables = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(collection.key);
      const match = variables.find((variable) => variable.resolvedType === 'COLOR' && predicate(variable));
      if (match && match.key) return await figma.variables.importVariableByKeyAsync(match.key);
    }
  } catch {
    // Library variables are optional; callers report the ordinary missing-token warning.
  }
  return null;
}

async function findTextColorVariable(token) {
  const variables = await figma.variables.getLocalVariablesAsync('COLOR');
  if (token === 'link') return variables.find(isLinkColorVariable) || await importConfiguredColorVariable('link') || await findLibraryColorVariable(isLinkColorVariable);
  const wanted = canonicalKey(`text/${token}`);
  // A1 Figma variables are named `color/text/default`, `color/text/muted`,
  // and so on. Accept that canonical namespace while keeping this bridge
  // resilient to a library copy that only uses the shorter `text/muted` path.
  const local = variables.find((variable) => {
    const name = canonicalKey(variable.name);
    return name === wanted || name.endsWith(wanted);
  }) || null;
  if (local) return local;
  const configured = await importConfiguredColorVariable(token);
  if (configured) return configured;
  if (token === 'link') return findLibraryColorVariable(isLinkColorVariable);
  return findLibraryColorVariable((variable) => {
    const name = canonicalKey(variable.name);
    return name === wanted || name.endsWith(wanted);
  });
}

function textStyleRequestForNode(node) {
  const props = node.props || {};
  if (node.type === 'Link') {
    const size = typeof props.size === 'string' && LINK_SIZES.includes(props.size) ? props.size : 'md';
    const weight = typeof props.weight === 'string' && LINK_WEIGHTS.includes(props.weight) ? props.weight : 'normal';
    return { type: 'Link', styleName: `link/${size}/${weight}`, color: 'link', align: 'left' };
  }
  if (node.type === 'Heading') {
    const family = props.type === 'display' ? 'display' : 'heading';
    const sizes = family === 'display' ? DISPLAY_SIZES : HEADING_SIZES;
    const size = typeof props.size === 'string' && sizes.includes(props.size.toLowerCase())
      ? props.size.toLowerCase()
      : 'md';
    return { styleName: `${family}/${size}`, color: typeof props.color === 'string' ? props.color : 'default', align: typeof props.align === 'string' ? props.align : 'left' };
  }
  const size = typeof props.size === 'string' && PARAGRAPH_SIZES.includes(props.size) ? props.size : 'md';
  return { styleName: `body/${size}`, color: typeof props.color === 'string' ? props.color : 'default', align: typeof props.align === 'string' ? props.align : 'left' };
}

async function applyTextSuggestion(text, suggestion, warnings) {
  const style = await findLocalTextStyle(suggestion.styleName);
  if (style) {
    try {
      if (style.fontName !== figma.mixed) await figma.loadFontAsync(style.fontName);
      text.textStyleId = style.id;
    } catch (error) {
      warnings.push(`A1 text style "${style.name}" was found but could not be applied: ${error.message}`);
    }
  } else {
    const nearest = await findNearestLocalTextStyle(suggestion.styleName);
    if (nearest) {
      try {
        if (nearest.fontName !== figma.mixed) await figma.loadFontAsync(nearest.fontName);
        text.textStyleId = nearest.id;
        const displayHint = suggestion.styleName === 'heading/xxl'
          ? ' Use `props.type: "display"` with `size: "xxl"` for Figma Display XXL.'
          : '';
        warnings.push(`No A1 text style named "${suggestion.styleName}" was found; applied the nearest available style "${nearest.name}".${displayHint}`);
      } catch (error) {
        warnings.push(`Nearest A1 text style "${nearest.name}" could not be applied: ${error.message}`);
      }
    } else {
      warnings.push(`No A1 text style named "${suggestion.styleName}" was found in this file or enabled libraries. The plugin will not create local text styles.`);
    }
  }
  text.textAlignHorizontal = suggestion.align === 'center' ? 'CENTER' : suggestion.align === 'right' ? 'RIGHT' : 'LEFT';
  if (suggestion.type === 'Link') text.textDecoration = 'UNDERLINE';
  const colorVariable = await findTextColorVariable(suggestion.color);
  if (!colorVariable) {
    const variableName = suggestion.color === 'link' ? 'link/color' : `text/${suggestion.color}`;
    warnings.push(`No A1 color variable named "${variableName}" was found in this file or enabled libraries. The plugin will not create local color variables.`);
    return;
  }
  const existingPaint = firstSolidTextPaint(text);
  if (!existingPaint) {
    // Do not invent a black (or any other) hex fallback just to satisfy the
    // Figma API. A valid solid paint is needed as the carrier for the variable
    // binding, so leave an exotic fill alone and report the exact limitation.
    const variableName = suggestion.color === 'link' ? 'link/color' : `text/${suggestion.color}`;
    warnings.push(`The text has no solid fill to bind to the "${variableName}" token.`);
    return;
  }
  const boundPaint = figma.variables.setBoundVariableForPaint(existingPaint, 'color', colorVariable);
  try {
    // Range assignment is reliable for ordinary text and for a text layer that
    // has style overrides or mixed fills. It makes a full-layer AutoFix truly
    // semantic instead of silently leaving an unbound paint on one range.
    if (text.characters.length > 0 && typeof text.setRangeFills === 'function') {
      text.setRangeFills(0, text.characters.length, [boundPaint]);
    } else {
      text.fills = [boundPaint];
    }
  } catch (error) {
    try {
      text.fills = [boundPaint];
    } catch (fallbackError) {
      warnings.push(`The text fill could not be bound to the token: ${fallbackError.message || error.message}`);
    }
  }
}

async function applyInlineLinkRanges(text, inlineLinks, warnings) {
  if (!Array.isArray(inlineLinks) || inlineLinks.length === 0) return;
  const colorVariable = await findTextColorVariable('link');
  if (!colorVariable) {
    warnings.push('No local color variable named "link/color" was found; inline Link ranges were not styled.');
    return;
  }
  for (const link of inlineLinks) {
    const start = Number(link && link.start);
    const end = Number(link && link.end);
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end <= start || end > text.characters.length) {
      warnings.push('An inline Link range is outside the text content and was ignored.');
      continue;
    }
    try {
      text.setRangeTextDecoration(start, end, 'UNDERLINE');
      const fills = text.getRangeFills(start, end);
      const paint = Array.isArray(fills) && fills.find((entry) => entry && entry.type === 'SOLID' && entry.visible !== false);
      if (!paint) {
        warnings.push(`Inline Link range ${start}–${end} has no solid fill to bind to link/color.`);
        continue;
      }
      text.setRangeFills(start, end, [figma.variables.setBoundVariableForPaint(paint, 'color', colorVariable)]);
    } catch (error) {
      warnings.push(`Inline Link range ${start}–${end} could not be styled: ${error.message}`);
    }
  }
}

async function importTextNode(node, warnings) {
  const text = figma.createText();
  const fallback = node.content && typeof node.content.fallback === 'string' ? node.content.fallback : '';
  // A1 imports use the same local Figma styles that free-text exports detect.
  const suggestion = textStyleRequestForNode(node);
  const initialFont = text.fontName;
  if (initialFont !== figma.mixed) await figma.loadFontAsync(initialFont);
  text.characters = fallback;
  await applyTextSuggestion(text, suggestion, warnings);
  await applyInlineLinkRanges(text, node.content && node.content.inlineLinks, warnings);
  text.name = node.type;
  return text;
}

async function applyTextAutoFix(text, warnings) {
  const suggestion = textSuggestion(text);
  if (suggestion.issues.length === 0) return suggestion;
  // A manually coloured text layer has no semantic JSON token yet. Match its
  // visible solid fill against the local A1 text variables before binding it;
  // this makes a light gray resolve to text/muted instead of default text.
  // Link candidates intentionally bind to the explicit link/color token.
  if (suggestion.type !== 'Link' && !textColorToken(text)) {
    const allowedColors = suggestion.type === 'Paragraph' ? ['default', 'muted'] : ['default', 'muted', 'accent'];
    // Pure black is the authored equivalent of A1's default text. Resolve it
    // deterministically before the broader nearest-token fallback so AutoFix
    // always replaces #000000 with color/text/default rather than retaining a
    // raw fill or selecting a different dark semantic token in another mode.
    const nearestColor = isBlackPaint(firstSolidTextPaint(text))
      ? 'default'
      : await nearestTextColorToken(text, allowedColors);
    if (nearestColor) suggestion.color = nearestColor;
  }
  await applyTextSuggestion(text, suggestion, warnings);
  await applyInlineLinkRanges(text, suggestion.inlineLinks, warnings);
  return suggestion;
}

async function handleFixText() {
  const selection = figma.currentPage.selection;
  if (selection.length !== 1 || selection[0].type !== 'TEXT') {
    return postError('Select one text layer to apply the A1 text suggestion.');
  }
  const text = selection[0];
  const initialSuggestion = textSuggestion(text);
  if (initialSuggestion.issues.length === 0) {
    postPluginMessage({ type: 'text-fix-result', warnings: [], message: 'This text layer already uses supported A1 text properties.' });
    return;
  }
  const warnings = [];
  const suggestion = await applyTextAutoFix(text, warnings);
  const message = suggestion.type === 'Link'
    ? 'Applied the A1 Link text style, underline, and link/color token.'
    : suggestion.inlineLinks && suggestion.inlineLinks.length
      ? 'Applied the A1 text style, color, and inline Link token bindings.'
      : 'Applied the nearest A1 text style, color, and alignment.';
  figma.notify(message);
  postPluginMessage({ type: 'text-fix-result', warnings, message });
  scheduleAutoExport();
}

async function handleFixStack() {
  const selection = figma.currentPage.selection;
  if (selection.length !== 1 || !isStackFrame(selection[0])) {
    return postError('Select one authored auto-layout frame to apply the A1 Stack suggestion.');
  }
  const frame = selection[0];
  const suggestion = stackSuggestion(frame);
  if (suggestion.fixes.length === 0) {
    postPluginMessage({ type: 'stack-fix-result', warnings: [], message: 'This auto-layout frame already uses A1-compatible Stack layout values.' });
    return;
  }
  const warnings = [];
  await applyStackSuggestion(frame, suggestion, warnings);
  figma.notify('Applied the nearest A1 Stack layout values.');
  postPluginMessage({ type: 'stack-fix-result', warnings, message: 'Applied the nearest A1 Stack gap and compatible layout values.' });
  scheduleAutoExport();
}

function copyCardPlacement(source, card, parent, warnings) {
  try {
    if (parent && parent.type !== 'PAGE' && parent.layoutMode && parent.layoutMode !== 'NONE') {
      card.layoutAlign = source.layoutAlign;
      card.layoutGrow = source.layoutGrow;
      card.layoutSizingHorizontal = source.layoutSizingHorizontal;
      card.layoutSizingVertical = source.layoutSizingVertical;
    } else {
      card.x = source.x;
      card.y = source.y;
      card.resizeWithoutConstraints(source.width, card.height);
    }
  } catch (error) {
    warnings.push(`Card placement could not fully match the source frame: ${error.message}`);
  }
  setNodeToFillParentWidth(card, 'Card', warnings);
}

function copyPageLayoutPlacement(source, pageLayout, parent, warnings) {
  try {
    if (parent && parent.type !== 'PAGE' && parent.layoutMode && parent.layoutMode !== 'NONE') {
      pageLayout.layoutAlign = source.layoutAlign;
      pageLayout.layoutGrow = source.layoutGrow;
      pageLayout.layoutSizingHorizontal = source.layoutSizingHorizontal;
      pageLayout.layoutSizingVertical = source.layoutSizingVertical;
    } else {
      pageLayout.x = source.x;
      pageLayout.y = source.y;
      pageLayout.resizeWithoutConstraints(source.width, pageLayout.height);
    }
  } catch (error) {
    warnings.push(`Page Layout placement could not fully match the source frame: ${error.message}`);
  }
}

function copySectionPlacement(source, section, parent, warnings) {
  try {
    if (parent && parent.type !== 'PAGE' && parent.layoutMode && parent.layoutMode !== 'NONE') {
      section.layoutAlign = source.layoutAlign;
      section.layoutGrow = source.layoutGrow;
      section.layoutSizingHorizontal = source.layoutSizingHorizontal;
      section.layoutSizingVertical = source.layoutSizingVertical;
    } else {
      section.x = source.x;
      section.y = source.y;
      section.resizeWithoutConstraints(source.width, section.height);
    }
  } catch (error) {
    warnings.push(`Section placement could not fully match the source selection: ${error.message}`);
  }
}

function normalizeSectionContentChildSizing(child, warnings) {
  const node = liveNode(child);
  if (!node) return;
  try {
    node.layoutGrow = 0;
  } catch {
    // Not every child type exposes layoutGrow.
  }
  try {
    node.layoutAlign = 'STRETCH';
  } catch (error) {
    warnings.push(`Section content "${node.name || 'child'}" could not be set to fill width: ${error.message}`);
  }
  try {
    node.layoutSizingHorizontal = 'FILL';
  } catch {
    // Some Figma node types rely on layoutAlign=STRETCH instead.
  }
  try {
    node.layoutSizingVertical = 'HUG';
  } catch {
    // Leaf/vector nodes may not expose layout sizing; preserve their height.
  }
}

function clearSectionSlot(slot) {
  for (const child of [...slot.children]) {
    try { child.remove(); } catch { try { child.visible = false; } catch { /* no-op */ } }
  }
}

function topLevelSelectionNodes(selection) {
  const nodes = (selection || [])
    .map(liveNode)
    .filter(Boolean)
    .filter((node) => !isAuditReportNode(node));
  const selectedIds = new Set(nodes.map((node) => node.id));
  return nodes.filter((node) => {
    try {
      if (node.type === 'PAGE' || !node.parent) return false;
      if (['COMPONENT', 'COMPONENT_SET', 'SLOT'].includes(node.type) || isComponentImplementationNode(node)) return false;
      for (let parent = node.parent; parent && parent.type !== 'PAGE'; parent = parent.parent) {
        if (selectedIds.has(parent.id)) return false;
      }
      return true;
    } catch {
      return false;
    }
  });
}

function commonParent(nodes) {
  if (!nodes.length) return null;
  const parent = nodes[0].parent;
  return nodes.every((node) => node.parent && node.parent.id === parent.id) ? parent : null;
}

function selectionBoundsInParent(nodes) {
  if (!nodes.length) return null;
  try {
    const minX = Math.min(...nodes.map((node) => node.x));
    const minY = Math.min(...nodes.map((node) => node.y));
    const maxX = Math.max(...nodes.map((node) => node.x + node.width));
    const maxY = Math.max(...nodes.map((node) => node.y + node.height));
    return { x: minX, y: minY, width: Math.max(1, maxX - minX), height: Math.max(1, maxY - minY) };
  } catch {
    return null;
  }
}

function nearestSectionContentWidth(width) {
  if (typeof width !== 'number' || !Number.isFinite(width) || width <= 0) return 'lg';
  return SECTION_WIDTHS.reduce((nearest, size) =>
    Math.abs(SECTION_CONTENT_WIDTH_PIXELS[size] - width) < Math.abs(SECTION_CONTENT_WIDTH_PIXELS[nearest] - width)
      ? size
      : nearest, 'lg');
}

function inferredSectionContentWidth(source, contentNodes, fallback = 'lg') {
  const contentBounds = selectionBoundsInParent(contentNodes);
  const width = contentBounds && contentBounds.width
    ? contentBounds.width
    : source && typeof source.width === 'number'
      ? source.width
      : null;
  if (typeof width !== 'number' || !Number.isFinite(width) || width <= 0) return fallback;
  return nearestSectionContentWidth(width);
}

function applySectionContentWidth(section, contentWidth, warnings) {
  const width = SECTION_WIDTHS.includes(contentWidth) ? contentWidth : 'lg';
  const applied = assignSectionVariant(sectionPropertyCarriers(currentInstance(section)), ['contentwidth', 'width'], width)
    || applyCollectionMode(currentInstance(section), 'ContentWidth', width);
  if (!applied) {
    warnings.push(`contentWidth="${width}" could not be applied — no content-width property or ContentWidth variable mode matched.`);
  }
  return width;
}

function selectedNodesInParentOrder(parent, nodes) {
  const ids = new Set(nodes.map((node) => node.id));
  try {
    return parent.children.filter((child) => ids.has(child.id));
  } catch {
    return nodes;
  }
}

function isSectionContentSource(node) {
  return Boolean(node && ['FRAME', 'GROUP', 'SECTION'].includes(node.type) && 'children' in node);
}

async function convertFrameToCard(source, warnings) {
  const parent = source.parent;
  if (!parent || !('children' in parent) || !('insertChild' in parent)) {
    warnings.push('The selected frame cannot be replaced with a Card in its current parent.');
    return null;
  }

  const sourceIndex = parent.children.indexOf(source);
  const children = [...source.children];
  const card = await createComponentInstance('Card', warnings);
  parent.insertChild(Math.max(0, sourceIndex), card);
  copyCardPlacement(source, card, parent, warnings);

  let slot = namedSlot(currentInstance(card), 'Content Slot');
  if (!slot) {
    card.remove();
    warnings.push('The Card Content Slot was not found. The original frame was left unchanged.');
    return null;
  }
  for (const child of [...slot.children]) {
    try { child.remove(); } catch { try { child.visible = false; } catch { /* no-op */ } }
  }
  for (const child of children) {
    slot = namedSlot(currentInstance(card), 'Content Slot');
    if (!slot) {
      warnings.push('Card Content Slot could not be refreshed; remaining content stayed in the original frame.');
      break;
    }
    try {
      slot.appendChild(child);
    } catch (error) {
      warnings.push(`"${child.name}" could not be moved into the Card Content Slot: ${error.message}`);
    }
  }

  if (source.children.length === 0) source.remove();
  else warnings.push('Some source content could not be moved, so the original frame was retained.');
  return card;
}

async function convertSelectionToSection(selection, warnings) {
  const selected = topLevelSelectionNodes(selection);
  if (!selected.length) {
    warnings.push('Select one or more canvas layers to convert to an A1 Section.');
    return null;
  }
  if (selected.length === 1 && selected[0].type === 'INSTANCE' && registeredSetName(selected[0]) === 'Section') {
    warnings.push('The selected layer is already an A1 Section.');
    return null;
  }

  const source = selected.length === 1 ? selected[0] : null;
  const useSourceChildren = source && isSectionContentSource(source) && source.children.length > 0;
  const parent = useSourceChildren ? source.parent : commonParent(selected);
  if (!parent || !('children' in parent) || !('insertChild' in parent)) {
    warnings.push('The selected layers must share a parent that can contain an A1 Section.');
    return null;
  }

  const contentNodes = useSourceChildren
    ? [...source.children].filter((child) => !isAuditReportNode(child))
    : selectedNodesInParentOrder(parent, selected);
  if (!contentNodes.length) {
    warnings.push('No movable content was found for the new A1 Section.');
    return null;
  }

  const insertionIndex = useSourceChildren
    ? parent.children.indexOf(source)
    : Math.min(...contentNodes.map((node) => parent.children.indexOf(node)).filter((index) => index >= 0));
  const section = await createComponentInstance('Section', warnings);
  parent.insertChild(Math.max(0, insertionIndex), section);

  if (useSourceChildren) {
    copySectionPlacement(source, section, parent, warnings);
  } else {
    const bounds = selectionBoundsInParent(contentNodes);
    const placementSource = contentNodes[0];
    if (bounds && !(parent.type !== 'PAGE' && parent.layoutMode && parent.layoutMode !== 'NONE')) {
      try {
        section.x = bounds.x;
        section.y = bounds.y;
        section.resizeWithoutConstraints(bounds.width, section.height);
      } catch (error) {
        warnings.push(`Section placement could not match the selected content bounds: ${error.message}`);
      }
    } else if (placementSource) {
      copySectionPlacement(placementSource, section, parent, warnings);
    }
  }

  const contentWidth = inferredSectionContentWidth(useSourceChildren ? source : null, contentNodes, 'lg');
  applySectionContentWidth(section, contentWidth, warnings);

  let slot = sectionContentContainer(currentInstance(section));
  if (!slot) {
    section.remove();
    warnings.push('The Section Content Slot was not found. The selected content was left unchanged.');
    return null;
  }
  clearSectionSlot(slot);

  let moved = 0;
  for (const child of contentNodes) {
    slot = sectionContentContainer(currentInstance(section));
    if (!slot) {
      warnings.push('Section Content Slot could not be refreshed; remaining content stayed in place.');
      break;
    }
    try {
      slot.appendChild(child);
      normalizeSectionContentChildSizing(child, warnings);
      moved += 1;
    } catch (error) {
      warnings.push(`"${child.name}" could not be moved into the Section Content Slot: ${error.message}`);
    }
  }

  if (useSourceChildren) {
    try {
      if (source.children.length === 0) source.remove();
      else warnings.push('Some source frame content could not be moved, so the original frame was retained.');
    } catch {
      // Groups can be normalized by Figma as their children move. If the
      // source vanished, the successful Section conversion is still complete.
    }
  }
  if (moved === 0) {
    try { section.remove(); } catch { /* no-op */ }
    warnings.push('No selected content could be moved into the new A1 Section.');
    return null;
  }
  fillConvertedLayoutWidth(section, 'Section', warnings);
  return section;
}

function conversionContext(selection, warnings, emptyMessage) {
  const selected = topLevelSelectionNodes(selection);
  if (!selected.length) {
    warnings.push(emptyMessage || 'Select one or more canvas layers to convert.');
    return null;
  }
  const source = selected.length === 1 ? selected[0] : null;
  const useSourceChildren = source && isSectionContentSource(source) && source.children.length > 0;
  const parent = useSourceChildren ? source.parent : commonParent(selected);
  if (!parent || !('children' in parent) || !('insertChild' in parent)) {
    warnings.push('The selected layers must share a parent that can receive the converted A1 component.');
    return null;
  }
  const contentNodes = useSourceChildren
    ? [...source.children].filter((child) => !isAuditReportNode(child))
    : selectedNodesInParentOrder(parent, selected);
  if (!contentNodes.length) {
    warnings.push('No movable content was found for the conversion.');
    return null;
  }
  const insertionIndex = useSourceChildren
    ? parent.children.indexOf(source)
    : Math.min(...contentNodes.map((node) => parent.children.indexOf(node)).filter((index) => index >= 0));
  const bounds = useSourceChildren
    ? { x: source.x, y: source.y, width: source.width, height: source.height }
    : selectionBoundsInParent(contentNodes);
  return { selected, source, useSourceChildren, parent, contentNodes, insertionIndex: Math.max(0, insertionIndex), bounds };
}

function directConversionContext(selection, warnings, emptyMessage) {
  const selected = (selection || [])
    .map(liveNode)
    .filter(Boolean)
    .filter((node) => {
      try {
        return !isAuditReportNode(node) && node.type !== 'PAGE' && node.parent
          && !['COMPONENT', 'COMPONENT_SET', 'SLOT'].includes(node.type);
      } catch {
        return false;
      }
    });
  if (!selected.length) {
    warnings.push(emptyMessage || 'Select one or more canvas layers to convert.');
    return null;
  }
  const parent = commonParent(selected);
  if (!parent || !('children' in parent) || !('insertChild' in parent)) {
    warnings.push('The selected layers must share a parent that can receive the converted A1 component.');
    return null;
  }
  const contentNodes = selectedNodesInParentOrder(parent, selected);
  if (!contentNodes.length) {
    warnings.push('No movable content was found for the conversion.');
    return null;
  }
  const insertionIndex = Math.min(...contentNodes.map((node) => parent.children.indexOf(node)).filter((index) => index >= 0));
  return {
    selected,
    source: selected.length === 1 ? selected[0] : null,
    useSourceChildren: false,
    parent,
    contentNodes,
    insertionIndex: Math.max(0, insertionIndex),
    bounds: selectionBoundsInParent(contentNodes),
  };
}

function textConversionRoots(selection) {
  return (selection || [])
    .map(liveNode)
    .filter(Boolean)
    .filter((node) => {
      try {
        return !isAuditReportNode(node) && node.type !== 'PAGE'
          && !['COMPONENT', 'COMPONENT_SET'].includes(node.type);
      } catch {
        return false;
      }
    });
}

function isInsideNativeSlot(node) {
  try {
    for (let current = node && node.parent; current && current.type !== 'PAGE'; current = current.parent) {
      if (current.type === 'SLOT') return true;
    }
  } catch {
    return false;
  }
  return false;
}

function closestA1ComponentAncestor(node, componentName) {
  try {
    for (let current = liveNode(node); current; current = current.parent) {
      if (current.type === 'INSTANCE' && isA1ComponentInstance(current, componentName)) return current;
    }
  } catch {
    return null;
  }
  return null;
}

function placeConvertedNode(node, context, warnings, options = {}) {
  const { parent, insertionIndex, bounds, source, contentNodes } = context;
  parent.insertChild(insertionIndex, node);
  const reference = source || contentNodes[0];
  try {
    if (parent && parent.type !== 'PAGE' && parent.layoutMode && parent.layoutMode !== 'NONE' && reference) {
      node.layoutAlign = reference.layoutAlign;
      node.layoutGrow = reference.layoutGrow;
      node.layoutSizingHorizontal = reference.layoutSizingHorizontal;
      node.layoutSizingVertical = reference.layoutSizingVertical;
    } else if (bounds) {
      node.x = bounds.x;
      node.y = bounds.y;
      if (options.resize !== false && typeof node.resizeWithoutConstraints === 'function') {
        node.resizeWithoutConstraints(Math.max(1, bounds.width), node.height);
      }
    }
  } catch (error) {
    warnings.push(`Converted component placement could not fully match the selection: ${error.message}`);
  }
}

function removeConvertedSource(context, warnings) {
  const nodes = context.useSourceChildren ? [context.source] : context.contentNodes;
  for (const node of nodes) {
    try {
      if (node && node.parent) node.remove();
    } catch (error) {
      warnings.push(`"${node && node.name ? node.name : 'Selection'}" could not be removed after conversion: ${error.message}`);
    }
  }
}

function isVisibleForTextConversion(node) {
  const current = liveNode(node);
  if (!current) return false;
  try {
    return current.visible !== false;
  } catch {
    return true;
  }
}

function collectTextLayers(root, out = []) {
  const node = liveNode(root);
  if (!node || isAuditReportNode(node) || !isVisibleForTextConversion(node)) return out;
  if (node.type === 'TEXT') {
    out.push(node);
    return out;
  }
  if (node.type === 'INSTANCE') {
    const componentName = registeredSetName(node);
    if (componentName && isA1ComponentInstance(node, componentName)) return out;
  }
  try {
    for (const child of node.children || []) collectTextLayers(child, out);
  } catch {
    // Ignore stale child handles while deriving a label.
  }
  return out;
}

function selectionTextContent(nodes, fallback = '') {
  const text = [];
  for (const node of nodes || []) {
    for (const textNode of collectTextLayers(node)) {
      const value = typeof textNode.characters === 'string' ? textNode.characters.trim() : '';
      if (value) text.push(value);
    }
  }
  const visibleText = text
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  return visibleText || componentTextPropertyContent(nodes) || fallback;
}

function componentTextPropertyContent(nodes) {
  const wanted = ['label', 'text', 'title', 'value', 'defaultvalue', 'buttontext'];
  const fallbackValues = [];
  const visit = (node) => {
    const current = liveNode(node);
    if (!current || isAuditReportNode(current) || !isVisibleForTextConversion(current)) return '';
    if (current.type === 'INSTANCE') {
      const componentName = registeredSetName(current);
      if (componentName && isA1ComponentInstance(current, componentName)) return '';
      try {
        const props = current.componentProperties || {};
        for (const key of Object.keys(props)) {
          const property = props[key];
          const name = canonicalKey(key);
          if (property && property.type === 'TEXT' && wanted.some((part) => name.includes(part))) {
            const value = typeof property.value === 'string' ? property.value.trim() : '';
            if (value) return value;
          }
          if (property && property.type === 'TEXT') {
            const value = typeof property.value === 'string' ? property.value.trim() : '';
            if (value && !name.includes('icon')) fallbackValues.push(value);
          }
        }
      } catch {
        // Some custom instances do not expose componentProperties safely.
      }
    }
    try {
      for (const child of current.children || []) {
        const value = visit(child);
        if (value) return value;
      }
    } catch {
      return '';
    }
    return '';
  };
  for (const node of nodes || []) {
    const value = visit(node);
    if (value) return value;
  }
  return fallbackValues
    .sort((a, b) => b.length - a.length)[0] || '';
}

function nodeBounds(node) {
  const current = liveNode(node);
  if (!current) return null;
  try {
    const box = current.absoluteBoundingBox;
    if (box && Number.isFinite(box.x) && Number.isFinite(box.y) && Number.isFinite(box.width) && Number.isFinite(box.height)) return box;
  } catch {
    // Some Figma node types do not expose absolute bounds.
  }
  try {
    if (Number.isFinite(current.x) && Number.isFinite(current.y) && Number.isFinite(current.width) && Number.isFinite(current.height)) {
      return { x: current.x, y: current.y, width: current.width, height: current.height };
    }
  } catch {
    // Ignore unavailable geometry.
  }
  return null;
}

function conversionInferenceNodes(context) {
  if (context && context.source) return [context.source];
  return context && context.contentNodes ? context.contentNodes : [];
}

function conversionTargetComponentName(target) {
  return {
    'page-layout': 'Page Layout',
    section: 'Section',
    card: 'Card',
    stack: 'Stack',
    grid: 'Grid',
    button: 'Button',
    'text-field': 'Text Field',
    'search-field': 'Search Field',
    textarea: 'Textarea',
    select: 'Select',
    switch: 'Switch',
    'radio-group': 'Radio Group',
    'checkbox-group': 'Checkbox Group',
    'page-nav': 'Page Nav',
    'tree-menu': 'Tree Menu',
    pagination: 'Pagination',
    tabs: 'Tabs',
    'definition-list': 'Definition List Item',
    'definition-item': 'Definition List Item',
    link: 'Link',
    figure: 'Figure',
  }[target] || '';
}

function conversionPreparationRoot(node) {
  const selected = liveNode(node);
  if (!selected) return null;
  let customInstance = null;
  try {
    for (let current = selected; current && current.type !== 'PAGE'; current = current.parent) {
      if (current.type === 'SLOT') return customInstance || selected;
      if (current.type !== 'INSTANCE') continue;
      if (registeredSetName(current)) {
        return current.id === selected.id ? current : (customInstance || selected);
      }
      customInstance = current;
    }
  } catch {
    return selected;
  }
  return customInstance || selected;
}

function prepareSelectionForConversion(selection, target, warnings) {
  const targetComponent = conversionTargetComponentName(target);
  const roots = (selection || [])
    .map(liveNode)
    .filter(Boolean)
    .map(conversionPreparationRoot)
    .filter(Boolean);
  const topLevel = topLevelSelectionNodes(roots);
  if (!topLevel.some((node) => node.type === 'INSTANCE')) return selection;
  const prepared = [];
  for (const node of topLevel) {
    if (node.type !== 'INSTANCE') {
      prepared.push(node);
      continue;
    }
    if (targetComponent && isA1ComponentInstance(node, targetComponent)) {
      prepared.push(node);
      continue;
    }
    try {
      prepared.push(node.detachInstance());
    } catch (error) {
      prepared.push(node);
      warnings.push(`"${node.name}" could not be detached before conversion: ${error.message}`);
    }
  }
  figma.currentPage.selection = prepared;
  return prepared;
}

function firstImagePaintInSelection(nodes) {
  const visit = (node) => {
    const current = liveNode(node);
    if (!current || isAuditReportNode(current)) return null;
    const paint = imagePaintOn(current);
    if (paint) return { node: current, paint };
    if (current.type === 'INSTANCE') {
      const componentName = registeredSetName(current);
      if (componentName && isA1ComponentInstance(current, componentName)) return null;
    }
    try {
      for (const child of current.children || []) {
        const found = visit(child);
        if (found) return found;
      }
    } catch {
      return null;
    }
    return null;
  };
  for (const node of nodes || []) {
    const found = visit(node);
    if (found) return found;
  }
  return null;
}

function nearestFigureSize(width) {
  if (typeof width !== 'number' || !Number.isFinite(width) || width <= 0) return 'sm';
  return FIGURE_SIZES.reduce((nearest, size) =>
    Math.abs(FIGURE_MAX_WIDTHS[size] - width) < Math.abs(FIGURE_MAX_WIDTHS[nearest] - width)
      ? size
      : nearest, 'sm');
}

function nearestFigureAspectRatio(width, height) {
  if (typeof width !== 'number' || typeof height !== 'number' || !Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return '16:9';
  const ratio = width / height;
  return FIGURE_ASPECT_RATIOS.reduce((nearest, option) =>
    Math.abs(FIGURE_RATIO_VALUES[option] - ratio) < Math.abs(FIGURE_RATIO_VALUES[nearest] - ratio)
      ? option
      : nearest, '16:9');
}

async function convertSelectionToCard(selection, warnings) {
  const context = conversionContext(selection, warnings, 'Select one or more layers to convert to an A1 Card.');
  if (!context) return null;
  if (context.selected.length === 1 && isA1ComponentInstance(context.selected[0], 'Card')) {
    warnings.push('The selected layer is already an A1 Card.');
    return null;
  }
  const card = await createComponentInstance('Card', warnings);
  placeConvertedNode(card, context, warnings);
  setNodeToFillParentWidth(card, 'Card', warnings);

  let slot = namedSlot(currentInstance(card), 'Content Slot');
  if (!slot) {
    card.remove();
    warnings.push('The Card Content Slot was not found. The selected content was left unchanged.');
    return null;
  }
  for (const child of [...slot.children]) {
    try { child.remove(); } catch { try { child.visible = false; } catch { /* no-op */ } }
  }
  let moved = 0;
  for (const child of context.contentNodes) {
    slot = namedSlot(currentInstance(card), 'Content Slot');
    if (!slot) {
      warnings.push('Card Content Slot could not be refreshed; remaining content stayed in place.');
      break;
    }
    try {
      slot.appendChild(child);
      moved += 1;
    } catch (error) {
      warnings.push(`"${child.name}" could not be moved into the Card Content Slot: ${error.message}`);
    }
  }
  if (context.useSourceChildren) {
    try {
      if (context.source.children.length === 0) context.source.remove();
      else warnings.push('Some source frame content could not be moved, so the original frame was retained.');
    } catch {
      // Figma may normalize a group as its children move.
    }
  }
  if (moved === 0) {
    try { card.remove(); } catch { /* no-op */ }
    warnings.push('No selected content could be moved into the new A1 Card.');
    return null;
  }
  return card;
}

function inferredStackDirection(nodes, source) {
  if (source && source.layoutMode === 'HORIZONTAL') return 'row';
  if (source && source.layoutMode === 'VERTICAL') return 'column';
  if (!nodes || nodes.length < 2) return 'column';
  const bounds = nodes
    .map(nodeBounds)
    .filter(Boolean);
  if (bounds.length < 2) return 'column';
  const minCenterX = Math.min(...bounds.map((box) => box.x + box.width / 2));
  const maxCenterX = Math.max(...bounds.map((box) => box.x + box.width / 2));
  const minCenterY = Math.min(...bounds.map((box) => box.y + box.height / 2));
  const maxCenterY = Math.max(...bounds.map((box) => box.y + box.height / 2));
  return (maxCenterX - minCenterX) > (maxCenterY - minCenterY) * 1.25 ? 'row' : 'column';
}

function inferredLayoutGap(nodes, direction) {
  if (!nodes || nodes.length < 2) return 'md';
  const bounds = nodes
    .map(nodeBounds)
    .filter(Boolean)
    .sort((a, b) => direction === 'row' ? a.x - b.x : a.y - b.y);
  const gaps = [];
  for (let index = 1; index < bounds.length; index += 1) {
    const previous = bounds[index - 1];
    const current = bounds[index];
    const gap = direction === 'row'
      ? current.x - (previous.x + previous.width)
      : current.y - (previous.y + previous.height);
    if (Number.isFinite(gap) && gap >= 0) gaps.push(gap);
  }
  if (!gaps.length) return 'md';
  const average = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
  return nearestStackGap(average);
}

function inferredGridColumns(nodes, bounds, source) {
  if (source && source.layoutMode === 'GRID') {
    const columns = figmaNumber(source.gridColumnCount, NaN);
    if (Number.isInteger(columns) && columns > 0) return columns;
  }
  if (!nodes || nodes.length <= 1) return 1;
  const childWidths = nodes
    .map((node) => nodeBounds(node))
    .filter(Boolean)
    .map((box) => box.width)
    .filter((width) => Number.isFinite(width) && width > 0)
    .sort((a, b) => a - b);
  const medianWidth = childWidths[Math.floor(childWidths.length / 2)];
  if (bounds && medianWidth) {
    return Math.max(1, Math.min(nodes.length, Math.round(bounds.width / medianWidth)));
  }
  return Math.min(nodes.length, 2);
}

function fillConvertedTextWidth(text, warnings) {
  const parent = text && text.parent;
  if (!parent || !['HORIZONTAL', 'VERTICAL', 'GRID'].includes(parent.layoutMode)) return;
  try {
    if (parent.layoutMode === 'VERTICAL') {
      text.layoutAlign = 'STRETCH';
      text.layoutSizingHorizontal = 'FILL';
    } else if (parent.layoutMode === 'HORIZONTAL') {
      text.layoutGrow = 1;
    } else {
      text.layoutSizingHorizontal = 'FILL';
    }
    text.textAutoResize = 'HEIGHT';
  } catch (error) {
    warnings.push(`Converted text could not be set to fill the parent width: ${error.message}`);
  }
}

async function replaceSlotTextWithA1Text(text, suggestion, warnings) {
  const parent = text && text.parent;
  if (!parent || !('insertChild' in parent)) return null;
  const [family, size, weight] = String(suggestion.styleName || '').split('/');
  const isHeading = suggestion.type === 'Heading';
  const node = isHeading
    ? {
      type: 'Heading',
      props: {
        as: 'h2',
        type: family === 'display' ? 'display' : 'heading',
        size: size || 'md',
        color: suggestion.color || 'default',
        align: suggestion.align || 'left',
      },
      content: { fallback: text.characters || '' },
    }
    : {
      type: 'Paragraph',
      props: {
        size: size || 'md',
        color: suggestion.color || 'default',
        align: suggestion.align || 'left',
        ...(weight ? { weight } : {}),
      },
      content: { fallback: text.characters || '' },
    };
  const replacement = await importTextNode(node, warnings);
  const index = parent.children.indexOf(text);
  parent.insertChild(index >= 0 ? index : parent.children.length, replacement);
  try {
    if (!parent.layoutMode || parent.layoutMode === 'NONE') {
      replacement.x = text.x;
      replacement.y = text.y;
      if (typeof replacement.resizeWithoutConstraints === 'function') {
        replacement.resizeWithoutConstraints(Math.max(1, text.width), replacement.height);
      }
    } else {
      replacement.layoutAlign = text.layoutAlign;
      replacement.layoutGrow = text.layoutGrow;
      replacement.layoutSizingHorizontal = text.layoutSizingHorizontal;
      replacement.layoutSizingVertical = text.layoutSizingVertical;
    }
  } catch (error) {
    warnings.push(`Converted slot text placement could not fully match the original text: ${error.message}`);
  }
  try {
    text.remove();
  } catch (error) {
    warnings.push(`Original slot text could not be removed after conversion: ${error.message}`);
  }
  fillConvertedTextWidth(replacement, warnings);
  replacement.name = isHeading ? 'Heading' : 'Paragraph';
  return replacement;
}

function fillConvertedLayoutWidth(node, type, warnings) {
  const parent = node && node.parent;
  if (!parent || !['HORIZONTAL', 'VERTICAL', 'GRID'].includes(parent.layoutMode)) return;
  try {
    if (parent.layoutMode === 'VERTICAL') {
      node.layoutAlign = 'STRETCH';
      node.layoutSizingHorizontal = 'FILL';
    } else if (parent.layoutMode === 'HORIZONTAL') {
      node.layoutGrow = 1;
    } else {
      node.layoutSizingHorizontal = 'FILL';
    }
  } catch (error) {
    warnings.push(`Converted ${type} could not be set to fill the parent width: ${error.message}`);
  }
}

function clearConvertedContainerChrome(frame, type, warnings) {
  if (!frame) return;
  const clear = (description, fn) => {
    try {
      fn();
    } catch (error) {
      warnings.push(`Converted ${type} ${description} could not be cleared: ${error.message}`);
    }
  };
  clear('background', () => { frame.fills = []; });
  clear('fill style', () => { if ('fillStyleId' in frame) frame.fillStyleId = ''; });
  clear('border', () => { frame.strokes = []; });
  clear('stroke style', () => { if ('strokeStyleId' in frame) frame.strokeStyleId = ''; });
  clear('effects', () => { frame.effects = []; });
  clear('effect style', () => { if ('effectStyleId' in frame) frame.effectStyleId = ''; });
  clear('corner radius', () => {
    frame.cornerRadius = 0;
    frame.topLeftRadius = 0;
    frame.topRightRadius = 0;
    frame.bottomRightRadius = 0;
    frame.bottomLeftRadius = 0;
  });
}

async function normalizeExistingStackFrame(frame, warnings) {
  const suggestion = stackSuggestion(frame);
  await applyStackSuggestion(frame, suggestion, warnings);
  const nearestGap = nearestStackGap(frame.itemSpacing);
  await bindGapProperty(frame, 'itemSpacing', nearestGap, warnings, 'Stack item spacing');
  if (frame.layoutWrap === 'WRAP') await bindGapProperty(frame, 'counterAxisSpacing', nearestGap, warnings, 'Stack wrap row spacing');
  syncStackPropsName(frame);
  clearConvertedContainerChrome(frame, 'Stack', warnings);
  fillConvertedLayoutWidth(frame, 'Stack', warnings);
  return frame;
}

async function normalizeExistingGridFrame(frame, warnings, options = {}) {
  await applyGridSuggestion(frame, gridSuggestion(frame), warnings);
  const responsiveColumns = normalizeResponsiveColumns(options.responsiveColumns);
  const previewBreakpoint = breakpointForWidth(frame.width, 'md');
  const requestedColumns = responsiveColumns ? responsiveColumnsAt(responsiveColumns, previewBreakpoint) : null;
  const currentColumnCount = figmaNumber(frame.gridColumnCount, NaN);
  frame.gridColumnCount = requestedColumns || (Number.isInteger(currentColumnCount) && currentColumnCount > 0 ? currentColumnCount : 1);
  try {
    frame.gridColumnSizes.forEach((track) => {
      track.type = 'FLEX';
      track.value = 1;
    });
  } catch {
    // Older grid frames may reject track edits; their count/gaps are still normalized.
  }
  frame.name = 'Grid';
  clearConvertedContainerChrome(frame, 'Grid', warnings);
  defineResponsiveGridBreakpoints(frame, figmaNumber(frame.gridColumnCount, 1) || 1, frame.width, warnings, responsiveColumns);
  fillConvertedLayoutWidth(frame, 'Grid', warnings);
  return frame;
}

async function convertSelectionToStack(selection, warnings) {
  const context = conversionContext(selection, warnings, 'Select one or more layers to convert to an A1 Stack.');
  if (!context) return null;
  if (context.selected.length === 1 && isStackFrame(context.selected[0])) {
    return await normalizeExistingStackFrame(context.selected[0], warnings);
  }
  const direction = inferredStackDirection(context.contentNodes, context.source);
  const gap = inferredLayoutGap(context.contentNodes, direction);
  const stack = figma.createFrame();
  stack.name = 'Stack';
  stack.clipsContent = false;
  clearConvertedContainerChrome(stack, 'Stack', warnings);
  if (context.bounds) {
    try {
      stack.resizeWithoutConstraints(Math.max(1, context.bounds.width), Math.max(1, context.bounds.height));
    } catch (error) {
      warnings.push(`Stack bounds could not match the selection: ${error.message}`);
    }
  }
  const { align } = await applyStack(stack, { type: 'Stack', props: { direction, gap, align: 'stretch' } }, warnings);
  syncStackPropsName(stack);
  placeConvertedNode(stack, context, warnings);
  fillConvertedLayoutWidth(stack, 'Stack', warnings);
  let moved = 0;
  for (const child of context.contentNodes) {
    try {
      stack.appendChild(child);
      moved += 1;
    } catch (error) {
      warnings.push(`"${child.name}" could not be moved into the Stack: ${error.message}`);
    }
  }
  setStackChildrenAlignment(stack, align, warnings);
  if (context.useSourceChildren) {
    try {
      if (context.source.children.length === 0) context.source.remove();
      else warnings.push('Some source frame content could not be moved, so the original frame was retained.');
    } catch {
      // Figma may normalize a group as its children move.
    }
  }
  if (moved === 0) {
    try { stack.remove(); } catch { /* no-op */ }
    warnings.push('No selected content could be moved into the new A1 Stack.');
    return null;
  }
  return stack;
}

async function convertSelectionToGrid(selection, warnings, options = {}) {
  const context = conversionContext(selection, warnings, 'Select one or more layers to convert to an A1 Grid.');
  if (!context) return null;
  if (context.selected.length === 1 && isGridFrame(context.selected[0])) {
    return await normalizeExistingGridFrame(context.selected[0], warnings, options);
  }
  const responsiveColumns = normalizeResponsiveColumns(options.responsiveColumns);
  const previewBreakpoint = breakpointForWidth(context.bounds && context.bounds.width, 'md');
  const columns = responsiveColumns
    ? responsiveColumnsAt(responsiveColumns, previewBreakpoint)
    : inferredGridColumns(context.contentNodes, context.bounds, context.source);
  const gap = inferredLayoutGap(context.contentNodes, 'row');
  const grid = figma.createFrame();
  grid.name = 'Grid';
  grid.clipsContent = false;
  clearConvertedContainerChrome(grid, 'Grid', warnings);
  if (context.bounds) {
    try {
      grid.resizeWithoutConstraints(Math.max(1, context.bounds.width), Math.max(1, context.bounds.height));
    } catch (error) {
      warnings.push(`Grid bounds could not match the selection: ${error.message}`);
    }
  }
  await applyGrid(grid, { type: 'Grid', props: { columns, gap, alignItems: 'stretch' } }, warnings);
  grid.name = 'Grid';
  placeConvertedNode(grid, context, warnings);
  fillConvertedLayoutWidth(grid, 'Grid', warnings);
  let moved = 0;
  for (const child of context.contentNodes) {
    try {
      grid.appendChild(child);
      try {
        child.layoutSizingHorizontal = 'FILL';
      } catch {
        // Some nodes cannot fill grid cells; their original width is preserved.
      }
      moved += 1;
    } catch (error) {
      warnings.push(`"${child.name}" could not be moved into the Grid: ${error.message}`);
    }
  }
  if (context.useSourceChildren) {
    try {
      if (context.source.children.length === 0) context.source.remove();
      else warnings.push('Some source frame content could not be moved, so the original frame was retained.');
    } catch {
      // Figma may normalize a group as its children move.
    }
  }
  if (moved === 0) {
    try { grid.remove(); } catch { /* no-op */ }
    warnings.push('No selected content could be moved into the new A1 Grid.');
    return null;
  }
  defineResponsiveGridBreakpoints(grid, columns, context.bounds && context.bounds.width, warnings, responsiveColumns);
  return grid;
}

async function convertSelectionToText(selection, kind, warnings) {
  const selected = textConversionRoots(selection);
  const texts = [];
  for (const node of selected) collectTextLayers(node, texts);
  if (!texts.length) {
    warnings.push(`Select at least one text layer or a frame containing text to convert to ${kind === 'heading' ? 'Heading' : 'Body'}.`);
    return [];
  }
  const affected = [];
  for (const text of texts) {
    const fontSize = text.fontSize === figma.mixed ? undefined : text.fontSize;
    const align = conversionTextAlignment(text, warnings, kind === 'heading' ? 'Converted Heading' : 'Converted Body');
    const size = kind === 'heading'
      ? nearestTextSize(HEADING_FONT_SIZES, fontSize, 'md')
      : nearestTextSize(PARAGRAPH_FONT_SIZES, fontSize, 'md');
    const color = kind === 'heading'
      ? (textColorToken(text) || 'default')
      : (['default', 'muted'].includes(textColorToken(text)) ? textColorToken(text) : 'default');
    const suggestion = kind === 'heading'
      ? { type: 'Heading', styleName: `heading/${size}`, color, align }
      : { type: 'Paragraph', styleName: `body/${size}`, color, align };
    if (isInsideNativeSlot(text)) {
      const replacement = await replaceSlotTextWithA1Text(text, suggestion, warnings);
      if (replacement) {
        affected.push(replacement);
        continue;
      }
      warnings.push('Slot text could not be replaced, so the plugin tried to style the selected text in place.');
    }
    await applyTextSuggestion(text, suggestion, warnings);
    if (kind !== 'link') {
      try { text.textDecoration = 'NONE'; } catch { /* no-op */ }
    }
    fillConvertedTextWidth(text, warnings);
    text.name = kind === 'heading' ? 'Heading' : 'Paragraph';
    affected.push(text);
  }
  return affected;
}

async function convertSelectionToButton(selection, warnings) {
  const liveSelection = (selection || []).map(liveNode).filter(Boolean);
  if (liveSelection.length === 1 && closestA1ComponentAncestor(liveSelection[0], 'Button')) {
    warnings.push('The selected layer is already inside an A1 Button.');
    return null;
  }
  const contextWarnings = [];
  let context = conversionContext(selection, contextWarnings, 'Select text or a layer to convert to an A1 Button.');
  if (context) warnings.push(...contextWarnings);
  else context = directConversionContext(selection, warnings, 'Select text or a layer to convert to an A1 Button.');
  if (!context) return null;
  const inferenceNodes = conversionInferenceNodes(context);
  const fallbackLabel = context.source && context.source.name ? context.source.name : 'Button';
  const label = selectionTextContent(inferenceNodes, fallbackLabel);
  if (label === fallbackLabel) warnings.push(`Button label was inferred from the selected layer name "${fallbackLabel}" because no visible text or text property was found.`);
  const button = await importButton({ type: 'Button', props: { variant: 'secondary' }, content: { fallback: label } }, warnings);
  placeConvertedNode(button, context, warnings, { resize: false });
  removeConvertedSource(context, warnings);
  return button;
}

async function convertSelectionToSwitch(selection, warnings) {
  const liveSelection = (selection || []).map(liveNode).filter(Boolean);
  if (liveSelection.length === 1 && closestA1ComponentAncestor(liveSelection[0], 'Switch')) {
    warnings.push('The selected layer is already inside an A1 Switch.');
    return null;
  }
  const contextWarnings = [];
  let context = conversionContext(selection, contextWarnings, 'Select text or a layer to convert to an A1 Switch.');
  if (context) warnings.push(...contextWarnings);
  else context = directConversionContext(selection, warnings, 'Select text or a layer to convert to an A1 Switch.');
  if (!context) return null;
  const inferenceNodes = conversionInferenceNodes(context);
  const fallbackLabel = context.source && context.source.name ? context.source.name : 'Enable option';
  const label = selectionTextContent(inferenceNodes, fallbackLabel);
  if (label === fallbackLabel) warnings.push(`Switch label was inferred from the selected layer name "${fallbackLabel}" because no visible text or text property was found.`);
  const switchNode = await importSwitch({ type: 'Switch', props: { label } }, warnings);
  placeConvertedNode(switchNode, context, warnings, { resize: false });
  removeConvertedSource(context, warnings);
  return switchNode;
}

function conversionTextValues(nodes) {
  const values = [];
  for (const node of nodes || []) {
    for (const textNode of collectTextLayers(node)) {
      const value = textLayerPlainContent(textNode).replace(/\s+/g, ' ').trim();
      if (value) values.push(value);
    }
  }
  return values;
}

function uniqueOptionTexts(values) {
  const seen = new Set();
  const out = [];
  for (const value of values || []) {
    const label = String(value || '').trim();
    if (!label) continue;
    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(label);
  }
  return out;
}

function optionValueFromLabel(label, index) {
  const slug = String(label || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || `option-${index + 1}`;
}

function formConversionContext(selection, warnings, label) {
  const contextWarnings = [];
  let context = conversionContext(selection, contextWarnings, `Select text or a layer to convert to an A1 ${label}.`);
  if (context) warnings.push(...contextWarnings);
  else context = directConversionContext(selection, warnings, `Select text or a layer to convert to an A1 ${label}.`);
  return context;
}

function formTextParts(context, fallbackLabel) {
  const values = conversionTextValues(conversionInferenceNodes(context));
  const label = values[0] || fallbackLabel;
  return {
    values,
    label,
    value: values[1] || '',
    hint: values[2] || '',
  };
}

async function convertSelectionToFormField(selection, target, warnings) {
  const componentName = ADD_TARGET_COMPONENT_NAMES[target] || CONVERT_TARGET_LABELS[target] || 'form component';
  const liveSelection = (selection || []).map(liveNode).filter(Boolean);
  if (liveSelection.length === 1 && closestA1ComponentAncestor(liveSelection[0], componentName)) {
    warnings.push(`The selected layer is already inside an A1 ${componentName}.`);
    return null;
  }
  const context = formConversionContext(selection, warnings, componentName);
  if (!context) return null;
  const fallbackLabel = context.source && context.source.name ? context.source.name : componentName;
  const parts = formTextParts(context, fallbackLabel);
  if (parts.label === fallbackLabel) warnings.push(`${componentName} label was inferred from the selected layer name "${fallbackLabel}" because no visible text or text property was found.`);

  let node = null;
  if (target === 'text-field') {
    node = { type: 'TextField', props: { label: parts.label, ...(parts.value ? { defaultValue: parts.value } : {}), ...(parts.hint ? { hint: parts.hint } : {}), size: 'default' } };
  } else if (target === 'search-field') {
    node = { type: 'SearchField', props: { label: parts.label, ...(parts.value ? { defaultValue: parts.value } : {}), size: 'default' } };
  } else if (target === 'textarea') {
    node = { type: 'TextareaField', props: { label: parts.label, ...(parts.value ? { defaultValue: parts.value } : {}), ...(parts.hint ? { hint: parts.hint } : {}), size: 'default' } };
  } else if (target === 'select') {
    node = { type: 'SelectField', props: { label: parts.label, ...(parts.value ? { defaultValue: parts.value, showValue: true } : {}), ...(parts.hint ? { hint: parts.hint } : {}), size: 'default' } };
  }
  if (!node) return null;

  const instance = await renderImportedNode(node, warnings);
  placeConvertedNode(instance, context, warnings, { resize: false });
  setNodeToFillParentWidth(instance, componentName, warnings);
  removeConvertedSource(context, warnings);
  return instance;
}

async function convertSelectionToChoiceGroup(selection, target, warnings) {
  const componentName = target === 'radio-group' ? 'Radio Group' : 'Checkbox Group';
  const liveSelection = (selection || []).map(liveNode).filter(Boolean);
  if (liveSelection.length === 1 && closestA1ComponentAncestor(liveSelection[0], componentName)) {
    warnings.push(`The selected layer is already inside an A1 ${componentName}.`);
    return null;
  }
  const context = formConversionContext(selection, warnings, componentName);
  if (!context) return null;
  const fallbackLabel = context.source && context.source.name ? context.source.name : componentName;
  const values = uniqueOptionTexts(conversionTextValues(conversionInferenceNodes(context)));
  const useFirstAsLabel = values.length >= 3;
  const label = useFirstAsLabel ? values[0] : fallbackLabel;
  const optionLabels = (useFirstAsLabel ? values.slice(1) : values).slice(0, 20);
  while (optionLabels.length < 2) optionLabels.push(`Option ${optionLabels.length + 1}`);
  if (label === fallbackLabel && !useFirstAsLabel) warnings.push(`${componentName} label was inferred from the selected layer name "${fallbackLabel}". Select at least three text layers to infer a group label plus options.`);
  const options = optionLabels.map((optionLabel, index) => ({
    value: optionValueFromLabel(optionLabel, index),
    label: optionLabel,
  }));
  const type = target === 'radio-group' ? 'RadioGroup' : 'CheckboxGroup';
  const props = {
    label,
    options,
    size: 'default',
    defaultValue: target === 'radio-group' ? options[0].value : [options[0].value],
  };
  const instance = await renderImportedNode({ type, props }, warnings);
  placeConvertedNode(instance, context, warnings, { resize: false });
  setNodeToFillParentWidth(instance, componentName, warnings);
  removeConvertedSource(context, warnings);
  return instance;
}

async function convertSelectionToPagination(selection, warnings) {
  const liveSelection = (selection || []).map(liveNode).filter(Boolean);
  if (liveSelection.length === 1 && closestA1ComponentAncestor(liveSelection[0], 'Pagination')) {
    warnings.push('The selected layer is already inside an A1 Pagination component.');
    return null;
  }
  const contextWarnings = [];
  let context = conversionContext(selection, contextWarnings, 'Select a layer to convert to an A1 Pagination component.');
  if (context) warnings.push(...contextWarnings);
  else context = directConversionContext(selection, warnings, 'Select a layer to convert to an A1 Pagination component.');
  if (!context) return null;
  const pagination = await importPagination({ type: 'Pagination', props: { size: 'md' } }, warnings);
  placeConvertedNode(pagination, context, warnings, { resize: false });
  removeConvertedSource(context, warnings);
  return pagination;
}

function pageNavSectionsFromSelection(nodes) {
  const labels = uniqueOptionTexts(conversionTextValues(nodes)).slice(0, PAGE_NAV_MAX_SECTIONS);
  const usedValues = new Set();
  const sections = labels.map((label, index) => ({
    id: slugifyOptionValue(label, usedValues),
    label,
    level: index > 1 ? 2 : 1,
  }));
  if (sections.length) return sections;
  return [
    { id: 'overview', label: 'Overview', level: 1 },
    { id: 'getting-started', label: 'Getting started', level: 1 },
    { id: 'details', label: 'Details', level: 2 },
  ];
}

async function convertSelectionToPageNav(selection, warnings) {
  const liveSelection = (selection || []).map(liveNode).filter(Boolean);
  if (liveSelection.length === 1 && closestA1ComponentAncestor(liveSelection[0], 'Page Nav')) {
    warnings.push('The selected layer is already inside an A1 Page Nav component.');
    return null;
  }
  const contextWarnings = [];
  let context = conversionContext(selection, contextWarnings, 'Select one or more text layers to convert to A1 Page Nav.');
  if (context) warnings.push(...contextWarnings);
  else context = directConversionContext(selection, warnings, 'Select one or more text layers to convert to A1 Page Nav.');
  if (!context) return null;
  const values = uniqueOptionTexts(conversionTextValues(conversionInferenceNodes(context)));
  if (values.length > PAGE_NAV_MAX_SECTIONS) {
    warnings.push(`Page Nav supports ${PAGE_NAV_MAX_SECTIONS} Figma section rows; ${values.length - PAGE_NAV_MAX_SECTIONS} additional selected label(s) were not rendered.`);
  }
  if (!values.length) warnings.push('No visible text labels were found; default Page Nav sections were used.');
  const pageNav = await importPageNav({
    type: 'PageNav',
    props: {
      label: 'On this page',
      sections: pageNavSectionsFromSelection(conversionInferenceNodes(context)),
    },
  }, warnings);
  placeConvertedNode(pageNav, context, warnings, { resize: false });
  setNodeToFillParentWidth(pageNav, 'Page Nav', warnings);
  removeConvertedSource(context, warnings);
  return pageNav;
}

function treeMenuItemsFromSelection(nodes) {
  const entries = [];
  const usedLabels = new Set();
  const add = (label, bounds) => {
    const value = String(label || '').replace(/\s+/g, ' ').trim();
    if (!value || usedLabels.has(value.toLowerCase())) return;
    usedLabels.add(value.toLowerCase());
    entries.push({
      label: value.length > 72 ? value.slice(0, 69).trimEnd() + '…' : value,
      x: bounds && Number.isFinite(bounds.x) ? bounds.x : 0,
      y: bounds && Number.isFinite(bounds.y) ? bounds.y : entries.length,
    });
  };
  for (const node of nodes || []) {
    for (const textNode of collectTextLayers(node)) {
      const text = textLayerPlainContent(textNode).trim();
      if (!text) continue;
      const bounds = nodeBounds(textNode);
      for (const line of text.split(/\n+/)) add(line, bounds);
    }
  }
  if (!entries.length) {
    entries.push(
      { label: 'Overview', x: 0, y: 0 },
      { label: 'Details', x: 0, y: 1 },
      { label: 'Settings', x: 0, y: 2 },
    );
  }

  entries.sort((a, b) => Math.abs(a.y - b.y) < 4 ? a.x - b.x : a.y - b.y);
  const minX = Math.min(...entries.map((entry) => entry.x));
  const usedIds = new Set();
  const roots = [];
  const stack = [];
  for (const entry of entries.slice(0, TREE_MENU_MAX_ITEMS)) {
    const depth = Math.max(0, Math.min(4, Math.round((entry.x - minX) / 24)));
    const item = {
      id: slugifyOptionValue(entry.label, usedIds),
      label: entry.label,
    };
    while (stack.length > depth) stack.pop();
    if (stack.length === 0) roots.push(item);
    else {
      const parent = stack[stack.length - 1];
      parent.children = parent.children || [];
      parent.children.push(item);
    }
    stack[depth] = item;
  }
  return roots;
}

function treeMenuExpandedIds(items, out = []) {
  for (const item of items || []) {
    if (item && Array.isArray(item.children) && item.children.length) {
      out.push(item.id);
      treeMenuExpandedIds(item.children, out);
    }
  }
  return out;
}

async function convertSelectionToTreeMenu(selection, warnings) {
  const liveSelection = (selection || []).map(liveNode).filter(Boolean);
  if (liveSelection.length === 1 && closestA1ComponentAncestor(liveSelection[0], 'Tree Menu')) {
    warnings.push('The selected layer is already inside an A1 Tree Menu component.');
    return null;
  }
  const contextWarnings = [];
  let context = conversionContext(selection, contextWarnings, 'Select one or more text layers to convert to A1 Tree Menu.');
  if (context) warnings.push(...contextWarnings);
  else context = directConversionContext(selection, warnings, 'Select one or more text layers to convert to A1 Tree Menu.');
  if (!context) return null;

  const sourceNodes = conversionInferenceNodes(context);
  const textValues = uniqueOptionTexts(conversionTextValues(sourceNodes));
  if (textValues.length > TREE_MENU_MAX_ITEMS) {
    warnings.push(`Tree Menu supports ${TREE_MENU_MAX_ITEMS} Figma item rows; ${textValues.length - TREE_MENU_MAX_ITEMS} additional selected label(s) were not rendered.`);
  }
  if (!textValues.length) warnings.push('No visible text labels were found; default Tree Menu items were used.');
  const items = treeMenuItemsFromSelection(sourceNodes);
  const flatItems = flattenTreeMenuItems(items);
  const selectedId = flatItems[0]?.item?.id || '';
  const treeMenu = await importTreeMenu({
    type: 'TreeMenu',
    props: {
      variant: 'expanded',
      items,
      ...(selectedId ? { selectedId } : {}),
      expandedIds: treeMenuExpandedIds(items),
    },
  }, warnings);
  placeConvertedNode(treeMenu, context, warnings, { resize: false });
  setNodeToFillParentWidth(treeMenu, 'Tree Menu', warnings);
  removeConvertedSource(context, warnings);
  return treeMenu;
}

function tabLabelsFromSelection(nodes) {
  const labels = [];
  const used = new Set();
  const add = (value) => {
    const label = String(value || '').replace(/\s+/g, ' ').trim();
    if (!label || label.length > 32 || used.has(label.toLowerCase())) return;
    used.add(label.toLowerCase());
    labels.push(label);
  };
  for (const node of nodes || []) {
    for (const textNode of collectTextLayers(node)) {
      const value = typeof textNode.characters === 'string' ? textNode.characters : '';
      for (const line of value.split(/\n+/)) add(line);
    }
  }
  if (labels.length) return labels.slice(0, 12);
  add('Overview');
  add('Details');
  return labels.slice(0, 2);
}

async function convertSelectionToTabs(selection, warnings) {
  const liveSelection = (selection || []).map(liveNode).filter(Boolean);
  if (liveSelection.length === 1 && closestA1ComponentAncestor(liveSelection[0], 'Tabs')) {
    warnings.push('The selected layer is already inside an A1 Tabs component.');
    return null;
  }
  const contextWarnings = [];
  let context = conversionContext(selection, contextWarnings, 'Select one or more layers to convert to A1 Tabs.');
  if (context) warnings.push(...contextWarnings);
  else context = directConversionContext(selection, warnings, 'Select one or more layers to convert to A1 Tabs.');
  if (!context) return null;

  const usedValues = new Set();
  const items = tabLabelsFromSelection(conversionInferenceNodes(context)).map((label) => ({
    id: slugifyOptionValue(label, usedValues),
    label,
  }));
  const activeValue = items[0]?.id || 'overview';
  const tabs = await importTabs({
    type: 'Tabs',
    props: {
      items,
      value: activeValue,
    },
  }, warnings);
  placeConvertedNode(tabs, context, warnings, { resize: false });
  setNodeToFillParentWidth(tabs, 'Tabs', warnings);
  removeConvertedSource(context, warnings);
  return tabs;
}

function definitionListItemsFromSelection(nodes, fallbackLabel = 'Label') {
  const text = selectionTextContent(nodes, '');
  const lines = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const colonRows = lines
    .map((line) => {
      const match = line.match(/^([^:–—-]+)\s*[:–—-]\s*(.+)$/);
      return match ? { label: match[1].trim(), value: match[2].trim() } : null;
    })
    .filter(Boolean);
  if (colonRows.length) return colonRows;

  const values = [];
  for (const node of nodes || []) {
    for (const textNode of collectTextLayers(node)) {
      const value = typeof textNode.characters === 'string' ? textNode.characters.trim() : '';
      if (value) values.push(value);
    }
  }
  if (values.length >= 2) {
    const items = [];
    for (let index = 0; index < values.length; index += 2) {
      items.push({ label: values[index], value: values[index + 1] || '' });
    }
    return items;
  }
  if (text) return [{ label: fallbackLabel, value: text }];
  return [{ label: fallbackLabel, value: 'Value' }];
}

async function convertSelectionToDefinitionItem(selection, warnings) {
  const liveSelection = (selection || []).map(liveNode).filter(Boolean);
  if (liveSelection.length === 1 && closestA1ComponentAncestor(liveSelection[0], 'Definition List Item')) {
    warnings.push('The selected layer is already inside an A1 Definition List Item component.');
    return null;
  }
  const contextWarnings = [];
  let context = conversionContext(selection, contextWarnings, 'Select text or layers to convert to an A1 Definition List Item.');
  if (context) warnings.push(...contextWarnings);
  else context = directConversionContext(selection, warnings, 'Select text or layers to convert to an A1 Definition List Item.');
  if (!context) return null;
  const fallbackLabel = context.source && context.source.name ? context.source.name : 'Label';
  const item = definitionListItemsFromSelection(conversionInferenceNodes(context), fallbackLabel)[0] || { label: fallbackLabel, value: 'Value' };
  const definitionItem = await createDefinitionItem(item, 'row', 'md');
  placeConvertedNode(definitionItem, context, warnings, { resize: false });
  try {
    if (definitionItem.parent && ['HORIZONTAL', 'VERTICAL', 'GRID'].includes(definitionItem.parent.layoutMode)) {
      if (definitionItem.parent.layoutMode === 'VERTICAL') {
        definitionItem.layoutAlign = 'STRETCH';
        definitionItem.layoutSizingHorizontal = 'FILL';
      } else if (definitionItem.parent.layoutMode === 'HORIZONTAL') {
        definitionItem.layoutGrow = 1;
      } else {
        definitionItem.layoutSizingHorizontal = 'FILL';
      }
    }
  } catch (error) {
    warnings.push(`Converted Definition List Item could not be set to fill the parent width: ${error.message}`);
  }
  removeConvertedSource(context, warnings);
  return definitionItem;
}

async function convertSelectionToLink(selection, warnings) {
  const liveSelection = (selection || []).map(liveNode).filter(Boolean);
  if (liveSelection.length === 1 && closestA1ComponentAncestor(liveSelection[0], 'Link')) {
    warnings.push('The selected layer is already inside an A1 Link.');
    return null;
  }
  const contextWarnings = [];
  let context = conversionContext(selection, contextWarnings, 'Select text or a layer to convert to an A1 Link.');
  if (context) warnings.push(...contextWarnings);
  else context = directConversionContext(selection, warnings, 'Select text or a layer to convert to an A1 Link.');
  if (!context) return null;
  const label = selectionTextContent(context.contentNodes, context.source && context.source.name ? context.source.name : 'Link');
  const link = await importLink({ type: 'Link', props: { size: 'md', weight: 'normal' }, content: { fallback: label } }, warnings);
  placeConvertedNode(link, context, warnings, { resize: false });
  removeConvertedSource(context, warnings);
  return link;
}

async function convertSelectionToFigure(selection, warnings) {
  const context = conversionContext(selection, warnings, 'Select an image layer or a frame containing an image to convert to an A1 Figure.');
  if (!context) return null;
  const paintSource = firstImagePaintInSelection(context.contentNodes);
  if (!paintSource || !paintSource.paint) {
    warnings.push('No image fill was found in the selection. Convert to Figure was not applied.');
    return null;
  }
  const size = nearestFigureSize(context.bounds && context.bounds.width);
  const aspectRatio = nearestFigureAspectRatio(context.bounds && context.bounds.width, context.bounds && context.bounds.height);
  const caption = selectionTextContent(context.contentNodes, '');
  const figure = await importFigure({
    type: 'Figure',
    props: {
      src: '',
      alt: context.source && context.source.name ? context.source.name : 'Figure image',
      size,
      aspectRatio,
      ...(caption ? { caption } : {}),
    },
  }, warnings);
  const imageLayer = figureImageLayer(currentInstance(figure));
  if (imageLayer) {
    try {
      imageLayer.fills = [{ ...paintSource.paint, scaleMode: 'FILL' }];
    } catch (error) {
      warnings.push(`The selected image fill could not be moved into the Figure: ${error.message}`);
    }
  } else {
    warnings.push('The Figure Image layer was not found, so the selected image fill could not be applied.');
  }
  placeConvertedNode(figure, context, warnings);
  removeConvertedSource(context, warnings);
  return figure;
}

async function convertSelectionToPageLayout(selection, warnings) {
  const selected = topLevelSelectionNodes(selection);
  if (selected.length === 1 && selected[0].type === 'INSTANCE' && registeredSetName(selected[0]) === 'Page Layout') {
    warnings.push('The selected layer is already an A1 Page Layout.');
    return null;
  }
  const source = selected.length === 1 ? selected[0] : null;
  if (source && source.type === 'FRAME' && pageLayoutCandidateHeader(source)) {
    return convertFrameToPageLayout(source, warnings);
  }

  const context = conversionContext(selection, warnings, 'Select a frame or content to convert to an A1 Page Layout.');
  if (!context) return null;

  const header = context.contentNodes.find((node) => node.type === 'INSTANCE' && registeredSetName(node) === 'Top Header') || null;
  const contentChildren = context.contentNodes.filter((node) => node !== header);
  if (!contentChildren.length) {
    warnings.push('No page content was found to move into the Page Layout.');
    return null;
  }

  const pageLayout = await createComponentInstance('Page Layout', warnings);
  placeConvertedNode(pageLayout, context, warnings);
  const breakpoint = breakpointForWidth(context.bounds && context.bounds.width, 'md');
  const pageLayoutAssignments = {};
  queueComponentProperty(pageLayout, pageLayoutAssignments, 'Breakpoint', breakpoint, 'VARIANT', warnings, 'Page Layout breakpoint preview');
  applyQueuedProperties(pageLayout, pageLayoutAssignments, warnings, 'Page Layout properties');
  pageLayout.setPluginData(A1_BREAKPOINT_KEY, breakpoint);

  const nestedHeader = pageLayoutTopHeader(pageLayout);
  if (nestedHeader) {
    const headerAssignments = {};
    queueComponentProperty(nestedHeader, headerAssignments, 'Breakpoint', breakpoint, 'VARIANT', warnings, 'Top Header breakpoint preview');
    applyQueuedProperties(nestedHeader, headerAssignments, warnings, 'Top Header properties');
    if (header) {
      const exportedHeader = exportTopHeader(header);
      warnings.push(...exportedHeader.warnings);
      await applyTopHeader(nestedHeader, exportedHeader.node, warnings);
      const refreshedHeaderAssignments = {};
      queueComponentProperty(nestedHeader, refreshedHeaderAssignments, 'Breakpoint', breakpoint, 'VARIANT', warnings, 'Top Header breakpoint preview');
      applyQueuedProperties(nestedHeader, refreshedHeaderAssignments, warnings, 'Top Header properties');
    }
  } else {
    warnings.push('The Page Layout component has no nested Top Header instance, so header settings were not applied.');
  }

  let slot = pageLayoutContentSlot(pageLayout);
  if (!slot) {
    pageLayout.remove();
    warnings.push('The Page Content Slot was not found. The selected content was left unchanged.');
    return null;
  }
  for (const child of [...slot.children]) {
    try { child.remove(); } catch { try { child.visible = false; } catch { /* no-op */ } }
  }

  let moved = 0;
  for (const child of contentChildren) {
    slot = pageLayoutContentSlot(pageLayout);
    if (!slot) {
      warnings.push('Page Content Slot could not be refreshed; remaining content stayed in place.');
      break;
    }
    try {
      slot.appendChild(child);
      moved += 1;
    } catch (error) {
      warnings.push(`"${child.name}" could not be moved into the Page Content Slot: ${error.message}`);
    }
  }
  if (header) {
    try { header.remove(); } catch { try { header.visible = false; } catch { /* no-op */ } }
  }
  if (context.useSourceChildren) {
    try {
      if (context.source.children.length === 0) context.source.remove();
      else warnings.push('Some source frame content could not be moved, so the original frame was retained.');
    } catch {
      // Figma may normalize a group as its children move.
    }
  }
  if (moved === 0) {
    try { pageLayout.remove(); } catch { /* no-op */ }
    warnings.push('No selected content could be moved into the new A1 Page Layout.');
    return null;
  }
  return pageLayout;
}

async function convertFrameToPageLayout(source, warnings) {
  const parent = source.parent;
  if (!parent || !('children' in parent) || !('insertChild' in parent)) {
    warnings.push('The selected frame cannot be replaced with a Page Layout in its current parent.');
    return null;
  }
  const header = pageLayoutCandidateHeader(source);
  if (!header) {
    warnings.push('No Top Header instance was found inside the selected frame.');
    return null;
  }
  const contentChildren = pageLayoutCandidateContent(source, header);
  if (!contentChildren.length) {
    warnings.push('No page content was found to move into the Page Layout.');
    return null;
  }

  const sourceIndex = parent.children.indexOf(source);
  const pageLayout = await createComponentInstance('Page Layout', warnings);
  parent.insertChild(Math.max(0, sourceIndex), pageLayout);
  copyPageLayoutPlacement(source, pageLayout, parent, warnings);
  const breakpoint = breakpointForWidth(source.width);
  const pageLayoutAssignments = {};
  queueComponentProperty(pageLayout, pageLayoutAssignments, 'Breakpoint', breakpoint, 'VARIANT', warnings, 'Page Layout breakpoint preview');
  applyQueuedProperties(pageLayout, pageLayoutAssignments, warnings, 'Page Layout properties');
  pageLayout.setPluginData(A1_BREAKPOINT_KEY, breakpoint);

  const nestedHeader = pageLayoutTopHeader(pageLayout);
  if (nestedHeader) {
    const exportedHeader = exportTopHeader(header);
    warnings.push(...exportedHeader.warnings);
    await applyTopHeader(nestedHeader, exportedHeader.node, warnings);
    const headerAssignments = {};
    queueComponentProperty(nestedHeader, headerAssignments, 'Breakpoint', breakpoint, 'VARIANT', warnings, 'Top Header breakpoint preview');
    applyQueuedProperties(nestedHeader, headerAssignments, warnings, 'Top Header properties');
  } else {
    warnings.push('The Page Layout component has no nested Top Header instance, so header settings were not applied.');
  }

  let slot = pageLayoutContentSlot(pageLayout);
  if (!slot) {
    pageLayout.remove();
    warnings.push('The Page Content Slot was not found. The original frame was left unchanged.');
    return null;
  }
  for (const child of [...slot.children]) {
    try { child.remove(); } catch { try { child.visible = false; } catch { /* no-op */ } }
  }
  for (const child of contentChildren) {
    slot = pageLayoutContentSlot(pageLayout);
    if (!slot) {
      warnings.push('Page Content Slot could not be refreshed; remaining content stayed in the original frame.');
      break;
    }
    try {
      slot.appendChild(child);
    } catch (error) {
      warnings.push(`"${child.name}" could not be moved into the Page Content Slot: ${error.message}`);
    }
  }
  try {
    header.remove();
  } catch {
    try { header.visible = false; } catch { /* no-op */ }
  }

  if (source.children.length === 0) source.remove();
  else warnings.push('Some source content could not be moved, so the original frame was retained.');
  return pageLayout;
}

async function handleFixCard() {
  const selection = figma.currentPage.selection;
  const source = selection.length === 1 ? liveNode(selection[0]) : null;
  const suggestion = cardSuggestion(source);
  if (!source || !suggestion || suggestion.fixes.length === 0) {
    return postError('Select a padded white frame with content (and either a border or at least two child layers) to convert it to an A1 Card.');
  }
  const warnings = [];
  let card = null;
  try {
    card = await convertFrameToCard(source, warnings);
  } catch (error) {
    warnings.push(error.message);
  }
  if (!card) return postError(warnings.join('\n') || 'The selected frame could not be converted to an A1 Card.');
  figma.currentPage.selection = [card];
  figma.viewport.scrollAndZoomIntoView([card]);
  figma.notify('Converted the selected frame to an A1 Card.');
  postPluginMessage({
    type: 'card-fix-result',
    warnings,
    message: 'Converted the selected frame to an A1 Card and moved its content into the Card Content Slot.',
  });
  scheduleAutoExport();
}

async function handleFixPageLayout() {
  const selection = figma.currentPage.selection;
  const source = selection.length === 1 ? liveNode(selection[0]) : null;
  const suggestion = pageLayoutSuggestion(source);
  if (!source || !suggestion || suggestion.fixes.length === 0) {
    postPluginMessage({
      type: 'page-layout-fix-result',
      warnings: [],
      message: 'No Page Layout AutoFix was applied. Select a plain frame that contains a Top Header instance and page content.',
    });
    return;
  }
  const warnings = [];
  let pageLayout = null;
  try {
    pageLayout = await convertFrameToPageLayout(source, warnings);
  } catch (error) {
    warnings.push(error.message);
  }
  if (!pageLayout) {
    postPluginMessage({
      type: 'page-layout-fix-result',
      warnings,
      message: warnings.join('\n') || 'The selected frame could not be converted to an A1 Page Layout.',
    });
    return;
  }
  figma.currentPage.selection = [pageLayout];
  figma.viewport.scrollAndZoomIntoView([pageLayout]);
  figma.notify('Converted the selected frame to an A1 Page Layout.');
  postPluginMessage({
    type: 'page-layout-fix-result',
    warnings,
    message: 'Converted the selected frame to an A1 Page Layout and moved its content into the Page Content Slot.',
  });
  scheduleAutoExport();
}

async function handleConvertToSection() {
  await handleConvertTo('section', 'section-convert-result');
}

async function handleConvertTo(target, resultType = 'convert-result', options = {}) {
  const normalized = typeof target === 'string' ? target.toLowerCase() : '';
  const warnings = [];
  const selection = prepareSelectionForConversion(figma.currentPage.selection, normalized, warnings);
  let affected = [];
  let message = '';
  try {
    if (normalized === 'page-layout') {
      const pageLayout = await convertSelectionToPageLayout(selection, warnings);
      if (pageLayout) {
        affected = [pageLayout];
        message = 'Converted the selection to an A1 Page Layout and moved page content into the Page Content Slot.';
      }
    } else if (normalized === 'section') {
      const section = await convertSelectionToSection(selection, warnings);
      if (section) {
        affected = [section];
        message = 'Converted the selection to an A1 Section, inferred contentWidth, and moved the content into the Section Content Slot.';
      }
    } else if (normalized === 'card') {
      const card = await convertSelectionToCard(selection, warnings);
      if (card) {
        affected = [card];
        message = 'Converted the selection to an A1 Card and moved the content into the Card Content Slot.';
      }
    } else if (normalized === 'stack') {
      const stack = await convertSelectionToStack(selection, warnings);
      if (stack) {
        affected = [stack];
        message = 'Converted the selection to an A1 Stack.';
      }
    } else if (normalized === 'grid') {
      const grid = await convertSelectionToGrid(selection, warnings, options);
      if (grid) {
        affected = [grid];
        message = 'Converted the selection to an A1 Grid.';
      }
    } else if (normalized === 'heading' || normalized === 'body') {
      affected = await convertSelectionToText(selection, normalized, warnings);
      if (affected.length) {
        message = normalized === 'heading'
          ? `Converted ${affected.length} text ${affected.length === 1 ? 'layer' : 'layers'} to A1 Heading and set text to Fill where supported.`
          : `Converted ${affected.length} text ${affected.length === 1 ? 'layer' : 'layers'} to A1 Body and set text to Fill where supported.`;
      }
    } else if (normalized === 'button') {
      const button = await convertSelectionToButton(selection, warnings);
      if (button) {
        affected = [button];
        message = 'Converted the selection to an A1 Button.';
      }
    } else if (['text-field', 'search-field', 'textarea', 'select'].includes(normalized)) {
      const field = await convertSelectionToFormField(selection, normalized, warnings);
      if (field) {
        affected = [field];
        message = `Converted the selection to an A1 ${CONVERT_TARGET_LABELS[normalized]}.`;
      }
    } else if (normalized === 'switch') {
      const switchNode = await convertSelectionToSwitch(selection, warnings);
      if (switchNode) {
        affected = [switchNode];
        message = 'Converted the selection to an A1 Switch.';
      }
    } else if (normalized === 'radio-group' || normalized === 'checkbox-group') {
      const group = await convertSelectionToChoiceGroup(selection, normalized, warnings);
      if (group) {
        affected = [group];
        message = `Converted the selection to an A1 ${CONVERT_TARGET_LABELS[normalized]}.`;
      }
    } else if (normalized === 'page-nav') {
      const pageNav = await convertSelectionToPageNav(selection, warnings);
      if (pageNav) {
        affected = [pageNav];
        message = 'Converted the selected text to an A1 Page Nav.';
      }
    } else if (normalized === 'tree-menu') {
      const treeMenu = await convertSelectionToTreeMenu(selection, warnings);
      if (treeMenu) {
        affected = [treeMenu];
        message = 'Converted the selected text to an A1 Tree Menu.';
      }
    } else if (normalized === 'pagination') {
      const pagination = await convertSelectionToPagination(selection, warnings);
      if (pagination) {
        affected = [pagination];
        message = 'Converted the selection to an A1 Pagination component.';
      }
    } else if (normalized === 'tabs') {
      const tabs = await convertSelectionToTabs(selection, warnings);
      if (tabs) {
        affected = [tabs];
        message = 'Converted the selected text to A1 Tabs and created Tab items in the Tabs slot.';
      }
    } else if (normalized === 'definition-item' || normalized === 'definition-list') {
      const definitionItem = await convertSelectionToDefinitionItem(selection, warnings);
      if (definitionItem) {
        affected = [definitionItem];
        message = 'Converted the selection to an A1 Definition List Item.';
      }
    } else if (normalized === 'link') {
      const link = await convertSelectionToLink(selection, warnings);
      if (link) {
        affected = [link];
        message = 'Converted the selection to an A1 Link.';
      }
    } else if (normalized === 'figure') {
      const figure = await convertSelectionToFigure(selection, warnings);
      if (figure) {
        affected = [figure];
        message = 'Converted the selection to an A1 Figure.';
      }
    } else {
      warnings.push('Choose a supported conversion target: Page Layout, Section, Card, Stack, Grid, Heading, Body, Button, Text Field, Search Field, Textarea, Select, Switch, Radio Group, Checkbox Group, Page Nav, Tree Menu, Pagination, Tabs, Definition Item, Link, or Figure.');
    }
  } catch (error) {
    warnings.push(error.message);
  }

  if (!affected.length) {
    postPluginMessage({
      type: resultType,
      warnings,
      message: warnings.join('\n') || 'No conversion was applied.',
    });
    return;
  }

  figma.currentPage.selection = affected;
  figma.viewport.scrollAndZoomIntoView(affected);
  figma.notify(message);
  postPluginMessage({ type: resultType, warnings, message });
  scheduleAutoExport();
}

const CONVERT_TARGET_LABELS = {
  'page-layout': 'Page Layout',
  'top-header': 'Top Header',
  section: 'Section',
  card: 'Card',
  stack: 'Stack',
  grid: 'Grid',
  heading: 'Heading',
  body: 'Body',
  button: 'Button',
  'icon-button': 'Icon Button',
  'button-container': 'Button Container',
  switch: 'Switch',
  pagination: 'Pagination',
  'definition-item': 'Definition List Item',
  'definition-list': 'Definition List',
  chip: 'Chip',
  'chip-group': 'Chip Group',
  link: 'Link',
  figure: 'Figure',
  banner: 'Banner',
  badge: 'Badge',
  blockquote: 'Blockquote',
  'empty-state': 'Empty State',
  'text-field': 'Text Field',
  'search-field': 'Search Field',
  textarea: 'Textarea',
  select: 'Select',
  'radio-group': 'Radio Group',
  'checkbox-group': 'Checkbox Group',
  'page-nav': 'Page Nav',
  'tree-menu': 'Tree Menu',
  'segmented-control': 'Segmented Control',
  tabs: 'Tabs',
  accordion: 'Accordion',
  tooltip: 'Tooltip',
  divider: 'Divider',
  menu: 'Menu',
  dialog: 'Dialog',
};

function defaultNodeForAddTarget(target, options = {}) {
  const normalized = typeof target === 'string' ? target.toLowerCase() : '';
  const id = `${normalized || 'component'}-${Date.now()}`;
  if (normalized === 'page-layout') {
    return {
      id,
      type: 'PageLayout',
      props: { showHeader: true, showSidebar: false, showFooter: false },
      children: [
        { id: `${id}-section`, type: 'Section', props: { surface: 'page', padding: 'lg', contentWidth: 'lg', gap: 'md' }, children: [
          { id: `${id}-heading`, type: 'Heading', props: { as: 'h1', type: 'display', size: 'md' }, content: { fallback: 'Page title' } },
          { id: `${id}-body`, type: 'Paragraph', props: { size: 'md', color: 'muted' }, content: { fallback: 'Page supporting text.' } },
        ] },
      ],
    };
  }
  if (normalized === 'top-header') {
    return {
      id,
      type: 'TopHeader',
      props: {
        logoText: 'A1:Figma',
        navItems: [{ id: 'overview', label: 'Overview', icon: 'dashboard', active: true }],
        actions: [{ id: 'settings', label: 'Settings', icon: 'settings' }],
        loginButton: { label: 'Sign in' },
      },
    };
  }
  if (normalized === 'section') {
    return {
      id,
      type: 'Section',
      props: { surface: 'page', padding: 'lg', contentWidth: 'lg', gap: 'lg' },
      children: [
        { id: `${id}-heading`, type: 'Heading', props: { as: 'h2', type: 'heading', size: 'md' }, content: { fallback: 'Section heading' } },
        { id: `${id}-body`, type: 'Paragraph', props: { size: 'md', color: 'muted' }, content: { fallback: 'Section body text.' } },
      ],
    };
  }
  if (normalized === 'card') {
    return {
      id,
      type: 'Card',
      props: { icon: 'star' },
      children: [
        { id: `${id}-heading`, type: 'Heading', props: { as: 'h2', type: 'heading', size: 'md' }, content: { fallback: 'Card title' } },
        { id: `${id}-body`, type: 'Paragraph', props: { size: 'md', color: 'muted' }, content: { fallback: 'Card supporting text.' } }
      ]
    };
  }
  if (normalized === 'stack') {
    return {
      id,
      type: 'Stack',
      props: { direction: 'column', gap: 'md', align: 'stretch' },
      children: [
        { id: `${id}-body`, type: 'Paragraph', props: { size: 'md' }, content: { fallback: 'Stack content' } }
      ]
    };
  }
  if (normalized === 'grid') {
    const responsiveColumns = normalizeResponsiveColumns(options.responsiveColumns);
    return {
      id,
      type: 'Grid',
      props: { columns: responsiveColumns || 2, gap: 'md', alignItems: 'stretch' },
      children: [
        { id: `${id}-one`, type: 'Card', children: [{ id: `${id}-one-body`, type: 'Paragraph', props: { size: 'sm' }, content: { fallback: 'Grid item' } }] },
        { id: `${id}-two`, type: 'Card', children: [{ id: `${id}-two-body`, type: 'Paragraph', props: { size: 'sm' }, content: { fallback: 'Grid item' } }] }
      ]
    };
  }
  if (normalized === 'heading') {
    return { id, type: 'Heading', props: { as: 'h2', type: 'heading', size: 'md' }, content: { fallback: 'Add a heading' } };
  }
  if (normalized === 'body') {
    return { id, type: 'Paragraph', props: { size: 'md' }, content: { fallback: 'Add body text.' } };
  }
  if (normalized === 'button') {
    return { id, type: 'Button', props: { variant: 'secondary', size: 'md' }, content: { fallback: 'Button' } };
  }
  if (normalized === 'icon') {
    return { id, type: 'Icon', props: { name: 'star', size: 'lg' } };
  }
  if (normalized === 'icon-button') {
    return { id, type: 'IconButton', props: { icon: 'settings', label: 'Settings', variant: 'secondary', size: 'md' } };
  }
  if (normalized === 'button-container') {
    return {
      id,
      type: 'ButtonContainer',
      props: { align: 'start' },
      children: [
        { id: `${id}-primary`, type: 'Button', props: { variant: 'primary', size: 'md' }, content: { fallback: 'Primary' } },
        { id: `${id}-secondary`, type: 'Button', props: { variant: 'secondary', size: 'md' }, content: { fallback: 'Secondary' } },
      ],
    };
  }
  if (normalized === 'switch') {
    return { id, type: 'Switch', props: { label: 'Enable setting', size: 'comfortable' } };
  }
  if (normalized === 'pagination') {
    return { id, type: 'Pagination', props: { page: 1, totalPages: 5, size: 'sm' } };
  }
  if (normalized === 'page-nav') {
    return {
      id,
      type: 'PageNav',
      props: {
        label: 'On this page',
        sections: [
          { id: 'overview', label: 'Overview', level: 1 },
          { id: 'getting-started', label: 'Getting started', level: 1 },
          { id: 'installation', label: 'Installation', level: 2 },
          { id: 'configuration', label: 'Configuration', level: 2 },
          { id: 'api-reference', label: 'API reference', level: 1 },
        ],
      },
    };
  }
  if (normalized === 'tree-menu') {
    return {
      id,
      type: 'TreeMenu',
      props: {
        variant: 'expanded',
        selectedId: 'invoices',
        expandedIds: ['account', 'billing'],
        showExpandControls: false,
        draggable: false,
        items: [
          {
            id: 'account',
            label: 'Account',
            icon: 'manage_accounts',
            children: [
              { id: 'profile', label: 'Profile', icon: 'person' },
              { id: 'security', label: 'Security', icon: 'lock' },
              {
                id: 'billing',
                label: 'Billing',
                icon: 'credit_card',
                children: [
                  { id: 'invoices', label: 'Invoices', icon: 'receipt_long' },
                  { id: 'payment', label: 'Payment methods', icon: 'payment' },
                ],
              },
            ],
          },
          { id: 'notifications', label: 'Notifications', icon: 'notifications' },
          { id: 'integrations', label: 'Integrations', icon: 'extension' },
        ],
      },
    };
  }
  if (normalized === 'link') {
    return { id, type: 'Link', props: { size: 'md', href: '#' }, content: { fallback: 'Add a link' } };
  }
  if (normalized === 'breadcrumb') {
    return {
      id,
      type: 'Breadcrumb',
      props: {
        backLabel: 'Back',
        items: [
          { id: 'home', label: 'Home', href: '/' },
          { id: 'section', label: 'Section', href: '#' },
          { id: 'current', label: 'Current page' },
        ],
      },
    };
  }
  if (normalized === 'code') {
    return {
      id,
      type: 'Code',
      props: { variant: 'block', wrapping: true, copyCode: false },
      content: { fallback: "import { Button } from '@gtivr4/a1-design-system-react'\n\n<Button>Continue</Button>" },
    };
  }
  if (normalized === 'inline') {
    return {
      id,
      type: 'Inline',
      props: { inlineElement: 'all' },
      content: { fallback: 'Example paragraph with **strong** text, `code`, and [kbd:⌘K].' },
    };
  }
  if (normalized === 'banner') {
    return {
      id,
      type: 'Banner',
      props: { status: 'info', title: 'Banner title' },
      children: [
        { id: `${id}-body`, type: 'Paragraph', props: { size: 'sm', color: 'muted' }, content: { fallback: 'Banner supporting text.' } },
      ],
    };
  }
  if (normalized === 'badge') {
    return { id, type: 'MessageBadge', props: { status: 'info', size: 'md', icon: 'info' }, content: { fallback: 'Badge' } };
  }
  if (normalized === 'blockquote') {
    return { id, type: 'Blockquote', props: { variant: 'border', cite: 'Citation' }, content: { fallback: 'Add a quote' } };
  }
  if (normalized === 'definition-list') {
    return {
      id,
      type: 'DefinitionList',
      props: {
        direction: 'row',
        size: 'md',
        items: [
          { id: `${id}-one`, label: 'Label', value: 'Value' },
          { id: `${id}-two`, label: 'Another label', value: 'Another value' },
        ],
      },
    };
  }
  if (normalized === 'chip' || normalized === 'chip-group') {
    return {
      id,
      type: 'ChipGroup',
      props: {
        size: 'md',
        behavior: 'multiple',
        items: [
          { id: 'chip', title: 'Chip' },
        ],
      },
    };
  }
  if (normalized === 'bottom-sheet') {
    return {
      id,
      type: 'BottomSheet',
      props: { title: 'Filters', defaultDetent: 1 },
      children: [
        { id: `${id}-body`, type: 'Paragraph', props: { size: 'sm', color: 'muted' }, content: { fallback: 'Bottom sheet content.' } },
      ],
    };
  }
  if (normalized === 'empty-state') {
    return { id, type: 'MessageEmptyState', props: { scale: 'section', icon: 'inventory_2', title: 'Empty state', description: 'Add a helpful empty-state description.' } };
  }
  if (normalized === 'text-field') {
    return { id, type: 'TextField', props: { label: 'Text field', hint: 'Supporting text', defaultValue: 'Value', size: 'default' } };
  }
  if (normalized === 'search-field') {
    return { id, type: 'SearchField', props: { label: 'Search', defaultValue: 'Search query', size: 'default' } };
  }
  if (normalized === 'textarea') {
    return { id, type: 'TextareaField', props: { label: 'Textarea', hint: 'Supporting text', defaultValue: 'Textarea value', showCount: true, maxLength: 120, size: 'default' } };
  }
  if (normalized === 'select') {
    return { id, type: 'SelectField', props: { label: 'Select option', hint: 'Choose one option.', showValue: true, defaultValue: 'Selected value', size: 'default' } };
  }
  if (normalized === 'radio-group') {
    return {
      id,
      type: 'RadioGroup',
      props: {
        label: 'Radio group',
        defaultValue: 'one',
        options: [
          { value: 'one', label: 'Option one' },
          { value: 'two', label: 'Option two' },
        ],
      },
    };
  }
  if (normalized === 'checkbox-group') {
    return {
      id,
      type: 'CheckboxGroup',
      props: {
        label: 'Checkbox group',
        defaultValue: ['one'],
        options: [
          { value: 'one', label: 'Option one' },
          { value: 'two', label: 'Option two' },
        ],
      },
    };
  }
  if (normalized === 'segmented-control') {
    return {
      id,
      type: 'SegmentedControl',
      props: {
        size: 'md',
        value: 'one',
        options: [
          { value: 'one', label: 'One' },
          { value: 'two', label: 'Two' },
        ],
      },
    };
  }
  if (normalized === 'tabs') {
    return {
      id,
      type: 'Tabs',
      props: {
        items: [
          { id: 'overview', label: 'Overview' },
          { id: 'details', label: 'Details' },
        ],
        value: 'overview',
      },
      children: [
        { id: `${id}-panel`, type: 'Paragraph', props: { size: 'sm', color: 'muted' }, content: { fallback: 'Active tab panel content.' } },
      ],
    };
  }
  if (normalized === 'accordion') {
    return {
      id,
      type: 'Accordion',
      props: { label: 'Accordion item', subtext: 'Optional subtext', defaultOpen: true, size: 'md' },
      children: [
        { id: `${id}-body`, type: 'Paragraph', props: { size: 'sm', color: 'muted' }, content: { fallback: 'Accordion content.' } },
      ],
    };
  }
  if (normalized === 'tooltip') {
    return { id, type: 'Tooltip', props: { content: 'Tooltip content', placement: 'top' } };
  }
  if (normalized === 'divider') {
    return { id, type: 'Divider', props: { variant: 'subtle', lineStyle: 'solid', size: 'xs' } };
  }
  if (normalized === 'menu') {
    return {
      id,
      type: 'Menu',
      props: {
        items: [
          { id: 'open', label: 'Open', icon: 'open_in_new' },
          { id: 'sync', label: 'Sync', icon: 'sync', active: true },
          { id: 'divider', kind: 'divider' },
          { id: 'delete', label: 'Delete', icon: 'delete', destructive: true },
        ],
      },
    };
  }
  if (normalized === 'dialog') {
    return {
      id,
      type: 'Dialog',
      props: {
        title: 'Dialog title',
        body: 'Dialog body text.',
        size: 'md',
        status: 'none',
        footerActions: [
          { id: `${id}-cancel`, type: 'Button', props: { variant: 'secondary', size: 'md' }, content: { fallback: 'Cancel' } },
          { id: `${id}-confirm`, type: 'Button', props: { variant: 'primary', size: 'md' }, content: { fallback: 'Confirm' } },
        ],
      },
    };
  }
  if (normalized === 'figure') {
    return {
      id,
      type: 'Figure',
      props: {
        alt: 'Placeholder image',
        size: 'md',
        aspectRatio: '16:9',
        caption: 'Figure caption'
      }
    };
  }
  return null;
}

function addInsertionContext(selection) {
  const selected = topLevelSelectionNodes(selection);
  if (selected.length === 1) {
    const container = addableContainerForSelection(selected[0]);
    if (container) {
      return {
        parent: container,
        index: container.children.length,
        bounds: null,
        inside: true
      };
    }
  }
  const parent = commonParent(selected);
  const bounds = selectionBoundsInParent(selected);
  if (parent && 'children' in parent && 'insertChild' in parent) {
    const indexes = selected
      .map((node) => parent.children.indexOf(node))
      .filter((index) => index >= 0);
    return {
      parent,
      index: indexes.length ? Math.max(...indexes) + 1 : parent.children.length,
      bounds
    };
  }
  return {
    parent: figma.currentPage,
    index: figma.currentPage.children.length,
    bounds: null
  };
}

function addableContainerForSelection(node) {
  const current = liveNode(node);
  if (!current || !('children' in current)) return null;
  if (current.type === 'INSTANCE') {
    return pageLayoutContentSlot(current)
      || sectionContentContainer(current)
      || namedSlot(current, 'Content Slot')
      || nativeSlot(current, 'Content Slot')
      || null;
  }
  if (current.type === 'SLOT') return current;
  if (['FRAME', 'GROUP', 'SECTION'].includes(current.type) && 'insertChild' in current) return current;
  return null;
}

function placeAddedNode(node, context, warnings) {
  const parent = context && context.parent ? context.parent : figma.currentPage;
  const index = context && Number.isInteger(context.index) ? context.index : parent.children.length;
  try {
    if ('insertChild' in parent) parent.insertChild(Math.max(0, Math.min(index, parent.children.length)), node);
    else parent.appendChild(node);
  } catch (error) {
    warnings.push(`Added component could not be inserted near the selection: ${error.message}`);
    figma.currentPage.appendChild(node);
  }

  if (parent.type === 'PAGE' || !parent.layoutMode || parent.layoutMode === 'NONE') {
    const bounds = context && context.bounds;
    try {
      if (context && context.inside) {
        node.x = 24;
        node.y = 24;
      } else {
        node.x = bounds ? bounds.x + bounds.width + 24 : Math.round(figma.viewport.center.x);
        node.y = bounds ? bounds.y : Math.round(figma.viewport.center.y);
      }
    } catch (error) {
      warnings.push(`Added component position could not be adjusted: ${error.message}`);
    }
  } else if (parent.layoutMode === 'VERTICAL') {
    try {
      node.layoutAlign = 'STRETCH';
      node.layoutSizingHorizontal = 'FILL';
    } catch {
      // Some inserted instances do not expose fill sizing; keep their default.
    }
  } else if (parent.layoutMode === 'HORIZONTAL') {
    try {
      node.layoutGrow = 1;
    } catch {
      // Some inserted instances do not expose grow; keep their default.
    }
  } else if (parent.layoutMode === 'GRID') {
    try {
      node.layoutSizingHorizontal = 'FILL';
    } catch {
      // Some inserted instances do not expose fill sizing; keep their default.
    }
  }
}

const ADD_TARGET_COMPONENT_NAMES = {
  'page-layout': 'Page Layout',
  'top-header': 'Top Header',
  section: 'Section',
  card: 'Card',
  button: 'Button',
  'icon-button': 'Icon Button',
  link: 'Link',
  breadcrumb: 'Breadcrumb',
  banner: 'Banner',
  badge: 'Badge',
  chip: 'Chip',
  'chip-group': 'Chip Group',
  'bottom-sheet': 'Bottom Sheet',
  blockquote: 'Blockquote',
  code: 'Code',
  inline: 'Inline',
  'definition-list': 'Definition List',
  'empty-state': 'Empty State',
  'text-field': 'Text Field',
  'search-field': 'Search Field',
  textarea: 'Textarea',
  select: 'Select',
  switch: 'Switch',
  'radio-group': 'Radio Group',
  'checkbox-group': 'Checkbox Group',
  'page-nav': 'Page Nav',
  'tree-menu': 'Tree Menu',
  'button-container': 'Button Container',
  'segmented-control': 'Segmented Control',
  tabs: 'Tabs',
  pagination: 'Pagination',
  menu: 'Menu',
  tooltip: 'Tooltip',
  accordion: 'Accordion',
  dialog: 'Dialog',
  figure: 'Figure',
  divider: 'Divider',
};

async function applyStarterPropsToAddedInstance(target, instance, node, warnings) {
  if (target === 'page-layout') return applyPageLayout(instance, { ...node, children: [] }, warnings);
  if (target === 'top-header') return applyTopHeader(instance, node, warnings);
  if (target === 'section') return applySection(instance, { ...node, children: [] }, warnings);
  if (target === 'card') return applyCard(instance, { ...node, children: [] }, warnings);
  if (target === 'button') return applyButton(instance, node, warnings);
  if (target === 'icon-button') return applyIconButton(instance, node, warnings);
  if (target === 'link') return applyLink(instance, node, warnings);
  if (target === 'breadcrumb') return applyBreadcrumb(instance, node, warnings);
  if (target === 'banner') return applyBanner(instance, { ...node, children: [] }, warnings);
  if (target === 'badge') return applyBadge(instance, node, warnings);
  if (target === 'chip') return applyChip(instance, node, warnings);
  if (target === 'chip-group') return applyChipGroup(instance, node, warnings);
  if (target === 'bottom-sheet') return applyBottomSheet(instance, node, warnings);
  if (target === 'blockquote') return applyBlockquote(instance, node, warnings);
  if (target === 'code') return applyCode(instance, node, warnings);
  if (target === 'inline') return applyInline(instance, node, warnings);
  if (target === 'definition-list') return applyDefinitionList(instance, node, warnings);
  if (target === 'empty-state') return applyEmptyState(instance, node, warnings);
  if (target === 'text-field') return applyTextField(instance, node, warnings);
  if (target === 'search-field') return applySearchField(instance, node, warnings);
  if (target === 'textarea') return applyTextarea(instance, node, warnings);
  if (target === 'select') return applySelect(instance, node, warnings);
  if (target === 'switch') return applySwitch(instance, node, warnings);
  if (target === 'radio-group') return applyRadioGroup(instance, node, warnings);
  if (target === 'checkbox-group') return applyCheckboxGroup(instance, node, warnings);
  if (target === 'page-nav') return applyPageNav(instance, node, warnings);
  if (target === 'tree-menu') return applyTreeMenu(instance, node, warnings);
  if (target === 'button-container') return applyButtonContainer(instance, { ...node, children: [] }, warnings);
  if (target === 'segmented-control') return applySegmentedControl(instance, node, warnings);
  if (target === 'tabs') return applyTabs(instance, { ...node, children: [] }, warnings);
  if (target === 'pagination') return applyPagination(instance, node, warnings);
  if (target === 'menu') return applyMenu(instance, node, warnings);
  if (target === 'tooltip') return applyTooltip(instance, node, warnings);
  if (target === 'accordion') return applyAccordion(instance, { ...node, children: [] }, warnings);
  if (target === 'dialog') return applyDialog(instance, node, warnings);
  if (target === 'figure') return applyFigure(instance, node, warnings);
  if (target === 'divider') return applyDivider(instance, node, warnings);
  return undefined;
}

async function addComponentFromPackage(target, options, warnings) {
  const node = defaultNodeForAddTarget(target, options);
  if (!node) return null;
  if (target === 'heading' || target === 'body') return importTextNode(node, warnings);
  if (target === 'icon' || target === 'stack' || target === 'grid') return renderImportedNode(node, warnings);
  const componentName = ADD_TARGET_COMPONENT_NAMES[target];
  if (!componentName) return null;
  const instance = await createComponentInstance(componentName, warnings);
  await applyStarterPropsToAddedInstance(target, instance, node, warnings);
  if (typeof node.id === 'string') {
    instance.name = node.id;
    instance.setPluginData('a1-json-id', node.id);
  }
  return instance;
}

async function handleAddComponent(target, options = {}) {
  const normalized = typeof target === 'string' ? target.toLowerCase() : '';
  const warnings = [];
  let added = null;
  try {
    if (normalized === 'definition-item') {
      added = await createDefinitionItem({ label: 'Label', value: 'Value' }, 'row', 'md');
      added.name = 'Definition List Item';
    } else {
      added = await addComponentFromPackage(normalized, options, warnings);
      if (!added) warnings.push('Choose a supported Add target from the Build quick-add component list.');
    }
  } catch (error) {
    warnings.push(`Add failed before placement: ${error.message}`);
  }

  if (!added) {
    postPluginMessage({
      type: 'add-component-result',
      warnings,
      message: warnings.join('\n') || 'No component was added.'
    });
    return;
  }

  const context = addInsertionContext(figma.currentPage.selection);
  placeAddedNode(added, context, warnings);
  if (normalized === 'card') setNodeToFillParentWidth(added, 'Card', warnings);
  figma.currentPage.selection = [added];
  figma.viewport.scrollAndZoomIntoView([added]);
  const label = ADD_TARGET_COMPONENT_NAMES[normalized] || CONVERT_TARGET_LABELS[normalized] || 'component';
  const message = `Added an A1 ${label}.`;
  figma.notify(message);
  postPluginMessage({ type: 'add-component-result', warnings, message });
  scheduleAutoExport();
}

function handleApplyGridBreakpoints(options = {}) {
  const warnings = [];
  const responsiveColumns = normalizeResponsiveColumns(options.responsiveColumns);
  if (!responsiveColumns) {
    postPluginMessage({ type: 'grid-breakpoints-result', count: 0, warnings: ['Choose at least one responsive Grid column value.'] });
    return;
  }

  const selected = topLevelSelectionNodes(figma.currentPage.selection);
  const grids = [];
  if (typeof options.gridNodeId === 'string' && options.gridNodeId) {
    try {
      const explicitGrid = liveNode(figma.getNodeById(options.gridNodeId));
      if (isGridFrame(explicitGrid)) grids.push(explicitGrid);
    } catch {
      // Fall back to the current selection below.
    }
  }
  for (const node of selected) {
    if (isGridFrame(node)) {
      grids.push(node);
      continue;
    }
    try {
      grids.push(...node.findAll((child) => isGridFrame(child)));
    } catch {
      // Non-container selections are ignored.
    }
  }
  const unique = Array.from(new Map(grids.map((grid) => [grid.id, grid])).values());
  if (!unique.length) {
    postPluginMessage({ type: 'grid-breakpoints-result', count: 0, warnings: ['Select a Grid frame or a frame containing Grid frames.'] });
    return;
  }

  const names = [];
  for (const grid of unique) {
    const breakpoint = A1_BREAKPOINTS.includes(options.primary)
      ? options.primary
      : breakpointForWidth(grid.width, 'md');
    const columns = responsiveColumnsAt(responsiveColumns, breakpoint) || Object.values(responsiveColumns)[0] || 1;
    const beforeName = grid.name || 'Grid';
    try {
      grid.gridColumnCount = columns;
      grid.gridColumnSizes.forEach((track) => {
        track.type = 'FLEX';
        track.value = 1;
      });
    } catch (error) {
      warnings.push(`"${grid.name || 'Grid'}" preview columns could not be set: ${error.message}`);
    }
    const normalized = syncResponsiveGridColumnsMetadata(grid, responsiveColumns);
    if (normalized) {
      const expectedName = responsiveGridName(beforeName, normalized);
      if (grid.name !== expectedName) {
        try {
          grid.name = expectedName;
        } catch (error) {
          warnings.push(`"${beforeName}" responsive Grid name could not be updated: ${error.message}`);
        }
      }
      names.push(grid.name || expectedName);
    }
    try {
      grid.setPluginData(A1_BREAKPOINT_KEY, breakpoint);
    } catch {
      // The visible layer-name suffix remains the portable contract.
    }
  }

  figma.currentPage.selection = unique;
  figma.notify(`Applied responsive Grid values to ${unique.length} Grid${unique.length === 1 ? '' : 's'}.`);
  postPluginMessage({ type: 'grid-breakpoints-result', count: unique.length, warnings, names });
  scheduleAutoExport();
}

async function handleFixSection() {
  const selection = figma.currentPage.selection;
  if (selection.length !== 1 || selection[0].type !== 'INSTANCE' || registeredSetName(selection[0]) !== 'Section') {
    return postError('Select one Section instance to AutoFix its content gap.');
  }
  const section = selection[0];
  const suggestion = sectionSuggestion(section);
  if (suggestion.fixes.length === 0) {
    postPluginMessage({ type: 'section-fix-result', warnings: [], message: 'This Section content gap already uses an A1-compatible value.' });
    return;
  }
  const warnings = [];
  applySectionSuggestion(section, suggestion, warnings);
  figma.notify('Applied the nearest A1 Section content gap.');
  postPluginMessage({ type: 'section-fix-result', warnings, message: 'Applied the nearest A1 Section content gap.' });
  scheduleAutoExport();
}

function collectAutoFixTargets(selection) {
  const targets = { componentOverrides: [], pageLayouts: [], cards: [], stacks: [], grids: [], sections: [], texts: [] };
  const seen = new Set();
  const visit = (node) => {
    const current = liveNode(node);
    if (!current || seen.has(current.id)) return;
    seen.add(current.id);
    if (['COMPONENT', 'COMPONENT_SET', 'SLOT'].includes(current.type) || isComponentImplementationNode(current)) return;
    if (current.type === 'TEXT') {
      if (textSuggestion(current).issues.length) targets.texts.push(current.id);
      return;
    }
    if (current.type === 'INSTANCE') {
      if (registeredSetName(current) && hasSupportedInstancePaintOverrides(current)) targets.componentOverrides.push(current.id);
      if (registeredSetName(current) === 'Section' && sectionSuggestion(current).fixes.length) targets.sections.push(current.id);
      // Registered instances own their internal implementation layers. Do not
      // rewrite those nested layers as if they were user-authored content.
      return;
    }
    const pageLayout = pageLayoutSuggestion(current);
    const card = pageLayout ? null : cardSuggestion(current);
    if (pageLayout && pageLayout.fixes.length) targets.pageLayouts.push(current.id);
    else if (card && card.fixes.length) targets.cards.push(current.id);
    else if (isStackFrame(current) && stackSuggestion(current).fixes.length) targets.stacks.push(current.id);
    else if (isGridFrame(current) && gridSuggestion(current).fixes.length) targets.grids.push(current.id);
    try {
      for (const child of current.children || []) visit(child);
    } catch {
      // An in-flight Figma instance update can invalidate a child handle.
    }
  };
  for (const node of selection || []) visit(node);
  return targets;
}

function collectTextAutoFixTargets(selection) {
  const out = [];
  const seen = new Set();
  const visit = (node) => {
    const current = liveNode(node);
    if (!current || seen.has(current.id)) return;
    seen.add(current.id);
    if (isAuditReportNode(current) || !isVisibleForTextConversion(current)) return;
    if (['COMPONENT', 'COMPONENT_SET'].includes(current.type) || isComponentImplementationNode(current)) return;
    if (current.type === 'INSTANCE') return;
    if (current.type === 'TEXT') {
      if (textSuggestion(current).issues.length) out.push(current.id);
      return;
    }
    try {
      for (const child of current.children || []) visit(child);
    } catch {
      // An in-flight Figma instance update can invalidate a child handle.
    }
  };
  for (const node of selection || []) visit(node);
  return out;
}

function autoFixTargetCount(selection) {
  const targets = collectAutoFixTargets(selection);
  return targets.componentOverrides.length + targets.pageLayouts.length + targets.cards.length + targets.stacks.length + targets.grids.length + targets.sections.length + targets.texts.length;
}

function auditNodeName(node) {
  try {
    return node && node.name ? node.name : node && node.type ? node.type : 'Unknown layer';
  } catch {
    return 'Unavailable layer';
  }
}

function boundColorVariable(paint) {
  try {
    const binding = paint && paint.boundVariables && paint.boundVariables.color;
    const candidate = Array.isArray(binding) ? binding.find((entry) => entry && entry.id) : binding;
    return candidate && candidate.id ? figma.variables.getVariableById(candidate.id) : null;
  } catch {
    return null;
  }
}

function paintHasValidColorBinding(paint) {
  return Boolean(boundColorVariable(paint));
}

function isVisibleSolidPaint(paint) {
  return Boolean(paint && paint.type === 'SOLID' && paint.visible !== false && (paint.opacity === undefined || paint.opacity > 0));
}

function auditA1TextStyleName(styleName) {
  const name = String(styleName || '').trim().toLowerCase();
  if (/^(heading|display|body)\/(xs|sm|md|lg|xl|xxl|jumbo|xjumbo)$/.test(name)) return true;
  if (/^link\/(xs|sm|md|lg|xl)\/(normal|medium|semibold|bold)$/.test(name)) return true;
  return Object.keys(A1_FIGMA_TEXT_STYLE_KEYS || {}).some((key) => key.toLowerCase() === name);
}

const AUDIT_SEVERITY = {
  blocker: { label: 'JSON blocker', weight: 15 },
  major: { label: 'Major translation issue', weight: 4 },
  minor: { label: 'Minor system hygiene', weight: 1 },
  advisory: { label: 'AutoFix suggestion', weight: 0.5 },
};

function normalizeAuditIssueKey(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/"[^"]+"/g, '"…"')
    .replace(/\b\d+(\.\d+)?\b/g, '#')
    .replace(/\s+/g, ' ')
    .trim();
}

function auditIssueSeverity(issue) {
  const text = String(issue || '').toLowerCase();
  if (text.includes('missing figma component') || text.includes('visible placeholder')) return 'blocker';
  if (text.includes('unsupported') || text.includes('not portable a1 json') || text.includes('could not be translated') || text.includes('cannot be represented')) return 'major';
  if (text.includes('can be improved') || text.includes('autofix') || text.includes('nearest a1')) return 'advisory';
  return 'minor';
}

function auditIssueBucket(report, text, options = {}) {
  if (!report.issueGroups || typeof report.issueGroups !== 'object') report.issueGroups = {};
  const severity = AUDIT_SEVERITY[options.severity] ? options.severity : auditIssueSeverity(text);
  const groupKey = options.groupKey || `${severity}:${normalizeAuditIssueKey(text)}`;
  if (!report.issueGroups[groupKey]) {
    report.issueGroups[groupKey] = {
      key: groupKey,
      severity,
      category: options.category || 'A1 compatibility',
      text,
      count: 0,
    };
  }
  const group = report.issueGroups[groupKey];
  group.count += 1;
  // If later calls mark the same issue family as more severe, keep the larger
  // impact. This prevents a broad family from being under-scored by an early
  // minor sample.
  if ((AUDIT_SEVERITY[severity]?.weight || 0) > (AUDIT_SEVERITY[group.severity]?.weight || 0)) group.severity = severity;
  return group;
}

function auditScoreFromIssueGroups(report) {
  const groups = Object.values(report.issueGroups || {});
  const capBySeverity = { blocker: 45, major: 20, minor: 7, advisory: 3 };
  const totals = { blocker: 0, major: 0, minor: 0, advisory: 0 };
  for (const group of groups) {
    const severity = AUDIT_SEVERITY[group.severity] ? group.severity : 'minor';
    const weight = AUDIT_SEVERITY[severity].weight;
    // Repetition matters a little for confidence/scale, but not linearly:
    // ten identical text-color fixes should feel like one pattern, not ten
    // unrelated failures.
    const repeatFactor = 1 + Math.min(0.25, Math.log2(Math.max(1, group.count)) * 0.04);
    totals[severity] += weight * repeatFactor;
  }
  const deduction = Object.keys(totals).reduce((sum, severity) => sum + Math.min(capBySeverity[severity], totals[severity]), 0);
  return Math.max(0, Math.min(100, Math.round(100 - deduction)));
}

function auditA1CoverageCount(report) {
  return (Number(report.supportedComponents) || 0) + (Number(report.supportedTextStyles) || 0);
}

function auditCoverageScoreCap(report) {
  if (!report || !report.nodeCount) return 100;
  const coverage = auditA1CoverageCount(report);
  if (coverage === 0) return 55;
  if ((Number(report.supportedComponents) || 0) === 0 && report.nodeCount > 8) return 82;
  return 100;
}

function addAuditIssue(report, nodeOrIssue, maybeIssue, options = {}) {
  const issue = maybeIssue === undefined ? nodeOrIssue : maybeIssue;
  if (!issue) return;
  const text = String(issue);
  const node = maybeIssue === undefined ? null : liveNode(nodeOrIssue);
  const group = auditIssueBucket(report, text, options);
  report.issues.push(text);
  if (Array.isArray(report.issueItems)) {
    report.issueItems.push({
      id: `audit-issue-${report.issueItems.length + 1}`,
      text,
      nodeId: node && typeof node.id === 'string' ? node.id : '',
      nodeName: node ? auditNodeName(node) : '',
      severity: group.severity,
      severityLabel: AUDIT_SEVERITY[group.severity]?.label || 'Issue',
      category: group.category,
      groupKey: group.key,
      metricKeys: Array.isArray(options.metricKeys) ? options.metricKeys : [],
    });
  }
}

function addAuditPaintIssues(report, node, propertyName) {
  let paints = null;
  try {
    paints = node && node[propertyName];
  } catch {
    return;
  }
  if (!Array.isArray(paints)) return;
  const missing = paints.filter((paint) => isVisibleSolidPaint(paint) && !paintHasValidColorBinding(paint));
  if (!missing.length) return;
  report.missingColorValues += missing.length;
  addAuditIssue(report, node, `${auditNodeName(node)} has ${missing.length} ${propertyName} color ${missing.length === 1 ? 'value' : 'values'} not bound to a valid A1 color variable.`, {
    severity: 'minor',
    category: 'Color token',
    groupKey: `color-variable:${propertyName}`,
    metricKeys: ['color-values'],
  });
}

function auditSupportedInstancePaintOverrides(report, instance, componentName) {
  const rawPaintNodes = supportedInstancePaintOverrideNodes(instance);
  if (!rawPaintNodes.length) return;
  report.missingColorValues += rawPaintNodes.length;
  const names = rawPaintNodes.slice(0, 3).map(auditNodeName).join(', ');
  const more = rawPaintNodes.length > 3 ? `, and ${rawPaintNodes.length - 3} more` : '';
  addAuditIssue(report, instance, `${componentName} "${auditNodeName(instance)}" has ${rawPaintNodes.length} internal color ${rawPaintNodes.length === 1 ? 'override' : 'overrides'} not bound to valid A1 variables (${names}${more}).`, {
    severity: 'minor',
    category: 'Component override',
    groupKey: `component-color-override:${componentName}`,
    metricKeys: ['a1-components', 'color-values'],
  });
}

function supportedInstancePaintOverrideNodes(instance) {
  const rawPaintNodes = [];
  try {
    const descendants = instance.findAll((node) => {
      try {
        if (node.type === 'SLOT' || isAuditReportNode(node)) return false;
        const paintGroups = [];
        if (Array.isArray(node.fills)) paintGroups.push(node.fills);
        if (Array.isArray(node.strokes)) paintGroups.push(node.strokes);
        return paintGroups.some((paints) =>
          paints.some((paint) => isVisibleSolidPaint(paint) && !paintHasValidColorBinding(paint)));
      } catch {
        return false;
      }
    });
    for (const node of descendants) rawPaintNodes.push(node);
  } catch {
    return [];
  }
  return rawPaintNodes;
}

function hasSupportedInstancePaintOverrides(instance) {
  return supportedInstancePaintOverrideNodes(instance).length > 0;
}

function resetSupportedInstancePaintOverrides(instance, warnings) {
  const nodes = supportedInstancePaintOverrideNodes(instance);
  let count = 0;
  for (const node of nodes) {
    try {
      if (typeof node.resetOverrides === 'function') {
        node.resetOverrides();
        count += 1;
      } else {
        warnings.push(`"${auditNodeName(node)}" has a color override, but this Figma node cannot reset overrides through the plugin API.`);
      }
    } catch (error) {
      warnings.push(`"${auditNodeName(node)}" color override could not be reset: ${error.message}`);
    }
  }
  return count;
}

function addAuditReviewIssues(report, node, review) {
  if (!review || !Array.isArray(review.issues) || review.issues.length === 0) return;
  report.autoFixOpportunities += 1;
  addAuditIssue(report, node, `${auditNodeName(node)} can be improved: ${review.issues[0]}`, {
    severity: 'advisory',
    category: 'AutoFix',
    groupKey: `autofix:${normalizeAuditIssueKey(review.issues[0])}`,
    metricKeys: ['autofix'],
  });
}

function supportedInstanceSlots(instance) {
  try {
    return instance.findAll((node) => node.type === 'SLOT');
  } catch {
    return [];
  }
}

const AUDIT_SUPPORTED_PRIVATE_COMPONENTS = new Set([
  'Checkbox Option',
  'Definition List Item',
  'Icon',
  'Menu Item',
  'Nav icon',
  'Page Nav Item',
  'Radio Option',
  'Segmented Control Item',
  'Tab',
  'Tab Item',
  'Top Header Nav Item',
]);
const AUDIT_REPORT_COMPONENT_NAME = 'A1 Audit Report Card';
const AUDIT_REPORT_TEMPLATE_KEY = 'a1-audit-template';
const AUDIT_IGNORE_MARKER = ' [A1 ignore]';

function nameHasAuditIgnoreMarker(node) {
  try {
    return Boolean(node && typeof node.name === 'string' && /ignore/i.test(node.name));
  } catch {
    return false;
  }
}

function isAuditIgnoredNode(node) {
  try {
    for (let current = node; current && current.type !== 'PAGE'; current = current.parent) {
      if (nameHasAuditIgnoreMarker(current)) return true;
    }
  } catch {
    return false;
  }
  return false;
}

function auditIgnoredName(name) {
  const current = String(name || 'Layer');
  return /ignore/i.test(current) ? current : `${current}${AUDIT_IGNORE_MARKER}`;
}

function privateA1ImplementationComponentName(instance) {
  const name = componentSetName(instance);
  if (AUDIT_SUPPORTED_PRIVATE_COMPONENTS.has(name)) return name;
  const iconName = materialIconNameFromInstance(instance);
  if (iconName) return `Icon (${iconName})`;
  try {
    return AUDIT_SUPPORTED_PRIVATE_COMPONENTS.has(instance.name) ? instance.name : '';
  } catch {
    return '';
  }
}

function auditPrivateComponentName(instance) {
  return privateA1ImplementationComponentName(instance);
}

function isAuditReportNode(node) {
  try {
    return Boolean(
      node
      && typeof node.getPluginData === 'function'
      && (node.getPluginData('a1-audit-report') === 'true' || node.getPluginData(AUDIT_REPORT_TEMPLATE_KEY) === 'true')
    );
  } catch {
    return false;
  }
}

function findExistingAuditReportCard() {
  try {
    return figma.currentPage.findOne((node) => {
      try {
        return typeof node.getPluginData === 'function' && node.getPluginData('a1-audit-report') === 'true';
      } catch {
        return false;
      }
    });
  } catch {
    return null;
  }
}

function auditSelection(selection) {
  const roots = Array.isArray(selection) && selection.length ? selection : [figma.currentPage];
  const report = {
    auditedRoots: roots.length,
    nodeCount: 0,
    supportedComponents: 0,
    supportedTextStyles: 0,
    missingColorValues: 0,
    missingTextStyles: 0,
    unsupportedElements: 0,
    missingComponents: 0,
    autoFixOpportunities: 0,
    issues: [],
    issueItems: [],
    issueGroups: {},
    issueGroupCount: 0,
    warnings: [],
    ignoredLayers: 0,
  };
  if (!selection || selection.length === 0) {
    report.warnings.push('Nothing was selected, so the current Figma page was audited.');
  }

  const seen = new Set();
  const unsupportedNodeTypes = new Set(['BOOLEAN_OPERATION', 'ELLIPSE', 'LINE', 'POLYGON', 'RECTANGLE', 'SHAPE_WITH_TEXT', 'STAR', 'VECTOR', 'WIDGET']);
  const visit = (node, options = {}) => {
    const current = liveNode(node) || node;
    if (!current || seen.has(current.id)) return;
    if (isAuditReportNode(current)) return;
    if (isAuditIgnoredNode(current)) {
      report.ignoredLayers += 1;
      return;
    }
    seen.add(current.id);
    report.nodeCount += 1;

    try {
      const missingType = typeof current.getPluginData === 'function' ? current.getPluginData('a1-missing-component-type') : '';
      if (missingType) {
        report.missingComponents += 1;
        addAuditIssue(report, current, `${auditNodeName(current)} is a visible placeholder for missing Figma component "${missingType}".`, {
          severity: 'blocker',
          category: 'JSON translation',
          groupKey: `missing-figma-component:${missingType}`,
          metricKeys: ['figma-components'],
        });
        return;
      }
    } catch {
      // Ignore plugin data read failures on transient Figma nodes.
    }

    if (current.type === 'TEXT') {
      const styleName = textStyleName(current).trim().toLowerCase();
      const usesA1TextStyle = auditA1TextStyleName(styleName);
      if (usesA1TextStyle) {
        report.supportedTextStyles += 1;
      } else {
        report.missingTextStyles += 1;
        addAuditIssue(report, current, `${auditNodeName(current)} is not using an A1 text style.`, {
          severity: 'minor',
          category: 'Text style',
          groupKey: 'text-style',
          metricKeys: ['text-styles'],
        });
      }
      const paint = visibleSolidTextPaint(current);
      const hasA1TextColor = Boolean(textColorToken(current) || textUsesLinkColor(current));
      if (paint && !hasA1TextColor) {
        report.missingColorValues += 1;
        addAuditIssue(report, current, `${auditNodeName(current)} text color is not bound to an A1 text/link variable.`, {
          severity: 'minor',
          category: 'Color token',
          groupKey: 'text-color-variable',
          metricKeys: ['color-values'],
        });
      }
      addAuditReviewIssues(report, current, textSuggestion(current));
      return;
    }

    if (current.type === 'INSTANCE') {
      const componentName = registeredSetName(current);
      if (componentName) {
        report.supportedComponents += 1;
        auditSupportedInstancePaintOverrides(report, current, componentName);
        if (componentName === 'Tabs' && tabsConnectedPanelCount(current) === 0) {
          addAuditIssue(report, current, `${auditNodeName(current)} has no connected tab panel content. Add {tab=Tab label} to a nearby frame, Section, Stack, or Grid that matches one tab label; that layer's exported content becomes the matching A1 tab panel. Example: {tab=Dashboard}.`, {
            severity: 'advisory',
            category: 'Tabs content',
            groupKey: 'tabs-missing-connected-content',
            metricKeys: ['element-support'],
          });
        }
        if (componentName === 'Section') addAuditReviewIssues(report, current, sectionSuggestion(current));
        for (const slot of supportedInstanceSlots(current)) {
          try {
            for (const child of slot.children || []) visit(child);
          } catch {
            report.warnings.push(`${auditNodeName(current)} has a content slot that could not be audited because Figma refreshed that sublayer.`);
          }
        }
        return;
      }
      const privateComponentName = auditPrivateComponentName(current);
      if (privateComponentName) {
        report.supportedComponents += 1;
        return;
      }
      if (!options.insideSupportedSlot) {
        report.unsupportedElements += 1;
        addAuditIssue(report, current, `${auditNodeName(current)} is an unsupported component instance.`, {
          severity: 'major',
          category: 'JSON translation',
          groupKey: `unsupported-component:${componentSetName(current) || current.name || 'unknown'}`,
          metricKeys: ['element-support'],
        });
      }
    }

    if (unsupportedNodeTypes.has(current.type)) {
      report.unsupportedElements += 1;
      addAuditIssue(report, current, `${auditNodeName(current)} is a ${current.type.toLowerCase().replaceAll('_', ' ')} layer, which is not portable A1 JSON.`, {
        severity: 'major',
        category: 'JSON translation',
        groupKey: `unsupported-layer:${current.type}`,
        metricKeys: ['element-support'],
      });
    }

    if (current.type === 'FRAME' || current.type === 'COMPONENT' || current.type === 'GROUP' || current.type === 'SECTION') {
      const pageLayoutReview = pageLayoutSuggestion(current);
      const cardReview = pageLayoutReview ? null : cardSuggestion(current);
      if (pageLayoutReview) addAuditReviewIssues(report, current, pageLayoutReview);
      else if (cardReview) addAuditReviewIssues(report, current, cardReview);
      else if (isStackFrame(current)) addAuditReviewIssues(report, current, stackSuggestion(current));
      else if (isGridFrame(current)) addAuditReviewIssues(report, current, gridSuggestion(current));
      addAuditPaintIssues(report, current, 'fills');
      addAuditPaintIssues(report, current, 'strokes');
    } else if (!options.insideSupportedSlot) {
      addAuditPaintIssues(report, current, 'fills');
      addAuditPaintIssues(report, current, 'strokes');
    }

    try {
      for (const child of current.children || []) visit(child, options);
    } catch {
      report.warnings.push(`${auditNodeName(current)} has child layers that disappeared while auditing.`);
    }
  };

  for (const root of roots) visit(root);
  if (report.nodeCount > 0 && auditA1CoverageCount(report) === 0) {
    const target = roots.find(Boolean) || null;
    addAuditIssue(report, target, 'No A1 components or A1 text styles were found in this selection. Convert key structure to A1 components or run AutoFix text before treating this as A1-compatible.', {
      severity: 'blocker',
      category: 'A1 coverage',
      groupKey: 'a1-coverage:none',
      metricKeys: ['a1-components', 'text-styles', 'element-support'],
    });
  }
  // Score by issue family and severity, not by raw row count. This keeps ten
  // repeated text-color misses from reading as ten independent design-system
  // failures while still making untranslated/missing JSON model pieces hurt.
  report.issueGroupCount = Object.keys(report.issueGroups || {}).length;
  report.score = Math.min(auditScoreFromIssueGroups(report), auditCoverageScoreCap(report));
  for (const item of report.issueItems) {
    const group = report.issueGroups && report.issueGroups[item.groupKey];
    if (group) item.groupCount = group.count;
  }
  report.grade = report.score >= 95 ? 'A'
    : report.score >= 85 ? 'B'
      : report.score >= 75 ? 'C'
        : report.score >= 65 ? 'D'
          : 'F';
  return report;
}

function auditSelectionBounds(selection) {
  const scopedSelection = (selection || []).length ? selection : figma.currentPage.children;
  const boxes = (scopedSelection || []).map((node) => {
    try {
      if (isAuditReportNode(node)) return null;
      return node.absoluteBoundingBox || null;
    } catch {
      return null;
    }
  }).filter(Boolean);
  if (!boxes.length) return null;
  const minX = Math.min(...boxes.map((box) => box.x));
  const minY = Math.min(...boxes.map((box) => box.y));
  const maxX = Math.max(...boxes.map((box) => box.x + box.width));
  const maxY = Math.max(...boxes.map((box) => box.y + box.height));
  return { x: minX, y: minY, right: maxX, bottom: maxY };
}

function auditReportMetrics(report) {
  return [
    { label: 'A1 components', value: report.supportedComponents, passes: report.supportedComponents > 0, filterKey: 'a1-components' },
    { label: 'Color values', value: report.missingColorValues, passes: report.missingColorValues === 0, filterKey: 'color-values' },
    { label: 'Text styles', value: report.missingTextStyles, passes: report.missingTextStyles === 0, filterKey: 'text-styles' },
    { label: 'Element support', value: report.unsupportedElements, passes: report.unsupportedElements === 0, filterKey: 'element-support' },
    { label: 'Figma components', value: report.missingComponents, passes: report.missingComponents === 0, filterKey: 'figma-components' },
    { label: 'AutoFix', value: report.autoFixOpportunities, passes: report.autoFixOpportunities === 0, filterKey: 'autofix' },
  ];
}

function auditReportRecommendations(report) {
  const recommendations = [];
  if (report.autoFixOpportunities) recommendations.push('Run AutoFix all to normalize supported text, Card, Stack, Grid, and Section issues.');
  if (report.missingColorValues) recommendations.push('Bind raw or broken fills/strokes to valid A1 color variables before export.');
  if (report.missingTextStyles) recommendations.push('Apply A1 text styles instead of detached typography.');
  if (report.unsupportedElements || report.missingComponents) recommendations.push('Replace unsupported layers with A1 components or add the missing component mapping.');
  return recommendations.slice(0, 4);
}

function auditReportSummary(report) {
  const issueGroups = Number(report.issueGroupCount) || 0;
  return `Audited ${report.nodeCount} layer${report.nodeCount === 1 ? '' : 's'} across ${report.auditedRoots} root${report.auditedRoots === 1 ? '' : 's'}; ${issueGroups} issue famil${issueGroups === 1 ? 'y' : 'ies'} scored.`;
}

function auditReportFindings(report) {
  const groups = Object.values(report.issueGroups || {});
  if (groups.length) {
    return groups
      .sort((a, b) => {
        const aWeight = AUDIT_SEVERITY[a.severity]?.weight || 0;
        const bWeight = AUDIT_SEVERITY[b.severity]?.weight || 0;
        if (aWeight !== bWeight) return bWeight - aWeight;
        return (b.count || 0) - (a.count || 0);
      })
      .slice(0, 8)
      .map((group) => {
        const label = AUDIT_SEVERITY[group.severity]?.label || 'Issue';
        const count = Number(group.count) || 1;
        const countSuffix = count > 1 ? ` (${count}× same pattern)` : '';
        return `${label}: ${group.text}${countSuffix}`;
      });
  }
  return (report.issues || []).slice(0, 8);
}

function auditReportProperty(instance, name, type) {
  const found = componentProperty(instance, name, type);
  return found || null;
}

function queueAuditReportProperty(instance, assignments, name, value, type = 'TEXT') {
  const found = auditReportProperty(instance, name, type);
  if (!found) return false;
  assignments[found.key] = value;
  return true;
}

function setAuditTextNode(text, value) {
  if (!text || text.type !== 'TEXT') return false;
  try {
    text.characters = String(value);
    return true;
  } catch {
    return false;
  }
}

function firstAuditNode(root, predicate) {
  try {
    return root.findOne((node) => {
      try {
        return predicate(node);
      } catch {
        return false;
      }
    });
  } catch {
    return null;
  }
}

function auditNamedText(root, name) {
  return firstAuditNode(root, (node) => node.type === 'TEXT' && node.name === name);
}

function auditNamedNode(root, name) {
  return firstAuditNode(root, (node) => node.name === name);
}

function auditFrameTextChildren(root, frameName) {
  const frame = auditNamedNode(root, frameName);
  if (!frame || !('findAll' in frame)) return [];
  try {
    return frame.findAll((node) => node.type === 'TEXT');
  } catch {
    return [];
  }
}

function setAuditNodeVisible(root, name, visible) {
  const node = auditNamedNode(root, name);
  if (!node) return false;
  try {
    node.visible = Boolean(visible);
    return true;
  } catch {
    return false;
  }
}

function applyAuditReportDataFallback(instance, report) {
  const metrics = auditReportMetrics(report);
  const recommendations = auditReportRecommendations(report);
  const topIssues = auditReportFindings(report);
  const cleanFinding = topIssues.length ? null : 'No compatibility issues found. This selection is cleanly A1-shaped.';

  setAuditTextNode(auditNamedText(instance, 'Title'), 'A1 compatibility audit');
  setAuditTextNode(auditNamedText(instance, 'Score'), `${report.grade} · ${report.score}/100`);
  setAuditTextNode(auditNamedText(instance, 'Summary'), auditReportSummary(report));
  setAuditTextNode(auditNamedText(instance, 'Findings heading'), topIssues.length ? 'Top findings' : 'Findings');

  // Structural fallback for edited templates where property bindings were
  // deleted but the named rows remain.
  const headerTexts = auditFrameTextChildren(instance, 'Header Slot');
  setAuditTextNode(headerTexts[0], 'A1 compatibility audit');
  setAuditTextNode(headerTexts[1], `${report.grade} · ${report.score}/100`);

  metrics.forEach((metric, index) => {
    const slot = index + 1;
    setAuditTextNode(auditNamedText(instance, `Metric ${slot} Status`), metric.passes ? '✓' : '×');
    setAuditTextNode(auditNamedText(instance, `Metric ${slot} Label`), metric.label);
    setAuditTextNode(auditNamedText(instance, `Metric ${slot} Value`), String(metric.value));
    const rowTexts = auditFrameTextChildren(instance, `Metric Slot ${slot}`);
    setAuditTextNode(rowTexts[0], metric.passes ? '✓' : '×');
    setAuditTextNode(rowTexts[1], metric.label);
    setAuditTextNode(rowTexts[2], String(metric.value));
  });

  for (let index = 1; index <= 8; index += 1) {
    const value = topIssues[index - 1] ? `• ${topIssues[index - 1]}` : index === 1 && cleanFinding ? cleanFinding : '';
    setAuditTextNode(auditNamedText(instance, `Finding ${index}`), value);
    setAuditNodeVisible(instance, `Finding ${index}`, Boolean(value));
  }

  setAuditNodeVisible(instance, 'Recommendations heading', recommendations.length > 0);
  recommendations.forEach((item, index) => {
    setAuditTextNode(auditNamedText(instance, `Recommendation ${index + 1}`), `• ${item}`);
    setAuditNodeVisible(instance, `Recommendation ${index + 1}`, true);
  });
  for (let index = recommendations.length + 1; index <= 4; index += 1) {
    setAuditTextNode(auditNamedText(instance, `Recommendation ${index}`), '');
    setAuditNodeVisible(instance, `Recommendation ${index}`, false);
  }
}

function applyAuditReportData(instance, report, warnings) {
  const assignments = {};
  queueAuditReportProperty(instance, assignments, 'Title', 'A1 compatibility audit');
  queueAuditReportProperty(instance, assignments, 'Score', `${report.grade} · ${report.score}/100`);
  queueAuditReportProperty(instance, assignments, 'Summary', auditReportSummary(report));
  auditReportMetrics(report).forEach((metric, index) => {
    const slot = index + 1;
    queueAuditReportProperty(instance, assignments, `Metric ${slot} Status`, metric.passes ? '✓' : '×');
    queueAuditReportProperty(instance, assignments, `Metric ${slot} Label`, metric.label);
    queueAuditReportProperty(instance, assignments, `Metric ${slot} Value`, String(metric.value));
  });
  const topIssues = auditReportFindings(report);
  queueAuditReportProperty(instance, assignments, 'Findings heading', topIssues.length ? 'Top findings' : 'Findings');
  const cleanFinding = topIssues.length ? null : 'No compatibility issues found. This selection is cleanly A1-shaped.';
  for (let index = 1; index <= 8; index += 1) {
    const value = topIssues[index - 1] ? `• ${topIssues[index - 1]}` : index === 1 && cleanFinding ? cleanFinding : '';
    queueAuditReportProperty(instance, assignments, `Finding ${index}`, value);
    queueAuditReportProperty(instance, assignments, `Show finding ${index}`, Boolean(value), 'BOOLEAN');
  }
  const recommendations = auditReportRecommendations(report);
  queueAuditReportProperty(instance, assignments, 'Show recommendations', recommendations.length > 0, 'BOOLEAN');
  recommendations.forEach((item, index) => {
    queueAuditReportProperty(instance, assignments, `Recommendation ${index + 1}`, `• ${item}`);
    queueAuditReportProperty(instance, assignments, `Show recommendation ${index + 1}`, true, 'BOOLEAN');
  });
  for (let index = recommendations.length + 1; index <= 4; index += 1) {
    queueAuditReportProperty(instance, assignments, `Recommendation ${index}`, '');
    queueAuditReportProperty(instance, assignments, `Show recommendation ${index}`, false, 'BOOLEAN');
  }
  applyQueuedProperties(instance, assignments, warnings, 'Audit report properties');
  applyAuditReportDataFallback(instance, report);
}

async function renderAuditReportCard(report, selection) {
  const existing = findExistingAuditReportCard();
  const existingPosition = existing ? { x: existing.x, y: existing.y } : null;
  const warnings = [];
  let frame = existing || null;

  if (!frame) {
    frame = await createComponentInstance(AUDIT_REPORT_COMPONENT_NAME, warnings);
    if (existingPosition) {
      frame.x = existingPosition.x;
      frame.y = existingPosition.y;
    }
  } else if (frame.type !== 'INSTANCE') {
    const staleFrame = frame;
    frame = await createComponentInstance(AUDIT_REPORT_COMPONENT_NAME, warnings);
    if (existingPosition) {
      frame.x = existingPosition.x;
      frame.y = existingPosition.y;
    }
    try {
      staleFrame.remove();
    } catch {
      // Replace stale/non-renderable report nodes with a fresh report instance.
    }
  }

  const isExisting = frame.parent !== null;
  frame.name = `A1 Audit Report · ${report.grade} ${report.score}`;
  frame.setPluginData('a1-audit-report', 'true');

  try {
    await loadInstanceFonts(frame);
  } catch {
    // The report still tries component-property updates; direct text fallback
    // may skip layers whose custom fonts are unavailable.
  }
  applyAuditReportData(frame, report, warnings);
  if (warnings.length) report.warnings.push(...warnings);

  const bounds = auditSelectionBounds(selection);
  if (bounds) {
    frame.x = Math.round(bounds.right + 24);
    frame.y = Math.round(bounds.y);
  } else if (!isExisting) {
    frame.x = Math.round(figma.viewport.center.x - 260);
    frame.y = Math.round(figma.viewport.center.y - 220);
  }
  if (!isExisting) {
    figma.currentPage.appendChild(frame);
  }
  figma.currentPage.selection = [frame];
  figma.viewport.scrollAndZoomIntoView([frame]);
  return frame;
}

async function handleAuditSelection(options = {}) {
  const selection = figma.currentPage.selection.filter((node) => !isAuditReportNode(node));
  const report = auditSelection(selection);
  if (options.printReport === true) await renderAuditReportCard(report, selection);
  figma.notify(`A1 audit complete: ${report.grade} (${report.score}/100).`);
  postPluginMessage({
    type: 'audit-result',
    grade: report.grade,
    score: report.score,
    warnings: report.warnings,
    issueCount: report.issues.length,
    printed: options.printReport === true,
    report: {
      grade: report.grade,
      score: report.score,
      nodeCount: report.nodeCount,
      auditedRoots: report.auditedRoots,
      ignoredLayers: report.ignoredLayers,
      issueGroupCount: report.issueGroupCount,
      metrics: auditReportMetrics(report),
      recommendations: auditReportRecommendations(report),
      issues: report.issueItems,
    },
  });
}

function handleIgnoreAuditIssue(nodeId) {
  if (!nodeId || typeof nodeId !== 'string') {
    postPluginMessage({ type: 'audit-ignore-result', warnings: ['This audit issue is not linked to a Figma layer.'] });
    return;
  }
  const node = liveNode({ id: nodeId });
  if (!node || node.removed) {
    postPluginMessage({ type: 'audit-ignore-result', warnings: ['That audit issue layer no longer exists in this Figma file. Run Audit again to refresh the report.'] });
    return;
  }
  let target = node;
  while (target && target.type !== 'PAGE') {
    try {
      const previousName = auditNodeName(target);
      target.name = auditIgnoredName(previousName);
      figma.currentPage.selection = [target];
      figma.viewport.scrollAndZoomIntoView([target]);
      figma.notify(`Audit will ignore "${auditNodeName(target)}".`);
      postPluginMessage({
        type: 'audit-ignore-result',
        warnings: [],
        nodeId: target.id,
        nodeName: auditNodeName(target),
        message: `Marked "${auditNodeName(target)}" as ignored. Run Audit again to refresh the report.`,
      });
      return;
    } catch {
      target = target.parent && target.parent.type !== 'PAGE' ? target.parent : null;
    }
  }
  postPluginMessage({ type: 'audit-ignore-result', warnings: [`${auditNodeName(node)} could not be renamed. Try renaming it manually with "${AUDIT_IGNORE_MARKER.trim()}" in the layer name.`] });
}

function handleSelectAuditIssue(nodeId) {
  if (!nodeId || typeof nodeId !== 'string') {
    postPluginMessage({ type: 'audit-select-result', warnings: ['This audit issue is not linked to a Figma layer.'] });
    return;
  }
  const node = liveNode({ id: nodeId });
  if (!node || node.removed) {
    postPluginMessage({ type: 'audit-select-result', warnings: ['That audit issue layer no longer exists in this Figma file. Run Audit again to refresh the report.'] });
    return;
  }
  let target = node;
  while (target) {
    try {
      figma.currentPage.selection = [target];
      figma.viewport.scrollAndZoomIntoView([target]);
      postPluginMessage({ type: 'audit-select-result', warnings: [], nodeName: auditNodeName(target) });
      return;
    } catch {
      target = target.parent && target.parent.type !== 'PAGE' ? target.parent : null;
    }
  }
  try {
    figma.viewport.scrollAndZoomIntoView([node]);
    postPluginMessage({ type: 'audit-select-result', warnings: [`${auditNodeName(node)} could not be selected directly. Try selecting its parent layer in the Layers panel.`] });
  } catch (error) {
    postPluginMessage({ type: 'audit-select-result', warnings: [`Could not select the audit issue layer: ${error.message}`] });
  }
}

function selectedDetachRoots(selection) {
  return topLevelSelectionNodes(selection).filter((node) => !isAuditReportNode(node));
}

function firstDetachableInstance(node) {
  const current = liveNode(node);
  if (!current || isAuditReportNode(current)) return null;
  if (current.type === 'INSTANCE') return current;
  try {
    for (const child of current.children || []) {
      const found = firstDetachableInstance(child);
      if (found) return found;
    }
  } catch {
    return null;
  }
  return null;
}

async function handleDetachAll() {
  const roots = selectedDetachRoots(figma.currentPage.selection);
  if (!roots.length) {
    postPluginMessage({ type: 'detach-all-result', warnings: [], count: 0, message: 'Select one or more layers to detach component instances.' });
    return;
  }
  const warnings = [];
  const rootRefs = roots.map((node) => ({ id: node.id }));
  let count = 0;
  let pass = 0;
  while (pass < 1000) {
    pass += 1;
    let detached = false;
    for (let index = 0; index < rootRefs.length; index += 1) {
      const instance = firstDetachableInstance(rootRefs[index]);
      if (!instance) continue;
      try {
        const frame = instance.detachInstance();
        if (rootRefs[index].id === instance.id) rootRefs[index] = { id: frame.id };
        count += 1;
        detached = true;
      } catch (error) {
        warnings.push(`"${auditNodeName(instance)}" could not be detached: ${error.message}`);
      }
    }
    if (!detached) break;
  }
  if (pass >= 1000) warnings.push('Detach All stopped after 1000 passes to avoid an infinite loop.');
  const affected = rootRefs.map(liveNode).filter(Boolean);
  if (affected.length) {
    figma.currentPage.selection = affected;
    figma.viewport.scrollAndZoomIntoView(affected);
  }
  const message = count
    ? `Detached ${count} component ${count === 1 ? 'instance' : 'instances'} in the selection.`
    : 'No component instances were found to detach in the selection.';
  if (count) figma.notify(message);
  postPluginMessage({ type: 'detach-all-result', warnings, count, message });
  if (count) scheduleAutoExport();
}

async function handleFixAll() {
  const targets = collectAutoFixTargets(figma.currentPage.selection);
  const targetCount = targets.componentOverrides.length + targets.pageLayouts.length + targets.cards.length + targets.stacks.length + targets.grids.length + targets.sections.length + targets.texts.length;
  if (!targetCount) {
    postPluginMessage({ type: 'fix-all-result', warnings: [], count: 0, message: 'No supported AutoFix suggestions were found in this selection.' });
    return;
  }
  const warnings = [];
  const affected = [];
  let count = 0;

  for (const id of targets.componentOverrides) {
    const instance = liveNode({ id });
    if (!instance || instance.type !== 'INSTANCE' || !registeredSetName(instance)) continue;
    const resetCount = resetSupportedInstancePaintOverrides(instance, warnings);
    if (resetCount > 0) {
      count += 1;
      affected.push(instance);
    }
  }

  // Convert app shells before nested content. Child node ids remain valid after
  // moving into the Page Content Slot, so deeper fixes can still run afterward
  // when Figma keeps those nodes available.
  for (const id of targets.pageLayouts) {
    const frame = liveNode({ id });
    if (!pageLayoutSuggestion(frame)) continue;
    try {
      const pageLayout = await convertFrameToPageLayout(frame, warnings);
      if (pageLayout) {
        count += 1;
        affected.push(pageLayout);
      }
    } catch (error) {
      warnings.push(`Page Layout conversion failed: ${error.message}`);
    }
  }
  // Convert outer cards next. Their child node ids remain valid after moving
  // into the Card slot, so text and Stack fixes can run afterward.
  for (const id of targets.cards) {
    const frame = liveNode({ id });
    if (!cardSuggestion(frame)) continue;
    try {
      const card = await convertFrameToCard(frame, warnings);
      if (card) {
        count += 1;
        affected.push(card);
      }
    } catch (error) {
      warnings.push(`Card conversion failed: ${error.message}`);
    }
  }
  for (const id of targets.stacks) {
    const frame = liveNode({ id });
    if (!isStackFrame(frame) || cardSuggestion(frame)) continue;
    const suggestion = stackSuggestion(frame);
    if (!suggestion.fixes.length) continue;
    await applyStackSuggestion(frame, suggestion, warnings);
    count += 1;
    affected.push(frame);
  }
  for (const id of targets.grids) {
    const frame = liveNode({ id });
    if (!isGridFrame(frame)) continue;
    const suggestion = gridSuggestion(frame);
    if (!suggestion.fixes.length) continue;
    await applyGridSuggestion(frame, suggestion, warnings);
    frame.name = 'Grid';
    count += 1;
    affected.push(frame);
  }
  for (const id of targets.sections) {
    const section = liveNode({ id });
    if (!section || section.type !== 'INSTANCE' || registeredSetName(section) !== 'Section') continue;
    const suggestion = sectionSuggestion(section);
    if (!suggestion.fixes.length) continue;
    applySectionSuggestion(section, suggestion, warnings);
    count += 1;
    affected.push(section);
  }
  for (const id of targets.texts) {
    const text = liveNode({ id });
    if (!text || text.type !== 'TEXT' || textSuggestion(text).issues.length === 0) continue;
    await applyTextAutoFix(text, warnings);
    count += 1;
    affected.push(text);
  }
  if (affected.length) {
    figma.currentPage.selection = affected;
    figma.viewport.scrollAndZoomIntoView(affected);
  }
  if (count === 0) {
    postPluginMessage({
      type: 'fix-all-result',
      warnings,
      count,
      message: warnings.length
        ? 'AutoFix found supported targets, but no updates were applied. See warnings for details.'
        : 'AutoFix found supported targets, but they did not need changes.',
    });
    return;
  }
  figma.notify(`Applied ${count} A1 AutoFix ${count === 1 ? 'update' : 'updates'}.`);
  postPluginMessage({
    type: 'fix-all-result',
    warnings,
    count,
    message: `Applied ${count} A1 AutoFix ${count === 1 ? 'update' : 'updates'} in the selection.`,
  });
  scheduleAutoExport();
}

async function handleFixAllText() {
  const selection = figma.currentPage.selection;
  if (!selection.length) {
    postPluginMessage({ type: 'text-fix-all-result', warnings: [], count: 0, message: 'Select a frame, group, section, or text layer to AutoFix its free text.' });
    return;
  }
  const targetIds = collectTextAutoFixTargets(selection);
  if (!targetIds.length) {
    postPluginMessage({ type: 'text-fix-all-result', warnings: [], count: 0, message: 'No eligible free text issues were found in the selection. Text inside components was skipped.' });
    return;
  }

  const warnings = [];
  const affected = [];
  let count = 0;
  for (const id of targetIds) {
    const text = liveNode({ id });
    if (!text || text.type !== 'TEXT' || textSuggestion(text).issues.length === 0) continue;
    try {
      await applyTextAutoFix(text, warnings);
      count += 1;
      affected.push(text);
    } catch (error) {
      warnings.push(`"${auditNodeName(text)}" text AutoFix failed: ${error.message}`);
    }
  }

  if (affected.length) {
    figma.currentPage.selection = affected;
    figma.viewport.scrollAndZoomIntoView(affected);
  }
  if (count === 0) {
    postPluginMessage({
      type: 'text-fix-all-result',
      warnings,
      count,
      message: warnings.length
        ? 'AutoFix all Text found eligible text, but no updates were applied. See warnings for details.'
        : 'AutoFix all Text found eligible text, but it did not need changes.',
    });
    return;
  }
  figma.notify(`AutoFixed ${count} free text ${count === 1 ? 'layer' : 'layers'}.`);
  postPluginMessage({
    type: 'text-fix-all-result',
    warnings,
    count,
    message: `AutoFixed ${count} free text ${count === 1 ? 'layer' : 'layers'} in the selection. Text inside components was skipped.`,
  });
  scheduleAutoExport();
}

async function handleImport(text, assets = [], targetParent = figma.currentPage, replaceTargetChildren = false, options = {}) {
  localFigureAssets = new Map((Array.isArray(assets) ? assets : [])
    .filter((asset) => asset && typeof asset.id === 'string' && typeof asset.dataBase64 === 'string')
    .map((asset) => [asset.id, asset]));
  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    postError('Not valid JSON: ' + error.message);
    return null;
  }
  const nodes = [];
  collectSupportedNodes(data, nodes);
  if (nodes.length === 0) {
    postError(`No supported component nodes found. Supported: ${SUPPORTED_COMPONENT_MESSAGE}.`);
    return null;
  }

  const warnings = [];
  const instances = [];
  if (replaceTargetChildren && targetParent && 'children' in targetParent) {
    for (const child of [...targetParent.children]) child.remove();
  }
  const shouldRenderBreakpointRoots = targetParent === figma.currentPage && replaceTargetChildren !== true;
  const authoredBreakpointSet = shouldRenderBreakpointRoots ? collectAuthoredBreakpoints(data) : new Set();
  const requestedBreakpointSet = new Set(Array.isArray(options.breakpoints)
    ? options.breakpoints.filter((breakpoint) => A1_BREAKPOINTS.includes(breakpoint))
    : []);
  const authoredBreakpoints = shouldRenderBreakpointRoots
    ? A1_BREAKPOINTS.filter((breakpoint) => requestedBreakpointSet.has(breakpoint) || authoredBreakpointSet.has(breakpoint))
    : [];
  const renderBreakpoints = authoredBreakpoints.length > 0 && (requestedBreakpointSet.size > 0 || authoredBreakpoints.length > 1)
    ? authoredBreakpoints
    : [''];
  let x = Math.round(figma.viewport.center.x);
  const y = Math.round(figma.viewport.center.y);
  for (const breakpoint of renderBreakpoints) {
    activeRenderBreakpoint = breakpoint;
    try {
      for (const node of nodes) {
        const instance = await renderImportedNode(node, warnings);
        if (breakpoint) {
          instance.setPluginData(A1_BREAKPOINT_KEY, breakpoint);
          instance.name = `${instance.name} · ${breakpoint}`;
          const width = A1_BREAKPOINT_WIDTHS[breakpoint];
          if (width && typeof instance.resizeWithoutConstraints === 'function') {
            try {
              instance.resizeWithoutConstraints(width, instance.height);
            } catch (error) {
              warnings.push(`${instance.name} could not be resized to the ${breakpoint} preview width (${width}px): ${error.message}`);
            }
          }
        }
        if (targetParent === figma.currentPage) {
          instance.x = x;
          instance.y = y;
        }
        x += Math.round(instance.width) + 24; // gap/lg between rendered instances
        targetParent.appendChild(instance);
        applyStackGrow(targetParent, instance, node, warnings);
        instances.push(instance);
      }
    } finally {
      activeRenderBreakpoint = '';
    }
  }
  figma.currentPage.selection = instances;
  figma.viewport.scrollAndZoomIntoView(instances);
  if (authoredBreakpoints.length > 1) {
    warnings.push(`Rendered separate breakpoint previews for ${authoredBreakpoints.join(', ')}.`);
  }
  figma.notify(`Rendered ${instances.length} component ${instances.length === 1 ? 'instance' : 'instances'} from JSON.`);
  postPluginMessage({ type: 'import-result', count: instances.length, warnings });
  return { count: instances.length, warnings };
}

function breakpointRootName(name) {
  return String(name || 'A1 breakpoint root').replace(/\s+·\s+(xs|sm|md|lg|xl)$/i, '');
}

function selectedBreakpointRoot() {
  const selected = figma.currentPage.selection[0];
  if (!selected) return null;
  let root = liveNode(selected);
  let outermost = null;
  while (root && root.parent && root.parent.type !== 'PAGE') {
    outermost = root;
    root = root.parent;
  }
  if (root && root.type !== 'PAGE') outermost = root;
  return outermost;
}

function siblingBreakpointRoots(root) {
  if (!root || !root.parent || !('children' in root.parent)) return [];
  const base = breakpointRootName(root.name);
  return root.parent.children.filter((child) => {
    try {
      return child !== root && breakpointRootName(child.name) === base && readBreakpointData(child);
    } catch {
      return false;
    }
  });
}

function breakpointRootByKey(root, key) {
  if (!root || !A1_BREAKPOINTS.includes(key)) return null;
  const all = [root, ...siblingBreakpointRoots(root)];
  return all.find((candidate) => readBreakpointData(candidate) === key) || null;
}

function gridFlexTracks(frame) {
  try {
    frame.gridColumnSizes.forEach((track) => {
      track.type = 'FLEX';
      track.value = 1;
    });
  } catch {
    // Older Figma grid handles may not expose track mutation; column count
    // still applies.
  }
}

function breakpointForSyncedNode(node, root, fallback = 'xl') {
  const rootBreakpoint = readBreakpointData(root);
  if (rootBreakpoint) return rootBreakpoint;
  for (let current = node && node.parent; current; current = current.parent) {
    const breakpoint = readBreakpointData(current);
    if (breakpoint) return breakpoint;
  }
  return A1_BREAKPOINTS.includes(fallback) ? fallback : 'xl';
}

function applyResponsiveGridColumnsForBreakpoint(grid, breakpoint, warnings) {
  const responsiveColumns = readResponsiveGridColumns(grid);
  if (!responsiveColumns) return false;
  syncResponsiveGridColumnsMetadata(grid, responsiveColumns);
  const columns = responsiveColumnsAt(responsiveColumns, breakpoint);
  if (Number.isInteger(columns) && columns > 0) {
    grid.gridColumnCount = columns;
    gridFlexTracks(grid);
  }
  try {
    grid.setPluginData(A1_BREAKPOINT_KEY, breakpoint);
  } catch {
    // The containing breakpoint root remains the source of truth.
  }
  return true;
}

function applyBreakpointToTree(root, breakpoint, warnings) {
  if (!root || !A1_BREAKPOINTS.includes(breakpoint)) return;
  try {
    root.setPluginData(A1_BREAKPOINT_KEY, breakpoint);
    root.name = `${breakpointRootName(root.name)} · ${breakpoint}`;
    const width = A1_BREAKPOINT_WIDTHS[breakpoint];
    if (width && typeof root.resizeWithoutConstraints === 'function') {
      root.resizeWithoutConstraints(width, root.height);
    }
  } catch (error) {
    warnings.push(`Could not size ${root.name || 'breakpoint root'} for ${breakpoint}: ${error.message}`);
  }

  const visit = (node) => {
    const live = liveNode(node) || node;
    if (!live) return;
    try {
      if (live.type === 'INSTANCE') {
        const componentName = registeredSetName(live);
        if (componentName === 'Page Layout' || componentName === 'Top Header') {
          const assignments = {};
          queueComponentProperty(live, assignments, 'Breakpoint', breakpoint, 'VARIANT', warnings, `${componentName} breakpoint preview`);
          applyQueuedProperties(live, assignments, warnings, `${componentName} properties`);
        }
      } else if (isGridFrame(live)) {
        const gridBreakpoint = breakpointForSyncedNode(live, root, breakpoint);
        applyResponsiveGridColumnsForBreakpoint(live, gridBreakpoint, warnings);
      }
      if ('children' in live) {
        for (const child of [...live.children]) visit(child);
      }
    } catch (error) {
      warnings.push(`Unsupported or unavailable breakpoint adjustment on "${live.name || 'layer'}": ${error.message}`);
    }
  };
  visit(root);
}

function cloneRootForBreakpoint(sourceRoot, breakpoint, warnings) {
  const clone = sourceRoot.clone();
  clone.x = sourceRoot.x + (A1_BREAKPOINT_WIDTHS[breakpoint] || sourceRoot.width) + 24;
  clone.y = sourceRoot.y;
  sourceRoot.parent.appendChild(clone);
  applyBreakpointToTree(clone, breakpoint, warnings);
  return clone;
}

function createBreakpointRoots({ primary = 'xl', breakpoints = [] } = {}) {
  const warnings = [];
  const selected = selectedBreakpointRoot();
  if (!selected) {
    postError('Select a rendered breakpoint root or top-level design frame first.');
    return;
  }
  const targets = (Array.isArray(breakpoints) ? breakpoints : []).filter((key) => A1_BREAKPOINTS.includes(key));
  if (targets.length === 0) {
    postError('Choose at least one breakpoint to create.');
    return;
  }
  const source = breakpointRootByKey(selected, primary) || selected;
  const created = [];
  let x = source.x;
  for (const breakpoint of targets) {
    let root = breakpointRootByKey(source, breakpoint);
    if (root === source) {
      applyBreakpointToTree(root, breakpoint, warnings);
      created.push(root);
      x = Math.max(x, root.x + root.width + 24);
      continue;
    }
    const clone = source.clone();
    clone.x = x;
    clone.y = source.y;
    source.parent.appendChild(clone);
    applyBreakpointToTree(clone, breakpoint, warnings);
    if (root && root !== source) {
      clone.x = root.x;
      clone.y = root.y;
      root.remove();
    }
    created.push(clone);
    x = clone.x + clone.width + 24;
  }
  figma.currentPage.selection = created;
  figma.viewport.scrollAndZoomIntoView(created);
  warnings.push('Created breakpoint roots from one design. Supported automatic adjustments: Page Layout breakpoint, Top Header breakpoint, and responsive Grid columns. Other visual differences remain local until explicit responsive diff support is added.');
  postPluginMessage({ type: 'breakpoint-create-result', count: created.length, warnings });
}

function gridResponsiveIdentity(grid) {
  try {
    const jsonId = grid.getPluginData('a1-json-id');
    if (jsonId) return jsonId;
  } catch {
    // Ignore stale grid handles.
  }
  return gridExportId(grid);
}

function mergeGridColumnsIntoNode(node, columnsById) {
  if (!node || typeof node !== 'object') return;
  if (node.type === 'Grid') {
    const id = typeof node.id === 'string' ? node.id : '';
    const columns = columnsById.get(id);
    if (columns && Object.keys(columns).length > 0) {
      node.props = node.props || {};
      node.props.columns = columns;
    }
  }
  for (const key of ['children', 'nodes']) {
    if (Array.isArray(node[key])) node[key].forEach((child) => mergeGridColumnsIntoNode(child, columnsById));
  }
}

function exportResponsiveDiff({ primary = 'xl' } = {}) {
  const selected = selectedBreakpointRoot();
  if (!selected) {
    postError('Select one rendered breakpoint root first.');
    return;
  }
  const roots = [selected, ...siblingBreakpointRoots(selected)]
    .filter((root) => A1_BREAKPOINTS.includes(readBreakpointData(root)));
  if (roots.length < 2) {
    postError('Select a design with at least two rendered breakpoint roots.');
    return;
  }
  const primaryRoot = breakpointRootByKey(selected, primary) || roots[0];
  const componentName = primaryRoot.type === 'INSTANCE' ? registeredSetName(primaryRoot) : null;
  const result = componentName && EXPORTERS[componentName]
    ? EXPORTERS[componentName](primaryRoot)
    : exportContainerNode(primaryRoot);
  const columnsById = new Map();
  const warnings = [...(result.warnings || [])];
  for (const root of roots) {
    const breakpoint = readBreakpointData(root);
    const grids = root.findAll((node) => isGridFrame(node));
    for (const grid of grids) {
      const id = gridResponsiveIdentity(grid);
      if (!id) continue;
      if (!columnsById.has(id)) columnsById.set(id, {});
      columnsById.get(id)[breakpoint] = figmaNumber(grid.gridColumnCount, 1) || 1;
    }
  }
  for (const root of roots) {
    const grids = root.findAll((node) => isGridFrame(node));
    for (const grid of grids) {
      const id = gridResponsiveIdentity(grid);
      const columns = columnsById.get(id);
      if (columns) syncResponsiveGridColumnsMetadata(grid, columns);
    }
  }
  mergeGridColumnsIntoNode(result.node, columnsById);
  warnings.push('Responsive diff currently writes supported Grid column differences. Unsupported visual/layout differences are not serialized yet.');
  postExportResult({ auto: false, live: false, componentName: 'Responsive breakpoints', node: result.node, warnings });
}

// ─── Linked A1 project pages (local bridge) ─────────────────────────────────

const PAGE_SYNC_NAMESPACE = 'a1_page_sync';
const PAGE_SYNC_LINK_KEY = 'link-id';

function linkedRootFor(link) {
  const expectedId = link && link.figmaRootNodeId;
  if (expectedId) {
    try {
      const byId = figma.getNodeById(expectedId);
      if (byId && byId.type === 'FRAME' && byId.getPluginData(PAGE_SYNC_LINK_KEY) === link.linkId) return byId;
    } catch { /* Figma can retain an instance-subnode id after changes. */ }
  }
  return figma.currentPage.findOne((node) => {
    try {
      return node.type === 'FRAME' && node.getPluginData(PAGE_SYNC_LINK_KEY) === link.linkId;
    } catch { return false; }
  });
}

function prepareLinkedRoot(link, title) {
  let root = linkedRootFor(link);
  if (!root) {
    root = figma.createFrame();
    figma.currentPage.appendChild(root);
    root.x = Math.round(figma.viewport.center.x);
    root.y = Math.round(figma.viewport.center.y);
  }
  // The outer frame is intentionally human-readable so a copied/imported
  // composition can be reconnected without first selecting a child layer.
  const projectLabel = typeof link.projectName === 'string' && link.projectName.trim()
    ? link.projectName.trim()
    : link.projectId;
  const pageLabel = typeof link.pageTitle === 'string' && link.pageTitle.trim()
    ? link.pageTitle.trim()
    : (title || link.pageId);
  root.name = `A1 · ${projectLabel} / ${pageLabel}`;
  root.layoutMode = 'VERTICAL';
  root.primaryAxisSizingMode = 'AUTO';
  root.counterAxisSizingMode = 'FIXED';
  try { root.resizeWithoutConstraints(1200, Math.max(root.height, 1)); } catch { /* retain the existing root width */ }
  root.itemSpacing = 16;
  root.paddingLeft = 0;
  root.paddingRight = 0;
  root.paddingTop = 0;
  root.paddingBottom = 0;
  root.setPluginData(PAGE_SYNC_LINK_KEY, link.linkId);
  root.setPluginData('project-id', link.projectId);
  root.setPluginData('page-id', link.pageId);
  root.setPluginData('mode', link.mode || 'manual');
  return root;
}

async function handleLinkedPageImport(text, assets, link) {
  let parsed;
  try { parsed = JSON.parse(text); } catch (error) { postError('Not valid JSON: ' + error.message); return null; }
  const title = parsed && parsed.page && typeof parsed.page.name === 'string' ? parsed.page.name : link.pageId;
  const root = prepareLinkedRoot(link, title);
  const result = await handleImport(text, assets, root, true);
  if (!result) return null;
  figma.currentPage.selection = [root];
  figma.viewport.scrollAndZoomIntoView([root]);
  return { ...result, rootNodeId: root.id, figmaPageId: figma.currentPage.id, figmaFileKey: figma.fileKey || '' };
}

function figureJsonNodes(value, found = new Map()) {
  if (Array.isArray(value)) {
    value.forEach((item) => figureJsonNodes(item, found));
  } else if (value && typeof value === 'object') {
    if (value.type === 'Figure' && typeof value.id === 'string') found.set(value.id, value);
    Object.values(value).forEach((item) => figureJsonNodes(item, found));
  }
  return found;
}

/**
 * Collect image fills from Figures included in an exported Figma page and
 * replace only those Figure sources with stable local A1 image references.
 * The bytes travel beside page JSON and never become inline page data.
 */
async function collectPageFigureAssets(root, pageNode, warnings) {
  const figureNodes = figureJsonNodes(pageNode);
  if (figureNodes.size === 0) return [];
  let figures = [];
  try {
    figures = root.findAll((node) => node.type === 'INSTANCE' && registeredSetName(node) === 'Figure');
  } catch (error) {
    warnings.push(`Figure images could not be collected: ${error.message}`);
    return [];
  }
  const assets = [];
  const assetByHash = new Map();
  let totalBytes = 0;
  for (const candidate of figures) {
    try {
      const figure = currentInstance(candidate);
      const figureNode = figureNodes.get(componentId('Figure', figure));
      if (!figureNode) continue;
      const paint = imagePaintOn(figureImageLayer(figure));
      if (!paint || !paint.imageHash) continue;
      let asset = assetByHash.get(paint.imageHash);
      if (!asset) {
        const image = figma.getImageByHash(paint.imageHash);
        if (!image) {
          warnings.push(`Figure "${figure.name}" has an unavailable image fill; its source was left unchanged.`);
          continue;
        }
        const bytes = await image.getBytesAsync();
        const type = figureImageMime(bytes);
        if (bytes.byteLength === 0 || bytes.byteLength > LOCAL_FIGMA_IMAGE_MAX_BYTES || !type) {
          warnings.push(`Figure "${figure.name}" image was not synced; use a PNG, JPEG, or GIF up to 4 MB.`);
          continue;
        }
        if (assets.length >= 8 || totalBytes + bytes.byteLength > LOCAL_FIGMA_IMAGE_MAX_BYTES) {
          warnings.push(`Figure "${figure.name}" image was not synced because page image handoffs support up to 8 images and 4 MB total.`);
          continue;
        }
        const sourceName = componentText(figure, 'Source', '').trim() || figure.name || 'Figure image';
        asset = {
          id: `figma_${paint.imageHash.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 96)}`,
          name: sourceName.slice(0, 180),
          type,
          dataBase64: bytesToBase64(bytes),
        };
        assetByHash.set(paint.imageHash, asset);
        assets.push(asset);
        totalBytes += bytes.byteLength;
      }
      figureNode.props = { ...(figureNode.props || {}), src: `a1img://${asset.id}` };
    } catch (error) {
      warnings.push(`A Figure image was not synced: ${error.message}`);
    }
  }
  return assets;
}

async function exportLinkedPage(link) {
  const root = linkedRootFor(link);
  if (!root) throw new Error('The linked A1 page root was not found on this Figma page. Render it from A1 first.');
  const { node, warnings } = exportContainerNode(root);
  const assets = await collectPageFigureAssets(root, node, warnings);
  return {
    json: JSON.stringify({
      schemaVersion: '1.0.0',
      page: {
        id: link.pageId,
        name: root.name.replace(/^A1 ·\s*/, '') || 'Untitled',
        layout: { type: 'PageLayout', regions: [{ id: 'main', name: 'Main', nodes: node.nodes || [] }] },
      },
    }, null, 2),
    warnings,
    assets,
    rootNodeId: root.id,
    figmaPageId: figma.currentPage.id,
    figmaFileKey: figma.fileKey || '',
  };
}

function pageTitleFromFigmaFrame(frame) {
  const name = String(frame && frame.name || '').trim();
  const linkedTitle = name.match(/^A1\s*·\s*.+?\s*\/\s*(.+)$/);
  return (linkedTitle ? linkedTitle[1] : name) || 'Untitled';
}

function createPageLinkId() {
  return `figma-link-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Export the selected top-level Figma frame as a new, manually linked A1 page. */
async function exportNewA1Page(project) {
  if (!project || typeof project.id !== 'string' || !project.id) {
    throw new Error('Choose an A1 project before creating a page.');
  }
  const root = topmostExportableNode();
  if (!root || root.type !== 'FRAME' || !canExportContainer(root)) {
    throw new Error('Select one top-level Figma frame with supported A1 content before creating a page.');
  }
  const { node, warnings } = exportContainerNode(root);
  const assets = await collectPageFigureAssets(root, node, warnings);
  const title = pageTitleFromFigmaFrame(root);
  const linkId = createPageLinkId();
  const projectName = typeof project.name === 'string' && project.name.trim() ? project.name.trim() : project.id;
  // Name and tag the source frame now, so it can be discovered as the new
  // page's linked root as soon as A1 persists the generated page id.
  root.name = `A1 · ${projectName} / ${title}`;
  root.setPluginData(PAGE_SYNC_LINK_KEY, linkId);
  root.setPluginData('project-id', project.id);
  root.setPluginData('mode', 'manual');
  return {
    projectId: project.id,
    projectName,
    title,
    json: JSON.stringify({
      schemaVersion: '1.0.0',
      page: {
        id: `figma-${String(root.id).replace(/[^a-zA-Z0-9_-]+/g, '-')}`,
        name: title,
        layout: { type: 'PageLayout', regions: [{ id: 'main', name: 'Main', nodes: node.nodes || [] }] },
      },
    }, null, 2),
    warnings,
    assets,
    figma: {
      linkId,
      figmaRootNodeId: root.id,
      figmaPageId: figma.currentPage.id,
      figmaFileKey: figma.fileKey || '',
    },
  };
}

function normalizedLinkFrameName(value) {
  return String(value || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase();
}

/**
 * Match an outer frame named `A1 · Project / Page` to the local A1 manifest.
 * A unique `A1 · Page` name is accepted as a convenient legacy fallback.
 */
function detectLinkedPageFromFrameNames(projects) {
  if (!Array.isArray(projects)) return null;
  const candidates = [];
  for (const project of projects) {
    if (!project || typeof project.id !== 'string' || !Array.isArray(project.pages)) continue;
    for (const page of project.pages) {
      if (!page || typeof page.id !== 'string') continue;
      const projectName = String(project.name || project.id).trim();
      const pageTitle = String(page.title || page.id).trim();
      candidates.push({
        project,
        page,
        fullName: normalizedLinkFrameName(`A1 · ${projectName} / ${pageTitle}`),
        pageOnlyName: normalizedLinkFrameName(`A1 · ${pageTitle}`),
      });
    }
  }
  for (const root of figma.currentPage.children) {
    if (!root || root.type !== 'FRAME') continue;
    const name = normalizedLinkFrameName(root.name);
    let match = candidates.find((candidate) => candidate.fullName === name);
    if (!match) {
      const pageOnly = candidates.filter((candidate) => candidate.pageOnlyName === name);
      if (pageOnly.length === 1) match = pageOnly[0];
    }
    if (!match) continue;
    const link = {
      ...(match.page.link || {}),
      linkId: match.page.link?.linkId || `figma-link-${match.project.id}-${match.page.id}`,
      projectId: match.project.id,
      pageId: match.page.id,
      mode: match.page.link?.mode || 'manual',
      projectName: String(match.project.name || ''),
      pageTitle: String(match.page.title || ''),
      figmaRootNodeId: root.id,
      figmaPageId: figma.currentPage.id,
      figmaFileKey: figma.fileKey || '',
    };
    root.setPluginData(PAGE_SYNC_LINK_KEY, link.linkId);
    root.setPluginData('project-id', link.projectId);
    root.setPluginData('page-id', link.pageId);
    return link;
  }
  return null;
}

// ─── Registries ──────────────────────────────────────────────────────────────


// ── Top Header (Breakpoint variants; Nav Items + Actions slots) ─────────────

function topHeaderSlot(instance, name) {
  return currentInstance(instance).findOne((node) => node.type === 'SLOT' && canonicalKey(node.name) === canonicalKey(name));
}

function exportTopHeader(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};

  const logoText = componentPropertyValue(instance, 'Logo text', 'TEXT');
  if (typeof logoText === 'string' && logoText) props.logoText = logoText;

  // Nav items are read regardless of the Breakpoint variant: xs/sm hide the
  // slot visually, but the composition is the breakpoint-agnostic source.
  const usedNavIds = new Set();
  const navItems = [];
  for (const nav of currentInstance(instance).findAll((node) => node.type === 'INSTANCE' && componentSetName(node) === 'Top Header Nav Item' && node.visible !== false)) {
    const label = componentPropertyValue(nav, 'Label', 'TEXT') || 'Nav item';
    const item = { id: slugifyOptionValue(label, usedNavIds), label };
    if (componentPropertyValue(nav, 'Show icon', 'BOOLEAN') === true) {
      const iconName = iconNameFromInstance(nav, 'Nav icon') || iconNameFromSwapValue(componentPropertyValue(nav, 'Icon', 'INSTANCE_SWAP'));
      if (iconName) item.icon = iconName;
      else warnings.push(`Nav item "${label}" has an icon that could not be resolved — icon omitted.`);
    }
    const state = componentPropertyValue(nav, 'State', 'VARIANT');
    if (state === 'active') item.active = true;
    if (state === 'hover') warnings.push(`Nav item "${label}" is in a visual-only hover state — no prop was emitted.`);
    if (componentPropertyValue(nav, 'Show chevron', 'BOOLEAN') === true) {
      warnings.push(`Nav item "${label}" shows the submenu chevron — submenu contents are runtime-owned and were not exported.`);
    }
    navItems.push(item);
  }
  if (navItems.length > 0) props.navItems = navItems;

  const actionsSlot = topHeaderSlot(instance, 'Actions');
  const usedActionIds = new Set();
  const actions = [];
  if (actionsSlot) {
    // Direct slot children are the contract, but tolerate a wrapper frame
    // inside the slot (deep scan) so restructures don't silently drop actions.
    const isActionButton = (node) => node.type === 'INSTANCE' && componentSetName(node) === 'Icon Button' && node.visible !== false;
    let actionNodes = actionsSlot.children.filter(isActionButton);
    if (actionNodes.length === 0) actionNodes = actionsSlot.findAll(isActionButton);
    for (const action of actionNodes) {
      const label = componentText(action, 'Aria label', 'Action');
      const entry = { id: slugifyOptionValue(label, usedActionIds), label };
      const iconName = iconNameFromInstance(action, 'Icon') || iconNameFromSwapValue(componentPropertyValue(action, 'Icon', 'INSTANCE_SWAP'));
      if (iconName) entry.icon = iconName;
      actions.push(entry);
    }
    // A visible Button in the Actions slot is the sign-in affordance. It maps
    // to the React `loginButton` prop as `{ label }`; click behavior stays
    // runtime-owned.
    const loginButtons = actionsSlot.children.filter((node) => node.type === 'INSTANCE' && componentSetName(node) === 'Button' && node.visible !== false);
    if (loginButtons.length > 0) {
      props.loginButton = { label: componentText(loginButtons[0], 'Label', 'Sign in') };
    }
    if (loginButtons.length > 1) {
      warnings.push('Top Header supports one sign-in Button — only the first Button in the Actions slot was exported as loginButton.');
    }
  }
  if (actions.length > 0) props.actions = actions;

  const breakpoint = componentPropertyValue(instance, 'Breakpoint', 'VARIANT');
  if (breakpoint && breakpoint !== 'lg') {
    warnings.push(`Breakpoint=${breakpoint} is a visual preview width — the React TopHeader is fluid and no breakpoint prop was emitted.`);
  }

  return { node: { id: componentId('TopHeader', instance), type: 'TopHeader', props }, warnings };
}

async function applyTopHeader(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};

  const assignments = {};
  // projectLayout chrome uses `logo` as the wordmark string; the catalog uses `logoText`.
  const wordmark = typeof props.logoText === 'string' ? props.logoText : (typeof props.logo === 'string' ? props.logo : undefined);
  if (wordmark !== undefined) queueComponentProperty(instance, assignments, 'Logo text', wordmark, 'TEXT', warnings);
  if ('loginButton' in props) queueComponentProperty(instance, assignments, 'Show login button', Boolean(props.loginButton), 'BOOLEAN', warnings);
  if (A1_BREAKPOINTS.includes(activeRenderBreakpoint)) {
    queueComponentProperty(instance, assignments, 'Breakpoint', activeRenderBreakpoint, 'VARIANT', warnings, 'Top Header breakpoint preview');
  }
  applyQueuedProperties(instance, assignments, warnings, 'Top Header properties');
  // loginButton carries `{ label }` (a legacy string is the label itself);
  // apply the label onto the sign-in Button in the Actions slot.
  const loginLabel = typeof props.loginButton === 'string'
    ? props.loginButton
    : (props.loginButton && typeof props.loginButton === 'object' && typeof props.loginButton.label === 'string' ? props.loginButton.label : undefined);
  if (loginLabel) {
    const applySlot = topHeaderSlot(instance, 'Actions');
    const loginInstance = applySlot && applySlot.children.find((child) => child.type === 'INSTANCE' && componentSetName(child) === 'Button');
    if (loginInstance) {
      const loginAssignments = {};
      queueComponentProperty(loginInstance, loginAssignments, 'Label', loginLabel, 'TEXT', warnings, 'Sign-in button label');
      applyQueuedProperties(loginInstance, loginAssignments, warnings, 'Sign-in button properties');
    } else {
      warnings.push('No sign-in Button instance exists in the Actions slot — the loginButton label was not applied.');
    }
  }
  if (props.navIconPosition !== undefined) {
    warnings.push('navIconPosition is a responsive runtime prop — nav icons show the start position via each item\'s Show icon.');
  }

  const navItems = Array.isArray(props.navItems)
    ? props.navItems.filter((item) => item && typeof item === 'object' && item.mobileOnly !== true && item.isHeader !== true)
    : [];
  const navInstances = await reconcileGroupOptionInstances(instance, 'TopHeader', 'Top Header Nav Item', navItems.length, warnings);
  for (let index = 0; index < Math.min(navInstances.length, navItems.length); index += 1) {
    const navInstance = currentInstance(navInstances[index]);
    const item = navItems[index];
    const label = typeof item.label === 'string' && item.label ? item.label : `Nav item ${index + 1}`;
    const hasSubmenu = Array.isArray(item.items) && item.items.length > 0;
    const navAssignments = {};
    queueComponentProperty(navInstance, navAssignments, 'Label', label, 'TEXT', warnings, `Nav item ${index + 1} label`);
    queueComponentProperty(navInstance, navAssignments, 'State', item.active === true ? 'active' : 'default', 'VARIANT', warnings, `Nav item ${index + 1} state`);
    queueComponentProperty(navInstance, navAssignments, 'Show icon', typeof item.icon === 'string' && item.icon.length > 0, 'BOOLEAN', warnings, `Nav item ${index + 1} icon visibility`);
    queueComponentProperty(navInstance, navAssignments, 'Show chevron', hasSubmenu, 'BOOLEAN', warnings, `Nav item ${index + 1} chevron`);
    if (typeof item.icon === 'string' && item.icon) {
      const iconComponent = findIconComponent(item.icon);
      if (iconComponent) queueComponentProperty(navInstance, navAssignments, 'Icon', iconComponent.id, 'INSTANCE_SWAP', warnings, `Nav item ${index + 1} icon`);
      else warnings.push(`No icon component named "${item.icon}" exists in this file — nav item "${label}" keeps the default glyph.`);
    }
    applyQueuedProperties(navInstance, navAssignments, warnings, `Nav item ${index + 1} properties`);
    if (hasSubmenu) warnings.push(`Nav item "${label}" submenu contents are runtime-owned — the chevron affordance was applied.`);
  }

  const actions = Array.isArray(props.actions)
    ? props.actions.filter((action) => action && typeof action === 'object')
    : [];
  const actionInstances = await reconcileGroupOptionInstances(instance, 'TopHeaderActions', 'Icon Button', actions.length, warnings);
  for (let index = 0; index < Math.min(actionInstances.length, actions.length); index += 1) {
    const actionInstance = currentInstance(actionInstances[index]);
    const action = actions[index];
    const label = typeof action.label === 'string' && action.label ? action.label : `Action ${index + 1}`;
    const actionAssignments = {};
    queueComponentProperty(actionInstance, actionAssignments, 'Aria label', label, 'TEXT', warnings, `Action ${index + 1} label`);
    if (typeof action.icon === 'string' && action.icon) {
      const iconComponent = findIconComponent(action.icon);
      if (iconComponent) queueComponentProperty(actionInstance, actionAssignments, 'Icon', iconComponent.id, 'INSTANCE_SWAP', warnings, `Action ${index + 1} icon`);
      else warnings.push(`No icon component named "${action.icon}" exists in this file — action "${label}" keeps the default glyph.`);
    }
    applyQueuedProperties(actionInstance, actionAssignments, warnings, `Action ${index + 1} properties`);
    if (action.badge !== undefined) warnings.push(`Action "${label}" badge is not represented on the Figma Icon Button instance.`);
    if (Array.isArray(action.items) && action.items.length > 0) warnings.push(`Action "${label}" dropdown items are runtime-owned — not represented.`);
  }

  return instance;
}

async function importTopHeader(node, warnings) {
  const instance = await createComponentInstance('Top Header', warnings);
  await applyTopHeader(instance, node, warnings);
  return instance;
}

// ── Page Layout (v1: Top Header + Page Content Slot) ────────────────────────

function pageLayoutContentSlot(instance) {
  return nativeSlot(currentInstance(instance), 'Page Content Slot')
    || nativeSlot(currentInstance(instance), 'Page content');
}

function pageLayoutTopHeader(instance) {
  try {
    return currentInstance(instance).findOne((node) => {
      try {
        return node.type === 'INSTANCE' && componentSetName(node) === 'Top Header' && node.visible !== false;
      } catch {
        return false;
      }
    });
  } catch {
    return null;
  }
}

function pageLayoutChildNodes(node) {
  if (Array.isArray(node.children)) {
    return node.children.filter((child) => child && typeof child === 'object');
  }
  const collected = [];
  for (const key of ['nodes', 'regions']) {
    if (node && node[key]) collectSupportedNodes(node[key], collected);
  }
  return collected;
}

function exportPageLayout(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const children = [];
  const header = pageLayoutTopHeader(instance);
  if (header) {
    const result = exportTopHeader(header);
    children.push(result.node);
    for (const warning of result.warnings) warnings.push(warning);
  }
  const slot = pageLayoutContentSlot(instance);
  if (slot) children.push(...exportFreeContent(slot, warnings));
  else warnings.push('No Page Content Slot was found — only the Top Header was exported.');
  const breakpoint = componentPropertyValue(instance, 'breakpoint', 'VARIANT');
  if (breakpoint && breakpoint !== 'xs') {
    warnings.push(`breakpoint=${breakpoint} is a visual preview width — the React PageLayout is fluid and no breakpoint prop was emitted.`);
  }
  warnings.push('Page Layout v1 represents the Top Header and main content only — sidebar, aside, footer, sticky header, and viewport-height options are runtime-owned.');
  // The playground-preview flags suppress the configurator's placeholder
  // header/sidebar/footer slots so the exported children render alone.
  const props = { showHeader: false, showSidebar: false, showFooter: false };
  const node = { id: componentId('PageLayout', instance), type: 'PageLayout', props };
  if (children.length > 0) node.children = children;
  return { node, warnings };
}

async function applyPageLayout(instance, node, warnings) {
  if (A1_BREAKPOINTS.includes(activeRenderBreakpoint)) {
    const assignments = {};
    queueComponentProperty(instance, assignments, 'Breakpoint', activeRenderBreakpoint, 'VARIANT', warnings, 'Page Layout breakpoint preview');
    applyQueuedProperties(instance, assignments, warnings, 'Page Layout properties');
  }
  const children = pageLayoutChildNodes(node);
  const headerNode = children.find((child) => child.type === 'TopHeader');
  const headerInstance = pageLayoutTopHeader(instance);
  if (headerNode && headerInstance) await applyTopHeader(headerInstance, headerNode, warnings);
  else if (headerNode) warnings.push('No Top Header instance exists in this Page Layout — the TopHeader child was not applied.');

  const contentNodes = supportedChildren(children.filter((child) => child !== headerNode), warnings, 'Page Layout');
  let slot = pageLayoutContentSlot(instance);
  if (!slot) {
    if (contentNodes.length > 0) warnings.push('No Page Content Slot was found — content children were not rendered.');
    return instance;
  }
  for (const existing of [...slot.children]) {
    try { existing.remove(); } catch (error) {
      try { existing.visible = false; } catch (visibilityError) {
        warnings.push(`Page Layout placeholder could not be cleared: ${visibilityError.message}`);
      }
    }
  }
  for (const child of contentNodes) {
    const childInstance = await renderImportedNode(child, warnings);
    slot = pageLayoutContentSlot(instance);
    if (!slot) {
      warnings.push('Page Content Slot could not be refreshed — remaining child nodes were not rendered.');
      break;
    }
    appendImportedChild(slot, childInstance, child, warnings);
  }
  return instance;
}

async function importPageLayout(node, warnings) {
  const instance = await createComponentInstance('Page Layout', warnings);
  await applyPageLayout(instance, node, warnings);
  return instance;
}

// ── Bottom Sheet (mobile overlay shell + content slot) ──────────────────────

const BOTTOM_SHEET_DETENT_LABELS = {
  0: 'collapsed',
  1: 'half',
  2: 'full',
};

function bottomSheetDetentIndex(value, fallback = 1) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Math.min(2, Math.round(value)));
  }
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return fallback;
  if (raw === '0' || raw.includes('collapsed') || raw.includes('closed')) return 0;
  if (raw === '1' || raw.includes('half') || raw.includes('medium') || raw.includes('mid')) return 1;
  if (raw === '2' || raw.includes('full') || raw.includes('expanded') || raw.includes('open')) return 2;
  return fallback;
}

function bottomSheetDetentProperty(instance) {
  for (const name of ['Default detent', 'Default Detent', 'Open state', 'Detent', 'State']) {
    const variant = componentProperty(instance, name, 'VARIANT');
    if (variant) return variant;
    const text = componentProperty(instance, name, 'TEXT');
    if (text) return text;
  }
  return null;
}

function bottomSheetDetentValueForProperty(property, index) {
  const wanted = BOTTOM_SHEET_DETENT_LABELS[index] || BOTTOM_SHEET_DETENT_LABELS[1];
  const current = String(property && property.property && property.property.value || '').trim();
  if (!current) return property && property.property && property.property.type === 'TEXT' ? String(index) : wanted;
  if (/^\d+$/.test(current)) return String(index);
  const lower = current.toLowerCase();
  if (lower === current) return wanted;
  if (current.toUpperCase() === current) return wanted.toUpperCase();
  return wanted.charAt(0).toUpperCase() + wanted.slice(1);
}

function bottomSheetContentSlot(instance) {
  const current = currentInstance(instance);
  for (const name of ['Content Slot', 'Sheet Content Slot', 'Bottom Sheet Content Slot', 'Body Slot', 'Content', 'Body']) {
    const slot = nativeSlot(current, name) || namedSlot(current, name);
    if (slot) return slot;
  }
  return null;
}

function exportBottomSheet(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  const title = componentText(instance, 'Title', '');
  if (title.trim()) props.title = title.trim();
  const detentProp = bottomSheetDetentProperty(instance);
  if (detentProp) {
    const defaultDetent = bottomSheetDetentIndex(detentProp.property.value, 1);
    if (defaultDetent !== 1) props.defaultDetent = defaultDetent;
  }
  const slot = bottomSheetContentSlot(instance);
  const children = slot ? exportFreeContent(slot, warnings) : [];
  if (!slot) warnings.push('Bottom Sheet content slot was not found — only sheet props were exported.');
  warnings.push('Bottom Sheet is mobile-only at runtime; detents and drag behavior are represented as a static Figma preview.');
  const node = { id: componentId('BottomSheet', instance), type: 'BottomSheet' };
  if (Object.keys(props).length) node.props = props;
  if (children.length) node.children = children;
  return { node, warnings };
}

async function applyBottomSheet(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const assignments = {};
  if (typeof props.title === 'string') {
    queueComponentProperty(instance, assignments, 'Title', props.title, 'TEXT', warnings, 'Bottom Sheet title');
  }
  const detentProp = bottomSheetDetentProperty(instance);
  if (detentProp) {
    assignments[detentProp.key] = bottomSheetDetentValueForProperty(detentProp, bottomSheetDetentIndex(props.defaultDetent, 1));
  } else if (props.defaultDetent !== undefined || props.detent !== undefined) {
    warnings.push('Bottom Sheet detent could not be applied — no matching Figma property was found.');
  }
  applyQueuedProperties(instance, assignments, warnings, 'Bottom Sheet properties');

  const children = supportedChildren(node.children || [], warnings, 'Bottom Sheet');
  if (children.length > 0) {
    let slot = bottomSheetContentSlot(instance);
    if (!slot) {
      warnings.push('Bottom Sheet content slot was not found — children were not rendered.');
    } else {
      for (const existing of [...slot.children]) {
        try { existing.remove(); } catch (error) {
          try { existing.visible = false; } catch (visibilityError) {
            warnings.push(`Bottom Sheet placeholder could not be cleared: ${visibilityError.message}`);
          }
        }
      }
      for (const child of children) {
        const childInstance = await renderImportedNode(child, warnings);
        slot = bottomSheetContentSlot(instance);
        if (!slot) {
          warnings.push('Bottom Sheet content slot could not be refreshed — remaining child nodes were not rendered.');
          break;
        }
        appendImportedChild(slot, childInstance, child, warnings);
      }
    }
  }
  if (props.detents !== undefined) warnings.push('Bottom Sheet detents are runtime-owned in the current Figma component — defaultDetent is the only preview state applied.');
  for (const runtimeProp of ['detent', 'onDetentChange', 'className', 'id']) {
    if (props[runtimeProp] !== undefined) warnings.push(`"${runtimeProp}" has no Figma representation — ignored.`);
  }
  return instance;
}

async function importBottomSheet(node, warnings) {
  const instance = await createComponentInstance('Bottom Sheet', warnings);
  await applyBottomSheet(instance, node, warnings);
  return instance;
}

// ── Chip Group (Chip slot reconciliation) ───────────────────────────────────

const CHIP_SIZES = ['sm', 'md', 'lg'];

function exportChipGroup(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  const groupLabel = componentText(instance, 'Label', '');
  if (componentBoolean(instance, 'Show label', false) && groupLabel.trim()) props.label = groupLabel.trim();
  const chips = groupOptionInstancesInSlot(instance, 'Chip slot', 'Chip');
  const usedIds = new Set();
  const items = [];
  let anyMenu = false;
  let size = null;
  for (const chip of chips) {
    if (chip.visible === false) continue;
    const title = componentText(chip, 'Label', 'Chip');
    const item = { id: slugifyOptionValue(title, usedIds), title };
    if (componentBoolean(chip, 'Show icon', false)) {
      const iconName = iconNameFromInstance(chip, 'Icon') || iconNameFromSwapValue(componentPropertyValue(chip, 'Icon', 'INSTANCE_SWAP'));
      if (iconName) item.icon = iconName;
    }
    // Per-item flags: the group `behavior` is a selection semantic, not a
    // visual state, so carets/selection/disabled travel on each item.
    if (componentBoolean(chip, 'Show caret', false)) { item.menu = true; anyMenu = true; }
    const state = componentPropertyValue(chip, 'State', 'VARIANT');
    if (state === 'selected') item.selected = true;
    if (state === 'disabled') item.disabled = true;
    const chipSize = componentPropertyValue(chip, 'Size', 'VARIANT');
    if (!size && CHIP_SIZES.includes(chipSize)) size = chipSize;
    items.push(item);
  }
  if (items.length > 0) props.items = items;
  if (size && size !== 'md') props.size = size;
  if (anyMenu) warnings.push('A chip shows the menu caret — a1-web previews representative menu items; real menu contents are runtime-owned.');
  return { node: { id: componentId('ChipGroup', instance), type: 'ChipGroup', props }, warnings };
}

async function applyChipGroup(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const assignments = {};
  queueComponentProperty(instance, assignments, 'Label', typeof props.label === 'string' ? props.label : '', 'TEXT', warnings, 'Chip Group label');
  queueComponentProperty(instance, assignments, 'Show label', typeof props.label === 'string' && props.label.trim().length > 0, 'BOOLEAN', warnings, 'Chip Group label visibility');
  applyQueuedProperties(instance, assignments, warnings, 'Chip Group properties');
  const behavior = typeof props.behavior === 'string' ? props.behavior : 'multiple';
  const size = CHIP_SIZES.includes(props.size) ? props.size : 'md';
  const items = Array.isArray(props.items) ? props.items.filter((item) => item && typeof item === 'object') : [];
  const chipInstances = await reconcileGroupOptionInstances(instance, 'ChipGroup', 'Chip', items.length, warnings);
  for (let index = 0; index < Math.min(chipInstances.length, items.length); index += 1) {
    const chip = groupOptionInstancesInSlot(currentInstance(instance), 'Chip slot', 'Chip')[index];
    if (!chip) break;
    const item = items[index];
    const title = typeof item.title === 'string' && item.title ? item.title : `Chip ${index + 1}`;
    const chipAssignments = {};
    queueComponentProperty(chip, chipAssignments, 'Label', title, 'TEXT', warnings, `Chip ${index + 1} label`);
    queueComponentProperty(chip, chipAssignments, 'Size', size, 'VARIANT', warnings, `Chip ${index + 1} size`);
    const selectable = behavior === 'single' || behavior === 'multiple';
    const hasExplicitStates = items.some((entry) => entry.selected === true || entry.disabled === true);
    const state = item.disabled === true
      ? 'disabled'
      : item.selected === true || (!hasExplicitStates && selectable && index === 0) ? 'selected' : 'default';
    queueComponentProperty(chip, chipAssignments, 'State', state, 'VARIANT', warnings, `Chip ${index + 1} state`);
    queueComponentProperty(chip, chipAssignments, 'Show icon', typeof item.icon === 'string' && item.icon.length > 0, 'BOOLEAN', warnings, `Chip ${index + 1} icon visibility`);
    queueComponentProperty(chip, chipAssignments, 'Show caret', item.menu === true || behavior === 'menu', 'BOOLEAN', warnings, `Chip ${index + 1} caret`);
    if (typeof item.icon === 'string' && item.icon) {
      const iconComponent = findIconComponent(item.icon);
      if (iconComponent) queueComponentProperty(chip, chipAssignments, 'Icon', iconComponent.id, 'INSTANCE_SWAP', warnings, `Chip ${index + 1} icon`);
      else warnings.push(`No icon component named "${item.icon}" exists in this file — chip "${title}" keeps the default glyph.`);
    }
    applyQueuedProperties(chip, chipAssignments, warnings, `Chip ${index + 1} properties`);
    if (behavior === 'navigation' && item.href) warnings.push(`Chip "${title}" href is runtime navigation — not represented in Figma.`);
  }
  if (behavior === 'menu' || items.some((entry) => entry.menu === true)) warnings.push('Menu chip contents are runtime-owned — only the caret affordance was applied.');
  return instance;
}

function exportChip(instance) {
  // A lone Chip exports as a one-item ChipGroup: the page-definition schema
  // has no standalone Chip node.
  instance = currentInstance(instance);
  const warnings = [];
  const title = componentText(instance, 'Label', 'Chip');
  const item = { id: slugifyOptionValue(title, new Set()), title };
  if (componentBoolean(instance, 'Show icon', false)) {
    const iconName = iconNameFromInstance(instance, 'Icon') || iconNameFromSwapValue(componentPropertyValue(instance, 'Icon', 'INSTANCE_SWAP'));
    if (iconName) item.icon = iconName;
  }
  const props = { items: [item] };
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  if (CHIP_SIZES.includes(size) && size !== 'md') props.size = size;
  if (componentBoolean(instance, 'Show caret', false)) item.menu = true;
  const state = componentPropertyValue(instance, 'State', 'VARIANT');
  if (state === 'selected') item.selected = true;
  if (state === 'disabled') item.disabled = true;
  warnings.push('A single Chip exports as a one-item ChipGroup node.');
  return { node: { id: componentId('ChipGroup', instance), type: 'ChipGroup', props }, warnings };
}

async function applyChip(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const items = Array.isArray(props.items) ? props.items.filter((item) => item && typeof item === 'object') : [];
  const item = items[0] || {};
  const title = typeof item.title === 'string' && item.title ? item.title : 'Chip';
  const assignments = {};
  queueComponentProperty(instance, assignments, 'Label', title, 'TEXT', warnings, 'Chip label');
  if (CHIP_SIZES.includes(props.size)) queueComponentProperty(instance, assignments, 'Size', props.size, 'VARIANT', warnings, 'Chip size');
  queueComponentProperty(instance, assignments, 'Show icon', typeof item.icon === 'string' && item.icon.length > 0, 'BOOLEAN', warnings, 'Chip icon visibility');
  const chipState = item.disabled === true ? 'disabled' : item.selected === true ? 'selected' : 'default';
  queueComponentProperty(instance, assignments, 'State', chipState, 'VARIANT', warnings, 'Chip state');
  queueComponentProperty(instance, assignments, 'Show caret', item.menu === true || props.behavior === 'menu', 'BOOLEAN', warnings, 'Chip caret');
  if (typeof item.icon === 'string' && item.icon) {
    const iconComponent = findIconComponent(item.icon);
    if (iconComponent) queueComponentProperty(instance, assignments, 'Icon', iconComponent.id, 'INSTANCE_SWAP', warnings, 'Chip icon');
    else warnings.push(`No icon component named "${item.icon}" exists in this file — the chip keeps the default glyph.`);
  }
  applyQueuedProperties(instance, assignments, warnings, 'Chip properties');
  if (items.length > 1) warnings.push('Only the first ChipGroup item was applied to the selected single Chip.');
  return instance;
}

async function importChipGroup(node, warnings) {
  const instance = await createComponentInstance('Chip Group', warnings);
  await applyChipGroup(instance, node, warnings);
  return instance;
}

// ── Data Table (default density; fixed 4×4 grid, visibility reconcile) ──────

const DATA_TABLE_MAX_COLUMNS = 4;
const DATA_TABLE_MAX_ROWS = 4;

function dataTableHeaderCells(instance) {
  return currentInstance(instance).findAll((node) => node.type === 'INSTANCE' && componentSetName(node) === 'Data Table Header Cell');
}

function dataTableRowFrames(instance) {
  return currentInstance(instance).findAll((node) => node.type === 'FRAME' && /^Row \d+$/.test(node.name));
}

function exportDataTable(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const usedKeys = new Set();
  const columns = [];
  let defaultSort = null;
  for (const header of dataTableHeaderCells(instance)) {
    if (header.visible === false) continue;
    const label = componentText(header, 'Label', `Column ${columns.length + 1}`);
    const sort = componentPropertyValue(header, 'Sort', 'VARIANT');
    const align = componentPropertyValue(header, 'Align', 'VARIANT');
    const column = { key: slugifyOptionValue(label, usedKeys), label };
    if (sort && sort !== 'none') column.sortable = true;
    if (align === 'end') column.align = 'end';
    if ((sort === 'ascending' || sort === 'descending') && !defaultSort) {
      defaultSort = { key: column.key, direction: sort === 'descending' ? 'desc' : 'asc' };
    }
    columns.push(column);
  }
  const rows = [];
  for (const frame of dataTableRowFrames(instance)) {
    if (frame.visible === false) continue;
    const cells = frame.children.filter((node) => node.type === 'INSTANCE' && componentSetName(node) === 'Data Table Cell');
    const row = { id: `row-${rows.length + 1}` };
    cells.forEach((cell, index) => {
      if (cell.visible === false || !columns[index]) return;
      row[columns[index].key] = componentText(cell, 'Value', '');
    });
    rows.push(row);
  }
  const props = {};
  if (columns.length > 0) props.columns = columns;
  if (rows.length > 0) props.rows = rows;
  if (defaultSort) props.defaultSort = defaultSort;
  warnings.push('The Figma Data Table is the default density — size, zebra, selection, search, pagination, notices, and column renderers are runtime-owned.');
  return { node: { id: componentId('DataTable', instance), type: 'DataTable', props }, warnings };
}

async function applyDataTable(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const columns = Array.isArray(props.columns) ? props.columns.filter((column) => column && typeof column === 'object') : [];
  const rows = Array.isArray(props.rows) ? props.rows.filter((row) => row && typeof row === 'object') : [];
  if (columns.length > DATA_TABLE_MAX_COLUMNS) warnings.push(`The Figma Data Table shows up to ${DATA_TABLE_MAX_COLUMNS} columns — additional JSON columns were not rendered.`);
  if (rows.length > DATA_TABLE_MAX_ROWS) warnings.push(`The Figma Data Table shows up to ${DATA_TABLE_MAX_ROWS} rows — additional JSON rows were not rendered.`);
  const defaultSort = props.defaultSort && typeof props.defaultSort === 'object' ? props.defaultSort : null;

  const headers = dataTableHeaderCells(instance);
  headers.forEach((header, index) => {
    const column = columns[index];
    const inRange = Boolean(column) && index < DATA_TABLE_MAX_COLUMNS;
    // With no columns supplied, keep the existing composition untouched.
    if (columns.length === 0) return;
    try { header.visible = inRange; } catch (error) { /* nested visibility can be locked */ }
    if (!inRange) return;
    const assignments = {};
    queueComponentProperty(header, assignments, 'Label', typeof column.label === 'string' ? column.label : `Column ${index + 1}`, 'TEXT', warnings, `Column ${index + 1} label`);
    const sorted = defaultSort && defaultSort.key === column.key;
    const sortValue = sorted ? (defaultSort.direction === 'desc' ? 'descending' : 'ascending') : (column.sortable ? 'unsorted' : 'none');
    queueComponentProperty(header, assignments, 'Sort', sortValue, 'VARIANT', warnings, `Column ${index + 1} sort`);
    queueComponentProperty(header, assignments, 'Align', column.align === 'end' ? 'end' : 'start', 'VARIANT', warnings, `Column ${index + 1} align`);
    applyQueuedProperties(header, assignments, warnings, `Column ${index + 1} properties`);
  });

  const frames = dataTableRowFrames(instance);
  const visibleRows = Math.min(rows.length, DATA_TABLE_MAX_ROWS, frames.length);
  frames.forEach((frame, rowIndex) => {
    const row = rows[rowIndex];
    const isVisible = Boolean(row) && rowIndex < DATA_TABLE_MAX_ROWS;
    if (rows.length > 0) {
      try { frame.visible = isVisible; } catch (error) { /* nested visibility can be locked */ }
    }
    if (!isVisible && rows.length > 0) return;
    const cells = frame.children.filter((n) => n.type === 'INSTANCE' && componentSetName(n) === 'Data Table Cell');
    cells.forEach((cell, colIndex) => {
      const column = columns[colIndex];
      const inColumn = Boolean(column) && colIndex < DATA_TABLE_MAX_COLUMNS;
      if (columns.length > 0) {
        try { cell.visible = inColumn; } catch (error) { /* nested visibility can be locked */ }
      }
      if (!inColumn || !row) return;
      const value = row[column.key];
      const assignments = {};
      queueComponentProperty(cell, assignments, 'Value', value === undefined || value === null ? '' : String(value), 'TEXT', warnings, `Row ${rowIndex + 1} ${column.key}`);
      queueComponentProperty(cell, assignments, 'Align', column.align === 'end' ? 'end' : 'start', 'VARIANT', warnings, `Row ${rowIndex + 1} ${column.key} align`);
      applyQueuedProperties(cell, assignments, warnings, `Row ${rowIndex + 1} cell properties`);
      // The hairline stays on every row except the last visible one.
      try { cell.strokeBottomWeight = rowIndex === visibleRows - 1 ? 0 : 1; } catch (error) { /* stroke override unavailable */ }
    });
  });
  return instance;
}

async function importDataTable(node, warnings) {
  const instance = createComponentInstance('Data Table');
  await applyDataTable(instance, node, warnings);
  return instance;
}

// ── Choice Group (Options slot; tiles may sit inside an embedded Grid) ──────

const CHOICE_SIZES = ['compact', 'default', 'comfortable'];
const CHOICE_GROUP_MAX_OPTIONS = 20;

function choiceGroupOptionsSlot(instance) {
  return currentInstance(instance).findOne((node) => node.type === 'SLOT' && canonicalKey(node.name) === canonicalKey('Options'));
}

// The Options slot may hold Choice Option tiles directly or nest them inside an
// embedded Grid frame (native GRID layout or a responsive plugin Grid carrying
// `{xs:n, md:n}` name/plugin-data metadata). Detect that container so export,
// reconciliation, and the `columns` prop all target the right frame.
function choiceGroupTileContainer(instance) {
  const slot = choiceGroupOptionsSlot(instance);
  if (!slot) return { slot: null, container: null, grid: null };
  const grid = slot.children.find((child) =>
    child.type === 'FRAME'
    && (child.layoutMode === 'GRID' || Boolean(readResponsiveGridColumns(child)) || isGridFrame(child)));
  return { slot, container: grid || slot, grid: grid || null };
}

function choiceGroupTiles(instance) {
  const { container } = choiceGroupTileContainer(instance);
  if (!container) return [];
  const isTile = (node) => node.type === 'INSTANCE' && componentSetName(node) === 'Choice Option';
  const direct = container.children.filter(isTile);
  return direct.length > 0 ? direct : container.findAll(isTile);
}

function exportChoiceGroup(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  const label = componentText(instance, 'Label', '');
  if (label.trim()) props.label = label.trim();
  if (componentBoolean(instance, 'Required', false)) props.required = true;
  if (componentBoolean(instance, 'Show helper', false)) {
    const helper = componentText(instance, 'Helper', '').trim();
    if (helper) props.hint = helper;
  }

  const { slot, grid } = choiceGroupTileContainer(instance);
  if (!slot) warnings.push('No Options slot was found — options were not exported.');
  if (grid) {
    const responsive = readResponsiveGridColumns(grid);
    if (responsive) props.columns = responsive;
    else if (grid.layoutMode === 'GRID') {
      try {
        if (Number.isInteger(grid.gridColumnCount) && grid.gridColumnCount > 0) props.columns = grid.gridColumnCount;
      } catch (error) { /* grid metadata unavailable */ }
    }
  }

  const usedValues = new Set();
  const options = [];
  const selectedValues = [];
  let multiple = false;
  let size = null;
  for (const tile of choiceGroupTiles(instance)) {
    if (tile.visible === false) continue;
    const tileLabel = componentText(tile, 'Label', `Option ${options.length + 1}`);
    const option = { value: slugifyOptionValue(tileLabel, usedValues), label: tileLabel };
    if (componentBoolean(tile, 'Show subtext', false)) {
      const subtext = componentText(tile, 'Subtext', '').trim();
      if (subtext) option.subtext = subtext;
    }
    if (componentBoolean(tile, 'Show icon', false)) {
      const iconName = iconNameFromInstance(tile, 'Icon') || iconNameFromSwapValue(componentPropertyValue(tile, 'Icon', 'INSTANCE_SWAP'));
      if (iconName) option.icon = iconName;
    }
    const state = componentPropertyValue(tile, 'State', 'VARIANT');
    if (state === 'disabled') option.disabled = true;
    if (state === 'selected') selectedValues.push(option.value);
    if (componentPropertyValue(tile, 'Type', 'VARIANT') === 'checkbox') multiple = true;
    const tileSize = componentPropertyValue(tile, 'Size', 'VARIANT');
    if (!size && CHOICE_SIZES.includes(tileSize)) size = tileSize;
    options.push(option);
  }
  if (options.length > 0) props.options = options;
  if (multiple) props.multiple = true;
  if (size && size !== 'default') props.size = size;
  if (selectedValues.length > 0) props.defaultValue = multiple ? selectedValues : selectedValues[0];
  return { node: { id: componentId('ChoiceGroup', instance), type: 'ChoiceGroup', props }, warnings };
}

async function applyChoiceGroup(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const assignments = {};
  queueComponentProperty(instance, assignments, 'Label', typeof props.label === 'string' ? props.label : '', 'TEXT', warnings, 'Choice Group label');
  queueComponentProperty(instance, assignments, 'Required', props.required === true, 'BOOLEAN', warnings, 'Choice Group required');
  const hint = typeof props.hint === 'string' ? props.hint : '';
  queueComponentProperty(instance, assignments, 'Helper', hint, 'TEXT', warnings, 'Choice Group helper');
  queueComponentProperty(instance, assignments, 'Show helper', hint.trim().length > 0, 'BOOLEAN', warnings, 'Choice Group helper visibility');
  applyQueuedProperties(instance, assignments, warnings, 'Choice Group properties');

  const options = Array.isArray(props.options) ? props.options.filter((option) => option && typeof option === 'object') : [];
  const multiple = props.multiple === true;
  const size = CHOICE_SIZES.includes(props.size) ? props.size : 'default';
  const rawSelection = props.defaultValue !== undefined ? props.defaultValue : props.value;
  const selected = new Set(
    Array.isArray(rawSelection)
      ? rawSelection.filter((value) => typeof value === 'string')
      : typeof rawSelection === 'string' && rawSelection ? [rawSelection] : []);

  const initial = choiceGroupTileContainer(instance);
  if (!initial.slot) {
    if (options.length > 0) warnings.push('No Options slot was found — options were not applied.');
    return instance;
  }
  if (options.length > CHOICE_GROUP_MAX_OPTIONS) {
    warnings.push(`Choice Group supports up to ${CHOICE_GROUP_MAX_OPTIONS} Figma tiles — additional JSON options were not rendered.`);
  }
  const wanted = options.length > 0 ? Math.min(options.length, CHOICE_GROUP_MAX_OPTIONS) : choiceGroupTiles(instance).length;
  const source = options.length > 0 ? await findComponentSourceAsync('Choice Option', warnings) : null;
  let tiles = choiceGroupTiles(instance);
  while (tiles.length < wanted) {
    if (!source) { warnings.push('No "Choice Option" component was found — missing tiles were not added.'); break; }
    const { container } = choiceGroupTileContainer(instance);
    if (!container) break;
    container.appendChild(source.createInstance());
    tiles = choiceGroupTiles(instance);
  }
  while (tiles.length > wanted) {
    tiles[tiles.length - 1].remove();
    tiles = choiceGroupTiles(instance);
  }

  // columns lives on the embedded Grid: a responsive object (or a fixed count,
  // stored as its xs value) syncs the grid's name/plugin-data metadata.
  if (props.columns !== undefined) {
    const { grid } = choiceGroupTileContainer(instance);
    if (grid) {
      const responsive = normalizeResponsiveColumns(props.columns)
        || (Number.isInteger(props.columns) && props.columns > 0 ? { xs: props.columns } : null);
      if (responsive) syncResponsiveGridColumnsMetadata(grid, responsive);
      else warnings.push('Choice Group columns value was not recognized — the embedded Grid was left unchanged.');
    } else {
      warnings.push('Choice Group columns need an embedded Grid inside the Options slot — the value was not represented.');
    }
  }

  const usedValues = new Set();
  tiles = choiceGroupTiles(instance);
  for (let index = 0; index < Math.min(tiles.length, options.length || tiles.length); index += 1) {
    const tile = tiles[index];
    const option = options[index];
    if (!option) break;
    const tileLabel = typeof option.label === 'string' && option.label ? option.label : `Option ${index + 1}`;
    const value = typeof option.value === 'string' && option.value ? option.value : slugifyOptionValue(tileLabel, usedValues);
    const state = option.disabled === true ? 'disabled' : selected.has(value) ? 'selected' : 'default';
    const tileAssignments = {};
    queueComponentProperty(tile, tileAssignments, 'Label', tileLabel, 'TEXT', warnings, `Option ${index + 1} label`);
    queueComponentProperty(tile, tileAssignments, 'Type', multiple ? 'checkbox' : 'radio', 'VARIANT', warnings, `Option ${index + 1} type`);
    queueComponentProperty(tile, tileAssignments, 'Size', size, 'VARIANT', warnings, `Option ${index + 1} size`);
    queueComponentProperty(tile, tileAssignments, 'State', state, 'VARIANT', warnings, `Option ${index + 1} state`);
    const subtext = typeof option.subtext === 'string' ? option.subtext : '';
    queueComponentProperty(tile, tileAssignments, 'Show subtext', subtext.trim().length > 0, 'BOOLEAN', warnings, `Option ${index + 1} subtext visibility`);
    if (subtext.trim()) queueComponentProperty(tile, tileAssignments, 'Subtext', subtext, 'TEXT', warnings, `Option ${index + 1} subtext`);
    queueComponentProperty(tile, tileAssignments, 'Show icon', typeof option.icon === 'string' && option.icon.length > 0, 'BOOLEAN', warnings, `Option ${index + 1} icon visibility`);
    if (typeof option.icon === 'string' && option.icon) {
      const iconComponent = findIconComponent(option.icon);
      if (iconComponent) queueComponentProperty(tile, tileAssignments, 'Icon', iconComponent.id, 'INSTANCE_SWAP', warnings, `Option ${index + 1} icon`);
      else warnings.push(`No icon component named "${option.icon}" exists in this file — option "${tileLabel}" keeps the default glyph.`);
    }
    applyQueuedProperties(tile, tileAssignments, warnings, `Option ${index + 1} properties`);
  }
  if (props.inlineIcon === true) warnings.push('inlineIcon layout is runtime-owned — tiles keep the stacked icon layout.');
  if (props.hideIndicator === true) warnings.push('hideIndicator is runtime-owned — tiles keep their selection indicators.');
  if (props.sections) warnings.push('Labeled sections are runtime-owned — options were applied as a flat list.');
  if (props.error || props.success) warnings.push('Error/success group messages are runtime-owned — the helper text was applied instead.');
  return instance;
}

async function importChoiceGroup(node, warnings) {
  const instance = createComponentInstance('Choice Group');
  await applyChoiceGroup(instance, node, warnings);
  return instance;
}

const EXPORTERS = {
  Icon: exportIcon,
  Button: exportButton,
  'Icon Button': exportIconButton,
  'Button Container': exportButtonContainer,
  Link: exportLink,
  Breadcrumb: exportBreadcrumb,
  Card: exportCard,
  Banner: exportBanner,
  Badge: exportBadge,
  Figure: exportFigure,
  'Definition List': exportDefinitionList,
  'Definition List Item': exportDefinitionListItem,
  Blockquote: exportBlockquote,
  Code: exportCode,
  Inline: exportInline,
  Section: exportSection,
  'Text Field': exportTextField,
  'Search Field': exportSearchField,
  Textarea: exportTextarea,
  Switch: exportSwitch,
  'Segmented Control': exportSegmentedControl,
  Tabs: exportTabs,
  Accordion: exportAccordion,
  Tooltip: exportTooltip,
  Pagination: exportPagination,
  'Page Nav': exportPageNav,
  'Tree Menu': exportTreeMenu,
  'Empty State': exportEmptyState,
  Select: exportSelect,
  Divider: exportDivider,
  Menu: exportMenu,
  Dialog: exportDialog,
  'Radio Group': exportRadioGroup,
  'Checkbox Group': exportCheckboxGroup,
  'Top Header': exportTopHeader,
  'Page Layout': exportPageLayout,
  'Bottom Sheet': exportBottomSheet,
  Chip: exportChip,
  'Chip Group': exportChipGroup,
  'Data Table': exportDataTable,
  'Choice Group': exportChoiceGroup,
};
const IMPORTERS = {
  Icon: importIcon,
  Button: importButton,
  IconButton: importIconButton,
  ButtonContainer: importButtonContainer,
  Link: importLink,
  Breadcrumb: importBreadcrumb,
  Card: importCard,
  Banner: importBanner,
  MessageBadge: importBadge,
  Figure: importFigure,
  DefinitionList: importDefinitionList,
  Blockquote: importBlockquote,
  Code: importCode,
  Inline: importInline,
  Section: importSection,
  TextField: importTextField,
  SearchField: importSearchField,
  TextareaField: importTextarea,
  Switch: importSwitch,
  SegmentedControl: importSegmentedControl,
  Tabs: importTabs,
  Accordion: importAccordion,
  Tooltip: importTooltip,
  Pagination: importPagination,
  PageNav: importPageNav,
  TreeMenu: importTreeMenu,
  MessageEmptyState: importEmptyState,
  SelectField: importSelect,
  Divider: importDivider,
  Menu: importMenu,
  Dialog: importDialog,
  RadioGroup: importRadioGroup,
  CheckboxGroup: importCheckboxGroup,
  TopHeader: importTopHeader,
  PageLayout: importPageLayout,
  BottomSheet: importBottomSheet,
  ChipGroup: importChipGroup,
  DataTable: importDataTable,
  ChoiceGroup: importChoiceGroup,
  Stack: importStack,
  Grid: importGrid,
  GridItem: importGridItem,
  Heading: importTextNode,
  Paragraph: importTextNode,
};
// Appliers update an EXISTING instance in place (the "Update selection" action)
// — the same functions the importers use after creating a fresh instance.
const APPLIERS = {
  Icon: applyIcon,
  Button: applyButton,
  'Icon Button': applyIconButton,
  'Button Container': applyButtonContainer,
  Link: applyLink,
  Breadcrumb: applyBreadcrumb,
  Card: applyCard,
  Banner: applyBanner,
  Badge: applyBadge,
  Figure: applyFigure,
  'Definition List': applyDefinitionList,
  Blockquote: applyBlockquote,
  Code: applyCode,
  Inline: applyInline,
  Section: applySection,
  'Text Field': applyTextField,
  'Search Field': applySearchField,
  Textarea: applyTextarea,
  Switch: applySwitch,
  'Segmented Control': applySegmentedControl,
  Tabs: applyTabs,
  Accordion: applyAccordion,
  Tooltip: applyTooltip,
  Pagination: applyPagination,
  'Page Nav': applyPageNav,
  'Tree Menu': applyTreeMenu,
  'Empty State': applyEmptyState,
  Select: applySelect,
  Divider: applyDivider,
  Menu: applyMenu,
  Dialog: applyDialog,
  'Radio Group': applyRadioGroup,
  'Checkbox Group': applyCheckboxGroup,
  'Top Header': applyTopHeader,
  'Page Layout': applyPageLayout,
  'Bottom Sheet': applyBottomSheet,
  Chip: applyChip,
  'Chip Group': applyChipGroup,
  'Data Table': applyDataTable,
  'Choice Group': applyChoiceGroup,
};

// ── Update: apply pasted JSON to the currently selected instance ────────────

async function handleUpdate(text) {
  const selection = figma.currentPage.selection;
  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    return postError('Not valid JSON: ' + error.message);
  }
  const nodes = [];
  collectSupportedNodes(data, nodes);
  if (selection.length === 1 && selection[0].type === 'TEXT') {
    const textNode = nodes.find((entry) => ['Heading', 'Paragraph', 'Link'].includes(entry.type));
    if (!textNode) return postError('The JSON has no Heading, Paragraph, or Link node to apply to the selected text layer.');
    const warnings = [];
    await applyTextSuggestion(selection[0], textStyleRequestForNode(textNode), warnings);
    if (textNode.content && typeof textNode.content.fallback === 'string') {
      const text = selection[0];
      if (text.fontName !== figma.mixed) await figma.loadFontAsync(text.fontName);
      text.characters = textNode.content.fallback;
    }
    await applyInlineLinkRanges(selection[0], textNode.content && textNode.content.inlineLinks, warnings);
    figma.notify('Updated the selected text layer from JSON.');
    postPluginMessage({ type: 'update-result', componentName: textNode.type, warnings });
    return;
  }
  if (selection.length === 1 && isStackFrame(selection[0])) {
    const stackNode = nodes.find((entry) => entry.type === 'Stack');
    if (!stackNode) return postError('The JSON has no Stack node to apply to the selected auto-layout frame.');
    const warnings = [];
    await applyStack(selection[0], stackNode, warnings);
    syncStackPropsName(selection[0]);
    if (Array.isArray(stackNode.children) && stackNode.children.length > 0) {
      warnings.push('Child nodes were not applied — updating a selected Stack changes its layout properties only. Use Render on canvas to create its child tree.');
    }
    figma.notify('Updated the selected Stack auto-layout frame from JSON.');
    postPluginMessage({ type: 'update-result', componentName: 'Stack', warnings });
    return;
  }
  if (selection.length === 1 && selection[0].type === 'INSTANCE' && materialIconNameFromInstance(selection[0])) {
    const iconNode = nodes.find((entry) => entry.type === 'Icon');
    if (!iconNode) return postError('The JSON has no Icon node to apply to the selected Material icon.');
    const warnings = [];
    await applyIcon(selection[0], iconNode, warnings);
    figma.notify('Updated the selected Icon from JSON.');
    postPluginMessage({ type: 'update-result', componentName: 'Icon', warnings });
    return;
  }
  if (selection.length !== 1 || selection[0].type !== 'INSTANCE') {
    return postError('Select a single supported component instance, Stack auto-layout frame, or text layer to update.');
  }
  const target = selection[0];
  const componentName = registeredSetName(target);
  if (!componentName) {
    return postError(`The selected component is not supported yet. Supported: ${SUPPORTED_COMPONENT_MESSAGE}.`);
  }
  const jsonType = JSON_TYPE_BY_COMPONENT_NAME[componentName] || componentName;
  const node = nodes.find((entry) => entry.type === jsonType);
  if (!node) {
    return postError(`The JSON has no "${jsonType}" node to apply to the selected ${componentName}.`);
  }
  const warnings = [];
  await APPLIERS[componentName](target, node, warnings);
  if (componentName === 'Section') {
    await applyExistingSectionChildren(target, node, warnings);
  } else if (componentName === 'Button Container') {
    await applyExistingButtonContainerChildren(target, node, warnings);
  } else if (componentName === 'Card') {
    await replaceNativeSlotChildren(target, 'Content Slot', node.children, warnings, 'Card');
  } else if (componentName === 'Banner') {
    await replaceNativeSlotChildren(target, 'Content Slot', bannerSlotChildren(node), warnings, 'Banner');
  } else if (componentName === 'Definition List') {
    await replaceDefinitionItems(target, node, warnings);
  } else if (Array.isArray(node.children) && node.children.length > 0) {
    warnings.push('Child nodes were not applied — updating a selected instance changes its properties only.');
  }
  figma.notify(`Updated the selected ${componentName} from JSON.`);
  postPluginMessage({ type: 'update-result', componentName, warnings });
}

// ─── Wiring ──────────────────────────────────────────────────────────────────

const PLUGIN_UI_SIZE = {
  default: { width: 620, height: 640 },
  build: { width: 620, height: 720 },
  help: { width: 620, height: 640 },
  // Live Edit has enough controls that the standard compact plugin window
  // hides the bottom of the interface on typical desktop Figma layouts.
  liveEdit: { width: 620, height: 720 },
};

figma.showUI(__html__, PLUGIN_UI_SIZE.default);

function postSelectionState() {
  const selection = figma.currentPage.selection;
  const autoFixAllCount = autoFixTargetCount(selection);
  const selectionCount = selection.length;
  const target = selection.length === 1 ? liveNode(selection[0]) : null;
  if (target && target.type === 'TEXT') {
    const { review } = exportTextNode(target);
    postPluginMessage({ type: 'selection', exportable: true, componentName: 'Text', textReview: review, autoFixAllCount, selectionCount });
    return;
  }
  if (target && target.type === 'INSTANCE') {
    const componentName = registeredSetName(target);
    if (componentName) {
      const sectionReview = componentName === 'Section' ? sectionSuggestion(target) : null;
      postPluginMessage({ type: 'selection', exportable: true, componentName, sectionReview, autoFixAllCount, selectionCount });
      return;
    }
    if (materialIconNameFromInstance(target)) {
      postPluginMessage({ type: 'selection', exportable: true, componentName: 'Icon', autoFixAllCount, selectionCount });
      return;
    }
    const privateComponentName = privateA1ImplementationComponentName(target);
    if (privateComponentName) {
      postPluginMessage({ type: 'selection', exportable: false, componentName: privateComponentName, autoFixAllCount, selectionCount });
      return;
    }
  }
  const pageLayoutReview = pageLayoutSuggestion(target);
  if (pageLayoutReview) {
    postPluginMessage({ type: 'selection', exportable: true, componentName: 'Page Layout candidate', pageLayoutReview, autoFixAllCount, selectionCount });
    return;
  }
  const cardReview = cardSuggestion(target);
  if (cardReview) {
    postPluginMessage({ type: 'selection', exportable: true, componentName: 'Card candidate', cardReview, autoFixAllCount, selectionCount });
    return;
  }
  if (isStackFrame(target)) {
    const stackReview = stackSuggestion(target);
    postPluginMessage({ type: 'selection', exportable: true, componentName: 'Stack', stackReview, autoFixAllCount, selectionCount });
    return;
  }
  if (isGridFrame(target)) {
    postPluginMessage({
      type: 'selection',
      exportable: true,
      componentName: 'Grid',
      gridNodeId: target.id,
      gridColumns: readResponsiveGridColumns(target),
      autoFixAllCount,
      selectionCount
    });
    return;
  }
  if (target && canExportContainer(target)) {
    postPluginMessage({ type: 'selection', exportable: true, componentName: 'Screen content', autoFixAllCount, selectionCount });
    return;
  }
  const componentName = target && target.type === 'INSTANCE' ? componentSetName(target) : null;
  postPluginMessage({
    type: 'selection',
    exportable: Boolean(componentName && EXPORTERS[componentName]),
    componentName,
    autoFixAllCount,
    selectionCount,
  });
}

// Auto-export: the JSON regenerates on its own when the selection changes or
// when the selected instance's configuration changes (variant swap, property
// edit, nested content) — no need to click Export selection. Debounced because
// document changes arrive in bursts while dragging/typing in Figma's UI. The
// UI side keeps hand-edited JSON safe: an auto export never overwrites a
// textarea the user has typed into (manual Export selection does).
let autoExportTimer = null;
let liveViewEnabled = false;
let pluginMode = 'fix';
let livePreviewTimer = null;
let linkedPageLiveLink = null;
let linkedPageLiveTimer = null;
let selectedAutoExportSignature = '';
function scheduleAutoExport() {
  if (autoExportTimer) clearTimeout(autoExportTimer);
  autoExportTimer = setTimeout(() => {
    autoExportTimer = null;
    runExport(true);
  }, 250);
}

function selectedInstancePropertySignature() {
  const selection = figma.currentPage.selection;
  if (selection.length !== 1) return '';
  const target = liveNode(selection[0]);
  if (!target || target.type !== 'INSTANCE') return '';
  const componentName = registeredSetName(target);
  if (!componentName && !materialIconNameFromInstance(target)) return '';
  const props = {};
  try {
    const raw = target.componentProperties || {};
    for (const key of Object.keys(raw).sort()) {
      const prop = raw[key];
      props[plainKey(key)] = prop && typeof prop === 'object'
        ? { type: prop.type, value: prop.value }
        : prop;
    }
  } catch {
    // Some transient instance states do not expose componentProperties safely.
  }
  return JSON.stringify({
    id: target.id,
    componentName: componentName || 'Icon',
    props,
    dialogCloseVisible: componentName === 'Dialog' ? dialogCloseLayerVisible(target) : undefined,
  });
}

function syncSelectedInstancePropertySignature({ schedule = false } = {}) {
  const signature = selectedInstancePropertySignature();
  if (signature === selectedAutoExportSignature) return;
  selectedAutoExportSignature = signature;
  if (schedule && signature) scheduleAutoExport();
}

function scheduleLivePreview() {
  if (!liveViewEnabled) return;
  if (livePreviewTimer) clearTimeout(livePreviewTimer);
  livePreviewTimer = setTimeout(() => {
    livePreviewTimer = null;
    const target = topmostExportableNode();
    if (!target) return;
    try {
      runExport(true, target, true);
    } catch (error) {
      postError(`Live view could not export the selected composition: ${error.message}`);
    }
  }, 350);
}

function scheduleLinkedPagePreview() {
  if (!linkedPageLiveLink) return;
  if (linkedPageLiveTimer) clearTimeout(linkedPageLiveTimer);
  linkedPageLiveTimer = setTimeout(() => {
    linkedPageLiveTimer = null;
    try {
      Promise.resolve(exportLinkedPage(linkedPageLiveLink)).then((result) => {
        postPluginMessage({ type: 'linked-page-live-preview', link: linkedPageLiveLink, ...result });
      }).catch(() => {});
    } catch (error) {
      // A root can briefly be unavailable while Figma applies a document edit.
    }
  }, 600);
}

figma.on('selectionchange', () => {
  postSelectionState();
  syncSelectedInstancePropertySignature();
  scheduleAutoExport();
  scheduleLivePreview();
});

figma.on('documentchange', (event) => {
  if (linkedPageLiveLink) scheduleLinkedPagePreview();
  if (liveViewEnabled) {
    scheduleLivePreview();
    return;
  }
  const selection = figma.currentPage.selection;
  const target = selection.length === 1 ? liveNode(selection[0]) : null;
  if (!target || (!['INSTANCE', 'TEXT'].includes(target.type) && !canExportContainer(target))) return;
  if (target.type === 'INSTANCE') {
    syncSelectedInstancePropertySignature({ schedule: true });
  }
  // Figma does not consistently expose a direct changed-node id for paint
  // variable changes. If a text layer remains selected, re-export on the next
  // debounced document change and read its fresh fill binding above.
  if (target.type === 'TEXT') {
    scheduleAutoExport();
    return;
  }
  const relevant = event.documentChanges.some((change) => {
    if (!change.id) return false;
    if (change.id === target.id) return true;
    let changed = null;
    try {
      changed = figma.getNodeById(change.id);
    } catch {
      return false;
    }
    for (let parent = changed && changed.parent; parent; parent = parent.parent) {
      if (parent.id === target.id) return true;
    }
    return false;
  });
  if (relevant) scheduleAutoExport();
});

setInterval(() => {
  syncSelectedInstancePropertySignature({ schedule: true });
}, 600);

postSelectionState();
syncSelectedInstancePropertySignature();
scheduleAutoExport();

figma.ui.onmessage = async (message) => {
  try {
    if (message.type === 'export') runExport(false);
    if (message.type === 'export-figure-image') await sendSelectedFigureImageToPlayground();
    if (message.type === 'audit-selection') await handleAuditSelection({ printReport: message.printReport === true });
    if (message.type === 'select-audit-issue') handleSelectAuditIssue(message.nodeId);
    if (message.type === 'ignore-audit-issue') handleIgnoreAuditIssue(message.nodeId);
    if (message.type === 'detach-all') await handleDetachAll();
    if (message.type === 'set-live-view') {
      // Live view is a plain toggle: the plugin window keeps its normal size
      // and the full UI stays visible while it is on.
      liveViewEnabled = message.enabled === true;
      // The UI first opens or refreshes Preview from the current JSON.
      // Give that page a moment to register its listener before sending the
      // topmost live export, otherwise the first preview could replace the
      // handoff that is opening the page.
      if (liveViewEnabled) setTimeout(scheduleLivePreview, 900);
    }
    if (message.type === 'set-plugin-mode') {
      pluginMode = ['audit', 'fix', 'build', 'live-edit', 'help'].includes(message.mode) ? message.mode : 'audit';
      const size = pluginMode === 'live-edit'
        ? PLUGIN_UI_SIZE.liveEdit
        : pluginMode === 'build'
          ? PLUGIN_UI_SIZE.build
          : pluginMode === 'help'
            ? PLUGIN_UI_SIZE.help
          : PLUGIN_UI_SIZE.default;
      figma.ui.resize(size.width, size.height);
    }
    if (message.type === 'close-plugin') figma.closePlugin();
    if (message.type === 'set-linked-page-live') {
      linkedPageLiveLink = message.enabled === true ? message.link : null;
      if (linkedPageLiveLink) scheduleLinkedPagePreview();
    }
    if (message.type === 'import') {
      const result = await handleImport(message.text, message.assets, figma.currentPage, false, { breakpoints: message.breakpoints, primary: message.primary });
      if (result && message.handoffId) {
        postPluginMessage({ type: 'handoff-import-result', handoffId: message.handoffId, ...result });
      }
    }
    if (message.type === 'create-breakpoints' || message.type === 'sync-breakpoints') {
      createBreakpointRoots({ primary: message.primary, breakpoints: message.breakpoints });
    }
    if (message.type === 'export-responsive-diff') {
      exportResponsiveDiff({ primary: message.primary });
    }
    if (message.type === 'linked-page-import') {
      const result = await handleLinkedPageImport(message.text, message.assets, message.link);
      if (result) postPluginMessage({
        type: 'linked-page-import-result',
        handoffId: message.handoffId,
        link: { ...message.link, figmaRootNodeId: result.rootNodeId, figmaPageId: result.figmaPageId, figmaFileKey: result.figmaFileKey },
        ...result,
      });
    }
    if (message.type === 'linked-project-import') {
      const pages = Array.isArray(message.pages) ? message.pages.slice(0, 100) : [];
      const roots = [];
      const warnings = [];
      const origin = { x: Math.round(figma.viewport.center.x), y: Math.round(figma.viewport.center.y) };
      let nextY = origin.y;
      for (let index = 0; index < pages.length; index += 1) {
        const page = pages[index];
        if (!page || typeof page.text !== 'string' || !page.link) {
          warnings.push(`Page ${index + 1} could not be rendered.`);
          continue;
        }
        const result = await handleLinkedPageImport(page.text, page.assets || [], page.link);
        if (!result) {
          warnings.push(`${page.link.pageTitle || page.link.pageId}: could not be rendered.`);
          continue;
        }
        const root = figma.getNodeById(result.rootNodeId);
        if (root && root.type === 'FRAME') {
          root.x = origin.x;
          root.y = nextY;
          nextY += Math.max(root.height, 800) + 120;
          roots.push(root);
        }
        if (Array.isArray(result.warnings)) warnings.push(...result.warnings);
      }
      if (roots.length) {
        figma.currentPage.selection = roots;
        figma.viewport.scrollAndZoomIntoView(roots);
      }
      postPluginMessage({
        type: 'linked-project-import-result',
        projectId: message.projectId,
        count: roots.length,
        warnings,
      });
    }
    if (message.type === 'linked-page-export') {
      const result = await exportLinkedPage(message.link);
      postPluginMessage({
        type: 'linked-page-export-result',
        link: { ...message.link, figmaRootNodeId: result.rootNodeId, figmaPageId: result.figmaPageId, figmaFileKey: result.figmaFileKey },
        ...result,
      });
    }
    if (message.type === 'create-a1-page') {
      const result = await exportNewA1Page(message.project);
      postPluginMessage({ type: 'create-a1-page-result', ...result });
    }
    if (message.type === 'detect-linked-page') {
      const link = detectLinkedPageFromFrameNames(message.projects);
      postPluginMessage({ type: 'detected-linked-page', link });
    }
    if (message.type === 'update') await handleUpdate(message.text);
    if (message.type === 'fix-text') await handleFixText();
    if (message.type === 'fix-all') await handleFixAll();
    if (message.type === 'fix-all-text') await handleFixAllText();
    if (message.type === 'fix-page-layout') await handleFixPageLayout();
    if (message.type === 'convert-to') await handleConvertTo(message.target, 'convert-result', { responsiveColumns: message.responsiveColumns });
    if (message.type === 'add-component') await handleAddComponent(message.target, { responsiveColumns: message.responsiveColumns });
    if (message.type === 'export-component-keys') await handleExportComponentKeys();
    if (message.type === 'apply-grid-breakpoints') handleApplyGridBreakpoints({ gridNodeId: message.gridNodeId, responsiveColumns: message.responsiveColumns, primary: message.primary });
    if (message.type === 'convert-to-section') await handleConvertToSection();
    if (message.type === 'fix-card') await handleFixCard();
    if (message.type === 'fix-stack') await handleFixStack();
    if (message.type === 'fix-section') await handleFixSection();
  } catch (error) {
    postError(error.message);
  }
};
