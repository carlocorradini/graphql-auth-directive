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

import { GraphQLSchema, defaultFieldResolver } from 'graphql';
import { mapSchema, MapperKind, getDirective } from '@graphql-tools/utils';
import type {
  AuthFn,
  AuthData,
  AuthDirectiveArgs,
  Context,
  ResolverData,
  AuthDirective
} from '~/types';
import { AuthenticationError, AuthorizationError } from '~/errors';
import { IOCContainer } from '~/utils';

export function buildAuthDirective<
  TContext = Context,
  TRole = string,
  TPermission = string
>(inArgs: AuthDirectiveArgs<TContext, TRole, TPermission>) {
  const opts: Required<
    Omit<AuthDirectiveArgs<TContext, TRole, TPermission>, 'container'> & {
      container: IOCContainer;
    }
  > = {
    name: inArgs.name ?? 'auth',
    auth: inArgs.auth,
    authMode: inArgs.authMode ?? 'ERROR',
    roles: {
      typeName: inArgs.roles?.typeName ?? 'String',
      defaultValue: inArgs?.roles?.defaultValue ?? ''
    },
    permissions: {
      typeName: inArgs.permissions?.typeName ?? 'String',
      defaultValue: inArgs?.permissions?.defaultValue ?? ''
    },
    authenticationError: inArgs.authenticationError ?? AuthenticationError,
    authorizationError: inArgs.authorizationError ?? AuthorizationError,
    container: new IOCContainer(inArgs.container)
  };
  const typeDirectiveArgumentMaps: Record<string, unknown> = {};

  return <AuthDirective>{
    typeDefs: `
      """Protect the resource from unauthenticated and unauthorized access."""
      directive @${opts.name}(
        """Allowed roles to access the resource."""
        roles: [${opts.roles.typeName}!]! = [${opts.roles.defaultValue}],
        """Allowed permissions to access the resource."""
        permissions: [${opts.permissions.typeName}!]! = [${
      opts.permissions.defaultValue ?? ''
    }],
      ) on OBJECT | FIELD | FIELD_DEFINITION`,
    transformer: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.TYPE]: (type) => {
          const directive = getDirective(schema, type, opts.name)?.[0];
          if (directive) {
            typeDirectiveArgumentMaps[type.name] = directive;
          }
          return undefined;
        },
        // eslint-disable-next-line consistent-return
        [MapperKind.OBJECT_FIELD]: (fieldConfig, _, typeName) => {
          const directive =
            getDirective(schema, fieldConfig, opts.name)?.[0] ??
            typeDirectiveArgumentMaps[typeName];

          if (directive) {
            const {
              roles,
              permissions
            }: Partial<AuthData<TRole, TPermission>> = directive;

            if (roles && permissions) {
              const { resolve = defaultFieldResolver } = fieldConfig;

              // eslint-disable-next-line no-param-reassign
              fieldConfig.resolve = async (source, args, context, info) => {
                let accessGranted: boolean;
                const resolverData: ResolverData<TContext> = {
                  source,
                  args,
                  context,
                  info
                };
                const authData: AuthData<TRole, TPermission> = {
                  roles,
                  permissions
                };

                if (opts.auth.prototype) {
                  // Auth class
                  const authFnClassInstance = await opts.container.getInstance(
                    opts.auth,
                    resolverData
                  );
                  accessGranted = await authFnClassInstance.auth(
                    resolverData,
                    authData
                  );
                } else {
                  // Auth function
                  accessGranted = await (
                    opts.auth as AuthFn<TContext, TRole, TPermission>
                  )(resolverData, authData);
                }

                if (!accessGranted) {
                  switch (opts.authMode) {
                    case 'NULL':
                      return null;
                    case 'ERROR':
                    default:
                      throw roles.length === 0 && permissions.length === 0
                        ? // eslint-disable-next-line new-cap
                          new opts.authenticationError()
                        : // eslint-disable-next-line new-cap
                          new opts.authorizationError();
                  }
                }

                return resolve(source, args, context, info);
              };

              return fieldConfig;
            }
          }
        }
      })
  };
}
