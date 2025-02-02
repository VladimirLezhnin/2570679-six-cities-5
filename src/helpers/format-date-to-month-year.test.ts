import { formatDateToMonthYear } from './format-date-to-month-year';

describe('formatDateToMonthYear', () => {
  it('should format the date in "Month Year" format', () => {
    const date = new Date('2023-10-13');
    expect(formatDateToMonthYear(date)).toBe('October 2023');

    const date2 = new Date('1999-01-01');
    expect(formatDateToMonthYear(date2)).toBe('January 1999');
  });

  it('should handle different dates correctly', () => {
    const date = new Date('2020-02-29');
    expect(formatDateToMonthYear(date)).toBe('February 2020');

    const date2 = new Date('2021-12-31');
    expect(formatDateToMonthYear(date2)).toBe('December 2021');
  });
});
