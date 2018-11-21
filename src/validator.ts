/**
 * @file src/validator.ts
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

import { Request } from '@puro/http';

import * as validator from 'validator';

const ConstraintHintPlaceholderRe = /%([^%]+)%/g;

/**
 * This map is used for making the method arguments in validator.js consistent
 * with each other.
 *
 * It follows the format:
 *
 *  {
 *    <method_name>: [<option_name>, ...],
 *    ...
 *  }
 *
 * where the option name `$options` represents the entire options object.
 *
 * The position of the specified option names indicates where the TODO
 */
const ConstraintArgs: { [key: string]: string[] } = {
  isAfter: ['date'],
  isAlpha: ['locale'],
  isAlphanumeric: ['locale'],
  isAscii: [],
  isBase64: [],
  isBefore: ['date'],
  isBoolean: [],
  isByteLength: ['$options'],
  isCreditCard: [],
  isCurrency: ['$options'],
  isDecimal: ['$options'],
  isEmail: ['$options'],
  isFQDN: ['$options'],
  isFloat: ['$options'],
  isHash: ['algorithm'],
  isHexadecimal: [],
  isIdentityCard: ['locale'],
  isIP: ['version'],
  isIPRange: [],
  isISO8601: [],
  isRFC3339: [],
  isISO31661Alpha2: [],
  isISO31661Alpha3: [],
  isIn: ['values'],
  isInt: ['$options'],
  isJSON: [],
  isJWT: [],
  isLatLong: [],
  isLength: ['$options'],
  isLowercase: [],
  isMACAddress: [],
  isMimeType: [],
  isMobilePhone: ['locale', '$options'],
  isNumeric: ['$options'],
  isPort: [],
  isPostalCode: ['locale'],
  isURL: ['$options'],
  isUUID: ['version'],
  isUppercase: [],
  isWhitelisted: ['chars']
};

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
 * The constraint validator.
 */
export class ConstraintValidator {
  method: Function;
  args: string[];
  hint: string;

  /**
   * Constructor method.
   */
  constructor(name: string, options: any) {
    this.method = this.prepareMethod(name);
    this.args = this.prepareArgs(name, options);
    this.hint = this.prepareHint(name, options);
  }

  /**
   * Validates a value.
   */
  validate(value: any) {
    return this.method.apply(null, [value].concat(this.args));
  }

  /**
   * Prepares the validator method.
   */
  private prepareMethod(constraint: string) {
    const method = (validator as any)[constraint];

    if (!method) {
      throw new Error(`The constraint "${constraint}" does not exist`);
    }

    return method;
  }

  /**
   * Prepares the arguments for the validator method.
   */
  private prepareArgs(constraint: string, options: any) {
    return ConstraintArgs[constraint].reduce((output: any, arg: string) => {
      if (arg === '$options') {
        output.push(options);
      } else {
        output.push(options[arg]);
      }
      return output;
    }, []);
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

/**
 * The validator.
 */
export class Validator {
  /**
   * Validates a value against a list of constraints.
   */
  validateValue(value: string, constraints: any): string[] {
    return Object.keys(constraints).reduce((hints: string[], name: string) => {
      const constraintValidator = new ConstraintValidator(
        name,
        constraints[name]
      );

      if (!constraintValidator.validate(value)) {
        return hints.concat(constraintValidator.hint);
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
        String(request.bucket[name]),
        schema[name]
      );

      if (hints.length > 0) {
        output[name] = hints;
      }

      return output;
    }, {});
  }
}
