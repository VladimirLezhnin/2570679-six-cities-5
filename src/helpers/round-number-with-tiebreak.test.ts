import { describe, it, expect } from 'vitest';
import { roundNumberWithTieBreak } from './round-number-with-tiebreak';

describe('roundNumberWithTieBreak', () => {
  it('should correctly round numbers without .5', () => {
    expect(roundNumberWithTieBreak(1.2)).toBe(1);
    expect(roundNumberWithTieBreak(1.6)).toBe(2);
    expect(roundNumberWithTieBreak(-1.2)).toBe(-1);
    expect(roundNumberWithTieBreak(-1.6)).toBe(-2);
  });

  it('should round numbers up from .5', () => {
    expect(roundNumberWithTieBreak(1.5)).toBe(2);
    expect(roundNumberWithTieBreak(-1.5)).toBe(-1);
  });

  it('should return an integer unchanged', () => {
    expect(roundNumberWithTieBreak(2)).toBe(2);
    expect(roundNumberWithTieBreak(-3)).toBe(-3);
  });
});
