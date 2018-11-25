/**
 * @file container.spec.ts
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

import { Container } from '../src/container';

describe('container', () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
  });

  it('can define and access a service', async () => {
    container.define('service', async () => {
      return { o: 1 };
    });

    const service = await container.get('service');
    expect(service).toEqual({ o: 1 });
  });

  it('can define and access a service (extended)', async () => {
    container.define('service', {
      load: async () => {
        return { o: 1 };
      },
      unload: async () => {}
    });

    const service = await container.get('service');
    expect(service).toEqual({ o: 1 });
  });

  it('can handle undefined service', async () => {
    try {
      await container.get('undefined');
    } catch (e) {
      expect(e).toEqual(new Error('The service "undefined" is not defined'));
    }
  });

  it('can shoutdown the services', async () => {
    const unload = jest.fn();

    container
      .define('service1', async () => {})
      .define('service2', {
        load: async () => {},
        unload: async () => unload('service2')
      })
      .define('service3', {
        load: async () => {},
        unload: async () => unload('service3')
      });

    await container.shoutdown();
    expect(unload).toBeCalledWith('service2');
    expect(unload).toBeCalledWith('service3');
  });
});
