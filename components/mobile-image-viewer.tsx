'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, ZoomIn, ZoomOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MobileImageViewerProps {
  src: string
  alt: string
  isOpen: boolean
  onClose: () => void
}

export function MobileImageViewer({ src, alt, isOpen, onClose }: MobileImageViewerProps) {
  const [scale, setScale] = useState(1)

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.5, 3))
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.5, 1))

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = src
    link.download = `nano-banana-${Date.now()}.jpg`
    link.click()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 safe-top">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="tap-target"
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  handleZoomOut()
                }}
                disabled={scale <= 1}
                className="tap-target"
              >
                <ZoomOut className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  handleZoomIn()
                }}
                disabled={scale >= 3}
                className="tap-target"
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDownload()
                }}
                className="tap-target"
              >
                <Download className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="flex items-center justify-center h-full p-4">
            <motion.img
              src={src}
              alt={alt}
              className="max-w-full max-h-full object-contain"
              style={{ scale }}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.1}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Scale indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm text-sm safe-bottom">
            {Math.round(scale * 100)}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
