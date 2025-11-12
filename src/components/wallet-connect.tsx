'use client'

import { api } from '@/lib/axios'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { toast } from 'sonner'
import { useEffect } from 'react'

export const WalletConnectButton = () => {
  const { publicKey, connected } = useWallet()
  const address = publicKey?.toBase58()

  useEffect(() => {
    if (!connected || !address) return

    const syncUser = async () => {
      try {
        const res = await api.post('/api/user/connect', { pubKey: address })

        if (res.status === 200) {
          toast.success('Wallet connected successfully', {
            description: `Welcome back, ${address.slice(0, 6)}...`,
          })
        } else {
          toast.error('Failed to connect wallet', {
            description: 'Please try again later.',
          })
        }
      } catch (err: any) {
        toast.error('Failed to connect wallet', {
          description: err.message || 'Unexpected error',
        })
      }
    }

    syncUser()
  }, [connected, address])

  return <WalletMultiButton />
}
