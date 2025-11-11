'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { UploadZone } from './uploadzone'
import { Plus, X } from 'lucide-react'
import Image from 'next/image'

interface Trait {
  id: string
  type: string
  value: string
}

export function Create() {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [traits, setTraits] = useState<Trait[]>([])

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

  const addTrait = () => {
    setTraits([...traits, { id: Date.now().toString(), type: '', value: '' }])
  }

  const updateTrait = (id: string, field: 'type' | 'value', value: string) => {
    setTraits(traits.map((trait) => (trait.id === id ? { ...trait, [field]: value } : trait)))
  }

  const removeTrait = (id: string) => {
    setTraits(traits.filter((trait) => trait.id !== id))
  }

  const handleCreate = () => {
    console.log({ title, description, price, traits, imageFile })
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
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <label className="text-foreground">Traits</label>
                <button
                  onClick={addTrait}
                  className="flex items-center gap-2 px-4 py-1.5 border border-border hover:border-foreground transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Trait
                </button>
              </div>

              <div className="space-y-3">
                {traits.map((trait) => (
                  <div key={trait.id} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={trait.type}
                      onChange={(e) => updateTrait(trait.id, 'type', e.target.value)}
                      placeholder="Type"
                      className="flex-1 px-4 py-2 bg-transparent border border-border focus:border-foreground outline-none transition-colors text-sm text-foreground placeholder:text-muted-foreground"
                    />
                    <input
                      type="text"
                      value={trait.value}
                      onChange={(e) => updateTrait(trait.id, 'value', e.target.value)}
                      placeholder="Value"
                      className="flex-1 px-4 py-2 bg-transparent border border-border focus:border-foreground outline-none transition-colors text-sm text-foreground placeholder:text-muted-foreground"
                    />
                    <button
                      onClick={() => removeTrait(trait.id)}
                      className="p-2 border border-border hover:border-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
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

                {traits.length > 0 && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-3">Traits</p>
                    <div className="flex flex-wrap gap-2">
                      {traits.map(
                        (trait) =>
                          trait.type &&
                          trait.value && (
                            <div key={trait.id} className="px-3 py-1.5 border border-border">
                              <p className="text-xs text-muted-foreground">{trait.type}</p>
                              <p className="text-sm text-foreground">{trait.value}</p>
                            </div>
                          ),
                      )}
                    </div>
                  </div>
                )}
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
