import { NFTDetail } from '@/components/nft-detail'

export default async function ExplorePage({ params }: { params: { id: string } }) {
  const { id } = await params
  return <NFTDetail id={id} />
}
