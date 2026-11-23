export const log = {
  info: (...args: unknown[]) => console.info("[app]", ...args),
  error: (...args: unknown[]) => console.error("[app]", ...args),
};
