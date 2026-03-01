type Admin = {
  readonly id: string;
  readonly email: string;
  readonly passwordHash: string;
};

export async function findAdminByEmail(
  _email: string
): Promise<Admin | null> {
  return null;
}
