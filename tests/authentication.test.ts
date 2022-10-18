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

import { graphql, GraphQLSchema } from 'graphql';
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
    const result = await graphql(schema, 'query { unprotected }');

    expect(result.errors).toBeUndefined();
    expect(result.data?.unprotected).toBeDefined();
  });

  it('should succeed executing an unprotected mutation when unauthenticated', async () => {
    const result = await graphql(schema, 'mutation { unprotected }');

    expect(result.errors).toBeUndefined();
    expect(result.data?.unprotected).toBeDefined();
  });

  it('should succeed executing an unprotected subscription when unauthenticated', async () => {
    const result = await graphql(schema, 'subscription { unprotected }');

    expect(result.errors).toBeUndefined();
    expect(result.data?.unprotected).toBeDefined();
  });

  it('should succeed executing an unprotected query when authenticated', async () => {
    const result = await graphql(
      schema,
      'query { unprotected }',
      null,
      context
    );

    expect(result.errors).toBeUndefined();
    expect(result.data?.unprotected).toBeDefined();
  });

  it('should succeed executing an unprotected mutation when authenticated', async () => {
    const result = await graphql(
      schema,
      'mutation { unprotected }',
      null,
      context
    );

    expect(result.errors).toBeUndefined();
    expect(result.data?.unprotected).toBeDefined();
  });

  it('should succeed executing an unprotected subscription when authenticated', async () => {
    const result = await graphql(
      schema,
      'subscription { unprotected }',
      null,
      context
    );

    expect(result.errors).toBeUndefined();
    expect(result.data?.unprotected).toBeDefined();
  });

  // Protected query|mutation|subscription
  it('should fail executing a protected query when unauthenticated', async () => {
    const result = await graphql(schema, 'query { protected { id } }');

    expect(result.data?.protected).toBeUndefined();
    expect(Array.isArray(result.errors)).toBeTruthy();
    expect(result.errors).toHaveLength(1);
    expect(result.errors?.[0].message).toStrictEqual(
      AUTHENTICATION_ERROR_MESSAGE
    );
  });

  it('should fail executing a protected mutation when unauthenticated', async () => {
    const result = await graphql(schema, 'mutation { protected { id } }');

    expect(result.data?.protected).toBeUndefined();
    expect(Array.isArray(result.errors)).toBeTruthy();
    expect(result.errors).toHaveLength(1);
    expect(result.errors?.[0].message).toStrictEqual(
      AUTHENTICATION_ERROR_MESSAGE
    );
  });

  it('should fail executing a protected subscription when unauthenticated', async () => {
    const result = await graphql(schema, 'subscription { protected { id } }');

    expect(result.data?.protected).toBeUndefined();
    expect(Array.isArray(result.errors)).toBeTruthy();
    expect(result.errors).toHaveLength(1);
    expect(result.errors?.[0].message).toStrictEqual(
      AUTHENTICATION_ERROR_MESSAGE
    );
  });

  it('should succeed executing a protected query when authenticated', async () => {
    const result = await graphql(
      schema,
      'query { protected { id, roles, permissions } }',
      null,
      context
    );

    expect(result.errors).toBeUndefined();
    expect(result.data?.protected).toMatchObject(user);
  });

  it('should succeed executing a protected mutation when authenticated', async () => {
    const result = await graphql(
      schema,
      'mutation Protected { protected { id, roles, permissions } }',
      null,
      context
    );

    expect(result.errors).toBeUndefined();
    expect(result.data?.protected).toMatchObject(user);
  });

  it('should succeed executing a protected subscription when authenticated', async () => {
    const result = await graphql(
      schema,
      'subscription { protected { id, roles, permissions } }',
      null,
      context
    );

    expect(result.errors).toBeUndefined();
    expect(result.data?.protected).toMatchObject(user);
  });

  // Protected object field
  it('should fail executing an unprotected query and trying to access a protected object field when unauthenticated', async () => {
    const result = await graphql(
      schema,
      'query { protectedField { protected } }'
    );

    expect(result.data).toBeNull();
    expect(Array.isArray(result.errors)).toBeTruthy();
    expect(result.errors).toHaveLength(1);
    expect(result.errors?.[0].message).toStrictEqual(
      AUTHENTICATION_ERROR_MESSAGE
    );
  });

  it('should fail executing an unprotected mutation and trying to access a protected object field when unauthenticated', async () => {
    const result = await graphql(
      schema,
      'mutation { protectedField { protected } }'
    );

    expect(result.data).toBeNull();
    expect(Array.isArray(result.errors)).toBeTruthy();
    expect(result.errors).toHaveLength(1);
    expect(result.errors?.[0].message).toStrictEqual(
      AUTHENTICATION_ERROR_MESSAGE
    );
  });

  it('should fail executing an unprotected subscription and trying to access a protected object field when unauthenticated', async () => {
    const result = await graphql(
      schema,
      'subscription { protectedField { protected } }'
    );

    expect(result.data).toBeNull();
    expect(Array.isArray(result.errors)).toBeTruthy();
    expect(result.errors).toHaveLength(1);
    expect(result.errors?.[0].message).toStrictEqual(
      AUTHENTICATION_ERROR_MESSAGE
    );
  });

  it('should succeed executing an unprotected query and trying to access a protected object field when authenticated', async () => {
    const result = await graphql(
      schema,
      'query { protectedField { protected } }',
      null,
      context
    );

    expect(result.errors).toBeUndefined();
    expect(result.data?.protectedField.protected).toStrictEqual(HELLO_WORLD);
  });

  it('should succeed executing an unprotected mutation and trying to access a protected object field when authenticated', async () => {
    const result = await graphql(
      schema,
      'mutation { protectedField { protected } }',
      null,
      context
    );

    expect(result.errors).toBeUndefined();
    expect(result.data?.protectedField.protected).toStrictEqual(HELLO_WORLD);
  });

  it('should succeed executing an unprotected subscription and trying to access a protected object field when authenticated', async () => {
    const result = await graphql(
      schema,
      'subscription { protectedField { protected } }',
      null,
      context
    );

    expect(result.errors).toBeUndefined();
    expect(result.data?.protectedField.protected).toStrictEqual(HELLO_WORLD);
  });

  // Protected object
  it('should fail executing an unprotected query and trying to access a protected object when unauthenticated', async () => {
    const result = await graphql(
      schema,
      'query { protectedObject { unprotected } }'
    );

    expect(result.data).toBeNull();
    expect(Array.isArray(result.errors)).toBeTruthy();
    expect(result.errors).toHaveLength(1);
    expect(result.errors?.[0].message).toStrictEqual(
      AUTHENTICATION_ERROR_MESSAGE
    );
  });

  it('should fail executing an unprotected mutation and trying to access a protected object when unauthenticated', async () => {
    const result = await graphql(
      schema,
      'mutation { protectedObject { unprotected } }'
    );

    expect(result.data).toBeNull();
    expect(Array.isArray(result.errors)).toBeTruthy();
    expect(result.errors).toHaveLength(1);
    expect(result.errors?.[0].message).toStrictEqual(
      AUTHENTICATION_ERROR_MESSAGE
    );
  });

  it('should fail executing an unprotected subscription and trying to access a protected object when unauthenticated', async () => {
    const result = await graphql(
      schema,
      'subscription { protectedObject { unprotected } }'
    );

    expect(result.data).toBeNull();
    expect(Array.isArray(result.errors)).toBeTruthy();
    expect(result.errors).toHaveLength(1);
    expect(result.errors?.[0].message).toStrictEqual(
      AUTHENTICATION_ERROR_MESSAGE
    );
  });

  it('should succeed executing an unprotected query and trying to access a protected object when authenticated', async () => {
    const result = await graphql(
      schema,
      'query { protectedObject { unprotected } }',
      null,
      context
    );

    expect(result.errors).toBeUndefined();
    expect(result.data?.protectedObject.unprotected).toStrictEqual(HELLO_WORLD);
  });

  it('should succeed executing an unprotected mutation and trying to access a protected object when authenticated', async () => {
    const result = await graphql(
      schema,
      'mutation { protectedObject { unprotected } }',
      null,
      context
    );

    expect(result.errors).toBeUndefined();
    expect(result.data?.protectedObject.unprotected).toStrictEqual(HELLO_WORLD);
  });

  it('should succeed executing an unprotected subscription and trying to access a protected object when authenticated', async () => {
    const result = await graphql(
      schema,
      'subscription { protectedObject { unprotected } }',
      null,
      context
    );

    expect(result.errors).toBeUndefined();
    expect(result.data?.protectedObject.unprotected).toStrictEqual(HELLO_WORLD);
  });

  // Unprotected input
  it('should succeed executing an unprotected query with an unprotected input when unauthenticated', async () => {
    const result = await graphql(
      schema,
      'query { unprotectedInput(data: { unprotected: "" }) }'
    );

    expect(result.errors).toBeUndefined();
    expect(result.data?.unprotectedInput).toBeDefined();
  });

  it('should succeed executing an unprotected mutation with an unprotected input when unauthenticated', async () => {
    const result = await graphql(
      schema,
      'mutation { unprotectedInput(data: { unprotected: "" }) }'
    );

    expect(result.errors).toBeUndefined();
    expect(result.data?.unprotectedInput).toBeDefined();
  });

  it('should succeed executing an unprotected subscription with an unprotected input when unauthenticated', async () => {
    const result = await graphql(
      schema,
      'subscription { unprotectedInput(data: { unprotected: "" }) }'
    );

    expect(result.errors).toBeUndefined();
    expect(result.data?.unprotectedInput).toBeDefined();
  });

  it('should succeed executing an unprotected query with an unprotected input when authenticated', async () => {
    const result = await graphql(
      schema,
      'query { unprotectedInput(data: { unprotected: "" }) }',
      null,
      context
    );

    expect(result.errors).toBeUndefined();
    expect(result.data?.unprotectedInput).toBeDefined();
  });

  it('should succeed executing an unprotected mutation with an unprotected input when authenticated', async () => {
    const result = await graphql(
      schema,
      'mutation { unprotectedInput(data: { unprotected: "" }) }',
      null,
      context
    );

    expect(result.errors).toBeUndefined();
    expect(result.data?.unprotectedInput).toBeDefined();
  });

  it('should succeed executing an unprotected subscription with an unprotected input when authenticated', async () => {
    const result = await graphql(
      schema,
      'subscription { unprotectedInput(data: { unprotected: "" }) }',
      null,
      context
    );

    expect(result.errors).toBeUndefined();
    expect(result.data?.unprotectedInput).toBeDefined();
  });
});
