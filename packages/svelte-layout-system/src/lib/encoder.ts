export function encodeProps(data: any): string {
  return btoa(JSON.stringify(data));
}

export function decodeProps<T = any>(str: string): T {
  return JSON.parse(atob(str));
}
