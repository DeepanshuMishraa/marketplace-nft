import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Shaft } from '../target/types/shaft'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { createNft, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'

describe('shaft program test', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const program = anchor.workspace.Shaft as Program<Shaft>

  const maker = anchor.web3.Keypair.generate()
  const taker = anchor.web3.Keypair.generate()

  let mint_nft = anchor.web3.PublicKey

  let maker_ata = anchor.web3.PublicKey
  let taker_ata = anchor.web3.PublicKey

  let escrow = anchor.web3.PublicKey
  let vault = anchor.web3.PublicKey

  let price = new anchor.BN(1_000_000_000)

  it('List the nft', async () => {
    await program.provider.connection.confirmTransaction(
      await program.provider.connection.requestAirdrop(maker.publicKey, anchor.web3.LAMPORTS_PER_SOL * 2),
      'confirmed',
    )

    await program.provider.connection.confirmTransaction(
      await program.provider.connection.requestAirdrop(taker.publicKey, anchor.web3.LAMPORTS_PER_SOL * 2),
      'confirmed',
    )

    console.log(`Maker is ${maker.publicKey.toBase58()}`)
    console.log(`Taker is ${taker.publicKey.toBase58()}`)

    const umi = createUmi(program.provider.connection.rpcEndpoint)
    umi.use(mplTokenMetadata())

    const NftMint = generateSigner(umi)

    console.log(`NFT Mint Address: ${NftMint.publicKey}`)

    const m = await createNft(umi, {
      mint: NftMint,
      name: 'TESTX',
      symbol: 'TXST',
      uri: '',
      sellerFeeBasisPoints: percentAmount(0),
      creators: [
        {
          address: maker.publicKey,
          verified: true,
          share: 100,
        },
      ],
    }).sendAndConfirm(umi)
    
    console.log(`NFT Created`);
    
  })
})
