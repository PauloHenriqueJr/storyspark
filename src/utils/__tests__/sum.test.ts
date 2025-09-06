import { describe, it, expect } from 'vitest';

const sum = (a: number, b: number) => a + b;

describe('sum', () => {
  it('adds two numbers', () => {
    expect(sum(1, 2)).toBe(3);
  });
});

