/**
 * @file src/protocol.ts
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
import { InvalidParameterException, HttpExceptionHints } from '@puro/http';
import { Validator } from '@puro/validator';

/**
 * The validator instance for this module.
 */
const validator = new Validator();

/**
 * Prepare the request.
 */
export const prepareRequest = (request: Request, schema: any): Request => {
  // Fill the property bucket with all request data
  request.bucket = Object.assign(
    {},
    request.query,
    request.body,
    request.params
  );

  // Validate the request by using the schema
  const hints = validator.validateRequest(request, schema);

  if (Object.keys(hints).length > 0) {
    throw new InvalidParameterException('Invalid Parameter', hints);
  }

  return request;
};

/**
 * Prepare the response.
 */
export const prepareResponse = (
  response: Response,
  statusCode: number,
  body: any,
  hints?: HttpExceptionHints
): Response => {
  return response.status(statusCode).send({
    status: statusCode,
    content: body,
    hints: hints
  });
};

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
