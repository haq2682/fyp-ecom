import { createContext, useContext, useEffect, useState } from 'react';
import { createCart, getCart } from '@/actions/cart';
import {Cart} from '@/types';

interface CartContextType {
  cartId: string | null;
  isLoading: boolean;
  cart: Cart | null;
  refetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  cartId: null,
  isLoading: true,
  cart: null,
  refetchCart: async () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartId, setCartId] = useState<string | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeCart = async () => {
      const storedCartId = localStorage.getItem('cartId');
      if (storedCartId) {
        try {
          const cartData = await getCart(storedCartId);
          setCart(cartData);
          setCartId(storedCartId);
        } catch (error) {
          console.error('Error initializing cart', error);
          localStorage.removeItem('cartId');
          const newCart = await createCart();
          setCart(newCart);
          setCartId(newCart.id);
          localStorage.setItem('cartId', newCart.id);
        }
      } else {
        const newCart = await createCart();
        setCart(newCart);
        setCartId(newCart.id);
        localStorage.setItem('cartId', newCart.id);
      }
      setIsLoading(false);
    };

    initializeCart();
  }, []);

  const refetchCart = async () => {
    if (cartId) {
      const cartData = await getCart(cartId);
      setCart(cartData);
    }
  };

  return (
    <CartContext.Provider value={{ cartId, isLoading, cart, refetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);