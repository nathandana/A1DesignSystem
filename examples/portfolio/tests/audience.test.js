import test from "node:test";
import assert from "node:assert/strict";
import { resolveAudience, withAudience } from "../utils/audience.js";
import { audienceStudies } from "../data/portfolioAudiences.js";
import { pageFocus } from "../data/portfolioFocus.js";

test("hostname alone selects UX, with design systems everywhere else", () => {
  assert.equal(resolveAudience("nathan.a1design.app"), "ux");
  assert.equal(resolveAudience("NATHAN.A1DESIGN.APP."), "ux");
  for (const host of ["nathandana.a1design.app", "localhost", "127.0.0.1", "preview.netlify.app", "nathan.a1design.app.example.com", ""]) {
    assert.equal(resolveAudience(host), "systems");
  }
});

test("internal links preserve campaign parameters and fragments", () => {
  assert.equal(withAudience("/resume#skills", "ux", "?ref=job42&utm_source=resume&audience=systems"), "/resume?ref=job42&utm_source=resume#skills");
  assert.equal(withAudience("/", "general"), "/");
  assert.equal(withAudience("mailto:nathan@example.com", "ux"), "mailto:nathan@example.com");
  assert.equal(withAudience("https://example.com", "ux"), "https://example.com");
});

test("audience work includes shared projects in a deliberate order", () => {
  const studies = ["a1", "transform", "fondue", "member-menu", "carshopper", "filter", "composer"].map(id => ({ id, ...pageFocus[id] }));
  assert.deepEqual(audienceStudies(studies, "systems").map(s => s.id), ["fondue", "transform", "a1", "filter"]);
  assert.deepEqual(audienceStudies(studies, "ux").map(s => s.id), ["member-menu", "carshopper", "composer", "filter", "transform"]);
  assert.equal(audienceStudies(studies, "general").length, 7);
});
