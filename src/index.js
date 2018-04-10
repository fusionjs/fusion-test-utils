/** Copyright (c) 2018 Uber Technologies, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import assert from 'assert';

import FusionApp from 'fusion-core';
import type {FusionPlugin} from 'fusion-core';

/* Note: as the Jest type definitions are declared globally and not as part of
 * a module, we must import the relevant types directly from the libdef file here
 * to avoid the invariant that all consumers must add the jest libdef to their
 * .flowconfig libs.
 */
import type {JestTestName, JestObjectType} from './flow/jest_v22.x.x.js';

import {render, request} from './simulate';

declare var __BROWSER__: boolean;

type ExtractFusionAppReturnType = <R>((FusionApp) => R) => R;
export type Simulator = {
  request: $Call<ExtractFusionAppReturnType, typeof request>,
  render: $Call<ExtractFusionAppReturnType, typeof render>,
};
export function getSimulator(
  app: FusionApp,
  testPlugin?: FusionPlugin<*, *>
): Simulator {
  if (testPlugin) {
    app.register(testPlugin);
  }
  app.resolve();

  return {
    request: request(app),
    render: render(app),
  };
}

// Export test runner functions from jest
type ExtractArgsReturnType<TArguments, TReturn> = <R>(
  (implementation?: (...args: TArguments) => TReturn) => R
) => R;
type JestFnType = $PropertyType<JestObjectType, 'fn'>;
// eslint-disable-next-line flowtype/generic-spacing
type MockFunctionType<TArgs, TReturn> = () => $Call<
  ExtractArgsReturnType<TArgs, TReturn>,
  JestFnType
>;
type MatchSnapshotType = mixed => void;
type CallableAssertType = (
  assert: typeof assert & {matchSnapshot: MatchSnapshotType}
) => void;
type TestType = {
  (name: JestTestName, assert: CallableAssertType): void,
};

// eslint-disable-next-line import/no-mutable-exports
let mockFunction: MockFunctionType<*, *>, test: any;
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
  // $FlowFixMe
  test = notSupported;
  mockFunction = notSupported;
}

const mockFunctionExport = ((mockFunction: any): MockFunctionType<*, *>);
const testExport = ((test: any): TestType);

export {mockFunctionExport as mockFunction, testExport as test};
