import { type Result, ok, err } from "neverthrow";

export type OrderStatus = "pending" | "preparing" | "done";

const allowedTransitions: Record<OrderStatus, OrderStatus | null> = {
  pending: "preparing",
  preparing: "done",
  done: null,
};

export function validateStatusTransition(
  currentStatus: OrderStatus,
  newStatus: OrderStatus,
): Result<OrderStatus, string> {
  if (allowedTransitions[currentStatus] === newStatus) {
    return ok(newStatus);
  }
  return err(
    `Invalid status transition from '${currentStatus}' to '${newStatus}'`,
  );
}
