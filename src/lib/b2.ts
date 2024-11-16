'use server'

import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { auth } from '@/auth'

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

  const user = (await auth())?.user

  if (!user) {
    throw new Error('用户未登录')
  }

  const key = `${_prefix}${user.id}/${file.name}`

  const command = new PutObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME,
    Key: key,
    ContentType: file.type,
    Body: new Uint8Array(await file.arrayBuffer())
  })

  try {
    await b2Client.send(command)
  } catch (error) {
    console.error(error)
    throw new Error('上传失败')
  }

  return key
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
