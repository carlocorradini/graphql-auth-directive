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

import { makeExecutableSchema } from '@graphql-tools/schema';
import { gql } from 'apollo-server';
import { AuthDirective } from '../../src';

const HELLO_WORLD = 'Hello World!';

const typeDefs = gql`
  type ProtectedObject @auth {
    unprotected: String!
  }

  type ProtectedField {
    protected: String! @auth
  }

  input UnprotectedInput {
    unprotected: String!
  }

  type Query {
    unprotected: String!
    protected: String! @auth
    protectedField: ProtectedField!
    protectedObject: ProtectedObject!
    unprotectedInput(data: UnprotectedInput!): String!
  }

  type Mutation {
    unprotected: String!
    protected: String! @auth
    protectedField: ProtectedField!
    protectedObject: ProtectedObject!
    unprotectedInput(data: UnprotectedInput!): String!
  }

  type Subscription {
    unprotected: String!
    protected: String! @auth
    protectedField: ProtectedField!
    protectedObject: ProtectedObject!
    unprotectedInput(data: UnprotectedInput!): String!
  }
`;

const resolvers = {
  Query: {
    unprotected: () => HELLO_WORLD,
    protected: () => HELLO_WORLD,
    protectedField: () => ({ protected: HELLO_WORLD }),
    protectedObject: () => ({ unprotected: HELLO_WORLD }),
    unprotectedInput: () => HELLO_WORLD
  },
  Mutation: {
    unprotected: () => HELLO_WORLD,
    protected: () => HELLO_WORLD,
    protectedField: () => ({ protected: HELLO_WORLD }),
    protectedObject: () => ({ unprotected: HELLO_WORLD }),
    unprotectedInput: () => HELLO_WORLD
  },
  Subscription: {
    unprotected: () => HELLO_WORLD,
    protected: () => HELLO_WORLD,
    protectedField: () => ({ protected: HELLO_WORLD }),
    protectedObject: () => ({ unprotected: HELLO_WORLD }),
    unprotectedInput: () => HELLO_WORLD
  }
};

export function buildSchema(authDirective: AuthDirective) {
  return authDirective.transformer(
    makeExecutableSchema({
      typeDefs: [authDirective.typeDefs, typeDefs],
      resolvers
    })
  );
}
