/**
 * @file src/__tests__/database.spec.ts
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

import { getConnection, closeConnection, DatabaseDef } from '../database';
import { configs } from '../configs';

import * as typeorm from 'typeorm';

describe('database', () => {
  let connection: any;
  let connectionOptions: typeorm.ConnectionOptions;
  let createConnectionSpy: Function;

  beforeEach(() => {
    connection = {
      close: jest.fn()
    };

    connectionOptions = {
      type: 'mariadb',
      username: 'root',
      password: 'password'
    };

    spyOn(configs, 'get').and.returnValue(connectionOptions);

    createConnectionSpy = spyOn(typeorm, 'createConnection').and.returnValue(
      connection
    );
  });

  afterEach(async () => {
    await closeConnection();
  });

  it('can get the connection', async () => {
    const conn = await getConnection();
    expect(createConnectionSpy).toBeCalledWith(connectionOptions);
    expect(conn).toBe(connection);

    // Second access when the connection has been established
    await getConnection();
    expect(createConnectionSpy).toBeCalledTimes(1);
  });

  it('can close the connection', async () => {
    // It's safe even if the connection hasn't been established
    await closeConnection();

    const conn = await getConnection();
    expect(conn).toBe(connection);

    await closeConnection();
    expect(connection.close).toBeCalled();
  });

  it('defines the service', async () => {
    await DatabaseDef.load();
    expect(createConnectionSpy).toBeCalled();

    await DatabaseDef.unload();
    expect(connection.close).toBeCalled();
  });
});
