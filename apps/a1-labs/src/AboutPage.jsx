import React, { useEffect } from 'react'
import { Button, Card, Code, Heading, Link, List, ListItem, PageLayout, Paragraph, Section, Stack } from '@gtivr4/a1-design-system-react'
import { LabsHeader } from './LabsHeader.jsx'
import { parseReleaseNotes } from './release-notes.js'
import changelog from '../CHANGELOG.md?raw'
import { version } from '../package.json'

const releases = parseReleaseNotes(changelog)

function ReleaseEntry({ text }) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, index) => {
    if (part.startsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>
    if (part.startsWith('`')) return <Code key={index} wrapping>{part.slice(1, -1)}</Code>
    return part
  })
}

export function AboutPage({ onOpenSettings }) {
  useEffect(() => { document.title = 'About Labs · A1 Labs' }, [])

  return (
    <PageLayout header={<LabsHeader onOpenSettings={onOpenSettings} current="about" />}>
      <Section contentWidth="md" padding={{ xs: 'sm', md: 'lg' }} gap="xl">
        <Stack gap={16}>
          <Paragraph size="sm" color="muted">A1 Labs · Version {version}</Paragraph>
          <Heading as="h1" size="xl">A place to try what’s next.</Heading>
          <Paragraph size="lg">
            A1 Labs is a playground for experimental interfaces, components and motion
            built with the A1 Design System. Explore an idea, change its settings and
            see how it behaves across themes, screen sizes and motion preferences.
          </Paragraph>
          <Stack direction="row" wrap gap={12}>
            <Button as="a" href="/" icon="science">Explore experiments</Button>
            <Button as="a" href="https://a1design.app" variant="secondary" icon="arrow_outward" iconPosition="end">Visit A1 Web</Button>
          </Stack>
          <Link href="#release-notes">Read the release notes</Link>
        </Stack>

        <Stack gap={16}>
          <Heading as="h2" size="lg">From experiment to possibility</Heading>
          <Paragraph>Build and test local rules in <Link href="/experiments/automation-builder">Trigger-condition-action builder</Link>, compare code-label treatments in <Link href="/experiments/token-styling">Token styling</Link>, or follow source references in <Link href="/experiments/token-hierarchy">Token hierarchy</Link>.</Paragraph>
          <Paragraph>Explore <Link href="/experiments/chat">Chat</Link> to compare message styles and send animations, with automatic replies from a simulated bot or person.</Paragraph>
          <Paragraph>
            The gallery is a collection of ideas in progress. Filter by category or type,
            such as microinteractions or form patterns, or search for a topic. Each experiment has its
            own workspace, with a searchable experiment tree and controls to adjust
            what you see. These explorations can change as we learn from them.
          </Paragraph>
          <Paragraph>
            Start with <Link href="/experiments/ai-image-generation">AI image generation</Link>:
            a study of progress, anticipation and image reveal. Try rotating discs
            or a glowing blob, then adjust the timing and frame. It uses a sample
            photograph to preview the animation; it does not generate images.
          </Paragraph>
          <Paragraph>
            Explore <Link href="/experiments/page-loading">Page loading</Link> to try
            a glowing border around a phone, tablet or desktop viewport. Change its
            speed, pause the motion or finish loading to see the border disappear.
          </Paragraph>
          <Paragraph>
            Try <Link href="/experiments/focus-animations">Focus state animations</Link>
            {' '}across a short form and its actions. Compare quick treatments that settle
            into clear focus indicators, with immediate states for reduced motion.
          </Paragraph>
          <Paragraph>
            Press the buttons in <Link href="/experiments/button-completion">Button completion</Link>
            {' '}to see an action become its own result. Publish changes in place;
            Send email launches its own icon as a paper plane that flies only as fast as the send. Set either one to fail
            to see the retry. The work is simulated.
          </Paragraph>
          <Paragraph>
            Try <Link href="/experiments/step-tracker">Step tracker</Link> for A1’s position indicator and five additional treatments.
          </Paragraph>
          <Paragraph>
            Compare <Link href="/experiments/steps">Steps</Link> for eight progress treatments, including A1’s default.
          </Paragraph>
          <Paragraph>
            Try <Link href="/experiments/button-motion">Button interactions</Link> for six hover and press
            treatments, from subtle feedback to a springy lift and expanding ripple.
          </Paragraph>
          <Paragraph>
            Explore <Link href="/experiments/switch-morph">Switch transition</Link> to
            toggle an enlarged A1 switch whose X moves into a checkmark. Adjust
            its scale and timing, or inspect the disabled state. Try <Link href="/experiments/switch-three">Switch transition 3D</Link> for
            a beveled track, raised thumb and solid moving strokes built with Three.js.
          </Paragraph>
          <Paragraph>
            See <Link href="/experiments/frosted-glass">Frosted glass</Link> for a
            sample page made of stacked glass panes in a phone, tablet or desktop
            viewport. Change the frost and the colors behind it.
          </Paragraph>
          <Paragraph>
            Open the <Link href="/experiments/token-visualizer">Color token visualizer</Link>
            {' '}to explore A1’s color ramps in a 3D OKLCH space, the same view as
            Foundations in A1 Web.
          </Paragraph>
          <Paragraph>
            Watch <Link href="/experiments/page-construction">Under construction</Link>
            {' '}for a second take on page loading: a little crane builds the page
            block by block until it is ready.
          </Paragraph>
          <Paragraph>
            Four more ideas for the same moment:{' '}
            <Link href="/experiments/page-blueprint">Blueprint</Link>,{' '}
            <Link href="/experiments/page-puzzle">Jigsaw</Link>,{' '}
            <Link href="/experiments/page-paint">Fresh paint</Link> and{' '}
            <Link href="/experiments/page-sunrise">Sunrise</Link> each turn waiting
            for a page into something to watch.
          </Paragraph>
          <Paragraph>
            Try <Link href="/experiments/thinking-terminal">AI thinking</Link> for a
            simulated chat that types random terminal-style status lines. Edit the
            lines, pause the animation or finish the response; longer lines get more time.
          </Paragraph>
          <Paragraph>
            Explore <Link href="/experiments/connected-nodes">Nodes and canvas</Link>
            {' '}to arrange connected A1 nodes, change their shapes and connectors,
            and pan or zoom around the graph.
          </Paragraph>
          <Paragraph>
            Try the <Link href="/experiments/verify-button">Verify button</Link> to
            arm a simulated critical action, hold to verify your intent and release
            to confirm. A separate click-only confirmation is also available.
          </Paragraph>
          <Paragraph>
            Explore <Link href="/experiments/reordering">Reordering</Link> to move
            items with insertion cues and subtle, plopping or tilting placement
            animations. Drag, use the keyboard or press the move buttons.
          </Paragraph>
          <Paragraph>
            Try <Link href="/experiments/billboard-actions">Billboard with actions</Link>
            {' '}to pair a bold introduction with clear next steps. Edit the copy,
            compare action cards and tiles, and preview the layout on different devices.
          </Paragraph>
          <Paragraph>
            Compare <Link href="/experiments/required-fields">Required fields</Link>
            {' '}to try five new ways of marking required and optional fields, from
            a thin line in the margin to numbered stops on a track, and how each
            flags missing fields when you submit.
          </Paragraph>
          <Paragraph>
            Follow <Link href="/experiments/verification-journey">Verification journey</Link>
            {' '}from a filled application through API checks, automatic retries and a precise completion receipt.
          </Paragraph>
          <Paragraph>
            See the <Link href="/experiments/timeline">Timeline</Link> to follow
            milestones along a coloured line that curves up and down to each one.
            On narrow screens it runs down the side instead.
          </Paragraph>
          <Paragraph>
            Explore the <Link href="/experiments/flip-billboard">Flip billboard</Link>,
            a physical headline display whose cards cycle through characters and settle independently.
          </Paragraph>
          <Paragraph>
            Watch the <Link href="/experiments/flip-clock">Flip clock</Link> turn
            physical split cards as the seconds, minutes and hours change.
          </Paragraph>
          <Paragraph>
            Play the <Link href="/experiments/slides">Slides</Link> deck to compare
            transitions from simple fades to morphs that carry shared content from
            one slide to the next, and choose how each slide’s points appear.
          </Paragraph>
          <Paragraph>
            Flip between light and dark with the <Link href="/experiments/mode-switches">Mode switches</Link>:
            a ball-chain pull cord, a sun and moon switch, a dial, an eclipse and a
            slide switch, with a fade or reveal between modes.
            Each one changes how Labs looks.
          </Paragraph>
          <Paragraph>
            Choose an option in <Link href="/experiments/radio-buttons">Radio buttons</Link> and
            watch the radio come alive in six ways: it grows and springs, ripples, bounces,
            thickens, travels between options or wobbles like jelly.
          </Paragraph>
          <Paragraph>
            Compare six navigation treatments for long tables in <Link href="/experiments/pagination-types">Pagination types</Link>, and pagination placement, sizes and data types in <Link href="/experiments/data-tables">Table pagination position</Link>, or nine ways to fit a table on a phone in <Link href="/experiments/mobile-tables">Mobile data tables</Link>,
            from cards and compact lists to tables with a frozen first column.
          </Paragraph>
          <Paragraph>
            Select rows and act on them together in <Link href="/experiments/bulk-actions">Bulk actions</Link>,
            with a bulk action bar that stays in place as the selection changes.
          </Paragraph>
          <Paragraph>
            Edit a inventory of up to 1,000 items in the <Link href="/experiments/data-grid">Data grid</Link>,
            A1’s experimental spreadsheet-style grid.
          </Paragraph>
          <Paragraph>
            Try <Link href="/experiments/fit-text">Fitted type</Link>, where every line of a
            headline is scaled to fill its container, so the shortest words are the largest.
          </Paragraph>
          <Paragraph>
            Join the waitlist in <Link href="/experiments/celebrations">Submission celebrations</Link> to
            see seven ways to celebrate success, from a simple check to Fenex the fox and an
            explosion of confetti.
          </Paragraph>
          <Paragraph>
            Open the <Link href="/experiments/dialog-motion">Dialog motion</Link> experiment to
            compare nine ways a dialog can arrive and leave, from fades and pops to slides,
            flips and swings, and tune the scrim behind it.
          </Paragraph>
          <Paragraph>
            Compare ways to explain one field in <Link href="/experiments/contextual-help">Contextual help</Link>:
            hints, tooltips, popovers, inline expansion and dialogs, opened by buttons in or
            beside the field, a text button or focus.
          </Paragraph>
          <Paragraph>
            Type into <Link href="/experiments/password-strength">Password strength</Link> to
            compare seven meters, from segments and rings to a requirement checklist and the
            time an attacker would need to guess it.
          </Paragraph>
          <Paragraph>
            Tick toppings in <Link href="/experiments/checkbox-motion">Checkbox motion</Link> to
            compare eight ways a checkbox can check, uncheck and show a partial selection,
            from a pop to drawn ticks, flips and jelly.
          </Paragraph>
          <Paragraph>
            Open and close the <Link href="/experiments/accordion-motion">Accordion transitions</Link> to
            compare eight ways an accordion can move, from a quick expand to slides, bounces,
            unfolding and wipes.
          </Paragraph>
          <Paragraph>
            Switch between options in the <Link href="/experiments/segmented-motion">Segmented control
            transitions</Link> to see the selected background fade, slide, stretch, grow, wipe or morph.
          </Paragraph>
          <Paragraph>
            Compare <Link href="/experiments/long-form">Long forms</Link> using 20 sections
            and 60 questions, arranged as pages, side navigation or visual groups.
            Explore the <Link href="/experiments/date-of-birth">date-of-birth inputs</Link>
            {' '}from A1 Web, including selects, numeric fields, auto-advance and formatting.
          </Paragraph>
          <Paragraph>
            A1 Web is the home of the design system’s components, foundations and
            documentation. Labs uses those same building blocks, including theme
            settings, responsive layouts and accessible controls. Animations follow
            your device’s reduced-motion preference.
          </Paragraph>
        </Stack>

        <Stack as="section" gap={24} id="release-notes" aria-labelledby="release-notes-heading">
          <Stack gap={8}>
            <Heading as="h2" size="lg" id="release-notes-heading">Release notes</Heading>
            <Paragraph color="muted">What’s changed in Labs, newest first.</Paragraph>
          </Stack>
          {releases.map(release => (
            <Card as="article" key={release.version} aria-labelledby={`release-${release.version}`}>
              <Stack gap={16}>
                <Stack gap={8}>
                  <Heading as="h3" size="md" id={`release-${release.version}`}>Version {release.version}</Heading>
                  <Paragraph size="sm" color="muted">{release.date}{release.version === version ? ' · Current version' : ''}</Paragraph>
                </Stack>
                <List size="sm">
                  {release.entries.map((entry, index) => <ListItem key={index}><ReleaseEntry text={entry} /></ListItem>)}
                </List>
              </Stack>
            </Card>
          ))}
        </Stack>
      </Section>
    </PageLayout>
  )
}
