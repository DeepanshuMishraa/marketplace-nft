import { uploadNFTAssetsToS3 } from "@/lib/nft-storage"
import { metadataSchema } from "@/lib/types"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('image') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const symbol = formData.get('symbol') as string

    if (!file) {
      return NextResponse.json(
        { message: 'Image file is required' },
        { status: 400 }
      )
    }

    const { data, success, error: validationError } = metadataSchema.safeParse({
      title,
      description,
      symbol,
    })

    if (!success) {
      return NextResponse.json(
        {
          message: 'Invalid request body',
          errors: validationError?.issues,
        },
        { status: 400 }
      )
    }

    const uploadedAssets = await uploadNFTAssetsToS3(file, data.title, data.description, data.symbol)

    return NextResponse.json({
      message: 'Assets uploaded successfully',
      metadataUri: uploadedAssets.metadataUrl,
      imageUrl: uploadedAssets.imageUrl,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      {
        message: 'Failed to upload assets',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
