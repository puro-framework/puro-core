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

import * as validator from 'validator';

const ConstraintHintPlaceholderRe = /%([^%]+)%/g;

/**
 * The constraint methods.
 */
/* istanbul ignore next */
const ConstraintMethods: any = {
  isAfter: (v: string, o: any) => !v.length || validator.isAfter(v, o.date),
  isAlpha: (v: string, o: any) => !v.length || validator.isAlpha(v, o.locale),
  isAlphanumeric: (v: string, o: any) =>
    !v.length || validator.isAlphanumeric(v, o.locale),
  isAscii: (v: any) => !v.length || validator.isAscii(v),
  isBase64: (v: any) => !v.length || validator.isBase64(v),
  isBefore: (v: string, o: any) => !v.length || validator.isBefore(v, o.date),
  isBoolean: (v: any) => !v.length || validator.isBoolean(v),
  isByteLength: (v: string, o: any) =>
    !v.length || validator.isByteLength(v, o),
  isCreditCard: (v: any) => !v.length || validator.isCreditCard(v),
  isCurrency: (v: string, o: any) => !v.length || validator.isCurrency(v, o),
  isDecimal: (v: string, o: any) => !v.length || validator.isDecimal(v, o),
  isEmail: (v: string, o: any) => !v.length || validator.isEmail(v, o),
  isFQDN: (v: string, o: any) => !v.length || validator.isFQDN(v, o),
  isFloat: (v: string, o: any) => !v.length || validator.isFloat(v, o),
  isHash: (v: string, o: any) => !v.length || validator.isHash(v, o.algorithm),
  isHexadecimal: (v: any) => !v.length || validator.isHexadecimal(v),
  isIdentityCard: (v: string, o: any) =>
    !v.length || (validator as any).isIdentityCard(v, o.locale),
  isIP: (v: string, o: any) => !v.length || validator.isIP(v, o.version),
  isIPRange: (v: any) => !v.length || (validator as any).isIPRange(v),
  isISO8601: (v: any) => !v.length || validator.isISO8601(v),
  isRequired: (v: any) => v && v.length > 0,
  isRFC3339: (v: any) => !v.length || (validator as any).isRFC3339(v),
  isISO31661Alpha2: (v: any) => !v.length || validator.isISO31661Alpha2(v),
  isISO31661Alpha3: (v: any) =>
    !v.length || (validator as any).isISO31661Alpha3(v),
  isIn: (v: string, o: any) => !v.length || validator.isIn(v, o.values),
  isInt: (v: string, o: any) => !v.length || validator.isInt(v, o),
  isJSON: (v: any) => !v.length || validator.isJSON(v),
  isJWT: (v: any) => !v.length || (validator as any).isJWT(v),
  isLatLong: (v: any) => !v.length || validator.isLatLong(v),
  isLength: (v: string, o: any) => !v.length || validator.isLength(v, o),
  isLowercase: (v: any) => !v.length || validator.isLowercase(v),
  isMACAddress: (v: any) => !v.length || validator.isMACAddress(v),
  isMimeType: (v: any) => !v.length || validator.isMimeType(v),
  isMobilePhone: (v: string, o: any) =>
    !v.length || validator.isMobilePhone(v, o.locale, o),
  isNumeric: (v: string, o: any) => !v.length || validator.isNumeric(v, o),
  isPort: (v: any) => !v.length || validator.isPort(v),
  isPostalCode: (v: string, o: any) =>
    !v.length || validator.isPostalCode(v, o.locale),
  isURL: (v: string, o: any) => !v.length || validator.isURL(v, o),
  isUUID: (v: string, o: any) => !v.length || validator.isUUID(v, o.version),
  isUppercase: (v: any) => !v.length || validator.isUppercase(v),
  isWhitelisted: (v: string, o: any) =>
    !v.length || validator.isWhitelisted(v, o.chars)
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
  isFQDN: 'The parameter must be a fully qualified domain name',
  isFloat: 'The parameter must be a floating-point number',
  isHash: 'The parameter must be a valid %algorithm% hash',
  isHexadecimal: 'The parameter must be a hexadecimal number',
  isIdentityCard: 'The parameter must be a valid identity card code',
  isIP: 'The parameter must be a valid IP address',
  isIPRange: 'The parameter must be a valid IP address range',
  isISO8601: 'The parameter must be a valid ISO 8601 date',
  isRequired: 'The parameter is required',
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
  isWhitelisted: 'The parameter must contain only %chars%'
};

/**
 * The validator.
 */
export class Validator {
  /**
   * Validates a value against a list of constraints.
   */
  validateValue(value: string, constraints: any): string[] {
    return Object.keys(constraints).reduce((hints: string[], name: string) => {
      const method = ConstraintMethods[name];

      if (!method) {
        throw new Error(`The constraint "${name}" does not exist`);
      }

      const options = constraints[name];

      if (!method(value, options)) {
        return hints.concat(this.prepareHint(name, options));
      }

      return hints;
    }, []);
  }

  /**
   * Validates the request against a list of constraints in a schema.
   */
  validateRequest(request: Request, schema: any) {
    return Object.keys(schema).reduce((output: any, name: string) => {
      const hints = this.validateValue(
        String(request.bucket[name] || ''),
        schema[name]
      );

      if (hints.length > 0) {
        output[name] = hints;
      }

      return output;
    }, {});
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
