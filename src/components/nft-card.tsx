'use client'

import { motion } from 'motion/react'
import Image from 'next/image'

interface NFTCardProps {
  id: string
  image: string
  title: string
  artist: string
  price: string
  index: number
}

export function NFTCard({ image, title, artist, price, index }: NFTCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden bg-muted aspect-square border border-border group-hover:border-foreground transition-colors duration-300">
        <Image src={image} alt={title} width={400} height={400} className="w-full h-full object-cover" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-foreground truncate">{title}</p>
            <p className="text-sm text-muted-foreground truncate">{artist}</p>
          </div>
          <p className="text-foreground whitespace-nowrap">{price}</p>
        </div>
      </div>
    </motion.div>
  )
}
