import { z } from 'zod'

export const connectSchema = z.object({
  pubKey: z
    .string()
    .min(44, 'Public Key must be exactly 44 characters')
    .max(44, 'Public Key must be exactly 44 characters'),
})

export const metadataSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  symbol: z.string().min(1).max(10),
})

export const ListNFTSchema = z.object({
  pubKey: z.string().min(44).max(44),
  mintAddress: z.string().min(32),
  price: z.coerce.number().positive(),
  title: z.string().min(1).max(100),
  symbol: z.string().min(1).max(10),
  metadataUri: z.string().url(),
  imageUrl: z.string().url(),
  transactionSignature: z.string().min(32),
})
