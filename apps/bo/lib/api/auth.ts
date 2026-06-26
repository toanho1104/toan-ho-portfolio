import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/lib/stores/auth.store";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Logout cần gọi trực tiếp (không qua apiFetch để tránh retry loop)
  logout: async () => {
    const accessToken = useAuthStore.getState().accessToken;
    if (!accessToken) return;

    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    }).catch(() => {
      // Ignore lỗi — vẫn clear token ở FE
    });
  },
};
