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

import { Request, Response } from '@puro/http';
import { MethodNotAllowedHttpException } from '@puro/http';

import { container } from '@puro/container';

/**
 * This annotation defines what is part of the API schema.
 */
export const schema = (rules?: any): Function => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    target.schema = Object.assign(target.schema || {}, {
      [propertyKey]: rules
    });
    return target;
  };
};

/**
 * The controller class.
 */
export abstract class Controller {
  /**
   * The CRUD functions.
   */
  static HttpMethodOptions: { [key: string]: any } = {
    POST: {
      funct: 'create',
      defaultStatusCode: 201
    },
    GET: {
      funct: 'read',
      defaultStatusCode: 200
    },
    PUT: {
      funct: 'update',
      defaultStatusCode: 204
    },
    DELETE: {
      funct: 'remove',
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

    const handler = this.getHandler(options.funct);
    const output = await handler(request, response);

    await this.processOutput(output, response, options);
  }

  /**
   * The handler methods you need to override.
   */
  async create(request: Request, response: Response): Promise<any> {
    throw new Error('Not Implemented');
  }
  async read(request: Request, response: Response): Promise<any> {
    throw new Error('Not Implemented');
  }
  async update(request: Request, response: Response): Promise<any> {
    throw new Error('Not Implemented');
  }
  async remove(request: Request, response: Response): Promise<any> {
    throw new Error('Not Implemented');
  }

  /**
   * Returns the method handler by name.
   */
  private getHandler(name: string) {
    return (this as any)[name].bind(this);
  }

  /**
   * Processes the handler output and set the response content.
   */
  private async processOutput(output: any, response: Response, options: any) {
    // Handle promises and async functions
    if (output instanceof Promise) {
      output = await output;
    } else if (typeof output === 'function') {
      output = await output();
    }

    // TODO: handle entities here

    response.content(options.defaultStatusCode, output);
  }
}
