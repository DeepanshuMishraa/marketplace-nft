import { z } from 'zod'

// Regex to validate Solana public key format (Base58 encoded, 44 chars)
const SOLANA_PUBLIC_KEY_REGEX = /^[1-9A-HJ-NP-Z]{44}$/

export const connectSchema = z.object({
  pubKey: z
    .string()
    .min(44, 'Public Key must be exactly 44 characters')
    .max(44, 'Public Key must be exactly 44 characters')
    .regex(SOLANA_PUBLIC_KEY_REGEX, 'Invalid Solana public key format'),
})

export const createNFTSchema = z.object({
  title: z.string().min(1, 'Title Is Too Short').max(100, 'Title Is Too Long'),
  description: z.string().min(1, 'Description Is Too Short').max(500, 'Description Is Too Long'),
  symbol: z.string().min(1, 'Symbol Is Too Short').max(10, 'Symbol Is Too Long'),
  image: z.instanceof(File, { message: 'Image must be a file' }).refine((file) => file.size > 0, 'Image file is empty'),
  price: z.number().positive('Price must be greater than 0').max(1000000000, 'Price is too large'),
  pubKey: z
    .string()
    .min(44, 'Public Key must be exactly 44 characters')
    .max(44, 'Public Key must be exactly 44 characters')
    .regex(SOLANA_PUBLIC_KEY_REGEX, 'Invalid Solana public key format'),
})
