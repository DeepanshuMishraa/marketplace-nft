import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const nfts = await db.nFT.findMany({
      where: {
        listed: true,
      },
      include: {
        owner: true,
      },
    })

    const serializedNfts = nfts.map((nft) => ({
      ...nft,
      price: Number(nft.price) / 1_000_000_000,
    }))

    return NextResponse.json({
      message: 'NFTs retrieved successfully',
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
