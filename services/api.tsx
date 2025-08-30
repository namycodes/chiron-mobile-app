import {AuthStore}  from "@/store/AuthStore";
import { RequestOptions } from "@/types";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL
export async function ApiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
    
  const token = AuthStore.getState().token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Something went wrong");
  }

  return response.json();
}