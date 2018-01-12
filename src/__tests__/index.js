import test from 'tape-cup';
import App from 'fusion-core';

import {registerAsTest, test as exportedTest} from '../index.js';

test('simulate render request', async t => {
  const flags = {render: false};
  const element = 'hi';
  const renderFn = () => {
    flags.render = true;
  };
  const app = new App(element, renderFn);
  var testApp = registerAsTest(app);
  const ctx = await testApp.render('/');
  t.ok(flags.render, 'triggered ssr');
  t.ok(ctx.element, 'sets ctx.element');
  t.end();
});

test('simulate multi-render requests', async t => {
  const counter = {renderCount: 0};
  const renderFn = () => {
    counter.renderCount++;
  };
  const app = new App('hello', renderFn);
  var testApp = registerAsTest(app);

  for (var i = 1; i <= 5; i++) {
    await testApp.render('/');
    t.equal(counter.renderCount, i, `#${i} ssr render successful`);
  }

  t.end();
});

test('simulate non-render request', async t => {
  const flags = {render: false};
  const element = 'hi';
  const renderFn = () => {
    flags.render = true;
  };
  const app = new App(element, renderFn);
  const testApp = registerAsTest(app);
  if (__BROWSER__) {
    try {
      testApp.request('/');
      t.fail('should have thrown');
    } catch (e) {
      t.ok(e, 'throws an error');
    } finally {
      t.end();
    }
  } else {
    const ctx = testApp.request('/');
    t.notok(ctx.element, 'does not set ctx.element');
    t.ok(!flags.render, 'did not trigger ssr');
    t.end();
  }
});

test('test throws when not using test-app', async t => {
  try {
    exportedTest();
  } catch (e) {
    t.ok(
      e.message.includes('test-app'),
      'throws an error about running test-app'
    );
    t.end();
  }
});
