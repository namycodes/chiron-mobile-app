import { LoginResponse } from "@/types";
import { ApiRequest } from "./api";

export const AuthService = {
    login: (email: string, password: string) => 
        ApiRequest<LoginResponse>("/auth/login", {
            method: "POST",
            body: {email, password}
        })
}