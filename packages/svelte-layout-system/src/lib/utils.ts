export function minmax(min: number, value: number, max: number = Infinity) {
  return Math.max(Math.min(value, max), min);
}
