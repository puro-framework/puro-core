/**
 * @file firewall.ts
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

import { Request, Response, NextFunction, Handler } from './http';
import { AccessDeniedHttpException } from './http';
import { Container } from './container';
import { configs } from './configs';

import passport = require('passport');
import jwt = require('jsonwebtoken');

import {
  Strategy,
  StrategyOptions,
  VerifiedCallback,
  ExtractJwt,
} from 'passport-jwt';

/**
 * The application secret used to sign the token.
 */
const getSecret = () =>
  Buffer.from(configs.get<string>('app.secret'), 'base64');

/**
 * Returns a signed authorization token for a specific user.
 */
export const signAuthToken = (
  userId: any,
  options: jwt.SignOptions = { expiresIn: '1h' }
): string => {
  return jwt.sign({ userId: userId }, getSecret(), options);
};

/**
 * The user interface.
 */
export interface IUser {
  id: string;
  salt: string;
}

/**
 * The user provider interface.
 */
export interface IUserProvider {
  getUser(id: any): IUser;
}

/**
 * The user serializer.
 */
export class UserSerializer {
  /**
   * The container instance.
   */
  container: Container;

  /**
   * Constructor method.
   */
  constructor(container: Container) {
    this.container = container;

    this.serializeUser = this.serializeUser.bind(this);
    this.deserializeUser = this.deserializeUser.bind(this);
  }

  /**
   * Serializes the user.
   */
  async serializeUser(user: IUser, done: any) {
    done(null, user.id);
  }

  /**
   * Deserializes the user.
   */
  async deserializeUser(id: string, done: any) {
    const userProvider: IUserProvider = await this.container.get(
      'userProvider'
    );
    const user = await userProvider.getUser(id);
    done(null, user);
  }

  /**
   * Initilizes passport.js with the current instance of user serializer.
   */
  initializePassport() {
    passport.serializeUser(this.serializeUser);
    passport.deserializeUser(this.deserializeUser);
  }
}

/**
 * Builds and returns the authentication handler for passport.js.
 */
export const buildAuthHandler = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  return (error: any, user: IUser) => {
    // Handle errors
    if (!user) {
      return next(
        new AccessDeniedHttpException('Invalid Authentication Token')
      );
    }

    // Perform the authentication
    request.login(user, (error: any) => {
      if (error) {
        return next(error);
      }
      next();
    });
  };
};

/**
 * The firewall used for authenticating the user.
 */
export class Firewall {
  /**
   * The container instance.
   */
  container: Container;

  /**
   * Constructor method.
   */
  constructor(container: Container) {
    this.container = container;

    this.verifyUser = this.verifyUser.bind(this);
  }

  /**
   * The middleware to initialize the authentication.
   */
  initialize(): Handler {
    const strategyOptions: StrategyOptions = {
      secretOrKey: getSecret(),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    };

    const strategy = new Strategy(strategyOptions, this.verifyUser);
    passport.use(strategy);

    const userSerializer = new UserSerializer(this.container);
    userSerializer.initializePassport();

    return passport.initialize();
  }

  /**
   * The middleware for handling the Bearer Authentication.
   */
  async middleware(request: Request, response: Response, next: NextFunction) {
    const authHandler = buildAuthHandler(request, response, next);

    passport.authenticate('jwt', { session: false }, authHandler)(
      request,
      response,
      next
    );
  }

  /**
   * Verify callback for the passport.js strategy.
   */
  private async verifyUser(payload: any, done: VerifiedCallback) {
    const userProvider: IUserProvider = await this.container.get(
      'userProvider'
    );
    const user = await userProvider.getUser(payload.userId);

    if (!user) {
      return done('error');
    }

    done(null, user);
  }
}
