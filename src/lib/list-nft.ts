import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import type { Shaft } from '../../shaft/target/types/shaft'
import idl from '../../shaft/target/idl/shaft.json'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token'

export async function listNFT(
  provider: anchor.AnchorProvider,
  mintAddress: string,
  priceInSol: number
): Promise<string> {
  try {
    const program = new Program<Shaft>(idl as any, provider)
    const priceInLamports = priceInSol * LAMPORTS_PER_SOL

    const mintNft = new PublicKey(mintAddress)
    const maker = provider.wallet.publicKey

    const makerAtaNft = getAssociatedTokenAddressSync(
      mintNft,
      maker,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    )

    const [escrow] = PublicKey.findProgramAddressSync(
      [Buffer.from('escrow'), maker.toBuffer(), mintNft.toBuffer()],
      program.programId
    )

    const vaultNft = getAssociatedTokenAddressSync(
      mintNft,
      escrow,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    )

    const transactionSignature = await program.methods
      .listNft(new anchor.BN(priceInLamports))
      .accounts({
        maker,
        mintNft,
        makerAtaNft,
        escrow,
        vaultNft,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
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
