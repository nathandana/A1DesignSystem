/**
 * Sample project — "Queen City Sideline", an example sports blog about Charlotte.
 *
 * A long-form editorial test bed: a clean landing page that links to six
 * lengthy articles (pro, college and high school), each with several Unsplash
 * figures, headings, blockquotes, lists, definition lists, inline formatting and
 * inline links. Useful for checking reading layouts and print output (A1-2707).
 *
 * The articles are illustrative example content. Named fans, coaches and
 * bylines are fictional composites; quotes are not from real people.
 *
 * Page tree:
 *   Home
 *   Pro
 *     ├─ Keep pounding (Panthers game day)
 *     └─ How Charlotte became a soccer city
 *   College
 *     ├─ Small school, big nights (Davidson basketball)
 *     └─ The 49ers' long climb
 *   High school
 *     ├─ Friday nights in Mecklenburg County
 *     └─ More than a sideline (girls' sports)
 */
import type { ComponentNode, PageDefinition } from '../editor/pageTypes';
import type { ProjectPage } from './projectStore';

export const SPORTS_BLOG_PROJECT_ID = 'proj-queen-city-sideline';
// Bump the suffix to refresh the bundled sample content on existing installs.
export const SPORTS_BLOG_SEED_FLAG = 'a1-seeded-queen-city-sideline-v3';

// ── Node builders ──────────────────────────────────────────────────────────────
const nid = (() => { let n = 0; return () => `qcs${(n += 1)}`; })();

type Props = Record<string, unknown>;
type N = ComponentNode;

const node = (type: string, props: Props = {}, children?: N[], content?: string): N => ({
  id: nid(),
  type: type as ComponentNode['type'],
  props,
  ...(content !== undefined ? { content: { fallback: content } } : {}),
  ...(children ? { children } : {}),
});

const link = (page: string) => `/?page=${page}`;

const Sec = (props: Props, children: N[]): N => node('Section', props, children);
const Col = (children: N[], props: Props = {}): N => node('Stack', { direction: 'column', gap: 'md', ...props }, children);
const Row = (children: N[], props: Props = {}): N => node('Stack', { direction: 'row', gap: 'sm', wrap: true, align: 'center', ...props }, children);
const H2 = (text: string): N => node('Heading', { as: 'h2', size: 'lg' }, undefined, text);
const H3 = (text: string): N => node('Heading', { as: 'h3', size: 'md' }, undefined, text);
const P = (text: string, props: Props = {}): N => node('Paragraph', { size: 'lg', ...props }, undefined, text);
const Muted = (text: string): N => node('Paragraph', { size: 'sm', color: 'muted' }, undefined, text);
const Badge = (text: string, props: Props = {}): N => node('MessageBadge', { size: 'sm', subtle: true, icon: null, ...props }, undefined, text);
const Quote = (text: string, cite: string, variant = 'border'): N => node('Blockquote', { variant, cite }, undefined, text);
const Pull = (text: string, cite: string): N => Quote(text, cite, 'pull');
const Div = (): N => node('Divider', { space: 'md' });
const Glance = (items: { label: string; value: string }[]): N =>
  node('DefinitionList', { direction: 'row', size: 'md', labelWidth: 'fixed', items });
const Bullets = (items: string[]): N =>
  node('List', { as: 'ul', variant: 'unordered', size: 'lg' }, items.map((t) => node('ListItem', {}, undefined, t)));
const Steps = (items: string[]): N =>
  node('List', { as: 'ol', variant: 'ordered', size: 'lg' }, items.map((t) => node('ListItem', {}, undefined, t)));
const Note = (title: string, text: string, status = 'info'): N =>
  node('Banner', { status, variant: 'inline', title }, undefined, text);

const unsplash = (photo: string, width = 1280) =>
  `https://images.unsplash.com/photo-${photo}?w=${width}&q=80&auto=format&fit=crop`;

const Fig = (photo: string, alt: string, caption?: string, ratio = '3:2'): N =>
  node('Figure', {
    src: unsplash(photo),
    alt,
    radius: 'md',
    aspectRatio: ratio,
    ...(caption ? { caption } : {}),
  });

/**
 * Paragraph with inline links. Write links as `[label](page-id)`; the label stays
 * in the fallback text and an inline link range points at the project page.
 * Inline links and inline markdown don't combine, so keep these paragraphs plain.
 */
const PL = (source: string, props: Props = {}): N => {
  const inlineLinks: { start: number; end: number; props: Props }[] = [];
  let text = '';
  let rest = source;
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/;
  for (let match = pattern.exec(rest); match; match = pattern.exec(rest)) {
    text += rest.slice(0, match.index);
    inlineLinks.push({ start: text.length, end: text.length + match[1].length, props: { href: link(match[2]) } });
    text += match[1];
    rest = rest.slice(match.index + match[0].length);
  }
  text += rest;
  return { ...node('Paragraph', { size: 'lg', ...props }), content: { fallback: text, inlineLinks } };
};

const def = (id: string, name: string, description: string, nodes: N[]): PageDefinition => ({
  schemaVersion: '1.0.0',
  page: { id, name, description, layout: { type: 'PageLayout', regions: [{ id: 'main', name: 'Main', nodes }] } },
});

// ── Article index ──────────────────────────────────────────────────────────────

type Level = 'pro' | 'college' | 'high-school';

const LEVELS: Record<Level, { page: string; label: string; icon: string }> = {
  pro: { page: 'qcs-pro', label: 'Pro', icon: 'stadium' },
  college: { page: 'qcs-college', label: 'College', icon: 'school' },
  'high-school': { page: 'qcs-high-school', label: 'High school', icon: 'sports_football' },
};

interface ArticleMeta {
  id: string;
  level: Level;
  sport: string;
  title: string;
  dek: string;
  author: string;
  date: string;
  minutes: number;
  hero: { photo: string; alt: string; caption: string };
}

const ARTICLES: ArticleMeta[] = [
  {
    id: 'qcs-panthers-game-day',
    level: 'pro',
    sport: 'NFL',
    title: 'Keep pounding: a Sunday in Uptown with the Panthers faithful',
    dek: 'Thirty years after the first kickoff, game day in Charlotte is still part tailgate, part family reunion and part civic ritual.',
    author: 'Jordan Ellis',
    date: 'Oct. 19, 2026',
    minutes: 11,
    hero: { photo: '1562762583-9e1705bcb3ff', alt: 'Uptown Charlotte lit up at night, seen from above', caption: 'On a home Sunday, Uptown’s empty office towers give way to a river of black and blue.' },
  },
  {
    id: 'qcs-soccer-city',
    level: 'pro',
    sport: 'MLS',
    title: 'How Charlotte became a soccer city',
    dek: 'A record-setting first night, a generation of Saturday-morning players and a club still learning who it is.',
    author: 'Priya Raman',
    date: 'Oct. 12, 2026',
    minutes: 10,
    hero: { photo: '1565483276060-e6730c0cc6a1', alt: 'A packed stadium crowd seen from the upper seats', caption: 'Big matchdays turn a football stadium into a soccer ground.' },
  },
  {
    id: 'qcs-davidson-basketball',
    level: 'college',
    sport: 'Basketball',
    title: 'Small school, big nights: why Davidson basketball still matters',
    dek: 'Twenty miles up I-77, a college of fewer than 2,000 students keeps proving that a gym can be bigger than its seat count.',
    author: 'Theo Banks',
    date: 'Oct. 5, 2026',
    minutes: 12,
    hero: { photo: '1513635625218-6956bc843133', alt: 'A basketball team huddled together in a small gym', caption: 'Small rosters, long careers: most players stay together for four years.' },
  },
  {
    id: 'qcs-niners-climb',
    level: 'college',
    sport: 'Football and basketball',
    title: 'The 49ers’ long climb',
    dek: 'From a Final Four in 1977 to a football program built from nothing, Charlotte’s university keeps growing up alongside its city.',
    author: 'Jordan Ellis',
    date: 'Sept. 28, 2026',
    minutes: 10,
    hero: { photo: '1557174949-3b1f5b2e8fac', alt: 'Aerial view of a football field and stadium during the day', caption: 'A program that started with no stadium, no roster and no schedule now plays a full major-college slate.' },
  },
  {
    id: 'qcs-friday-nights',
    level: 'high-school',
    sport: 'Football',
    title: 'Friday nights in Mecklenburg County',
    dek: 'Bands, boosters, a chain crew of volunteers and a few thousand neighbors: what it really takes to put on a high school football game.',
    author: 'Ana Whitfield',
    date: 'Sept. 21, 2026',
    minutes: 11,
    hero: { photo: '1663563624897-de8972d7ce93', alt: 'A high school football field with a crowd watching from the stands', caption: 'The bleachers fill by halftime; the parking lot filled hours before.' },
  },
  {
    id: 'qcs-girls-game',
    level: 'high-school',
    sport: 'Multi-sport',
    title: 'More than a sideline: the rise of girls’ sports in Charlotte high schools',
    dek: 'Volleyball gyms are packed, soccer fields are lit and a new generation of coaches came up through the same programs they now lead.',
    author: 'Priya Raman',
    date: 'Sept. 14, 2026',
    minutes: 10,
    hero: { photo: '1604652716188-e226685e94ca', alt: 'High school girls playing soccer on a grass field', caption: 'Girls’ soccer has grown from a spring afterthought into one of the area’s deepest sports.' },
  },
];

const byId = (id: string) => ARTICLES.find((a) => a.id === id)!;

// Static navigation card for an article (whole card is the link — no nested controls).
const ArticleCard = (a: ArticleMeta, opts: { headingSize?: string; showDek?: boolean } = {}): N =>
  node('Card', { variant: 'navigation', href: link(a.id) }, [
    Col([
      Fig(a.hero.photo, a.hero.alt, undefined, '3:2'),
      Row([Badge(LEVELS[a.level].label, { status: 'info' }), Badge(a.sport)], { gap: 'xs' }),
      node('Heading', { as: 'h3', size: opts.headingSize ?? 'sm' }, undefined, a.title),
      ...(opts.showDek === false ? [] : [Muted(a.dek)]),
      Muted(`${a.author} · ${a.date} · ${a.minutes} min read`),
    ], { gap: 'sm' }),
  ]);

const ExampleNote = (): N =>
  Note(
    'Example content',
    'Queen City Sideline is a sample blog for the A1 Design System. Articles are illustrative; bylines, named fans and coaches, and their quotes are fictional composites.',
    'neutral',
  );

// Article page shell: breadcrumb, header, hero figure, body, related stories.
const article = (id: string, body: N[]): PageDefinition => {
  const a = byId(id);
  const level = LEVELS[a.level];
  const related = ARTICLES.filter((other) => other.id !== id && other.level === a.level)
    .concat(ARTICLES.filter((other) => other.level !== a.level))
    .slice(0, 2);
  return def(id, a.title, a.dek, [
    Sec({ padding: 'lg', contentWidth: 'md', gap: 'lg', as: 'article' }, [
      node('Breadcrumb', {
        items: [
          { label: 'Home', href: link('qcs-home') },
          { label: level.label, href: link(level.page) },
          { label: a.title },
        ],
      }),
      Col([
        Row([Badge(level.label, { status: 'info', icon: level.icon }), Badge(a.sport), Badge(`${a.minutes} min read`, { icon: 'schedule' })], { gap: 'xs' }),
        node('Heading', { as: 'h1', size: { xs: 'xl', md: 'xxl' } }, undefined, a.title),
        P(a.dek, { size: 'xl', color: 'muted' }),
        Muted(`By ${a.author} · ${a.date}`),
      ], { gap: 'sm' }),
      Fig(a.hero.photo, a.hero.alt, a.hero.caption, '16:9'),
      ...body,
      Div(),
      ExampleNote(),
    ]),
    Sec({ padding: 'lg', contentWidth: 'md', gap: 'lg', surface: 'panel' }, [
      H2('Keep reading'),
      node('Grid', { columns: { xs: 1, md: 2 }, gap: 'md' }, related.map((r) => ArticleCard(r))),
    ]),
  ]);
};

// ── Landing page ───────────────────────────────────────────────────────────────

const home = def('qcs-home', 'Home', 'Queen City Sideline — stories from Charlotte sports, pro to prep.', [
  Sec({ padding: 'lg', contentWidth: 'lg', gap: 'lg' }, [
    Col([
      node('Heading', { as: 'h1', type: 'display', size: { xs: 'xl', md: 'xxl' } }, undefined, 'Queen City Sideline'),
      P('Long reads on Charlotte sports — from Sundays in Uptown to Friday nights across Mecklenburg County.', { size: 'xl', color: 'muted' }),
    ], { gap: 'sm' }),
    Fig('1507810670121-b08efd787765', 'The Charlotte skyline under a dramatic sunset sky', 'Uptown Charlotte at sunset.', '21:9'),
  ]),
  Sec({ padding: 'lg', contentWidth: 'lg', gap: 'lg' }, [
    Col([H2('Latest stories'), Muted('Six features on the teams, schools and people that make Charlotte a sports town.')], { gap: 'xs' }),
    node('Grid', { columns: { xs: 1, md: 2 }, gap: 'lg' }, [ArticleCard(ARTICLES[0], { headingSize: 'md' }), ArticleCard(ARTICLES[1], { headingSize: 'md' })]),
    node('Grid', { columns: { xs: 1, sm: 2, lg: 4 }, gap: 'md' }, ARTICLES.slice(2).map((a) => ArticleCard(a, { showDek: false }))),
  ]),
  Sec({ padding: 'lg', contentWidth: 'lg', gap: 'lg', surface: 'panel' }, [
    H2('Browse by level'),
    node('Grid', { columns: { xs: 1, md: 3 }, gap: 'md' }, [
      node('Card', { variant: 'navigation', href: link('qcs-pro'), icon: 'stadium' }, [
        node('Heading', { as: 'h3', size: 'sm' }, undefined, 'Pro'),
        Muted('The Panthers, Charlotte FC and the city’s big-league nights.'),
      ]),
      node('Card', { variant: 'navigation', href: link('qcs-college'), icon: 'school' }, [
        node('Heading', { as: 'h3', size: 'sm' }, undefined, 'College'),
        Muted('Davidson, the Charlotte 49ers and the region’s campuses.'),
      ]),
      node('Card', { variant: 'navigation', href: link('qcs-high-school'), icon: 'sports_football' }, [
        node('Heading', { as: 'h3', size: 'sm' }, undefined, 'High school'),
        Muted('Friday nights, packed gyms and the programs that hold neighborhoods together.'),
      ]),
    ]),
    ExampleNote(),
  ]),
]);

// ── Category pages ─────────────────────────────────────────────────────────────

const category = (level: Level, intro: string): PageDefinition => {
  const meta = LEVELS[level];
  return def(meta.page, meta.label, intro, [
    Sec({ padding: 'lg', contentWidth: 'lg', gap: 'lg' }, [
      node('Breadcrumb', { items: [{ label: 'Home', href: link('qcs-home') }, { label: meta.label }] }),
      Col([
        node('Heading', { as: 'h1', size: { xs: 'xl', md: 'xxl' } }, undefined, meta.label),
        P(intro, { size: 'xl', color: 'muted' }),
      ], { gap: 'sm' }),
      node('Grid', { columns: { xs: 1, md: 2 }, gap: 'lg' }, ARTICLES.filter((a) => a.level === level).map((a) => ArticleCard(a, { headingSize: 'md' }))),
    ]),
  ]);
};

const pro = category('pro', 'Big-league Charlotte: NFL Sundays in Uptown and a soccer club that arrived to a record crowd.');
const college = category('college', 'From a small-college gym on Lake Norman to a university that built a football program from scratch.');
const highSchool = category('high-school', 'The games that happen closest to home — and the volunteers, coaches and players who make them happen.');

// ── Articles ───────────────────────────────────────────────────────────────────

const panthers = article('qcs-panthers-game-day', [
  P('By 9 a.m. on a home Sunday, the smell of charcoal has already settled over the parking lots south of Uptown. Pickup trucks back into spaces with an inch to spare. Folding tables come out, then the pop-up tents, then the speakers. Somebody always brings a slow cooker that has been running since before dawn, and somebody else always forgets the ice.'),
  P('The Carolina Panthers played their first season in 1995 and moved into their Uptown stadium the following year. Three decades later, game day in Charlotte has the texture of a tradition that was built on purpose: a franchise that had to earn its fans one season at a time, in a region that already had strong loyalties to college programs a few hours away in every direction.'),
  P('What it built is not one crowd but several. There are the **original season-ticket holders**, now bringing grandchildren. There are transplants who arrived for banking jobs and adopted the team along with the city. And there are the families who come downtown a few times a year and treat it like a holiday, *matching jerseys and all*.'),
  H2('Before the gates open'),
  P('Tailgating in Charlotte is less a single scene than a patchwork. Private lots, church lots and garages each have their own regulars, and the regulars have their own rules. Some groups have kept the same spot for twenty years. Others rotate, following a friend who has a parking pass this season.'),
  Fig('1556764420-e37ef4cdfa5c', 'Fans gathered in an arena concourse at night', 'The walk to the gates is part of the ritual — the crowd thickens block by block.'),
  P('A good share of the crowd never drives at all. Uptown is walkable, and the city’s light rail drops riders within a short stroll of the stadium. On a cool October morning, the walk is the best part: a slow river of black and blue moving past office towers that are empty for the day.'),
  H3('What the regulars bring'),
  Bullets([
    'A cooler with a working latch — the one with the broken latch stays home.',
    'Folding chairs for everyone, plus one extra for the neighbor who always visits.',
    'A radio or phone tuned to the pregame show, because the TV never gets signal.',
    'Rain ponchos in September. Especially in September.',
    'Trash bags. The lots that stay welcoming are the ones that get cleaned.',
  ]),
  H2('Where “Keep pounding” comes from'),
  P('Every franchise has a slogan. Few have one with a story attached that fans can recite. “Keep pounding” traces back to Sam Mills, the undersized linebacker who became a cornerstone of the early teams and later a coach on the staff. Facing a cancer diagnosis, Mills told the team that he would keep pounding, and asked them to do the same.'),
  Pull('You learn the words before you learn the rules of football. My kids could say “keep pounding” before they knew what a first down was.', 'Marcus, season-ticket holder since 1996'),
  P('The phrase became the franchise’s rallying cry. Before games, a guest beats a large drum on the field to rouse the crowd, and the line shows up on signs, shirts and the occasional tattoo. It works because it promises effort rather than results — a sensible promise in a league where results are never guaranteed.'),
  H2('Two Super Bowls and a lot of patience'),
  P('Charlotte fans have seen both ends of the league. The team reached the Super Bowl after the 2003 season and lost a close game to New England. Twelve years later, after the 2015 season, it went 15–1 in the regular season behind quarterback Cam Newton, who was named the league’s Most Valuable Player, and reached Super Bowl 50 before falling to Denver.'),
  P('Between and after those peaks have come rebuilding years, coaching changes and Sundays when the stadium emptied early. Ask a longtime fan what keeps them coming, and the answer is rarely about the standings. It is the people they sit beside, the friends in the lot and ==the one perfect afternoon a season== that makes the rest worth it.'),
  Quote('The wins are great. But I come for the four hours before kickoff and the twenty minutes after, when everybody is either hugging or complaining.', 'Denise, tailgate host in the same lot for 18 seasons'),
  Fig('1768879045902-6412996b9d51', 'An American football game in a stadium full of spectators', 'From the upper deck, the whole field reads like a diagram.'),
  H2('A field guide for first-timers'),
  P('If you are going for the first time, the veterans’ advice is consistent. None of it is complicated; all of it is learned the hard way.'),
  Steps([
    'Arrive early. The lots and the light rail are both easier two hours before kickoff than forty minutes before.',
    'Check the bag policy before you leave home. Clear bags only, and small ones.',
    'Eat in Uptown or at a tailgate. Stadium lines peak in the first quarter.',
    'Bring layers. A sunny 1 p.m. kickoff can end in a chilly, windy fourth quarter.',
    'Stay for the final whistle at least once. The walk out after a win is the best walk in the city.',
  ]),
  H3('Getting there without a car'),
  P('Light rail, rideshare drop-off zones and a short walk from most Uptown hotels make a car optional. Fans who drive in from the suburbs increasingly park at outlying stations and ride in — slower on the way home, but far less stressful than a garage exit.'),
  H2('The stadium at a glance'),
  Glance([
    { label: 'First season', value: '1995 (the stadium opened in 1996)' },
    { label: 'Location', value: 'Uptown Charlotte, south of the central business district' },
    { label: 'Also home to', value: 'Charlotte FC and major college football games' },
    { label: 'Best way in', value: 'Light rail or a walk from Uptown' },
    { label: 'Tradition', value: 'The pregame drum and “Keep pounding”' },
  ]),
  H2('What thirty years adds up to'),
  P('The thing about a young franchise is that its history is short enough to hold in one memory. Plenty of people in the stands this fall were there for the first game, and they can tell you who sat beside them. That continuity is rare in professional sports, where teams move, stadiums turn over and fan bases splinter.'),
  P('Charlotte has not had that problem. The team is still in Uptown, the lots are still full and the drum still sounds before kickoff. Whatever the record says in January, Sunday mornings in the fall still belong to the people who show up early and stay late.'),
  Fig('1566577739112-5180d4bf9390', 'A worn leather football resting on the field', 'Thirty seasons in, the ritual is the same: kickoff at one, tailgate at nine.'),
]);

const soccer = article('qcs-soccer-city', [
  P('Charlotte was a soccer city long before it had a top-flight club. You could see it every Saturday morning in the fall and spring: fields in every corner of Mecklenburg County covered in small players in oversized jerseys, parents with folding chairs and coffee, coaches who were mostly volunteers and occasionally former professionals.'),
  P('When Major League Soccer awarded Charlotte an expansion team, the question was not whether the city liked soccer. It was whether the people who played and coached and drove kids to practice would buy tickets to watch it. The answer arrived on the club’s first home night.'),
  H2('The night 74,479 showed up'),
  P('Charlotte FC played its first home match in March 2022 at the same Uptown stadium the Panthers use. The announced crowd of **74,479** set a single-match attendance record for the league at the time. Fans who were there still describe the sound when the teams walked out: not a roar so much as a wall.'),
  Fig('1558151748-f2621b5e52f0', 'A crowd in a stadium cheering with arms raised', 'Opening nights are loud. The question for any expansion club is whether the third season is too.'),
  Pull('I’d coached under-10 soccer for fifteen years. Standing in that crowd, I kept thinking: every one of my players is here somewhere.', 'Luis, volunteer youth coach in east Charlotte'),
  P('A record crowd is an event; a fan base is a habit. In the seasons since, the club has worked to turn first-night curiosity into weekly attendance, through supporters’ groups, family pricing, a matchday experience built around the Uptown setting and a steady push into the youth game that fed the crowd in the first place.'),
  H2('Built on Saturday mornings'),
  P('Youth soccer in Charlotte is enormous, decentralized and fiercely local. Recreational leagues run through churches, community centers and parks departments. Competitive clubs draw players from across the region, and a few have sent players to college programs and beyond. The overlap between those families and the club’s ticket buyers is not an accident.'),
  Bullets([
    'Recreational leagues keep the game cheap and close to home.',
    'Competitive clubs travel, train year-round and charge accordingly.',
    'High school seasons — fall for boys, spring for girls — give players a second team and a school identity.',
    'The pro club’s academy sits at the top, offering a pathway that did not exist in Charlotte a decade ago.',
  ]),
  P('There is tension in that pyramid, as there is everywhere in American youth soccer. Costs rise as players climb, and the families who can afford travel and training are not a cross-section of the city. Coaches at the recreational level talk about keeping the game accessible as often as they talk about tactics.'),
  H2('Matchday, step by step'),
  P('Soccer crowds behave differently from football crowds, and Charlotte’s has developed its own rhythm. Here is how a typical matchday goes for the regulars in the supporters’ end.'),
  Steps([
    'Meet at a bar or brewery in Uptown or South End two or three hours before kickoff.',
    'March together to the stadium, drums and flags out front.',
    'Stand — the whole match. Seats in the supporters’ section are mostly decorative.',
    'Sing through the first half, the halftime break and especially the last ten minutes.',
    'Stay after the whistle to applaud the players, win or lose.',
  ]),
  Fig('1569531955323-33c6b2dca44b', 'A green soccer pitch inside a large stadium', 'Turning a football stadium into a soccer ground means new lines, new sightlines and a different kind of noise.'),
  H2('A football stadium, a soccer club'),
  P('Sharing a stadium has advantages: capacity for big nights, Uptown transit and a building fans already know. It also has costs. A ground designed for football can feel cavernous for a midseason match, and the schedule has to work around another tenant. Many supporters say they would love a soccer-specific stadium someday; for now, the club has made the big building feel smaller by concentrating crowds and noise where the cameras and players notice them.'),
  Quote('A smaller crowd that sings the whole match beats a bigger one that checks its phone. We’ve had both. The singing is what brings people back.', 'Renee, supporters’ group organizer'),
  H3('What the club still has to figure out'),
  P('Expansion teams get a honeymoon and then a reckoning. Results on the field matter more in the second and third seasons than in the first, and the league is deep enough that rebuilding years are common. The clubs that last build an identity that survives a losing streak: a style of play, a set of local players fans recognize and a matchday that is worth the trip regardless of the score.'),
  H2('By the numbers'),
  Glance([
    { label: 'First MLS season', value: '2022' },
    { label: 'Opening home crowd', value: '74,479, a league record at the time' },
    { label: 'Home ground', value: 'The Uptown stadium shared with the Panthers' },
    { label: 'Youth pathway', value: 'Recreational leagues, competitive clubs and a pro academy' },
  ]),
  H2('A city that already played'),
  PL('The lesson of Charlotte’s soccer story is that the audience was there before the club. It was on suburban fields every weekend, in high school stands every spring and in living rooms watching European matches at 7 a.m. The club simply gave it a place to gather. For a different kind of crowd, see our story on [game day with the Panthers](qcs-panthers-game-day), or go back to the [home page](qcs-home).'),
  Fig('1431324155629-1a6deb1dec8d', 'Young players competing for the ball on a soccer field', 'The next generation of fans is already on the field every Saturday.'),
]);

const davidson = article('qcs-davidson-basketball', [
  P('The drive from Uptown Charlotte to Davidson takes about half an hour if I-77 cooperates, and it rarely does. The town at the end of it is small enough to walk end to end in a few minutes: a Main Street, a green, a few restaurants and a college of fewer than 2,000 students whose basketball team has, more than once, made the whole country pay attention.'),
  P('Davidson’s gym holds a little more than 5,000 people. On the right winter night it feels like twice that. Students fill one end, townspeople and alumni fill the rest, and visiting coaches from much bigger schools learn quickly that the building is not as friendly as its size suggests.'),
  H2('A town that fits in a gym'),
  P('Small-college basketball runs on proximity. Fans sit close enough to hear the coaches. Players are classmates, neighbors and the kids who wait tables in town during the summer. When the team is good, the whole town knows it; when the team loses, the whole town knows that too.'),
  Fig('1519766304817-4f37bda74a26', 'Players lined up for a free throw in a small, packed gym', 'In a small gym, the student section is close enough to read the playbook.'),
  P('That intimacy is part of the recruiting pitch, too. Davidson is a highly selective academic school, which narrows the pool of players the coaches can bring in. The players who come tend to be the ones who want both: a serious degree and a serious program. ==Fit matters more than rankings== here, and the coaching staff has built its approach around that constraint rather than against it.'),
  H2('March 2008'),
  P('Every program has a story it tells about itself. Davidson’s happened in March 2008, when a slender sophomore guard named Stephen Curry led the team through the NCAA tournament in a run nobody outside the region saw coming.'),
  P('Davidson beat Gonzaga, then second-seeded Georgetown, then Wisconsin, and reached the Elite Eight against Kansas in Detroit. With the game on the line, Davidson had the final possession and a chance to win; the last shot missed, and Kansas won by two points on its way to the national championship. For a school of Davidson’s size, losing that game was still the most famous thing that had ever happened to it.'),
  Pull('People in Charlotte who had never been to Davidson were driving up just to stand outside the gym. We didn’t have tickets. We just wanted to be near it.', 'Caroline, Davidson alumna'),
  P('Curry went on to an NBA career that changed how the game is played. The town kept the memory close: jerseys in shop windows, a court that former players come back to and a recruiting story that every coach since has been able to tell. *A player overlooked by bigger programs can come here and become anything.*'),
  H2('The McKillop way'),
  P('Bob McKillop coached Davidson for more than three decades, from 1989 until 2022, when his son Matt succeeded him. Over that stretch, the program developed an identity that opponents could describe in one breath: patient, unselfish, relentlessly organized, and willing to recruit internationally when the domestic pool was thin.'),
  H3('Principles you hear from players'),
  Bullets([
    'Move the ball. The best shot is usually one more pass away.',
    'Space the floor. Everyone can shoot, so everyone has to be guarded.',
    'Defend without fouling. Small rosters can’t afford foul trouble.',
    'Play for the program. Players are expected to stay four years, and most do.',
    'Recruit for fit. The right student in the right system beats a higher-rated recruit who wants to leave.',
  ]),
  Quote('You don’t win here by getting the five best players. You win by getting five players who make each other better and then keeping them for four years.', 'A former assistant coach'),
  Fig('1518989229647-6377f907a0b2', 'A college basketball resting on a dark court', 'The style is simple to describe and hard to copy: pass, cut, shoot, repeat.'),
  H2('What a mid-major has to get right'),
  P('Davidson now plays in the Atlantic 10, a conference full of programs with bigger budgets and bigger buildings. Staying competitive there requires doing the small things well, every season, without the margin for error that money buys.'),
  Steps([
    'Find players other programs undervalue, at home and abroad.',
    'Develop them over four years instead of chasing quick fixes.',
    'Schedule ambitiously enough to build a tournament résumé.',
    'Win at home, where the gym is the program’s biggest advantage.',
    'Keep the culture stable through coaching and roster changes.',
  ]),
  H2('Davidson at a glance'),
  Glance([
    { label: 'Location', value: 'Davidson, about 20 miles north of Uptown Charlotte' },
    { label: 'Enrollment', value: 'Fewer than 2,000 undergraduates' },
    { label: 'Home court', value: 'An on-campus gym seating a little over 5,000' },
    { label: 'Conference', value: 'Atlantic 10' },
    { label: 'Signature moment', value: 'The 2008 run to the Elite Eight' },
  ]),
  H2('Still worth the drive'),
  PL('College basketball has changed since 2008: players transfer more freely, money flows differently and the gap between the biggest programs and everyone else keeps widening. Davidson is betting that what made it special still works — continuity, fit and a gym that feels like a living room. Read about another kind of college climb in [the 49ers’ story](qcs-niners-climb).'),
  Fig('1546519638-68e109498ffc', 'A basketball sitting beneath a hoop on an outdoor court', 'Every big night starts on a court like this one.'),
]);

const niners = article('qcs-niners-climb', [
  P('Charlotte’s public university began after World War II as an extension center for returning veterans, holding evening classes in a high school building. It became the University of North Carolina at Charlotte in 1965, and it has grown ever since — with the city, and in some ways faster than the city noticed.'),
  P('Its athletic programs, the 49ers, have followed the same arc: modest beginnings, a few moments that announced the school to the rest of the country and a long, deliberate climb toward the level of competition its size and city suggest it should reach.'),
  H2('A campus that grew up with the city'),
  P('University City, the part of northeast Charlotte that grew around the campus, is now one of the busiest areas in the region: research parks, apartments, hospitals and a light-rail line that connects campus directly to Uptown. For decades, though, the school was easy to overlook in a state with several famous athletic programs a short drive away.'),
  Fig('1523844203081-56a85e95590c', 'An aerial view of Charlotte’s buildings and roads', 'As Charlotte spread outward, its university grew from a commuter campus into a major research school.'),
  H2('1977'),
  P('The first moment came in basketball. In 1977, coach Lee Rose and forward Cedric “Cornbread” Maxwell led the 49ers to the Final Four. It was an astonishing run for a young program, and it remains the high-water mark that every Charlotte basketball team is measured against.'),
  Pull('My dad still talks about 1977 like it was last week. He says the whole city learned the word “Niners” in about ten days.', 'Andre, 2009 graduate'),
  P('Maxwell went on to win championships in the NBA, and the program has made other tournament appearances since. But the Final Four gave the school something that money can’t buy: a story older fans tell younger ones, and proof that ==a commuter school in a banking city could beat anyone on the right night==.'),
  H2('Starting football from zero'),
  P('Football was a different kind of challenge. Charlotte did not field a team until 2013. Starting a program means building everything at once: hiring a staff, recruiting a roster with no film to show, building a stadium and finding a conference willing to schedule you.'),
  H3('The timeline'),
  Steps([
    'Planning — the university commits to launching football and raising money for facilities.',
    '2013 — the first season, played in a new on-campus stadium.',
    '2015 — the move to the top level of college football in Conference USA.',
    '2019 — the first bowl game appearance.',
    '2023 — the move to the American Athletic Conference.',
  ]),
  P('Each step brought tougher opponents and a harder recruiting fight. Early seasons included lopsided losses, as they do for nearly every new program. The point was never immediate success; it was to build something that could eventually compete, and to give students and alumni a reason to stay on campus on Saturdays.'),
  Fig('1527702596665-c7c5426d6fde', 'A football player catching a pass in a stadium', 'A new program needs years of recruiting classes before its roster looks like its opponents’.'),
  Quote('In the first couple of years we were playing teams that had been around for a century. You could feel it. Now the kids we recruit have grown up watching us play.', 'A former staff member'),
  H2('Why it matters for Charlotte'),
  P('Big cities often have a complicated relationship with their local universities’ teams. Charlotte’s sports calendar already includes the NFL, the NBA, MLS, minor-league baseball and hockey, and major neutral-site college football games. The 49ers compete for attention with all of it.'),
  Bullets([
    'Alumni — a large and fast-growing base that mostly stays in the region.',
    'Students — a campus that is increasingly residential rather than commuter.',
    'Transit — light rail makes Uptown fans a short ride from campus games.',
    'Conference — regular opponents with recognizable names and real stakes.',
  ]),
  P('None of those advantages guarantees crowds; they make crowds possible. Programs like this are built over decades, and the 49ers are still in the middle of their story, not the end.'),
  H2('The 49ers at a glance'),
  Glance([
    { label: 'School', value: 'University of North Carolina at Charlotte' },
    { label: 'Basketball landmark', value: 'Final Four in 1977' },
    { label: 'Football launched', value: '2013' },
    { label: 'Current conference', value: 'American Athletic Conference' },
    { label: 'Getting there', value: 'Light rail from Uptown to campus' },
  ]),
  H2('Still climbing'),
  PL('The best thing a young athletic program can have is patience from the people around it. Charlotte has given its university that, mostly, and the school has rewarded it with steady growth. For a different model of college sports — small, old and stubbornly itself — read [our Davidson feature](qcs-davidson-basketball).'),
  Fig('1539304180102-10f854c3585e', 'The Charlotte skyline on a clear day', 'A university that grew up with its city — and is still growing.'),
]);

const fridayNights = article('qcs-friday-nights', [
  P('At 5 p.m. on a Friday in September, the parking lot behind a high school stadium in north Mecklenburg County is already half full. Kickoff is at 7:30. The band buses arrive first, then the concession volunteers, then the families who want a good seat on the home side, then everyone else.'),
  P('This is the school we’ll call Northlake — a composite of the programs we visited this fall — but it could be almost any of the dozens of high schools in and around Charlotte that play football on Friday nights. The details vary. The shape of the night does not.'),
  H2('Five o’clock: the lot fills'),
  P('The first people on site are rarely players. They are the **booster club volunteers** who stock the concession stand, the athletic director checking the lights and the clock, and the ticket takers setting up tables at the gate. Most of them have done this for years. Many of them no longer have children at the school.'),
  Fig('1509928015542-fcc9b3bcd048', 'Stadium floodlights shining against a dark night sky', 'The lights come on early. Everything else follows.'),
  Quote('My son graduated six years ago. I still work the grill every home game. Somebody has to, and the kids know my face.', 'Teresa, booster club volunteer'),
  H2('The band is half the show'),
  P('Ask the students in the stands what they came for, and a surprising number will say the halftime show. Marching bands in the region practice for weeks over the summer, and their shows have themes, costumes and choreography. For many families, the band is the reason they are here: ~~they came for the football~~ *they came for the trombone section*.'),
  P('Bands also shape the night’s rhythm. They play the team onto the field, play after every score, fill timeouts and keep the student section loud during long drives. A good band can make a lopsided game feel like an event.'),
  H2('Who keeps the game running'),
  P('A Friday night game looks simple from the bleachers. Behind it is a crew of adults, most of them unpaid, doing jobs that are easy to forget until something goes wrong.'),
  Bullets([
    'The chain crew — volunteers holding the down markers on the sideline, usually the same group for years.',
    'The clock and scoreboard operators — often teachers, sometimes parents, always nervous.',
    'The announcer — a voice the whole community knows, reading names they have heard since youth league.',
    'Athletic trainers — the most important people on the sideline, and the least noticed.',
    'Concessions — the booster club’s main fundraiser, paying for equipment and travel.',
    'Security and traffic — school staff and officers managing crowds of several thousand.',
  ]),
  Fig('1761258772385-66e51635cf84', 'High school football players in uniform on the field', 'Players warm up while volunteers set the chains and test the scoreboard.'),
  H2('Kickoff'),
  P('By the time the teams come out of the locker room, the stands are full and the student section has picked a theme for the night — white-out, camo, pajamas. The game itself can be anything: a blowout, a defensive grind or a back-and-forth shootout that ends on the final play. What matters to the people in the stands is that it is *theirs*.'),
  Pull('I know every one of those kids. I coached half of them in flag football when they were seven. That’s what makes it different from watching on TV.', 'Rob, former youth league coach'),
  H2('Recruiting, rankings and pressure'),
  P('The Charlotte area produces a steady stream of college football players, and the attention that follows can be intense. Recruiting services rank sophomores. College coaches visit practices. Highlight videos circulate before the game is over. For a few players, Friday night is an audition.'),
  P('Coaches we spoke with were blunt about the trade-offs. Exposure helps players earn scholarships. It can also turn a team sport into a résumé-building exercise and put adult-sized pressure on teenagers. The best programs, they said, keep the focus on the team and let the attention follow.'),
  H3('What coaches tell families'),
  Steps([
    'Grades open more doors than highlight videos.',
    'Play multiple sports if you can. College coaches like athletes.',
    'Be wary of anyone charging money to “get you recruited.”',
    'Talk to your coach before you talk to a recruiter.',
    'Enjoy it. Most players’ last organized game is in high school.',
  ]),
  H2('A night at a glance'),
  Glance([
    { label: 'Gates open', value: 'About 90 minutes before kickoff' },
    { label: 'Kickoff', value: '7 or 7:30 p.m. on most Friday nights' },
    { label: 'Tickets', value: 'Usually bought online in advance' },
    { label: 'Who works it', value: 'Mostly volunteers and school staff' },
    { label: 'Where the money goes', value: 'Equipment, travel and every other team at the school' },
  ]),
  H2('The walk home'),
  PL('After the final horn, the band plays one more song, the players gather at midfield and the crowd thins slowly into the dark. The volunteers stay another hour, cleaning up, counting the cash box and turning off the lights. They will be back next Friday. For more on how high school sports are changing, read [our feature on girls’ sports](qcs-girls-game).'),
  Fig('1760046997065-25e4d6352bc8', 'A high school football player running with the ball during a game', 'For most players, these are the biggest crowds they will ever play in front of.'),
]);

const girlsGame = article('qcs-girls-game', [
  P('Walk into a high school gym in Charlotte on a Tuesday night in October and you might find it louder than the football stadium was the Friday before. Volleyball has quietly become one of the best-attended high school sports in the area, and it is part of a broader shift: girls’ sports in Charlotte schools are bigger, deeper and more visible than they have ever been.'),
  P('The change did not happen overnight. It is the product of fifty years of policy, a generation of players who became coaches, a youth sports system that grew enormously and families who now expect their daughters to have the same opportunities as their sons.'),
  H2('Fifty years after Title IX'),
  P('Title IX, the federal law passed in 1972, prohibits sex discrimination in education programs that receive federal funding — including school athletics. Its effect on participation was dramatic, nationally and locally. Schools that once offered a handful of girls’ teams now field them in most sports, with paid coaches, scheduled facilities and full seasons.'),
  Fig('1528024522223-f295b5bae7b1', 'A girls’ team sitting together on a bench beside a field', 'Many of today’s coaches played for the same programs they now lead.'),
  P('Equal on paper is not always equal in practice. Coaches still talk about practice times, field quality, travel budgets and crowds. But the conversation has changed from **whether** girls should have teams to **how good** those teams can be.'),
  Pull('When I played here, our games were at 4 p.m. and our parents were the only people in the stands. Now the student section shows up for us. That’s the difference.', 'Coach Danielle, varsity volleyball'),
  H2('Volleyball’s quiet boom'),
  P('Volleyball is the clearest example. The sport’s growth in club programs has fed high school rosters with players who have trained year-round since middle school. Matches are fast, loud and easy to follow, which makes them good for student crowds. Several schools now schedule volleyball as a marquee event, with themes, announcers and livestreams.'),
  Fig('1547347298-4074fc3086f0', 'Players in a volleyball match inside a school gym', 'Fast rallies and a small court make volleyball one of the best crowd sports in a school gym.'),
  H3('Why volleyball draws a crowd'),
  Bullets([
    'Matches are short — usually under two hours.',
    'Every point scores, so there is no dead time.',
    'The gym is small, so even a few hundred fans sound like thousands.',
    'Student sections can stand right on top of the action.',
  ]),
  H2('Soccer, basketball and the rest'),
  P('Girls’ soccer is played in the spring in North Carolina, and Charlotte’s enormous youth soccer culture has made it one of the deepest sports in the region. Basketball remains a winter centerpiece. Lacrosse has grown rapidly in the suburbs, and track and cross-country rosters are among the largest at many schools. Newer offerings, including girls’ flag football in several states, have drawn strong early interest.'),
  Fig('1603291697926-7e5822ed1ac5', 'A girls’ soccer player striking the ball on a grass field', 'Spring soccer draws some of the deepest rosters in the region.'),
  H2('The club question'),
  P('The same club system that improved the level of play has created its own problems. Club seasons can overlap with school seasons, costs climb quickly and families feel pressure to specialize early. High school coaches spend a surprising amount of time negotiating schedules with club coaches.'),
  Quote('Club made our players better. It also made them tired. My job is to make high school soccer the most fun season of their year.', 'Coach Marisol, girls’ soccer'),
  H3('Advice for families'),
  Steps([
    'Ask how school and club schedules will overlap before you commit to both.',
    'Budget for the whole year: fees, travel, uniforms and tournaments.',
    'Keep more than one sport in the mix through middle school if you can.',
    'Watch for overuse injuries, especially in single-sport athletes.',
    'Remember that high school teams offer something clubs can’t: playing for your school.',
  ]),
  H2('The coaching pipeline'),
  P('Perhaps the most important change is behind the bench. A generation of women who played high school and college sports in the region has moved into coaching and athletic administration. Players now see coaches who look like them and who followed the path they are on. Athletic directors say that representation shows up in recruiting, retention and the culture of their programs.'),
  H2('At a glance'),
  Glance([
    { label: 'Landmark law', value: 'Title IX, 1972' },
    { label: 'Fall', value: 'Volleyball, cross-country, tennis and golf' },
    { label: 'Winter', value: 'Basketball, swimming and indoor track' },
    { label: 'Spring', value: 'Soccer, softball, lacrosse and outdoor track' },
    { label: 'Biggest shift', value: 'Year-round club play feeding school teams' },
  ]),
  H2('Louder every season'),
  PL('The best sign of change is the simplest: the stands. Crowds at girls’ games are bigger, younger and louder than they were a decade ago, and they include as many boys as girls. For the other side of the Friday night story, read [our football feature](qcs-friday-nights), or browse all of our [high school coverage](qcs-high-school).'),
  Fig('1770669564598-db3a01f4366e', 'A girls’ soccer player taking a throw-in', 'Every season adds more girls to rosters — and more fans to the stands.'),
]);

// ── Project + page tree ────────────────────────────────────────────────────────

export const sportsBlogProject = {
  id: SPORTS_BLOG_PROJECT_ID,
  name: 'Queen City Sideline',
  description: 'An example sports blog about Charlotte — a landing page and six long-form articles on pro, college and high school sports.',
  icon: 'sports_football',
  theme: 'dispatch',
};

export const sportsBlogPages: ProjectPage[] = [
  { id: 'qcs-home', title: 'Home', icon: 'home', parentId: null, order: 0 },
  { id: 'qcs-pro', title: 'Pro', icon: 'stadium', parentId: null, order: 1 },
  { id: 'qcs-panthers-game-day', title: 'Keep pounding', icon: 'sports_football', parentId: 'qcs-pro', order: 0 },
  { id: 'qcs-soccer-city', title: 'A soccer city', icon: 'sports_soccer', parentId: 'qcs-pro', order: 1 },
  { id: 'qcs-college', title: 'College', icon: 'school', parentId: null, order: 2 },
  { id: 'qcs-davidson-basketball', title: 'Small school, big nights', icon: 'sports_basketball', parentId: 'qcs-college', order: 0 },
  { id: 'qcs-niners-climb', title: 'The 49ers’ long climb', icon: 'trending_up', parentId: 'qcs-college', order: 1 },
  { id: 'qcs-high-school', title: 'High school', icon: 'sports_football', parentId: null, order: 3 },
  { id: 'qcs-friday-nights', title: 'Friday nights', icon: 'nightlight', parentId: 'qcs-high-school', order: 0 },
  { id: 'qcs-girls-game', title: 'More than a sideline', icon: 'sports_volleyball', parentId: 'qcs-high-school', order: 1 },
];

export const sportsBlogContent: Record<string, PageDefinition> = {
  'qcs-home': home,
  'qcs-pro': pro,
  'qcs-panthers-game-day': panthers,
  'qcs-soccer-city': soccer,
  'qcs-college': college,
  'qcs-davidson-basketball': davidson,
  'qcs-niners-climb': niners,
  'qcs-high-school': highSchool,
  'qcs-friday-nights': fridayNights,
  'qcs-girls-game': girlsGame,
};
