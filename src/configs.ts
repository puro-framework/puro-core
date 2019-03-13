/**
 * @file configs.ts
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

import fs = require('fs');
import path = require('path');

import { get as _get } from 'lodash';

/**
 * The configuration manager.
 */
class Configs {
  /**
   * The loaded configuration.
   */
  protected data: any;

  /**
   * Returns a configuration node according to a path.
   */
  get<T = any>(filePath: string): T {
    return _get(this.loadConfig(), filePath) as T;
  }

  /**
   * Forces to reload the configuration.
   */
  reload() {
    this.data = undefined;
  }

  /**
   * Lazy-loads the configuration from the files.
   */
  private loadConfig() {
    if (this.data) {
      return this.data;
    }

    if (process.env.PURO_PARAMS) {
      this.data = JSON.parse(process.env.PURO_PARAMS);
      return this.data;
    }

    const filePath = process.env.PURO_PARAMS_PATH
      ? process.env.PURO_PARAMS_PATH
      : path.join(process.cwd(), 'config/params.json');

    const contents = fs.readFileSync(filePath, 'utf8');
    this.data = JSON.parse(contents);

    return this.data;
  }
}

export const configs = new Configs();
