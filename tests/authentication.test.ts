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

import { GraphQLSchema, execute } from 'graphql';
import gql from 'graphql-tag';
import { defaultAuthFn } from '../src';
import {
  AUTHENTICATION_ERROR_MESSAGE,
  HELLO_WORLD,
  Context,
  buildSchema,
  UserContext
} from './utils';

describe('Authentication', () => {
  const user: UserContext = { id: 0, roles: [], permissions: [] };
  const context: Context = { user };
  let schema: GraphQLSchema;

  beforeAll(() => {
    schema = buildSchema({ auth: defaultAuthFn });
  });

  // Unprotected query|mutation|subscription
  it('should succeed executing an unprotected query when unauthenticated', async () => {
    const { errors, data } = await execute({
      schema,
      document: gql`
        query {
          unprotected
        }
      `
    });

    expect(errors).toBeUndefined();
    expect(data?.unprotected).toBeDefined();
  });

  it('should succeed executing an unprotected mutation when unauthenticated', async () => {
    const { errors, data } = await execute({
      schema,
      document: gql`
        mutation {
          unprotected
        }
      `
    });

    expect(errors).toBeUndefined();
    expect(data?.unprotected).toBeDefined();
  });

  it('should succeed executing an unprotected subscription when unauthenticated', async () => {
    const { errors, data } = await execute({
      schema,
      document: gql`
        subscription {
          unprotected
        }
      `
    });

    expect(errors).toBeUndefined();
    expect(data?.unprotected).toBeDefined();
  });

  it('should succeed executing an unprotected query when authenticated', async () => {
    const { errors, data } = await execute({
      schema,
      document: gql`
        query {
          unprotected
        }
      `,
      contextValue: context
    });

    expect(errors).toBeUndefined();
    expect(data?.unprotected).toBeDefined();
  });

  it('should succeed executing an unprotected mutation when authenticated', async () => {
    const { errors, data } = await execute({
      schema,
      document: gql`
        mutation {
          unprotected
        }
      `,
      contextValue: context
    });

    expect(errors).toBeUndefined();
    expect(data?.unprotected).toBeDefined();
  });

  it('should succeed executing an unprotected subscription when authenticated', async () => {
    const { errors, data } = await execute({
      schema,
      document: gql`
        subscription {
          unprotected
        }
      `,
      contextValue: context
    });

    expect(errors).toBeUndefined();
    expect(data?.unprotected).toBeDefined();
  });

  // Protected query|mutation|subscription
  it('should fail executing a protected query when unauthenticated', async () => {
    const { errors, data } = await execute({
      schema,
      document: gql`
        query {
          protected {
            id
          }
        }
      `
    });

    expect(data?.protected).toBeUndefined();
    expect(Array.isArray(errors)).toBeTruthy();
    expect(errors).toHaveLength(1);
    expect(errors?.[0].message).toStrictEqual(AUTHENTICATION_ERROR_MESSAGE);
  });

  it('should fail executing a protected mutation when unauthenticated', async () => {
    const { errors, data } = await execute({
      schema,
      document: gql`
        mutation {
          protected {
            id
          }
        }
      `
    });

    expect(data?.protected).toBeUndefined();
    expect(Array.isArray(errors)).toBeTruthy();
    expect(errors).toHaveLength(1);
    expect(errors?.[0].message).toStrictEqual(AUTHENTICATION_ERROR_MESSAGE);
  });

  it('should fail executing a protected subscription when unauthenticated', async () => {
    const { errors, data } = await execute({
      schema,
      document: gql`
        subscription {
          protected {
            id
          }
        }
      `
    });

    expect(data?.protected).toBeUndefined();
    expect(Array.isArray(errors)).toBeTruthy();
    expect(errors).toHaveLength(1);
    expect(errors?.[0].message).toStrictEqual(AUTHENTICATION_ERROR_MESSAGE);
  });

  it('should succeed executing a protected query when authenticated', async () => {
    const { errors, data } = await execute({
      schema,
      document: gql`
        query {
          protected {
            id
            roles
            permissions
          }
        }
      `,
      contextValue: context
    });

    expect(errors).toBeUndefined();
    expect(data?.protected).toMatchObject(user);
  });

  it('should succeed executing a protected mutation when authenticated', async () => {
    const { errors, data } = await execute({
      schema,
      document: gql`
        mutation Protected {
          protected {
            id
            roles
            permissions
          }
        }
      `,
      contextValue: context
    });

    expect(errors).toBeUndefined();
    expect(data?.protected).toMatchObject(user);
  });

  it('should succeed executing a protected subscription when authenticated', async () => {
    const { errors, data } = await execute({
      schema,
      document: gql`
        subscription {
          protected {
            id
            roles
            permissions
          }
        }
      `,
      contextValue: context
    });

    expect(errors).toBeUndefined();
    expect(data?.protected).toMatchObject(user);
  });

  // Protected object field
  it('should fail executing an unprotected query and trying to access a protected object field when unauthenticated', async () => {
    const { errors, data } = await execute({
      schema,
      document: gql`
        query {
          protectedField {
            protected
          }
        }
      `
    });

    expect(data).toBeNull();
    expect(Array.isArray(errors)).toBeTruthy();
    expect(errors).toHaveLength(1);
    expect(errors?.[0].message).toStrictEqual(AUTHENTICATION_ERROR_MESSAGE);
  });

  it('should fail executing an unprotected mutation and trying to access a protected object field when unauthenticated', async () => {
    const { errors, data } = await execute({
      schema,
      document: gql`
        mutation {
          protectedField {
            protected
          }
        }
      `
    });

    expect(data).toBeNull();
    expect(Array.isArray(errors)).toBeTruthy();
    expect(errors).toHaveLength(1);
    expect(errors?.[0].message).toStrictEqual(AUTHENTICATION_ERROR_MESSAGE);
  });

  it('should fail executing an unprotected subscription and trying to access a protected object field when unauthenticated', async () => {
    const { errors, data } = await execute({
      schema,
      document: gql`
        subscription {
          protectedField {
            protected
          }
        }
      `
    });

    expect(data).toBeNull();
    expect(Array.isArray(errors)).toBeTruthy();
    expect(errors).toHaveLength(1);
    expect(errors?.[0].message).toStrictEqual(AUTHENTICATION_ERROR_MESSAGE);
  });

  it('should succeed executing an unprotected query and trying to access a protected object field when authenticated', async () => {
    const { errors, data } = await execute({
      schema,
      document: gql`
        query {
          protectedField {
            protected
          }
        }
      `,
      contextValue: context
    });

    expect(errors).toBeUndefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((data as any).protectedField.protected).toStrictEqual(HELLO_WORLD);
  });

  it('should succeed executing an unprotected mutation and trying to access a protected object field when authenticated', async () => {
    const { errors, data } = await execute({
      schema,
      document: gql`
        mutation {
          protectedField {
            protected
          }
        }
      `,
      contextValue: context
    });

    expect(errors).toBeUndefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((data as any)?.protectedField?.protected).toStrictEqual(HELLO_WORLD);
  });

  it('should succeed executing an unprotected subscription and trying to access a protected object field when authenticated', async () => {
    const { errors, data } = await execute({
      schema,
      document: gql`
        subscription {
          protectedField {
            protected
          }
        }
      `,
      contextValue: context
    });

    expect(errors).toBeUndefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((data as any)?.protectedField?.protected).toStrictEqual(HELLO_WORLD);
  });

  // Protected object
  it('should fail executing an unprotected query and trying to access a protected object when unauthenticated', async () => {
    const { errors, data } = await execute({
      schema,
      document: gql`
        query {
          protectedObject {
            unprotected
          }
        }
      `
    });

    expect(data).toBeNull();
    expect(Array.isArray(errors)).toBeTruthy();
    expect(errors).toHaveLength(1);
    expect(errors?.[0].message).toStrictEqual(AUTHENTICATION_ERROR_MESSAGE);
  });

  it('should fail executing an unprotected mutation and trying to access a protected object when unauthenticated', async () => {
    const { errors, data } = await execute({
      schema,
      document: gql`
        mutation {
          protectedObject {
            unprotected
          }
        }
      `
    });

    expect(data).toBeNull();
    expect(Array.isArray(errors)).toBeTruthy();
    expect(errors).toHaveLength(1);
    expect(errors?.[0].message).toStrictEqual(AUTHENTICATION_ERROR_MESSAGE);
  });

  it('should fail executing an unprotected subscription and trying to access a protected object when unauthenticated', async () => {
    const { errors, data } = await execute({
      schema,
      document: gql`
        subscription {
          protectedObject {
            unprotected
          }
        }
      `
    });

    expect(data).toBeNull();
    expect(Array.isArray(errors)).toBeTruthy();
    expect(errors).toHaveLength(1);
    expect(errors?.[0].message).toStrictEqual(AUTHENTICATION_ERROR_MESSAGE);
  });

  it('should succeed executing an unprotected query and trying to access a protected object when authenticated', async () => {
    const { errors, data } = await execute({
      schema,
      document: gql`
        query {
          protectedObject {
            unprotected
          }
        }
      `,
      contextValue: context
    });

    expect(errors).toBeUndefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((data as any)?.protectedObject?.unprotected).toStrictEqual(
      HELLO_WORLD
    );
  });

  it('should succeed executing an unprotected mutation and trying to access a protected object when authenticated', async () => {
    const { errors, data } = await execute({
      schema,
      document: gql`
        mutation {
          protectedObject {
            unprotected
          }
        }
      `,
      contextValue: context
    });

    expect(errors).toBeUndefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((data as any)?.protectedObject?.unprotected).toStrictEqual(
      HELLO_WORLD
    );
  });

  it('should succeed executing an unprotected subscription and trying to access a protected object when authenticated', async () => {
    const { errors, data } = await execute({
      schema,
      document: gql`
        subscription {
          protectedObject {
            unprotected
          }
        }
      `,
      contextValue: context
    });

    expect(errors).toBeUndefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((data as any)?.protectedObject?.unprotected).toStrictEqual(
      HELLO_WORLD
    );
  });

  // Unprotected input
  it('should succeed executing an unprotected query with an unprotected input when unauthenticated', async () => {
    const { errors, data } = await execute({
      schema,
      document: gql`
        query {
          unprotectedInput(data: { unprotected: "" })
        }
      `
    });

    expect(errors).toBeUndefined();
    expect(data?.unprotectedInput).toBeDefined();
  });

  it('should succeed executing an unprotected mutation with an unprotected input when unauthenticated', async () => {
    const { errors, data } = await execute({
      schema,
      document: gql`
        mutation {
          unprotectedInput(data: { unprotected: "" })
        }
      `
    });

    expect(errors).toBeUndefined();
    expect(data?.unprotectedInput).toBeDefined();
  });

  it('should succeed executing an unprotected subscription with an unprotected input when unauthenticated', async () => {
    const { errors, data } = await execute({
      schema,
      document: gql`
        subscription {
          unprotectedInput(data: { unprotected: "" })
        }
      `
    });

    expect(errors).toBeUndefined();
    expect(data?.unprotectedInput).toBeDefined();
  });

  it('should succeed executing an unprotected query with an unprotected input when authenticated', async () => {
    const { errors, data } = await execute({
      schema,
      document: gql`
        query {
          unprotectedInput(data: { unprotected: "" })
        }
      `,
      contextValue: context
    });

    expect(errors).toBeUndefined();
    expect(data?.unprotectedInput).toBeDefined();
  });

  it('should succeed executing an unprotected mutation with an unprotected input when authenticated', async () => {
    const { errors, data } = await execute({
      schema,
      document: gql`
        mutation {
          unprotectedInput(data: { unprotected: "" })
        }
      `,
      contextValue: context
    });

    expect(errors).toBeUndefined();
    expect(data?.unprotectedInput).toBeDefined();
  });

  it('should succeed executing an unprotected subscription with an unprotected input when authenticated', async () => {
    const { errors, data } = await execute({
      schema,
      document: gql`
        subscription {
          unprotectedInput(data: { unprotected: "" })
        }
      `,
      contextValue: context
    });

    expect(errors).toBeUndefined();
    expect(data?.unprotectedInput).toBeDefined();
  });
});
