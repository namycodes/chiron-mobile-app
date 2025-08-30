import { AuthService } from "@/services/auth.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
  message: string;
  statusCode: number;
  login: (email: string, password: string) => Promise<boolean>;
  role: string | null;
  logout: () => Promise<void>;
}

export const AuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      loading: false,
      error: null,
      message: "",
      statusCode: 200,
      role: null,
      login: async (email: string, password: string) => {
        set({ loading: true, error: null, role: null });
        try {
          const { data, message, statusCode } = await AuthService.login(
            email,
            password
          );
          const user = jwtDecode<{ RoleName: string }>(data.token);
          set({
            token: data.token,
            error: null,
            message,
            statusCode,
            loading: false,
            role: user.RoleName,
          });
          return true;
        } catch (err: any) {
          set({
            loading: false,
            error: err.message || "Login failed",
            message: "",
            statusCode: err.statusCode || 500,
          });
          return false;
        }
      },
      logout: async () => {
        set({ token: null, role: null });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ token: state.token, role: state.role! }),
    }
  )
);
