import { createContext, useState, useContext, useEffect } from 'react';

export const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch {
      localStorage.removeItem('cart');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const getAvailable = (ticketType) => {
    if (ticketType.available !== undefined) return ticketType.available;
    if (ticketType.capacity && ticketType.sold !== undefined) {
      return Math.max(0, ticketType.capacity - ticketType.sold);
    }
    return 99;
  };

  const addToCart = (event, ticketType, quantity) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.event.id === event.id && item.ticketType.id === ticketType.id
      );
      const maxQty = getAvailable(ticketType);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(newQty, maxQty),
        };
        return updated;
      }
      return [
        ...prev,
        { event, ticketType, quantity: Math.min(quantity, maxQty) },
      ];
    });
  };

  const removeFromCart = (eventId, ticketTypeId) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.event.id === eventId && item.ticketType.id === ticketTypeId)
      )
    );
  };

  const updateQuantity = (eventId, ticketTypeId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(eventId, ticketTypeId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.event.id === eventId && item.ticketType.id === ticketTypeId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const getCartTotal = () =>
    cartItems.reduce((total, item) => total + item.ticketType.price * item.quantity, 0);

  const getCartCount = () =>
    cartItems.reduce((count, item) => count + item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
