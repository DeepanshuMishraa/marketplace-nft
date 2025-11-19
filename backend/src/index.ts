import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { userRouter } from './routers/user'
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
app.use('/api/nft', nftRouter)

app.get('/health', (req, res) => {
  return res.status(200).json({
    message: 'OK',
    timestamp: new Date().toISOString(),
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  startKeepAlive()
})

function startKeepAlive() {
  const BACKEND_URL = process.env.RENDER_SERVICE_URL
  
  if (!BACKEND_URL) {
    console.log('RENDER_SERVICE_URL not set, skipping keep-alive polling')
    return
  }

  
  const PING_INTERVAL = 14 * 60 * 1000 

  console.log(`Keep-alive polling enabled: pinging ${BACKEND_URL}/health every 14 minutes`)

  setInterval(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/health`)
      const data = await response.json()
      console.log(`Keep-alive ping successful at ${data.timestamp}`)
    } catch (error) {
      console.error('Keep-alive ping failed:', error instanceof Error ? error.message : 'Unknown error')
    }
  }, PING_INTERVAL)
}
