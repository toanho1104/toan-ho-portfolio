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

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const accessToken = useAuthStore.getState().accessToken

  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options?.headers,
    },
    ...options,
  })

  // Access token hết hạn → thử refresh
  if (res.status === 401) {
    const newToken = await refreshAccessToken()

    if (!newToken) {
      throw new Error('Session expired. Please login again.')
    }

    // Retry request với token mới
    const retryRes = await fetch(`${API_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newToken}`,
        ...options?.headers,
      },
      ...options,
    })

    if (!retryRes.ok) {
      const error = await retryRes.json().catch(() => ({ message: 'Unknown error' }))
      throw new Error(error.message ?? `HTTP ${retryRes.status}`)
    }

    return retryRes.json() as Promise<T>
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Unknown error' }))
    throw new Error(error.message ?? `HTTP ${res.status}`)
  }

  return res.json() as Promise<T>
}
