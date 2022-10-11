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

import { ApolloServer } from 'apollo-server';
import { buildAuthDirective } from '../src';
import {
  AuthFnClass,
  buildServer,
  AUTHENTICATION_ERROR_MESSAGE
} from './utils';

describe('Authentication required', () => {
  let server: ApolloServer;

  beforeAll(() => {
    server = buildServer(buildAuthDirective({ auth: AuthFnClass }));
  });

  // Unprotected field|mutation|subscription
  it('should succeed executing an unprotected query when unauthenticated', async () => {
    const result = await server.executeOperation({
      query: 'query { unprotected }'
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();
    expect(result.data?.unprotected).toBeDefined();
  });

  it('should succeed executing an unprotected mutation when unauthenticated', async () => {
    const result = await server.executeOperation({
      query: 'mutation { unprotected }'
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();
    expect(result.data?.unprotected).toBeDefined();
  });

  it('should succeed executing an unprotected subscription when unauthenticated', async () => {
    const result = await server.executeOperation({
      query: 'subscription { unprotected }'
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();
    expect(result.data?.unprotected).toBeDefined();
  });

  // Protected field|mutation|subscription
  it('should fail executing an protected query when unauthenticated', async () => {
    const result = await server.executeOperation({
      query: 'query { protected }'
    });

    expect(result.data).toBeNull();
    expect(result.errors).toBeDefined();
    expect(result.errors).toHaveLength(1);
    expect(result.errors?.[0].message).toEqual(AUTHENTICATION_ERROR_MESSAGE);
  });

  it('should fail executing a protected mutation when unauthenticated', async () => {
    const result = await server.executeOperation({
      query: 'mutation { protected }'
    });

    expect(result.data).toBeNull();
    expect(result.errors).toBeDefined();
    expect(result.errors).toHaveLength(1);
    expect(result.errors?.[0].message).toEqual(AUTHENTICATION_ERROR_MESSAGE);
  });

  it('should fail executing a protected subscription when unauthenticated', async () => {
    const result = await server.executeOperation({
      query: 'subscription { protected }'
    });

    expect(result.data).toBeNull();
    expect(result.errors).toBeDefined();
    expect(result.errors).toHaveLength(1);
    expect(result.errors?.[0].message).toEqual(AUTHENTICATION_ERROR_MESSAGE);
  });

  // Protected object field
  it('should fail executing an unprotected query and trying to access a protected object field when unauthenticated', async () => {
    const result = await server.executeOperation({
      query: 'query { protectedField { protected } }'
    });

    expect(result.data).toBeNull();
    expect(result.errors).toBeDefined();
    expect(result.errors).toHaveLength(1);
    expect(result.errors?.[0].message).toEqual(AUTHENTICATION_ERROR_MESSAGE);
  });

  it('should fail executing an unprotected mutation and trying to access a protected object field when unauthenticated', async () => {
    const result = await server.executeOperation({
      query: 'mutation { protectedField { protected } }'
    });

    expect(result.data).toBeNull();
    expect(result.errors).toBeDefined();
    expect(result.errors).toHaveLength(1);
    expect(result.errors?.[0].message).toEqual(AUTHENTICATION_ERROR_MESSAGE);
  });

  it('should fail executing an unprotected subscription and trying to access a protected object field when unauthenticated', async () => {
    const result = await server.executeOperation({
      query: 'subscription { protectedField { protected } }'
    });

    expect(result.data).toBeNull();
    expect(result.errors).toBeDefined();
    expect(result.errors).toHaveLength(1);
    expect(result.errors?.[0].message).toEqual(AUTHENTICATION_ERROR_MESSAGE);
  });

  // Protected object
  it('should fail executing an unprotected query and trying to access a protected object when unauthenticated', async () => {
    const result = await server.executeOperation({
      query: 'query { protectedObject { unprotected } }'
    });

    expect(result.data).toBeNull();
    expect(result.errors).toBeDefined();
    expect(result.errors).toHaveLength(1);
    expect(result.errors?.[0].message).toEqual(AUTHENTICATION_ERROR_MESSAGE);
  });

  it('should fail executing an unprotected mutation and trying to access a protected object when unauthenticated', async () => {
    const result = await server.executeOperation({
      query: 'mutation { protectedObject { unprotected } }'
    });

    expect(result.data).toBeNull();
    expect(result.errors).toBeDefined();
    expect(result.errors).toHaveLength(1);
    expect(result.errors?.[0].message).toEqual(AUTHENTICATION_ERROR_MESSAGE);
  });

  it('should fail executing an unprotected subscription and trying to access a protected object when unauthenticated', async () => {
    const result = await server.executeOperation({
      query: 'subscription { protectedObject { unprotected } }'
    });

    expect(result.data).toBeNull();
    expect(result.errors).toBeDefined();
    expect(result.errors).toHaveLength(1);
    expect(result.errors?.[0].message).toEqual(AUTHENTICATION_ERROR_MESSAGE);
  });

  // Unprotected input
  it('should succeed executing an unprotected query with an unprotected input when unauthenticated', async () => {
    const result = await server.executeOperation({
      query: 'query { unprotectedInput(data: { unprotected: "" }) }'
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();
    expect(result.data?.unprotectedInput).toBeDefined();
  });

  it('should succeed executing an unprotected mutation with an unprotected input when unauthenticated', async () => {
    const result = await server.executeOperation({
      query: 'mutation { unprotectedInput(data: { unprotected: "" }) }'
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();
    expect(result.data?.unprotectedInput).toBeDefined();
  });

  it('should succeed executing an unprotected subscription with an unprotected input when unauthenticated', async () => {
    const result = await server.executeOperation({
      query: 'subscription { unprotectedInput(data: { unprotected: "" }) }'
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();
    expect(result.data?.unprotectedInput).toBeDefined();
  });
});
