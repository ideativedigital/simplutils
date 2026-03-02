# OpenAPI generation

Drop your OpenAPI file in this folder (for example `schema.yaml`) and run:

```bash
pnpm --filter @simplutils/docs openapi:generate -- --input ./openapi/schema.yaml --output ./openapi/generated.ts
```

Or use the interactive website helper:

```bash
pnpm docs:web
```

The generated file includes:

- `export const User = z.object(...)`
- `export type User = z.infer<typeof User>`
- `resource<User>(...)` instances
- `createResourceStore(...)` instances

## Resource/store mapping

By default, every schema in `components.schemas` gets:

- `resourceName`: `<schemaName>Resource` (camelCase)
- `storeName`: `use<SchemaName>Store` (camelCase with `use` prefix)
- `urlPrefix`: `/<schema-name>s`

You can override those values with `x-simplutils.resources` in your OpenAPI root:

```yaml
x-simplutils:
  resources:
    - schema: User
      urlPrefix: /api/users
      resourceName: usersResource
      storeName: useUsersStore
```
