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

import 'reflect-metadata';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { buildTypeDefsAndResolversSync, registerEnumType } from 'type-graphql';
import { buildAuthDirective, defaultAuthFn } from '../../src';
import { Context, UserRoles, UserPermissions, main } from '../__commons';
import { UserResolver } from './UserResolver';
import { PostResolver } from './PostResolver';

// Build auth directive
const authDirective = buildAuthDirective<Context, UserRoles, UserPermissions>({
  auth: defaultAuthFn,
  roles: { enumName: 'UserRoles' },
  permissions: { enumName: 'UserPermissions' }
});
// const authDirective = buildAuthDirective({ auth: authFnClass, ... });

// Register UserRoles enum
registerEnumType(UserRoles, { name: 'UserRoles' });
// Register UserPermissions enum
registerEnumType(UserPermissions, { name: 'UserPermission' });

// Build schema
const { typeDefs, resolvers } = buildTypeDefsAndResolversSync({
  resolvers: [UserResolver, PostResolver]
});
const executableSchema = makeExecutableSchema({
  typeDefs: [authDirective.typeDefs, typeDefs],
  resolvers
});
const schema = authDirective.transformer(executableSchema);

// Main
main(schema);
