import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { normalizeBoardLetters, normalizeRack, parseWordList, solve } from "../src/lib/solver.js";

const WORDS = ["at", "cat", "act", "tac", "scat", "cats", "acts", "zax", "xi", "quiz", "a", "catsup"];

test("normalizes input", () => {
  assert.equal(normalizeRack("C a*t 1?"), "ca?t?");
  assert.equal(normalizeBoardLetters("I-n G"), "ing");
  assert.deepEqual(parseWordList("Cat\r\na\nzax\nbad-word\n"), ["cat", "zax"]);
});

test("finds rack words sorted by points", () => {
  const words = solve(WORDS, "cat").map((r) => r.word);
  assert.deepEqual(words, ["act", "cat", "tac", "at"]);
});

test("containing letters must appear and score their value", () => {
  const results = solve(WORDS, "cat", { contains: "s" });
  assert.deepEqual(results.map((r) => r.word), ["acts", "cats", "scat"]);
  assert.equal(results[0].points, 6);
});

test("containing letters are a run of adjacent letters", () => {
  const words = ["sting", "singe", "tings"];
  assert.deepEqual(solve(words, "st", { contains: "ing" }).map((r) => r.word), ["sting", "tings"]);
});

test("starting and ending letters anchor the word", () => {
  const words = ["redo", "rode", "doer", "reread", "tread", "read"];
  assert.deepEqual(solve(words, "od", { startsWith: "re" }).map((r) => r.word), ["redo"]);
  assert.deepEqual(solve(words, "tr", { endsWith: "ead" }).map((r) => r.word), ["tread", "read"]);
  assert.deepEqual(solve(words, "a", { startsWith: "re", endsWith: "d" }).map((r) => r.word), ["read"]);
});

test("board letter groups do not overlap", () => {
  // "read" can't start with "re" and also contain a separate "e" between the anchors.
  assert.deepEqual(solve(["read", "reed"], "a", { startsWith: "re", contains: "e", endsWith: "d" }), []);
  assert.deepEqual(solve(["reread"], "ra", { startsWith: "re", contains: "e", endsWith: "d" }).map((r) => r.word), ["reread"]);
});

test("blanks score zero and are reported", () => {
  const [top] = solve(WORDS, "qu?z");
  assert.equal(top.word, "quiz");
  assert.equal(top.points, 21);
  assert.equal(top.blankLetters, "i");
});

test("a word must use at least one rack tile", () => {
  assert.deepEqual(solve(["s", "as"], "a", { contains: "s" }).map((r) => r.word), ["as"]);
  assert.deepEqual(solve(["redo"], "", { startsWith: "redo" }), []);
  assert.deepEqual(solve(["redo"], "x", { startsWith: "redo" }), []);
  assert.deepEqual(solve(WORDS, ""), []);
});

test("using all seven tiles adds the bingo bonus", () => {
  const [top] = solve(["catsups", "cat"], "catsups");
  assert.equal(top.bingo, true);
  assert.equal(top.points, 3 + 1 + 1 + 1 + 1 + 3 + 1 + 50);
  // Board letters don't count toward the seven.
  const [withBoard] = solve(["recatsups"], "catsups", { startsWith: "re" });
  assert.equal(withBoard.bingo, true);
});

test("solves against the full dictionary quickly", () => {
  const text = readFileSync(new URL("../src/data/enable1.txt", import.meta.url), "utf8");
  const words = parseWordList(text);
  const start = performance.now();
  const results = solve(words, "retains", { contains: "d" });
  assert.ok(performance.now() - start < 500);
  assert.ok(results.every((r) => r.word.includes("d")));
  const strained = results.find((r) => r.word === "strained");
  assert.equal(strained.bingo, true);
  assert.equal(results[0].bingo, true);
});
