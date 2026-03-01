type Order = {
  id: string;
  status: string;
  total: number;
  createdAt: string;
};

type Props = {
  orders: Order[];
  onStatusUpdate?: (orderId: string, newStatus: string) => void;
};

export default function RecentOrders({ orders, onStatusUpdate }: Props) {
  if (orders.length === 0) {
    return <div>まだ注文はありません</div>;
  }

  return (
    <table>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td><a href={`/admin/orders/${order.id}`}>{order.id}</a></td>
            <td>{new Date(order.createdAt).toLocaleDateString("ja-JP")}</td>
            <td>¥{order.total.toLocaleString("ja-JP")}</td>
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
  );
}
