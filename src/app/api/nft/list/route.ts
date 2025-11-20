import { db } from "@/lib/db"
import { ListNFTSchema } from "@/lib/types"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { success, data, error: validationError } = ListNFTSchema.safeParse(body)

    if (!success) {
      return NextResponse.json(
        {
          message: 'Invalid request body',
          errors: validationError?.issues,
        },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({
      where: {
        publicKey: data.pubKey,
      },
    })

    if (!user) {
      return NextResponse.json(
        { message: 'User not found, Connect your wallet first' },
        { status: 400 }
      )
    }

    const existingNFT = await db.nFT.findUnique({
      where: {
        mint: data.mintAddress,
      },
    })

    if (existingNFT) {
      return NextResponse.json(
        { message: 'NFT already exists' },
        { status: 400 }
      )
    }

    const nft = await db.nFT.create({
      data: {
        name: data.title,
        symbol: data.symbol,
        mint: data.mintAddress,
        ownerId: user.id,
        image: data.imageUrl,
        metadataUri: data.metadataUri,
        listed: true,
        price: BigInt(Math.floor(data.price * 1_000_000_000)),
      },
    })

    return NextResponse.json({
      message: 'NFT listed successfully',
      nft: {
        ...nft,
        price: Number(nft.price) / 1_000_000_000,
      },
      transactionSignature: data.transactionSignature,
    })
  } catch (error) {
    console.error('List NFT error:', error)
    return NextResponse.json(
      {
        message: 'Failed to list NFT',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
