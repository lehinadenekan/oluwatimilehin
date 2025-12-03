'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { PortfolioSection } from '@/types/portfolio'

interface DetailedPortfolioProps {
  sections: PortfolioSection[]
  onLogout: () => void
}

export default function DetailedPortfolio({ sections, onLogout }: DetailedPortfolioProps) {
  const [loadingVideos, setLoadingVideos] = useState<Set<string>>(new Set())
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null)

  const getVideoKey = (sectionIndex: number, itemIndex: number) => `${sectionIndex}-${itemIndex}`

  const handleVideoLoadStart = (sectionIndex: number, itemIndex: number) => {
    setLoadingVideos(prev => new Set(prev).add(getVideoKey(sectionIndex, itemIndex)))
  }

  const handleVideoLoaded = (sectionIndex: number, itemIndex: number) => {
    setLoadingVideos(prev => {
      const next = new Set(prev)
      next.delete(getVideoKey(sectionIndex, itemIndex))
      return next
    })
  }

  const handleVideoError = (sectionIndex: number, itemIndex: number) => {
    setLoadingVideos(prev => {
      const next = new Set(prev)
      next.delete(getVideoKey(sectionIndex, itemIndex))
      return next
    })
  }

  // Close image modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        setSelectedImage(null)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [selectedImage])

  return (
    <section id="detailed-portfolio" className="bg-black py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Logout */}
        <div className="flex justify-between items-center mb-12">
              <h2 className="text-4xl font-bold text-white text-center">
                Exclusive Portfolio Access
              </h2>
              <button
                onClick={onLogout}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-300"
                aria-label="Logout and hide exclusive portfolio access"
              >
            Logout
          </button>
        </div>

        {/* Portfolio Sections */}
        <div className="space-y-16">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-8">
              {/* Section Header */}
              <h3 className="text-3xl font-bold text-white border-b border-gray-800 pb-4 text-center">
                {section.title}
              </h3>

              {/* Section Items - Display in rows */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden"
                  >
                    {/* Media Container */}
                    <div className="w-full h-[400px] relative bg-gray-800 flex items-center justify-center overflow-hidden">
                      {item.type === 'video' ? (
                        // Check if it's a Google Drive link
                        item.mediaPath.includes('drive.google.com') ? (
                          <div className="relative w-full h-full flex items-center justify-center">
                            {/* Aspect ratio wrapper - 16:9 */}
                            <div 
                              className="w-full"
                              style={{ 
                                aspectRatio: '16/9',
                                maxHeight: '100%',
                                maxWidth: '100%'
                              }}
                            >
                              <iframe
                                src={item.mediaPath}
                                className="w-full h-full"
                                allow="autoplay"
                                allowFullScreen
                                title={item.title}
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            {loadingVideos.has(getVideoKey(sectionIndex, itemIndex)) && (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                                <div className="text-gray-400">Loading video...</div>
                              </div>
                            )}
                            <video
                              src={item.mediaPath}
                              controls
                              className="w-full h-full object-contain"
                              onLoadStart={() => handleVideoLoadStart(sectionIndex, itemIndex)}
                              onLoadedData={() => handleVideoLoaded(sectionIndex, itemIndex)}
                              onError={() => handleVideoError(sectionIndex, itemIndex)}
                              preload="metadata"
                            >
                              Your browser does not support the video tag.
                            </video>
                          </>
                        )
                      ) : item.mediaPath.endsWith('.pdf') ? (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4">
                          <iframe
                            src={item.mediaPath}
                            className="w-full h-full"
                            title={item.title}
                          />
                          <a
                            href={item.mediaPath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center space-x-2 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-lg transition-all duration-300 text-sm"
                          >
                            <span>Open PDF</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      ) : item.mediaPath.endsWith('.docx') || item.mediaPath.endsWith('.doc') ? (
                        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gray-800">
                          <svg className="w-24 h-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="text-gray-300 text-sm mb-4 text-center">Document File</p>
                          <a
                            href={item.mediaPath}
                            download
                            className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-lg transition-all duration-300"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>Download Document</span>
                          </a>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedImage({ src: item.mediaPath, alt: item.title })}
                          className="w-full h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-700 rounded-lg overflow-hidden"
                          aria-label={`View larger image: ${item.title}`}
                        >
                          <img
                            src={item.mediaPath}
                            alt={item.title}
                            className="w-full h-full object-contain hover:opacity-90 transition-opacity"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              const parent = target.parentElement
                              if (parent) {
                                parent.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400">Image not available</div>'
                              }
                            }}
                          />
                        </button>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h4 className="text-2xl font-bold text-white mb-2 text-center">
                        {item.title}
                      </h4>
                      <p className="text-purple-400 text-lg mb-4 text-center">
                        {item.role}
                      </p>
                      <p className="text-gray-200 text-base mb-6 leading-relaxed tracking-wide max-w-3xl mx-auto">
                        {item.description}
                      </p>
                      <p className="text-gray-200 text-base mb-6 leading-relaxed tracking-wide max-w-3xl mx-auto">
                        <strong className="text-white">Impact:</strong> {item.impact}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-[100] flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-gray-800 z-10"
            aria-label="Close image viewer"
          >
            <X size={32} />
          </button>
          <div
            className="max-w-7xl max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </section>
  )
}

