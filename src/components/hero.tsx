'use client'

import { motion } from 'motion/react'
import { ArrowRight, TrendingUp, Users, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

interface NFT {
  id: string
  name: string
  symbol: string
  mint: string
  ownerId: string
  image: string
  metadataUri: string
  listed: boolean
  price: number
  createdAt: string
  owner: {
    id: string
    publicKey: string
    createdAt: string
  }
}

export function Hero() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['featuredArtworks'],
    queryFn: async () => {
      const response = await api.get<{ message: string; nfts: NFT[] }>('/api/nft/all')
      return response.data.nfts
    },
  })
  const featuredArtworks = data?.slice(0, 3) || []
  return (
    <section className="min-h-screen bg-background dark:bg-background">
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-block px-4 py-1.5 border border-border mb-8">
                <p className="text-sm text-muted-foreground">Curated NFT Marketplace</p>
              </div>

              <h1
                className="tracking-tight mb-6"
                style={{
                  fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                  lineHeight: '1.1',
                  letterSpacing: '-0.02em',
                }}
              >
                Discover and collect extraordinary digital art
              </h1>

              <p className="text-muted-foreground mb-10 max-w-md" style={{ fontSize: '1.125rem', lineHeight: '1.7' }}>
                A carefully curated marketplace connecting visionary artists with discerning collectors. Every piece
                tells a story.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-16">
                <Link prefetch href="/explore">
                  <button className="group px-8 py-3 bg-foreground text-background hover:bg-foreground/90 transition-all flex items-center gap-2">
                    Start Exploring
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
                <Link prefetch href="/create">
                  <button className="px-8 py-3 border border-border hover:border-foreground transition-colors">
                    Create & Sell
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
          <div className="relative">
            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <p className="text-muted-foreground">Loading NFTs...</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-96">
                <p className="text-muted-foreground">Failed to load NFTs</p>
              </div>
            ) : featuredArtworks.length === 0 ? (
              <div className="flex items-center justify-center h-96">
                <p className="text-muted-foreground">No NFTs available yet</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="col-span-2 group cursor-pointer">
                  <div className="relative overflow-hidden bg-muted aspect-[16/10] border border-border">
                    <Image
                      src={featuredArtworks[0].image}
                      alt={featuredArtworks[0].name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <p className="mb-1">{featuredArtworks[0].name}</p>
                        <p className="text-sm opacity-80">
                          {featuredArtworks[0].owner.publicKey.slice(0, 8)}...
                          {featuredArtworks[0].owner.publicKey.slice(-4)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-foreground">{featuredArtworks[0].name}</p>
                      <p className="text-sm text-muted-foreground">
                        {featuredArtworks[0].owner.publicKey.slice(0, 8)}...
                        {featuredArtworks[0].owner.publicKey.slice(-4)}
                      </p>
                    </div>
                    <p className="text-foreground">{featuredArtworks[0].price.toFixed(2)} SOL</p>
                  </div>
                </div>
                {featuredArtworks.slice(1).map((artwork, index) => (
                  <motion.div
                    key={artwork.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative overflow-hidden bg-muted aspect-square border border-border">
                      <Image
                        src={artwork.image}
                        alt={artwork.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-foreground">{artwork.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{artwork.price.toFixed(2)} SOL</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute -top-4 -right-4 bg-background dark:bg-background border border-border px-6 py-3 shadow-lg"
            >
              <p className="text-xs text-muted-foreground mb-1">Trending Now</p>
              <p className="text-foreground">+47% This Week</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
