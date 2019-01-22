/**
 * @file configs.spec.ts
 *
 * Copyright (C) 2018 | Giacomo Trudu aka `Wicker25`
 *
 * This file is part of Puro.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { configs } from '../src/configs';

import fs = require('fs');

describe('configs', () => {
  let readFileSyncSpy: Function;

  beforeEach(() => {
    readFileSyncSpy = spyOn(fs, 'readFileSync').and.returnValue(
      '{ "a": { "b": { "c": 1 } } }'
    );
  });

  afterEach(() => {
    configs.reload();
  });

  it('can load the configs from the default path', async () => {
    configs.get('a');
    expect(readFileSyncSpy).toBeCalledWith(
      process.env.PWD + '/config/params.json',
      'utf8'
    );
  });

  it('can load the configs from a custom path', async () => {
    process.env.PURO_PARAMS_PATH = 'custom/path/params.json';
    configs.get('a');
    expect(readFileSyncSpy).toBeCalledWith(
      process.env.PURO_PARAMS_PATH,
      'utf8'
    );
  });

  it('can get a config node according to a path', async () => {
    const node = configs.get('a.b');
    expect(node).toEqual({ c: 1 });
  });

  it('can cache the configs', async () => {
    configs.get('a');
    configs.get('a');
    expect(readFileSyncSpy).toHaveBeenCalledTimes(1);
  });

  it('can force to reload the configs', async () => {
    configs.get('a');
    configs.reload();
    configs.get('a');
    expect(readFileSyncSpy).toHaveBeenCalledTimes(2);
  });
});
