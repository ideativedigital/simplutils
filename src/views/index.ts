import { AnyObject } from '../objects'

/**
 * Represents a view's computed properties as readonly.
 * @template U - The object containing computed property definitions
 */
export type View<U extends AnyObject> = {
  readonly [K in keyof U]: U[K]
}

/**
 * A function that takes an object of type T and returns it enhanced with view properties U.
 * @template T - The input object type
 * @template U - The view properties to add
 */
export type ObjectView<T extends AnyObject, U extends AnyObject> = (t: T) => T & View<U>

/**
 * Creates a reusable view function that adds computed properties to an object as non-enumerable getters.
 * These properties are accessible but won't appear when serializing (e.g., JSON.stringify).
 *
 * Views are useful for:
 * - Adding derived/computed properties without polluting serialization
 * - Creating reusable property enhancers that can be composed
 * - Use with Zod's `.transform()` to add computed fields to parsed objects
 *
 * @param fn - A function that receives the object and returns an object with getter definitions
 * @returns An {@link ObjectView} function that enhances objects with the computed properties
 *
 * @example Basic usage with getters
 * ```ts
 * type User = { firstName: string; lastName: string }
 *
 * const fullNameView = createView((u: User) => ({
 *   get fullName() { return `${u.firstName} ${u.lastName}` }
 * }))
 *
 * const user = fullNameView({ firstName: 'John', lastName: 'Doe' })
 * user.fullName           // => 'John Doe'
 * JSON.stringify(user)    // => '{"firstName":"John","lastName":"Doe"}'
 * ```
 *
 * @example With Zod schema
 * ```ts
 * const userSchema = z.object({
 *   firstName: z.string(),
 *   lastName: z.string()
 * }).transform(createView(u => ({
 *   get fullName() { return `${u.firstName} ${u.lastName}` }
 * })))
 *
 * const user = userSchema.parse({ firstName: 'John', lastName: 'Doe' })
 * user.fullName // => 'John Doe'
 * ```
 *
 * @example With regular values (converted to getters)
 * ```ts
 * const statsView = createView((obj: { a: number; b: number }) => ({
 *   sum: obj.a + obj.b,  // Computed once when view is applied
 *   product: obj.a * obj.b
 * }))
 * ```
 */
export const createView = <T extends AnyObject, U extends AnyObject>(
  fn: (t: T) => U
): ObjectView<T, U> => {
  return t => {
    const view = fn(t)
    for (const key of Object.keys(view)) {
      const descriptor = Object.getOwnPropertyDescriptor(view, key)
      if (descriptor?.get) {
        // It's a getter, define it as non-enumerable
        Object.defineProperty(t, key, {
          get: descriptor.get,
          enumerable: false,
          configurable: true
        })
      } else {
        // It's a regular value, define it as a non-enumerable getter
        Object.defineProperty(t, key, {
          get: () => (view as AnyObject)[key],
          enumerable: false,
          configurable: true
        })
      }
    }
    return t as T & U
  }
}

/**
 * Alias for {@link createView}.
 * @deprecated Use {@link createView} instead for clearer naming.
 */
export const addView = createView

// Internal helper type for combining object types
type UnionTypes<T1 extends AnyObject, T2 extends AnyObject> =
  {} extends T1 ? T2 : {} extends T2 ? T1 : T1 & T2

// Internal type for computing the final combined view type from an array of views
export type CombinedViewType<
  Arr extends Array<ObjectView<any, any>>,
  CurType extends AnyObject = {},
  CurView extends View<any> = {}
> = Arr extends [infer First, ...infer Rest]
  ? First extends ObjectView<infer T, infer U>
  ? Rest extends Array<ObjectView<any, any>>
  ? CombinedViewType<Rest, UnionTypes<CurType, T>, UnionTypes<CurView, U>> extends ObjectView<infer T2, infer U2>
  ? ObjectView<UnionTypes<UnionTypes<CurType, T>, T2>, UnionTypes<UnionTypes<CurView, U>, U2>>
  : ObjectView<UnionTypes<CurType, T>, UnionTypes<CurView, U>>
  : ObjectView<UnionTypes<CurType, T>, UnionTypes<CurView, U>>
  : never
  : ObjectView<CurType, CurView>

/**
 * Combines multiple view functions into a single view function.
 * Each view is applied in order, and all computed properties are merged onto the object.
 *
 * This is useful for:
 * - Composing reusable view "mixins"
 * - Separating concerns into focused view definitions
 * - Building up complex computed property sets incrementally
 *
 * @param views - View functions to combine (applied left to right)
 * @returns A single {@link ObjectView} function that applies all views
 *
 * @example Composing multiple views
 * ```ts
 * type User = { firstName: string; lastName: string; birthday: Date }
 *
 * const fullNameView = createView((u: User) => ({
 *   get fullName() { return `${u.firstName} ${u.lastName}` }
 * }))
 *
 * const ageView = createView((u: User) => ({
 *   get age() { return new Date().getFullYear() - u.birthday.getFullYear() }
 * }))
 *
 * const userView = mergeViews(fullNameView, ageView)
 *
 * const user = userView({
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   birthday: new Date('1990-01-01')
 * })
 *
 * user.fullName  // => 'John Doe'
 * user.age       // => 35 (or current year - 1990)
 * JSON.stringify(user) // => '{"firstName":"John","lastName":"Doe","birthday":"1990-01-01T00:00:00.000Z"}'
 * ```
 *
 * @example With Zod schema
 * ```ts
 * const userSchema = z.object({
 *   firstName: z.string(),
 *   lastName: z.string(),
 *   birthday: z.coerce.date()
 * }).transform(mergeViews(fullNameView, ageView))
 * ```
 */
export const mergeViews = <Arr extends Array<ObjectView<any, any>>>(
  ...views: Arr
): CombinedViewType<Arr> => {
  return ((t: AnyObject) => views.reduce((acc, view) => view(acc), t)) as CombinedViewType<Arr>
}
