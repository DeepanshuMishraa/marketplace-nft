import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import type { Shaft } from '../../../shaft/target/types/shaft'

export interface ListNftResult {
  transactionSignature: string
}

export async function ListNft(wallet: anchor.Wallet, price: number, mintAddress: string): Promise<ListNftResult> {
  try {
    const program = anchor.workspace.Shaft as Program<Shaft>

    const transactionSignature = await program.methods
      .listNft(new anchor.BN(price))
      .accountsPartial({
        maker: wallet.publicKey,
        mintNft: new anchor.web3.PublicKey(mintAddress),
      })
      .signers([wallet.payer])
      .rpc()

    return {
      transactionSignature,
    }
  } catch (error) {
    throw new Error(`Failed to list NFT: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
