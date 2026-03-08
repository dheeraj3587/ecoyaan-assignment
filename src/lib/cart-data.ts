import { CartData } from "./types";

export async function getCartData(): Promise<CartData> {
    return {
        cartItems: [
            {
                product_id: 101,
                product_name: "Bamboo Toothbrush (Pack of 4)",
                product_price: 299,
                quantity: 2,
                image: "https://prod-cdn.ecoyaan.com/cdn/seller-docs/35/product/1215/images/pi/1215-21006485-1743243804.jpg",
            },
            {
                product_id: 102,
                product_name: "Reusable Cotton Produce Bags",
                product_price: 450,
                quantity: 1,
                image: "https://prod-cdn.ecoyaan.com/cdn/seller-docs/35/product/1298/images/pi/1298-4e65b9a7-1743573249.jpg",
            },
        ],
        shipping_fee: 50,
        discount_applied: 0,
    };
}
