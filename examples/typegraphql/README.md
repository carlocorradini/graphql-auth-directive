# [TypeGraphQL](https://github.com/MichalLytek/type-graphql)

- Building the *schema* requires a little bit more work than simply calling `buildSchema(...)`. See [index.ts](./index.ts) for more information.

- To avoid errors and repetitions, create the `@Auth(...)` decorator that wraps `@Directive('@auth(...)')`. See [Auth.ts](./Auth.ts) for more information.
