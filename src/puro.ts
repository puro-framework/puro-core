/**
 * @file puro.ts
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

import {
  requestHandler,
  responseHandler,
  errorHandler,
  error404Handler,
} from './http';

import { Container } from './container';
import { DatabaseServiceDef } from './database';
import { Firewall } from './firewall';
import { Plugin } from './plugin';

import { forOwn as _forOwn } from 'lodash';

import { Application } from 'express';

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
  server: Application;

  /**
   * The installed plugins.
   */
  plugins: Plugin[] = [];

  /**
   * The container instance.
   */
  container: Container;

  /**
   * The firewall instance.
   */
  firewall: Firewall;

  /**
   * The server options.
   */
  options: IPuroOptions = {
    basepath: '/api/',
  };

  /**
   * Constructor method.
   */
  constructor(options?: IPuroOptions) {
    this.server = Server();
    this.options = Object.assign(this.options, options);
    this.container = new Container();
    this.firewall = new Firewall(this.container);
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
    this.container.define('database', DatabaseServiceDef);

    this.server.use(Server.json());
    this.server.use(this.firewall.initialize());
    this.server.use(requestHandler);
    this.server.use(responseHandler);

    this.loadPlugins();

    this.server.use(errorHandler);
    this.server.use(error404Handler);
  }

  /**
   * Listens for connections on the specified host and port.
   */
  listen(port: number, hostname: string) {
    return this.server.listen(port, hostname);
  }

  /**
   * Loads the plugins.
   */
  private loadPlugins() {
    this.plugins.forEach((plugin) => {
      plugin.prepare(this.container, this.firewall);
    });

    // Load the routers behind the firewall
    const { basepath } = this.options;

    this.plugins.forEach((plugin) => {
      this.server.use(basepath, plugin.router);
    });

    // Load the services
    this.plugins.forEach((plugin) => {
      _forOwn(plugin.services, (definition: any, name: string) => {
        this.container.define(name, definition);
      });
    });
  }
}
