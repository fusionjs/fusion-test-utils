import {mockContext, renderContext} from './mock-context.js';
import simulate from './simulate';

export function request(app, url, options = {}) {
  if (__BROWSER__) {
    throw new Error(
      '[fusion-test-utils] Request api not support from the browser. Please use `render` instead'
    );
  }
  const ctx = mockContext(url, options);
  return simulate(app, ctx);
}

export function render(app, url, options = {}) {
  const ctx = renderContext(url, options);
  return simulate(app, ctx);
}

let describe, it;
if (typeof jest !== 'undefined') {
  /* eslint-env jest, node */
  describe = global.describe;
  it = global.it;
} else {
  const notSupported = () => {
    throw new Error(
      'Can’t import test app helpers when not using the test-app target.'
    );
  };
  it = notSupported;
  describe = notSupported;
}
export {describe, it};
