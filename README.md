# graphql-auth-directive

[![ci](https://github.com/carlocorradini/graphql-auth-directive/actions/workflows/ci.yml/badge.svg)](https://github.com/carlocorradini/graphql-auth-directive/actions/workflows/ci.yml)
[![codeql](https://github.com/carlocorradini/graphql-auth-directive/actions/workflows/codeql.yml/badge.svg)](https://github.com/carlocorradini/graphql-auth-directive/actions/workflows/codeql.yml)
[![codecov](https://codecov.io/gh/carlocorradini/graphql-auth-directive/branch/main/graph/badge.svg?token=40X7S64UQI)](https://codecov.io/gh/carlocorradini/graphql-auth-directive)
[![Snyk](https://snyk.io/test/github/carlocorradini/graphql-auth-directive/badge.svg)](https://snyk.io/test/github/carlocorradini/graphql-auth-directive)
[![Codacy](https://app.codacy.com/project/badge/Grade/6e8bda1bf3b348f8b39de72499d01cc2)](https://www.codacy.com/gh/carlocorradini/graphql-auth-directive/dashboard?utm_source=github.com&utm_medium=referral&utm_content=carlocorradini/graphql-auth-directive&utm_campaign=Badge_Grade)
[![FOSSA](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fcarlocorradini%2Fgraphql-auth-directive.svg?type=small)](https://app.fossa.com/projects/git%2Bgithub.com%2Fcarlocorradini%2Fgraphql-auth-directive?ref=badge_small)

GraphQL `@auth` directive that protects resources from unauthenticated and unauthorized access.

Inspired by [TypeGraphQL](https://typegraphql.com) and [GraphQL Tools](https://the-guild.dev/graphql/tools).

:warning: **Under development**

:wave: **Any help is appreciated**

## Installation

### npm

```console
npm install graphql-auth-directive
```

### yarn

```console
yarn add graphql-auth-directive
```

## Usage

> **Note**: See [examples](./examples) directory

1. Add `@auth` directive to *GraphQL* schema:

   > **Note**: `on OBJECT | FIELD | FIELD_DEFINITION`

   ```graphql
   type Example @auth {
    unprotected: String!
    adminProtected: String! @auth(roles: [ADMIN])
   }

   type Query {
    unprotected: String!
    protected: String! @auth
    adminRoleProtected: String! @auth(roles: [ADMIN])
    adminOrModeratorRolesProtected: String! @auth(roles: [ADMIN, MODERATOR])
    viewPermissionProtected: String! @auth(permissions: [VIEW])
    viewOrEditPermissionsProtected: String! @auth(permissions: [VIEW, EDIT])
    roleAndPermissionProtected: String! @auth(roles: [ADMIN], permissions: [VIEW])
    # ...
   }

   type Mutation {
    # Same as Query
   }

   type Subscription {
    # Same as Query
   }
   ```

1. Define a custom `auth` function:

   > **Note**: Class based `auth` is also possible leveraging Dependency Injection (DI) mechanism. Define a class that implements `AuthFnClass<TContext, TRole, TPermission>` interface.

   ```ts
   import type { AuthFn } from 'graphql-auth-directive';
   import type { Context } from './Context'; // Your context type
   import type { Roles, Permissions } from './User'; // Your roles and permissions enum

   export const authFn: AuthFn<Context, Roles, Permissions> = (
     { context: { user } }, // Context
     { roles, permissions } // @auth(roles: [...], permissions: [...])
   ) => {
     // No user
     if (!user) { return false; }

     // Only authentication required
     if (roles.length === 0 && permissions.length === 0) { return true; }

     // Roles
     const rolesMatch: boolean =
       roles.length === 0
         ? true
         : user.roles.some((role) => roles.includes(role));
     // Permissions
     const permissionsMatch: boolean =
       permissions.length === 0
         ? true
         : user.permissions.some((permission) =>
             permissions.includes(permission)
           );
     // Roles & Permissions
     return rolesMatch && permissionsMatch;
   };
   ```

1. Build `auth` directive and create `GraphQL` schema:

   > **Note**: To enable DI mechanism register your OCI Container when building the directive: `buildAuthDirective({ ..., container: MyContainer });`

   ```ts
   import { buildAuthDirective } from 'graphql-auth-directive';
   import { makeExecutableSchema } from '@graphql-tools/schema';
   import { ApolloServer } from 'apollo-server';
   import { typeDefs } from './typeDefs';
   import { resolvers } from './resolvers';
   import { authFn } from './authFn';

   // Build auth directive
   const authDirective = buildAuthDirective({ auth: authFn });

   // Build schema
   let schema = makeExecutableSchema({
     typeDefs: [authDirective.typeDefs, typeDefs], // TypeDefs
     resolvers // Resolvers
   });
   schema = authDirective.transformer(schema); // Transform schema

   // Build and start server
   const server = new ApolloServer({
     schema,
     context: () => {
       /* ... */
     }
   });
   server
     .listen()
     .then((serverInfo) => console.info(`Server started at ${serverInfo.url}`));
   ```

### Options

| Name                  | Type                                           | Default Value                              | Description                                                                                                                                               |
| --------------------- | ---------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                | `string`                                       | `auth`                                     | Directive name.                                                                                                                                           |
| `auth`                | `Auth<TContext, TRole, TPermission>`                               |                                            | Auth function (`AuthFn<TContext, TRole, TPermission>`) or class (`AuthFnClass<TContext, TRole, TPermission>`).                                                                                    |
| `authMode`            | `'ERROR' \| 'NULL'`                            | `ERROR`                                    | Auth mode if access is not granted. `ERROR` throws an error. `NULL` returns `null`.                                                                       |
| `roles`               | `{ enumName?: string, default?: TRole \| TRole[] }` | `{ enumName: undefined, default: undefined }` | Roles configuration. `enumName` is the enum name for `roles` array type, default is `String`. `default` is the default value, default to `[]`.             |
| `permissions`         | `{ enumName?: string, default?: TPermission \| TPermission[] }` | `{ enumName: undefined, default: undefined }` | Permissions configuration. `enumName` is the enum name for `permissions` array type, default is `String`. `default` is the default value, default to `[]`. |
| `authenticationError` | `ClassTypeEmptyConstructor<Error>`             | `AuthenticationError`                      | Authentication error class. An error class must extends `Error`.                                                                                          |
| `authorizationError`  | `ClassTypeEmptyConstructor<Error>`             | `AuthorizationError`                       | Authorization error class. An error class must extends `Error`.                                                                                           |
| `container`           | `ContainerType`                                | `IOCContainer`                             | Dependency injection container.                                                                                                                           |

## Integrations

### [TypeGraphQL](https://github.com/MichalLytek/type-graphql)

See [typegraphql](./examples/typegraphql) example for more information.

## Why another GraphQL Auth Directive?

Similar libraries are unmaintained and use an old (and deprecated) version of [graphql-tools](https://the-guild.dev/graphql/tools).
Moreover this library tries to be as most modular as possible, giving the user the ability to configure the directive as much as possible.

Similar libraries:

1. [graphql-auth-user-directives](https://github.com/nmeibergen/graphql-auth-user-directives)

1. [graphql-directive-auth](https://github.com/graphql-community/graphql-directive-auth)

1. [graphql-auth-directives](https://github.com/grand-stack/graphql-auth-directives)

1. [gql-auth-directives](https://github.com/Drakota/gql-auth-directives)

## Contributing

I would love to see your contribution :heart:

See [CONTRIBUTING](./CONTRIBUTING.md) guidelines.

## License

This project is licensed under the [MIT](https://opensource.org/licenses/MIT) License. \
See [LICENSE](./LICENSE) file for details.

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fcarlocorradini%2Fgraphql-auth-directive.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fcarlocorradini%2Fgraphql-auth-directive?ref=badge_large)
