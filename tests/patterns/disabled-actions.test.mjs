import assert from 'node:assert/strict';
import test from 'node:test';
import { disabledControlProps } from '../../packages/react/src/components/button/disabledControlProps.js';
test('disabled anchor handlers suppress pointer, auxiliary and keyboard activation without calling the consumer', () => {
  let called = 0;
  const props = { href: '/account', onClick: () => called++, onClickCapture: () => called++, onAuxClick: () => called++, onKeyDown: () => called++ };
  const inert = disabledControlProps(true, props);
  for (const name of ['onClick', 'onClickCapture', 'onAuxClick', 'onKeyDown']) {
    let prevented = false;
    let stopped = false;
    inert[name]({ key: 'Enter', preventDefault: () => { prevented = true; }, stopPropagation: () => { stopped = true; } });
    assert.ok(prevented && stopped);
  }
  assert.equal(called, 0);
  assert.equal(inert.href, undefined);
  assert.equal(inert.role, 'link');
  assert.equal(inert.tabIndex, -1);
  assert.equal(props.href, '/account');
  assert.strictEqual(disabledControlProps(false, props), props);
});
