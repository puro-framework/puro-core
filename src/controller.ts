/**
 * @file src/controller.ts
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

import { Request, Response } from './http';
import { MethodNotAllowedHttpException } from './http';

import { getSchema } from './protocol';
import { container } from './container';

/**
 * The controller class.
 */
export abstract class Controller {
  /**
   * The CRUD functions.
   */
  static HttpMethodOptions: { [key: string]: any } = {
    POST: {
      hook: 'create',
      defaultStatusCode: 201
    },
    GET: {
      hook: 'read',
      defaultStatusCode: 200
    },
    PUT: {
      hook: 'update',
      defaultStatusCode: 204
    },
    DELETE: {
      hook: 'remove',
      defaultStatusCode: 204
    }
  };

  /**
   * Reference to the service container.
   */
  protected container = container.getService.bind(container);

  /**
   * This method is the entrypoint for the router.
   */
  async handleRequest(request: Request, response: Response) {
    const options = Controller.HttpMethodOptions[request.method];

    if (!options) {
      throw new MethodNotAllowedHttpException();
    }

    const handler = this.getHandler(options.hook);

    const methodSchema = getSchema(this, options.hook) || {};
    request.prepare(methodSchema);

    const output = await this.processOutput(
      await handler(request, response),
      response,
      options
    );

    response.prepare(options.defaultStatusCode, output);
  }

  /**
   * The handler methods you need to override.
   */
  async create?(request: Request, response: Response): Promise<any>;
  async read?(request: Request, response: Response): Promise<any>;
  async update?(request: Request, response: Response): Promise<any>;
  async remove?(request: Request, response: Response): Promise<any>;

  /**
   * Returns the method handler by name.
   */
  private getHandler(name: string) {
    const handler = (this as any)[name];

    if (!handler) {
      throw new MethodNotAllowedHttpException();
    }

    return handler.bind(this);
  }

  /**
   * Processes the handler output and set the response content.
   */
  private async processOutput(output: any, response: Response, options: any) {
    // Handle promises and async functions
    if (output instanceof Promise) {
      return await output;
    } else if (typeof output === 'function') {
      return await output();
    }

    return output;
  }
}
