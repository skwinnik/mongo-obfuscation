export function waitForDelay(delay: number) {
  return new Promise<void>((resolve) => setTimeout(() => resolve(), delay));
}
