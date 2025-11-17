import { Router, type Request, type Response } from 'express'
import { createNFTSchema } from '../lib/types'
import { uploadNFTAssetsToS3 } from '../lib/nft-storage'
import { db } from '../lib/db'
import { ListNft } from '../lib/nft-actions'
import { mintNFT } from '../lib/mint'
import * as anchor from '@coral-xyz/anchor'

export const nftRouter = Router()

nftRouter.post('/list', async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'Image file is required',
      })
    }
    const {
      data,
      success,
      error: validationError,
    } = createNFTSchema.safeParse({
      ...req.body,
      image: req.file,
    })

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

    let uploadedAssets
    try {
      uploadedAssets = await uploadNFTAssetsToS3(req.file as any, data.title, data.description, data.symbol)
    } catch (uploadError) {
      console.error('S3 upload failed:', uploadError)
      return res.status(500).json({
        message: 'Failed to upload NFT assets to storage',
        error: uploadError instanceof Error ? uploadError.message : 'Unknown error',
      })
    }

    let mintAddress
    try {
      const program = anchor.workspace.Shaft
      if (!program) {
        throw new Error('Anchor program not initialized')
      }

      mintAddress = await mintNFT(
        wallet.publicKey,
        data.title,
        data.symbol,
        uploadedAssets.metadataUrl,
      )
    } catch (mintError) {
      console.error('NFT minting failed:', mintError)
      return res.status(500).json({
        message: 'Failed to mint NFT on-chain',
        error: mintError instanceof Error ? mintError.message : 'Unknown error',
      })
    }

    let listingResult
    try {
      const anchorWallet = {
        publicKey: new anchor.web3.PublicKey(wallet.publicKey),
        signTransaction: async (tx: any) => tx,
        signAllTransactions: async (txs: any[]) => txs,
      }

      listingResult = await ListNft(anchorWallet as anchor.Wallet, data.price, mintAddress.toString())
    } catch (listError) {
      console.error('NFT listing failed:', listError)
      return res.status(500).json({
        message: 'NFT minted but listing failed',
        mintAddress: mintAddress.toString(),
        error: listError instanceof Error ? listError.message : 'Unknown error',
      })
    }

    const nft = await db.nFT.create({
      data: {
        name: data.title,
        symbol: data.symbol,
        listed: true,
        ownerId: wallet.id,
        metadataUri: uploadedAssets.metadataUrl,
        mint: mintAddress.toString(),
        price: data.price,
        image: uploadedAssets.imageUrl,
      },
    })

    return res.status(201).json({
      message: 'NFT listed successfully',
      nft,
      transactionSignature: listingResult.transactionSignature,
    })
  } catch (error) {
    console.error('NFT creation error:', error)
    return res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})
