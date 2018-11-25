/**
 * @file src/plugin.ts
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

import { Request, Response, NextFunction, Router } from './http';
import { ControllerRoute } from './controller';

import { container } from './container';

/**
 * The plugin class.
 */
export abstract class Plugin {
  /**
   * The router containing the plugin routes.
   */
  router: any = Router();

  /**
   * Constructor method.
   */
  constructor() {
    this.compile();
  }

  /**
   * Returns the definition for the services.
   */
  protected getServices() {
    return {};
  }

  /**
   * Returns the definition for the routes.
   */
  protected getRoutes(): ControllerRoute[] {
    return [];
  }

  private compile() {
    this.getRoutes().forEach((route: ControllerRoute) => {
      this.router.use(route.path, this.buildController(route.controller));
    });

    const services: any = this.getServices();

    Object.keys(services).forEach((name: string) => {
      container.registerService(name, services[name]);
    });
  }

  /**
   * Builds the controller and wraps it inside a middleware.
   */
  private buildController = (ControllerClass: any) => {
    return async (request: Request, response: Response, next: NextFunction) => {
      try {
        let instance = new ControllerClass();
        await instance.handleRequest(request, response);
      } catch (e) {
        next(e);
      }
    };
  };
}
