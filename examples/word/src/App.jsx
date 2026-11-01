import React, { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import {
  Banner,
  Card,
  DataTable,
  DefinitionList,
  Divider,
  Grid,
  GridItem,
  Heading,
  IconButton,
  MessageBadge,
  MessageEmptyState,
  Paragraph,
  Section,
  Stack,
  TextField,
  Tooltip,
} from "../../../packages/react/src/index.js";
import wordListUrl from "./data/enable1.txt?url";
import { BINGO_BONUS, normalizeBoardLetters, normalizeRack, parseWordList, solve } from "./lib/solver.js";

// Typing aids that keep mobile keyboards from "correcting" a rack of tiles.
const TILE_INPUT_PROPS = {
  // Shown in capitals by styles.css.
  "data-word-tiles": "",
  autoComplete: "off",
  autoCapitalize: "none",
  autoCorrect: "off",
  spellCheck: false,
};

const COLUMNS = [
  {
    key: "word",
    label: "Word",
    sortable: true,
    // One step above the compact table's body-xs text, so the word stands out.
    renderCell: ({ value }) => (
      <Paragraph as="span" size="sm" weight="bold" className="word-result">
        {value}
      </Paragraph>
    ),
  },
  { key: "points", label: "Points", type: "number", align: "end", sortable: true },
  { key: "length", label: "Letters", type: "number", align: "end", sortable: true },
  {
    key: "notes",
    label: "Notes",
    renderCell: ({ row }) => <ResultNotes result={row} />,
  },
];

function ResultNotes({ result }) {
  if (!result.bingo && !result.blankLetters) return null;
  return (
    <Stack direction="row" wrap gap="xs">
      {result.bingo && (
        <MessageBadge status="success" size="sm">
          Bingo
        </MessageBadge>
      )}
      {result.blankLetters && (
        <MessageBadge status="neutral" subtle size="sm" icon={null}>
          Blank: {result.blankLetters.split("").join(", ")}
        </MessageBadge>
      )}
    </Stack>
  );
}

function useWordList() {
  const [state, setState] = useState({ words: null, error: null });

  useEffect(() => {
    let cancelled = false;
    fetch(wordListUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then((text) => {
        if (!cancelled) setState({ words: parseWordList(text), error: null });
      })
      .catch((error) => {
        if (!cancelled) setState({ words: null, error });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

const TILE_KEY = /^[a-z?*]$/i;

function isEditable(element) {
  return Boolean(element?.closest?.("input, textarea, select, [contenteditable='true']"));
}

// Typing a tile while nothing editable has focus (for example after clicking
// a result) sends the keystroke to the letters field. Focusing during keydown
// lets the browser insert the character into the newly focused input.
function useTypeToFocus(inputRef) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      if (!TILE_KEY.test(event.key) || isEditable(document.activeElement)) return;
      inputRef.current?.focus();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [inputRef]);
}

// A1's lg breakpoint starts at 1025px (system/tokens/breakpoint.json).
const LG_UP = "(min-width: 1025px)";

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);
    update();
    list.addEventListener("change", update);
    return () => list.removeEventListener("change", update);
  }, [query]);
  return matches;
}

export function App() {
  const { words, error } = useWordList();
  const [rack, setRack] = useState("");
  const [startsWith, setStartsWith] = useState("");
  const [contains, setContains] = useState("");
  const [endsWith, setEndsWith] = useState("");
  const rackRef = useRef(null);
  useTypeToFocus(rackRef);
  // From lg up, search sits in a card beside the results; below lg it stacks above them.
  const sideBySide = useMediaQuery(LG_UP);
  const boardFieldSize = sideBySide ? "comfortable" : "compact";

  const tiles = normalizeRack(rack);
  const deferredTiles = useDeferredValue(tiles);
  const board = useMemo(() => ({ startsWith, contains, endsWith }), [startsWith, contains, endsWith]);
  const deferredBoard = useDeferredValue(board);

  const results = useMemo(
    () => (words ? solve(words, deferredTiles, deferredBoard) : []),
    [words, deferredTiles, deferredBoard],
  );
  const resultsKey = [deferredTiles, deferredBoard.startsWith, deferredBoard.contains, deferredBoard.endsWith].join("|");

  const hasInput = tiles.length > 0;
  const best = results[0];

  let status = "";
  if (error) status = "The word list could not be loaded.";
  else if (!words) status = "Loading word list…";
  else if (hasInput) status = `${results.length.toLocaleString()} ${results.length === 1 ? "word" : "words"} found`;

  function reset() {
    setRack("");
    setStartsWith("");
    setContains("");
    setEndsWith("");
    rackRef.current?.focus();
  }

  const search = (
    <Stack gap="md">
      <Stack direction="row" justify="between" align="center" gap="sm">
        <Heading as="h1" size="xl">
          Word finder
        </Heading>
        <Tooltip content="Reset" placement="left">
          <IconButton icon="restart_alt" label="Reset" variant="secondary" onClick={reset} />
        </Tooltip>
      </Stack>

      <form role="search" aria-label="Find words" onSubmit={(event) => event.preventDefault()}>
        <Stack gap="md">
          <TextField
            ref={rackRef}
            label="Your letters"
            size="comfortable"
            value={rack}
            onChange={(event) => setRack(normalizeRack(event.target.value))}
            enterKeyHint="search"
            autoFocus
            {...TILE_INPUT_PROPS}
          />
          {/* Stacked at full card width from lg up; three across below lg. */}
          <Grid columns={sideBySide ? 1 : 3} gap={sideBySide ? "md" : "sm"} role="group" aria-label="Letters on the board">
            <TextField
              label="Starts with"
              size={boardFieldSize}
              value={startsWith}
              onChange={(event) => setStartsWith(normalizeBoardLetters(event.target.value))}
              enterKeyHint="search"
              {...TILE_INPUT_PROPS}
            />
            <TextField
              label="Contains"
              size={boardFieldSize}
              value={contains}
              onChange={(event) => setContains(normalizeBoardLetters(event.target.value))}
              enterKeyHint="search"
              {...TILE_INPUT_PROPS}
            />
            <TextField
              label="Ends with"
              size={boardFieldSize}
              value={endsWith}
              onChange={(event) => setEndsWith(normalizeBoardLetters(event.target.value))}
              enterKeyHint="search"
              {...TILE_INPUT_PROPS}
            />
          </Grid>
        </Stack>
      </form>
    </Stack>
  );

  return (
    <main>
      <Section padding={{ xs: "sm", md: "md" }} contentWidth="xl">
        <Grid columns={{ xs: 1, lg: 3 }} gap="lg" alignItems="start">
          <GridItem>{sideBySide ? <Card>{search}</Card> : search}</GridItem>

          <GridItem span={{ lg: 2 }}>
            <Stack gap="md">
              {!sideBySide && <Divider space="none" />}

              {/* Announced to screen readers only; the results speak for themselves visually. */}
              <Paragraph role="status" aria-live="polite" className="a1-sr-only">
                {status}
              </Paragraph>

              {error ? (
                <Banner status="error" title="The word list could not be loaded">
                  Check your connection and reload the page.
                </Banner>
              ) : !hasInput ? (
                <MessageEmptyState
                  scale="section"
                  icon="abc"
                  title="Enter your letters"
                  description="Words you can play appear here, sorted by points."
                />
              ) : best ? (
                <>
                  <DefinitionList
                    items={[
                      {
                        label: "Best word",
                        value: (
                          <Stack direction="row" wrap gap="xs" align="center">
                            <span>
                              <strong className="word-result">{best.word}</strong>, {best.points} points
                            </span>
                            {best.bingo && (
                              <MessageBadge status="success" size="sm">
                                Bingo
                              </MessageBadge>
                            )}
                          </Stack>
                        ),
                      },
                    ]}
                  />

                  <DataTable
                    key={resultsKey}
                    caption="Playable words"
                    columns={COLUMNS}
                    rows={results}
                    defaultSort={{ key: "points", direction: "desc" }}
                    defaultPageSize={25}
                    pageSizeOptions={[25, 50, 100]}
                    mobileLayout="table"
                    size="compact"
                  />
                </>
              ) : null}

              <Paragraph size="sm" color="muted">
                Scores are tile values before board bonuses; using all 7 tiles adds {BINGO_BONUS} points.
                Words come from the public-domain ENABLE list, which is close to, but not the same as,
                official tournament dictionaries.
              </Paragraph>
            </Stack>
          </GridItem>
        </Grid>
      </Section>
    </main>
  );
}
