import MenuList from "@/components/MenuList";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
};

type Props = {
  getProducts?: () => Promise<Product[]>;
};

export default async function MenuPage({ getProducts }: Props = {}) {
  const products = getProducts ? await getProducts() : [];
  return <MenuList products={products} />;
}
