export async function createSession(): Promise<void> {}

export async function getSession(
  _request: Request
): Promise<{ email: string } | null> {
  return null;
}
