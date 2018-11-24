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

import { Request } from '../testing/mocks';
import { Validator } from './validator';

describe('validator', () => {
  let validator: Validator;

  beforeEach(() => {
    validator = new Validator();
  });

  it('can validate a value', async () => {
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

  it('can validate a request', async () => {
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
      },
      param3: {
        isAlpha: {}
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

  it('can handle unknown constraints', async () => {
    try {
      validator.validateValue('0', { unknown: {} });
    } catch (e) {
      expect(e).toEqual(new Error('The constraint "unknown" does not exist'));
    }
  });

  it('can prepare "isAfter" hint', async () => {
    const hint = (validator as any).prepareHint('isAfter', { date: 1 });
    expect(hint).toBe('The parameter must be a date after 1');
  });

  it('can prepare "isAlpha" hint', async () => {
    const hint = (validator as any).prepareHint('isAlpha', {});
    expect(hint).toBe('The parameter must contain only letters');
  });

  it('can prepare "isAlphanumeric" hint', async () => {
    const hint = (validator as any).prepareHint('isAlphanumeric', {});
    expect(hint).toBe('The parameter must contain only letters and numbers');
  });

  it('can prepare "isAscii" hint', async () => {
    const hint = (validator as any).prepareHint('isAscii', {});
    expect(hint).toBe('The parameter must be an ASCII string');
  });

  it('can prepare "isBase64" hint', async () => {
    const hint = (validator as any).prepareHint('isBase64', {});
    expect(hint).toBe('The parameter must be a Base64 string');
  });

  it('can prepare "isBefore" hint', async () => {
    const hint = (validator as any).prepareHint('isBefore', { date: 1 });
    expect(hint).toBe('The parameter must be a date before 1');
  });

  it('can prepare "isBoolean" hint', async () => {
    const hint = (validator as any).prepareHint('isBoolean', {});
    expect(hint).toBe('The parameter must be a boolean');
  });

  it('can prepare "isByteLength" hint', async () => {
    const hint = (validator as any).prepareHint('isByteLength', {
      min: 1,
      max: 2
    });
    expect(hint).toBe('The parameter must be between 1 and 2 bytes');
  });

  it('can prepare "isCreditCard" hint', async () => {
    const hint = (validator as any).prepareHint('isCreditCard', {});
    expect(hint).toBe('The parameter must be a valid credit card number');
  });

  it('can prepare "isCurrency" hint', async () => {
    const hint = (validator as any).prepareHint('isCurrency', {});
    expect(hint).toBe('The parameter must be a valid currency amount');
  });

  it('can prepare "isDecimal" hint', async () => {
    const hint = (validator as any).prepareHint('isDecimal', {});
    expect(hint).toBe('The parameter must be a decimal');
  });

  it('can prepare "isEmail" hint', async () => {
    const hint = (validator as any).prepareHint('isEmail', {});
    expect(hint).toBe('The parameter must be a valid email');
  });

  it('can prepare "isFQDN" hint', async () => {
    const hint = (validator as any).prepareHint('isFQDN', {});
    expect(hint).toBe('The parameter must be a fully qualified domain name');
  });

  it('can prepare "isFloat" hint', async () => {
    const hint = (validator as any).prepareHint('isFloat', {});
    expect(hint).toBe('The parameter must be a floating-point number');
  });

  it('can prepare "isHash" hint', async () => {
    const hint = (validator as any).prepareHint('isHash', { algorithm: 1 });
    expect(hint).toBe('The parameter must be a valid 1 hash');
  });

  it('can prepare "isHexadecimal" hint', async () => {
    const hint = (validator as any).prepareHint('isHexadecimal', {});
    expect(hint).toBe('The parameter must be a hexadecimal number');
  });

  it('can prepare "isIdentityCard" hint', async () => {
    const hint = (validator as any).prepareHint('isIdentityCard', {});
    expect(hint).toBe('The parameter must be a valid identity card code');
  });

  it('can prepare "isIP" hint', async () => {
    const hint = (validator as any).prepareHint('isIP', {});
    expect(hint).toBe('The parameter must be a valid IP address');
  });

  it('can prepare "isIPRange" hint', async () => {
    const hint = (validator as any).prepareHint('isIPRange', {});
    expect(hint).toBe('The parameter must be a valid IP address range');
  });

  it('can prepare "isISO8601" hint', async () => {
    const hint = (validator as any).prepareHint('isISO8601', {});
    expect(hint).toBe('The parameter must be a valid ISO 8601 date');
  });

  it('can prepare "isRequired" hint', async () => {
    const hint = (validator as any).prepareHint('isRequired', {});
    expect(hint).toBe('The parameter is required');
  });

  it('can prepare "isRFC3339" hint', async () => {
    const hint = (validator as any).prepareHint('isRFC3339', {});
    expect(hint).toBe('The parameter must be a valid RFC 3339 date');
  });

  it('can prepare "isISO31661Alpha2" hint', async () => {
    const hint = (validator as any).prepareHint('isISO31661Alpha2', {});
    expect(hint).toBe(
      'The parameter must be a valid ISO 3166-1 alpha-2 country code'
    );
  });

  it('can prepare "isISO31661Alpha3" hint', async () => {
    const hint = (validator as any).prepareHint('isISO31661Alpha3', {});
    expect(hint).toBe(
      'The parameter must be a valid ISO 3166-1 alpha-3 country code'
    );
  });

  it('can prepare "isIn" hint', async () => {
    const hint = (validator as any).prepareHint('isIn', { values: 1 });
    expect(hint).toBe('The parameter must be one of 1');
  });

  it('can prepare "isInt" hint', async () => {
    const hint = (validator as any).prepareHint('isInt', {});
    expect(hint).toBe('The parameter must be a integer number');
  });

  it('can prepare "isJSON" hint', async () => {
    const hint = (validator as any).prepareHint('isJSON', {});
    expect(hint).toBe('The parameter must be a valid JSON');
  });

  it('can prepare "isJWT" hint', async () => {
    const hint = (validator as any).prepareHint('isJWT', {});
    expect(hint).toBe('The parameter must be a valid JWT');
  });

  it('can prepare "isLatLong" hint', async () => {
    const hint = (validator as any).prepareHint('isLatLong', {});
    expect(hint).toBe(
      'The parameter must be a valid latitude-longitude coordinate'
    );
  });

  it('can prepare "isLength" hint', async () => {
    const hint = (validator as any).prepareHint('isLength', { min: 1, max: 2 });
    expect(hint).toBe('The parameter must be between 1 and 2 characters');
  });

  it('can prepare "isLowercase" hint', async () => {
    const hint = (validator as any).prepareHint('isLowercase', {});
    expect(hint).toBe('The parameter must be a lowercase string');
  });

  it('can prepare "isMACAddress" hint', async () => {
    const hint = (validator as any).prepareHint('isMACAddress', {});
    expect(hint).toBe('The parameter must be a valid MAC address');
  });

  it('can prepare "isMimeType" hint', async () => {
    const hint = (validator as any).prepareHint('isMimeType', {});
    expect(hint).toBe('The parameter must be a valid MIME type format');
  });

  it('can prepare "isMobilePhone" hint', async () => {
    const hint = (validator as any).prepareHint('isMobilePhone', {});
    expect(hint).toBe('The parameter must be a valid mobile phone number');
  });

  it('can prepare "isNumeric" hint', async () => {
    const hint = (validator as any).prepareHint('isNumeric', {});
    expect(hint).toBe('The parameter must be a number');
  });

  it('can prepare "isPort" hint', async () => {
    const hint = (validator as any).prepareHint('isPort', {});
    expect(hint).toBe('The parameter must be a port number');
  });

  it('can prepare "isPostalCode" hint', async () => {
    const hint = (validator as any).prepareHint('isPostalCode', {});
    expect(hint).toBe('The parameter must be a valid postal code');
  });

  it('can prepare "isURL" hint', async () => {
    const hint = (validator as any).prepareHint('isURL', {});
    expect(hint).toBe('The parameter must be a valid URL');
  });

  it('can prepare "isUUID" hint', async () => {
    const hint = (validator as any).prepareHint('isUUID', {});
    expect(hint).toBe('The parameter must be a valid UUID');
  });

  it('can prepare "isUppercase" hint', async () => {
    const hint = (validator as any).prepareHint('isUppercase', {});
    expect(hint).toBe('The parameter must be an uppercase string');
  });

  it('can prepare "isWhitelisted" hint', async () => {
    const hint = (validator as any).prepareHint('isWhitelisted', { chars: 1 });
    expect(hint).toBe('The parameter must contain only 1');
  });
});
