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

import { Request, Response } from './http';
import { InvalidParameterException, HttpExceptionHints } from './http';
import { Validator } from './validator';

import 'reflect-metadata';

/**
 * The schema symbol.
 */
const schemaSymbol = Symbol('schema');

/**
 * Sets the schema on an object property/method.
 */
export const Schema = (rules?: any): Function => {
  return Reflect.metadata(schemaSymbol, rules);
};

/**
 * Gets the schema from an object property/method.
 */
export const getSchema = (target: any, propertyKey: string) => {
  return Reflect.getMetadata(schemaSymbol, target, propertyKey);
};

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
