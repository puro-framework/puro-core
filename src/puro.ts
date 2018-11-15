/**
 * @file src/bootstrap.ts
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

import { Server, Request, Response, NextFunction } from '@pure/http';

import {
  requestHandler,
  responseHandler,
  errorHandler,
  error404Handler
} from '@pure/http';

import { container } from '@pure/container';

export const Puro = () => {
  /**
   * Create the server instance.
   */
  const server = Server();

  /**
   * Install the request and response handlers.
   */
  server.use(requestHandler);
  server.use(responseHandler);

  // TODO: install the routers here

  /**
   * Install the error handlers.
   */
  server.use(errorHandler);
  server.use(error404Handler);

  /**
   * The middleware to clean up the container services.
   */
  server.use(
    async (request: Request, response: Response, next: NextFunction) => {
      response.on('finish', async () => {
        await container.shoutdown();
      });

      next();
    }
  );

  return server;
};
