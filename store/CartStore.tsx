import { Cart, CartItem, Drug } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CartState {
  cart: Cart;
  loading: boolean;
  error: string | null;

  // Actions
  addToCart: (
    drug: Drug,
    quantity?: number,
    prescriptionCode?: string,
    prescriptionDocument?: string
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  updatePrescription: (
    itemId: string,
    prescriptionCode?: string,
    prescriptionDocument?: string
  ) => void;

  // Computed values
  getCartTotal: () => number;
  getCartItemCount: () => number;
  getCartItems: () => CartItem[];
}

const initialCart: Cart = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  updatedAt: new Date(),
};

export const CartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: initialCart,
      loading: false,
      error: null,

      addToCart: (
        drug: Drug,
        quantity = 1,
        prescriptionCode?: string,
        prescriptionDocument?: string
      ) => {
        set({ loading: true, error: null });

        try {
          const currentCart = get().cart;
          const existingItemIndex = currentCart.items.findIndex(
            (item) => item.drug.id === drug.id
          );

          let updatedItems: CartItem[];

          if (existingItemIndex >= 0) {
            // Update existing item
            updatedItems = currentCart.items.map((item, index) =>
              index === existingItemIndex
                ? {
                    ...item,
                    quantity: item.quantity + quantity,
                    prescriptionCode: prescriptionCode || item.prescriptionCode,
                    prescriptionDocument:
                      prescriptionDocument || item.prescriptionDocument,
                  }
                : item
            );
          } else {
            // Add new item
            const newItem: CartItem = {
              id: `cart_${Date.now()}_${drug.id}`,
              drug,
              quantity,
              prescriptionCode,
              prescriptionDocument,
              addedAt: new Date(),
            };
            updatedItems = [...currentCart.items, newItem];
          }

          const totalItems = updatedItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          const totalAmount = updatedItems.reduce(
            (sum, item) => sum + item.drug.price * item.quantity,
            0
          );

          const updatedCart: Cart = {
            items: updatedItems,
            totalItems,
            totalAmount,
            updatedAt: new Date(),
          };

          set({ cart: updatedCart, loading: false });
        } catch (error) {
          set({ error: "Failed to add item to cart", loading: false });
        }
      },

      removeFromCart: (itemId: string) => {
        set({ loading: true, error: null });

        try {
          const currentCart = get().cart;
          const updatedItems = currentCart.items.filter(
            (item) => item.id !== itemId
          );

          const totalItems = updatedItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          const totalAmount = updatedItems.reduce(
            (sum, item) => sum + item.drug.price * item.quantity,
            0
          );

          const updatedCart: Cart = {
            items: updatedItems,
            totalItems,
            totalAmount,
            updatedAt: new Date(),
          };

          set({ cart: updatedCart, loading: false });
        } catch (error) {
          set({ error: "Failed to remove item from cart", loading: false });
        }
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(itemId);
          return;
        }

        set({ loading: true, error: null });

        try {
          const currentCart = get().cart;
          const updatedItems = currentCart.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          );

          const totalItems = updatedItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          const totalAmount = updatedItems.reduce(
            (sum, item) => sum + item.drug.price * item.quantity,
            0
          );

          const updatedCart: Cart = {
            items: updatedItems,
            totalItems,
            totalAmount,
            updatedAt: new Date(),
          };

          set({ cart: updatedCart, loading: false });
        } catch (error) {
          set({ error: "Failed to update quantity", loading: false });
        }
      },

      updatePrescription: (
        itemId: string,
        prescriptionCode?: string,
        prescriptionDocument?: string
      ) => {
        set({ loading: true, error: null });

        try {
          const currentCart = get().cart;
          const updatedItems = currentCart.items.map((item) =>
            item.id === itemId
              ? { ...item, prescriptionCode, prescriptionDocument }
              : item
          );

          const updatedCart: Cart = {
            ...currentCart,
            items: updatedItems,
            updatedAt: new Date(),
          };

          set({ cart: updatedCart, loading: false });
        } catch (error) {
          set({ error: "Failed to update prescription", loading: false });
        }
      },

      clearCart: () => {
        set({ cart: initialCart, loading: false, error: null });
      },

      getCartTotal: () => {
        return get().cart.totalAmount;
      },

      getCartItemCount: () => {
        return get().cart.totalItems;
      },

      getCartItems: () => {
        return get().cart.items;
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
