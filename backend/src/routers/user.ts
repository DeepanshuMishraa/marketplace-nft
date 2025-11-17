import { Router } from 'express'
import { db } from '../lib/db'
import { connectSchema } from '../lib/types'

export const userRouter = Router()

userRouter.post('/connect', async (req, res) => {
  try {
    const { success, data } = connectSchema.safeParse(req.body)

    if (!success) {
      res.status(400).json({
        message: 'Invaild request body',
      })
      return
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

      return res.status(200).json({
        message: 'Wallet connected successfully',
        id: newUser.id,
      })
    }

    return res.status(200).json({
      message: 'Wallet already connected',
      id: user.id,
    })
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error',
    })
  }
})

userRouter.post('/webhook', async (req, res) => {
  const data = req.body

  if (!Array.isArray(data)) {
    console.error('Invalid webhook payload')
    return res.status(400).json({ error: 'Invalid payload' })
  }
  
  for(const event of data){
    if (event.type === "PROGRAM_INVOKE" && event.programId === process.env.PROGRAM_ID) {
      console.log("Program invoked:", event);
      const ix = event.instructions?.[0];
      if (!ix) continue;

      const decoded = Buffer.from(ix.data, "base64").toString("hex");
      console.log("Decoded IX Data:", decoded);
    }
  }
})
