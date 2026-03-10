/* eslint-disable @typescript-eslint/no-unused-vars */
import { type Result } from "neverthrow";

export type OrderStatus = "pending" | "preparing" | "done";

export function validateStatusTransition(
  _currentStatus: OrderStatus,
  _newStatus: OrderStatus,
): Result<OrderStatus, string> {
  throw new Error("Not implemented");
}
