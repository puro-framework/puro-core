/**
 * @file src/controller.spec.ts
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

import { Request, Response, Middleware } from '../testing/mocks';
import { mock } from '../testing/mocks';

import { Request as HttpRequest } from './http';
import { MethodNotAllowedHttpException } from './http';
import { Controller } from './controller';

describe('controller', () => {
  let request: Request;
  let response: Response;
  let controller: any;

  beforeEach(() => {
    request = new Request();
    response = new Response();

    class TestController extends Controller {}
    controller = new TestController();
    controller.handleRequest = controller.handleRequest.bind(controller);
  });

  it('can forward POST methods', async () => {
    request.method = 'POST';

    controller.create = jest.fn();
    await mock<Middleware>(controller.handleRequest)(request, response);
    expect(controller.create).toBeCalledWith(request, response);
  });

  it('can forward GET methods', async () => {
    request.method = 'GET';

    controller.read = jest.fn();
    await mock<Middleware>(controller.handleRequest)(request, response);
    expect(controller.read).toBeCalledWith(request, response);
  });

  it('can forward PUT methods', async () => {
    request.method = 'PUT';

    controller.update = jest.fn();
    await mock<Middleware>(controller.handleRequest)(request, response);
    expect(controller.update).toBeCalledWith(request, response);
  });

  it('can forward DELETE methods', async () => {
    request.method = 'DELETE';

    controller.remove = jest.fn();
    await mock<Middleware>(controller.handleRequest)(request, response);
    expect(controller.remove).toBeCalledWith(request, response);
  });

  it('can handle unsupported POST methods', async () => {
    try {
      request.method = 'POST';
      await mock<Middleware>(controller.handleRequest)(request, response);
    } catch (e) {
      expect(e).toBeInstanceOf(MethodNotAllowedHttpException);
    }
  });

  it('can handle unsupported GET methods', async () => {
    try {
      request.method = 'GET';
      await mock<Middleware>(controller.handleRequest)(request, response);
    } catch (e) {
      expect(e).toBeInstanceOf(MethodNotAllowedHttpException);
    }
  });

  it('can handle unsupported PUT methods', async () => {
    try {
      request.method = 'PUT';
      await mock<Middleware>(controller.handleRequest)(request, response);
    } catch (e) {
      expect(e).toBeInstanceOf(MethodNotAllowedHttpException);
    }
  });

  it('can handle unsupported DELETE methods', async () => {
    try {
      request.method = 'DELETE';
      await mock<Middleware>(controller.handleRequest)(request, response);
    } catch (e) {
      expect(e).toBeInstanceOf(MethodNotAllowedHttpException);
    }
  });

  it('can handle unknown HTTP methods', async () => {
    try {
      request.method = 'unknown';
      await mock<Middleware>(controller.handleRequest)(request, response);
    } catch (e) {
      expect(e).toBeInstanceOf(MethodNotAllowedHttpException);
    }
  });

  it('can process CREATE functions', async () => {
    request.method = 'POST';

    class CreateController extends Controller {
      async create(request: HttpRequest) {
        return 'Response Content';
      }
    }

    controller = new CreateController();
    controller.handleRequest = controller.handleRequest.bind(controller);

    await mock<Middleware>(controller.handleRequest)(request, response);
    expect(response.prepare).toBeCalledWith(201, 'Response Content');
  });

  it('can process READ functions', async () => {
    request.method = 'GET';

    class UpdateController extends Controller {
      async read(request: HttpRequest) {
        return 'Response Content';
      }
    }

    controller = new UpdateController();
    controller.handleRequest = controller.handleRequest.bind(controller);

    await mock<Middleware>(controller.handleRequest)(request, response);
    expect(response.prepare).toBeCalledWith(200, 'Response Content');
  });

  it('can process UPDATE functions', async () => {
    request.method = 'PUT';

    class UpdateController extends Controller {
      async update(request: HttpRequest) {
        return 'Response Content';
      }
    }

    controller = new UpdateController();
    controller.handleRequest = controller.handleRequest.bind(controller);

    await mock<Middleware>(controller.handleRequest)(request, response);
    expect(response.prepare).toBeCalledWith(204, 'Response Content');
  });

  it('can process DELETE functions', async () => {
    request.method = 'DELETE';

    class DeleteController extends Controller {
      async remove(request: HttpRequest) {
        return 'Response Content';
      }
    }

    controller = new DeleteController();
    controller.handleRequest = controller.handleRequest.bind(controller);

    await mock<Middleware>(controller.handleRequest)(request, response);
    expect(response.prepare).toBeCalledWith(204, 'Response Content');
  });

  it('can handle plain object output', async () => {
    const output = { key: 'value' };
    const result = await (controller as any).processOutput(output, response, {
      defaultStatusCode: 200
    });
    expect(result).toEqual(output);
  });

  it('can handle array output', async () => {
    const output = [1, 2, 3];
    const result = await (controller as any).processOutput(output, response, {
      defaultStatusCode: 200
    });
    expect(result).toEqual(output);
  });

  it('can handle async function output', async () => {
    const output = async () => 'value';
    const result = await (controller as any).processOutput(output, response, {
      defaultStatusCode: 200
    });
    expect(result).toEqual(await output());
  });

  it('can handle promise output', async () => {
    const output = Promise.resolve('value');
    const result = await (controller as any).processOutput(output, response, {
      defaultStatusCode: 200
    });
    expect(result).toEqual(await output);
  });
});
