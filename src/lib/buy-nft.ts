import { WalletContextState } from '@solana/wallet-adapter-react'
import * as anchor from '@coral-xyz/anchor'
import { Program, AnchorProvider } from '@coral-xyz/anchor'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import { getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import idl from '../../shaft/target/idl/shaft.json'

const PROGRAM_ID = new PublicKey('3vsCLZj4ACRSXBqKd8DLfunaMsPG26CXBC19ApzNKksp')
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')

export async function buyNFT(wallet: WalletContextState, mintAddress: string, sellerPublicKey: string) {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected')
  }

  const connection = new Connection(
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
    'confirmed'
  )

  const provider = new AnchorProvider(
    connection,
    wallet as any,
    { commitment: 'confirmed', skipPreflight: false, preflightCommitment: 'confirmed' }
  )

  const program = new Program(idl as any, provider)

  const mint = new PublicKey(mintAddress)
  const maker = new PublicKey(sellerPublicKey)
  const taker = wallet.publicKey

  const [escrow] = PublicKey.findProgramAddressSync(
    [Buffer.from('escrow'), maker.toBuffer(), mint.toBuffer()],
    PROGRAM_ID
  )

  const takerAtaNft = getAssociatedTokenAddressSync(mint, taker, false, TOKEN_PROGRAM_ID)
  const vaultNft = getAssociatedTokenAddressSync(mint, escrow, true, TOKEN_PROGRAM_ID)

  const signature = await program.methods
    .buy()
    .accounts({
      taker,
      maker,
      mintNft: mint,
      takerAtaNft,
      escrow,
      vaultNft,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc()

  return signature
}
