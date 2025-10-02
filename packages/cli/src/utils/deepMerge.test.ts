/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { deepMerge } from './deepMerge.js';

describe('deepMerge', () => {
  it('should merge simple objects', () => {
    const target = { a: 1, b: 2 };
    const source = { b: 3, c: 4 };
    const result = deepMerge(target, source);

    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });

  it('should not mutate the target object', () => {
    const target = { a: 1, b: 2 };
    const source = { b: 3, c: 4 };
    const result = deepMerge(target, source);

    expect(target).toEqual({ a: 1, b: 2 });
    expect(result).not.toBe(target);
  });

  it('should recursively merge nested objects', () => {
    const target = {
      a: 1,
      nested: {
        x: 10,
        y: 20,
      },
    };
    const source = {
      nested: {
        y: 30,
        z: 40,
      },
      b: 2,
    };
    const result = deepMerge(target, source);

    expect(result).toEqual({
      a: 1,
      b: 2,
      nested: {
        x: 10,
        y: 30,
        z: 40,
      },
    });
  });

  it('should preserve Date objects without merging', () => {
    const date1 = new Date('2023-01-01');
    const date2 = new Date('2024-01-01');
    const target = { date: date1 };
    const source = { date: date2 };
    const result = deepMerge(target, source);

    expect(result.date).toBe(date2);
    expect(result.date).toBeInstanceOf(Date);
  });

  it('should replace arrays instead of merging them', () => {
    const target = { arr: [1, 2, 3] };
    const source = { arr: [4, 5] };
    const result = deepMerge(target, source);

    expect(result.arr).toEqual([4, 5]);
    expect(result.arr).not.toBe(target.arr);
  });

  it('should handle null and undefined values', () => {
    const target = { a: 1, b: null, c: undefined };
    const source = { b: 2, c: 3, d: null };
    const result = deepMerge(target, source);

    expect(result).toEqual({ a: 1, b: 2, c: 3, d: null });
  });

  it('should replace primitive values with objects', () => {
    const target = { value: 'string' };
    const source = { value: { nested: 'object' } };
    const result = deepMerge(target, source);

    expect(result.value).toEqual({ nested: 'object' });
  });

  it('should replace objects with primitive values', () => {
    const target = { value: { nested: 'object' } };
    const source = { value: 'string' };
    const result = deepMerge(target, source);

    expect(result.value).toBe('string');
  });

  it('should handle deeply nested structures', () => {
    const target = {
      level1: {
        level2: {
          level3: {
            value: 1,
          },
        },
      },
    };
    const source = {
      level1: {
        level2: {
          level3: {
            value: 2,
            newValue: 3,
          },
        },
      },
    };
    const result = deepMerge(target, source);

    expect(result).toEqual({
      level1: {
        level2: {
          level3: {
            value: 2,
            newValue: 3,
          },
        },
      },
    });
  });

  it('should preserve functions', () => {
    const fn1 = () => 'target';
    const fn2 = () => 'source';
    const target = { fn: fn1 };
    const source = { fn: fn2 };
    const result = deepMerge(target, source);

    expect(result.fn).toBe(fn2);
    expect(result.fn()).toBe('source');
  });

  it('should handle empty source object', () => {
    const target = { a: 1, b: 2 };
    const source = {};
    const result = deepMerge(target, source);

    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('should handle empty target object', () => {
    const target = {};
    const source = { a: 1, b: 2 };
    const result = deepMerge(target, source);

    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('should handle mixed nested objects and primitives', () => {
    const target = {
      config: {
        name: 'app',
        settings: {
          enabled: true,
        },
      },
      count: 5,
    };
    const source = {
      config: {
        version: '1.0',
        settings: {
          timeout: 30,
        },
      },
      count: 10,
    };
    const result = deepMerge(target, source);

    expect(result).toEqual({
      config: {
        name: 'app',
        version: '1.0',
        settings: {
          enabled: true,
          timeout: 30,
        },
      },
      count: 10,
    });
  });
});
