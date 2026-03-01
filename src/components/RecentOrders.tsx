type Order = {
  id: string;
  status: string;
  total: number;
  createdAt: string;
};

export default function RecentOrders({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return <div>まだ注文はありません</div>;
  }

  return (
    <table>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{new Date(order.createdAt).toLocaleDateString("ja-JP")}</td>
            <td>¥{order.total.toLocaleString("ja-JP")}</td>
            <td>{order.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
