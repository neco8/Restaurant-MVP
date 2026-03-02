"use client";

import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/formatPrice";
import { price } from "@/lib/price";

type Order = {
  id: string;
  status: string;
  total: number;
  createdAt: string;
};

type Props = {
  orders: Order[];
  totalCount?: number;
  onStatusUpdate?: (orderId: string, newStatus: string) => void;
};

export default function RecentOrders({ orders, totalCount = 0, onStatusUpdate }: Props) {
  const router = useRouter();
  if (orders.length === 0) {
    return <div>まだ注文はありません</div>;
  }

  return (
    <div>
      <table>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} onClick={(e) => {
              if ((e.target as HTMLElement).closest("select")) return;
              router.push(`/admin/orders/${order.id}`);
            }} style={{ cursor: "pointer" }}>
              <td><a href={`/admin/orders/${order.id}`}>{order.id}</a></td>
              <td>{new Date(order.createdAt).toLocaleDateString("ja-JP")}</td>
              <td>{formatPrice(price(order.total))}</td>
              <td>
                <select
                  defaultValue={order.status}
                  onChange={(e) => onStatusUpdate?.(order.id, e.target.value)}
                >
                  <option value="pending">pending</option>
                  <option value="preparing">preparing</option>
                  <option value="done">done</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalCount > 5 && (
        <a href="/admin/orders">すべての注文を見る</a>
      )}
    </div>
  );
}
