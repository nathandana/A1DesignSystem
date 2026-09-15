import assert from 'node:assert/strict';
import test from 'node:test';
import { buttonNodeFromFigma } from '../src/shared/codegen.js';

test('shared Button serializer omits A1 defaults', () => {
  assert.deepEqual(buttonNodeFromFigma({
    id: '42:7',
    properties: {
      Variant: { value: 'primary' },
      Size: { value: 'md' },
      State: { value: 'default' },
      'Show icon': { value: false },
    },
    label: 'Continue',
  }), {
    id: 'button-42-7',
    type: 'Button',
    content: { fallback: 'Continue' },
  });
});

test('shared Button serializer emits live non-default properties', () => {
  assert.deepEqual(buttonNodeFromFigma({
    id: '42:8',
    properties: {
      Variant: { value: 'secondary' },
      Size: { value: 'lg' },
      State: { value: 'disabled' },
      'Show icon': { value: true },
      'Icon position': { value: 'end' },
    },
    label: 'Open dialog',
    iconName: 'open_in_new',
    fullWidth: true,
  }), {
    id: 'button-42-8',
    type: 'Button',
    props: {
      variant: 'secondary',
      size: 'lg',
      disabled: true,
      fullWidth: true,
      icon: 'open_in_new',
      iconPosition: 'end',
    },
    content: { fallback: 'Open dialog' },
  });
});

test('shared Button serializer accepts the POC boolean state properties', () => {
  assert.deepEqual(buttonNodeFromFigma({
    id: '42:9',
    properties: {
      Variant: { value: 'success' },
      Size: { value: 'sm' },
      Disabled: { value: true },
      Loading: { value: 'true' },
    },
    label: 'Saved',
  }), {
    id: 'button-42-9',
    type: 'Button',
    props: {
      variant: 'success',
      size: 'sm',
      disabled: true,
      loading: true,
    },
    content: { fallback: 'Saved' },
  });
});

test('shared Button serializer maps the POC loading state to the developed prop', () => {
  assert.deepEqual(buttonNodeFromFigma({
    id: '42:10',
    properties: {
      Variant: { value: 'tertiary' },
      Size: { value: 'lg' },
      State: { value: 'loading' },
      'Show icon': { value: true },
      IconPosition: { value: 'end' },
    },
    label: 'Saving…',
    iconName: 'arrow_forward',
  }), {
    id: 'button-42-10',
    type: 'Button',
    props: {
      variant: 'tertiary',
      size: 'lg',
      loading: true,
      icon: 'arrow_forward',
      iconPosition: 'end',
    },
    content: { fallback: 'Saving…' },
  });
});
