import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { pubKey, transactionSignature } = body

    if (!pubKey || !transactionSignature) {
      return NextResponse.json(
        { message: 'Public key and transaction signature are required' },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({
      where: {
        publicKey: pubKey,
      },
    })

    if (!user) {
      return NextResponse.json(
        { message: 'User not found, Connect your wallet first' },
        { status: 400 }
      )
    }

    const nft = await db.nFT.findUnique({
      where: {
        id,
      },
    })

    if (!nft) {
      return NextResponse.json(
        { message: 'NFT not found' },
        { status: 404 }
      )
    }

    if (!nft.listed) {
      return NextResponse.json(
        { message: 'NFT is not listed for sale' },
        { status: 400 }
      )
    }

    if (user.id === nft.ownerId) {
      return NextResponse.json(
        { message: 'You cannot buy your own NFT' },
        { status: 400 }
      )
    }

    const updatedNft = await db.nFT.update({
      where: {
        id,
      },
      data: {
        ownerId: user.id,
        listed: false,
      },
    })

    return NextResponse.json({
      message: 'NFT bought successfully',
      nft: {
        ...updatedNft,
        price: Number(updatedNft.price) / 1_000_000_000,
      },
      owner: user,
      transactionSignature,
    })
  } catch (err) {
    return NextResponse.json(
      {
        message: 'Internal server error',
        error: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}