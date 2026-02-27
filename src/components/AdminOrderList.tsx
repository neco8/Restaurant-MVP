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

export default function AdminOrderList({}: Props) {
  return null;
}
