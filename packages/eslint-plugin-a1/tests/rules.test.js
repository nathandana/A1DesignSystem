/**
 * RuleTester coverage for every eslint-plugin-a1 rule. Run with `node --test` (or
 * `npm test` in this package). Each block is one node:test; RuleTester.run throws on the
 * first mismatch, failing that test.
 */
import test from 'node:test';
import { RuleTester } from 'eslint';

import noUppercaseText from '../lib/rules/no-uppercase-text.js';
import noRawColor from '../lib/rules/no-raw-color.js';
import noNestedInteractiveInCard from '../lib/rules/no-nested-interactive-in-card.js';
import singlePrimaryButton from '../lib/rules/single-primary-button.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

test('no-uppercase-text', () => {
  ruleTester.run('no-uppercase-text', noUppercaseText, {
    valid: [
      // The one allowed transform: first-letter capitalisation → sentence case.
      'const x = s.charAt(0).toUpperCase() + s.slice(1);',
      'const x = s[0].toUpperCase() + s.slice(1);',
      'const x = s.slice(0, 1).toUpperCase() + s.slice(1);',
      'const x = s.at(0).toUpperCase() + s.slice(1);',
      // capitalize-first-letter via .replace() callback (regex matches a single char) — allowed
      'const x = s.replace(/^\\w/, (c) => c.toUpperCase());',
      'const x = s.replace(/\\b\\w/g, (c) => c.toUpperCase());',
      "const a = <div style={{ textTransform: 'none' }} />;",
      "const css = '.x { color: red; }';",
      // lowercasing is not the uppercase law's concern (normalization is fine)
      'const x = email.toLowerCase();',
    ],
    invalid: [
      { code: 'const x = label.toUpperCase();', errors: [{ messageId: 'toUpperCase' }] },
      { code: 'const x = "hi".toLocaleUpperCase();', errors: [{ messageId: 'toUpperCase' }] },
      { code: "const a = <div style={{ textTransform: 'uppercase' }} />;", errors: [{ messageId: 'textTransform' }] },
      { code: "const css = '.x { text-transform: capitalize; }';", errors: [{ messageId: 'textTransform' }] },
      { code: 'const css = `.x { text-transform: uppercase; }`;', errors: [{ messageId: 'textTransform' }] },
    ],
  });
});

test('no-raw-color', () => {
  ruleTester.run('no-raw-color', noRawColor, {
    valid: [
      "const a = <div style={{ color: 'var(--semantic-color-text-default)' }} />;",
      "const a = <div style={{ color: 'inherit' }} />;",
      "const s = { background: 'transparent' };",
      "const a = <div style={{ width: '#notacolor' }} />;", // width isn't a colour property
    ],
    invalid: [
      { code: "const a = <div style={{ color: '#fff' }} />;", errors: [{ messageId: 'rawColor' }] },
      { code: "const a = <div style={{ backgroundColor: 'rgb(0,0,0)' }} />;", errors: [{ messageId: 'rawColor' }] },
      { code: "const s = { border: '1px solid #ccc' };", errors: [{ messageId: 'rawColor' }] },
      { code: "const a = <div style={{ boxShadow: '0 0 0 2px #000000' }} />;", errors: [{ messageId: 'rawColor' }] },
    ],
  });
});

test('no-nested-interactive-in-card', () => {
  ruleTester.run('no-nested-interactive-in-card', noNestedInteractiveInCard, {
    valid: [
      'const a = <Card variant="navigation" href="/x"><Heading>Hi</Heading><Paragraph>Yo</Paragraph></Card>;',
      'const a = <Card><Button>Click</Button></Card>;', // not a navigation card
      'const a = <Card variant="navigation"><Stack><Icon name="star" /><Heading>Hi</Heading></Stack></Card>;',
    ],
    invalid: [
      { code: 'const a = <Card variant="navigation"><Button>Go</Button></Card>;', errors: [{ messageId: 'nested' }] },
      { code: 'const a = <Card href="/x"><a href="/y">link</a></Card>;', errors: [{ messageId: 'nested' }] },
      { code: 'const a = <Card variant="navigation"><div><TextField label="x" /></div></Card>;', errors: [{ messageId: 'nested' }] },
    ],
  });
});

test('single-primary-button', () => {
  ruleTester.run('single-primary-button', singlePrimaryButton, {
    valid: [
      'const a = <ButtonContainer><Button variant="secondary">Cancel</Button><Button>Save</Button></ButtonContainer>;',
      'const a = <ButtonContainer><Button>Only</Button></ButtonContainer>;',
      'const a = <Dialog><Button>Save</Button><Button variant="tertiary">More</Button></Dialog>;',
    ],
    invalid: [
      // Two default (=primary) buttons in one area.
      { code: 'const a = <ButtonContainer><Button>Save</Button><Button>Submit</Button></ButtonContainer>;', errors: [{ messageId: 'multiple' }] },
      { code: 'const a = <Dialog><Button variant="primary">A</Button><Button variant="primary">B</Button></Dialog>;', errors: [{ messageId: 'multiple' }] },
      { code: 'const a = <form><Button>A</Button><Button variant="primary">B</Button></form>;', errors: [{ messageId: 'multiple' }] },
    ],
  });
});
