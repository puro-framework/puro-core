/**
 * @file plugin.spec.ts
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

import { Request, Response, IMiddleware } from '../src/http';

import { Plugin } from '../src/plugin';
import { Controller } from '../src/controller';
import { Container } from '../src/container';

describe('plugin', () => {
  let plugin: Plugin;
  let container: Container;
  let middleware: IMiddleware;

  beforeEach(() => {
    container = new Container();
    middleware = (request: Request, response: Response) => {};

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

      protected getRoutes() {
        return [
          { path: '/collection/:resourceId', controller: Controller },
          { path: '/collection', controller: Controller },
          { path: '/resource', middleware }
        ];
      }
    }

    plugin = new TestPlugin();
  });

  it('can define the services', async () => {
    const services = (plugin as any).getServices();
    expect(Object.keys(services)).toEqual(['service1', 'service2']);
  });

  it('can define the routes', async () => {
    const routes = (plugin as any).getRoutes();
    expect(routes).toEqual([
      { path: '/collection/:resourceId', controller: Controller },
      { path: '/collection', controller: Controller },
      { path: '/resource', middleware }
    ]);
  });

  it('can omit the definition for the services', async () => {
    class TestPlugin extends Plugin {}
    plugin = new TestPlugin();

    const services = (plugin as any).getServices();
    expect(services).toEqual({});
  });

  it('can omit the definition for the routes', async () => {
    class TestPlugin extends Plugin {}
    plugin = new TestPlugin();

    const routes = (plugin as any).getRoutes();
    expect(routes).toEqual([]);
  });

  it('can prepare the services', async () => {
    plugin.prepare(container);
    expect(Object.keys(plugin.services as any)).toEqual([
      'service1',
      'service2'
    ]);
  });

  it('can prepare the router', async () => {
    plugin.prepare(container);
    expect(typeof plugin.router).toBe('function');
  });

  it('can handle undefined middlewares', async () => {
    class TestPlugin2 extends Plugin {
      protected getRoutes() {
        return [{ path: '/resource' }];
      }
    }

    expect(() => {
      plugin = new TestPlugin2();
      plugin.prepare(container);
    }).toThrow();
  });
});
