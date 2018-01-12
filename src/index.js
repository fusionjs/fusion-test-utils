//@flow

import FusionApp from 'fusion-core';

import assert from 'assert';
import {mockContext, renderContext} from './mock-context.js';
import simulate from './simulate';

declare var __BROWSER__: boolean;

export function request(
  app: FusionApp,
  url: string,
  options: * = {}
): Promise<*> {
  if (__BROWSER__) {
    throw new Error(
      '[fusion-test-utils] Request api not support from the browser. Please use `render` instead'
    );
  }
  const ctx = mockContext(url, options);
  return simulate(app, ctx);
}

export function render(
  app: FusionApp,
  url: string,
  options: * = {}
): Promise<*> {
  const ctx = renderContext(url, options);
  return simulate(app, ctx);
}

// Export test runner functions from jest
// eslint-disable-next-line import/no-mutable-exports
let mockFunction, test;
// $FlowFixMe
if (typeof it !== 'undefined') {
  // Surface snapshot testing
  // $FlowFixMe
  assert.matchSnapshot = tree => expect(tree).toMatchSnapshot();

  /* eslint-env node, jest */
  // $FlowFixMe
  test = (description, callback, ...rest) =>
    it(description, () => callback(assert), ...rest);
  // $FlowFixMe
  mockFunction = (...args) => jest.fn(...args);
} else {
  const notSupported = () => {
    throw new Error('Can’t import test() when not using the test-app target.');
  };
  test = notSupported;
  mockFunction = notSupported;
}
export {mockFunction, test};
