import axios from "axios";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ??
      error.message ??
      "Unknown API error";
    return Promise.reject(new Error(message));
  },
);

export function getApiUrl(path: string): string {
  return `${API_URL}${path}`;
}

export function getAvatarUrl(profile: {
  avatarUrl: string | null;
  avatar: { available?: boolean; urlPath: string } | null;
}): string | null {
  if (profile.avatarUrl) return profile.avatarUrl;
  if (profile.avatar?.urlPath) return getApiUrl(profile.avatar.urlPath);
  return null;
}

export function getResumeUrl(profile: {
  resume: { downloadPath: string } | null;
}): string | null {
  if (profile.resume?.downloadPath) {
    return getApiUrl(profile.resume.downloadPath);
  }
  return null;
}
