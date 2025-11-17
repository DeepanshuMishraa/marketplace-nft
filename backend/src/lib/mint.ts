import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { createNft, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { toWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters'

export async function mintNFT(wallet: any, name: string, symbol: string, metadatauri: string) {
  const umi = createUmi('https://api.devnet.solana.com').use(walletAdapterIdentity(wallet)).use(mplTokenMetadata())

  const mint = generateSigner(umi)

  await createNft(umi, {
    mint,
    name,
    symbol,
    uri: metadatauri,
    sellerFeeBasisPoints: percentAmount(0),
  }).sendAndConfirm(umi)

  return toWeb3JsPublicKey(mint.publicKey)
}
