type LoginResult = {
  readonly success: false;
  readonly error: string;
};

export async function login(_credentials: {
  email: string;
  password: string;
}): Promise<LoginResult> {
  return { success: false, error: "Invalid email or password" };
}
