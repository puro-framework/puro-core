/**
 * @file puro.spec.ts
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

import { Puro } from '../src/puro';

import {
  requestHandler,
  responseHandler,
  errorHandler,
  error404Handler
} from '../src/http';

import { Controller } from '../src/controller';
import { Container } from '../src/container';

import { Plugin } from '../src/plugin';

describe('puro', () => {
  let puro: Puro;
  let server: any;
  let container: any;

  beforeEach(() => {
    server = {
      use: jest.fn(),
      listen: jest.fn()
    };

    container = {
      define: jest.fn()
    };

    puro = new Puro();
    puro.server = server;

    (puro as any).container = container;
  });

  it('can be instantiated', async () => {
    puro = new Puro();
    expect(typeof puro.server).toBe('function');
    expect(puro.container).toBeInstanceOf(Container);
  });

  it('can install plugin', async () => {
    class TestPlugin extends Plugin {}

    const plugin1 = new TestPlugin();
    const plugin2 = new TestPlugin();

    puro.install(plugin1);
    puro.install(plugin2);

    expect(puro.plugins).toHaveLength(2);
    expect(puro.plugins[0]).toBe(plugin1);
    expect(puro.plugins[1]).toBe(plugin2);
  });

  it('can set up the plugin routes', async () => {
    class TestPlugin extends Plugin {
      protected getRoutes() {
        return [
          { path: '/collection/:resourceId', controller: Controller },
          { path: '/collection', controller: Controller }
        ];
      }
    }

    const plugin = new TestPlugin();
    puro.install(plugin);
    (puro as any).setupPlugins();

    expect(server.use).toHaveBeenCalledWith(
      puro.options.basepath,
      plugin.router
    );
  });

  it('can set up the plugin services', async () => {
    class TestPlugin extends Plugin {
      protected getServices() {
        return {
          service1: async () => {},
          service2: {
            load: async () => {},
            unload: async () => {}
          }
        };
      }
    }

    puro.install(new TestPlugin());
    (puro as any).setupPlugins();

    expect(container.define).toHaveBeenCalledTimes(2);
    expect(container.define.mock.calls[0][0]).toBe('service1');
    expect(container.define.mock.calls[1][0]).toBe('service2');
  });

  it('can prepare the server', async () => {
    puro.prepare();

    expect(container.define).toHaveBeenCalled();
    expect(container.define.mock.calls[0][0]).toBe('database');

    expect(server.use).toHaveBeenCalledTimes(4);
    expect(server.use.mock.calls[0][0]).toBe(requestHandler);
    expect(server.use.mock.calls[1][0]).toBe(responseHandler);
    expect(server.use.mock.calls[2][0]).toBe(errorHandler);
    expect(server.use.mock.calls[3][0]).toBe(error404Handler);
  });

  it('can listen for connections', async () => {
    puro.listen(8080, 'hostname');
    expect(server.listen).toHaveBeenCalledWith(8080, 'hostname');
  });
});
