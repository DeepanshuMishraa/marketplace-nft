'use client'

import { motion } from 'motion/react'
import { ArrowRight, TrendingUp, Users, Zap } from 'lucide-react'
import Image from 'next/image'

const featuredArtworks = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1633743252577-ccb68cbdb6ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRpZ2l0YWwlMjBhcnR8ZW58MXx8fHwxNzYyODM4MzcyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Ethereal Dreams',
    artist: 'Sarah Chen',
    price: '2.5 SOL',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1732995762489-26023e91c77b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW9tZXRyaWMlMjBwYXR0ZXJuJTIwYXJ0fGVufDF8fHx8MTc2MjgzNjk3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Geometric Flow',
    artist: 'Marcus Wright',
    price: '1.8 SOL',
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1691957713140-a9a042252202?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzY3VscHR1cmV8ZW58MXx8fHwxNzYyODExOTQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Sculptural Form',
    artist: 'Alex Rivera',
    price: '3.2 SOL',
  },
]

const stats = [
  { icon: TrendingUp, label: 'Trading Volume', value: '$2.4M' },
  { icon: Users, label: 'Active Creators', value: '12.5K' },
  { icon: Zap, label: 'Artworks', value: '48K+' },
]

export function Hero() {
  return (
    <section className="min-h-screen bg-background dark:bg-background">
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-block px-4 py-1.5 border border-border mb-8">
                <p className="text-sm text-muted-foreground">Curated NFT Marketplace</p>
              </div>

              <h1
                className="tracking-tight mb-6"
                style={{
                  fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                  lineHeight: '1.1',
                  letterSpacing: '-0.02em',
                }}
              >
                Discover and collect extraordinary digital art
              </h1>

              <p className="text-muted-foreground mb-10 max-w-md" style={{ fontSize: '1.125rem', lineHeight: '1.7' }}>
                A carefully curated marketplace connecting visionary artists with discerning collectors. Every piece
                tells a story.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-16">
                <button className="group px-8 py-3 bg-foreground text-background hover:bg-foreground/90 transition-all flex items-center gap-2">
                  Start Exploring
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button className="px-8 py-3 border border-border hover:border-foreground transition-colors">
                  Create & Sell
                </button>
              </div>
              <div className="grid grid-cols-3 gap-8 border-t border-border pt-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  >
                    <stat.icon className="w-5 h-5 mb-2 text-muted-foreground" />
                    <p className="text-foreground mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="col-span-2 group cursor-pointer">
                <div className="relative overflow-hidden bg-muted aspect-[16/10] border border-border">
                  <Image
                    src={featuredArtworks[0].image}
                    alt={featuredArtworks[0].title}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <p className="mb-1">{featuredArtworks[0].title}</p>
                      <p className="text-sm opacity-80">{featuredArtworks[0].artist}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-foreground">{featuredArtworks[0].title}</p>
                    <p className="text-sm text-muted-foreground">{featuredArtworks[0].artist}</p>
                  </div>
                  <p className="text-foreground">{featuredArtworks[0].price}</p>
                </div>
              </div>
              {featuredArtworks.slice(1).map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden bg-muted aspect-square border border-border">
                    <Image
                      src={artwork.image}
                      alt={artwork.title}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-foreground">{artwork.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{artwork.price}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute -top-4 -right-4 bg-background dark:bg-background border border-border px-6 py-3 shadow-lg"
            >
              <p className="text-xs text-muted-foreground mb-1">Trending Now</p>
              <p className="text-foreground">+47% This Week</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
