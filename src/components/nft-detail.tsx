'use client'
import { motion } from 'motion/react'
import { Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { useWallet } from '@solana/wallet-adapter-react'

export function NFTDetail({ id }: { id: string }) {
  const { isLoading, error, data } = useQuery({
    queryKey: ['nft', id],
    queryFn: async () => {
      const response = await api.get(`/api/nft/${id}`)
      return response.data
    },
  })

  const { publicKey } = useWallet()

  const nft = data?.nft
  const owner = data?.owner

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  if (error || !nft) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-center text-lg text-red-500">An error occurred while loading the NFT.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-32 lg:self-start"
          >
            <div className="relative aspect-square w-full overflow-hidden border border-border">
              {nft.image ? (
                <img src={nft.image} alt={nft.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                  No image available
                </div>
              )}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-8"
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h1
                    className="tracking-tight mb-3"
                    style={{
                      fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                      lineHeight: '1.2',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {nft.name}
                  </h1>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors inline-block">
                    by {owner?.publicKey ? `${owner.publicKey.slice(0, 4)}...${owner.publicKey.slice(-4)}` : 'Unknown'}
                  </a>
                </div>
              </div>
            </div>
            <div className="border border-border p-6">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">Current Price</p>
                <p
                  className="tracking-tight"
                  style={{
                    fontSize: '2rem',
                    lineHeight: '1.2',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {nft.price} SOL
                </p>
              </div>

              <div className="flex gap-3">
                {owner.publicKey !== publicKey?.toString() && (
                  <button className="flex-1 px-6 py-3 bg-foreground text-background hover:bg-foreground/90 transition-colors">
                    Buy Now
                  </button>
                )}
              </div>
            </div>
            {nft.metadataUri && (
              <div className="border-t border-border pt-8">
                <h3 className="mb-4">Metadata URI</h3>
                <a
                  href={nft.metadataUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors break-all"
                  style={{ lineHeight: '1.7' }}
                >
                  {nft.metadataUri}
                </a>
              </div>
            )}
            <div className="border-t border-border pt-8">
              <h3 className="mb-6">Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <p className="text-muted-foreground">Mint Address</p>
                  <p className="text-foreground font-mono text-sm">{nft.mint}</p>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <p className="text-muted-foreground">Symbol</p>
                  <p className="text-foreground">{nft.symbol}</p>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <p className="text-muted-foreground">Blockchain</p>
                  <p className="text-foreground">Solana</p>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <p className="text-muted-foreground">Listed</p>
                  <p className="text-foreground">{nft.listed ? 'Yes' : 'No'}</p>
                </div>
                <div className="flex items-center justify-between py-3">
                  <p className="text-muted-foreground">Created</p>
                  <p className="text-foreground">{new Date(nft.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <div className="border-t border-border pt-8">
              <h3 className="mb-6">Owner</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <p className="text-muted-foreground">Public Key</p>
                  <p className="text-foreground font-mono text-sm">
                    {owner?.publicKey ? `${owner.publicKey.slice(0, 8)}...${owner.publicKey.slice(-8)}` : 'Unknown'}
                  </p>
                </div>
                {owner?.name && (
                  <div className="flex items-center justify-between py-3">
                    <p className="text-muted-foreground">Name</p>
                    <p className="text-foreground">{owner.name}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
