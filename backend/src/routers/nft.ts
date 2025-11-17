import { Router, type Request, type Response } from 'express'
import { uploadNFTAssetsToS3 } from '../lib/nft-storage'
import { db } from '../lib/db'
import { z } from 'zod'
import { ListNFTSchema, metadataSchema } from '../lib/types'

export const nftRouter = Router()

nftRouter.post('/upload', async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'Image file is required',
      })
    }

    const { data, success, error: validationError } = metadataSchema.safeParse(req.body)

    if (!success) {
      return res.status(400).json({
        message: 'Invalid request body',
        errors: validationError?.issues,
      })
    }

    const uploadedAssets = await uploadNFTAssetsToS3(req.file, data.title, data.description, data.symbol)

    return res.status(200).json({
      message: 'Assets uploaded successfully',
      metadataUri: uploadedAssets.metadataUrl,
      imageUrl: uploadedAssets.imageUrl,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return res.status(500).json({
      message: 'Failed to upload assets',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

nftRouter.post('/list', async (req: Request, res: Response) => {
  try {
    const { data, success, error: validationError } = ListNFTSchema.safeParse(req.body)

    if (!success) {
      return res.status(400).json({
        message: 'Invalid request body',
        errors: validationError?.issues,
      })
    }

    const wallet = await db.user.findUnique({
      where: {
        publicKey: data.pubKey,
      },
    })

    if (!wallet) {
      return res.status(404).json({
        message: 'Wallet not found. Please connect your wallet first.',
      })
    }

    const priceInLamports = BigInt(Math.floor(data.price * 1_000_000_000))

    const nft = await db.nFT.create({
      data: {
        name: data.title,
        symbol: data.symbol,
        listed: true,
        ownerId: wallet.id,
        metadataUri: data.metadataUri,
        mint: data.mintAddress,
        price: priceInLamports,
        image: data.imageUrl,
      },
    })

    return res.status(201).json({
      message: 'NFT listed successfully',
      nft: {
        ...nft,
        price: Number(nft.price) / 1_000_000_000,
      },
      transactionSignature: data.transactionSignature,
    })
  } catch (error) {
    console.error('NFT listing error:', error)
    return res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

nftRouter.get('/all', async (req: Request, res: Response) => {
  try {
    const nfts = await db.nFT.findMany({
      where: {
        listed: true,
      },
      include: {
        owner: true,
      },
    })

    const serializedNfts = nfts.map((nft) => ({
      ...nft,
      price: Number(nft.price) / 1_000_000_000,
    }))

    return res.status(200).json({
      message: 'NFTs retrieved successfully',
      nfts: serializedNfts,
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})
