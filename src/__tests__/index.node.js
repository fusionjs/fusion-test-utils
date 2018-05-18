/** Copyright (c) 2018 Uber Technologies, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import test from 'tape-cup';
import App from 'fusion-core';

import {getSimulator} from '../index.js';

test('status is 404 if ctx.body is never updated', async t => {
  const ctx = await getSimulator(() => new App('el', el => el)).request('/');
  t.equals(ctx.status, 404, 'status defaults to 404');
  t.end();
});

test('status is 200 if ctx.body is updated in request', async t => {
  const appCreator = () => {
    const app = new App('el', el => el);
    app.middleware((ctx, next) => {
      ctx.body = {ok: 1};
      return next();
    });
    return app;
  };
  const ctx = await getSimulator(appCreator).request('/');
  t.equals(ctx.status, 200, 'status defaults to 200');
  t.end();
});

test('status is set if ctx.status is updated in request', async t => {
  const appCreator = () => {
    const app = new App('el', () => 'hello');
    app.middleware((ctx, next) => {
      ctx.status = 500;
      ctx.body = {error: 'error'};
      return next();
    });
    return app;
  };
  const ctx = await getSimulator(appCreator).render('/');
  t.equals(ctx.status, 500, 'status is set');
  t.end();
});

test('status is 200 if ctx.body is updated in render', async t => {
  const ctx = await getSimulator(() => new App('el', () => 'hello')).render(
    '/'
  );
  t.equals(ctx.status, 200, 'status defaults to 200');
  t.end();
});

test('status is set if ctx.status is updated in render', async t => {
  const appCreator = () => {
    const app = new App('el', () => 'hello');
    app.middleware((ctx, next) => {
      ctx.status = 500;
      return next();
    });
    return app;
  };
  const ctx = await getSimulator(appCreator).render('/');
  t.equals(ctx.status, 500, 'status is set');
  t.end();
});
