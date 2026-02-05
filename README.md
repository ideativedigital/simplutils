# simplutils

A modern TypeScript utility library for arrays, objects, strings, async operations, and more. Fully typed with comprehensive JSDoc documentation.

## Installation

```bash
npm install simplutils
# or
pnpm add simplutils
# or
yarn add simplutils
```

### Peer Dependencies

Some modules require peer dependencies:

```bash
# For dayjs utilities
pnpm add dayjs

# For Zod utilities
pnpm add zod

# For resource module (REST client)
pnpm add zod-ky
```

## Quick Start

```typescript
import {
  batch,
  unique,
  sum, // Arrays
  delay,
  Mutex, // Async
  pick,
  omit,
  deepEqual, // Objects
  capitalize,
  interpolate, // Strings
  isDefined,
  validate, // Types
  enumKeys,
  enumValues, // Enums
} from "simplutils";
```

## Modules

### Arrays

Utilities for working with arrays.

```typescript
import {
  batch,
  unique,
  sum,
  max,
  min,
  take,
  partition,
  takeWhile,
  arrayRange,
  zipWithIndex,
  createSorter,
  createFilter,
  findById,
  upsertWithId,
} from "simplutils";

// Batch an array into chunks
batch([1, 2, 3, 4, 5], 2);
// => [[1, 2], [3, 4], [5]]

// Remove duplicates
unique([1, 2, 2, 3, 3, 3]);
// => [1, 2, 3]

// With custom key
unique([{ id: 1 }, { id: 1 }, { id: 2 }], "id");
// => [{ id: 1 }, { id: 2 }]

// Aggregations
sum([1, 2, 3, 4, 5]); // => 15
max([1, 2, 3, 4, 5]); // => 5

// With transform for objects
sum([{ v: 10 }, { v: 20 }])((item) => item.v); // => 30

// Generate ranges
arrayRange(5); // => [0, 1, 2, 3, 4]
arrayRange(2, 6); // => [2, 3, 4, 5]
arrayRange(0, 10, 2); // => [0, 2, 4, 6, 8]

// Partition array by predicate
partition([1, 2, 3, 4, 5], (n) => n % 2 === 0);
// => [[2, 4], [1, 3, 5]]

// Chainable sorter
const users = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 },
];
users.sort(
  createSorter<(typeof users)[0]>().key("name", "asc").key("age", "desc")
);

// Chainable filter
const isAdult = createFilter<{ age: number }>((u) => u.age >= 18);
users.filter(isAdult.and((u) => u.name.startsWith("A")));

// ID-based operations
const items = [
  { id: 1, name: "A" },
  { id: 2, name: "B" },
];
findById(items, 1); // => { id: 1, name: 'A' }
upsertWithId(items, { id: 2, name: "Updated" });
```

### Async

Utilities for async operations.

```typescript
import {
  delay,
  Mutex,
  preventConcurrentCalls,
  mapPromises,
  SyncPromise,
} from "simplutils";

// Delay execution
await delay(1000); // Wait 1 second

// Mutex for critical sections
const mutex = new Mutex();
await mutex.lock();
try {
  // Critical section - only one caller at a time
} finally {
  mutex.unlock();
}

// Prevent duplicate concurrent calls
const fetchUser = preventConcurrentCalls(async (id: number) => {
  return await api.getUser(id);
});
// Multiple calls with same args share one request
const [user1, user2] = await Promise.all([fetchUser(1), fetchUser(1)]);

// Map with sequential/parallel control
await mapPromises(ids, (id) => fetchUser(id), { isSequential: true });

// Externally resolvable promise
const [promise, controller] = SyncPromise.create<string>();
setTimeout(() => controller.resolve("done"), 1000);
await promise; // => 'done'
```

### Objects

Utilities for object manipulation.

```typescript
import {
  pick,
  omit,
  deepEqual,
  mapKeys,
  mapValues,
  groupBy,
  merge,
  pickAtPaths,
  computeDiff,
  applyDiffs,
} from "simplutils";

// Pick/omit properties
const user = { name: "Alice", age: 30, email: "alice@example.com" };
pick(user, "name", "age"); // => { name: 'Alice', age: 30 }
omit(user, "email"); // => { name: 'Alice', age: 30 }

// Deep equality
deepEqual({ a: { b: 1 } }, { a: { b: 1 } }); // => true

// Transform keys/values
mapKeys({ a: 1, b: 2 }, (k) => k.toUpperCase()); // => { A: 1, B: 2 }
mapValues({ a: 1, b: 2 }, (v) => v * 2); // => { a: 2, b: 4 }

// Group by
const items = [
  { type: "a", v: 1 },
  { type: "a", v: 2 },
  { type: "b", v: 3 },
];
groupBy(items, (item) => item.type);
// => { a: [{ type: 'a', v: 1 }, { type: 'a', v: 2 }], b: [{ type: 'b', v: 3 }] }

// Merge at nested path
const obj = { user: { name: "Alice", settings: { theme: "dark" } } };
merge(obj, "user.settings.theme", "light");
// => { user: { name: 'Alice', settings: { theme: 'light' } } }

// Compute differences between objects
const old = { name: "Alice", age: 30 };
const new_ = { name: "Alice", age: 31 };
computeDiff(old, new_);
// => [{ field: 'age', oldValue: 30, newValue: 31 }]
```

### Strings

String manipulation utilities.

```typescript
import {
  capitalize,
  capitalizeFirstname,
  interpolate,
  replaceInOrder,
  idify,
  shorten,
  randomCode,
  splitFilenameAndExtension,
} from "simplutils";

// Capitalize
capitalize("hello"); // => 'Hello'
capitalizeFirstname("jean-luc"); // => 'Jean-Luc'

// String interpolation
interpolate("Hello {name}!", { name: "Alice" });
// => 'Hello Alice!'

interpolate("City: {address.city}", { address: { city: "NYC" } });
// => 'City: NYC'

// Convert to ID format (lowercase, no accents, underscores)
idify("Café Résumé"); // => 'cafe_resume'

// Shorten with ellipsis
shorten("Hello World!", 9); // => 'He...ld!'

// Random alphanumeric code
randomCode(6); // => 'A3B7K9' (random)

// File utilities
splitFilenameAndExtension("document.pdf"); // => ['document', 'pdf']
```

### Types

Type utilities and guards.

```typescript
import {
  validate,
  isDefined,
  isEmpty,
  isString,
  isNumber,
  withType,
  TypeHolder,
  FIFOStack,
  LIFOStack,
  fswitch,
} from "simplutils";

// Create type guards
const isPositive = validate<number>((n) => typeof n === "number" && n > 0);
if (isPositive(value)) {
  // value is typed as number
}

// Filter defined values
const items = [1, null, 2, undefined, 3];
items.filter(isDefined); // => [1, 2, 3]

// Type holders for generic functions
const userType = withType<{ name: string; age: number }>();

// Stacks with max size
const fifo = new FIFOStack<number>(3);
fifo.push(1);
fifo.push(2);
fifo.push(3);
fifo.push(4);
// Stack: [2, 3, 4] - oldest item (1) dropped

// Functional switch/case
class Dog {
  bark() {
    return "woof";
  }
}
class Cat {
  meow() {
    return "meow";
  }
}

const sound = fswitch(animal)
  .case(Dog, (dog) => dog.bark())
  .case(Cat, (cat) => cat.meow())
  .default(() => "unknown")
  .execute();
```

### Enums

Utilities for working with TypeScript enums.

```typescript
import { enumKeys, enumValues, enumObject } from "simplutils";

enum Status {
  Active = 0,
  Inactive = 1,
}

enumKeys(Status); // => ['Active', 'Inactive']
enumValues(Status); // => [0, 1]
enumObject(Status); // => { Active: 0, Inactive: 1 } (no reverse mappings)
```

### Throttle

Function throttling with smart deduplication.

```typescript
import { throttle, smartThrottle, throttled } from "simplutils";

// Basic throttle - max once per 500ms
const throttledFn = throttle(() => console.log("called"), 500);

// Smart throttle for async - deduplicates concurrent calls with same args
const fetchUser = smartThrottle(async (id: number) => api.getUser(id));
// Concurrent calls with same args share one request:
await Promise.all([fetchUser(1), fetchUser(1)]); // Only 1 API call

// Decorator for class methods
class UserService {
  @throttled({ delay: 1000 })
  async fetchUser(id: number) {
    return api.getUser(id);
  }
}
```

### Countries

Country data with translations and flags.

```typescript
import {
  getFlag,
  translateCountry,
  isCountry,
  CountryCodes,
  zCountry,
} from "simplutils/countries";

getFlag("us"); // => '🇺🇸'
getFlag("fr"); // => '🇫🇷'

translateCountry("de", "fr"); // => 'Allemagne'
translateCountry("de", "en", { includeFlag: true }); // => '🇩🇪 Germany'

isCountry("us"); // => true
isCountry("xx"); // => false

// Zod schema for validation
zCountry.parse("us"); // => 'us'
```

### Try

Error handling utilities.

```typescript
import { tryOr, tryOrNull, fireAndForget, wrapTry } from "simplutils";

// Return default value on error
const data = tryOr(() => JSON.parse(input), {});

// Return null on error
const data = tryOrNull(() => JSON.parse(input));
if (data) {
  /* ... */
}

// Fire and forget - ignore errors
fireAndForget(() => analytics.track("event"));

// Structured try/catch result
const result = wrapTry(() => riskyOperation());
if (result.isSuccess) {
  console.log(result.value);
} else {
  console.error(result.error);
}
```

### Provider (Dependency Injection)

A provider pattern for dependency injection with caching.

```typescript
import { createProvider, Provider } from "simplutils";

const dbProvider = createProvider(async () => ({
  db: await connectToDatabase(),
}));

const userServiceProvider = dbProvider.and(async ({ db }) => ({
  userService: new UserService(db),
}));

const { db, userService } = await userServiceProvider.provide();
```

### Resource (REST Client)

A typed REST client with smart throttling.

```typescript
import { resource } from "simplutils";

interface User {
  id: string;
  name: string;
  email: string;
}

const users = resource<User>("/api/users");

// CRUD operations
const allUsers = await users.getAll({});
const user = await users.getById("123");
const created = await users.create(
  { id: "456", name: "Alice", email: "a@b.com" },
  {}
);
const updated = await users.update("456", { name: "Alicia" }, {});
await users.delete("456", {});
```

### Zod Utilities

Utilities for working with Zod schemas.

```typescript
import {
  isZodString,
  isZodObject,
  zUrl,
  addView,
  ObjectKeysEnum,
} from "simplutils";

// Type guards for Zod types
if (isZodString(schema)) {
  /* ... */
}

// URL validator with auto-fix
const urlSchema = zUrl();
urlSchema.parse("example.com"); // => 'https://example.com/'

// Add computed properties
const userSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
  })
  .transform(
    addView((u) => ({
      fullName: `${u.firstName} ${u.lastName}`,
    }))
  );

// Create enum from object keys
const Status = { active: 1, inactive: 0 };
const StatusEnum = ObjectKeysEnum(Status); // z.enum(['active', 'inactive'])
```

### Dayjs Utilities

Zod codec for Dayjs.

```typescript
import { zDayjs } from "simplutils";
import dayjs from "dayjs";

const schema = z.object({
  createdAt: zDayjs,
});

const result = schema.parse({ createdAt: new Date() });
// result.createdAt is a Dayjs instance
```

## API Reference

See the source code with JSDoc comments for detailed API documentation. All functions include:

- Type signatures
- Parameter descriptions
- Return value descriptions
- Usage examples

## License

ISC

## Author

Adrien Cominotto - [GitHub](https://github.com/acominotto)
