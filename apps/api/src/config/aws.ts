const REQUIRED_AWS_ENV = ['AWS_REGION', 'AWS_S3_BUCKET'] as const

export function hasAwsCredentials() {
  return Boolean(
    process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY,
  )
}

export function getAwsConfig() {
  const region = process.env.AWS_REGION
  const bucket = process.env.AWS_S3_BUCKET

  const missing = REQUIRED_AWS_ENV.filter((key) => !process.env[key])
  if (missing.length > 0) {
    throw new Error(`Missing AWS env: ${missing.join(', ')}`)
  }

  if (!hasAwsCredentials()) {
    throw new Error('AWS credentials are not configured')
  }

  return {
    region: region!,
    bucket: bucket!,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }
}

export function isAwsConfigured() {
  return (
    REQUIRED_AWS_ENV.every((key) => Boolean(process.env[key])) &&
    hasAwsCredentials()
  )
}

export function getAwsStorageStatus() {
  const region = process.env.AWS_REGION ?? null
  const bucket = process.env.AWS_S3_BUCKET ?? null
  const credentials = hasAwsCredentials()

  if (!region || !bucket) {
    return {
      ready: false,
      reason: 'missing_region_or_bucket',
      region,
      bucket,
      credentials,
    }
  }

  if (!credentials) {
    return {
      ready: false,
      reason: 'missing_credentials',
      region,
      bucket,
      credentials,
    }
  }

  return {
    ready: true,
    reason: null,
    region,
    bucket,
    credentials,
  }
}
