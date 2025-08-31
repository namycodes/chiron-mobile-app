import {
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RolesResponse,
} from "@/types";
import { ApiRequest } from "./api";

export const AuthService = {
  login: (email: string, password: string) =>
    ApiRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: { email, password },
    }),

  register: (userData: RegisterRequest) =>
    ApiRequest<RegisterResponse>("/auth/register", {
      method: "POST",
      body: userData,
    }),

  getRoles: () =>
    ApiRequest<RolesResponse>("/data/roles", {
      method: "GET",
    }),
};
