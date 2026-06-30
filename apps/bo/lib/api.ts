import { useAuthStore } from '@/lib/stores/auth.store'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = useAuthStore.getState().refreshToken
  if (!refreshToken) return null

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })

    if (!res.ok) {
      useAuthStore.getState().clearTokens()
      return null
    }

    const { accessToken, refreshToken: newRefreshToken } = await res.json()
    useAuthStore.getState().setTokens(accessToken, newRefreshToken)
    return accessToken
  } catch {
    useAuthStore.getState().clearTokens()
    return null
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  accessToken?: string | null,
): Promise<T> {
  const token = accessToken ?? useAuthStore.getState().accessToken
  const isFormData = options.body instanceof FormData

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })

  if (res.status === 401 && accessToken === undefined) {
    const newToken = await refreshAccessToken()
    if (!newToken) throw new Error('Session expired. Please login again.')
    return request<T>(path, options, newToken)
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Unknown error' }))
    throw new Error(error.message ?? `HTTP ${res.status}`)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  return request<T>(path, options)
}

export async function apiUpload<T>(path: string, formData: FormData): Promise<T> {
  return request<T>(path, { method: 'POST', body: formData })
}

export function getApiUrl(path: string) {
  return `${API_URL}${path}`
}
