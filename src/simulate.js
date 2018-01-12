// @flow

// $FlowFixMe
import FusionApp, {compose} from 'fusion-core';
import type {Context} from 'fusion-core';

export default function simulate(app: FusionApp, ctx: Context): Promise<*> {
  app.resolve();
  return compose(app.plugins)(ctx, () => Promise.resolve()).then(() => ctx);
}
