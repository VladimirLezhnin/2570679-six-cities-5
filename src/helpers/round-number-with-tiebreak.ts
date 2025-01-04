export function roundNumberWithTieBreak(num: number): number {
  const rounded = Math.round(num);
  if (num % 1 === 0.5) {
    return Math.ceil(num);
  }
  return rounded;
}
