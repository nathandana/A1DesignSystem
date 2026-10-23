import React, { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import {
  Banner,
  Button,
  Card,
  DataTable,
  FieldRow,
  Fieldset,
  Grid,
  Heading,
  MessageBadge,
  MessageEmptyState,
  Paragraph,
  Section,
  Stack,
  Stat,
  TextField,
} from "../../../packages/react/src/index.js";
import wordListUrl from "./data/enable1.txt?url";
import { BINGO_BONUS, normalizeBoardLetters, normalizeRack, parseWordList, solve } from "./lib/solver.js";

// Typing aids that keep mobile keyboards from "correcting" a rack of tiles.
const TILE_INPUT_PROPS = {
  autoComplete: "off",
  autoCapitalize: "none",
  autoCorrect: "off",
  spellCheck: false,
};

const COLUMNS = [
  { key: "word", label: "Word", sortable: true, searchable: true },
  { key: "points", label: "Points", type: "number", align: "end", sortable: true },
  { key: "length", label: "Letters", type: "number", align: "end", sortable: true, filterable: true },
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

export function App() {
  const { words, error } = useWordList();
  const [rack, setRack] = useState("");
  const [startsWith, setStartsWith] = useState("");
  const [contains, setContains] = useState("");
  const [endsWith, setEndsWith] = useState("");
  const rackRef = useRef(null);
  useTypeToFocus(rackRef);

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

  return (
    <main>
      <Section surface="panel" padding={{ xs: "sm", md: "md" }} contentWidth="md">
        <Stack gap="lg">
          <Stack gap="xs">
            <Heading as="h1" size="xl">
              Word finder
            </Heading>
            <Paragraph color="muted">
              Type the tiles on your rack. To build on the board, add the letters your word starts
              with, contains or ends with. Every word you can make is listed, highest score first.
            </Paragraph>
          </Stack>

          <form role="search" aria-label="Find words" onSubmit={(event) => event.preventDefault()}>
            <Stack gap="md">
              <TextField
                ref={rackRef}
                label="Your letters"
                hint="Use ? or * for a blank tile."
                size="comfortable"
                value={rack}
                onChange={(event) => setRack(normalizeRack(event.target.value))}
                enterKeyHint="search"
                autoFocus
                {...TILE_INPUT_PROPS}
              />
              <Fieldset legend="Letters on the board" size="comfortable">
                <FieldRow>
                  <TextField
                    label="Starting letters"
                    hint="The word starts with these."
                    value={startsWith}
                    onChange={(event) => setStartsWith(normalizeBoardLetters(event.target.value))}
                    enterKeyHint="search"
                    {...TILE_INPUT_PROPS}
                  />
                  <TextField
                    label="Containing letters"
                    hint="In a row, anywhere in the word."
                    value={contains}
                    onChange={(event) => setContains(normalizeBoardLetters(event.target.value))}
                    enterKeyHint="search"
                    {...TILE_INPUT_PROPS}
                  />
                  <TextField
                    label="Ending letters"
                    hint="The word ends with these."
                    value={endsWith}
                    onChange={(event) => setEndsWith(normalizeBoardLetters(event.target.value))}
                    enterKeyHint="search"
                    {...TILE_INPUT_PROPS}
                  />
                </FieldRow>
              </Fieldset>
              <Stack direction="row" wrap>
                <Button type="button" variant="secondary" icon="restart_alt" onClick={reset}>
                  Reset
                </Button>
              </Stack>
            </Stack>
          </form>
        </Stack>
      </Section>

      <Section padding={{ xs: "sm", md: "md" }} contentWidth="md">
        <Stack gap="lg">
          <Paragraph role="status" aria-live="polite" size="sm" color="muted">
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
          ) : words && results.length === 0 ? (
            <MessageEmptyState
              scale="section"
              icon="search_off"
              title="No words found"
              description="Try different letters, add a blank, or remove some board letters."
            />
          ) : best ? (
            <>
              <Grid columns={{ xs: 1, sm: 2 }} gap="md">
                <Card>
                  <Stat
                    title="Best word"
                    icon="emoji_events"
                    value={best.word}
                    format="none"
                    description={`${best.points} points`}
                    badge={best.bingo ? "Bingo" : undefined}
                    badgeStatus="success"
                  />
                </Card>
                <Card>
                  <Stat
                    title="Words found"
                    icon="format_list_numbered"
                    value={results.length}
                    description={`Up to ${results.reduce((max, r) => Math.max(max, r.length), 0)} letters long`}
                  />
                </Card>
              </Grid>

              <DataTable
                key={resultsKey}
                caption="Playable words"
                columns={COLUMNS}
                rows={results}
                defaultSort={{ key: "points", direction: "desc" }}
                defaultPageSize={25}
                pageSizeOptions={[25, 50, 100]}
                mobileLayout="table"
              />
            </>
          ) : null}

          <Paragraph size="sm" color="muted">
            Scores are tile values before board bonuses; using all 7 tiles adds {BINGO_BONUS} points.
            Words come from the public-domain ENABLE list, which is close to, but not the same as,
            official tournament dictionaries.
          </Paragraph>
        </Stack>
      </Section>
    </main>
  );
}
