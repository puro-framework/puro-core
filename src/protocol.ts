/**
 * @file protocol.ts
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

import { Request, Response, NextFunction } from './http';

import {
  NotFoundHttpException,
  InvalidParameterHttpException,
  IHttpExceptionHints
} from './http';

import { Controller } from './controller';
import { Container } from './container';
import { Validator } from './validator';

import 'reflect-metadata';

import {
  isUndefined as _isUndefined,
  isNull as _isNull,
  isNumber as _isNumber,
  isString as _isString,
  isBoolean as _isBoolean,
  isArray as _isArray,
  isDate as _isDate,
  isPlainObject as _isPlainObject,
  isObjectLike as _isObjectLike
} from 'lodash';

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
 * Returns true if the object has a schema applied on the specified property.
 */
export const hasSchema = (target: any, propertyKey: string) => {
  return Reflect.hasMetadata(schemaSymbol, target, propertyKey);
};

/**
 * Gets the schema from an object property/method.
 */
export const getSchema = (target: any, propertyKey: string) => {
  return Reflect.getMetadata(schemaSymbol, target, propertyKey);
};

/**
 * Serializes an object by using the protocol rules.
 */
export const serialize = (
  input: any,
  inputKey: any,
  output: any,
  outputKey?: any
): any => {
  let node: any = input[inputKey];

  if (!outputKey) {
    outputKey = inputKey;
  }

  if (_isUndefined(node)) {
    // Ignore undefined values
  } else if (
    _isNull(node) ||
    _isNumber(node) ||
    _isString(node) ||
    _isBoolean(node)
  ) {
    output[outputKey] = node;
  } else if (_isDate(node)) {
    output[outputKey] = (node as Date).toISOString();
  } else if (_isArray(node)) {
    output[outputKey] = [];

    for (const k in node) {
      serialize(node, k, output[inputKey]);
    }
  } else if (_isPlainObject(node)) {
    // Serialize plain objects
    output[outputKey] = {};

    for (const k in node) {
      serialize(node, k, output[inputKey]);
    }
  } else if (_isObjectLike(node)) {
    // Serialize schema objects
    output[outputKey] = {};

    for (const k in node) {
      if (hasSchema(node, k)) {
        serialize(node, k, output[inputKey], getSchema(node, k) || k);
      }
    }
  } else {
    console.warn(`Unable to serialize "${inputKey}" of type "${typeof node}"`);
  }
};

/**
 * The validator instance for this module.
 */
const validator = new Validator();

/**
 * Validates the request and, if necessary, sends back a 4xx status code.
 */
export const validateRequest = async (request: Request, schema: any) => {
  const hints = await validator.validateRequest(request, schema);
  const params = Object.keys(hints);

  if (params.length > 0) {
    // If there's any invalid URL parameters responds with a 404, otherwise 422
    const urlParams = Object.keys(request.params);

    if (params.some(name => urlParams.includes(name))) {
      throw new NotFoundHttpException();
    }

    throw new InvalidParameterHttpException('Invalid Parameter', hints);
  }
};

/**
 * Prepare the request.
 */
export const prepareRequest = async (
  request: Request,
  schema: any
): Promise<Request> => {
  // Fill the property bucket with all request data
  request.bucket = Object.assign(
    {},
    request.query,
    request.body,
    request.params
  );

  // Create the container for the resolved entities
  request.entities = {};

  await validateRequest(request, schema);

  return request;
};

/**
 * Prepare the response.
 */
export const prepareResponse = async (
  response: Response,
  statusCode: number,
  body: any,
  hints?: IHttpExceptionHints
): Promise<Response> => {
  const output: any = {};
  serialize({ content: body }, 'content', output);

  return response.status(statusCode).send({
    status: statusCode,
    content: output['content'],
    hints: hints
  });
};

/**
 * Builds the middleware for executing a controller.
 *
 * @param {typeof Controller} controllerClass The controller class.
 * @param {Container}         container       The container instance
 */
export const buildControllerMiddleware = (
  controllerClass: typeof Controller,
  container: Container
) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const instance = new controllerClass(container);
      await instance.handleRequest(request, response);
    } catch (e) {
      next(e);
    }
  };
};
