export function pluralizeWord(word: string, count: number, pluralForm?: string): string {
  if (count === 1) {
    return word;
  }
  return pluralForm ? pluralForm : `${word}s`;
}
