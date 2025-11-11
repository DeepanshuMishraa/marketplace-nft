'use client'

import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'

interface UploadZoneProps {
  onImageChange: (file: File | null) => void
  preview: string | null
}

export function UploadZone({ onImageChange, preview }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      onImageChange(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImageChange(file)
    }
  }

  const clearImage = () => {
    onImageChange(null)
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative aspect-square border transition-colors ${
        isDragging ? 'border-foreground bg-muted' : 'border-border hover:border-foreground'
      }`}
    >
      {preview ? (
        <div className="relative w-full h-full group">
          <Image width={400} height={400} src={preview} alt="Upload preview" className="w-full h-full object-cover" />
          <button
            onClick={clearImage}
            className="absolute top-4 right-4 p-2 bg-background border border-border opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
          <Upload className="w-8 h-8 text-muted-foreground mb-4" />
          <p className="text-foreground mb-1">Upload Artwork</p>
          <p className="text-sm text-muted-foreground">PNG, JPG, GIF up to 50MB</p>
          <input type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
        </label>
      )}
    </div>
  )
}
