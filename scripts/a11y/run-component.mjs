/**
 * Run accessibility checks for a single component by name.
 *
 * Usage: node scripts/a11y/run-component.mjs <component-name>
 * Example: node scripts/a11y/run-component.mjs menu
 *
 * Expects Storybook to be running on http://localhost:6006.
 * Runs test-storybook, filtering to stories whose ID contains the component name.
 */
import { execSync } from "child_process";

const component = process.argv[2];

if (!component) {
  console.error("Usage: node scripts/a11y/run-component.mjs <component-name>");
  console.error("Example: node scripts/a11y/run-component.mjs menu");
  process.exit(1);
}

// Story IDs follow the pattern: components-{category}-{component-name}--{story-name}
// The filter regex matches any story whose ID contains the component slug.
const filter = component.toLowerCase().replace(/\s+/g, "-");

console.log(`\nRunning a11y checks for component: ${component}\n`);

try {
  execSync(
    `test-storybook --url http://localhost:6006 --testTimeout=60000 --testNamePattern "${filter}"`,
    { stdio: "inherit" }
  );
} catch {
  process.exit(1);
}
