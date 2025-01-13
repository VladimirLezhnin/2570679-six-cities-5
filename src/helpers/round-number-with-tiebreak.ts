export function roundNumberWithTieBreak(number: number): number {
  const rounded = Math.round(number);
  if (number % 1 === 0.5) {
    return Math.ceil(number);
  }
  return rounded;
}
