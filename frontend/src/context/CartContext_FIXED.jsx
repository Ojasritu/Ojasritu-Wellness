import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { cartAPI } from "../services/apiService";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [rawCart, setRawCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // FIX #1: Separate refresh logic to avoid infinite loop
  // Use a stable reference that doesn't change on every render
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cartAPI.get();
      console.log('🛒 Cart refreshed:', data);
      setRawCart(data);
    } catch (e) {
      // If user is not logged in, cart endpoints return 401.
      // Keep cart empty in that case.
      if (e?.status === 401) {
        console.log('⚠️ Cart: User not authenticated, showing empty cart');
        setRawCart({ items: [], total_price: 0 });
      } else {
        console.error('❌ Cart Error:', e?.message);
        setError(e?.message || "Failed to load cart");
        setRawCart({ items: [], total_price: 0 });
      }
    } finally {
      setLoading(false);
    }
  }, []); // FIXED: Empty dependency array - refresh is now stable

  // FIX #2: Only call refresh once on mount
  useEffect(() => {
    console.log('📦 CartProvider: Initial cart load');
    refresh();
  }, []); // FIXED: Only on mount, refresh is stable now

  // FIX #3: Ensure addItem and removeItem use the stable refresh
  const addItem = useCallback(
    async (product, quantity = 1) => {
      if (!product || !product.id) {
        console.error('❌ Invalid product:', product);
        return { ok: false, error: "Invalid product" };
      }
      try {
        console.log(`➕ Adding to cart: ${product.name} (qty: ${quantity})`);
        await cartAPI.addItem(product.id, quantity);
        await refresh(); // Safe to call - refresh is stable
        return { ok: true };
      } catch (e) {
        console.error('❌ Add to cart failed:', e);
        return {
          ok: false,
          status: e?.status,
          error: e?.data?.error || e?.message || "Failed to add to cart",
        };
      }
    },
    [refresh] // refresh is now stable, so this is safe
  );

  const removeItem = useCallback(
    async (cartItemId) => {
      try {
        console.log(`🗑️ Removing cart item: ${cartItemId}`);
        await cartAPI.removeItem(cartItemId);
        await refresh(); // Safe to call - refresh is stable
        return { ok: true };
      } catch (e) {
        console.error('❌ Remove from cart failed:', e);
        return {
          ok: false,
          status: e?.status,
          error: e?.data?.error || e?.message || "Failed to remove item",
        };
      }
    },
    [refresh] // refresh is now stable, so this is safe
  );

  const clearCart = useCallback(async () => {
    // No backend clear endpoint; remove items one-by-one.
    const currentItems = rawCart?.items || [];
    console.log(`🧹 Clearing cart: removing ${currentItems.length} items`);
    for (const it of currentItems) {
      // best-effort
      // eslint-disable-next-line no-await-in-loop
      await cartAPI.removeItem(it.id).catch(() => {});
    }
    await refresh();
  }, [rawCart, refresh]);

  // FIX #4: Memoize items to prevent unnecessary re-renders
  // Only recalculate when rawCart actually changes
  const items = useMemo(() => {
    const cartItems = rawCart?.items || [];
    return cartItems.map((ci) => ({
      id: ci.id, // cart item id (used for remove)
      quantity: ci.quantity,
      total_price: ci.total_price,
      ...(ci.product || {}),
    }));
  }, [rawCart?.items]); // FIXED: Only depend on items array, not entire rawCart

  // FIX #5: Memoize totals to prevent recalculation
  const totals = useMemo(() => {
    const totalCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const totalPrice = Number(
      rawCart?.total_price ??
        items.reduce((sum, item) => {
          const price = parseFloat(item.discount_price || item.price || 0);
          return sum + price * (item.quantity || 1);
        }, 0)
    );
    return { totalCount, totalPrice };
  }, [items, rawCart?.total_price]); // FIXED: More specific dependencies

  // FIX #6: Create stable context value to prevent child re-renders
  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      clearCart,
      refresh,
      loading,
      error,
      totalCount: totals.totalCount,
      totalPrice: totals.totalPrice,
    }),
    [items, addItem, removeItem, clearCart, refresh, loading, error, totals]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
