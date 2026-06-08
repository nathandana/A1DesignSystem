import { useEffect, useMemo, useState } from "react"
import {
  Button,
  ButtonContainer,
  Card,
  Heading,
  Icon,
  MessageBadge,
  Paragraph,
  Section,
  Stack,
} from "../../../packages/react/src/index.js"

const cats = [
  {
    id: "mochi",
    name: "Mochi",
    personality: "Sleepy",
    accent: "#a96b57",
    body: "#f9d6cd",
    ear: "#e8b4a9",
  },
  {
    id: "pickle",
    name: "Pickle",
    personality: "Chaotic",
    accent: "#4f7b5d",
    body: "#d8efce",
    ear: "#b9d7b2",
  },
  {
    id: "bean",
    name: "Bean",
    personality: "Hungry",
    accent: "#9c7a3b",
    body: "#fff0b4",
    ear: "#f2dc94",
  },
]

const actions = [
  {
    key: "feed",
    label: "Feed",
    icon: "restaurant",
    preferredMood: "hungry",
    reward: 5,
    fallback: 3,
  },
  {
    key: "toy",
    label: "Play",
    icon: "toys",
    preferredMood: "playful",
    reward: 5,
    fallback: 3,
  },
  {
    key: "nap",
    label: "Nap",
    icon: "bedtime",
    preferredMood: "sleepy",
    reward: 3,
    fallback: 2,
  },
]

const moodBubbles = {
  idle: { label: "Idle", icon: "self_improvement" },
  happy: { label: "Happy", icon: "favorite" },
  hungry: { label: "Hungry", icon: "restaurant" },
  playful: { label: "Playful", icon: "sports_esports" },
  sleepy: { label: "Sleepy", icon: "bedtime" },
}

const initialMood = cats.map(() => "idle")
const positions = [
  { left: "12%", top: "24%" },
  { left: "54%", top: "18%" },
  { left: "70%", top: "34%" },
]

function randomMood(current) {
  const next = ["idle", "hungry", "playful", "sleepy"]
  const candidate = next[Math.floor(Math.random() * next.length)]
  return candidate === current ? "idle" : candidate
}

export function App() {
  const [hearts, setHearts] = useState(0)
  const [catStates, setCatStates] = useState(initialMood)
  const [feedback, setFeedback] = useState("Tap a cat to pet it.")

  const unlockedCats = useMemo(() => {
    const unlocked = [0]
    if (hearts >= 25) unlocked.push(1)
    if (hearts >= 50) unlocked.push(2)
    return unlocked
  }, [hearts])

  const nextUnlock = useMemo(() => {
    if (hearts < 25) return "25 hearts unlocks Pickle."
    if (hearts < 50) return "50 hearts unlocks Bean."
    return "All cats are here!"
  }, [hearts])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCatStates((prev) =>
        prev.map((state, index) => {
          if (!unlockedCats.includes(index) || state === "happy") return state
          return randomMood(state)
        })
      )
    }, 5200)

    return () => window.clearInterval(interval)
  }, [unlockedCats])

  function showFeedback(message) {
    setFeedback(message)
    window.setTimeout(() => setFeedback("Tap a cat to pet it."), 2600)
  }

  function handleCatTap(index) {
    const reward = catStates[index] === "happy" ? 2 : 1
    setHearts((value) => value + reward)
    setCatStates((state) => state.map((current, i) => (i === index ? "happy" : current)))
    showFeedback(`${cats[index].name} purrs! +${reward} heart${reward > 1 ? "s" : ""}`)
  }

  function handleAction(action) {
    const targetIndex = unlockedCats.find((index) => catStates[index] === action.preferredMood) ?? unlockedCats[0]
    const reward = catStates[targetIndex] === action.preferredMood ? action.reward : action.fallback

    setHearts((value) => value + reward)
    setCatStates((state) =>
      state.map((current, index) => (index === targetIndex ? "happy" : current))
    )

    showFeedback(
      `${cats[targetIndex].name} enjoys the ${action.label.toLowerCase()}! +${reward} hearts`
    )
  }

  return (
    <Section padding="lg" contentWidth="lg" gap="lg" className="cat-cafe-shell">
      <Stack direction="column" gap="lg">
        <Stack direction={{ xs: "column", md: "row" }} justify="between" align="center" gap="lg">
          <div>
            <MessageBadge icon="favorite">Cat Stack Café</MessageBadge>
            <Heading as="h1" type="display" size={{ xs: "xl", md: "xxl" }} textWrap="balance">
              A cozy café for curious cats.
            </Heading>
            <Paragraph color="muted">
              Pet cats, feed them, play with toys, and unlock more cute guests as your hearts grow.
            </Paragraph>
          </div>

          <Card className="score-panel" surface="panel">
            <Stack gap="sm">
              <Stack direction="row" align="center" gap="sm">
                <Icon name="favorite" />
                <Heading as="p" size="lg">Hearts</Heading>
              </Stack>
              <Heading as="p" type="display" size="xl">{hearts}</Heading>
              <Paragraph color="muted">Cats: {unlockedCats.length}/{cats.length}</Paragraph>
            </Stack>
          </Card>
        </Stack>

        <Card surface="panel" className="scene-card">
          <div className="scene-layout">
            <div className="scene-window">
              <div className="scene-sun" />
              <div className="scene-bird">🐦</div>
            </div>
            <div className="scene-rug" />
            <div className="scene-bowl">
              <span>🍲</span>
            </div>
            <div className="scene-toy">
              <span>🧶</span>
            </div>
            <div className="scene-tree">
              <div className="tree-top" />
              <div className="tree-trunk" />
            </div>

            {unlockedCats.map((catIndex, index) => {
              const cat = cats[catIndex]
              const mood = catStates[catIndex]
              const bubble = moodBubbles[mood]

              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`scene-cat scene-cat--${mood}`}
                  onClick={() => handleCatTap(catIndex)}
                  style={positions[index]}
                >
                  <div className="cat-shadow" />
                  <svg viewBox="0 0 160 140" className="cat-shape" aria-hidden="true">
                    <ellipse cx="80" cy="88" rx="56" ry="44" fill={cat.body} />
                    <ellipse cx="80" cy="48" rx="42" ry="34" fill={cat.body} />
                    <path d="M56 22 C50 10 66 10 70 24" fill={cat.ear} />
                    <path d="M104 22 C110 10 94 10 90 24" fill={cat.ear} />
                    <path d="M48 90 C42 108 50 112 58 96" fill={cat.body} />
                    <path d="M112 90 C118 108 110 112 102 96" fill={cat.body} />
                    <circle cx="64" cy="46" r="8" fill="#1a1a1a" className="cat-eye" />
                    <circle cx="96" cy="46" r="8" fill="#1a1a1a" className="cat-eye" />
                    <path d="M68 70 Q80 78 92 70" stroke="#7c4f3d" strokeWidth="4" fill="none" strokeLinecap="round" />
                    <path d="M80 60 L80 66" stroke="#7c4f3d" strokeWidth="3" strokeLinecap="round" />
                    <path d="M128 88 C146 84 154 110 132 118" fill="none" stroke={cat.accent} strokeWidth="10" strokeLinecap="round" className="cat-tail" />
                  </svg>
                  <div className="cat-callout">
                    <Icon name={bubble.icon} /> {bubble.label}
                  </div>
                  <div className="cat-name">{cat.name}</div>
                </button>
              )
            })}
          </div>
        </Card>

        <Card surface="panel">
          <Stack gap="lg">
            <Stack direction="row" justify="between" align="center">
              <div>
                <Heading as="h2" size="lg">Actions</Heading>
                <Paragraph color="muted">Interact with cats to keep the café cheerful.</Paragraph>
              </div>
              <Paragraph color="muted">{nextUnlock}</Paragraph>
            </Stack>

            <ButtonContainer fullWidth>
              {actions.map((action) => (
                <Button
                  key={action.key}
                  icon={action.icon}
                  onClick={() => handleAction(action)}
                  fullWidth
                >
                  {action.label}
                </Button>
              ))}
            </ButtonContainer>
          </Stack>
        </Card>

        <Stack direction={{ xs: "column", sm: "row" }} justify="between" gap="lg">
          <Card surface="panel" className="feedback-card">
            <Stack gap="sm">
              <Heading as="h2" size="md">Café notes</Heading>
              <Paragraph color="muted">{feedback}</Paragraph>
            </Stack>
          </Card>

          <Card surface="panel" className="unlock-card">
            <Stack gap="sm">
              <Heading as="h2" size="md">Unlocked items</Heading>
              <Paragraph color="muted">
                {unlockedCats.length} cat{unlockedCats.length > 1 ? "s" : ""} waiting for pets.
              </Paragraph>
            </Stack>
          </Card>
        </Stack>
      </Stack>
    </Section>
  )
}
