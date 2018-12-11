/** Copyright (c) 2018 Uber Technologies, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

/* eslint-env node */

import {parse} from 'url';
import type {Context} from 'fusion-core';

declare var __BROWSER__: boolean;

type ContextOptions = {|
  headers?: {[key: string]: string},
  body?: mixed,
  method?: string,
|};

const defaultContextOptions: ContextOptions = {
  headers: {},
};

export function createRequestContext(
  url: string,
  options?: ContextOptions = defaultContextOptions
): Context {
  if (__BROWSER__) {
    const parsedUrl = {...parse(url)};
    const {path} = parsedUrl;
    parsedUrl.path = parsedUrl.pathname;
    //$FlowFixMe
    parsedUrl.url = path;
    //$FlowFixMe
    return {parsedUrl};
  }
  const httpMocks = require('node-mocks-http');
  const Stream = require('stream');
  const Koa = require('koa');
  let req = httpMocks.createRequest({url, ...options});
  let res = httpMocks.createResponse();

  /**
   * Copied from https://github.com/koajs/koa/blob/master/test/helpers/context.js
   * Copyright (c) 2016 Koa contributors
   * MIT License
   * https://github.com/koajs/koa/blob/master/LICENSE
   */
  const socket = new Stream.Duplex();
  //$FlowFixMe
  req = Object.assign({headers: {}, socket}, Stream.Readable.prototype, req);
  //$FlowFixMe
  res = Object.assign({_headers: {}, socket}, Stream.Writable.prototype, res, {
    statusCode: 404,
  });
  req.socket.remoteAddress = req.socket.remoteAddress || '127.0.0.1';
  res.getHeader = k => res._headers[k.toLowerCase()];
  res.setHeader = (k, v) => (res._headers[k.toLowerCase()] = v);
  res.removeHeader = k => delete res._headers[k.toLowerCase()];

  // createContext is missing in Koa typings
  const ctx = (new Koa(): any).createContext(req, res);

  ctx.memoized = new Map();

  if (options.body) {
    ctx.request.body = options.body;
  }

  return ctx;
}

export function createRenderContext(
  url: string,
  options?: ContextOptions = defaultContextOptions
): Context {
  // $FlowFixMe
  return createRequestContext(url, {
    ...options,
    headers: {
      accept: 'text/html',
      ...(options.headers || {}),
    },
  });
}
