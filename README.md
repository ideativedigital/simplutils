# @ideative/simplutils

TypeScript utility library focused on runtime helpers and strong typings.

[![npm version](https://img.shields.io/npm/v/@ideative/simplutils.svg)](https://www.npmjs.com/package/@ideative/simplutils)
[![npm downloads](https://img.shields.io/npm/dm/@ideative/simplutils.svg)](https://www.npmjs.com/package/@ideative/simplutils)
[![GitHub Actions: Publish](https://img.shields.io/github/actions/workflow/status/acominotto/simplutils/publish.yml?branch=main&label=publish)](https://github.com/acominotto/simplutils/actions/workflows/publish.yml)
[![GitHub Actions: Docs](https://img.shields.io/github/actions/workflow/status/acominotto/simplutils/deploy-docs.yml?branch=main&label=docs)](https://github.com/acominotto/simplutils/actions/workflows/deploy-docs.yml)

## Links

- Package: https://www.npmjs.com/package/@ideative/simplutils
- Repository: https://github.com/acominotto/simplutils
- Docs website: https://acominotto.github.io/simplutils/
- API docs: https://acominotto.github.io/simplutils/docs/

## Installation

```bash
npm install @ideative/simplutils
# or
pnpm add @ideative/simplutils
# or
yarn add @ideative/simplutils
```

## Peer dependencies

Some subpath modules require peers:

```bash
pnpm add zod zod-ky
```

For the zustand adapter:

```bash
pnpm add zustand
```

## Package exports

- `@ideative/simplutils`
- `@ideative/simplutils/arrays`
- `@ideative/simplutils/objects`
- `@ideative/simplutils/types`
- `@ideative/simplutils/types/zod`
- `@ideative/simplutils/strings`
- `@ideative/simplutils/enums`
- `@ideative/simplutils/countries`
- `@ideative/simplutils/resource`
- `@ideative/simplutils/zustand`
- `@ideative/simplutils/throttle`
- `@ideative/simplutils/try`
- `@ideative/simplutils/views`

## Quick start

```ts
import { batch, deepEqual, interpolate, isDefined } from "@ideative/simplutils";

const chunks = batch([1, 2, 3, 4], 2); // [[1,2],[3,4]]
const same = deepEqual({ a: 1 }, { a: 1 }); // true
const msg = interpolate("Hello {name}", { name: "World" }); // Hello World
const clean = [1, null, 2, undefined].filter(isDefined); // [1,2]
```

## Resource + Zustand examples

### 1) Create a resource and a store

```ts
import { resource } from "@ideative/simplutils/resource";
import { createResourceStore } from "@ideative/simplutils/zustand";

type User = { id: string; name: string };

const usersResource = resource<User, string>("/api/users");
const useUsersStore = createResourceStore(usersResource);
```

### 2) Use async resource actions from the store

```ts
await useUsersStore.getState().getAll();
await useUsersStore.getState().getById("1");
await useUsersStore.getState().create({ id: "3", name: "Carol" });
await useUsersStore.getState().update("3", { name: "Caroline" });
await useUsersStore.getState().delete("3");
```

### 3) Use local/sync actions (`locally*`)

```ts
useUsersStore.getState().locallySetAll([
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
]);

useUsersStore.getState().locallySetOne({ id: "3", name: "Carol" });
useUsersStore.getState().locallyUpsertOne({ id: "2", name: "Bobby" });
useUsersStore.getState().locallyPatchOne("1", { name: "Alicia" });
useUsersStore.getState().locallyRemoveOne("3");

useUsersStore.getState().locallySetLoading(true, "locallySetLoading");
useUsersStore.getState().locallySetError(null, "locallySetError");
useUsersStore.getState().locallyReset();
```

### 4) Extend the generated store

```ts
const useExtendedUsersStore = createResourceStore(
  usersResource,
  undefined,
  ({ get, helpers }) => ({
    allNames: () => get().items.map((u) => u.name),
    findNameById: (id: string) => helpers.findById(id)?.name,
  })
);
```

If your `resource(...)` is itself extended (for example with `search`), those custom methods are automatically forwarded to the zustand store only when they include consolidation metadata.

```ts
const usersResourceWithSearch = resource<
  User,
  string,
  { search: (q: string) => Promise<User[]> }
>("/api/users").extend((r) => ({
  search: withConsolidation(
    (q) => r.getAll({ searchParams: new URLSearchParams({ q }) } as any),
    "reconcile"
  ),
}));

const useUsersStoreWithSearch = createResourceStore(usersResourceWithSearch);
const filtered = await useUsersStoreWithSearch.getState().search("ali");
```

You can control how forwarded custom methods update local store items:

```ts
import { withConsolidation } from "@ideative/simplutils/resource";

const usersResourceWithCustomSync = resource<
  User,
  string,
  { me: () => Promise<User> }
>("/api/users").extend((r) => ({
    me: withConsolidation(() => r.getById("1"), "upsertOne"), // explicit consolidation mode
}));
```

### 5) Typed selectors bound to the resource

```ts
import { createResourceSelectors } from "@ideative/simplutils/zustand";

const usersSelectors = createResourceSelectors(usersResource);

const items = usersSelectors.selectItems(useUsersStore.getState());
const maybeUser = usersSelectors.selectById("1")(useUsersStore.getState());
const status = usersSelectors.selectStatus(useUsersStore.getState());
```

### 6) `createWithEqualityFn` + resource slice (extendable)

```ts
import { createWithEqualityFn } from "zustand/traditional";
import { createResourceSlice } from "@ideative/simplutils/zustand";

const useUsersStore = createWithEqualityFn(
  (set, get, store) => ({
    ...createResourceSlice(usersResource)(set, get, store),
    selectedId: undefined as string | undefined,
    setSelectedId: (id?: string) => set({ selectedId: id }),
    selectedUser: () => {
      const id = get().selectedId;
      return id ? get().selectById(id) : undefined;
    },
  }),
  Object.is
);
```

## Module usage

```ts
import {
  arrayRange,
  partition,
  sum,
  unique,
} from "@ideative/simplutils/arrays";
import {
  applyDiffs,
  computeDiff,
  merge,
  pick,
} from "@ideative/simplutils/objects";
import { FIFOStack, validate, withType } from "@ideative/simplutils/types";
import {
  ObjectKeysEnum,
  isZodObject,
  zodKeys,
} from "@ideative/simplutils/types/zod";
import {
  capitalize,
  idify,
  splitFilenameAndExtension,
} from "@ideative/simplutils/strings";
import { enumKeys, enumObject, enumValues } from "@ideative/simplutils/enums";
import {
  getFlag,
  isCountry,
  translateCountry,
} from "@ideative/simplutils/countries";
import {
  smartThrottle,
  throttle,
  throttled,
} from "@ideative/simplutils/throttle";
import {
  fireAndForget,
  tryOr,
  tryOrNull,
  wrapTry,
} from "@ideative/simplutils/try";
import { createView, mergeViews } from "@ideative/simplutils/views";
```

## Docs

- Build API docs: `pnpm docs:build`
- Watch API docs: `pnpm docs`
- Local output: `packages/docs/site/index.html`
- Run interactive docs website (docs + helper): `pnpm docs:web`
- Build interactive docs website: `pnpm docs:web:build`
- Generate OpenAPI artifacts (zod + resource + store): `pnpm --filter @simplutils/docs openapi:generate -- --input ./openapi/schema.yaml --output ./openapi/generated.ts`
- Generate OpenAPI artifacts (zod + resource + store): `pnpm --filter @simplutils/docs openapi:generate -- --input ./openapi/schema.yaml --output ./openapi/generated.ts`

## License

ISC

# @ideative/simplutils

TypeScript utility library focused on runtime helpers and strong typings.

## Installation

```bash
npm install @ideative/simplutils
# or
pnpm add @ideative/simplutils
# or
yarn add @ideative/simplutils
```

## Peer dependencies

Some modules require peer dependencies:

```bash
pnpm add zod zod-ky
```

## Package exports

The package is split by subpath exports for cleaner imports and tree-shaking.

- `@ideative/simplutils`
- `@ideative/simplutils/arrays`
- `@ideative/simplutils/objects`
- `@ideative/simplutils/types`
- `@ideative/simplutils/types/zod`
- `@ideative/simplutils/strings`
- `@ideative/simplutils/enums`
- `@ideative/simplutils/countries`
- `@ideative/simplutils/resource`
- `@ideative/simplutils/throttle`
- `@ideative/simplutils/try`
- `@ideative/simplutils/views`

## Quick start

```ts
import { batch, deepEqual, interpolate, isDefined } from "@ideative/simplutils";

const chunks = batch([1, 2, 3, 4], 2); // [[1,2],[3,4]]
const same = deepEqual({ a: 1 }, { a: 1 }); // true
const msg = interpolate("Hello {name}", { name: "World" }); // Hello World
const clean = [1, null, 2, undefined].filter(isDefined); // [1,2]
```

## Module usage

### Arrays

```ts
import {
  arrayRange,
  partition,
  sum,
  unique,
} from "@ideative/simplutils/arrays";
```

### Objects

```ts
import {
  applyDiffs,
  computeDiff,
  merge,
  pick,
} from "@ideative/simplutils/objects";
```

### Types

```ts
import { FIFOStack, validate, withType } from "@ideative/simplutils/types";
```

### Zod helpers

```ts
import {
  ObjectKeysEnum,
  isZodObject,
  zodKeys,
} from "@ideative/simplutils/types/zod";
import { z } from "zod";

const schema = z.object({ a: z.string() });
isZodObject(schema); // true
zodKeys({ active: 1, disabled: 0 }); // ["active", "disabled"]
ObjectKeysEnum({ active: 1, disabled: 0 }); // z.enum(["active","disabled"])
```

`zUrl` still exists for compatibility, but native `z.url()` is preferred when custom normalization is not needed.

### Strings

```ts
import {
  capitalize,
  idify,
  splitFilenameAndExtension,
} from "@ideative/simplutils/strings";
```

### Enums

```ts
import { enumKeys, enumObject, enumValues } from "@ideative/simplutils/enums";
```

### Countries

```ts
import {
  getFlag,
  isCountry,
  translateCountry,
} from "@ideative/simplutils/countries";
```

### Resource

```ts
import { resource } from "@ideative/simplutils/resource";
```

### Throttle

```ts
import {
  smartThrottle,
  throttle,
  throttled,
} from "@ideative/simplutils/throttle";
```

### Try helpers

```ts
import {
  fireAndForget,
  tryOr,
  tryOrNull,
  wrapTry,
} from "@ideative/simplutils/try";
```

### Views

```ts
import { createView, mergeViews } from "@ideative/simplutils/views";
```

## Docs

- Build API docs: `pnpm docs:build`
- Watch API docs: `pnpm docs`
- Local output: `packages/docs/site/index.html`

## License

ISC

# @ideative/simplutils

TypeScript utility library focused on runtime helpers and strong typings.

## Installation

```bash
npm install @ideative/simplutils
# or
pnpm add @ideative/simplutils
# or
yarn add @ideative/simplutils
```

## Peer dependencies

Some modules require peer dependencies:

```bash
pnpm add zod zod-ky
```

## Package exports

The package is split by subpath exports for cleaner imports and tree-shaking.

- `@ideative/simplutils`
- `@ideative/simplutils/arrays`
- `@ideative/simplutils/objects`
- `@ideative/simplutils/types`
- `@ideative/simplutils/types/zod`
- `@ideative/simplutils/strings`
- `@ideative/simplutils/enums`
- `@ideative/simplutils/countries`
- `@ideative/simplutils/resource`
- `@ideative/simplutils/throttle`
- `@ideative/simplutils/try`
- `@ideative/simplutils/views`

## Quick start

```ts
import { batch, deepEqual, interpolate, isDefined } from "@ideative/simplutils";

const chunks = batch([1, 2, 3, 4], 2); // [[1,2],[3,4]]
const same = deepEqual({ a: 1 }, { a: 1 }); // true
const msg = interpolate("Hello {name}", { name: "World" }); // Hello World
const clean = [1, null, 2, undefined].filter(isDefined); // [1,2]
```

## Module usage

### Arrays

```ts
import {
  arrayRange,
  partition,
  sum,
  unique,
} from "@ideative/simplutils/arrays";
```

### Objects

```ts
import {
  applyDiffs,
  computeDiff,
  merge,
  pick,
} from "@ideative/simplutils/objects";
```

### Types

```ts
import { FIFOStack, validate, withType } from "@ideative/simplutils/types";
```

### Zod helpers

```ts
import {
  ObjectKeysEnum,
  isZodObject,
  zodKeys,
} from "@ideative/simplutils/types/zod";
import { z } from "zod";

const schema = z.object({ a: z.string() });
isZodObject(schema); // true
zodKeys({ active: 1, disabled: 0 }); // ["active", "disabled"]
ObjectKeysEnum({ active: 1, disabled: 0 }); // z.enum(["active","disabled"])
```

`zUrl` still exists for compatibility, but native `z.url()` is preferred when custom normalization is not needed.

### Strings

```ts
import {
  capitalize,
  idify,
  splitFilenameAndExtension,
} from "@ideative/simplutils/strings";
```

### Enums

```ts
import { enumKeys, enumObject, enumValues } from "@ideative/simplutils/enums";
```

### Countries

```ts
import {
  getFlag,
  isCountry,
  translateCountry,
} from "@ideative/simplutils/countries";
```

### Resource

```ts
import { resource } from "@ideative/simplutils/resource";
```

### Throttle

```ts
import {
  smartThrottle,
  throttle,
  throttled,
} from "@ideative/simplutils/throttle";
```

### Try helpers

```ts
import {
  fireAndForget,
  tryOr,
  tryOrNull,
  wrapTry,
} from "@ideative/simplutils/try";
```

### Views

```ts
import { createView, mergeViews } from "@ideative/simplutils/views";
```

## Docs

- Build API docs: `pnpm docs:build`
- Watch API docs: `pnpm docs`
- Local output: `packages/docs/site/index.html`

## License

ISC

# @ideative/simplutils

TypeScript utility library focused on runtime helpers and strong typings.

## Installation

```bash
npm install @ideative/simplutils
# or
pnpm add @ideative/simplutils
# or
yarn add @ideative/simplutils
```

## Peer dependencies

Some modules require peers:

```bash
pnpm add zod zod-ky
```

## Package exports

The package is split by subpath exports for cleaner imports and better tree-shaking.

- `@ideative/simplutils`
- `@ideative/simplutils/arrays`
- `@ideative/simplutils/objects`
- `@ideative/simplutils/types`
- `@ideative/simplutils/types/zod`
- `@ideative/simplutils/strings`
- `@ideative/simplutils/enums`
- `@ideative/simplutils/countries`
- `@ideative/simplutils/resource`
- `@ideative/simplutils/throttle`
- `@ideative/simplutils/try`
- `@ideative/simplutils/views`

## Quick start

```ts
import { batch, deepEqual, interpolate, isDefined } from "@ideative/simplutils";

const chunks = batch([1, 2, 3, 4], 2); // [[1,2],[3,4]]
const same = deepEqual({ a: 1 }, { a: 1 }); // true
const msg = interpolate("Hello {name}", { name: "World" }); // Hello World
const clean = [1, null, 2, undefined].filter(isDefined); // [1,2]
```

## Module usage

### Arrays

```ts
import {
  arrayRange,
  partition,
  sum,
  unique,
} from "@ideative/simplutils/arrays";
```

### Objects

```ts
import {
  applyDiffs,
  computeDiff,
  merge,
  pick,
} from "@ideative/simplutils/objects";
```

### Types

```ts
import { FIFOStack, validate, withType } from "@ideative/simplutils/types";
```

### Zod helpers

```ts
import {
  ObjectKeysEnum,
  isZodObject,
  zodKeys,
} from "@ideative/simplutils/types/zod";
import { z } from "zod";

const schema = z.object({ a: z.string() });
isZodObject(schema); // true
zodKeys({ active: 1, disabled: 0 }); // ["active", "disabled"]
ObjectKeysEnum({ active: 1, disabled: 0 }); // z.enum(["active","disabled"])
```

`zUrl` still exists for compatibility, but native `z.url()` is preferred when you do not need custom normalization behavior.

### Strings

```ts
import {
  capitalize,
  idify,
  splitFilenameAndExtension,
} from "@ideative/simplutils/strings";
```

### Enums

```ts
import { enumKeys, enumObject, enumValues } from "@ideative/simplutils/enums";
```

### Countries

```ts
import {
  getFlag,
  isCountry,
  translateCountry,
} from "@ideative/simplutils/countries";
```

### Resource (typed REST client)

```ts
import { resource } from "@ideative/simplutils/resource";
```

### Throttle

```ts
import {
  smartThrottle,
  throttle,
  throttled,
} from "@ideative/simplutils/throttle";
```

### Try helpers

```ts
import {
  fireAndForget,
  tryOr,
  tryOrNull,
  wrapTry,
} from "@ideative/simplutils/try";
```

### Views (computed non-enumerable properties)

```ts
import { createView, mergeViews } from "@ideative/simplutils/views";
```

## Docs

- Build API docs: `pnpm docs:build`
- Watch API docs: `pnpm docs`
- Local output: `packages/docs/site/index.html`

## License

ISC
