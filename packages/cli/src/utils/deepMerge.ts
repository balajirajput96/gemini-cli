/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Deep merges two objects. For plain objects, properties are recursively merged.
 * For all other types (arrays, dates, functions, etc.), the source value replaces
 * the target value.
 *
 * @param target - The target object to merge into
 * @param source - The source object to merge from
 * @returns A new object with merged properties
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deepMerge<T>(target: T, source: any): T {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const output = { ...target } as any;

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = output[key];

      if (
        // We only want to recursively merge plain objects
        Object.prototype.toString.call(sourceValue) === '[object Object]' &&
        Object.prototype.toString.call(targetValue) === '[object Object]'
      ) {
        output[key] = deepMerge(targetValue, sourceValue);
      } else {
        // If not, we do a direct assignment. This preserves Date objects and others.
        output[key] = sourceValue;
      }
    }
  }
  return output;
}
