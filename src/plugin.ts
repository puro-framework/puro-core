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
import { Controller } from './controller';

import { container } from './container';

// TODO: improve this shit
// TODO: check for absolute path
const importModule = (path: string) => {
  try {
    return require(path);
  } catch (e) {
    console.log(e);
    return false;
  }
};

/**
 * The definition for a route.
 */
export interface Route {
  path: string;
  controller: typeof Controller;
}

/**
 * The Puro's plugin.
 */
export class Plugin {
  path: string;
  router: any;

  /**
   * Constructor method.
   */
  constructor(path: string) {
    this.path = path;
    this.router = Router();

    this.loadRoutes();
    this.loadServices();
  }

  /**
   * Loads the routes from `plugins/routes.ts`.
   */
  private loadRoutes() {
    const module = importModule(`${this.path}/routes`);

    if (!module) {
      return;
    }

    const { routes } = module;
    console.log(`Loading routes for "${this.path}" ...`);

    routes.forEach((route: Route) => {
      this.router.use(route.path, this.buildController(route.controller));
    });
  }

  /**
   * Loads the services from `plugins/services.ts`.
   */
  private loadServices() {
    const module = importModule(`${this.path}/services`);

    if (!module) {
      return;
    }

    console.log(`Loading services for "${this.path}" ...`);
    const { services } = module;

    for (const name in services) {
      container.registerService(name, services[name]);
    }
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
