import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Shaft } from '../target/types/shaft'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { createNft, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { generateSigner, keypairIdentity, percentAmount } from '@metaplex-foundation/umi'
import { fromWeb3JsKeypair, toWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters'
import { ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'
import { assert } from 'chai'

describe('shaft program test', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const program = anchor.workspace.Shaft as Program<Shaft>

  const maker = anchor.web3.Keypair.generate()
  const taker = anchor.web3.Keypair.generate()

  let mint_nft: anchor.web3.PublicKey
  let maker_ata: anchor.web3.PublicKey
  let taker_ata: anchor.web3.PublicKey
  let escrow: anchor.web3.PublicKey
  let vault: anchor.web3.PublicKey

  const price = new anchor.BN(1_000_000_000)

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

    const makerUmi = fromWeb3JsKeypair(maker)
    umi.use(keypairIdentity(makerUmi))

    const NftMint = generateSigner(umi)

    console.log(`NFT Mint Address: ${NftMint.publicKey}`)

    await createNft(umi, {
      mint: NftMint,
      name: 'TESTX',
      symbol: 'TXST',
      uri: 'https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/nft.json',
      sellerFeeBasisPoints: percentAmount(0),
      creators: [
        {
          address: makerUmi.publicKey,
          verified: true,
          share: 100,
        },
      ],
    }).sendAndConfirm(umi)

    console.log(`NFT Created`)

    mint_nft = toWeb3JsPublicKey(NftMint.publicKey)

    maker_ata = getAssociatedTokenAddressSync(
      mint_nft,
      maker.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    )

    const balance = await program.provider.connection.getTokenAccountBalance(maker_ata)
    console.log(`Before balance: ${balance.value.amount}`)
    assert.equal(balance.value.amount, '1', 'Maker should have 1 NFT')

    escrow = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('escrow'), maker.publicKey.toBuffer(), mint_nft.toBuffer()],
      program.programId,
    )[0]

    vault = getAssociatedTokenAddressSync(mint_nft, escrow, true, TOKEN_2022_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID)

    console.log(`Escrow: ${escrow.toBase58()}`)
    console.log(`Vault: ${vault.toBase58()}`)

    const tx = await program.methods
      .listNft(price)
      .accountsPartial({
        maker: maker.publicKey,
        mintNft: mint_nft,
        makerAtaNft: maker_ata,
        escrow: escrow,
        vaultNft: vault,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([maker])
      .rpc()

    console.log(`Transaction: ${tx}`)

    const escrowAccount = await program.account.escrow.fetch(escrow)
    console.log(`Escrow maker: ${escrowAccount.maker.toBase58()}`)
    console.log(`Escrow mint: ${escrowAccount.mintNft.toBase58()}`)
    console.log(`Escrow price: ${escrowAccount.price.toString()}`)

    assert.ok(escrowAccount.maker.equals(maker.publicKey))
    assert.ok(escrowAccount.mintNft.equals(mint_nft))
    assert.ok(escrowAccount.price.eq(price))

    const vaultBalance = await program.provider.connection.getTokenAccountBalance(vault)
    console.log(`Vault balance: ${vaultBalance.value.amount}`)
    assert.equal(vaultBalance.value.amount, '1')

    const makerBalanceAfter = await program.provider.connection.getTokenAccountBalance(maker_ata)
    console.log(`After balance: ${makerBalanceAfter.value.amount}`)
    assert.equal(makerBalanceAfter.value.amount, '0')

    console.log(`Done`)
  })
})
