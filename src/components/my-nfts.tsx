'use client'
import { motion } from 'motion/react'
import { NFTCard } from './nft-card'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { useWallet } from '@solana/wallet-adapter-react'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

interface NFT {
  id: string
  name: string
  symbol: string
  mint: string
  image: string
  price: number
  listed: boolean
  owner: {
    publicKey: string
  }
}

interface NFTResponse {
  message: string
  nfts: NFT[]
}

export function MyNFTs() {
  const { publicKey, connected } = useWallet()

  const { data, isLoading, error } = useQuery({
    queryKey: ['user-nfts', publicKey?.toString()],
    queryFn: async () => {
      if (!publicKey) throw new Error('Wallet not connected')
      const response = await api.get<NFTResponse>(`/api/nft/user/${publicKey.toString()}`)
      return response.data
    },
    enabled: !!publicKey && connected,
  })

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <main className="max-w-7xl mx-auto px-6 pt-8 pb-20">
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
            My Collection
          </h1>
          <p className="text-muted-foreground max-w-2xl" style={{ fontSize: '1.125rem', lineHeight: '1.6' }}>
            View and manage your digital art collection.
          </p>
        </motion.div>

        {!connected && (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">Please connect your wallet to view your NFTs</p>
          </div>
        )}

        {connected && isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {connected && error && (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">Failed to load your NFTs</p>
          </div>
        )}

        {connected && data && data.nfts.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">You don't have any NFTs yet</p>
              <Link href="/create" className="px-6 py-3 bg-foreground text-background hover:bg-foreground/90 transition-colors inline-block">
                Create your first NFT
              </Link>
            </div>
          </div>
        )}

        {connected && data && data.nfts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
