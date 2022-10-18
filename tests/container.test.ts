/*
 * MIT License
 *
 * Copyright (c) 2022-2022 Carlo Corradini
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

/* eslint-disable max-classes-per-file */

import { graphql } from 'graphql';
import { Container, Inject, Service } from 'typedi';
import {
  AuthData,
  AuthFnClass,
  ResolverData,
  defaultAuthFn,
  ContainerType
} from '../src';
import { buildSchema, Context, UserContext } from './utils';

@Service()
class WaitService {
  public static readonly DEFAULT_WAIT_MS: number = 250;

  // eslint-disable-next-line class-methods-use-this
  public async wait(time: number = WaitService.DEFAULT_WAIT_MS): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  }
}

@Service()
class AuthService implements AuthFnClass {
  @Inject()
  private readonly waitService!: WaitService;

  public async auth(
    resolverData: ResolverData,
    authData: AuthData
  ): Promise<boolean> {
    await this.waitService.wait();
    return defaultAuthFn(resolverData, authData);
  }
}

class Auth implements AuthFnClass {
  // eslint-disable-next-line class-methods-use-this
  public auth(
    resolverData: ResolverData,
    authData: AuthData
  ): boolean | Promise<boolean> {
    return defaultAuthFn(resolverData, authData);
  }
}

describe('Container', () => {
  const user: UserContext = { id: 0, roles: [], permissions: [] };
  const context: Context = { user };

  beforeEach(() => {
    Container.reset();
  });

  it('should use default container to instantiate auth class', async () => {
    const schema = buildSchema({ auth: Auth });
    const result = await graphql(
      schema,
      'query { protected { id, roles, permissions } }',
      null,
      context
    );

    expect(result.errors).toBeUndefined();
    expect(result.data?.protected).toMatchObject(user);
  });

  it('should use provided container to load auth class', async () => {
    const schema = buildSchema({ auth: AuthService, container: Container });
    const result = await graphql(
      schema,
      'query { protected { id, roles, permissions } }',
      null,
      context
    );

    expect(result.errors).toBeUndefined();
    expect(result.data?.protected).toMatchObject(user);
  });

  it("should pass resolver's data to container's get", async () => {
    let userContext: undefined | UserContext;
    const container: ContainerType = {
      get(someClass, resolverData: ResolverData<Context>) {
        userContext = resolverData.context.user;
        return Container.get(someClass);
      }
    };
    const schema = buildSchema({ auth: AuthService, container });
    const result = await graphql(
      schema,
      'query { protected { id, roles, permissions } }',
      null,
      context
    );

    expect(result.errors).toBeUndefined();
    expect(result.data?.protected).toMatchObject(user);
    expect(userContext).toMatchObject(user);
  });

  it('should get instance from an async container', async () => {
    let called = false;
    const container: ContainerType = {
      async get(someClass) {
        await new WaitService().wait();
        called = true;
        return Container.get(someClass);
      }
    };
    const schema = buildSchema({
      auth: AuthService,
      container
    });
    const result = await graphql(
      schema,
      'query { protected { id, roles, permissions } }',
      null,
      context
    );

    expect(result.errors).toBeUndefined();
    expect(result.data?.protected).toMatchObject(user);
    expect(called).toBeTruthy();
  });
});
