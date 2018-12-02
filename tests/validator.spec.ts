/**
 * @file validator.spec.ts
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

import { Request } from '../src/testing/mocks';
import { Validator } from '../src/validator';

import * as database from '../src/database';

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

    const result = await validator.validateValue('1', constraints);

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

    const result = await (validator as any).validateRequest(request, schema);

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
      await validator.validateValue('0', { unknown: {} });
      fail();
    } catch (e) {
      expect(e).toEqual(new Error('The constraint "unknown" does not exist'));
    }
  });

  it('can use "isAfter" constraint', async () => {
    const hints = await validator.validateValue('2011-08-03', {
      isAfter: { date: '2011-08-02' }
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isAfter" constraint (hint)', async () => {
    const hints = await validator.validateValue('2011-08-03', {
      isAfter: { date: '2011-08-04' }
    });
    expect(hints).toEqual(['The parameter must be a date after 2011-08-04']);
  });

  it('can use "isAlpha" constraint', async () => {
    const hints = await validator.validateValue('text', {
      isAlpha: {}
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isAlpha" constraint (hint)', async () => {
    const hints = await validator.validateValue('100', {
      isAlpha: {}
    });
    expect(hints).toEqual(['The parameter must contain only letters']);
  });

  it('can use "isAlphanumeric" constraint', async () => {
    const hints = await validator.validateValue('text100', {
      isAlphanumeric: {}
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isAlphanumeric" constraint (hint)', async () => {
    const hints = await validator.validateValue('!!!', {
      isAlphanumeric: {}
    });
    expect(hints).toEqual([
      'The parameter must contain only letters and numbers'
    ]);
  });

  it('can use "isAscii" constraint', async () => {
    const hints = await validator.validateValue('text100!!!', {
      isAscii: {}
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isAscii" constraint (hint)', async () => {
    const hints = await validator.validateValue('α', {
      isAscii: {}
    });
    expect(hints).toEqual(['The parameter must be an ASCII string']);
  });

  it('can use "isBase64" constraint', async () => {
    const hints = await validator.validateValue('Zg==', {
      isBase64: {}
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isBase64" constraint (hint)', async () => {
    const hints = await validator.validateValue('text100', {
      isBase64: {}
    });
    expect(hints).toEqual(['The parameter must be a Base64 string']);
  });

  it('can use "isBefore" constraint', async () => {
    const hints = await validator.validateValue('2010-08-04', {
      isBefore: { date: '2010-08-05' }
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isBefore" constraint (hint)', async () => {
    const hints = await validator.validateValue('2010-08-04', {
      isBefore: { date: '2010-08-03' }
    });
    expect(hints).toEqual(['The parameter must be a date before 2010-08-03']);
  });

  it('can use "isBoolean" constraint', async () => {
    const hints = await validator.validateValue('true', {
      isBoolean: {}
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isBoolean" constraint (hint)', async () => {
    const hints = await validator.validateValue('text', {
      isBoolean: {}
    });
    expect(hints).toEqual(['The parameter must be a boolean']);
  });

  it('can use "isByteLength" constraint', async () => {
    const hints = await validator.validateValue('xxxx', {
      isByteLength: { min: 3, max: 5 }
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isByteLength" constraint (hint)', async () => {
    const hints = await validator.validateValue('xxxxxx', {
      isByteLength: { min: 3, max: 5 }
    });
    expect(hints).toEqual(['The parameter must be between 3 and 5 bytes']);
  });

  it('can use "isCreditCard" constraint', async () => {
    const hints = await validator.validateValue('375556917985515', {
      isCreditCard: {}
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isCreditCard" constraint (hint)', async () => {
    const hints = await validator.validateValue('5398228707871528', {
      isCreditCard: {}
    });
    expect(hints).toEqual(['The parameter must be a valid credit card number']);
  });

  it('can use "isCurrency" constraint', async () => {
    const hints = await validator.validateValue('$10.45', {
      isCurrency: {}
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isCurrency" constraint (hint)', async () => {
    const hints = await validator.validateValue('text', {
      isCurrency: {}
    });
    expect(hints).toEqual(['The parameter must be a valid currency amount']);
  });

  it('can use "isDecimal" constraint', async () => {
    const hints = await validator.validateValue('10.45', {
      isDecimal: {}
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isDecimal" constraint (hint)', async () => {
    const hints = await validator.validateValue('text', {
      isDecimal: {}
    });
    expect(hints).toEqual(['The parameter must be a decimal']);
  });

  it('can use "isEmail" constraint', async () => {
    const hints = await validator.validateValue('foo@bar.com', {
      isEmail: {}
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isEmail" constraint (hint)', async () => {
    const hints = await validator.validateValue('text', {
      isEmail: {}
    });
    expect(hints).toEqual(['The parameter must be a valid email']);
  });

  it('can use "isEntityId" constraint', async () => {
    class TestClass {}

    const entity: any = {};
    const getEntitySpy = spyOn(database, 'getEntity').and.returnValue(entity);

    const hints = await validator.validateValue('id', {
      isEntityId: {
        type: TestClass,
        name: 'entityName'
      }
    });

    expect(getEntitySpy).toBeCalledWith(TestClass, 'id');
    expect(hints.length).toBeFalsy();
  });

  it('can use "isEntityId" constraint (with context)', async () => {
    class TestClass {}

    const request = new Request();
    request.entities = {};

    const entity: any = {};
    const getEntitySpy = spyOn(database, 'getEntity').and.returnValue(entity);

    const context = { request };
    const hints = await validator.validateValue(
      'id',
      {
        isEntityId: {
          type: TestClass,
          name: 'entityName'
        }
      },
      context
    );

    expect(getEntitySpy).toBeCalledWith(TestClass, 'id');
    expect(hints.length).toBeFalsy();

    expect(request.entities).toEqual({
      entityName: entity
    });
  });

  it('can use "isEntityId" constraint (hint)', async () => {
    class TestClass {}

    const repository: any = {
      findOne: jest.fn(async () => {})
    };

    const getEntitySpy = spyOn(database, 'getEntity').and.returnValue(
      undefined
    );

    const hints = await validator.validateValue('id', {
      isEntityId: {
        type: TestClass,
        name: 'entityName'
      }
    });

    expect(getEntitySpy).toBeCalledWith(TestClass, 'id');
    expect(hints).toEqual(['The parameter must be a valid entity ID']);
  });

  it('can use "isFQDN" constraint', async () => {
    const hints = await validator.validateValue('sub.domain.com', {
      isFQDN: {}
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isFQDN" constraint (hint)', async () => {
    const hints = await validator.validateValue('text', {
      isFQDN: {}
    });
    expect(hints).toEqual([
      'The parameter must be a fully qualified domain name'
    ]);
  });

  it('can use "isFloat" constraint', async () => {
    const hints = await validator.validateValue('10.45', {
      isFloat: {}
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isFloat" constraint (hint)', async () => {
    const hints = await validator.validateValue('text', {
      isFloat: {}
    });
    expect(hints).toEqual(['The parameter must be a floating-point number']);
  });

  it('can use "isHash" constraint', async () => {
    const hints = await validator.validateValue(
      'd94f3f016ae679c3008de268209132f2',
      {
        isHash: { algorithm: 'md5' }
      }
    );
    expect(hints.length).toBeFalsy();
  });

  it('can use "isHash" constraint (hint)', async () => {
    const hints = await validator.validateValue('text', {
      isHash: { algorithm: 'md5' }
    });
    expect(hints).toEqual(['The parameter must be a valid md5 hash']);
  });

  it('can use "isHexadecimal" constraint', async () => {
    const hints = await validator.validateValue('ff0044', {
      isHexadecimal: {}
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isHexadecimal" constraint (hint)', async () => {
    const hints = await validator.validateValue('text', {
      isHexadecimal: {}
    });
    expect(hints).toEqual(['The parameter must be a hexadecimal number']);
  });

  it('can use "isIP" constraint', async () => {
    const hints = await validator.validateValue('127.0.0.1', {
      isIP: {}
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isIP" constraint (hint)', async () => {
    const hints = await validator.validateValue('text', {
      isIP: {}
    });
    expect(hints).toEqual(['The parameter must be a valid IP address']);
  });

  it('can use "isIPRange" constraint', async () => {
    const hints = await validator.validateValue('127.0.0.1/24', {
      isIPRange: {}
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isIPRange" constraint (hint)', async () => {
    const hints = await validator.validateValue('text', {
      isIPRange: {}
    });
    expect(hints).toEqual(['The parameter must be a valid IP address range']);
  });

  it('can use "isISO8601" constraint', async () => {
    const hints = await validator.validateValue('2011-10-05T14:48:00', {
      isISO8601: {}
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isISO8601" constraint (hint)', async () => {
    const hints = await validator.validateValue('text', {
      isISO8601: {}
    });
    expect(hints).toEqual(['The parameter must be a valid ISO 8601 date']);
  });

  it('can use "isNotEmpty" constraint', async () => {
    const hints = await validator.validateValue('text', {
      isNotEmpty: {}
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isNotEmpty" constraint (hint)', async () => {
    const hints = await validator.validateValue('', {
      isNotEmpty: {}
    });
    expect(hints).toEqual(['The parameter cannot be empty']);
  });

  it('can use "isRFC3339" constraint', async () => {
    const hints = await validator.validateValue('2009-05-19 14:39:22-06:00', {
      isRFC3339: {}
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isRFC3339" constraint (hint)', async () => {
    const hints = await validator.validateValue('text', {
      isRFC3339: {}
    });
    expect(hints).toEqual(['The parameter must be a valid RFC 3339 date']);
  });

  it('can use "isISO31661Alpha2" constraint', async () => {
    const hints = await validator.validateValue('IE', {
      isISO31661Alpha2: {}
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isISO31661Alpha2" constraint (hint)', async () => {
    const hints = await validator.validateValue('FRA', {
      isISO31661Alpha2: {}
    });
    expect(hints).toEqual([
      'The parameter must be a valid ISO 3166-1 alpha-2 country code'
    ]);
  });

  it('can use "isISO31661Alpha3" constraint', async () => {
    const hints = await validator.validateValue('ITA', {
      isISO31661Alpha3: {}
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isISO31661Alpha3" constraint (hint)', async () => {
    const hints = await validator.validateValue('FR', {
      isISO31661Alpha3: {}
    });
    expect(hints).toEqual([
      'The parameter must be a valid ISO 3166-1 alpha-3 country code'
    ]);
  });

  it('can use "isIn" constraint', async () => {
    const hints = await validator.validateValue('2', {
      isIn: {
        values: [1, 2, 3]
      }
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isIn" constraint (hint)', async () => {
    const hints = await validator.validateValue('5', {
      isIn: {
        values: [1, 2, 3]
      }
    });
    expect(hints).toEqual(['The parameter must be one of 1,2,3']);
  });

  it('can use "isInt" constraint', async () => {
    const hints = await validator.validateValue('100', {
      isInt: {}
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isInt" constraint (hint)', async () => {
    const hints = await validator.validateValue('text', {
      isInt: {}
    });
    expect(hints).toEqual(['The parameter must be a integer number']);
  });

  it('can use "isJSON" constraint', async () => {
    const hints = await validator.validateValue('{ "key": "value" }', {
      isJSON: {}
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isJSON" constraint (hint)', async () => {
    const hints = await validator.validateValue('text', {
      isJSON: {}
    });
    expect(hints).toEqual(['The parameter must be a valid JSON']);
  });

  it('can use "isJWT" constraint', async () => {
    const hints = await validator.validateValue(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0' +
        'NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5M' +
        'DIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      {
        isJWT: {}
      }
    );
    expect(hints.length).toBeFalsy();
  });

  it('can use "isJWT" constraint (hint)', async () => {
    const hints = await validator.validateValue('text', {
      isJWT: {}
    });
    expect(hints).toEqual(['The parameter must be a valid JWT']);
  });

  it('can use "isLatLong" constraint', async () => {
    const hints = await validator.validateValue('(-17.738223, 85.605469)', {
      isLatLong: {}
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isLatLong" constraint (hint)', async () => {
    const hints = await validator.validateValue('text', {
      isLatLong: {}
    });
    expect(hints).toEqual([
      'The parameter must be a valid latitude-longitude coordinate'
    ]);
  });

  it('can use "isLength" constraint', async () => {
    const hints = await validator.validateValue('xxxx', {
      isLength: { min: 3, max: 5 }
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isLength" constraint (hint)', async () => {
    const hints = await validator.validateValue('xxxxxx', {
      isLength: { min: 3, max: 5 }
    });
    expect(hints).toEqual(['The parameter must be between 3 and 5 characters']);
  });

  it('can use "isLowercase" constraint', async () => {
    const hints = await validator.validateValue('text', {
      isLowercase: {}
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isLowercase" constraint (hint)', async () => {
    const hints = await validator.validateValue('TEXT', {
      isLowercase: {}
    });
    expect(hints).toEqual(['The parameter must be a lowercase string']);
  });

  it('can use "isMACAddress" constraint', async () => {
    const hints = await validator.validateValue('01:AB:03:04:05:06', {
      isMACAddress: {}
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isMACAddress" constraint (hint)', async () => {
    const hints = await validator.validateValue('text', {
      isMACAddress: {}
    });
    expect(hints).toEqual(['The parameter must be a valid MAC address']);
  });

  it('can use "isMimeType" constraint', async () => {
    const hints = await validator.validateValue('application/json', {
      isMimeType: {}
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isMimeType" constraint (hint)', async () => {
    const hints = await validator.validateValue('text', {
      isMimeType: {}
    });
    expect(hints).toEqual(['The parameter must be a valid MIME type format']);
  });

  it('can use "isMobilePhone" constraint', async () => {
    const hints = await validator.validateValue('8005552222', {
      isMobilePhone: {}
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isMobilePhone" constraint (hint)', async () => {
    const hints = await validator.validateValue('text', {
      isMobilePhone: {}
    });
    expect(hints).toEqual([
      'The parameter must be a valid mobile phone number'
    ]);
  });

  it('can use "isNumeric" constraint', async () => {
    const hints = await validator.validateValue('100', {
      isNumeric: {}
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isNumeric" constraint (hint)', async () => {
    const hints = await validator.validateValue('text', {
      isNumeric: {}
    });
    expect(hints).toEqual(['The parameter must be a number']);
  });

  it('can use "isPort" constraint', async () => {
    const hints = await validator.validateValue('8080', {
      isPort: {}
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isPort" constraint (hint)', async () => {
    const hints = await validator.validateValue('65536', {
      isPort: {}
    });
    expect(hints).toEqual(['The parameter must be a port number']);
  });

  it('can use "isPostalCode" constraint', async () => {
    const hints = await validator.validateValue('TW8 9GS', {
      isPostalCode: {
        locale: 'GB'
      }
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isPostalCode" constraint (hint)', async () => {
    const hints = await validator.validateValue('text', {
      isPostalCode: {
        locale: 'GB'
      }
    });
    expect(hints).toEqual(['The parameter must be a valid postal code']);
  });

  it('can use "isURL" constraint', async () => {
    const hints = await validator.validateValue('http://domain.com/', {
      isURL: {}
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isURL" constraint (hint)', async () => {
    const hints = await validator.validateValue('text', {
      isURL: {}
    });
    expect(hints).toEqual(['The parameter must be a valid URL']);
  });

  it('can use "isUUID" constraint', async () => {
    const hints = await validator.validateValue(
      '3f87c20c-6d38-467c-ae84-ddb7f5830634',
      {
        isUUID: {}
      }
    );
    expect(hints.length).toBeFalsy();
  });

  it('can use "isUUID" constraint (hint)', async () => {
    const hints = await validator.validateValue('text', {
      isUUID: {}
    });
    expect(hints).toEqual(['The parameter must be a valid UUID']);
  });

  it('can use "isUppercase" constraint', async () => {
    const hints = await validator.validateValue('TEXT', {
      isUppercase: {}
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isUppercase" constraint (hint)', async () => {
    const hints = await validator.validateValue('text', {
      isUppercase: {}
    });
    expect(hints).toEqual(['The parameter must be an uppercase string']);
  });

  it('can use "isWhitelisted" constraint', async () => {
    const hints = await validator.validateValue('john', {
      isWhitelisted: {
        chars: 'abcdefghijklmnopqrstuvwxyz'
      }
    });
    expect(hints.length).toBeFalsy();
  });

  it('can use "isWhitelisted" constraint (hint)', async () => {
    const hints = await validator.validateValue('Mario', {
      isWhitelisted: {
        chars: 'abcd'
      }
    });
    expect(hints).toEqual([
      'The parameter must contain only the characters "abcd"'
    ]);
  });

  it("shouldn't check empty values", async () => {
    spyOn(database, 'getEntity').and.returnValue(undefined);

    await validator.validateValue('', {
      isAfter: {},
      isAlpha: {},
      isAlphanumeric: {},
      isAscii: {},
      isBase64: {},
      isBefore: {},
      isBoolean: {},
      isByteLength: {},
      isCreditCard: {},
      isCurrency: {},
      isDecimal: {},
      isEmail: {},
      isEntityId: {},
      isFQDN: {},
      isFloat: {},
      isHash: {},
      isHexadecimal: {},
      isIP: {},
      isIPRange: {},
      isISO8601: {},
      // The method `isNotEmpty` this is the only exception
      isRFC3339: {},
      isISO31661Alpha2: {},
      isISO31661Alpha3: {},
      isIn: {},
      isInt: {},
      isJSON: {},
      isJWT: {},
      isLatLong: {},
      isLength: {},
      isLowercase: {},
      isMACAddress: {},
      isMimeType: {},
      isMobilePhone: {},
      isNumeric: {},
      isPort: {},
      isPostalCode: {},
      isURL: {},
      isUUID: {},
      isUppercase: {},
      isWhitelisted: {}
    });
  });
});
