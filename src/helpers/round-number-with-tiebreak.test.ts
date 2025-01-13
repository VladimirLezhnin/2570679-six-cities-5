import { describe, it, expect } from 'vitest';
import { roundNumberWithTieBreak } from './round-number-with-tiebreak';

describe('roundNumberWithTieBreak', () => {
  it('должен корректно округлять числа без .5', () => {
    expect(roundNumberWithTieBreak(1.2)).toBe(1);
    expect(roundNumberWithTieBreak(1.6)).toBe(2);
    expect(roundNumberWithTieBreak(-1.2)).toBe(-1);
    expect(roundNumberWithTieBreak(-1.6)).toBe(-2);
  });

  it('должен округлять числа с .5 вверх', () => {
    expect(roundNumberWithTieBreak(1.5)).toBe(2);
    expect(roundNumberWithTieBreak(-1.5)).toBe(-1);
  });

  it('должен возвращать целое число без изменений', () => {
    expect(roundNumberWithTieBreak(2)).toBe(2);
    expect(roundNumberWithTieBreak(-3)).toBe(-3);
  });
});
