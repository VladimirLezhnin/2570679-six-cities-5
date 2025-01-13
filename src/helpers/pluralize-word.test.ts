import { pluralizeWord } from './pluralize-word';

describe('pluralizeWord', () => {
  it('должен возвращать слово в единственном числе, когда count равен 1', () => {
    expect(pluralizeWord('apple', 1)).toBe('apple');
    expect(pluralizeWord('child', 1)).toBe('child');
  });

  it('должен возвращать слово во множественном числе, когда count не равен 1', () => {
    expect(pluralizeWord('apple', 0)).toBe('apples');
    expect(pluralizeWord('apple', 2)).toBe('apples');
    expect(pluralizeWord('child', 2)).toBe('childs');
  });

  it('должен использовать предоставленную форму множественного числа, если она указана', () => {
    expect(pluralizeWord('child', 2, 'children')).toBe('children');
    expect(pluralizeWord('person', 3, 'people')).toBe('people');
  });
});
