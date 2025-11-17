import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Shaft } from '../target/types/shaft'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { createNft, mplTokenMetadata, transferV1 } from '@metaplex-foundation/mpl-token-metadata'
import { generateSigner, keypairIdentity, percentAmount } from '@metaplex-foundation/umi'
import { getAccount, getAssociatedTokenAddressSync } from '@solana/spl-token'
import { fromWeb3JsKeypair, toWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters'

describe('Shaft Test', () => {
  const provider = new anchor.AnchorProvider(
    new anchor.web3.Connection('https://api.devnet.solana.com', 'confirmed'),
    anchor.Wallet.local(),
    { commitment: 'confirmed' },
  )
  anchor.setProvider(provider)

  const program = anchor.workspace.Shaft as Program<Shaft>

  let maker = anchor.web3.Keypair.generate()
  let taker = anchor.web3.Keypair.generate()

  let mint_nft: anchor.web3.PublicKey
  let escrow: anchor.web3.PublicKey

  let maker_ata: anchor.web3.PublicKey
  let taker_ata: anchor.web3.PublicKey

  const PRICE = 1 * anchor.web3.LAMPORTS_PER_SOL
  const umi = createUmi('https://api.devnet.solana.com')
  umi.use(mplTokenMetadata())

  before('Airdrop and mint nft', async () => {
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(maker.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL),
      'confirmed',
    )

    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(taker.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL),
      'confirmed',
    )

    const makerUmi = fromWeb3JsKeypair(maker)
    umi.use(keypairIdentity(makerUmi))

    const assetSigner = generateSigner(umi)

    const result = await createNft(umi, {
      mint: assetSigner,
      name: 'TEST',
      symbol: 'TEST',
      uri: '',
      sellerFeeBasisPoints: percentAmount(0),
      creators: [
        {
          address: makerUmi.publicKey,
          verified: true,
          share: 100,
        },
      ],
    }).sendAndConfirm(umi)

    mint_nft = toWeb3JsPublicKey(assetSigner.publicKey)

    console.log(`NFT Created`)

    const signature = Buffer.from(result.signature).toString('base64')
    console.log('Transaction signature:', signature)

    maker_ata = getAssociatedTokenAddressSync(mint_nft, maker.publicKey, false)
  })

  it('List the nft', async () => {
    ;[escrow] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('escrow'), maker.publicKey.toBuffer(), mint_nft.toBuffer()],
      program.programId,
    )

    const vault_ata = getAssociatedTokenAddressSync(mint_nft, escrow, true)

    await program.methods
      .listNft(new anchor.BN(PRICE))
      .accounts({
        maker: maker.publicKey,
        mintNft: mint_nft,
      })
      .signers([maker])
      .rpc()

    const vault_account = await getAccount(provider.connection, vault_ata)

    if (Number(vault_account.amount) !== 1) {
      throw new Error('Vault does NOT hold the NFT')
    }
  })
})
