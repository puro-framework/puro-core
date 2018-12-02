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

import * as validator from 'validator';

const ConstraintHintPlaceholderRe = /%([^%]+)%/g;

/**
 * The constraint methods.
 */
const ConstraintMethods: any = {
  isAfter: async (v: string, o: any) =>
    !v.length || validator.isAfter(v, o.date),
  isAlpha: async (v: string, o: any) =>
    !v.length || validator.isAlpha(v, o.locale),
  isAlphanumeric: async (v: string, o: any) =>
    !v.length || validator.isAlphanumeric(v, o.locale),
  isAscii: async (v: string) => !v.length || validator.isAscii(v),
  isBase64: async (v: string) => !v.length || validator.isBase64(v),
  isBefore: async (v: string, o: any) =>
    !v.length || validator.isBefore(v, o.date),
  isBoolean: async (v: string) => !v.length || validator.isBoolean(v),
  isByteLength: async (v: string, o: any) =>
    !v.length || validator.isByteLength(v, o),
  isCreditCard: async (v: string) => !v.length || validator.isCreditCard(v),
  isCurrency: async (v: string, o: any) =>
    !v.length || validator.isCurrency(v, o),
  isDecimal: async (v: string, o: any) =>
    !v.length || validator.isDecimal(v, o),
  isEmail: async (v: string, o: any) => !v.length || validator.isEmail(v, o),
  isFQDN: async (v: string, o: any) => !v.length || validator.isFQDN(v, o),
  isFloat: async (v: string, o: any) => !v.length || validator.isFloat(v, o),
  isHash: async (v: string, o: any) =>
    !v.length || validator.isHash(v, o.algorithm),
  isHexadecimal: async (v: string) => !v.length || validator.isHexadecimal(v),
  isIP: async (v: string, o: any) => !v.length || validator.isIP(v, o.version),
  isIPRange: async (v: string) => !v.length || (validator as any).isIPRange(v),
  isISO8601: async (v: string) => !v.length || validator.isISO8601(v),
  isNotEmpty: async (v: string) => v && v.length > 0,
  isRFC3339: async (v: string) => !v.length || (validator as any).isRFC3339(v),
  isISO31661Alpha2: async (v: string) =>
    !v.length || validator.isISO31661Alpha2(v),
  isISO31661Alpha3: async (v: string) =>
    !v.length || (validator as any).isISO31661Alpha3(v),
  isIn: async (v: string, o: any) => !v.length || validator.isIn(v, o.values),
  isInt: async (v: string, o: any) => !v.length || validator.isInt(v, o),
  isJSON: async (v: string) => !v.length || validator.isJSON(v),
  isJWT: async (v: string) => !v.length || (validator as any).isJWT(v),
  isLatLong: async (v: string) => !v.length || validator.isLatLong(v),
  isLength: async (v: string, o: any) => !v.length || validator.isLength(v, o),
  isLowercase: async (v: string) => !v.length || validator.isLowercase(v),
  isMACAddress: async (v: string) => !v.length || validator.isMACAddress(v),
  isMimeType: async (v: string) => !v.length || validator.isMimeType(v),
  isMobilePhone: async (v: string, o: any) =>
    !v.length || validator.isMobilePhone(v, o.locale, o),
  isNumeric: async (v: string, o: any) =>
    !v.length || validator.isNumeric(v, o),
  isPort: async (v: string) => !v.length || validator.isPort(v),
  isPostalCode: async (v: string, o: any) =>
    !v.length || validator.isPostalCode(v, o.locale),
  isURL: async (v: string, o: any) => !v.length || validator.isURL(v, o),
  isUUID: async (v: string, o: any) =>
    !v.length || validator.isUUID(v, o.version),
  isUppercase: async (v: string) => !v.length || validator.isUppercase(v),
  isWhitelisted: async (v: string, o: any) =>
    !v.length || validator.isWhitelisted(v, o.chars),
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
  }
};

/**
 * The constraint hints.
 */
const ConstraintHints: { [key: string]: string } = {
  isAfter: 'The parameter must be a date after %date%',
  isAlpha: 'The parameter must contain only letters',
  isAlphanumeric: 'The parameter must contain only letters and numbers',
  isAscii: 'The parameter must be an ASCII string',
  isBase64: 'The parameter must be a Base64 string',
  isBefore: 'The parameter must be a date before %date%',
  isBoolean: 'The parameter must be a boolean',
  isByteLength: 'The parameter must be between %min% and %max% bytes',
  isCreditCard: 'The parameter must be a valid credit card number',
  isCurrency: 'The parameter must be a valid currency amount',
  isDecimal: 'The parameter must be a decimal',
  isEmail: 'The parameter must be a valid email',
  isEntityId: 'The parameter must be a valid entity ID',
  isFQDN: 'The parameter must be a fully qualified domain name',
  isFloat: 'The parameter must be a floating-point number',
  isHash: 'The parameter must be a valid %algorithm% hash',
  isHexadecimal: 'The parameter must be a hexadecimal number',
  isIP: 'The parameter must be a valid IP address',
  isIPRange: 'The parameter must be a valid IP address range',
  isISO8601: 'The parameter must be a valid ISO 8601 date',
  isNotEmpty: 'The parameter cannot be empty',
  isRFC3339: 'The parameter must be a valid RFC 3339 date',
  isISO31661Alpha2:
    'The parameter must be a valid ISO 3166-1 alpha-2 country code',
  isISO31661Alpha3:
    'The parameter must be a valid ISO 3166-1 alpha-3 country code',
  isIn: 'The parameter must be one of %values%',
  isInt: 'The parameter must be a integer number',
  isJSON: 'The parameter must be a valid JSON',
  isJWT: 'The parameter must be a valid JWT',
  isLatLong: 'The parameter must be a valid latitude-longitude coordinate',
  isLength: 'The parameter must be between %min% and %max% characters',
  isLowercase: 'The parameter must be a lowercase string',
  isMACAddress: 'The parameter must be a valid MAC address',
  isMimeType: 'The parameter must be a valid MIME type format',
  isMobilePhone: 'The parameter must be a valid mobile phone number',
  isNumeric: 'The parameter must be a number',
  isPort: 'The parameter must be a port number',
  isPostalCode: 'The parameter must be a valid postal code',
  isURL: 'The parameter must be a valid URL',
  isUUID: 'The parameter must be a valid UUID',
  isUppercase: 'The parameter must be an uppercase string',
  isWhitelisted: 'The parameter must contain only the characters "%chars%"'
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
      const hints = await this.validateValue(
        String(request.bucket[name] || ''),
        schema[name],
        context
      );

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
    return ConstraintHints[constraint].replace(
      ConstraintHintPlaceholderRe,
      (match, placeholder) => options[placeholder]
    );
  }
}
