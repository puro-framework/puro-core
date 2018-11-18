/**
 * @file src/http.spec.ts
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

import { Request, Response, NextFunction, Middleware } from '@testing/mocks';
import { mock } from '@testing/mocks';

import {
  HttpException,
  BadRequestException,
  InvalidParameterException,
  AccessDeniedHttpException,
  NotFoundHttpException,
  MethodNotAllowedHttpException
} from '@puro/http';

import {
  requestHandler,
  responseHandler,
  errorHandler,
  error404Handler
} from '@puro/http';

describe('http', () => {
  let request: Request;
  let response: Response;
  let next: NextFunction;

  beforeEach(() => {
    console.error = jest.fn();

    request = new Request();
    response = new Response();
    next = jest.fn();
  });

  it('can handle Request', async () => {
    await mock<Middleware>(requestHandler)(request, response, next);
    expect(next).toBeCalled();
  });

  it('can handle Response', async () => {
    await mock<Middleware>(responseHandler)(request, response, next);
    expect(typeof response.content).toBe('function');
    expect(next).toBeCalled();

    const responseHints = {
      hint1: ['message1'],
      hint2: ['message2'],
      hint3: ['message3']
    };

    response.content(123, 'Response Content', responseHints);

    expect(response.status).toBeCalledWith(123);
    expect(response.send).toBeCalledWith({
      status: 123,
      content: 'Response Content',
      hints: responseHints
    });
  });

  it('can handle HttpException', async () => {
    const exceptionHints = {
      hint1: ['message1'],
      hint2: ['message2'],
      hint3: ['message3']
    };

    const exception = new HttpException(
      123,
      'Custom Exception',
      exceptionHints
    );

    await mock<Middleware>(errorHandler)(exception, request, response, next);
    expect(response.content).toBeCalledWith(
      123,
      'Custom Exception',
      exceptionHints
    );
  });

  it('can handle BadRequestException', async () => {
    const exception = new BadRequestException();

    await mock<Middleware>(errorHandler)(exception, request, response, next);
    expect(response.content).toBeCalledWith(400, 'Bad Request', undefined);
  });

  it('can handle InvalidParameterException', async () => {
    const exception = new InvalidParameterException();

    await mock<Middleware>(errorHandler)(exception, request, response, next);
    expect(response.content).toBeCalledWith(
      400,
      'Invalid Parameter',
      undefined
    );
  });

  it('can handle AccessDeniedHttpException', async () => {
    const exception = new AccessDeniedHttpException();

    await mock<Middleware>(errorHandler)(exception, request, response, next);
    expect(response.content).toBeCalledWith(403, 'Forbidden', undefined);
  });

  it('can handle NotFoundHttpException', async () => {
    const exception = new NotFoundHttpException();

    await mock<Middleware>(errorHandler)(exception, request, response, next);
    expect(response.content).toBeCalledWith(404, 'Not Found', undefined);
  });

  it('can handle MethodNotAllowedHttpException', async () => {
    const exception = new MethodNotAllowedHttpException();

    await mock<Middleware>(errorHandler)(exception, request, response, next);
    expect(response.content).toBeCalledWith(
      405,
      'Method Not Allowed',
      undefined
    );
  });

  it('can handle unknown exceptions', async () => {
    const exception = new Error('Internal Error');

    await mock<Middleware>(errorHandler)(exception, request, response, next);
    expect(response.content).toBeCalledWith(
      500,
      'Internal Server Error',
      undefined
    );

    expect(console.error).toHaveBeenCalledWith(exception);
  });

  it('can handle native not found exceptions', async () => {
    await mock<Middleware>(error404Handler)(request, response);
    expect(response.content).toBeCalledWith(404, 'Not Found');
  });
});
