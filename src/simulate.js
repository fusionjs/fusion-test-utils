/** Copyright (c) 2018 Uber Technologies, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import FusionApp, {compose} from 'fusion-core';
import type {Context} from 'fusion-core';

import {mockContext, renderContext} from './mock-context.js';

export const request = (app: FusionApp) => (
  url: string,
  options: * = {}
): Promise<*> => {
  if (__BROWSER__) {
    throw new Error(
      '[fusion-test-utils] Request api not support from the browser. Please use `render` instead'
    );
  }
  const ctx = mockContext(url, options);
  return simulate(app, ctx);
};

export const render = (app: FusionApp) => (
  url: string,
  options: * = {}
): Promise<*> => {
  const ctx = renderContext(url, options);
  return simulate(app, ctx);
};

export default function simulate(app: FusionApp, ctx: Context): Promise<*> {
  return compose(app.plugins)(ctx, () => Promise.resolve()).then(() => ctx);
}
