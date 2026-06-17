/**
 * Sample project — "Ember & Oak", a wood-fired, farm-to-table restaurant.
 *
 * A complete multi-page website seeded into the editor as a ready-made example
 * that exercises a wide range of A1 components (heroes, gradients, cards, grids,
 * figures, definition lists, badges, banners, accordions, forms, blockquotes,
 * step trackers) and a 3-level page hierarchy so the auto-generated TopHeader
 * shows nested dropdown menus.
 *
 * Page tree:
 *   Home
 *   Menus
 *     ├─ Dinner
 *     ├─ Brunch
 *     └─ Drinks
 *         └─ Wine list
 *   Reservations
 *   About
 *     ├─ Our history
 *     └─ Careers
 *   Contact
 */
import type { ComponentNode, PageDefinition } from '../editor/pageTypes';
import type { ProjectPage } from './projectStore';

export const RESTAURANT_PROJECT_ID = 'proj-ember-oak';
// Bump the suffix to refresh the bundled sample content on existing installs
// (e.g. when sample pages gain new component props like Figure aspect ratios).
export const RESTAURANT_SEED_FLAG = 'a1-seeded-ember-oak-v2';

// ── Tiny node builders ─────────────────────────────────────────────────────────
// A monotonic id generator keeps every node id unique without hand-numbering.
const nid = (() => { let n = 0; return () => `rx${(n += 1)}`; })();

type Props = Record<string, unknown>;
type N = ComponentNode;

const node = (type: string, props: Props = {}, children?: N[], content?: string): N => ({
  id: nid(),
  type: type as ComponentNode['type'],
  props,
  ...(content !== undefined ? { content: { fallback: content } } : {}),
  ...(children ? { children } : {}),
});

const Sec = (props: Props, children: N[]): N => node('Section', props, children);
const Stk = (props: Props, children: N[]): N => node('Stack', props, children);
const Col = (children: N[], props: Props = {}): N => Stk({ direction: 'column', gap: 'md', ...props }, children);
const Row = (children: N[], props: Props = {}): N => Stk({ direction: 'row', gap: 'md', ...props }, children);
const Gr = (props: Props, children: N[]): N => node('Grid', props, children);
const Cd = (props: Props, children: N[]): N => node('Card', props, children);
const H = (text: string, props: Props = {}): N => node('Heading', { as: 'h2', size: 'lg', ...props }, undefined, text);
const P = (text: string, props: Props = {}): N => node('Paragraph', props, undefined, text);
const Lead = (text: string): N => P(text, { size: 'lg', color: 'muted' });
const Muted = (text: string, props: Props = {}): N => P(text, { size: 'sm', color: 'muted', ...props });
const Badge = (text: string, props: Props = {}): N => node('MessageBadge', { size: 'sm', subtle: true, ...props }, undefined, text);
const Btn = (text: string, props: Props = {}): N => node('Button', props, undefined, text);
const Div = (space = 'md'): N => node('Divider', { space });
const Spacer = (size = 'md'): N => node('Spacer', { size });
const Quote = (text: string, props: Props = {}): N => node('Blockquote', { variant: 'border', ...props }, undefined, text);
const Banner = (title: string, text: string, props: Props = {}): N => node('Banner', { status: 'info', variant: 'inline', title, ...props }, undefined, text);
const DList = (items: unknown[], props: Props = {}): N => node('DefinitionList', { direction: 'row', size: 'md', labelWidth: 'fixed', items, ...props });
const Acc = (label: string, body: N[], props: Props = {}): N => node('Accordion', { label, ...props }, body);
const Fig = (photo: string, alt: string, opts: { ratio?: string; crop?: string; caption?: string } = {}): N =>
  node('Figure', {
    src: `https://images.unsplash.com/photo-${photo}?w=1280&q=80&auto=format&fit=crop`,
    alt,
    radius: 'lg',
    ...(opts.ratio ? { aspectRatio: opts.ratio } : {}),
    ...(opts.crop ? { crop: opts.crop } : {}),
    ...(opts.caption ? { caption: opts.caption } : {}),
  });

const link = (page: string) => `/?page=${page}`;

// Menu dish row: name + dietary tags on the left, price on the right.
type Tag = { label: string; status?: string };
const Dish = (name: string, desc: string, price: string, tags: Tag[] = []): N =>
  Stk({ direction: 'row', justify: 'between', align: 'start', gap: 'md' }, [
    Col([
      Row([
        H(name, { as: 'h3', size: 'sm' }),
        ...tags.map((t) => node('MessageBadge', { size: 'sm', subtle: true, status: t.status ?? 'neutral', icon: null }, undefined, t.label)),
      ], { gap: 'xs', align: 'center', wrap: true }),
      Muted(desc),
    ], { gap: 'xs' }),
    node('Heading', { as: 'span', size: 'sm', color: 'accent' }, undefined, price),
  ]);

const def = (id: string, name: string, description: string, nodes: N[]): PageDefinition => ({
  schemaVersion: '1.0.0',
  page: { id, name, description, layout: { type: 'PageLayout', regions: [{ id: 'main', name: 'Main', nodes }] } },
});

// A reusable "menu course" block: heading + dish rows separated by dividers.
const Course = (title: string, dishes: N[]): N =>
  Col([
    H(title, { size: 'md' }),
    Div('sm'),
    ...dishes.flatMap((d, i) => (i === 0 ? [d] : [Div('sm'), d])),
  ], { gap: 'sm' });

// ── Pages ──────────────────────────────────────────────────────────────────────

const home = def('ember-home', 'Home', 'Ember & Oak — wood-fired, farm-to-table dining.', [
  Sec({ padding: 'xl', surface: 'panel', gradient: 'accent', gradientPosition: 'top-right', contentWidth: 'lg', gap: 'lg' }, [
    Col([
      Badge('Wood-fired · Farm-to-table', { icon: 'local_fire_department' }),
      node('Heading', { as: 'h1', type: 'display', size: { xs: 'xxl', md: 'jumbo' } }, undefined, 'Ember & Oak'),
      Lead('Live-fire cooking, a menu that turns with the seasons, and a cellar of natural wine — in the heart of the old market district.'),
      Row([
        Btn('Reserve a table', { variant: 'primary', icon: 'event_seat', iconPosition: 'start', href: link('ember-reservations') }),
        Btn('View the menus', { variant: 'secondary', icon: 'restaurant_menu', iconPosition: 'start', href: link('ember-menus') }),
      ], { gap: 'sm', wrap: true }),
    ], { gap: 'md' }),
  ]),
  Sec({ padding: 'none' }, [Fig('1517248135467-4c7edcad34c4', 'The dining room at dusk, lit by the open kitchen fire', { ratio: '16:9' })]),
  Sec({ padding: 'xl', contentWidth: 'lg', gap: 'lg' }, [
    Col([H('A table around the fire'), Lead('Everything we do starts at the hearth — and ends with people lingering a little longer than they planned.')]),
    Gr({ columns: { xs: 1, md: 3 }, gap: 'md' }, [
      Cd({ icon: 'local_fire_department', iconDisplay: 'hero', heroColor: 'action' }, [H('Live-fire kitchen', { as: 'h3', size: 'sm' }), Muted('Oak and applewood embers give every plate its smoke, char, and depth.')]),
      Cd({ icon: 'agriculture', iconDisplay: 'hero', heroColor: 'success' }, [H('Grown nearby', { as: 'h3', size: 'sm' }), Muted('We cook what the farms within fifty miles are picking that morning.')]),
      Cd({ icon: 'wine_bar', iconDisplay: 'hero', heroColor: 'info' }, [H('Natural cellar', { as: 'h3', size: 'sm' }), Muted('A short, opinionated list of low-intervention wines, poured generously.')]),
    ]),
  ]),
  Sec({ padding: 'xl', surface: 'panel', contentWidth: 'lg', gap: 'lg' }, [
    Row([H("This week's plates"), Btn('Full dinner menu', { variant: 'tertiary', icon: 'arrow_forward', iconPosition: 'end', href: link('ember-dinner') })], { justify: 'between', align: 'center', wrap: true }),
    Gr({ columns: { xs: 1, md: 3 }, gap: 'md' }, [
      Cd({}, [Fig('1467003909585-2f8a72700288', 'Charred hispi cabbage with anchovy butter', { ratio: '1:1' }), H('Charred hispi cabbage', { as: 'h3', size: 'sm' }), Muted('anchovy butter, toasted hazelnut, lemon'), node('Heading', { as: 'span', size: 'sm', color: 'accent' }, undefined, '$18')]),
      Cd({}, [Fig('1544025162-d76694265947', 'Dry-aged ribeye over the coals', { ratio: '1:1' }), H('Coal-roast ribeye', { as: 'h3', size: 'sm' }), Muted('45-day dry-aged, bone marrow, watercress'), node('Heading', { as: 'span', size: 'sm', color: 'accent' }, undefined, '$58')]),
      Cd({}, [Fig('1551024601-bec78aea704b', 'Burnt honey tart with crème fraîche', { ratio: '1:1' }), H('Burnt honey tart', { as: 'h3', size: 'sm' }), Muted('crème fraîche, oak-smoked salt'), node('Heading', { as: 'span', size: 'sm', color: 'accent' }, undefined, '$14')]),
    ]),
  ]),
  Sec({ padding: 'xl', contentWidth: 'lg', gap: 'lg' }, [
    Gr({ columns: { xs: 1, md: 2 }, gap: 'xl' }, [
      Col([H('Hours', { size: 'md' }), DList([
        { label: 'Wed – Thu', value: '5:00 – 10:00 pm' },
        { label: 'Fri – Sat', value: '5:00 – 11:30 pm' },
        { label: 'Sunday', value: '10:00 am – 9:00 pm' },
        { label: 'Mon – Tue', value: 'Closed' },
      ])]),
      Col([H('Find us', { size: 'md' }), DList([
        { label: 'Address', value: '114 Market Lane, Old Town' },
        { label: 'Phone', value: '(555) 240-7788', copyValue: true },
        { label: 'Email', value: 'hello@emberandoak.test', copyValue: true },
        { label: 'Parking', value: 'Lot on Cooper St after 5pm' },
      ])]),
    ]),
  ]),
  Sec({ padding: 'xl', inverse: true, contentWidth: 'md', gap: 'md' }, [
    Quote('We came for dinner and left planning the next one. The whole room smells like woodsmoke and good decisions.', { variant: 'border' }),
    Muted('— Local Table, four-star review'),
  ]),
  Sec({ padding: 'xl', surface: 'panel', gradient: 'accent', gradientPosition: 'bottom-left', contentWidth: 'md', gap: 'md' }, [
    H('Join us tonight', { size: 'xl' }),
    Lead('Tables open thirty days out. Walk-ins are always welcome at the bar.'),
    node('ButtonContainer', { align: 'start' }, [
      Btn('Book a table', { variant: 'primary', icon: 'event_seat', iconPosition: 'start', href: link('ember-reservations') }),
      Btn('Get directions', { variant: 'secondary', icon: 'map', iconPosition: 'start', href: link('ember-contact') }),
    ]),
  ]),
]);

const menus = def('ember-menus', 'Menus', 'Dinner, brunch, and drinks at Ember & Oak.', [
  Sec({ padding: 'xl', surface: 'panel', gradient: 'accent', gradientPosition: 'top-left', contentWidth: 'lg', gap: 'md' }, [
    Badge('Menus', { icon: 'restaurant_menu' }),
    node('Heading', { as: 'h1', type: 'display', size: { xs: 'xl', md: 'xxl' } }, undefined, 'What we’re cooking'),
    Lead('Three menus, all cooked over the same fire. Choose your moment.'),
  ]),
  Sec({ padding: 'xl', contentWidth: 'lg', gap: 'lg' }, [
    Gr({ columns: { xs: 1, md: 3 }, gap: 'md' }, [
      Cd({ variant: 'navigation', href: link('ember-dinner'), icon: 'dinner_dining', iconDisplay: 'hero', heroColor: 'action' }, [H('Dinner', { as: 'h2', size: 'md' }), Muted('Live-fire mains, snacks, and the things people drive across town for.')]),
      Cd({ variant: 'navigation', href: link('ember-brunch'), icon: 'brunch_dining', iconDisplay: 'hero', heroColor: 'warn' }, [H('Brunch', { as: 'h2', size: 'md' }), Muted('Weekend mornings — eggs, griddle plates, and a very good bloody mary.')]),
      Cd({ variant: 'navigation', href: link('ember-drinks'), icon: 'local_bar', iconDisplay: 'hero', heroColor: 'info' }, [H('Drinks', { as: 'h2', size: 'md' }), Muted('Cocktails, low-intervention wine, and a rotating tap of local beer.')]),
    ]),
    Banner('Seasonal by design', 'The menu changes every few weeks as the farms around us change. Printed menus are a snapshot — ask your server what landed today.', { status: 'info' }),
    Acc('Allergens & dietary needs', [Muted('Vegetarian (V), vegan (VG), and gluten-free (GF) plates are marked throughout. Tell us about any allergy when you book and the kitchen will adapt wherever we safely can.')]),
  ]),
]);

const dinner = def('ember-dinner', 'Dinner', 'The Ember & Oak dinner menu.', [
  Sec({ padding: 'lg', surface: 'panel', gradient: 'accent', gradientPosition: 'top-right', contentWidth: 'md', gap: 'sm' }, [
    Badge('Dinner · Wed–Sun', { icon: 'dinner_dining' }),
    node('Heading', { as: 'h1', type: 'display', size: 'xl' }, undefined, 'Dinner'),
    Lead('Served from 5pm. Designed for sharing — three or four plates per person is about right.'),
  ]),
  Sec({ padding: 'xl', contentWidth: 'md', gap: 'xl' }, [
    Course('From the embers — to start', [
      Dish('Wood-grilled flatbread', 'cultured butter, smoked sea salt, rosemary', '$9', [{ label: 'V', status: 'success' }]),
      Dish('Charred hispi cabbage', 'anchovy butter, toasted hazelnut, lemon', '$18', [{ label: 'GF', status: 'success' }]),
      Dish('Ember-roast beets', 'whipped goat cheese, walnut, honey', '$16', [{ label: 'V', status: 'success' }, { label: 'GF', status: 'success' }]),
      Dish('Grilled octopus', 'romesco, fingerling potato, salsa verde', '$22', [{ label: 'GF', status: 'success' }]),
    ]),
    Course('Mains', [
      Dish('Coal-roast ribeye', '45-day dry-aged, bone marrow, watercress', '$58', [{ label: 'GF', status: 'success' }, { label: 'For two', status: 'info' }]),
      Dish('Whole grilled branzino', 'fennel, preserved lemon, charred herb oil', '$36', [{ label: 'GF', status: 'success' }]),
      Dish('Smoked half chicken', 'oak embers, chili honey, pickled onion', '$29'),
      Dish('Fire-roasted cauliflower steak', 'green harissa, almond, golden raisin', '$24', [{ label: 'VG', status: 'success' }, { label: 'GF', status: 'success' }]),
    ]),
    Course('Sides', [
      Dish('Coal-baked potatoes', 'bone marrow butter, chive', '$11'),
      Dish('Grilled little gems', 'buttermilk, smoked almond', '$10', [{ label: 'GF', status: 'success' }]),
      Dish('Ember bread & dripping', 'house sourdough, beef fat, sea salt', '$8'),
    ]),
    Course('Sweet', [
      Dish('Burnt honey tart', 'crème fraîche, oak-smoked salt', '$14', [{ label: 'V', status: 'success' }]),
      Dish('Grilled stone fruit', 'brown butter cake, vanilla', '$13', [{ label: 'V', status: 'success' }]),
      Dish('Dark chocolate & smoke', 'olive oil, flaky salt, sourdough crumb', '$13', [{ label: 'VG', status: 'success' }]),
    ]),
  ]),
  Sec({ padding: 'lg', surface: 'panel', contentWidth: 'md', gap: 'sm' }, [
    H('Make a night of it', { size: 'md' }),
    Muted('Add the four-course tasting for $75 per person — the whole table joins in.'),
    node('ButtonContainer', { align: 'start' }, [Btn('Reserve a table', { variant: 'primary', icon: 'event_seat', iconPosition: 'start', href: link('ember-reservations') })]),
  ]),
]);

const brunch = def('ember-brunch', 'Brunch', 'Weekend brunch at Ember & Oak.', [
  Sec({ padding: 'lg', surface: 'panel', gradient: 'accent', gradientPosition: 'bottom-right', contentWidth: 'md', gap: 'sm' }, [
    Badge('Brunch · Sundays', { icon: 'brunch_dining' }),
    node('Heading', { as: 'h1', type: 'display', size: 'xl' }, undefined, 'Brunch'),
    Lead('Sundays, 10am – 2pm. Slow mornings, griddle plates, and bottomless coffee.'),
  ]),
  Sec({ padding: 'none' }, [Fig('1533920379810-6bedac961555', 'A spread of brunch plates on a sunlit table', { ratio: '16:9' })]),
  Sec({ padding: 'xl', contentWidth: 'md', gap: 'xl' }, [
    Course('Plates', [
      Dish('Ember hash', 'confit potato, two eggs, salsa macha', '$17', [{ label: 'GF', status: 'success' }]),
      Dish('Griddled sourdough', 'cultured butter, seasonal jam', '$8', [{ label: 'V', status: 'success' }]),
      Dish('Smoked trout toast', 'crème fraîche, dill, soft egg', '$19'),
      Dish('Fire-roasted mushrooms', 'polenta, aged cheddar, herb oil', '$16', [{ label: 'V', status: 'success' }, { label: 'GF', status: 'success' }]),
    ]),
    Course('Something sweet', [
      Dish('Brown-butter pancakes', 'maple, smoked pecan', '$15', [{ label: 'V', status: 'success' }]),
      Dish('Cast-iron Dutch baby', 'lemon, powdered sugar, stone fruit', '$14', [{ label: 'V', status: 'success' }]),
    ]),
    Course('Sips', [
      Dish('Oak-smoked bloody mary', 'house mix, pickled everything', '$13'),
      Dish('Citrus mimosa', 'sparkling, fresh-pressed juice', '$11'),
      Dish('Cold brew', 'on tap, over ice', '$5'),
    ]),
  ]),
]);

const drinks = def('ember-drinks', 'Drinks', 'Cocktails, beer, and wine at Ember & Oak.', [
  Sec({ padding: 'lg', surface: 'panel', gradient: 'accent', gradientPosition: 'top-left', contentWidth: 'md', gap: 'sm' }, [
    Badge('Drinks', { icon: 'local_bar' }),
    node('Heading', { as: 'h1', type: 'display', size: 'xl' }, undefined, 'Drinks'),
    Lead('Built to stand up to smoke and char. The bar is open until close.'),
  ]),
  Sec({ padding: 'xl', contentWidth: 'md', gap: 'xl' }, [
    Course('Signature cocktails', [
      Dish('Smoke & Oak', 'mezcal, oak-aged vermouth, orange bitters', '$15'),
      Dish('Ember Old Fashioned', 'charred-barrel bourbon, demerara, smoke', '$16'),
      Dish('Garden Gimlet', 'gin, lime, grilled cucumber, basil', '$14'),
      Dish('No-Proof Spritz', 'seedlip, grapefruit, soda', '$9', [{ label: 'Zero-proof', status: 'info' }]),
    ]),
    Course('Beer & cider', [
      Dish('Local pilsner', 'crisp, on tap', '$7'),
      Dish('Hazy IPA', 'rotating local pour', '$8'),
      Dish('Dry farmhouse cider', 'orchard down the road', '$8', [{ label: 'GF', status: 'success' }]),
    ]),
    Cd({ icon: 'wine_bar', iconDisplay: 'hero', heroColor: 'info' }, [
      H('The wine list', { as: 'h2', size: 'md' }),
      Muted('A short, low-intervention cellar — by the glass, bottle, and the occasional magnum worth sharing.'),
      node('ButtonContainer', { align: 'start' }, [Btn('See the wine list', { variant: 'secondary', icon: 'arrow_forward', iconPosition: 'end', href: link('ember-wine') })]),
    ]),
  ]),
]);

const wine = def('ember-wine', 'Wine list', 'Low-intervention wines at Ember & Oak.', [
  Sec({ padding: 'lg', surface: 'panel', gradient: 'accent', gradientPosition: 'bottom-left', contentWidth: 'md', gap: 'sm' }, [
    Badge('Wine list', { icon: 'wine_bar' }),
    node('Heading', { as: 'h1', type: 'display', size: 'xl' }, undefined, 'Wine'),
    Lead('Natural and low-intervention, organized by how it drinks. Prices are glass / bottle.'),
  ]),
  Sec({ padding: 'xl', contentWidth: 'md', gap: 'xl' }, [
    Col([H('By the glass', { size: 'md' }), DList([
      { label: 'Sparkling pét-nat', value: '$13 / $52' },
      { label: 'Skin-contact white', value: '$14 / $56' },
      { label: 'Coastal rosé', value: '$12 / $48' },
      { label: 'Chillable red', value: '$13 / $52' },
    ], { labelWidth: 'fixed' })]),
    Col([H('Reds', { size: 'md' }), DList([
      { label: 'Gamay, Loire', value: '$58' },
      { label: 'Nebbiolo, Piedmont', value: '$78' },
      { label: 'Syrah, Northern Rhône', value: '$84' },
      { label: 'Zweigelt, Burgenland', value: '$54' },
    ], { labelWidth: 'fixed' })]),
    Col([H('Whites & skin-contact', { size: 'md' }), DList([
      { label: 'Chenin Blanc, Loire', value: '$56' },
      { label: 'Ribolla Gialla, Friuli', value: '$72' },
      { label: 'Riesling, Mosel', value: '$60' },
    ], { labelWidth: 'fixed' })]),
    Banner('Ask the floor', 'Our team tastes everything on the list. Tell us what you usually love and we’ll find the bottle for the table.', { status: 'neutral' }),
  ]),
]);

const reservations = def('ember-reservations', 'Reservations', 'Book a table at Ember & Oak.', [
  Sec({ padding: 'xl', surface: 'panel', gradient: 'accent', gradientPosition: 'top-right', contentWidth: 'lg', gap: 'md' }, [
    Badge('Reservations', { icon: 'event_seat' }),
    node('Heading', { as: 'h1', type: 'display', size: { xs: 'xl', md: 'xxl' } }, undefined, 'Reserve a table'),
    Lead('Tables open thirty days in advance. Parties of eight or more, please give us a call.'),
  ]),
  Sec({ padding: 'xl', contentWidth: 'md', gap: 'lg' }, [
    node('StepTracker', { steps: 3, currentStep: 1, align: 'left' }),
    Cd({}, [
      Col([
        H('Your details', { size: 'md' }),
        Gr({ columns: { xs: 1, md: 3 }, gap: 'md' }, [
          node('DateField', { label: 'Date' }),
          node('TimeField', { label: 'Time' }),
          node('NumberField', { label: 'Party size', min: 1, max: 12 }),
        ]),
        node('ChoiceGroup', {
          label: 'Where would you like to sit?',
          columns: { xs: 2, md: 4 },
          options: [
            { value: 'dining', label: 'Dining room', icon: 'restaurant' },
            { value: 'patio', label: 'Patio', icon: 'deck' },
            { value: 'bar', label: 'Bar', icon: 'local_bar' },
            { value: 'chefs', label: "Chef's counter", icon: 'soup_kitchen' },
          ],
        }),
        Gr({ columns: { xs: 1, md: 2 }, gap: 'md' }, [
          node('TextField', { label: 'Full name', autoComplete: 'name' }),
          node('PhoneField', { label: 'Phone', autoComplete: 'tel' }),
        ]),
        node('TextField', { label: 'Email', type: 'email', autoComplete: 'email' }),
        node('TextareaField', { label: 'Anything we should know?', hint: 'Allergies, a celebration, a high chair…' }),
        node('CheckboxGroup', {
          label: 'Occasion (optional)',
          options: [
            { value: 'birthday', label: 'Birthday' },
            { value: 'anniversary', label: 'Anniversary' },
            { value: 'business', label: 'Business' },
          ],
        }),
        node('ButtonContainer', { align: 'end' }, [
          Btn('Clear', { variant: 'secondary' }),
          Btn('Request reservation', { variant: 'primary', icon: 'check', iconPosition: 'start' }),
        ]),
      ], { gap: 'lg' }),
    ]),
    Banner('Large parties', 'For groups of eight or more, private dining, or full buyouts, call us at (555) 240-7788 and ask for events.', { status: 'info', title: 'Booking for a crowd?' }),
    Col([
      H('Good to know', { size: 'md' }),
      Acc('What’s your cancellation policy?', [Muted('Plans change — just let us know at least four hours ahead. No-shows on parties of six or more may be charged $25 per guest.')], { defaultOpen: true }),
      Acc('Do you hold tables for walk-ins?', [Muted('Always. The full bar and counter are first-come, first-served every night.')]),
      Acc('Can you handle dietary restrictions?', [Muted('Yes. Note them here when you book and the kitchen will plan ahead.')]),
    ]),
  ]),
]);

const about = def('ember-about', 'About', 'The story behind Ember & Oak.', [
  Sec({ padding: 'xl', surface: 'panel', gradient: 'accent', gradientPosition: 'bottom-left', contentWidth: 'lg', gap: 'md' }, [
    Badge('Our story', { icon: 'local_fire_department' }),
    node('Heading', { as: 'h1', type: 'display', size: { xs: 'xl', md: 'xxl' } }, undefined, 'Cooked over fire, grown nearby'),
    Lead('Ember & Oak began with a single wood-burning grill and a simple rule: let the fire and the farm do the work.'),
  ]),
  Sec({ padding: 'none' }, [Fig('1556910103-1c02745aae4d', 'A chef working the live-fire grill', { ratio: '16:9' })]),
  Sec({ padding: 'xl', contentWidth: 'md', gap: 'md' }, [
    H('Why we cook this way'),
    P('We think the best meals are honest ones: good ingredients, treated simply, shared around a table. The fire gives us smoke and char you can’t fake, and the farms around us give us a reason to change the menu every few weeks.'),
    P('Nothing here is precious. Come in your work clothes, bring the kids on Sundays, order the whole table’s worth and pass it around.'),
  ]),
  Sec({ padding: 'xl', surface: 'panel', contentWidth: 'lg', gap: 'lg' }, [
    H('What we care about'),
    Gr({ columns: { xs: 1, md: 3 }, gap: 'md' }, [
      Cd({ icon: 'eco', iconDisplay: 'hero', heroColor: 'success' }, [H('Seasonality', { as: 'h3', size: 'sm' }), Muted('We buy what’s ready and let it set the menu, not the other way around.')]),
      Cd({ icon: 'handshake', iconDisplay: 'hero', heroColor: 'info' }, [H('Our growers', { as: 'h3', size: 'sm' }), Muted('Long relationships with a handful of nearby farms and a single day boat.')]),
      Cd({ icon: 'recycling', iconDisplay: 'hero', heroColor: 'warn' }, [H('Whole use', { as: 'h3', size: 'sm' }), Muted('Trim becomes stock, embers become salt — very little leaves the kitchen as waste.')]),
    ]),
  ]),
  Sec({ padding: 'xl', inverse: true, contentWidth: 'md', gap: 'md' }, [
    Quote('Fire is the oldest way to cook, and still the most honest. You can’t hide behind it.'),
    Muted('— Mara Oyelaran, Chef & Co-owner'),
  ]),
  Sec({ padding: 'xl', contentWidth: 'lg', gap: 'lg' }, [
    H('The people'),
    Gr({ columns: { xs: 1, sm: 2, md: 3 }, gap: 'md' }, [
      Cd({}, [Fig('1581349485608-9469926a8e5e', 'Portrait of chef Mara Oyelaran', { ratio: '1:1', crop: 'top' }), H('Mara Oyelaran', { as: 'h3', size: 'sm' }), Muted('Chef & Co-owner')]),
      Cd({}, [Fig('1577219491135-ce391730fb2c', 'Portrait of general manager Theo Park', { ratio: '1:1', crop: 'top' }), H('Theo Park', { as: 'h3', size: 'sm' }), Muted('General Manager')]),
      Cd({}, [Fig('1583394293214-28a5b42f7af2', 'Portrait of wine director Isla Romano', { ratio: '1:1', crop: 'top' }), H('Isla Romano', { as: 'h3', size: 'sm' }), Muted('Wine Director')]),
    ]),
    Gr({ columns: { xs: 1, md: 2 }, gap: 'md' }, [
      Cd({ variant: 'navigation', href: link('ember-history'), icon: 'history_edu', iconDisplay: 'hero', heroColor: 'neutral' }, [H('Our history', { as: 'h2', size: 'md' }), Muted('From a backyard grill to the market district — how we got here.')]),
      Cd({ variant: 'navigation', href: link('ember-careers'), icon: 'work', iconDisplay: 'hero', heroColor: 'action' }, [H('Careers', { as: 'h2', size: 'md' }), Muted('We’re hiring cooks, servers, and a pastry lead. Come cook with us.')]),
    ]),
  ]),
]);

const history = def('ember-history', 'Our history', 'How Ember & Oak came to be.', [
  Sec({ padding: 'xl', surface: 'panel', gradient: 'accent', gradientPosition: 'top-right', contentWidth: 'md', gap: 'md' }, [
    Badge('Our history', { icon: 'history_edu' }),
    node('Heading', { as: 'h1', type: 'display', size: 'xl' }, undefined, 'A short history'),
    Lead('Ten years, one fire that never really went out.'),
  ]),
  Sec({ padding: 'xl', contentWidth: 'md', gap: 'xl' }, [
    ...[
      ['2015', 'The backyard years', 'Mara starts cooking Sunday suppers for friends over a single oil-drum grill. Word gets around the neighborhood.'],
      ['2018', 'A stall at the market', 'A weekend stall in the old market — flatbreads and grilled vegetables — sells out by noon, every week.'],
      ['2021', 'Ember & Oak opens', 'Forty seats, one big hearth, and a chalkboard menu that changes with the farms. We don’t take a day off for a month.'],
      ['2024', 'The cellar grows', 'Isla joins and turns a short wine list into one of the reasons people come back.'],
      ['Today', 'Still by the fire', 'Bigger room, same rule: let the fire and the farm do the work.'],
    ].flatMap(([year, title, body], i) => {
      const block = Row([
        node('Heading', { as: 'span', size: 'md', color: 'accent' }, undefined, year),
        Col([H(title, { as: 'h2', size: 'sm' }), Muted(body)], { gap: 'xs' }),
      ], { gap: 'lg', align: 'start' });
      return i === 0 ? [block] : [Div('sm'), block];
    }),
    Fig('1559339352-11d035aa65de', 'A long table set for service before the doors open', { ratio: '16:9' }),
  ]),
]);

const careers = def('ember-careers', 'Careers', 'Work at Ember & Oak.', [
  Sec({ padding: 'xl', surface: 'panel', gradient: 'accent', gradientPosition: 'bottom-right', contentWidth: 'lg', gap: 'md' }, [
    Badge('Careers', { icon: 'work' }),
    node('Heading', { as: 'h1', type: 'display', size: { xs: 'xl', md: 'xxl' } }, undefined, 'Come cook with us'),
    Lead('We hire for warmth and curiosity, then teach the fire. Full training, real growth, food you’re proud of.'),
  ]),
  Sec({ padding: 'xl', contentWidth: 'lg', gap: 'lg' }, [
    H('Why work here'),
    Gr({ columns: { xs: 1, md: 4 }, gap: 'md' }, [
      Cd({ icon: 'payments', iconDisplay: 'hero', heroColor: 'success' }, [H('Fair pay', { as: 'h3', size: 'sm' }), Muted('Above-scale wages and a shared tip pool across the house.')]),
      Cd({ icon: 'health_and_safety', iconDisplay: 'hero', heroColor: 'info' }, [H('Benefits', { as: 'h3', size: 'sm' }), Muted('Health coverage for full-time staff after 60 days.')]),
      Cd({ icon: 'school', iconDisplay: 'hero', heroColor: 'warn' }, [H('Learn the craft', { as: 'h3', size: 'sm' }), Muted('Stages, classes, and a path from prep to the pass.')]),
      Cd({ icon: 'restaurant', iconDisplay: 'hero', heroColor: 'action' }, [H('Family meal', { as: 'h3', size: 'sm' }), Muted('Everyone eats together before service. Always.')]),
    ]),
  ]),
  Sec({ padding: 'xl', surface: 'panel', contentWidth: 'lg', gap: 'lg' }, [
    H('Open positions'),
    Gr({ columns: { xs: 1, md: 2 }, gap: 'md' }, [
      Cd({}, [Col([
        Row([H('Line cook', { as: 'h3', size: 'sm' }), Badge('Full-time', { status: 'success', icon: null }), Badge('Kitchen', { icon: null })], { gap: 'xs', align: 'center', wrap: true }),
        Muted('Grill, garde manger, or pasta station. Two years on the line and a love of live fire.'),
        node('ButtonContainer', { align: 'start' }, [Btn('Apply', { variant: 'primary', size: 'sm', icon: 'send', iconPosition: 'start', href: 'mailto:careers@emberandoak.test?subject=Line%20cook' })]),
      ], { gap: 'sm' })]),
      Cd({}, [Col([
        Row([H('Pastry lead', { as: 'h3', size: 'sm' }), Badge('Full-time', { status: 'success', icon: null }), Badge('Kitchen', { icon: null })], { gap: 'xs', align: 'center', wrap: true }),
        Muted('Own the dessert menu, work the wood oven, mentor a small team.'),
        node('ButtonContainer', { align: 'start' }, [Btn('Apply', { variant: 'primary', size: 'sm', icon: 'send', iconPosition: 'start', href: 'mailto:careers@emberandoak.test?subject=Pastry%20lead' })]),
      ], { gap: 'sm' })]),
      Cd({}, [Col([
        Row([H('Server', { as: 'h3', size: 'sm' }), Badge('Part-time', { status: 'info', icon: null }), Badge('Front of house', { icon: null })], { gap: 'xs', align: 'center', wrap: true }),
        Muted('Read a table, know the menu, make people feel at home. Wine knowledge a plus.'),
        node('ButtonContainer', { align: 'start' }, [Btn('Apply', { variant: 'primary', size: 'sm', icon: 'send', iconPosition: 'start', href: 'mailto:careers@emberandoak.test?subject=Server' })]),
      ], { gap: 'sm' })]),
      Cd({}, [Col([
        Row([H('Host', { as: 'h3', size: 'sm' }), Badge('Part-time', { status: 'info', icon: null }), Badge('Front of house', { icon: null })], { gap: 'xs', align: 'center', wrap: true }),
        Muted('First and last smile of the night. Calm under a full book.'),
        node('ButtonContainer', { align: 'start' }, [Btn('Apply', { variant: 'primary', size: 'sm', icon: 'send', iconPosition: 'start', href: 'mailto:careers@emberandoak.test?subject=Host' })]),
      ], { gap: 'sm' })]),
    ]),
  ]),
  Sec({ padding: 'xl', contentWidth: 'md', gap: 'lg' }, [
    H('How hiring works'),
    Acc('1 · Say hello', [Muted('Send a note and a résumé to the role you’re after. A real person reads every one.')], { defaultOpen: true }),
    Acc('2 · Come cook or shadow a shift', [Muted('Kitchen roles do a paid stage; front-of-house shadow a service. We want to see you in the room.')]),
    Acc('3 · Offer', [Muted('If it’s a fit, we move fast — usually within a week.')]),
    node('MessageEmptyState', {
      scale: 'card',
      icon: 'alternate_email',
      title: 'Don’t see your role?',
      description: 'We’re always glad to meet good people. Send us a note and tell us what you do.',
    }),
    node('ButtonContainer', { align: 'start' }, [Btn('Email the team', { variant: 'secondary', icon: 'mail', iconPosition: 'start', href: 'mailto:careers@emberandoak.test' })]),
  ]),
]);

const contact = def('ember-contact', 'Contact', 'Find and reach Ember & Oak.', [
  Sec({ padding: 'xl', surface: 'panel', gradient: 'accent', gradientPosition: 'top-left', contentWidth: 'lg', gap: 'md' }, [
    Badge('Contact', { icon: 'call' }),
    node('Heading', { as: 'h1', type: 'display', size: { xs: 'xl', md: 'xxl' } }, undefined, 'Come find us'),
    Lead('On Market Lane in the old town, where the smoke gives us away.'),
  ]),
  Sec({ padding: 'xl', contentWidth: 'lg', gap: 'lg' }, [
    Gr({ columns: { xs: 1, md: 2 }, gap: 'xl' }, [
      Col([H('Hours', { size: 'md' }), DList([
        { label: 'Wed – Thu', value: '5:00 – 10:00 pm' },
        { label: 'Fri – Sat', value: '5:00 – 11:30 pm' },
        { label: 'Sunday', value: '10:00 am – 9:00 pm' },
        { label: 'Mon – Tue', value: 'Closed' },
      ])]),
      Col([H('Get in touch', { size: 'md' }), DList([
        { label: 'Address', value: '114 Market Lane, Old Town' },
        { label: 'Phone', value: '(555) 240-7788', copyValue: true },
        { label: 'Email', value: 'hello@emberandoak.test', copyValue: true },
        { label: 'Press', value: 'press@emberandoak.test', copyValue: true },
      ])]),
    ]),
  ]),
  Sec({ padding: 'none' }, [Fig('1414235077428-338989a2e8c0', 'The restaurant facade glowing at night', { ratio: '16:9' })]),
  Sec({ padding: 'xl', contentWidth: 'md', gap: 'lg' }, [
    Cd({}, [Col([
      H('Send us a note', { size: 'md' }),
      Gr({ columns: { xs: 1, md: 2 }, gap: 'md' }, [
        node('TextField', { label: 'Your name', autoComplete: 'name' }),
        node('TextField', { label: 'Email', type: 'email', autoComplete: 'email' }),
      ]),
      node('ChoiceGroup', {
        label: 'What’s it about?',
        columns: { xs: 1, md: 3 },
        options: [
          { value: 'general', label: 'General', icon: 'chat' },
          { value: 'events', label: 'Private events', icon: 'celebration' },
          { value: 'press', label: 'Press', icon: 'newspaper' },
        ],
      }),
      node('TextareaField', { label: 'Message' }),
      node('ButtonContainer', { align: 'end' }, [Btn('Send message', { variant: 'primary', icon: 'send', iconPosition: 'start' })]),
    ], { gap: 'lg' })]),
    Banner('Hungry now?', 'Skip the form and book a table — we’ll see you tonight.', { status: 'success', title: 'Ready to visit?' }),
    node('ButtonContainer', { align: 'start' }, [Btn('Reserve a table', { variant: 'primary', icon: 'event_seat', iconPosition: 'start', href: link('ember-reservations') })]),
  ]),
]);

// ── Project + page tree ────────────────────────────────────────────────────────

export const restaurantProject = {
  id: RESTAURANT_PROJECT_ID,
  name: 'Ember & Oak',
  description: 'A complete sample restaurant website — menus, reservations, about, history, and careers.',
  icon: 'local_fire_department',
};

export const restaurantPages: ProjectPage[] = [
  { id: 'ember-home', title: 'Home', icon: 'home', parentId: null, order: 0 },
  { id: 'ember-menus', title: 'Menus', icon: 'restaurant_menu', parentId: null, order: 1 },
  { id: 'ember-dinner', title: 'Dinner', icon: 'dinner_dining', parentId: 'ember-menus', order: 0 },
  { id: 'ember-brunch', title: 'Brunch', icon: 'brunch_dining', parentId: 'ember-menus', order: 1 },
  { id: 'ember-drinks', title: 'Drinks', icon: 'local_bar', parentId: 'ember-menus', order: 2 },
  { id: 'ember-wine', title: 'Wine list', icon: 'wine_bar', parentId: 'ember-drinks', order: 0 },
  { id: 'ember-reservations', title: 'Reservations', icon: 'event_seat', parentId: null, order: 2 },
  { id: 'ember-about', title: 'About', icon: 'info', parentId: null, order: 3 },
  { id: 'ember-history', title: 'Our history', icon: 'history_edu', parentId: 'ember-about', order: 0 },
  { id: 'ember-careers', title: 'Careers', icon: 'work', parentId: 'ember-about', order: 1 },
  { id: 'ember-contact', title: 'Contact', icon: 'call', parentId: null, order: 4 },
];

export const restaurantContent: Record<string, PageDefinition> = {
  'ember-home': home,
  'ember-menus': menus,
  'ember-dinner': dinner,
  'ember-brunch': brunch,
  'ember-drinks': drinks,
  'ember-wine': wine,
  'ember-reservations': reservations,
  'ember-about': about,
  'ember-history': history,
  'ember-careers': careers,
  'ember-contact': contact,
};
