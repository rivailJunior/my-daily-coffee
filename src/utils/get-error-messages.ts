export function getErrorMessage(
  error: unknown,
  path: string = '',
  showConsole = false
): string {
  if (showConsole) console.log(`ERROR [${path}]: `, error);
  if (error instanceof Error) {
    return error.message;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  if (typeof error === 'string') {
    return error;
  }

  return 'An error occurred';
}
