import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { createNft, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { toWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters'
import type { WalletContextState } from '@solana/wallet-adapter-react'

export async function mintNFT(
  wallet: WalletContextState,
  name: string,
  symbol: string,
  metadataUri: string
): Promise<string> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected')
  }

  try {
    const umi = createUmi(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com')
      .use(walletAdapterIdentity(wallet))
      .use(mplTokenMetadata())

    const mint = generateSigner(umi)

    await createNft(umi, {
      mint,
      name,
      symbol,
      uri: metadataUri,
      sellerFeeBasisPoints: percentAmount(0),
    }).sendAndConfirm(umi)

    return toWeb3JsPublicKey(mint.publicKey).toString()
  } catch (error) {
    console.error('Minting error:', error)
    if (error instanceof Error) {
      if (error.message.includes('User rejected') || error.message.includes('rejected')) {
        throw new Error('Transaction rejected by user')
      }
      throw new Error(`Failed to mint NFT: ${error.message}`)
    }
    throw new Error('Failed to mint NFT: Unknown error')
  }
}
