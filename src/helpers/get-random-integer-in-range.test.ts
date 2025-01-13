import { getRandomIntegerInRange } from './get-random-integer-in-range';

describe('getRandomIntegerInRange', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('должен возвращать min, если Math.random возвращает 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(getRandomIntegerInRange(5, 10)).toBe(5);
  });

  it('должен возвращать max, если Math.random возвращает значение, близкое к 1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9999999999);
    expect(getRandomIntegerInRange(5, 10)).toBe(10);
  });

  it('должен возвращать среднее значение при Math.random возвращает 0.5', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(getRandomIntegerInRange(5, 10)).toBe(8);
  });

  it('должен корректно обрабатывать min равный max', () => {
    expect(getRandomIntegerInRange(7, 7)).toBe(7);
  });
});
