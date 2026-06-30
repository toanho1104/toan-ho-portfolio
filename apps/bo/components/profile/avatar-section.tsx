'use client'

import { useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@repo/ui'
import { avatarApi } from '@/lib/api/profile'
import { queryKeys } from '@/lib/query-keys'
import { getApiUrl } from '@/lib/api'
import { AlertMessage } from '@/components/ui/alert-message'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

export function AvatarSection() {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.avatar,
    queryFn: avatarApi.get,
  })

  const uploadMutation = useMutation({
    mutationFn: avatarApi.upload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.avatar })
      queryClient.invalidateQueries({ queryKey: queryKeys.profile })
      if (fileInputRef.current) fileInputRef.current.value = ''
    },
  })

  const deleteMutation = useMutation({
    mutationFn: avatarApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.avatar })
      queryClient.invalidateQueries({ queryKey: queryKeys.profile })
      setConfirmDelete(false)
    },
  })

  const avatar = data?.avatar
  const previewUrl = avatar
    ? `${getApiUrl('/profile/avatar')}?v=${encodeURIComponent(avatar.uploadedAt)}`
    : null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      alert('Only JPEG, PNG, or WebP images are allowed')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be 2MB or less')
      return
    }

    uploadMutation.mutate(file)
  }

  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <h2 className="card-title text-lg">Avatar (S3)</h2>
        <p className="text-sm text-base-content/60">
          Upload JPEG, PNG, or WebP (max 2MB). Replaces any previous S3 avatar.
        </p>

        {isLoading ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          <div className="flex flex-col sm:flex-row items-start gap-4 mt-2">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Avatar preview"
                className="w-24 h-24 rounded-full object-cover border border-base-300"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-base-200 border border-base-300 flex items-center justify-center text-base-content/40 text-sm">
                No image
              </div>
            )}

            <div className="flex-1 space-y-3 w-full">
              {avatar && (
                <Button
                  type="button"
                  variant="error"
                  size="sm"
                  onClick={() => setConfirmDelete(true)}
                >
                  Delete avatar
                </Button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="file-input file-input-bordered file-input-sm w-full max-w-md"
                onChange={handleFileChange}
                disabled={uploadMutation.isPending}
              />
            </div>
          </div>
        )}

        {uploadMutation.error && <AlertMessage message={uploadMutation.error.message} />}
        {deleteMutation.error && <AlertMessage message={deleteMutation.error.message} />}

        <ConfirmDialog
          open={confirmDelete}
          title="Delete avatar"
          message="Remove avatar from S3?"
          loading={deleteMutation.isPending}
          onConfirm={() => deleteMutation.mutate()}
          onClose={() => setConfirmDelete(false)}
        />
      </div>
    </div>
  )
}
