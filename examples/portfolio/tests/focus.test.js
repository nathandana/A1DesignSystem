import test from "node:test";
import assert from "node:assert/strict";
import {
  filterByFocus,
  focusAttributes,
  getContentFocus,
  matchesFocus,
  normalizeFocus,
} from "../utils/focus.js";
import { getPageFocus, pageFocusAliases } from "../data/portfolioFocus.js";
import { resumeVersions } from "../data/resumeVersions.js";
import { testimonials } from "../data/testimonials.js";
import { processSteps } from "../data/processSteps.js";

test("both, inherited, and overridden relevance remain distinct", () => {
  assert.deepEqual(getContentFocus(), ["ux", "ds"]);
  assert.deepEqual(getContentFocus({}, ["ds"]), ["ds"]);
  assert.deepEqual(getContentFocus({ focus: ["ux"] }, ["ds"]), ["ux"]);
  assert.equal(matchesFocus({}, "ux"), true);
  assert.equal(matchesFocus({}, "ux", ["ds"]), false);
  for (const focus of [[], ["systems"], ["other"], "ds"]) {
    assert.throws(() => getContentFocus({ focus }), TypeError);
  }
});

test("audience compatibility and invalid selection keep content available", () => {
  assert.equal(normalizeFocus("systems"), "ds");
  for (const value of [undefined, "all", "unknown"]) {
    assert.equal(matchesFocus({ focus: ["ds"] }, value), true);
  }
});

test("filtering preserves shared content, order and source data", () => {
  const items = Object.freeze([
    Object.freeze({ id: "ux", focus: ["ux"] }),
    Object.freeze({ id: "shared", focus: ["ux", "ds"] }),
    Object.freeze({ id: "ds", focus: ["ds"] }),
  ]);
  assert.deepEqual(
    filterByFocus(items, "systems").map((item) => item.id),
    ["shared", "ds"],
  );
  assert.deepEqual(
    filterByFocus(items, "ux").map((item) => item.id),
    ["ux", "shared"],
  );
  assert.deepEqual(filterByFocus(items), items);
});

test("alternate routes resolve to their original focus and unknown pages remain shared", () => {
  for (const [alias, page] of Object.entries(pageFocusAliases)) {
    assert.deepEqual(getPageFocus(alias), getPageFocus(page));
  }
  assert.deepEqual(getPageFocus("new-page").focus, ["ux", "ds"]);
  assert.deepEqual(focusAttributes(getPageFocus("fondue-alternate")), { "data-portfolio-focus": "ds" });
});

test("both resume versions and content collections carry valid metadata", () => {
  assert.equal(matchesFocus(resumeVersions.systems, "ux"), false);
  assert.equal(matchesFocus(resumeVersions.ux, "ds"), false);
  for (const item of [...testimonials, ...processSteps]) {
    assert.ok(item.focus);
    assert.doesNotThrow(() => getContentFocus(item));
  }
});
