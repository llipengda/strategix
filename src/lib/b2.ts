'use server'

import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const b2Client = new S3Client({
  region: process.env.B2_REGION,
  endpoint: `https://s3.${process.env.B2_REGION}.backblazeb2.com`,
  credentials: {
    accessKeyId: process.env.B2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.B2_SECRET_ACCESS_KEY!
  }
})

export const upload = async (file: File, prefix: string = '') => {
  const _prefix = prefix === '' ? '' : `${prefix}/`

  const command = new PutObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME,
    Key: `${_prefix}${file.name}`,
    ContentType: file.type,
    Body: new Uint8Array(await file.arrayBuffer())
  })
  const res = await b2Client.send(command)
  return res
}

export const uploadFiles = async (files: File[], prefix: string = '') => {
  return await Promise.all(files.map(file => upload(file, prefix)))
}

export const generateSignedUrl = async (
  key: string,
  download: boolean = false
) => {
  const command = new GetObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME,
    Key: key,
    ResponseContentDisposition: download
      ? `attachment; filename="${key}"`
      : undefined
  })

  const signedUrl = await getSignedUrl(b2Client, command, {
    expiresIn: 60 * 60 * 24 * 7
  })

  return signedUrl
}
