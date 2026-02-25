const PREFIX = "[mcp-icon]";

let IS_STDIO = true;

function setIsStdio(isStdio: boolean): void {
  IS_STDIO = isStdio;
}

function getTimestamp(): string {
  return new Date().toISOString();
}

function info(message: string, ...args: unknown[]): void {
  const fn = IS_STDIO ? console.error : console.log;
  fn(`${PREFIX} ${getTimestamp()} ℹ️  ${message}`, ...args);
}

function warn(message: string, ...args: unknown[]): void {
  const fn = IS_STDIO ? console.warn : console.log;
  fn(`${PREFIX} ${getTimestamp()} ⚠️  ${message}`, ...args);
}

function error(message: string, err?: unknown): void {
  console.error(`${PREFIX} ${getTimestamp()} ❌ ${message}`, err ?? "");
}

function success(message: string, ...args: unknown[]): void {
  const fn = IS_STDIO ? console.error : console.log;
  fn(`${PREFIX} ${getTimestamp()} ✅ ${message}`, ...args);
}

export const logger = { info, warn, error, success, setIsStdio };
