import { Router, type Request, type Response } from 'express'
import { uploadNFTAssetsToS3 } from '../lib/nft-storage'
import { db } from '../lib/db'
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

nftRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({
        message: 'Invalid ID',
      })
    }

    const nft = await db.nFT.findUnique({
      where: {
        id,
      },
    })

    if (!nft) {
      return res.status(404).json({
        message: 'NFT not found',
      })
    }

    const owner = await db.user.findUnique({
      where: {
        id: nft.ownerId,
      },
    })

    return res.status(200).json({
      message: 'NFT retrieved successfully',
      nft: {
        ...nft,
        price: Number(nft.price) / 1_000_000_000,
      },
      owner,
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

nftRouter.post('/buy/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { pubKey, transactionSignature } = req.body

    if (!pubKey || !transactionSignature) {
      return res.status(400).json({
        message: 'Public key and transaction signature are required',
      })
    }

    const user = await db.user.findUnique({
      where: {
        publicKey: pubKey,
      },
    })

    if (!user) {
      return res.status(400).json({
        message: 'User not found, Connect your wallet first',
      })
    }

    const nft = await db.nFT.findUnique({
      where: {
        id,
      },
    })

    if (!nft) {
      return res.status(404).json({
        message: 'NFT not found',
      })
    }

    if (!nft.listed) {
      return res.status(400).json({
        message: 'NFT is not listed for sale',
      })
    }

    if (user.id === nft.ownerId) {
      return res.status(400).json({
        message: 'You cannot buy your own NFT',
      })
    }

    const updatedNft = await db.nFT.update({
      where: {
        id,
      },
      data: {
        ownerId: user.id,
        listed: false,
      },
    })

    return res.status(200).json({
      message: 'NFT bought successfully',
      nft: {
        ...updatedNft,
        price: Number(updatedNft.price) / 1_000_000_000,
      },
      owner: user,
      transactionSignature,
    })
  } catch (err) {
    return res.status(500).json({
      message: 'Internal server error',
      error: err instanceof Error ? err.message : 'Unknown error',
    })
  }
})
