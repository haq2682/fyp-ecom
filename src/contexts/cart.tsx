import { createContext, useContext, useEffect, useState } from 'react';
import { createCart, getCart } from '@/actions/cart';

interface CartContextType {
  cartId: string | null;
  isLoading: boolean;
  cart: any;
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
  const [cart, setCart] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeCart = async () => {
      const storedCartId = localStorage.getItem('cartId');
      console.log(storedCartId);
      if (storedCartId) {
        try {
          const cartData = await getCart(storedCartId);
          setCart(cartData);
          setCartId(storedCartId);
        } catch (error) {
          localStorage.removeItem('cartId');
          const newCart = await createCart();
          setCart(newCart);
          setCartId(newCart.id);
          localStorage.setItem('cartId', newCart.id);
        }
      } else {
        console.log('Skibidi')
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