import { capitalizeFirstLetter } from './capitalize-first-letter';

describe('capitalizeFirstLetter', () => {
  it('should capitalize the first letter of the string', () => {
    expect(capitalizeFirstLetter('hello')).toBe('Hello');
    expect(capitalizeFirstLetter('world')).toBe('World');
    expect(capitalizeFirstLetter('h')).toBe('H');
  });

  it('should return the string unchanged if the first letter is already capitalized', () => {
    expect(capitalizeFirstLetter('Hello')).toBe('Hello');
    expect(capitalizeFirstLetter('World')).toBe('World');
  });

  it('should return an empty string if the input string is empty', () => {
    expect(capitalizeFirstLetter('')).toBe('');
  });

  it('should correctly handle strings starting with non-alphabetic characters', () => {
    expect(capitalizeFirstLetter('1hello')).toBe('1hello');
    expect(capitalizeFirstLetter('!world')).toBe('!world');
  });
});
