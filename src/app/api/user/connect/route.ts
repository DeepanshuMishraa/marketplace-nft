import { db } from "@/lib/db"
import { connectSchema } from "@/lib/types"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { success, data } = connectSchema.safeParse(body)

    if (!success) {
      return NextResponse.json(
        { message: 'Invalid request body' },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({
      where: {
        publicKey: data.pubKey,
      },
    })

    if (!user) {
      const newUser = await db.user.create({
        data: {
          publicKey: data.pubKey,
        },
        select: {
          id: true,
        },
      })

      return NextResponse.json({
        message: 'Wallet connected successfully',
        id: newUser.id,
      })
    }

    return NextResponse.json({
      message: 'Wallet already connected',
      id: user.id,
    })
  } catch (err) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
