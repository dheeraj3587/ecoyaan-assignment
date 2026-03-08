import { getCartData } from "@/lib/cart-data";
import { CartPage } from "@/components/cart/cart-page";

export default async function Home() {
  const cartData = await getCartData();

  return <CartPage initialData={cartData} />;
}
