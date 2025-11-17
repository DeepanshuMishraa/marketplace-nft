import { z } from 'zod'

export const connectSchema = z.object({
  pubKey: z
    .string()
    .min(44, 'Public Key must be exactly 44 characters')
    .max(44, 'Public Key must be exactly 44 characters')
})

export const createNFTSchema = z.object({
  title: z.string().min(1, 'Title Is Too Short').max(100, 'Title Is Too Long'),
  description: z.string().min(1, 'Description Is Too Short').max(500, 'Description Is Too Long'),
  symbol: z.string().min(1, 'Symbol Is Too Short').max(10, 'Symbol Is Too Long'),
  image: z.any().refine((file) => file && file.buffer && file.buffer.length > 0, 'Image must be a file'),
  price: z.coerce.number().positive('Price must be greater than 0').max(1000000000, 'Price is too large'),
  pubKey: z
    .string()
    .min(44, 'Public Key must be exactly 44 characters')
    .max(44, 'Public Key must be exactly 44 characters')
})
