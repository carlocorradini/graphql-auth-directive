# graphql-auth-directive

[![ci](https://github.com/carlocorradini/graphql-auth-directive/actions/workflows/ci.yml/badge.svg)](https://github.com/carlocorradini/graphql-auth-directive/actions/workflows/ci.yml)
[![codeql](https://github.com/carlocorradini/graphql-auth-directive/actions/workflows/codeql.yml/badge.svg)](https://github.com/carlocorradini/graphql-auth-directive/actions/workflows/codeql.yml)
[![codecov](https://codecov.io/gh/carlocorradini/graphql-auth-directive/branch/main/graph/badge.svg?token=40X7S64UQI)](https://codecov.io/gh/carlocorradini/graphql-auth-directive)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fcarlocorradini%2Fgraphql-auth-directive.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fcarlocorradini%2Fgraphql-auth-directive?ref=badge_shield)

GraphQL `@auth` directive that protects resources from unauthenticated and unauthorized access.

Inspired by [TypeGraphQL](https://typegraphql.com) and [GraphQL Tools](https://the-guild.dev/graphql/tools).

:warning: **Under development**

:wave: **Any help is appreciated**

## Installation

> It's highly recommended to install `@graphql-tools/schema`

### npm

```console
npm install graphql-auth-directive
```

### yarn

```console
yarn add graphql-auth-directive
```

## Usage

> For more examples see [examples](examples) directory.

1. Add `@auth` directive to schema:

   ```graphql
   # Authentication required
   @auth

   # ADMIN Enum role required
   @auth(roles = [ADMIN])

   # ADMIN or MODERATOR Enum role required
   @auth(roles = [ADMIN, MODERATOR])

   # "ADMIN" String role required
   @auth(roles = ["ADMIN"])

   # "ADMIN" or "MODERATOR" String role required
   @auth(roles = ["ADMIN", "MODERATOR"])

   # READ_POST Enum permission required
   @auth(permissions = [READ_POST])

   # READ_POST or EDIT_POST Enum permission required
   @auth(roles = [READ_POST, EDIT_POST])

   # READ_POST String permission required
   @auth(permissions = ["READ_POST"])

   # READ_POST or EDIT_POST String permission required
   @auth(permissions = ["READ_POST", "EDIT_POST"])

   # ADMIN Enum role and EDIT_POST Enum permission required
   @auth(roles = [ADMIN], permissions = [EDIT_POST])

   # ADMIN String role and EDIT_POST String permission required
   @auth(roles = [ADMIN], permissions = [EDIT_POST])
   ```

1. Create a custom `auth` function:

   ```ts
   import type { AuthFn } from 'graphql-auth-directive';
   import type { Context } from './Context'; // Your context type

   export const authFn: AuthFn<Context> = (
     { context: { user } }, // Context
     { roles, permissions } // Required @auth(roles: [...], permissions: [...])
   ) => {
     if (!user) {
       // No user
       return false;
     }

     if (roles.length === 0 && permissions.length === 0) {
       // Only authentication required
       return true;
     }

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
     typeDefs: [authDirective.typeDefs, typeDefs],
     resolvers
   });
   schema = authDirective.transformer(schema);

   // Build and start server
   const server = new ApolloServer({
     schema,
     context: () => {
       /* TODO */
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
| `auth`                | `Auth<TContext>`                               |                                            | Auth function (`AuthFn<TContext>`) or class (`AuthFnClass<TContext>`).                                                                                    |
| `authMode`            | `'ERROR' \| 'NULL'`                            | `ERROR`                                    | Auth mode if access is not granted. `ERROR` throws an error. `NULL` returns `null`.                                                                       |
| `roles`               | `{ typeName?: string, defaultValue?: string }` | `{ typeName: 'String', defaultValue: '' }` | Roles configuration. `typeName` is the type name of `roles` array. `defaultValue` is the default value, an empty value is equivalent to `[]`.             |
| `permissions`         | `{ typeName?: string, defaultValue?: string }` | `{ typeName: 'String', defaultValue: '' }` | Permissions configuration. `typeName` is the type name of `permissions` array. `defaultValue` is the default value, an empty value is equivalent to `[]`. |
| `authenticationError` | `ClassTypeEmptyConstructor<Error>`             | `AuthenticationError`                      | Authentication error class. An error class must extends `Error`.                                                                                          |
| `authorizationError`  | `ClassTypeEmptyConstructor<Error>`             | `AuthorizationError`                       | Authorization error class. An error class must extends `Error`.                                                                                           |
| `container`           | `ContainerType`                                | `IOCContainer`                             | Dependency injection container.                                                                                                                           |

### Positioning

> `OBJECT | FIELD | FIELD_DEFINITION`

```graphql
type Protected @auth {
  unprotected: String!
}

type ProtectedField {
  protected: String! @auth
}

type Query {
  protected: String! @auth
}

type Mutation {
  protected: String! @auth
}

type Subscription {
  protected: String! @auth
}
```

## Contributing

I would love to see your contribution :heart:

### Setup

Install dependencies

```console
npm ci
```

### VSCode

Supported and configured with recommended extensions and settings :tada:

### Test

- Simple

  ```console
  npm run test
  ```

- Watch mode

  ```console
  npm run test:watch
  ```

- Coverage

  ```console
  npm run test:coverage
  ```

## Why another GraphQL Auth Directive?

Similar libraries are unmaintained and use an old (and deprecated) version of [graphql-tools](https://the-guild.dev/graphql/tools).
Moreover this library tries to be as most modular as possible, giving the user the ability to configure the directive as much as possible.

Similar libraries:

1. [graphql-auth-user-directives](https://github.com/nmeibergen/graphql-auth-user-directives)

1. [graphql-directive-auth](https://github.com/graphql-community/graphql-directive-auth)

1. [graphql-auth-directives](https://github.com/grand-stack/graphql-auth-directives)

1. [gql-auth-directives](https://github.com/Drakota/gql-auth-directives)

## License

This project is licensed under the [MIT](https://opensource.org/licenses/MIT) License. \
See [LICENSE](LICENSE) file for details.


[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fcarlocorradini%2Fgraphql-auth-directive.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fcarlocorradini%2Fgraphql-auth-directive?ref=badge_large)