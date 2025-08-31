import { AuthStore } from "@/store/AuthStore";
import { useStore } from "zustand";

export const useAuthStore = () => {
  return useStore(AuthStore);
};
