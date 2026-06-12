import {
  Button,
  ButtonContainer,
  Card,
  Grid,
  Heading,
  MessageBadge,
  Paragraph,
  Section,
  Stack,
} from "../../../../packages/react/src/index.js"
import { GameSceneIllustration } from "../components/GameSceneIllustration.jsx"
import { getRoutePath } from "../lib/routing.js"

const CHALLENGES = [
  {
    icon: "vertical_align_top",
    title: "Climb the curtains",
    description: "Scramble up the drapes before gravity wins. Bonus points for maximum tangle.",
  },
  {
    icon: "trending_up",
    title: "Scale the walls",
    description: "Launch off furniture, stick the landing, and leave paw prints on the wallpaper.",
  },
  {
    icon: "countertops",
    title: "Counter recon",
    description: "Hop from counter to counter. Knock something off for style points.",
  },
  {
    icon: "alarm",
    title: "Wake your human",
    description: "The 5 a.m. zoomies are not optional. Tap the snooze and claim victory.",
  },
]

export function StartPage({ onNavigate }) {
  return (
    <main className="cl-shell cl-shell--start">
      <Section
        className="cl-start-hero"
        padding="lg"
        inverse
        gradient="accent"
        gradientPosition="top-right"
        contentWidth="xl"
      >
        <Stack direction={{ xs: "column", lg: "row" }} gap="xl" align="center">
          <Stack gap="lg" className="cl-start-hero__copy">
            <MessageBadge icon="pets">CatLympics</MessageBadge>
            <Heading as="h1" type="display" size={{ xs: "lg", md: "xxl" }}>
              You are the cat. The house is your arena.
            </Heading>
            <Paragraph size="lg" color="muted">
              A playful illustrated game where every surface is a challenge. Climb curtains, bounce off walls,
              patrol the counters, and wake your human at the worst possible moment.
            </Paragraph>
            <ButtonContainer>
              <Button
                as="a"
                size="lg"
                href={getRoutePath("game")}
                icon="sports_score"
                onClick={(e) => onNavigate(e, "game")}
              >
                Play now
              </Button>
              <Button
                as="a"
                size="lg"
                variant="secondary"
                href={getRoutePath("login")}
                icon="login"
                onClick={(e) => onNavigate(e, "login")}
              >
                Sign in
              </Button>
            </ButtonContainer>
          </Stack>

          <div className="cl-start-hero__scene">
            <GameSceneIllustration />
          </div>
        </Stack>
      </Section>

      <Section padding="lg" contentWidth="xl">
        <Stack gap="xl">
          <Stack gap="sm" className="cl-start-section-heading">
            <MessageBadge subtle icon="emoji_events">
              Events
            </MessageBadge>
            <Heading as="h2" type="display" size={{ xs: "md", md: "lg" }}>
              Four events. One very tired human.
            </Heading>
            <Paragraph color="muted">
              Train your competitor, then put them through the household obstacle course.
            </Paragraph>
          </Stack>

          <Grid columns={{ xs: 1, sm: 2 }} gap="md">
            {CHALLENGES.map((challenge) => (
              <Card key={challenge.title} as="article" icon={challenge.icon} surface="panel">
                <Heading as="h3" size="sm">
                  {challenge.title}
                </Heading>
                <Paragraph size="sm" color="muted">
                  {challenge.description}
                </Paragraph>
              </Card>
            ))}
          </Grid>

          <Card surface="panel" className="cl-start-cta">
            <Stack direction={{ xs: "column", md: "row" }} gap="lg" align="center" justify="between">
              <Stack gap="xs">
                <Heading as="h2" size="md">
                  Ready to enter the arena?
                </Heading>
                <Paragraph color="muted">
                  Design your cat, save your roster, and start the chaos.
                </Paragraph>
              </Stack>
              <Button
                as="a"
                href={getRoutePath("game")}
                icon="arrow_forward"
                iconPosition="end"
                onClick={(e) => onNavigate(e, "game")}
              >
                Enter CatLympics
              </Button>
            </Stack>
          </Card>
        </Stack>
      </Section>
    </main>
  )
}
