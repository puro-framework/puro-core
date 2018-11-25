/**
 * @file src/puro.ts
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

import { Server } from './http';
import { Request, Response, NextFunction } from './http';

import {
  requestHandler,
  responseHandler,
  errorHandler,
  error404Handler
} from './http';

import { Container } from './container';
import { DatabaseDef } from './database';
import { Plugin } from './plugin';

import { forOwn as _forOwn } from 'lodash';

/**
 * The Puro's options.
 */
export interface IPuroOptions {
  basepath: string;
}

/**
 * The Puro's server.
 */
export class Puro {
  /**
   * The Express' instance.
   */
  server: any;

  /**
   * The installed plugins.
   */
  plugins: Plugin[] = [];

  /**
   * The container instance.
   */
  container: Container;

  /**
   * The server options.
   */
  options: IPuroOptions = {
    basepath: '/api/'
  };

  /**
   * Constructor method.
   */
  constructor(options?: IPuroOptions) {
    this.server = Server();
    this.options = Object.assign(this.options, options);
    this.container = new Container();
  }

  /**
   * Installs a plugin on the server.
   */
  install(plugin: Plugin) {
    this.plugins.push(plugin);
  }

  /**
   * Prepares the server.
   */
  prepare() {
    this.container.define('database', DatabaseDef);

    this.server.use(requestHandler);
    this.server.use(responseHandler);

    this.setupPlugins();

    this.server.use(errorHandler);
    this.server.use(error404Handler);
  }

  /**
   * Listens for connections on the specified host and port.
   */
  listen(port: number, hostname?: string) {
    return this.server.listen(port, hostname);
  }

  /**
   * Sets up the plugins.
   */
  private setupPlugins() {
    this.plugins.forEach(plugin => {
      plugin.prepare(this.container);

      // Use the plugin router
      this.server.use(this.options.basepath, plugin.router);

      // Load the plugin services
      _forOwn(plugin.services, (definition: any, name: string) => {
        this.container.define(name, definition);
      });
    });
  }
}
