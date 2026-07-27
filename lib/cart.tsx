"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Engraving } from "@/lib/engraving";

export type CartItem = {
  slug: string;
  name: string;
  name_ar?: string;
  price: number; // JOD, per unit — includes the engraving fee when engraved
  qty: number;
  image?: string;
  madeToOrder?: boolean;
  engraving?: Engraving;
};

// One cart line per slug+engraving combo, so "board for Omar" and
// "board for Lina" stay separate lines.
export function lineId(item: Pick<CartItem, "slug" | "engraving">): string {
  return item.engraving
    ? `${item.slug}::${item.engraving.style}::${item.engraving.text}`
    : item.slug;
}

type CartCtx = {
  items: CartItem[];
  count: number;
  total: number;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "plexus-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s) setItems(JSON.parse(s));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const add: CartCtx["add"] = useCallback((item, qty = 1) => {
    setItems((prev) => {
      const id = lineId(item);
      const found = prev.find((p) => lineId(p) === id);
      if (found)
        return prev.map((p) => (lineId(p) === id ? { ...p, qty: p.qty + qty } : p));
      return [...prev, { ...item, qty }];
    });
    setIsOpen(true);
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => lineId(p) !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((p) => lineId(p) !== id)
        : prev.map((p) => (lineId(p) === id ? { ...p, qty } : p))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((a, i) => a + i.qty, 0);
  const total = items.reduce((a, i) => a + i.price * i.qty, 0);

  return (
    <Ctx.Provider
      value={{
        items,
        count,
        total,
        add,
        remove,
        setQty,
        clear,
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside <CartProvider>");
  return c;
}
