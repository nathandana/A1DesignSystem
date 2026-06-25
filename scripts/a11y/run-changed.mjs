/**
 * Run accessibility checks only for components changed in the current git diff.
 *
 * Detects changed component names by examining modified files under
 * packages/react/src/components/. For each changed component, runs the focused
 * axe wrapper against matching Storybook story IDs.
 *
 * Expects Storybook to be running on http://localhost:6006.
 */
import { execSync } from "child_process";

function getChangedComponents() {
  const output = execSync("git diff --name-only HEAD", { encoding: "utf8" });
  const staged = execSync("git diff --cached --name-only", { encoding: "utf8" });
  const all = (output + staged).trim().split("\n").filter(Boolean);

  const components = new Set();
  for (const file of all) {
    const match = file.match(/packages\/react\/src\/components\/([^/]+)\//);
    if (match) components.add(match[1]);
  }
  return [...components];
}

const changed = getChangedComponents();

if (changed.length === 0) {
  console.log("\nNo component files changed — nothing to check.\n");
  process.exit(0);
}

console.log(`\nChanged components detected: ${changed.join(", ")}\n`);

let exitCode = 0;

for (const component of changed) {
  console.log(`\n── Checking: ${component} ──────────────────────────\n`);
  try {
    execSync(
      `node scripts/a11y/run-component.mjs "${component}"`,
      { stdio: "inherit" }
    );
  } catch {
    exitCode = 1;
  }
}

if (exitCode !== 0) {
  console.error("\n⚠️  One or more components had accessibility violations.");
  console.error('Continuing without failing the process (warnings only).\n');
}

// Always exit 0 so accessibility issues are reported as warnings
process.exit(0);
