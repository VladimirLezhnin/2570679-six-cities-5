import { pluralizeWord } from './pluralize-word';

describe('pluralizeWord', () => {
  it('should return singular word when count is 1', () => {
    expect(pluralizeWord('apple', 1)).toBe('apple');
    expect(pluralizeWord('child', 1)).toBe('child');
  });

  it('should return plural word when count is not 1', () => {
    expect(pluralizeWord('apple', 0)).toBe('apples');
    expect(pluralizeWord('apple', 2)).toBe('apples');
    expect(pluralizeWord('child', 2)).toBe('childs');
  });

  it('should use the provided plural form if specified', () => {
    expect(pluralizeWord('child', 2, 'children')).toBe('children');
    expect(pluralizeWord('person', 3, 'people')).toBe('people');
  });
});
