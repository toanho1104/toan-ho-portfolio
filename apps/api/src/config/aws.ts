const REQUIRED_AWS_ENV = ['AWS_REGION', 'AWS_S3_BUCKET'] as const

export function getAwsConfig() {
  const region = process.env.AWS_REGION
  const bucket = process.env.AWS_S3_BUCKET

  const missing = REQUIRED_AWS_ENV.filter((key) => !process.env[key])
  if (missing.length > 0) {
    throw new Error(`Missing AWS env: ${missing.join(', ')}`)
  }

  return {
    region: region!,
    bucket: bucket!,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
}

export function isAwsConfigured() {
  return REQUIRED_AWS_ENV.every((key) => Boolean(process.env[key]))
}
