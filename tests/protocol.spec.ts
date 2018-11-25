/**
 * @file protocol.spec.ts
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

import {
  Request,
  Response,
  NextFunction,
  Middleware
} from '../src/testing/mocks';

import { mock } from '../src/testing/mocks';

import {
  MethodNotAllowedHttpException,
  InvalidParameterHttpException,
  Request as HttpRequest
} from '../src/http';

import { Controller } from '../src/controller';
import { Container } from '../src/container';

import {
  Schema,
  getSchema,
  prepareRequest,
  prepareResponse,
  buildControllerMiddleware
} from '../src/protocol';

describe('protocol', () => {
  let request: Request;
  let response: Response;
  let next: NextFunction;

  beforeEach(() => {
    request = new Request();
    response = new Response();
    next = jest.fn();
  });

  it('can annotate controller handlers', async () => {
    class TestController {
      @Schema({ key: 'value' })
      create(request: Request) {}
    }

    const createSchema = getSchema(new TestController(), 'create');
    expect(createSchema).toEqual({ key: 'value' });
  });

  it('can prepare the request', async () => {
    request.query = { a: 1, b: 1, c: 1 };
    request.body = { b: 2, c: 2 };
    request.params = { c: 3 };

    request = mock(prepareRequest)(request, {});
    expect(request.bucket).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('can handle the response', async () => {
    const responseHints = {
      hint1: ['message1'],
      hint2: ['message2'],
      hint3: ['message3']
    };

    response = mock(prepareResponse)(
      response,
      123,
      'Response Content',
      responseHints
    );

    expect(response.status).toBeCalledWith(123);
    expect(response.send).toBeCalledWith({
      status: 123,
      content: 'Response Content',
      hints: responseHints
    });
  });

  it('can handle invalid request parameters', async () => {
    try {
      request = mock(prepareRequest)(request, { param: { isRequired: {} } });
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidParameterHttpException);
    }
  });

  it('can build the controller middleware', async () => {
    class CreateController extends Controller {
      async create(request: HttpRequest) {
        return 'Response Content';
      }
    }

    const container = new Container();
    const middleware = buildControllerMiddleware(CreateController, container);

    // Successful
    request.method = 'POST';
    await mock<Middleware>(middleware)(request, response, next);
    expect(next).not.toBeCalled();

    // Unsuccessful
    request.method = 'DELETE';
    await mock<Middleware>(middleware)(request, response, next);
    expect(next).toBeCalledWith(new MethodNotAllowedHttpException());
  });
});
