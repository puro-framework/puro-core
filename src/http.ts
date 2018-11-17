/**
 * @file src/http.ts
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

import * as Server from 'express';
import { Request, Response, NextFunction } from 'express';

export { Server, Request, Response, NextFunction };
export { Router } from 'express';

/**
 * It represents a list of hints for an HTTP exception (i.e. a list of invalid
 * parameters with errors).
 */
export interface HttpExceptionHints {
  [key: string]: string[];
}

/**
 * It represents an exception caused by an improper HTTP request.
 *
 * The property `statusCode` indicates the standard HTTP status code associated
 * with the occurred error (i.e. 404, 500).
 *
 * The property `hints` contains a list of hints useful for debugging the
 * occurred error (i.e. the validation hints for a form field).
 */
export class HttpException extends Error {
  statusCode: number = 500;
  hints?: HttpExceptionHints;

  constructor(statusCode: number, message: string, hints?: HttpExceptionHints) {
    super(message);

    this.statusCode = statusCode;
    this.hints = hints;
  }
}

/**
 * It represents a standard HTTP status code "400 Bad Request".
 */
export class BadRequestException extends HttpException {
  constructor(message = 'Bad Request', hints?: HttpExceptionHints) {
    super(400, message, hints);
  }
}

/**
 * It represents an exception caused by an improper request parameter.
 */
export class InvalidParameterException extends HttpException {
  constructor(message = 'Invalid Parameter', hints?: HttpExceptionHints) {
    super(400, message, hints);
  }
}

/**
 * It represents a standard HTTP status code "403 Forbidden".
 */
export class AccessDeniedHttpException extends HttpException {
  constructor(message = 'Forbidden', hints?: HttpExceptionHints) {
    super(403, message, hints);
  }
}

/**
 * It represents a standard HTTP status code "404 Not Found".
 */
export class NotFoundHttpException extends HttpException {
  constructor(message = 'Not Found', hints?: HttpExceptionHints) {
    super(404, message, hints);
  }
}

/**
 * It represents a standard HTTP status code "405 Method Not Allowed".
 */
export class MethodNotAllowedHttpException extends HttpException {
  constructor(message = 'Method Not Allowed', hints?: HttpExceptionHints) {
    super(405, message, hints);
  }
}

/**
 * The request handler.
 */
export const requestHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  next();
};

/**
 * The response handler.
 */
export const responseHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // Add a new method for setting the response content
  response.content = function(
    statusCode: number,
    body: any,
    hints?: HttpExceptionHints
  ) {
    return this.status(statusCode).send({
      status: statusCode,
      content: body,
      hints: hints
    });
  };

  next();
};

/**
 * The error handler.
 */
export const errorHandler = async (
  exception: any,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let hints = undefined;

  if (exception instanceof HttpException) {
    [statusCode, message, hints] = [
      exception.statusCode,
      exception.message,
      exception.hints
    ];
  }

  response.content(statusCode, message, hints);
};

/**
 * The 404 error handler.
 */
export const error404Handler = async (request: Request, response: Response) => {
  response.content(404, 'Not Found');
};
