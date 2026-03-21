/**
 * 🧐 Brand symbol is a "artificial" (it doesn't exist in runtime, on purpose) property
 * that makes the "brand property" totally inaccessible to anyone,
 * and yet, it allows structural typing of TS to treat types as different.
 */
declare const BrandSymbol: unique symbol;

/**
 * 🧐 Branded type to prevent type errors when mixing incompatible types.
 */
export type Brand<TStruct, TBrand> = TStruct & { readonly [BrandSymbol]: TBrand };
