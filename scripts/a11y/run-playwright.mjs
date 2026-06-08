import { execSync } from 'child_process';

console.log('\nRunning Playwright accessibility tests (non-fatal)...\n');

try {
  execSync('npx playwright test --project=a11y', { stdio: 'inherit' });
  console.log('\n✅  Playwright a11y tests completed with no failures.\n');
} catch (err) {
  console.error('\n⚠️  Playwright a11y tests reported failures.');
  console.error('Reports are available; this run will not fail the process (warnings only).\n');
}

process.exit(0);
