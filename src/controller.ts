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

import { Request, Response, NextFunction } from '@pure/http';

import {
  NotFoundHttpException,
  MethodNotAllowedHttpException
} from '@pure/http';

import { container } from '@pure/container';

const HttpMethodMap: { [key: string]: string } = {
  POST: 'create',
  GET: 'read',
  PUT: 'update',
  DELETE: 'remove'
};

/**
 * This descriptor defines what is part of the API schema.
 */
export const schema = (rules?: any): Function => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    target.rules = rules;
    return target;
  };
};

/**
 * The Controller class.
 */
export class Controller {
  protected container = container.getService.bind(container);

  async handle(request: Request, response: Response) {
    const action = HttpMethodMap[request.method];

    if (!action) {
      throw new MethodNotAllowedHttpException();
    }

    const handler = this.getHandler(action);
    const result = await handler(request, response);

    // TODO: create a method `processResult()`
    if (result) {
      response.content(result);
    }
  }

  async create(request: Request, response: Response): Promise<any> {
    throw new NotFoundHttpException();
  }

  async read(request: Request, response: Response): Promise<any> {
    throw new NotFoundHttpException();
  }

  async update(request: Request, response: Response): Promise<any> {
    throw new NotFoundHttpException();
  }

  async remove(request: Request, response: Response): Promise<any> {
    throw new NotFoundHttpException();
  }

  private getHandler(name: string) {
    return (this as any)[name].bind(this);
  }
}
