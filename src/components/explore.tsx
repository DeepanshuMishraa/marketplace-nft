'use client'

import { motion } from 'motion/react'
import { NFTCard } from './nft-card'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

interface NFT {
  id: string
  name: string
  symbol: string
  mint: string
  image: string
  price: number
  owner: {
    publicKey: string
  }
}

interface NFTResponse {
  message: string
  nfts: NFT[]
}

export function Explore() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['nfts'],
    queryFn: async () => {
      const response = await api.get<NFTResponse>('/api/nft/all')
      return response.data
    },
  })
  

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
            Explore
          </h1>
          <p className="text-muted-foreground max-w-2xl" style={{ fontSize: '1.125rem', lineHeight: '1.6' }}>
            Discover exceptional digital art from creators around the world.
          </p>
        </motion.div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">Failed to load NFTs</p>
          </div>
        )}

        {data && data.nfts.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">No NFTs listed yet</p>
          </div>
        )}

        {data && data.nfts.length > 0 && (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {data.nfts.map((nft, index) => (
              <Link key={nft.id} prefetch href={`/explore/${nft.id}`}>
                <NFTCard
                  id={nft.id}
                  image={nft.image}
                  title={nft.name}
                  artist={nft.owner.publicKey.slice(0, 4) + '...' + nft.owner.publicKey.slice(-4)}
                  price={`${nft.price} SOL`}
                  index={index}
                />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
