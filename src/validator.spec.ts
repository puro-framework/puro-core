/**
 * @file src/validator.spec.ts
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

import { Request } from '@testing/mocks';
import { Validator, ConstraintValidator } from '@puro/validator';

describe('validator', () => {
  let validator: Validator;

  beforeEach(() => {
    validator = new Validator();
  });

  it('can prepare "isAfter" arguments', async () => {
    const options = { date: 1, other: 9 };
    const args = new ConstraintValidator('isAfter', options).args;
    expect(args).toEqual([1]);
  });

  it('can prepare "isAlpha" arguments', async () => {
    const options = { locale: 1, other: 9 };
    const args = new ConstraintValidator('isAlpha', options).args;
    expect(args).toEqual([1]);
  });

  it('can prepare "isAlphanumeric" arguments', async () => {
    const options = { locale: 1, other: 9 };
    const args = new ConstraintValidator('isAlphanumeric', options).args;
    expect(args).toEqual([1]);
  });

  it('can prepare "isAscii" arguments', async () => {
    const options = { other: 9 };
    const args = new ConstraintValidator('isAscii', options).args;
    expect(args).toEqual([]);
  });

  it('can prepare "isBase64" arguments', async () => {
    const options = { other: 9 };
    const args = new ConstraintValidator('isBase64', options).args;
    expect(args).toEqual([]);
  });

  it('can prepare "isBefore" arguments', async () => {
    const options = { date: 1, other: 9 };
    const args = new ConstraintValidator('isBefore', options).args;
    expect(args).toEqual([1]);
  });

  it('can prepare "isBoolean" arguments', async () => {
    const options = { other: 9 };
    const args = new ConstraintValidator('isBoolean', options).args;
    expect(args).toEqual([]);
  });

  it('can prepare "isByteLength" arguments', async () => {
    const options = { other: 9 };
    const args = new ConstraintValidator('isByteLength', options).args;
    expect(args).toEqual([{ other: 9 }]);
  });

  it('can prepare "isCreditCard" arguments', async () => {
    const options = { other: 9 };
    const args = new ConstraintValidator('isCreditCard', options).args;
    expect(args).toEqual([]);
  });

  it('can prepare "isCurrency" arguments', async () => {
    const options = { other: 9 };
    const args = new ConstraintValidator('isCurrency', options).args;
    expect(args).toEqual([{ other: 9 }]);
  });

  it('can prepare "isDecimal" arguments', async () => {
    const options = { other: 9 };
    const args = new ConstraintValidator('isDecimal', options).args;
    expect(args).toEqual([{ other: 9 }]);
  });

  it('can prepare "isEmail" arguments', async () => {
    const options = { other: 9 };
    const args = new ConstraintValidator('isEmail', options).args;
    expect(args).toEqual([{ other: 9 }]);
  });

  it('can prepare "isFQDN" arguments', async () => {
    const options = { other: 9 };
    const args = new ConstraintValidator('isFQDN', options).args;
    expect(args).toEqual([{ other: 9 }]);
  });

  it('can prepare "isFloat" arguments', async () => {
    const options = { other: 9 };
    const args = new ConstraintValidator('isFloat', options).args;
    expect(args).toEqual([{ other: 9 }]);
  });

  it('can prepare "isHash" arguments', async () => {
    const options = { algorithm: 1, other: 9 };
    const args = new ConstraintValidator('isHash', options).args;
    expect(args).toEqual([1]);
  });

  it('can prepare "isHexadecimal" arguments', async () => {
    const options = { other: 9 };
    const args = new ConstraintValidator('isHexadecimal', options).args;
    expect(args).toEqual([]);
  });

  it('can prepare "isIdentityCard" arguments', async () => {
    const options = { locale: 1, other: 9 };
    const args = new ConstraintValidator('isIdentityCard', options).args;
    expect(args).toEqual([1]);
  });

  it('can prepare "isIP" arguments', async () => {
    const options = { version: 1, other: 9 };
    const args = new ConstraintValidator('isIP', options).args;
    expect(args).toEqual([1]);
  });

  it('can prepare "isISO8601" arguments', async () => {
    const options = { other: 9 };
    const args = new ConstraintValidator('isISO8601', options).args;
    expect(args).toEqual([]);
  });

  it('can prepare "isRFC3339" arguments', async () => {
    const options = { other: 9 };
    const args = new ConstraintValidator('isRFC3339', options).args;
    expect(args).toEqual([]);
  });

  it('can prepare "isISO31661Alpha2" arguments', async () => {
    const options = { other: 9 };
    const args = new ConstraintValidator('isISO31661Alpha2', options).args;
    expect(args).toEqual([]);
  });

  it('can prepare "isISO31661Alpha3" arguments', async () => {
    const options = { other: 9 };
    const args = new ConstraintValidator('isISO31661Alpha3', options).args;
    expect(args).toEqual([]);
  });

  it('can prepare "isIn" arguments', async () => {
    const options = { values: 1, other: 9 };
    const args = new ConstraintValidator('isIn', options).args;
    expect(args).toEqual([1]);
  });

  it('can prepare "isInt" arguments', async () => {
    const options = { other: 9 };
    const args = new ConstraintValidator('isInt', options).args;
    expect(args).toEqual([{ other: 9 }]);
  });

  it('can prepare "isJSON" arguments', async () => {
    const options = { other: 9 };
    const args = new ConstraintValidator('isJSON', options).args;
    expect(args).toEqual([]);
  });

  it('can prepare "isJWT" arguments', async () => {
    const options = { other: 9 };
    const args = new ConstraintValidator('isJWT', options).args;
    expect(args).toEqual([]);
  });

  it('can prepare "isLatLong" arguments', async () => {
    const options = { other: 9 };
    const args = new ConstraintValidator('isLatLong', options).args;
    expect(args).toEqual([]);
  });

  it('can prepare "isLength" arguments', async () => {
    const options = { other: 9 };
    const args = new ConstraintValidator('isLength', options).args;
    expect(args).toEqual([{ other: 9 }]);
  });

  it('can prepare "isLowercase" arguments', async () => {
    const options = { other: 9 };
    const args = new ConstraintValidator('isLowercase', options).args;
    expect(args).toEqual([]);
  });

  it('can prepare "isMACAddress" arguments', async () => {
    const options = { other: 9 };
    const args = new ConstraintValidator('isMACAddress', options).args;
    expect(args).toEqual([]);
  });

  it('can prepare "isMimeType" arguments', async () => {
    const options = { other: 9 };
    const args = new ConstraintValidator('isMimeType', options).args;
    expect(args).toEqual([]);
  });

  it('can prepare "isMobilePhone" arguments', async () => {
    const options = { locale: 1, other: 9 };
    const args = new ConstraintValidator('isMobilePhone', options).args;
    expect(args).toEqual([1, { locale: 1, other: 9 }]);
  });

  it('can prepare "isNumeric" arguments', async () => {
    const options = { other: 9 };
    const args = new ConstraintValidator('isNumeric', options).args;
    expect(args).toEqual([{ other: 9 }]);
  });

  it('can prepare "isPort" arguments', async () => {
    const options = { other: 9 };
    const args = new ConstraintValidator('isPort', options).args;
    expect(args).toEqual([]);
  });

  it('can prepare "isPostalCode" arguments', async () => {
    const options = { locale: 1, other: 9 };
    const args = new ConstraintValidator('isPostalCode', options).args;
    expect(args).toEqual([1]);
  });

  it('can prepare "isURL" arguments', async () => {
    const options = { other: 9 };
    const args = new ConstraintValidator('isURL', options).args;
    expect(args).toEqual([{ other: 9 }]);
  });

  it('can prepare "isUUID" arguments', async () => {
    const options = { version: 1, other: 9 };
    const args = new ConstraintValidator('isUUID', options).args;
    expect(args).toEqual([1]);
  });

  it('can prepare "isUppercase" arguments', async () => {
    const options = { other: 9 };
    const args = new ConstraintValidator('isUppercase', options).args;
    expect(args).toEqual([]);
  });

  it('can prepare "isWhitelisted" arguments', async () => {
    const options = { chars: 1, other: 9 };
    const args = new ConstraintValidator('isWhitelisted', options).args;
    expect(args).toEqual([1]);
  });

  it('can prepare "isAfter" hint', async () => {
    const hint = new ConstraintValidator('isAfter', { date: 1 }).hint;
    expect(hint).toBe('The parameter must be a date after 1');
  });

  it('can prepare "isAlpha" hint', async () => {
    const hint = new ConstraintValidator('isAlpha', {}).hint;
    expect(hint).toBe('The parameter must contain only letters');
  });

  it('can prepare "isAlphanumeric" hint', async () => {
    const hint = new ConstraintValidator('isAlphanumeric', {}).hint;
    expect(hint).toBe('The parameter must contain only letters and numbers');
  });

  it('can prepare "isAscii" hint', async () => {
    const hint = new ConstraintValidator('isAscii', {}).hint;
    expect(hint).toBe('The parameter must be an ASCII string');
  });

  it('can prepare "isBase64" hint', async () => {
    const hint = new ConstraintValidator('isBase64', {}).hint;
    expect(hint).toBe('The parameter must be a Base64 string');
  });

  it('can prepare "isBefore" hint', async () => {
    const hint = new ConstraintValidator('isBefore', { date: 1 }).hint;
    expect(hint).toBe('The parameter must be a date before 1');
  });

  it('can prepare "isBoolean" hint', async () => {
    const hint = new ConstraintValidator('isBoolean', {}).hint;
    expect(hint).toBe('The parameter must be a boolean');
  });

  it('can prepare "isByteLength" hint', async () => {
    const hint = new ConstraintValidator('isByteLength', { min: 1, max: 2 })
      .hint;
    expect(hint).toBe('The parameter must be between 1 and 2 bytes');
  });

  it('can prepare "isCreditCard" hint', async () => {
    const hint = new ConstraintValidator('isCreditCard', {}).hint;
    expect(hint).toBe('The parameter must be a valid credit card number');
  });

  it('can prepare "isCurrency" hint', async () => {
    const hint = new ConstraintValidator('isCurrency', {}).hint;
    expect(hint).toBe('The parameter must be a valid currency amount');
  });

  it('can prepare "isDecimal" hint', async () => {
    const hint = new ConstraintValidator('isDecimal', {}).hint;
    expect(hint).toBe('The parameter must be a decimal');
  });

  it('can prepare "isEmail" hint', async () => {
    const hint = new ConstraintValidator('isEmail', {}).hint;
    expect(hint).toBe('The parameter must be a valid email');
  });

  it('can prepare "isFQDN" hint', async () => {
    const hint = new ConstraintValidator('isFQDN', {}).hint;
    expect(hint).toBe('The parameter must be a fully qualified domain name');
  });

  it('can prepare "isFloat" hint', async () => {
    const hint = new ConstraintValidator('isFloat', {}).hint;
    expect(hint).toBe('The parameter must be a floating-point number');
  });

  it('can prepare "isHash" hint', async () => {
    const hint = new ConstraintValidator('isHash', { algorithm: 1 }).hint;
    expect(hint).toBe('The parameter must be a valid 1 hash');
  });

  it('can prepare "isHexadecimal" hint', async () => {
    const hint = new ConstraintValidator('isHexadecimal', {}).hint;
    expect(hint).toBe('The parameter must be a hexadecimal number');
  });

  it('can prepare "isIdentityCard" hint', async () => {
    const hint = new ConstraintValidator('isIdentityCard', {}).hint;
    expect(hint).toBe('The parameter must be a valid identity card code');
  });

  it('can prepare "isIP" hint', async () => {
    const hint = new ConstraintValidator('isIP', {}).hint;
    expect(hint).toBe('The parameter must be a valid IP address');
  });

  it('can prepare "isIPRange" hint', async () => {
    const hint = new ConstraintValidator('isIPRange', {}).hint;
    expect(hint).toBe('The parameter must be a valid IP address range');
  });

  it('can prepare "isISO8601" hint', async () => {
    const hint = new ConstraintValidator('isISO8601', {}).hint;
    expect(hint).toBe('The parameter must be a valid ISO 8601 date');
  });

  it('can prepare "isRFC3339" hint', async () => {
    const hint = new ConstraintValidator('isRFC3339', {}).hint;
    expect(hint).toBe('The parameter must be a valid RFC 3339 date');
  });

  it('can prepare "isISO31661Alpha2" hint', async () => {
    const hint = new ConstraintValidator('isISO31661Alpha2', {}).hint;
    expect(hint).toBe(
      'The parameter must be a valid ISO 3166-1 alpha-2 country code'
    );
  });

  it('can prepare "isISO31661Alpha3" hint', async () => {
    const hint = new ConstraintValidator('isISO31661Alpha3', {}).hint;
    expect(hint).toBe(
      'The parameter must be a valid ISO 3166-1 alpha-3 country code'
    );
  });

  it('can prepare "isIn" hint', async () => {
    const hint = new ConstraintValidator('isIn', { values: 1 }).hint;
    expect(hint).toBe('The parameter must be one of 1');
  });

  it('can prepare "isInt" hint', async () => {
    const hint = new ConstraintValidator('isInt', {}).hint;
    expect(hint).toBe('The parameter must be a integer number');
  });

  it('can prepare "isJSON" hint', async () => {
    const hint = new ConstraintValidator('isJSON', {}).hint;
    expect(hint).toBe('The parameter must be a valid JSON');
  });

  it('can prepare "isJWT" hint', async () => {
    const hint = new ConstraintValidator('isJWT', {}).hint;
    expect(hint).toBe('The parameter must be a valid JWT');
  });

  it('can prepare "isLatLong" hint', async () => {
    const hint = new ConstraintValidator('isLatLong', {}).hint;
    expect(hint).toBe(
      'The parameter must be a valid latitude-longitude coordinate'
    );
  });

  it('can prepare "isLength" hint', async () => {
    const hint = new ConstraintValidator('isLength', { min: 1, max: 2 }).hint;
    expect(hint).toBe('The parameter must be between 1 and 2 characters');
  });

  it('can prepare "isLowercase" hint', async () => {
    const hint = new ConstraintValidator('isLowercase', {}).hint;
    expect(hint).toBe('The parameter must be a lowercase string');
  });

  it('can prepare "isMACAddress" hint', async () => {
    const hint = new ConstraintValidator('isMACAddress', {}).hint;
    expect(hint).toBe('The parameter must be a valid MAC address');
  });

  it('can prepare "isMimeType" hint', async () => {
    const hint = new ConstraintValidator('isMimeType', {}).hint;
    expect(hint).toBe('The parameter must be a valid MIME type format');
  });

  it('can prepare "isMobilePhone" hint', async () => {
    const hint = new ConstraintValidator('isMobilePhone', {}).hint;
    expect(hint).toBe('The parameter must be a valid mobile phone number');
  });

  it('can prepare "isNumeric" hint', async () => {
    const hint = new ConstraintValidator('isNumeric', {}).hint;
    expect(hint).toBe('The parameter must be a number');
  });

  it('can prepare "isPort" hint', async () => {
    const hint = new ConstraintValidator('isPort', {}).hint;
    expect(hint).toBe('The parameter must be a port number');
  });

  it('can prepare "isPostalCode" hint', async () => {
    const hint = new ConstraintValidator('isPostalCode', {}).hint;
    expect(hint).toBe('The parameter must be a valid postal code');
  });

  it('can prepare "isURL" hint', async () => {
    const hint = new ConstraintValidator('isURL', {}).hint;
    expect(hint).toBe('The parameter must be a valid URL');
  });

  it('can prepare "isUUID" hint', async () => {
    const hint = new ConstraintValidator('isUUID', {}).hint;
    expect(hint).toBe('The parameter must be a valid UUID');
  });

  it('can prepare "isUppercase" hint', async () => {
    const hint = new ConstraintValidator('isUppercase', {}).hint;
    expect(hint).toBe('The parameter must be an uppercase string');
  });

  it('can prepare "isWhitelisted" hint', async () => {
    const hint = new ConstraintValidator('isWhitelisted', { chars: 1 }).hint;
    expect(hint).toBe('The parameter must contain only 1');
  });

  it('can apply a constraint (positive match)', async () => {
    const result = new ConstraintValidator('isNumeric', {}).validate('1');
    expect(result).toBeTruthy();
  });

  it('can apply a constraint (negative match)', async () => {
    const result = new ConstraintValidator('isAlpha', {}).validate('1');
    expect(result).toBeFalsy();
  });

  it('can handle unknown constraints', async () => {
    try {
      new ConstraintValidator('unknown', {}).validate('0');
    } catch (e) {
      expect(e).toEqual(new Error('The constraint "unknown" does not exist'));
    }
  });

  it('can check a value', async () => {
    const constraints = {
      isAlpha: {},
      isNumeric: {},
      isHash: { algorithm: 'md5' }
    };

    const result = validator.validateValue('1', constraints);

    expect(result).toEqual([
      'The parameter must contain only letters',
      'The parameter must be a valid md5 hash'
    ]);
  });

  it('can check a request', async () => {
    const request = new Request();

    request.bucket = {
      param0: 'string',
      param1: 'string',
      param2: 'string'
    };

    const schema: any = {
      param0: {
        isAlpha: {}
      },
      param1: {
        isAlpha: {},
        isNumeric: {}
      },
      param2: {
        isAlpha: {},
        isNumeric: {},
        isFloat: {}
      }
    };

    const result = (validator as any).validateRequest(request, schema);

    expect(result).toEqual({
      param1: ['The parameter must be a number'],
      param2: [
        'The parameter must be a number',
        'The parameter must be a floating-point number'
      ]
    });
  });
});
