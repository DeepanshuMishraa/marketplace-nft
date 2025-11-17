import { Router } from 'express'

export const webhookRouter = Router()

webhookRouter.post('/helius', async (req, res) => {
  try {
    const data = req.body

    if (!Array.isArray(data)) {
      console.error('Invalid webhook payload')
      return res.status(400).json({ error: 'Invalid payload' })
    }

    for (const event of data) {
      if (event.type === 'PROGRAM_INVOKE' && event.programId === process.env.PROGRAM_ID) {
        console.log('Program invoked:', event)
        const ix = event.instructions?.[0]
        if (!ix) continue

        const decoded = Buffer.from(ix.data, 'base64').toString('hex')
        console.log('Decoded IX Data:', decoded)
      }

      if (event.type === 'TRANSFER') {
        const solChange = event.NativeTransfers?.[0]
        console.log(`Sol Transfer: ${solChange}`)
      }

      return res.status(200).json({ message: 'Webhook received' })
    }
  } catch (err) {
    console.error('Error processing webhook:', err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

