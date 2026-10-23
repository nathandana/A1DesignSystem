// Word solver: finds dictionary words that can be built from a rack of tiles
// plus an optional letter already on the board, scored with standard tile
// values. Pure functions only so the logic can be tested in Node.

export const TILE_VALUES = {
  a: 1, b: 3, c: 3, d: 2, e: 1, f: 4, g: 2, h: 4, i: 1, j: 8, k: 5, l: 1, m: 3,
  n: 1, o: 1, p: 3, q: 10, r: 1, s: 1, t: 1, u: 1, v: 4, w: 4, x: 8, y: 4, z: 10,
};

export const BLANK = "?";
export const BOARD_SIZE = 15;
export const RACK_SIZE = 7;
export const BINGO_BONUS = 50;
export const MIN_WORD_LENGTH = 2;

const A = "a".charCodeAt(0);
const VALUES = Object.values(TILE_VALUES);

/** Keep letters and blanks; `*` is accepted as a blank tile. */
export function normalizeRack(input) {
  return String(input ?? "")
    .toLowerCase()
    .replace(/\*/g, BLANK)
    .replace(/[^a-z?]/g, "")
    .slice(0, BOARD_SIZE - 1);
}

/** Board letters are real tiles, typed in the order they appear on the board. */
export function normalizeBoardLetters(input) {
  return String(input ?? "").toLowerCase().replace(/[^a-z]/g, "").slice(0, BOARD_SIZE - 1);
}

/** Split a newline-delimited word list, keeping words that fit on the board. */
export function parseWordList(text) {
  return text
    .split(/\r?\n/)
    .map((word) => word.trim().toLowerCase())
    .filter((word) => word.length >= MIN_WORD_LENGTH && word.length <= BOARD_SIZE && /^[a-z]+$/.test(word));
}

/**
 * Return every playable word, sorted by points (high to low), then length,
 * then alphabetically.
 *
 * - `rack` letters may include `?` blanks, which score 0.
 * - `board` letters are tiles already on the board. They score their face
 *   value but are not rack tiles. Each group is a run of adjacent letters:
 *   `startsWith` begins the word, `endsWith` ends it, and `contains` sits
 *   anywhere between them.
 * - A word must use at least one rack tile.
 * - Using all 7 rack tiles adds the 50-point bingo bonus.
 *
 * Scores are face values before board multipliers.
 */
export function solve(words, rack, board = {}) {
  const tiles = normalizeRack(rack);
  const prefix = normalizeBoardLetters(board.startsWith);
  const middle = normalizeBoardLetters(board.contains);
  const suffix = normalizeBoardLetters(board.endsWith);
  if (!tiles) return [];

  const pool = new Int8Array(26);
  let blanks = 0;
  for (const tile of tiles) {
    if (tile === BLANK) blanks += 1;
    else pool[tile.charCodeAt(0) - A] += 1;
  }

  const boardLetters = prefix + middle + suffix;
  for (const letter of boardLetters) pool[letter.charCodeAt(0) - A] += 1;

  const minLength = Math.max(MIN_WORD_LENGTH, boardLetters.length + 1);
  const maxLength = tiles.length + boardLetters.length;
  const isFullRack = tiles.length === RACK_SIZE;
  const available = new Int8Array(26);
  const results = [];

  for (const word of words) {
    const { length } = word;
    if (length < minLength || length > maxLength) continue;
    if (prefix && !word.startsWith(prefix)) continue;
    if (suffix && !word.endsWith(suffix)) continue;
    if (middle && !word.slice(prefix.length, length - suffix.length).includes(middle)) continue;

    available.set(pool);
    let blanksLeft = blanks;
    let points = 0;
    let blankLetters = "";
    let playable = true;

    // Board letters are in the pool, so any shortfall is a letter only a
    // blank can supply; which occurrence takes the blank doesn't change the score.
    for (let i = 0; i < length; i += 1) {
      const index = word.charCodeAt(i) - A;
      if (available[index] > 0) {
        available[index] -= 1;
        points += VALUES[index];
      } else if (blanksLeft > 0) {
        blanksLeft -= 1;
        blankLetters += word[i];
      } else {
        playable = false;
        break;
      }
    }

    if (!playable) continue;

    const tilesUsed = length - boardLetters.length;
    const bingo = isFullRack && tilesUsed === RACK_SIZE;
    results.push({
      id: word,
      word,
      points: points + (bingo ? BINGO_BONUS : 0),
      length,
      bingo,
      blankLetters,
    });
  }

  return results.sort(
    (a, b) => b.points - a.points || b.length - a.length || a.word.localeCompare(b.word),
  );
}
