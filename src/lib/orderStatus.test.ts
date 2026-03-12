import { validateStatusTransition } from "./orderStatus";
import { ok } from "neverthrow";

test("should allow transition from pending to preparing", () => {
  expect(validateStatusTransition("pending", "preparing")).toEqual(
    ok("preparing"),
  );
});

test("should allow transition from preparing to done", () => {
  expect(validateStatusTransition("preparing", "done")).toEqual(ok("done"));
});

test("should reject transition from done to pending", () => {
  expect(validateStatusTransition("done", "pending").isErr()).toBe(true);
});

test("should reject transition from done to preparing", () => {
  expect(validateStatusTransition("done", "preparing").isErr()).toBe(true);
});

test("should reject transition from preparing to pending", () => {
  expect(validateStatusTransition("preparing", "pending").isErr()).toBe(true);
});

test("should reject same-status transition", () => {
  expect(validateStatusTransition("pending", "pending").isErr()).toBe(true);
  expect(validateStatusTransition("preparing", "preparing").isErr()).toBe(true);
  expect(validateStatusTransition("done", "done").isErr()).toBe(true);
});
