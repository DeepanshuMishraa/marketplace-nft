import express from 'express'
import cors from 'cors'
import { userRouter } from './routers/user'
import { webhookRouter } from './routers/webhook'

const PORT = process.env.PORT

const app = express()
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
)
app.use(express.json())

app.use('/api/user', userRouter)
app.use("/api/webhook",webhookRouter)

app.get('/health', (req, res) => {
  return res.status(200).json({
    message: 'OK',
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
