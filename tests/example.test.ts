import { add } from '@/src/index.js';
import { expect, describe, it } from 'vitest';

describe('add', () => {
  it('should add numbers', () => {
    expect(add(5, 5)).toBe(10);
  });
});
