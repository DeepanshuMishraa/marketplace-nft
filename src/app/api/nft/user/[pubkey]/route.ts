import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ pubkey: string }> }
) {
  try {
    const { pubkey } = await params

    if (!pubkey) {
      return NextResponse.json(
        { message: 'Public key is required' },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({
      where: {
        publicKey: pubkey,
      },
    })

    if (!user) {
      return NextResponse.json({
        message: 'User NFTs retrieved successfully',
        nfts: [],
      })
    }

    const nfts = await db.nFT.findMany({
      where: {
        ownerId: user.id,
      },
      include: {
        owner: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const serializedNfts = nfts.map((nft) => ({
      ...nft,
      price: Number(nft.price) / 1_000_000_000,
    }))

    return NextResponse.json({
      message: 'User NFTs retrieved successfully',
      nfts: serializedNfts,
    })
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
