/**
 * @file plugin.ts
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

import { Router } from './http';
import { buildControllerMiddleware } from './protocol';
import { IControllerRoute } from './controller';
import { Container, IServiceDef } from './container';
import { Firewall } from './firewall';

/**
 * The plugin class.
 */
export abstract class Plugin {
  /**
   * The plugin router.
   */
  router!: Router;

  /**
   * The plugin services.
   */
  services!: IServiceDef;

  /**
   * The container instance.
   */
  container!: Container;

  /**
   * The firewall instance.
   */
  firewall!: Firewall;

  /**
   * Returns the definition for the routes.
   */
  prepare(container: Container, firewall: Firewall) {
    this.configure();

    this.container = container;
    this.firewall = firewall;

    this.router = this.buildRouter();
    this.services = this.getServices();
  }

  /**
   * Configures the plugin.
   */
  protected configure() {}

  /**
   * Returns the definition for the services.
   */
  protected getServices() {
    return {};
  }

  /**
   * Returns the definition for the routes.
   */
  protected getRoutes(): IControllerRoute[] {
    return [];
  }

  /**
   * Builds the plugin router.
   */
  private buildRouter = () => {
    const router = Router();

    this.getRoutes().forEach((route: IControllerRoute) => {
      if (typeof route.controller !== 'undefined') {
        route.middleware = buildControllerMiddleware(
          route.controller,
          this.container
        );
      }

      if (typeof route.middleware === 'undefined') {
        throw new Error(`Unable to find middleware for "${route.path}"`);
      }

      // Put the not anonymous routes behind the firewall middleware
      if (route.anonymous) {
        router.use(route.path, route.middleware);
      } else {
        router.use(route.path, this.firewall.middleware, route.middleware);
      }
    });

    return router;
  };
}
