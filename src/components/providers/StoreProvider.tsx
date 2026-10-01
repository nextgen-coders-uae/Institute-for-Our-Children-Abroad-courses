"use client";

/**
 * Client-side store: booking cart, wishlist, display currency and toasts.
 * Persisted in localStorage so the cart survives page reloads.
 * (Phase 2: sync the cart/wishlist to the student account via an API.)
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import type { CartItem, CurrencyCode } from "@/lib/types";
import site from "@/data/site.json";

const KEYS = { cart: "abc:cart", wishlist: "abc:wishlist", currency: "abc:currency" } as const;

interface Toast {
  id: number;
  message: string;
}

interface StoreValue {
  hydrated: boolean;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "key">) => void;
  updateCartItem: (key: string, patch: Partial<Omit<CartItem, "key">>) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (courseId: string) => boolean;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  rate: number;
  toast: (message: string) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

const RATES = site.currencies as unknown as Record<CurrencyCode, number>;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode) — keep in memory only */
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currency, setCurrencyState] = useState<CurrencyCode>("AED");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  // Load persisted state once on the client
  useEffect(() => {
    setCart(read<CartItem[]>(KEYS.cart, []));
    setWishlist(read<string[]>(KEYS.wishlist, []));
    const c = read<CurrencyCode>(KEYS.currency, "AED");
    setCurrencyState(c in RATES ? c : "AED");
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) write(KEYS.cart, cart); }, [cart, hydrated]);
  useEffect(() => { if (hydrated) write(KEYS.wishlist, wishlist); }, [wishlist, hydrated]);

  const toast = useCallback((message: string) => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const addToCart = useCallback((item: Omit<CartItem, "key">) => {
    setCart((prev) => {
      // One line per course/package: re-adding updates the existing line
      const existing = prev.find((p) => p.type === item.type && p.refId === item.refId);
      if (existing) return prev.map((p) => (p === existing ? { ...existing, ...item } : p));
      return [...prev, { ...item, key: `${item.type}-${item.refId}-${Date.now().toString(36)}` }];
    });
  }, []);

  const updateCartItem = useCallback((key: string, patch: Partial<Omit<CartItem, "key">>) => {
    setCart((prev) => prev.map((p) => (p.key === key ? { ...p, ...patch } : p)));
  }, []);

  const removeFromCart = useCallback((key: string) => setCart((prev) => prev.filter((p) => p.key !== key)), []);
  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((id: string) => {
    const added = !wishlist.includes(id);
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    return added;
  }, [wishlist]);

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    write(KEYS.currency, c);
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      hydrated,
      cart,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      wishlist,
      toggleWishlist,
      currency,
      setCurrency,
      rate: RATES[currency] ?? 1,
      toast,
    }),
    [hydrated, cart, addToCart, updateCartItem, removeFromCart, clearCart, wishlist, toggleWishlist, currency, setCurrency, toast]
  );

  return (
    <StoreContext.Provider value={value}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex flex-col items-center gap-2 px-4 sm:bottom-8">
        {toasts.map((t) => (
          <div key={t.id} className="animate-fade-up pointer-events-auto flex items-center gap-2 rounded-full bg-lapis-900 px-5 py-3 text-sm font-semibold text-white shadow-xl ring-1 ring-gold-500/40">
            <CheckCircle2 className="h-5 w-5 text-gold-300" aria-hidden="true" />
            {t.message}
          </div>
        ))}
      </div>
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
