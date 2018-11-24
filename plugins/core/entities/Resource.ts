/**
 * @file core/entities/Resource.ts
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

import { schema } from '@puro/protocol';

import { PrimaryGeneratedColumn, Column } from 'typeorm';
import { BeforeInsert, BeforeUpdate, BeforeRemove } from 'typeorm';

export class Resource {
  @schema()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('datetime')
  createdOn!: Date;

  @Column('datetime', { nullable: true })
  modifiedOn!: Date;

  @Column('datetime', { nullable: true })
  deletedOn!: Date;

  @Column('tinyint', { width: 1, default: 0 })
  isDeleted!: boolean;

  @BeforeInsert()
  updateCreatedOn() {
    this.createdOn = new Date();
  }

  @BeforeUpdate()
  updateModifiedOn() {
    this.modifiedOn = new Date();
  }

  @BeforeRemove()
  updateDeletedOn() {
    this.deletedOn = new Date();
    this.isDeleted = true;
  }
}
