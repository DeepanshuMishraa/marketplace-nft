import { z } from 'zod'

export const connectSchema = z.object({
  pubKey: z.string().min(1, 'Public Key Is Too Short').max(50, 'Public Key Is Too Long'),
})
