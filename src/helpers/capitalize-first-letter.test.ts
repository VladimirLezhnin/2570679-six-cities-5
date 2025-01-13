import { capitalizeFirstLetter } from "./capitalize-first-letter";

describe('capitalizeFirstLetter', () => {
    it('должен капитализировать первую букву строки', () => {
      expect(capitalizeFirstLetter('hello')).toBe('Hello');
      expect(capitalizeFirstLetter('world')).toBe('World');
      expect(capitalizeFirstLetter('h')).toBe('H');
    });
  
    it('должен возвращать строку без изменений, если первая буква уже заглавная', () => {
      expect(capitalizeFirstLetter('Hello')).toBe('Hello');
      expect(capitalizeFirstLetter('World')).toBe('World');
    });
  
    it('должен возвращать пустую строку, если входная строка пуста', () => {
      expect(capitalizeFirstLetter('')).toBe('');
    });
  
    it('должен корректно обрабатывать строки, начинающиеся с не буквенных символов', () => {
      expect(capitalizeFirstLetter('1hello')).toBe('1hello');
      expect(capitalizeFirstLetter('!world')).toBe('!world');
    });
});