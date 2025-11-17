import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import type { Shaft } from '../../shaft/target/types/shaft'
import idl from '../../shaft/target/idl/shaft.json'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

export async function listNFT(
  provider: anchor.AnchorProvider,
  mintAddress: string,
  priceInSol: number
): Promise<string> {
  try {
    const program = new Program<Shaft>(idl as any, provider)
    const priceInLamports = priceInSol * LAMPORTS_PER_SOL

    const transactionSignature = await program.methods
      .listNft(new anchor.BN(priceInLamports))
      .accountsPartial({
        maker: provider.wallet.publicKey,
        mintNft: new anchor.web3.PublicKey(mintAddress),
      })
      .rpc()

    return transactionSignature
  } catch (error) {
    console.error('Listing error:', error)
    if (error instanceof Error) {
      if (error.message.includes('User rejected') || error.message.includes('rejected')) {
        throw new Error('Transaction rejected by user')
      }
      throw new Error(`Failed to list NFT: ${error.message}`)
    }
    throw new Error('Failed to list NFT: Unknown error')
  }
}
