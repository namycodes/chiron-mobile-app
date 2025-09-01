import { Drug } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface WishlistItem {
  id: string;
  drug: Drug;
  addedAt: string;
}

interface Wishlist {
  items: WishlistItem[];
}

interface WishlistState {
  wishlist: Wishlist;
  loading: boolean;
  error: string | null;

  // Actions
  addToWishlist: (drug: Drug) => void;
  removeFromWishlist: (drugId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (drugId: string) => boolean;

  // Computed values
  getWishlistItems: () => WishlistItem[];
  getWishlistItemCount: () => number;
}

export const WishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: {
        items: [],
      },
      loading: false,
      error: null,

      addToWishlist: (drug: Drug) => {
        const state = get();
        const existingItem = state.wishlist.items.find(
          (item) => item.drug.id === drug.id
        );

        if (existingItem) {
          // Item already in wishlist, don't add again
          return;
        }

        const newItem: WishlistItem = {
          id: `wishlist-${drug.id}-${Date.now()}`,
          drug,
          addedAt: new Date().toISOString(),
        };

        set((state) => ({
          wishlist: {
            ...state.wishlist,
            items: [...state.wishlist.items, newItem],
          },
        }));
      },

      removeFromWishlist: (drugId: string) => {
        set((state) => ({
          wishlist: {
            ...state.wishlist,
            items: state.wishlist.items.filter(
              (item) => item.drug.id !== drugId
            ),
          },
        }));
      },

      clearWishlist: () => {
        set({
          wishlist: {
            items: [],
          },
        });
      },

      isInWishlist: (drugId: string) => {
        const state = get();
        return state.wishlist.items.some((item) => item.drug.id === drugId);
      },

      getWishlistItems: () => {
        const state = get();
        return state.wishlist.items;
      },

      getWishlistItemCount: () => {
        const state = get();
        return state.wishlist.items.length;
      },
    }),
    {
      name: "chiron-wishlist",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
