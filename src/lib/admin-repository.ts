type Admin = {
  readonly id: string;
  readonly email: string;
  readonly passwordHash: string;
};

type PrismaClient = {
  readonly admin: {
    readonly findUnique: (args: {
      readonly where: { readonly email: string };
    }) => Promise<Admin | null>;
  };
};

export async function findAdminByEmail(
  prisma: PrismaClient,
  email: string
): Promise<Admin | null> {
  return prisma.admin.findUnique({ where: { email } });
}
