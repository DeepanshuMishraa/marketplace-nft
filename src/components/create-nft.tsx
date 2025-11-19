'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { useMutation } from '@tanstack/react-query'
import { useWallet } from '@solana/wallet-adapter-react'
import { UploadZone } from './uploadzone'
import Image from 'next/image'
import { api } from '@/lib/axios'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { mintNFT } from '@/lib/mint-nft'
import { listNFT } from '@/lib/list-nft'
import { useAnchorProvider } from './solana/solana-provider'
import { useRouter } from 'next/navigation'

interface UploadResponse {
  message: string
  metadataUri: string
  imageUrl: string
}

interface ListNFTResponse {
  message: string
  nft: {
    id: string
    name: string
    symbol: string
    mint: string
    price: number
    image: string
    metadataUri: string
  }
  transactionSignature: string
}

export function Create() {
  const wallet = useWallet()
  const { publicKey, connected } = wallet
  const provider = useAnchorProvider()
  const router = useRouter()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [symbol, setSymbol] = useState('')
  const [currentStep, setCurrentStep] = useState<'idle' | 'uploading' | 'minting' | 'listing'>('idle')

  const createNFTMutation = useMutation({
    mutationFn: async () => {
      if (!publicKey) {
        throw new Error('Wallet not connected')
      }

      if (!imageFile) {
        throw new Error('Image file is required')
      }

      setCurrentStep('uploading')
      toast.loading('Uploading image and metadata...', { id: 'nft-creation' })

      const formData = new FormData()
      formData.append('image', imageFile)
      formData.append('title', title)
      formData.append('description', description)
      formData.append('symbol', symbol)

      const uploadResponse = await api.post<UploadResponse>('/api/nft/upload', formData)
      const { metadataUri, imageUrl } = uploadResponse.data

      setCurrentStep('minting')
      toast.loading('Please approve minting transaction in your wallet...', { id: 'nft-creation' })

      const mintAddress = await mintNFT(wallet, title, symbol, metadataUri)

      toast.loading('NFT minted! Now listing on marketplace...', { id: 'nft-creation' })

      setCurrentStep('listing')
      toast.loading('Please approve listing transaction in your wallet...', { id: 'nft-creation' })

      const transactionSignature = await listNFT(provider, mintAddress, parseFloat(price))

      toast.loading('Saving NFT to database...', { id: 'nft-creation' })

      const listResponse = await api.post<ListNFTResponse>('/api/nft/list', {
        pubKey: publicKey.toString(),
        mintAddress,
        price: parseFloat(price),
        title,
        symbol,
        metadataUri,
        imageUrl,
        transactionSignature,
      })

      return listResponse.data
    },
    onSuccess: (data) => {
      setCurrentStep('idle')
      toast.success('NFT created and listed successfully!', {
        id: 'nft-creation',
        description: `Mint: ${data.nft.mint.substring(0, 10)}...`,
      })

      router.push(`/nft/${data.nft.id}`)

      setImageFile(null)
      setImagePreview(null)
      setTitle('')
      setDescription('')
      setPrice('')
      setSymbol('')
    },
    onError: (error) => {
      setCurrentStep('idle')
      if (error instanceof Error) {
        toast.error('Failed to create NFT', {
          id: 'nft-creation',
          description: error.message,
        })
      } else {
        toast.error('An unexpected error occurred', { id: 'nft-creation' })
      }
    },
  })

  const handleImageChange = (file: File | null) => {
    setImageFile(file)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  const handleCreate = () => {
    if (!connected) {
      toast.error('Please connect your wallet first')
      return
    }

    const priceNum = parseFloat(price)
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid price')
      return
    }

    if (!title.trim()) {
      toast.error('Please enter a title')
      return
    }

    if (!symbol.trim()) {
      toast.error('Please enter a symbol')
      return
    }

    createNFTMutation.mutate()
  }

  const isLoading = createNFTMutation.isPending

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <main className="max-w-7xl mx-auto px-6 pt-10 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1
            className="tracking-tight mb-4"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              lineHeight: '1.1',
              letterSpacing: '-0.02em',
            }}
          >
            Create
          </h1>
          <p className="text-muted-foreground max-w-2xl" style={{ fontSize: '1.125rem', lineHeight: '1.6' }}>
            Upload your artwork and set the details for your NFT listing.
          </p>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-8"
          >
            <div>
              <label className="block mb-4 text-foreground">Artwork</label>
              <UploadZone onImageChange={handleImageChange} preview={imagePreview} />
            </div>
            <div>
              <label className="block mb-3 text-foreground">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter artwork title"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-transparent border border-border focus:border-foreground outline-none transition-colors text-foreground placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block mb-3 text-foreground">Symbol</label>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="Enter symbol for your nft"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-transparent border border-border focus:border-foreground outline-none transition-colors text-foreground placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block mb-3 text-foreground">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your artwork"
                rows={4}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-transparent border border-border focus:border-foreground outline-none transition-colors resize-none text-foreground placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block mb-3 text-foreground">Price</label>
              <div className="relative">
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  disabled={isLoading}
                  className="w-full px-4 py-3 pr-16 bg-transparent border border-border focus:border-foreground outline-none transition-colors text-foreground placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">SOL</span>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:sticky lg:top-32 lg:self-start"
          >
            <div className="mb-6">
              <p className="text-foreground mb-1">Preview</p>
              <p className="text-sm text-muted-foreground">This is how your NFT will appear on Shaft</p>
            </div>
            <div className="border border-border p-6 space-y-6">
              <div className="relative overflow-hidden bg-muted aspect-square border border-border">
                {imagePreview ? (
                  <Image
                    width={400}
                    height={400}
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <p className="text-muted-foreground">No image uploaded</p>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground truncate">{title || 'Untitled'}</p>
                    <p className="text-sm text-muted-foreground truncate">{description || 'No description'}</p>
                  </div>
                  <p className="text-foreground whitespace-nowrap">{price ? `${price} SOL` : '—'}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleCreate}
              disabled={!imageFile || !title || !price || !connected || isLoading}
              className="w-full mt-6 px-8 py-3 bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  <span>
                    {currentStep === 'uploading' && 'Uploading assets...'}
                    {currentStep === 'minting' && 'Waiting for signature...'}
                    {currentStep === 'listing' && 'Listing on marketplace...'}
                  </span>
                </>
              ) : (
                'Create NFT'
              )}
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
