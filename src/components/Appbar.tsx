import Link from 'next/link'
import { ModeSwitcher } from './theme-select'
import { github } from '@/lib/links'
import { GithubLink } from './github-link'
import { WalletConnectButton } from './wallet-connect'

export const Appbar = () => {
  return (
    <div className="flex items-center justify-between p-4 ml-4">
      <Link prefetch href="/" className="text-xl font-semibold">
        Shaft
      </Link>
      <div className="items-center flex justify-center gap-2">
        <WalletConnectButton />
        <ModeSwitcher />
        <Link href={`${github}`}>
          <GithubLink />
        </Link>
      </div>
    </div>
  )
}
