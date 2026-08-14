"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "./products";

export interface CartItem {
  slug: string;
  name: string;
  priceArs: number;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  add: (product: Product) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "mercalin-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Se defiere a un microtask para no llamar setState de forma síncrona
    // dentro del cuerpo del efecto (regla de lint react-hooks/set-state-in-effect).
    queueMicrotask(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setItems(JSON.parse(raw));
      } catch {
        // localStorage puede fallar (modo privado, cuota) — el carrito arranca vacío
      }
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  function add(product: Product) {
    setItems((prev) => {
      if (prev.some((i) => i.slug === product.slug)) return prev; // un solo producto hoy, no suma cantidad
      return [...prev, { slug: product.slug, name: product.name, priceArs: product.priceArs, qty: 1 }];
    });
  }

  function remove(slug: string) {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }

  function clear() {
    setItems([]);
  }

  const count = items.reduce((a, i) => a + i.qty, 0);
  const total = items.reduce((a, i) => a + i.priceArs * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, count, total, add, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
