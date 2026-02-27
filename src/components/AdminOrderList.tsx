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
  onStatusUpdate?: (orderId: string, newStatus: string) => void;
};

export default function AdminOrderList({ orders }: Props) {
  if (orders.length === 0) {
    return <p className="font-serif text-base font-light italic text-muted">No orders found.</p>;
  }

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-foreground">
          <th className="text-left py-3 px-4 font-sans text-xs font-medium tracking-widest-2 uppercase text-muted">Status</th>
          <th className="text-left py-3 px-4 font-sans text-xs font-medium tracking-widest-2 uppercase text-muted">Total</th>
          <th className="text-left py-3 px-4 font-sans text-xs font-medium tracking-widest-2 uppercase text-muted">Date</th>
          <th className="text-left py-3 px-4 font-sans text-xs font-medium tracking-widest-2 uppercase text-muted">Items</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr
            key={order.id}
            className="border-b border-border hover:bg-surface-hover transition-colors duration-200"
          >
            <td className="py-4 px-4 font-sans text-sm">{order.status}</td>
            <td className="py-4 px-4 font-sans text-sm tabular-nums">${order.total.toFixed(2)}</td>
            <td className="py-4 px-4 font-sans text-sm text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
            <td className="py-4 px-4">
              <ul className="space-y-1">
                {order.items.map((item) => (
                  <li key={item.id} className="font-sans text-sm">
                    <span>{item.productName}</span>{" "}
                    <span className="text-muted">×{item.quantity}</span>
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
