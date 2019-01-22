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
  NotFoundHttpException,
  MethodNotAllowedHttpException,
  InvalidParameterHttpException,
  Request as HttpRequest
} from '../src/http';

import { Controller } from '../src/controller';
import { Container } from '../src/container';

import {
  Schema,
  getSchema,
  serialize,
  prepareRequest,
  prepareResponse,
  buildControllerMiddleware
} from '../src/protocol';

import _ = require('lodash');

describe('protocol', () => {
  let warnSpy: Function;

  let request: Request;
  let response: Response;
  let next: NextFunction;

  beforeEach(() => {
    warnSpy = spyOn(console, 'warn');

    request = new Request();
    response = new Response();
    next = jest.fn();
  });

  it('can annotate class properties', async () => {
    class TestClass {
      @Schema('annotation')
      property1?: string;
    }

    const createSchema = getSchema(new TestClass(), 'property1');
    expect(createSchema).toEqual('annotation');
  });

  it('can annotate controller handlers', async () => {
    class TestController {
      @Schema({ key: 'value' })
      create(request: Request) {}
    }

    const createSchema = getSchema(new TestController(), 'create');
    expect(createSchema).toEqual({ key: 'value' });
  });

  it('can serialize numbers', async () => {
    const input: any = 15.3;
    const output: any = {};

    serialize({ content: input }, 'content', output);
    expect(output.content).toBe(15.3);
  });

  it('can serialize strings', async () => {
    const input: any = 'string';
    const output: any = {};

    serialize({ content: input }, 'content', output);
    expect(output.content).toBe('string');
  });

  it('can serialize booleans', async () => {
    const input: any = true;
    const output: any = {};

    serialize({ content: input }, 'content', output);
    expect(typeof output.content).toBe('boolean');
  });

  it('can serialize dates', async () => {
    const input: any = new Date(2018, 12, 25, 5, 30, 10);
    const output: any = {};

    serialize({ content: input }, 'content', output);
    expect(output.content).toBe('2019-01-25T05:30:10.000Z');
  });

  it('can serialize arrays', async () => {
    const input: any = [1, 2, 3];
    const output: any = {};

    serialize({ content: input }, 'content', output);
    expect(output.content).toEqual([1, 2, 3]);
  });

  it('can serialize plain objects', async () => {
    const input: any = { key: 'value' };
    const output: any = {};

    serialize({ content: input }, 'content', output);
    expect(output.content).toEqual({ key: 'value' });
  });

  it('can serialize schema objects', async () => {
    class TestEntity {
      property1: string = 'value1'; // Hidden property

      @Schema()
      property2: string = 'value2'; // Default name

      @Schema('customProperty3')
      property3: string = 'value3'; // Custom name
    }

    const input: any = new TestEntity();
    const output: any = {};

    serialize({ content: input }, 'content', output);
    expect(output.content).toEqual({
      property2: 'value2',
      customProperty3: 'value3'
    });
  });

  it('can serialize derived schema objects', async () => {
    class TestBase {
      @Schema()
      property1: string = 'value1';
    }
    class TestDerived extends TestBase {
      @Schema()
      property2: string = 'value2';
    }

    const input: any = new TestDerived();
    const output: any = {};

    serialize({ content: input }, 'content', output);
    expect(output.content).toEqual({
      property1: 'value1',
      property2: 'value2'
    });
  });

  it('can serialize nested schema objects', async () => {
    class TestUser {
      @Schema('name')
      name?: string;
    }
    class TestBook {
      @Schema('author')
      author?: TestUser;
    }

    const user = new TestUser();
    user.name = 'John Doe';

    const book = new TestBook();
    book.author = user;

    const input: any = book;
    const output: any = {};

    serialize({ content: input }, 'content', output);
    expect(output.content).toEqual({
      author: {
        name: 'John Doe'
      }
    });
  });

  it('can handle unserializable objects', async () => {
    spyOn(_ as any, 'isBoolean').and.returnValue(false);

    const input: any = true;
    const output: any = {};

    serialize({ content: input }, 'content', output);
    expect(output.content).toBeUndefined();
    expect(warnSpy).toHaveBeenCalledWith(
      'Unable to serialize "content" of type "boolean"'
    );
  });

  it('can prepare the request', async () => {
    request.query = { a: 1, b: 1, c: 1 };
    request.body = { b: 2, c: 2 };
    request.params = { c: 3 };

    request = await mock(prepareRequest)(request, {});
    expect(request.bucket).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('can handle the response', async () => {
    const responseHints = {
      hint1: ['message1'],
      hint2: ['message2'],
      hint3: ['message3']
    };

    response = await mock(prepareResponse)(
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

  it('can handle invalid request URL parameters', async () => {
    request.params = { param: 'value' };

    try {
      request = await mock(prepareRequest)(request, {
        param: { isUppercase: {} }
      });
      fail();
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundHttpException);
    }
  });

  it('can handle invalid request parameters', async () => {
    request.params = {};
    request.body = { param: 'value' };

    try {
      request = await mock(prepareRequest)(request, {
        param: { isUppercase: {} }
      });
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidParameterHttpException);
      expect(e.hints).toEqual({
        param: ['The parameter must be an uppercase string']
      });
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
