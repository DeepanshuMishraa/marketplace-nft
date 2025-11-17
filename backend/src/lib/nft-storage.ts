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
const GATEWAY_URL = process.env.FILEBASE_GATEWAY_URL || 'https://spiritual-peach-trout.myfilebase.com'

async function getCIDFromKey(key: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const headResult = await s3.headObject({ Bucket: BUCKET, Key: key }).promise()
  
  if (headResult.Metadata && headResult.Metadata['cid']) {
    return headResult.Metadata['cid']
  }
  
  const listResult = await s3.listObjectsV2({
    Bucket: BUCKET,
    Prefix: key,
    MaxKeys: 1,
  }).promise()

  if (listResult.Contents && listResult.Contents.length > 0) {
    const obj = listResult.Contents[0]
    if (obj?.ETag) {
      return obj.ETag.replace(/"/g, '')
    }
  }
  
  throw new Error('Could not retrieve CID from uploaded file')
}

export async function uploadImageToS3(file: Express.Multer.File) {
  const buffer = file.buffer

  const fileExt = file.originalname.split('.').pop() || 'png'
  const key = `${randomUUID()}.${fileExt}`

  const params = {
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: file.mimetype || 'image/png',
  }

  await s3.putObject(params).promise()

  const cid = await getCIDFromKey(key)

  return `${GATEWAY_URL}/ipfs/${cid}`
}

export async function uploadMetadataToS3(metadata: any) {
  const key = `${randomUUID()}.json`

  const params = {
    Bucket: BUCKET,
    Key: key,
    Body: JSON.stringify(metadata),
    ContentType: 'application/json',
  }

  await s3.putObject(params).promise()

  const cid = await getCIDFromKey(key)

  return `${GATEWAY_URL}/ipfs/${cid}`
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
