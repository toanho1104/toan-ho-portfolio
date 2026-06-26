import { create } from "zustand";
import { persist } from "zustand/middleware";

const COOKIE_NAME = "bo-auth-token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 ngày

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  clearTokens: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,

      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken });
        document.cookie = `${COOKIE_NAME}=${accessToken}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Strict`;
      },

      setAccessToken: (accessToken) => {
        set({ accessToken });
        document.cookie = `${COOKIE_NAME}=${accessToken}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Strict`;
      },

      clearTokens: () => {
        set({ accessToken: null, refreshToken: null });
        document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
      },

      isAuthenticated: () => !!get().accessToken,
    }),
    {
      name: "bo-auth",
    },
  ),
);
