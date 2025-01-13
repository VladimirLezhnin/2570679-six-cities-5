import { getRandomIntegerInRange } from './get-random-integer-in-range';

describe('getRandomIntegerInRange', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return min if Math.random returns 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(getRandomIntegerInRange(5, 10)).toBe(5);
  });

  it('should return max if Math.random returns a value close to 1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9999999999);
    expect(getRandomIntegerInRange(5, 10)).toBe(10);
  });

  it('should return the average when Math.random returns 0.5', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(getRandomIntegerInRange(5, 10)).toBe(8);
  });

  it('should correctly handle min equal to max', () => {
    expect(getRandomIntegerInRange(7, 7)).toBe(7);
  });
});
