/**
 * @file database.ts
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

import { configs } from './configs';
import { IServiceExtended } from './container';

import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { ObjectType } from 'typeorm/common/ObjectType';

/**
 * The connection instance.
 */
let connection: Connection | undefined;

/**
 * Returns the connection to the database (lazy method).
 */
export const getConnection = async () => {
  if (!connection) {
    const connectionOptions = configs.get<ConnectionOptions>('database');
    connection = await createConnection(connectionOptions);
  }

  return connection;
};

/**
 * Closes the connection to the database.
 */
export const closeConnection = async () => {
  if (connection) {
    await connection.close();
    connection = undefined;
  }
};

/**
 * Returns the entity repository for a specific entity.
 */
export const getRepository = async <Entity>(type: ObjectType<Entity>) => {
  return (await getConnection()).getRepository(type);
};

/**
 * Returns an entity by its class and ID.
 */
export const getEntity = async <Entity>(
  type: ObjectType<Entity>,
  id: string
) => {
  const repository = await getRepository(type);
  const entity = await repository.findOne(id);

  if (entity) {
    // Add shortcut methods to the entity instance
    (entity as any).save = async function() {
      return repository.save(this);
    };

    (entity as any).remove = async function() {
      return repository.remove(this);
    };

    return entity;
  }
};

/**
 * Definition for the service.
 */
export const DatabaseDef: IServiceExtended = {
  load: async () => {
    return getConnection();
  },
  unload: async () => {
    return closeConnection();
  }
};
