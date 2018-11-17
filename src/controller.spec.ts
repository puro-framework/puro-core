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

import { Request, Response, Middleware } from '@testing/mocks';
import { mock } from '@testing/mocks';

import { MethodNotAllowedHttpException } from '@pure/http';
import { Controller, schema } from '@pure/controller';

describe('schema', () => {
  it('can annotate methods', async () => {
    class Test {
      @schema({ key: 'value' })
      method() {}
    }

    expect((new Test().method as any).schema).toEqual({
      rules: { key: 'value' }
    });
  });
});

describe('controller', () => {
  let request: Request;
  let response: Response;
  let controller: any;

  beforeEach(() => {
    request = new Request();
    response = new Response();

    class ControllerMock extends Controller {}
    controller = new ControllerMock();
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
      expect(e).toEqual(new Error('Not Implemented'));
    }
  });

  it('can handle unsupported GET methods', async () => {
    try {
      request.method = 'GET';
      await mock<Middleware>(controller.handleRequest)(request, response);
    } catch (e) {
      expect(e).toEqual(new Error('Not Implemented'));
    }
  });

  it('can handle unsupported PUT methods', async () => {
    try {
      request.method = 'PUT';
      await mock<Middleware>(controller.handleRequest)(request, response);
    } catch (e) {
      expect(e).toEqual(new Error('Not Implemented'));
    }
  });

  it('can handle unsupported DELETE methods', async () => {
    try {
      request.method = 'DELETE';
      await mock<Middleware>(controller.handleRequest)(request, response);
    } catch (e) {
      expect(e).toEqual(new Error('Not Implemented'));
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
      async create(request: Request) {
        return 'Response Content';
      }
    }

    controller = new CreateController();
    controller.handleRequest = controller.handleRequest.bind(controller);

    await mock<Middleware>(controller.handleRequest)(request, response);
    expect(response.content).toBeCalledWith(201, 'Response Content');
  });

  it('can process READ functions', async () => {
    request.method = 'GET';

    class UpdateController extends Controller {
      async read(request: Request) {
        return 'Response Content';
      }
    }

    controller = new UpdateController();
    controller.handleRequest = controller.handleRequest.bind(controller);

    await mock<Middleware>(controller.handleRequest)(request, response);
    expect(response.content).toBeCalledWith(200, 'Response Content');
  });

  it('can process UPDATE functions', async () => {
    request.method = 'PUT';

    class UpdateController extends Controller {
      async update(request: Request) {
        return 'Response Content';
      }
    }

    controller = new UpdateController();
    controller.handleRequest = controller.handleRequest.bind(controller);

    await mock<Middleware>(controller.handleRequest)(request, response);
    expect(response.content).toBeCalledWith(204, 'Response Content');
  });

  it('can process DELETE functions', async () => {
    request.method = 'DELETE';

    class DeleteController extends Controller {
      async remove(request: Request) {
        return 'Response Content';
      }
    }

    controller = new DeleteController();
    controller.handleRequest = controller.handleRequest.bind(controller);

    await mock<Middleware>(controller.handleRequest)(request, response);
    expect(response.content).toBeCalledWith(204, 'Response Content');
  });

  it('can handle plain object output', async () => {
    const options = { defaultStatusCode: 200 };
    const output = { key: 'value' };
    await (controller as any).processOutput(output, response, options);
    expect(response.content).toBeCalledWith(200, output);
  });

  it('can handle array output', async () => {
    const options = { defaultStatusCode: 200 };
    const output = [1, 2, 3];
    await (controller as any).processOutput(output, response, options);
    expect(response.content).toBeCalledWith(200, output);
  });

  it('can handle async function output', async () => {
    const options = { defaultStatusCode: 200 };
    const output = async () => 'value';
    await (controller as any).processOutput(output, response, options);
    expect(response.content).toBeCalledWith(200, await output());
  });

  it('can handle promise output', async () => {
    const options = { defaultStatusCode: 200 };
    const output = Promise.resolve('value');
    await (controller as any).processOutput(output, response, options);
    expect(response.content).toBeCalledWith(200, await output);
  });
});
