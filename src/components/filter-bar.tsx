'use client'
import { motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

const categories = ['All', 'Art', 'Photography', 'Music', '3D', 'Collectibles']
const sortOptions = ['Recently Listed', 'Price: Low to High', 'Price: High to Low', 'Most Viewed']

interface FilterBarProps {
  onCategoryChange?: (category: string) => void
  onSortChange?: (sort: string) => void
}

export function FilterBar({ onCategoryChange, onSortChange }: FilterBarProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedSort, setSelectedSort] = useState('Recently Listed')
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
    onCategoryChange?.(category)
  }

  const handleSortClick = (sort: string) => {
    setSelectedSort(sort)
    setShowSortDropdown(false)
    onSortChange?.(sort)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-border"
    >
      <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-4 py-1.5 border whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'border-foreground text-foreground'
                : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="relative">
        <button
          onClick={() => setShowSortDropdown(!showSortDropdown)}
          className="flex items-center gap-2 px-4 py-1.5 border border-border hover:border-foreground transition-colors text-foreground"
        >
          <span className="text-sm">{selectedSort}</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {showSortDropdown && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-48 bg-background border border-border shadow-lg z-20"
            >
              {sortOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSortClick(option)}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                    selectedSort === option
                      ? 'text-foreground bg-muted'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {option}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  )
}
