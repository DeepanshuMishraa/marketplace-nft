import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { userRouter } from './routers/user'
import { webhookRouter } from './routers/webhook'
import { nftRouter } from './routers/nft'

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'

if (!process.env.PORT) {
  console.warn('Warning: PORT not set in environment, using default 3000')
}
if (!process.env.CLIENT_URL) {
  console.warn('Warning: CLIENT_URL not set in environment, using default http://localhost:3000')
}

const app = express()
const upload = multer({ storage: multer.memoryStorage() })

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
)
app.use(express.json())
app.use(upload.single('image'))

app.use('/api/user', userRouter)
app.use('/api/webhook', webhookRouter)
app.use('/api/nft', nftRouter)

app.get('/health', (req, res) => {
  return res.status(200).json({
    message: 'OK',
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
