'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { UploadZone } from './uploadzone'
import Image from 'next/image'

export function Create() {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [symbol, setSymbol] = useState('')

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
    console.log({ title, description, price, symbol, imageFile })
  }

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
                className="w-full px-4 py-3 bg-transparent border border-border focus:border-foreground outline-none transition-colors text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <label className="block mb-3 text-foreground">Symbol</label>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="Enter symbol for your nft"
                className="w-full px-4 py-3 bg-transparent border border-border focus:border-foreground outline-none transition-colors text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <label className="block mb-3 text-foreground">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your artwork"
                rows={4}
                className="w-full px-4 py-3 bg-transparent border border-border focus:border-foreground outline-none transition-colors resize-none text-foreground placeholder:text-muted-foreground"
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
                  className="w-full px-4 py-3 pr-16 bg-transparent border border-border focus:border-foreground outline-none transition-colors text-foreground placeholder:text-muted-foreground"
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
              disabled={!imageFile || !title || !price}
              className="w-full mt-6 px-8 py-3 bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create NFT
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
