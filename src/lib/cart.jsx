import { createContext, useContext, useEffect, useState } from "react";

const CartCtx = createContext({
  items: [],
  add: () => {},
  remove: () => {},
  setQty: () => {},
  clear: () => {},
  count: 0,
  subtotal: 0,
});

const KEY = "flty-cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, ready]);

  const add = (p, qty = 1) =>
    setItems((prev) => {
      const ex = prev.find((i) => i.id === p.id);
      if (ex) return prev.map((i) => (i.id === p.id ? { ...i, quantity: i.quantity + qty } : i));
      return [
        ...prev,
        {
          id: p.id,
          name: p.name,
          price: p.price,
          quantity: qty,
          seller: p.seller,
          category: p.category,
          unit: p.unit,
        },
      ];
    });
  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const setQty = (id, qty) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i)));
  const clear = () => setItems([]);
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartCtx.Provider value={{ items, add, remove, setQty, clear, count, subtotal }}>
      {children}
    </CartCtx.Provider>
  );
}

export const useCart = () => useContext(CartCtx);
