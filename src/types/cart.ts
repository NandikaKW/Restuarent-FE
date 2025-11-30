export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
  updatedAt: string;
}
//map with the backend controller
export interface AddToCartData {
  menuItemId: string;
  name: string;
  price: number;
  quantity?: number;
  image: string;
}
//map with the backend controller
export interface UpdateCartData {
  items: CartItem[];
}