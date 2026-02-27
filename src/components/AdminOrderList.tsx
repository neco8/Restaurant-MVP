export type AdminOrder = {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: AdminOrderItem[];
};

export type AdminOrderItem = {
  id: string;
  productName: string;
  quantity: number;
  price: number;
};

type Props = {
  orders: AdminOrder[];
};

export default function AdminOrderList({ orders }: Props) {
  if (orders.length === 0) {
    return <p>No orders found.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Status</th>
          <th>Total</th>
          <th>Date</th>
          <th>Items</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.status}</td>
            <td>${order.total.toFixed(2)}</td>
            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
            <td>
              <ul>
                {order.items.map((item) => (
                  <li key={item.id}>
                    <span>{item.productName}</span> ×{item.quantity}
                  </li>
                ))}
              </ul>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
