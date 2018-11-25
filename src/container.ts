/**
 * @file src/container.ts
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

import { forOwn as _forOwn } from 'lodash';

export type IServiceBase = Function;

export interface IServiceExtended {
  load: Function;
  unload: Function;
}

export type IService = IServiceBase | IServiceExtended;

export interface IServiceDef {
  [key: string]: IService;
}

/**
 * The service container.
 */
export class Container {
  /**
   * The defined services.
   */
  protected services: IServiceDef = {};

  /**
   * Defines a new service.
   */
  define(name: string, def: IService) {
    this.services[name] = def;
    return this;
  }

  /**
   * Loads and returns a service.
   */
  async get(name: string) {
    const def = this.services[name];

    if (typeof def === 'undefined') {
      throw new Error(`The service "${name}" is not defined`);
    }

    if (typeof def === 'function') {
      return def.call(this);
    }

    return def.load.call(this);
  }

  /**
   * Shutdown the services.
   */
  async shoutdown() {
    _forOwn(this.services, async (def: any) => {
      if (typeof def !== 'function') {
        await def.unload.call(this);
      }
    });
  }
}
