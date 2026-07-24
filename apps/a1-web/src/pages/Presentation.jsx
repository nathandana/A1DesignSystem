import { useCallback, useEffect, useState } from 'react'
import {
  Button,
  ButtonContainer,
  Card,
  Grid,
  Heading,
  List,
  ListItem,
  MessageBadge,
  Paragraph,
  Section,
  Stack,
  StepTracker,
  StickyActions,
} from '@gtivr4/a1-design-system-react'
import './Presentation.css'

const SCREENS = [
  { id: 'a1', Screen: A1Screen },
  { id: 'a1-demo', Screen: A1DemoScreen },
  { id: 'why', Screen: WhyBuiltScreen },
  { id: 'why-demo', Screen: WhyBuiltDemoScreen },
  { id: 'problem', Screen: CoreProblemScreen },
  { id: 'problem-demo', Screen: CoreProblemDemoScreen },
  { id: 'works', Screen: HowA1WorksScreen },
  { id: 'works-demo', Screen: HowA1WorksDemoScreen },
  { id: 'pressure', Screen: PressureTestingScreen },
  { id: 'pressure-demo', Screen: PressureTestingDemoScreen },
  { id: 'example', Screen: ConcreteExampleScreen },
  { id: 'example-demo', Screen: ConcreteExampleDemoScreen },
]

const SHOW_DEMO_SCREENS = false
const SHOW_SPEAKER_NOTES = false
const VISIBLE_SCREENS = SHOW_DEMO_SCREENS
  ? SCREENS
  : SCREENS.filter((screen) => !screen.id.endsWith('-demo'))

function SlideFrame({ direction, children }) {
  return (
    <Grid className="a1-web-presentation__stage" columns={1} gap="lg" alignItems="center">
      <div className="a1-web-presentation__slide" data-direction={direction}>
        <Stack className="a1-web-presentation__slide-content" gap="sm">
          {children}
        </Stack>
      </div>
    </Grid>
  )
}

function SlideCard({ eyebrow, title, icon, heroColor = 'info', children }) {
  return (
    <Card className="a1-web-presentation__content-card" icon={icon} iconDisplay="hero" heroColor={heroColor}>
      <Stack gap="sm">
        <Stack gap="xs">
          <MessageBadge status="info" subtle size="md">{eyebrow}</MessageBadge>
          <Heading as="h1" size="xl">{title}</Heading>
        </Stack>
        {children}
      </Stack>
    </Card>
  )
}

function SpeakerNotes({ children }) {
  if (!SHOW_SPEAKER_NOTES) return null

  return (
    <Stack className="a1-web-presentation__notes" gap="xs">
      {children}
    </Stack>
  )
}

function DemoPlaceholder({ direction, title }) {
  return (
    <SlideFrame direction={direction}>
      <Card className="a1-web-presentation__content-card" icon="play_circle" iconDisplay="hero" heroColor="neutral">
        <Stack gap="sm">
          <Stack gap="xs">
            <MessageBadge status="info" size="lg">Demo placeholder</MessageBadge>
            <Heading as="h1" size="xl">{title}</Heading>
          </Stack>
          <Paragraph size="md">
            Placeholder for a live product demo or screen recording.
          </Paragraph>
        </Stack>
      </Card>
    </SlideFrame>
  )
}

function A1Screen({ direction }) {
  return (
    <SlideFrame direction={direction}>
      <SlideCard eyebrow="Slide 1" title="A1" icon="hub" heroColor="info">
        <List>
          <ListItem>AI-ready design system</ListItem>
          <ListItem>Built to turn rules into working software</ListItem>
          <ListItem>A platform for design, code, and agents</ListItem>
        </List>
      </SlideCard>
      <SpeakerNotes>
        <Paragraph size="sm" align='left' color="muted">
          A1 started as a way to expand my ability to use AI while building a design system. But it quickly became more than a component library. It became a way to explore what a design system needs to be when both humans and agents are building with it.
        </Paragraph>
        <Paragraph size="sm" align='left' color="muted">
          The key idea is that design systems can't just document standards anymore. They need to provide usable context, constraints, and structured patterns that can be applied directly to real software.
        </Paragraph>
      </SpeakerNotes>
    </SlideFrame>
  )
}

function A1DemoScreen({ direction }) {
  return <DemoPlaceholder direction={direction} title="Demo: A1" />
}

function WhyBuiltScreen({ direction }) {
  return (
    <SlideFrame direction={direction}>
      <SlideCard eyebrow="Slide 2" title="Why I built it" icon="construction" heroColor="warn">
        <List>
          <ListItem>Design tools are often still representations</ListItem>
          <ListItem>Production depends on interpretation</ListItem>
          <ListItem>I wanted to work closer to the real output</ListItem>
        </List>
      </SlideCard>
      <SpeakerNotes>
        <Paragraph size="sm" align='left' color="muted">
          Figma and other design tools are powerful, but they still often feel like suggestions for software. You can design the intended experience, but you still have to imagine the interaction, imagine the edge cases, and hope the final implementation carries the intent through.
        </Paragraph>
        <Paragraph size="sm" align='left' color="muted">
          With A1, I wanted to get closer to the actual artifact: working software that I could interact with, improve, and test in real time.
        </Paragraph>
      </SpeakerNotes>
    </SlideFrame>
  )
}

function WhyBuiltDemoScreen({ direction }) {
  return <DemoPlaceholder direction={direction} title="Demo: Why I built it" />
}

function CoreProblemScreen({ direction }) {
  return (
    <SlideFrame direction={direction}>
      <SlideCard eyebrow="Slide 3" title="The core problem" icon="psychology" heroColor="info">
        <List>
          <ListItem>Agents need context</ListItem>
          <ListItem>Without rules, they invent rules</ListItem>
          <ListItem>Consistency requires explicit guidance</ListItem>
        </List>
      </SlideCard>
      <SpeakerNotes>
        <Paragraph size="sm" align='left' color="muted">
          I'm a rules-based person. I like to know what the rules are for a given situation. Agents don't have that discomfort. If they don't know the rules, they will often make something up confidently.
        </Paragraph>
        <Paragraph size="sm" align='left' color="muted">
          That became one of the central insights of A1. The design system needs to give agents the same kind of context we try to give designers and engineers: component rules, layout rules, accessibility expectations, naming conventions, and examples of good output.
        </Paragraph>
      </SpeakerNotes>
    </SlideFrame>
  )
}

function CoreProblemDemoScreen({ direction }) {
  return <DemoPlaceholder direction={direction} title="Demo: The core problem" />
}

function HowA1WorksScreen({ direction }) {
  return (
    <SlideFrame direction={direction}>
      <SlideCard eyebrow="Slide 4" title="How A1 works" icon="widgets" heroColor="success">
        <List>
          <ListItem>Components</ListItem>
          <ListItem>Rules</ListItem>
          <ListItem>Structured page definitions</ListItem>
          <ListItem>Multi-tool output</ListItem>
        </List>
      </SlideCard>
      <SpeakerNotes>
        <Paragraph size="sm" align='left' color="muted">
          A1 uses structured definitions for components, patterns, and pages. The editor uses JSON as the contract, rather than treating React, HTML, or Figma as the source of truth.
        </Paragraph>
        <Paragraph size="sm" align='left' color="muted">
          That creates a simple agreement: use these components, these properties, and these rules. From there, the output can target different tools or frameworks.
        </Paragraph>
        <Paragraph size="sm" align='left' color="muted">
          This is important because in enterprise environments, not every team is on the same stack. One team may use React, another Angular, another Web Components, another may need design assets or native patterns.
        </Paragraph>
      </SpeakerNotes>
    </SlideFrame>
  )
}

function HowA1WorksDemoScreen({ direction }) {
  return <DemoPlaceholder direction={direction} title="Demo: How A1 works" />
}

function PressureTestingScreen({ direction }) {
  return (
    <SlideFrame direction={direction}>
      <SlideCard eyebrow="Slide 5" title="Pressure testing" icon="science" heroColor="warn">
        <List>
          <ListItem>Built with A1</ListItem>
          <ListItem>Portfolio</ListItem>
          <ListItem>Word game</ListItem>
          <ListItem>Product/editor prototypes</ListItem>
          <ListItem>Figma Make and coding agents</ListItem>
        </List>
      </SlideCard>
      <SpeakerNotes>
        <Paragraph size="sm" align='left' color="muted">
          I've used A1 to build A1 itself, along with my portfolio, a word game, and several product-style prototypes. That let me pressure test the system from multiple angles: manual design, manual coding, agentic coding, and agentic design.
        </Paragraph>
        <Paragraph size="sm" align='left' color="muted">
          The most useful part has been watching where the system breaks. When an agent produces inconsistent output, that usually points to missing guidance. So the process becomes iterative: improve the rules, improve the examples, improve the structure, and test again.
        </Paragraph>
      </SpeakerNotes>
    </SlideFrame>
  )
}

function PressureTestingDemoScreen({ direction }) {
  return <DemoPlaceholder direction={direction} title="Demo: Pressure testing" />
}

function ConcreteExampleScreen({ direction }) {
  return (
    <SlideFrame direction={direction}>
      <SlideCard eyebrow="Slide 6" title="Concrete example" icon="dashboard_customize" heroColor="success">
        <List>
          <ListItem>Data-rich interface</ListItem>
          <ListItem>Filters, cards, actions, states</ListItem>
          <ListItem>Built from structured rules</ListItem>
          <ListItem>Rendered as working software</ListItem>
          <ListItem>Improved through agent feedback</ListItem>
        </List>
      </SlideCard>
      <SpeakerNotes>
        <Paragraph size="sm" align='left' color="muted">
          A concrete example is a data-rich interface: something with filters, cards, actions, empty states, and responsive behavior.
        </Paragraph>
        <Paragraph size="sm" align='left' color="muted">
          In a traditional process, this may start as a Figma mockup and wait for engineering before it can really be tested. In A1, I can define the interface structure, connect or mock the data, apply system components, and generate working software much earlier.
        </Paragraph>
        <Paragraph size="sm" align='left' color="muted">
          That gives me a faster feedback loop. I can evaluate whether the design system has the right components, whether the rules are clear enough, whether the interaction actually works, and whether agents can produce consistent results from the same source of truth.
        </Paragraph>
        <Paragraph size="sm" align='left' color="muted">
          The larger point is that A1 demonstrates how I think about design systems at a staff or principal level: not just as UI kits, but as operating systems for consistent product delivery.
        </Paragraph>
      </SpeakerNotes>
    </SlideFrame>
  )
}

function ConcreteExampleDemoScreen({ direction }) {
  return <DemoPlaceholder direction={direction} title="Demo: Concrete example" />
}

export function Presentation({ onNavigate }) {
  const [slideIndex, setSlideIndex] = useState(0)
  const [motionDirection, setMotionDirection] = useState('forward')

  const totalSlides = VISIBLE_SCREENS.length
  const activeScreen = VISIBLE_SCREENS[slideIndex]
  const Screen = activeScreen.Screen
  const slideCount = `Slide ${slideIndex + 1} of ${totalSlides}`

  const goToPrevious = useCallback(() => {
    setMotionDirection('back')
    setSlideIndex((current) => Math.max(0, current - 1))
  }, [])

  const goToNext = useCallback(() => {
    setMotionDirection('forward')
    setSlideIndex((current) => Math.min(totalSlides - 1, current + 1))
  }, [totalSlides])

  const closePresentation = useCallback(() => {
    onNavigate?.('home')
  }, [onNavigate])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return

      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        closePresentation()
        return
      }

      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault()
        event.stopPropagation()
        goToNext()
        return
      }

      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault()
        event.stopPropagation()
        goToPrevious()
      }
    }

    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [closePresentation, goToNext, goToPrevious])

  return (
    <Section
      as="main"
      id="main-content"
      className="a1-web-presentation"
      surface="raised"
      padding="lg"
      contentWidth="md"
      height="screen"
      gap="lg"
      gradient="accent"
      gradientPosition="center"
      
    >
      <Screen key={activeScreen.id} direction={motionDirection} />

      <StickyActions className="a1-web-presentation__actions" contentWidth="xl">
        <StepTracker
          steps={totalSlides}
          currentStep={slideIndex + 1}
          align="right"
          aria-label={slideCount}
        />
        <ButtonContainer align="end" size="sm">
          <Button
            variant="primary"
            icon="arrow_forward"
            iconPosition="end"
            disabled={slideIndex === totalSlides - 1}
            onClick={goToNext}
          >
            Next
          </Button>
          <Button
            variant="secondary"
            icon="arrow_back"
            disabled={slideIndex === 0}
            onClick={goToPrevious}
          >
            Previous
          </Button>
        </ButtonContainer>
      </StickyActions>
    </Section>
  )
}
