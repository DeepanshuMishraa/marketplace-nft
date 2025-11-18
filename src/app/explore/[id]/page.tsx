import { NFTDetail } from '@/components/nft-detail'

export default function ExplorePage({ params }: { params: { id: string } }) {
  const { id } = params
  return <NFTDetail id={id} />
}
