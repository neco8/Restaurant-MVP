import { createSession, getSession, destroySession } from "./session";
import { cookies } from "next/headers";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

const mockCookies = cookies as ReturnType<typeof vi.fn>;

test("createSession sets a session cookie", async () => {
  const mockSet = vi.fn();
  mockCookies.mockReturnValue({ set: mockSet });

  await createSession("admin@test.com");

  expect(mockSet).toHaveBeenCalledWith(
    "session",
    expect.any(String),
    expect.anything()
  );
});

test("getSession returns email from session cookie", () => {
  const request = new Request("http://localhost", {
    headers: { Cookie: "session=admin@test.com" },
  });

  const session = getSession(request);

  expect(session).toEqual({ email: "admin@test.com" });
});

test("destroySession deletes the session cookie", async () => {
  const mockDelete = vi.fn();
  mockCookies.mockReturnValue({ delete: mockDelete });

  await destroySession();

  expect(mockDelete).toHaveBeenCalledWith("session");
});
