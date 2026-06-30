'use client'

import { useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@repo/ui'
import { resumeApi } from '@/lib/api/profile'
import { queryKeys } from '@/lib/query-keys'
import { getApiUrl } from '@/lib/api'
import { AlertMessage } from '@/components/ui/alert-message'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useState } from 'react'

export function ResumeSection() {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.resume,
    queryFn: resumeApi.get,
  })

  const uploadMutation = useMutation({
    mutationFn: resumeApi.upload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resume })
      queryClient.invalidateQueries({ queryKey: queryKeys.profile })
      if (fileInputRef.current) fileInputRef.current.value = ''
    },
  })

  const deleteMutation = useMutation({
    mutationFn: resumeApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resume })
      queryClient.invalidateQueries({ queryKey: queryKeys.profile })
      setConfirmDelete(false)
    },
  })

  const resume = data?.resume

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File must be 5MB or less')
      return
    }
    uploadMutation.mutate(file)
  }

  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <h2 className="card-title text-lg">CV / Resume (S3)</h2>
        <p className="text-sm text-base-content/60">
          Upload PDF (max 5MB). Portfolio will link to download via API.
        </p>

        {isLoading ? (
          <span className="loading loading-spinner loading-sm" />
        ) : resume ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-2">
            <div className="flex-1">
              <p className="font-medium">{resume.fileName ?? 'resume.pdf'}</p>
              <p className="text-xs text-base-content/50">
                Uploaded {new Date(resume.uploadedAt).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href={getApiUrl('/resume/download')}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline"
              >
                Preview
              </a>
              <Button
                type="button"
                variant="error"
                size="sm"
                onClick={() => setConfirmDelete(true)}
              >
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-base-content/50">No CV uploaded yet.</p>
        )}

        <div className="mt-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="file-input file-input-bordered file-input-sm w-full max-w-md"
            onChange={handleFileChange}
            disabled={uploadMutation.isPending}
          />
        </div>

        {uploadMutation.error && <AlertMessage message={uploadMutation.error.message} />}
        {deleteMutation.error && <AlertMessage message={deleteMutation.error.message} />}

        <ConfirmDialog
          open={confirmDelete}
          title="Delete CV"
          message="Remove CV from S3? This cannot be undone."
          loading={deleteMutation.isPending}
          onConfirm={() => deleteMutation.mutate()}
          onClose={() => setConfirmDelete(false)}
        />
      </div>
    </div>
  )
}
