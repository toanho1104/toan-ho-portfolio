import { apiFetch, apiUpload } from '@/lib/api'
import type {
  AvatarResponse,
  Profile,
  ResumeResponse,
  UpdateProfileInput,
  UploadAvatarResponse,
  UploadResumeResponse,
} from '@/lib/types/profile'

export const profileApi = {
  get: () => apiFetch<Profile>('/profile/'),
  update: (data: UpdateProfileInput) =>
    apiFetch<Profile>('/profile/', { method: 'PUT', body: JSON.stringify(data) }),
}

export const avatarApi = {
  get: () => apiFetch<AvatarResponse>('/profile/avatar/me'),
  upload: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiUpload<UploadAvatarResponse>('/profile/avatar/upload', formData)
  },
  remove: () => apiFetch<void>('/profile/avatar', { method: 'DELETE' }),
}

export const resumeApi = {
  get: () => apiFetch<ResumeResponse>('/resume/'),
  upload: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiUpload<UploadResumeResponse>('/resume/upload', formData)
  },
  remove: () => apiFetch<void>('/resume/', { method: 'DELETE' }),
}
