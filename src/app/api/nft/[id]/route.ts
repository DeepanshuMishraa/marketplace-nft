import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { message: 'Invalid ID' },
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

    const owner = await db.user.findUnique({
      where: {
        id: nft.ownerId,
      },
    })

    return NextResponse.json({
      message: 'NFT retrieved successfully',
      nft: {
        ...nft,
        price: Number(nft.price) / 1_000_000_000,
      },
      owner,
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