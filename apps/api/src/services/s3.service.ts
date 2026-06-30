import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getAwsConfig } from '@/config/aws'

let s3Client: S3Client | null = null

function getS3Client() {
  if (s3Client) return s3Client

  const config = getAwsConfig()
  s3Client = new S3Client({
    region: config.region,
    credentials:
      config.accessKeyId && config.secretAccessKey
        ? {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
          }
        : undefined,
  })

  return s3Client
}

export const s3Service = {
  async uploadObject(key: string, body: Uint8Array, contentType: string) {
    const { bucket } = getAwsConfig()
    const client = getS3Client()

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    )
  },

  async deleteObject(key: string) {
    const { bucket } = getAwsConfig()
    const client = getS3Client()

    await client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    )
  },

  async getPresignedDownloadUrl(
    key: string,
    fileName: string,
    expiresInSeconds = 300,
  ) {
    const { bucket } = getAwsConfig()
    const client = getS3Client()

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${encodeURIComponent(fileName)}"`,
      ResponseContentType: 'application/pdf',
    })

    return getSignedUrl(client, command, { expiresIn: expiresInSeconds })
  },
}
