/**
 * @file firewall.spec.ts
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

import { Request, Response, NextFunction } from '../src/testing/mocks';
import { mock, Middleware } from '../src/testing/mocks';

import { AccessDeniedHttpException } from '../src/http';
import {
  signAuthToken,
  buildAuthHandler,
  IUser,
  UserSerializer,
  Firewall
} from '../src/firewall';

import { Container } from '../src/container';

import fs = require('fs');
import passport = require('passport');

describe('firewall', () => {
  let user: IUser;
  let userProvider: any;

  let request: Request;
  let response: Response;
  let next: NextFunction;

  let firewall: Firewall;
  let container: Container;

  beforeEach(() => {
    spyOn(fs, 'readFileSync').and.returnValue(
      '{ "app": { "secret": "c2VjcmV0" } }'
    );

    user = { id: '0635f893-7b4e-44ba-9004-799f5a81efe8', salt: 'salt' };
    userProvider = { getUser: async () => user };

    request = new Request();
    response = new Response();
    next = jest.fn();

    container = new Container();
    container.define('userProvider', async () => {
      return userProvider;
    });

    firewall = new Firewall(container);
  });

  it('can sign an authentication token', async () => {
    spyOn(Date, 'now').and.returnValue(0);

    const authToken = signAuthToken(25);
    expect(authToken).toEqual(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI1LCJpYXQiO' +
        'jAsImV4cCI6MzYwMH0.R92Gl1tZukXhCl82YGioh_4nM7T3BBNou_kuWpmv_Ys'
    );
  });

  it('can build authenticate a user with passport.js', async () => {
    const user = { id: 25 };
    const authHandler = (buildAuthHandler as any)(request, response, next);

    authHandler(null, user);
    expect(request.login).toHaveBeenCalledWith(user, expect.any(Function));
    expect(next).not.toHaveBeenCalled();

    const loginHandler = request.login.mock.calls[0][1];
    loginHandler();
    expect(next).toHaveBeenCalled();

    loginHandler('error');
    expect(next).toHaveBeenCalledWith('error');
  });

  it('can build handle authentication errors with passport.js', async () => {
    const authHandler = (buildAuthHandler as any)(request, response, next);

    authHandler(null, null);
    expect(request.login).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(
      new AccessDeniedHttpException('Invalid Authentication Token')
    );
  });

  it('can authenticate a user by authentication token', async () => {
    const middleware = (request: Request, response: Response) => {};
    const authenticateSpy = spyOn(passport, 'authenticate').and.returnValue(
      middleware
    );

    await mock<Middleware>(firewall.middleware)(request, response, next);
    expect(authenticateSpy).toHaveBeenCalledWith(
      'jwt',
      { session: false },
      expect.any(Function)
    );
  });

  it('can be initialized', async () => {
    firewall.initialize();
  });

  it('can verify a user by using the passport.js payload', async () => {
    const payload = { userId: '0635f893-7b4e-44ba-9004-799f5a81efe8' };
    const done = jest.fn();

    await (firewall as any).verifyUser(payload, done);
    expect(done).toHaveBeenCalledWith(null, user);
  });

  it('can verify a user by using the passport.js payload (unable to find)', async () => {
    const payload = { userId: '0635f893-7b4e-44ba-9004-799f5a81efe8' };
    const done = jest.fn();

    userProvider.getUser = async () => undefined;

    await (firewall as any).verifyUser(payload, done);
    expect(done).toHaveBeenCalledWith('error');
  });

  describe('user serializer', () => {
    let userSerializer: UserSerializer;

    beforeEach(() => {
      userSerializer = new UserSerializer(container);
    });

    it('can serialize a user', async () => {
      const done = jest.fn();
      await userSerializer.serializeUser(user, done);
      expect(done).toHaveBeenCalledWith(null, user.id);
    });

    it('can deserialize a user', async () => {
      const done = jest.fn();
      await userSerializer.deserializeUser(user.id, done);
      expect(done).toHaveBeenCalledWith(null, user);
    });

    it('can initialize passport.js', async () => {
      const serializeUserSpy = spyOn(passport, 'serializeUser');
      const deserializeUserSpy = spyOn(passport, 'deserializeUser');

      userSerializer.initializePassport();

      expect(serializeUserSpy).toHaveBeenCalledWith(
        userSerializer.serializeUser
      );
      expect(deserializeUserSpy).toHaveBeenCalledWith(
        userSerializer.deserializeUser
      );
    });
  });
});
