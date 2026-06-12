import { useEffect, useMemo, useState } from "react"
import {
  Banner,
  Button,
  ButtonContainer,
  Card,
  Heading,
  MessageBadge,
  Paragraph,
  RadioGroup,
  Section,
  Stack,
  TextField,
} from "../../../../packages/react/src/index.js"
import { CatIllustration } from "../components/CatIllustration.jsx"
import { getRoutePath } from "../lib/routing.js"

const STORAGE_KEY = "a1-cat-lympics-cats"

const AGE_OPTIONS = [
  { value: "kitten", label: "Kitten" },
  { value: "cat", label: "Cat" },
]
const FUR_OPTIONS = [
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long" },
]
const PATTERN_OPTIONS = [
  { value: "none", label: "Solid" },
  { value: "stripes", label: "Stripes" },
  { value: "spots", label: "Spots" },
]

const COLOR_PRESETS = [
  { label: "Tabby", base: "#ecd3b5", pattern: "#c07840" },
  { label: "Ginger", base: "#f5aa50", pattern: "#c06018" },
  { label: "Grey", base: "#c8ccd0", pattern: "#606878" },
  { label: "White", base: "#f4f0ec", pattern: "#b8b0a8" },
  { label: "Tuxedo", base: "#e0e0e0", pattern: "#181818" },
  { label: "Tortie", base: "#c8884c", pattern: "#3c2010" },
  { label: "Lilac", base: "#dcc8e8", pattern: "#7848b0" },
  { label: "Blue", base: "#b4c4d4", pattern: "#405870" },
]

const defaultCat = {
  name: "",
  age: "cat",
  furLength: "short",
  pattern: "stripes",
  baseColor: "#ecd3b5",
  patternColor: "#c07840",
}

function getStoredCats() {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function GamePage({ onNavigate }) {
  const [cats, setCats] = useState([])
  const [selectedCatId, setSelectedCatId] = useState(null)
  const [newCat, setNewCat] = useState(defaultCat)
  const [message, setMessage] = useState(null)
  const [action, setAction] = useState("idle")

  useEffect(() => {
    const stored = getStoredCats()
    setCats(stored)
    if (stored.length > 0) setSelectedCatId(stored[0].id)
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cats))
  }, [cats])

  useEffect(() => {
    if (action === "idle") return
    const timer = window.setTimeout(() => setAction("idle"), 1400)
    return () => window.clearTimeout(timer)
  }, [action])

  const selectedCat = useMemo(
    () => cats.find((cat) => cat.id === selectedCatId) ?? cats[0] ?? null,
    [cats, selectedCatId]
  )

  function setField(field, value) {
    setNewCat((cat) => ({ ...cat, [field]: value }))
  }

  function applyPreset(preset) {
    setNewCat((cat) => ({ ...cat, baseColor: preset.base, patternColor: preset.pattern }))
  }

  function flash(msg) {
    setMessage(msg)
    window.setTimeout(() => setMessage(null), 3000)
  }

  function handleCreate(event) {
    event.preventDefault()
    if (!newCat.name.trim()) {
      flash("Please give your cat a name first.")
      return
    }
    const cat = { ...newCat, id: String(Date.now()) }
    setCats((prev) => [cat, ...prev])
    setSelectedCatId(cat.id)
    setNewCat(defaultCat)
    flash(`${cat.name} has entered CatLympics!`)
  }

  function handleSelectCat(id) {
    setSelectedCatId(id)
    setAction("idle")
  }

  function handleAction(type) {
    setAction(type)
    const labels = { run: "running", jump: "jumping", curl: "curling up", sit: "sitting pretty" }
    flash(`${selectedCat?.name ?? "Your cat"} is ${labels[type] ?? type}.`)
  }

  function handleRemoveCat(id) {
    setCats((prev) => {
      const next = prev.filter((cat) => cat.id !== id)
      if (selectedCatId === id) setSelectedCatId(next[0]?.id ?? null)
      return next
    })
  }

  return (
    <main className="cl-shell">
      <Section padding="lg" contentWidth="xl" gap="lg">
        <Stack gap="xl">
          <Stack direction={{ xs: "column", md: "row" }} gap="md" align={{ md: "center" }} justify="between">
            <Stack gap="sm">
              <MessageBadge icon="pets">CatLympics</MessageBadge>
              <Heading as="h1" type="display" size="xxl">
                Design your cat. Enter the arena.
              </Heading>
              <Paragraph color="muted">
                Customize your competitor&apos;s look, save them to your roster, and put them through their paces.
              </Paragraph>
            </Stack>
            <Button
              as="a"
              variant="tertiary"
              href={getRoutePath("start")}
              icon="arrow_back"
              onClick={(e) => onNavigate(e, "start")}
            >
              Back to start
            </Button>
          </Stack>

          <Stack direction={{ xs: "column", lg: "row" }} gap="xl" align="start">
            <Card surface="panel" className="cl-form-card">
              <Stack gap="lg">
                <Heading as="h2" size="lg">
                  Create your cat
                </Heading>
                <form className="cl-form" onSubmit={handleCreate} noValidate>
                  <TextField
                    label="Name"
                    value={newCat.name}
                    onChange={(e) => setField("name", e.target.value)}
                    placeholder="e.g. Mochi"
                  />

                  <RadioGroup
                    legend="Age"
                    value={newCat.age}
                    onChange={(value) => setField("age", value)}
                    options={AGE_OPTIONS}
                  />

                  <RadioGroup
                    legend="Fur length"
                    value={newCat.furLength}
                    onChange={(value) => setField("furLength", value)}
                    options={FUR_OPTIONS}
                  />

                  <RadioGroup
                    legend="Pattern"
                    value={newCat.pattern}
                    onChange={(value) => setField("pattern", value)}
                    options={PATTERN_OPTIONS}
                  />

                  <div className="cl-color-presets">
                    <span className="cl-field-label">Quick colours</span>
                    <div className="cl-presets-row">
                      {COLOR_PRESETS.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          className="cl-preset-swatch"
                          style={{ background: preset.base, borderColor: preset.pattern }}
                          title={preset.label}
                          aria-label={`Apply ${preset.label} colour preset`}
                          onClick={() => applyPreset(preset)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="cl-color-pickers">
                    <label className="cl-color-pick">
                      <span>Fur colour</span>
                      <input
                        type="color"
                        value={newCat.baseColor}
                        onChange={(e) => setField("baseColor", e.target.value)}
                      />
                    </label>
                    <label className="cl-color-pick">
                      <span>Pattern colour</span>
                      <input
                        type="color"
                        value={newCat.patternColor}
                        onChange={(e) => setField("patternColor", e.target.value)}
                      />
                    </label>
                  </div>

                  <Button type="submit" fullWidth>
                    Save to roster
                  </Button>
                </form>
              </Stack>
            </Card>

            <div className="cl-preview-panel">
              <Card surface="panel" className="cl-live-preview-card">
                <Stack gap="md">
                  <Heading as="h2" size="lg">
                    Preview
                  </Heading>
                  <div className="cl-live-preview">
                    <CatIllustration cat={{ ...newCat, id: "preview" }} action="idle" />
                  </div>
                  <Paragraph size="sm" color="muted">
                    Live preview — changes apply as you customise.
                  </Paragraph>
                </Stack>
              </Card>
            </div>
          </Stack>

          {cats.length > 0 && (
            <Stack direction={{ xs: "column", lg: "row" }} gap="xl" align="start">
              <Card surface="panel" className="cl-stage-card">
                <Stack gap="lg">
                  <Heading as="h2" size="lg">
                    {selectedCat ? `${selectedCat.name}'s stage` : "Select a cat"}
                  </Heading>

                  <div className="cl-stage">
                    {selectedCat ? (
                      <CatIllustration cat={selectedCat} action={action} />
                    ) : (
                      <Paragraph color="muted">Pick a cat from your roster to see them here.</Paragraph>
                    )}
                  </div>

                  {selectedCat && (
                    <>
                      <Stack gap="xs">
                        <Heading as="p" size="sm">
                          {selectedCat.name}
                        </Heading>
                        <Paragraph size="sm" color="muted">
                          {selectedCat.age} · {selectedCat.furLength} fur ·{" "}
                          {selectedCat.pattern === "none" ? "solid" : selectedCat.pattern}
                        </Paragraph>
                      </Stack>

                      <Stack gap="sm">
                        <Heading as="h3" size="sm">
                          Animate
                        </Heading>
                        <ButtonContainer>
                          <Button size="sm" onClick={() => handleAction("run")}>
                            Run
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => handleAction("jump")}>
                            Jump
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => handleAction("curl")}>
                            Curl
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => handleAction("sit")}>
                            Sit
                          </Button>
                        </ButtonContainer>
                      </Stack>
                    </>
                  )}
                </Stack>
              </Card>

              <Card surface="panel" className="cl-roster-card">
                <Stack gap="lg">
                  <Heading as="h2" size="lg">
                    Your roster
                  </Heading>
                  <Paragraph size="sm" color="muted">
                    {cats.length} {cats.length === 1 ? "cat" : "cats"} saved · stored in your browser
                  </Paragraph>
                  <div className="cl-roster-list">
                    {cats.map((cat) => (
                      <div
                        key={cat.id}
                        className={`cl-roster-item${cat.id === selectedCatId ? " cl-roster-item--active" : ""}`}
                      >
                        <button
                          type="button"
                          className="cl-roster-choose"
                          onClick={() => handleSelectCat(cat.id)}
                          aria-pressed={cat.id === selectedCatId}
                        >
                          <span
                            className="cl-roster-swatch"
                            style={{ background: cat.baseColor, outline: `3px solid ${cat.patternColor}` }}
                          />
                          <span className="cl-roster-meta">
                            <Heading as="span" size="sm">
                              {cat.name}
                            </Heading>
                            <Paragraph size="sm" color="muted">
                              {cat.age} · {cat.furLength} fur · {cat.pattern === "none" ? "solid" : cat.pattern}
                            </Paragraph>
                          </span>
                        </button>
                        <Button
                          variant="tertiary"
                          size="sm"
                          onClick={() => handleRemoveCat(cat.id)}
                          aria-label={`Remove ${cat.name}`}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </Stack>
              </Card>
            </Stack>
          )}

          {message && (
            <Card surface="panel" className="cl-message-card">
              <Paragraph>{message}</Paragraph>
            </Card>
          )}

          {cats.length === 0 && (
            <Banner status="info" title="Ready when you are">
              Create your first cat above to unlock the arena, animations, and roster.
            </Banner>
          )}
        </Stack>
      </Section>
    </main>
  )
}
