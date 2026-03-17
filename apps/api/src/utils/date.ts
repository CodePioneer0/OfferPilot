export function toIsoString(value: string): string {
  return new Date(value).toISOString();
}
