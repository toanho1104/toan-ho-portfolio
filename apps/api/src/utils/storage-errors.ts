type StorageErrorResponse = {
  status: number
  message: string
}

export function mapStorageError(error: unknown): StorageErrorResponse {
  const message = error instanceof Error ? error.message : 'Upload failed'
  const name = error instanceof Error ? error.name : ''

  if (message === 'AWS is not configured') {
    return { status: 503, message }
  }

  if (message === 'AWS credentials are not configured') {
    return { status: 503, message }
  }

  if (
    message === 'Only JPEG, PNG, or WebP images are allowed' ||
    message === 'Image size must be 2MB or less' ||
    message === 'Only PDF files are allowed' ||
    message === 'File size must be 5MB or less'
  ) {
    return { status: 422, message }
  }

  if (message === 'Profile not found') {
    return { status: 404, message }
  }

  const combined = `${name} ${message}`

  if (
    combined.includes('CredentialsProviderError') ||
    combined.includes('Could not load credentials') ||
    combined.includes('Missing credentials')
  ) {
    return {
      status: 503,
      message: 'AWS credentials are not configured on the server',
    }
  }

  if (combined.includes('AccessDenied')) {
    return {
      status: 503,
      message: 'AWS S3 access denied — check IAM permissions for PutObject',
    }
  }

  if (combined.includes('NoSuchBucket')) {
    return { status: 503, message: 'AWS S3 bucket not found' }
  }

  if (combined.includes('avatar_s3_key') || combined.includes('column')) {
    return {
      status: 503,
      message: 'Database schema is outdated — run db:migrate on the API server',
    }
  }

  return { status: 500, message: 'Upload failed' }
}
