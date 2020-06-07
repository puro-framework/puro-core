/**
 * @file validator.ts
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

import { Request } from './http';
import { getEntity } from './database';

import isAfter from 'validator/lib/isAfter';
import isAlpha from 'validator/lib/isAlpha';
import isAlphanumeric from 'validator/lib/isAlphanumeric';
import isAscii from 'validator/lib/isAscii';
import isBase64 from 'validator/lib/isBase64';
import isBefore from 'validator/lib/isBefore';
import isBoolean from 'validator/lib/isBoolean';
import isByteLength from 'validator/lib/isByteLength';
import isCreditCard from 'validator/lib/isCreditCard';
import isCurrency from 'validator/lib/isCurrency';
import isDecimal from 'validator/lib/isDecimal';
import isEmail from 'validator/lib/isEmail';
import isFQDN from 'validator/lib/isFQDN';
import isFloat from 'validator/lib/isFloat';
import isHash from 'validator/lib/isHash';
import isHexadecimal from 'validator/lib/isHexadecimal';
import isIP from 'validator/lib/isIP';
import isIPRange from 'validator/lib/isIPRange';
import isISO31661Alpha2 from 'validator/lib/isISO31661Alpha2';
import isISO31661Alpha3 from 'validator/lib/isISO31661Alpha3';
import isISO8601 from 'validator/lib/isISO8601';
import isIn from 'validator/lib/isIn';
import isInt from 'validator/lib/isInt';
import isJSON from 'validator/lib/isJSON';
import isJWT from 'validator/lib/isJWT';
import isLatLong from 'validator/lib/isLatLong';
import isLength from 'validator/lib/isLength';
import isLowercase from 'validator/lib/isLowercase';
import isMACAddress from 'validator/lib/isMACAddress';
import isMimeType from 'validator/lib/isMimeType';
import isMobilePhone from 'validator/lib/isMobilePhone';
import isNumeric from 'validator/lib/isNumeric';
import isPort from 'validator/lib/isPort';
import isPostalCode from 'validator/lib/isPostalCode';
import isRFC3339 from 'validator/lib/isRFC3339';
import isURL from 'validator/lib/isURL';
import isUUID from 'validator/lib/isUUID';
import isUppercase from 'validator/lib/isUppercase';
import isWhitelisted from 'validator/lib/isWhitelisted';

import { isNil as _isNil } from 'lodash';

/**
 * The constraint methods.
 */
const ConstraintMethods: any = {
  isAfter: async (v: string, o: any) => !v.length || isAfter(v, o.date),
  isAlpha: async (v: string, o: any) => !v.length || isAlpha(v, o.locale),
  isAlphanumeric: async (v: string, o: any) =>
    !v.length || isAlphanumeric(v, o.locale),
  isAscii: async (v: string) => !v.length || isAscii(v),
  isBase64: async (v: string) => !v.length || isBase64(v),
  isBefore: async (v: string, o: any) => !v.length || isBefore(v, o.date),
  isBoolean: async (v: string) => !v.length || isBoolean(v),
  isByteLength: async (v: string, o: any) => !v.length || isByteLength(v, o),
  isCreditCard: async (v: string) => !v.length || isCreditCard(v),
  isCurrency: async (v: string, o: any) => !v.length || isCurrency(v, o),
  isDecimal: async (v: string, o: any) => !v.length || isDecimal(v, o),
  isEmail: async (v: string, o: any) => !v.length || isEmail(v, o),
  isFQDN: async (v: string, o: any) => !v.length || isFQDN(v, o),
  isFloat: async (v: string, o: any) => !v.length || isFloat(v, o),
  isHash: async (v: string, o: any) => !v.length || isHash(v, o.algorithm),
  isHexadecimal: async (v: string) => !v.length || isHexadecimal(v),
  isIP: async (v: string, o: any) => !v.length || isIP(v, o.version),
  isIPRange: async (v: string) => !v.length || isIPRange(v),
  isISO8601: async (v: string) => !v.length || isISO8601(v),
  isNotEmpty: async (v: string) => v && v.length > 0,
  isRFC3339: async (v: string) => !v.length || isRFC3339(v),
  isISO31661Alpha2: async (v: string) => !v.length || isISO31661Alpha2(v),
  isISO31661Alpha3: async (v: string) => !v.length || isISO31661Alpha3(v),
  isIn: async (v: string, o: any) => !v.length || isIn(v, o.values),
  isInt: async (v: string, o: any) => !v.length || isInt(v, o),
  isJSON: async (v: string) => !v.length || isJSON(v),
  isJWT: async (v: string) => !v.length || isJWT(v),
  isLatLong: async (v: string) => !v.length || isLatLong(v),
  isLength: async (v: string, o: any) => !v.length || isLength(v, o),
  isLowercase: async (v: string) => !v.length || isLowercase(v),
  isMACAddress: async (v: string) => !v.length || isMACAddress(v),
  isMimeType: async (v: string) => !v.length || isMimeType(v),
  isMobilePhone: async (v: string, o: any) =>
    !v.length || isMobilePhone(v, o.locale, o),
  isNumeric: async (v: string, o: any) => !v.length || isNumeric(v, o),
  isPort: async (v: string) => !v.length || isPort(v),
  isPostalCode: async (v: string, o: any) =>
    !v.length || isPostalCode(v, o.locale),
  isURL: async (v: string, o: any) => !v.length || isURL(v, o),
  isUUID: async (v: string, o: any) => !v.length || isUUID(v, o.version),
  isUppercase: async (v: string) => !v.length || isUppercase(v),
  isWhitelisted: async (v: string, o: any) =>
    !v.length || isWhitelisted(v, o.chars),
  isEntityId: async (v: string, o: any, c: any) => {
    const entity = await getEntity(o.type, v);

    if (!entity) {
      return false;
    }

    // Add the resolved entity to the response
    const request = c.request;

    if (request) {
      request.entities[o.name] = entity;
    }

    return true;
  },
};

/**
 * The constraint hints.
 */
const ConstraintHintBuilder: { [key: string]: (options: any) => string } = {
  isAfter: ({ date }) => `The parameter must be a date after ${date}`,
  isAlpha: () => 'The parameter must contain only letters',
  isAlphanumeric: () => 'The parameter must contain only letters and numbers',
  isAscii: () => 'The parameter must be an ASCII string',
  isBase64: () => 'The parameter must be a Base64 string',
  isBefore: ({ date }) => `The parameter must be a date before ${date}`,
  isBoolean: () => 'The parameter must be a boolean',
  isByteLength: ({ min, max }) =>
    `The parameter must be between ${min} and ${max} bytes`,
  isCreditCard: () => 'The parameter must be a valid credit card number',
  isCurrency: () => 'The parameter must be a valid currency amount',
  isDecimal: () => 'The parameter must be a decimal',
  isEmail: () => 'The parameter must be a valid email',
  isEntityId: () => 'The parameter must be a valid entity ID',
  isFQDN: () => 'The parameter must be a fully qualified domain name',
  isFloat: () => 'The parameter must be a floating-point number',
  isHash: ({ algorithm }) => `The parameter must be a valid ${algorithm} hash`,
  isHexadecimal: () => 'The parameter must be a hexadecimal number',
  isIP: () => 'The parameter must be a valid IP address',
  isIPRange: () => 'The parameter must be a valid IP address range',
  isISO8601: () => 'The parameter must be a valid ISO 8601 date',
  isNotEmpty: () => 'The parameter cannot be empty',
  isRFC3339: () => 'The parameter must be a valid RFC 3339 date',
  isISO31661Alpha2: () =>
    'The parameter must be a valid ISO 3166-1 alpha-2 country code',
  isISO31661Alpha3: () =>
    'The parameter must be a valid ISO 3166-1 alpha-3 country code',
  isIn: ({ values }) => `The parameter must be one of ${values}`,
  isInt: ({ min, max }) => {
    if (!_isNil(min) && !_isNil(max)) {
      return `The parameter must be a integer between ${min} and ${max}`;
    }

    return 'The parameter must be a integer number';
  },
  isJSON: () => 'The parameter must be a valid JSON',
  isJWT: () => 'The parameter must be a valid JWT',
  isLatLong: () =>
    'The parameter must be a valid latitude-longitude coordinate',
  isLength: ({ min, max }) =>
    `The parameter must be between ${min} and ${max} characters`,
  isLowercase: () => 'The parameter must be a lowercase string',
  isMACAddress: () => 'The parameter must be a valid MAC address',
  isMimeType: () => 'The parameter must be a valid MIME type format',
  isMobilePhone: () => 'The parameter must be a valid mobile phone number',
  isNumeric: () => 'The parameter must be a number',
  isPort: () => 'The parameter must be a port number',
  isPostalCode: () => 'The parameter must be a valid postal code',
  isURL: () => 'The parameter must be a valid URL',
  isUUID: () => 'The parameter must be a valid UUID',
  isUppercase: () => 'The parameter must be an uppercase string',
  isWhitelisted: ({ chars }) =>
    `The parameter must contain only the characters "${chars}"`,
};

/**
 * The validator.
 */
export class Validator {
  /**
   * Validates a value against a list of constraints.
   */
  async validateValue(
    value: string,
    constraints: any,
    context: any = {}
  ): Promise<string[]> {
    let hints: string[] = [];

    for (const name in constraints) {
      const method = ConstraintMethods[name];

      if (!method) {
        throw new Error(`The constraint "${name}" does not exist`);
      }

      const options = constraints[name];
      const result = await method(value, options, context);

      if (!result) {
        hints = hints.concat(this.prepareHint(name, options));
      }
    }

    return hints;
  }

  /**
   * Validates the request against a list of constraints in a schema.
   */
  async validateRequest(request: Request, schema: any) {
    const output: any = {};
    const context: any = { request };

    for (const name in schema) {
      const value = !_isNil(request.bucket[name])
        ? String(request.bucket[name])
        : '';

      const hints = await this.validateValue(value, schema[name], context);

      if (hints.length > 0) {
        output[name] = hints;
      }
    }

    return output;
  }

  /**
   * Prepares the hint message.
   */
  private prepareHint(constraint: string, options: any) {
    return ConstraintHintBuilder[constraint](options);
  }
}
