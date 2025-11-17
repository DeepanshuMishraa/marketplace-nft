import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import type { Shaft } from '../../../shaft/target/types/shaft'

export async function ListNft(wallet: any, price: number, mint_address: any) {
  const program = anchor.workspace.Shaft as Program<Shaft>

  await program.methods
    .listNft(new anchor.BN(price))
    .accountsPartial({
      maker: wallet.publicKey,
      mintNft: mint_address.publicKey,
    })
    .signers([])
    .rpc()
}
