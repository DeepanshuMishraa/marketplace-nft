'use client'

import { motion } from 'motion/react'
import { FilterBar } from './filter-bar'
import { NFTCard } from './nft-card'

const mockNFTs = [
  {
    id: '1',
    image:
      'https://images.unsplash.com/photo-1705254613735-1abb457f8a60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGFydCUyMGNvbG9yZnVsfGVufDF8fHx8MTc2Mjg1Mjg0OXww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Chromatic Dreams',
    artist: 'Elena Mora',
    price: '2.4 SOL',
  },
  {
    id: '2',
    image:
      'https://images.unsplash.com/photo-1729590925713-dabf8d80e86f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYXJ0d29yayUyMG5lb258ZW58MXx8fHwxNzYyODYwMzg2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Neon Pulse',
    artist: 'Marcus Jin',
    price: '1.8 SOL',
  },
  {
    id: '3',
    image:
      'https://images.unsplash.com/photo-1657026947006-a7663dbe4cd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBzY3VscHR1cmV8ZW58MXx8fHwxNzYyODYwMzg2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Sculptural Form',
    artist: 'Yuki Tanaka',
    price: '3.2 SOL',
  },
  {
    id: '4',
    image:
      'https://images.unsplash.com/photo-1549791084-5f78368b208b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc2Mjc4NTExM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Minimal Space',
    artist: 'Alex Rivera',
    price: '1.5 SOL',
  },
  {
    id: '5',
    image:
      'https://images.unsplash.com/photo-1580136607993-fd598cf5c4f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwYWludGluZ3xlbnwxfHx8fDE3NjI3OTg4MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Canvas Whispers',
    artist: 'Sofia Chen',
    price: '2.1 SOL',
  },
  {
    id: '6',
    image:
      'https://images.unsplash.com/photo-1704121113061-d174b9b9219b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW9tZXRyaWMlMjBhcnR8ZW58MXx8fHwxNzYyNzg5NTIxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Geometric Balance',
    artist: 'Leo Park',
    price: '1.9 SOL',
  },
  {
    id: '7',
    image:
      'https://images.unsplash.com/photo-1565660467558-2cc40ad3066b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc2Mjc3NTQ4NHww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Light Studies',
    artist: 'Nina Patel',
    price: '2.7 SOL',
  },
  {
    id: '8',
    image:
      'https://images.unsplash.com/photo-1587120511358-98f9104cc096?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwaWxsdXN0cmF0aW9ufGVufDF8fHx8MTc2Mjg0MDQ0NXww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Digital Bloom',
    artist: 'Kai Williams',
    price: '1.6 SOL',
  },
  {
    id: '9',
    image:
      'https://images.unsplash.com/photo-1526898834822-52c0ce699e8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWJyYW50JTIwY29sb3JzJTIwYWJzdHJhY3R8ZW58MXx8fHwxNzYyODUxOTY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Vivid Horizons',
    artist: 'Aria Kim',
    price: '3.0 SOL',
  },
  {
    id: '10',
    image:
      'https://images.unsplash.com/photo-1740511318854-720e46fef2b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3RpYyUyMGNvbXBvc2l0aW9ufGVufDF8fHx8MTc2MjgyOTgwNXww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Composed Chaos',
    artist: 'James Lee',
    price: '2.3 SOL',
  },
  {
    id: '11',
    image:
      'https://images.unsplash.com/photo-1621249153915-1098c2c35f37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcnQlMjBkZXNpZ258ZW58MXx8fHwxNzYyODYwMzk0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Modern Essence',
    artist: 'Maya Torres',
    price: '1.7 SOL',
  },
  {
    id: '12',
    image:
      'https://images.unsplash.com/photo-1642076573749-4c79df8ad6e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHBhdHRlcm58ZW58MXx8fHwxNzYyODE4ODUzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Pattern Theory',
    artist: 'Omar Hassan',
    price: '2.0 SOL',
  },
]

export function Explore() {
  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <main className="max-w-7xl mx-auto px-6 pt-10 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1
            className="tracking-tight mb-4"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              lineHeight: '1.1',
              letterSpacing: '-0.02em',
            }}
          >
            Explore
          </h1>
          <p className="text-muted-foreground max-w-2xl" style={{ fontSize: '1.125rem', lineHeight: '1.6' }}>
            Discover exceptional digital art from creators around the world.
          </p>
        </motion.div>
        <FilterBar />
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {mockNFTs.map((nft, index) => (
            <NFTCard key={nft.id} {...nft} index={index} />
          ))}
        </div>
      </main>
    </div>
  )
}
