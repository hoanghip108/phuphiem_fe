'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { CartItem } from '@/types/product';

interface CartContextValue {
  items: CartItem[];
  addItem: (
    item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }
  ) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateNote: (id: string, note: string) => void;
  hydrateItems: (items: CartItem[]) => void;
  totalQuantity: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = 'cartItems';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Hydrate from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addItem: CartContextValue['addItem'] = useCallback(
    (item) => {
      setItems((prev) => {
        const lineId = `${item.productId}-${
          item.variantId != null ? item.variantId : 'default'
        }`;
        const existingIndex = prev.findIndex((c) => c.id === lineId);
        const qty = item.quantity ?? 1;

        if (existingIndex >= 0) {
          const next = [...prev];
          next[existingIndex] = {
            ...next[existingIndex],
            quantity: next[existingIndex].quantity + qty,
          };
          return next;
        }

        return [
          ...prev,
          {
            id: lineId,
            productId: item.productId,
            productName: item.productName,
            image: item.image,
            variantId: item.variantId,
            size: item.size,
            price: item.price,
            quantity: qty,
            note: item.note,
            isColorMixingAvailable: item.isColorMixingAvailable,
          },
        ];
      });
    },
    [setItems]
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: quantity < 1 ? 1 : quantity,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const updateNote = useCallback((id: string, note: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              note,
            }
          : item
      )
    );
  }, []);

  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const hydrateItems = useCallback((newItems: CartItem[]) => {
    setItems(newItems);
  }, []);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    clearCart,
    updateQuantity,
    updateNote,
    hydrateItems,
    totalQuantity,
    totalAmount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}


