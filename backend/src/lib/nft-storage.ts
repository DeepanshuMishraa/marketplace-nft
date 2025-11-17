import AWS from 'aws-sdk'
import { randomUUID } from 'crypto'

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_ID!,
  secretAccessKey: process.env.S3_KEY!,
  endpoint: 'https://s3.filebase.com',
  region: 'us-east-1',
  signatureVersion: 'v4',
})

const BUCKET = process.env.S3_BUCKET!

export async function uploadImageToS3(file: Express.Multer.File) {
  const buffer = file.buffer

  const fileExt = file.originalname.split('.').pop() || 'png'
  const key = `nft-images/${randomUUID()}.${fileExt}`

  const params = {
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: file.mimetype || 'image/png',
    ACL: 'public-read',
  }

  await s3.putObject(params).promise()

  return `https://s3.filebase.com/${BUCKET}/${key}`
}

export async function uploadMetadataToS3(metadata: any) {
  const key = `nft-metadata/${randomUUID()}.json`

  const params = {
    Bucket: BUCKET,
    Key: key,
    Body: JSON.stringify(metadata),
    ContentType: 'application/json',
    ACL: 'public-read',
  }

  await s3.putObject(params).promise()

  return `https://s3.filebase.com/${BUCKET}/${key}`
}

export async function uploadNFTAssetsToS3(file: Express.Multer.File, name: string, description: string, symbol: string) {
  const imageUrl = await uploadImageToS3(file)

  const metadata = {
    name,
    description,
    image: imageUrl,
    symbol,
  }

  const metadataUrl = await uploadMetadataToS3(metadata)

  return {
    imageUrl,
    metadataUrl,
    metadata,
  }
}
