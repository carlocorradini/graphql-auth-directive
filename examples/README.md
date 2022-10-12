# Examples

Build examples:

```console
npx tsc --build tsconfig.json
```

Every example outputs an authorization token that can be used for `@auth` resources. Remember to add the token in the header: `Authorization: Bearer <TOKEN>`

## Simple

```console
node ../build/examples/simple/index.js
```

## [TypeGraphQL](https://github.com/MichalLytek/type-graphql)

```console
node ../build/examples/typegraphql/index.js
```
