'use client'

import { useRef, useEffect } from 'react'

export default function CommercialWork() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      // Handle video errors with a slight delay to ensure error object is available
      const handleError = () => {
        setTimeout(() => {
          const error = video.error
          if (error) {
            let errorMessage = 'Unknown error'
            switch (error.code) {
              case error.MEDIA_ERR_ABORTED:
                errorMessage = 'Video loading aborted'
                break
              case error.MEDIA_ERR_NETWORK:
                errorMessage = 'Network error while loading video'
                break
              case error.MEDIA_ERR_DECODE:
                errorMessage = 'Error decoding video'
                break
              case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                errorMessage = 'Video format not supported'
                break
            }
            console.error('Video error details:', {
              code: error.code,
              message: error.message || errorMessage,
              networkState: video.networkState,
              readyState: video.readyState,
              src: video.currentSrc,
              canPlayType: video.canPlayType('video/mp4'),
            })
          } else {
            console.error('Video error event but error object is null')
          }
        }, 100)
      }
      
      const handleLoadStart = () => {
        console.log('Video load started, src:', video.currentSrc)
      }

      const handleCanPlay = () => {
        console.log('Video can play')
      }

      const handleLoadedData = () => {
        console.log('Video data loaded, duration:', video.duration)
      }

      const handleLoadedMetadata = () => {
        console.log('Video metadata loaded')
      }

      video.addEventListener('error', handleError)
      video.addEventListener('loadstart', handleLoadStart)
      video.addEventListener('canplay', handleCanPlay)
      video.addEventListener('loadeddata', handleLoadedData)
      video.addEventListener('loadedmetadata', handleLoadedMetadata)

      return () => {
        video.removeEventListener('error', handleError)
        video.removeEventListener('loadstart', handleLoadStart)
        video.removeEventListener('canplay', handleCanPlay)
        video.removeEventListener('loadeddata', handleLoadedData)
        video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      }
    }
  }, [])

  return (
    <section id="commercial" className="py-20 px-4 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Commercial Audio Production
          </h2>
        </div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Chanel Card */}
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 hover:border-purple-500 transition-all duration-300">
            <div className="mb-6" style={{ height: '180px' }}>
              <h3 className="text-3xl font-bold text-white mb-4">
                Chanel x Vogue Magazine
              </h3>
              <p className="text-gray-300">
                Soundtrack composition and sound design for the collaborative luxury fashion commercial.
              </p>
            </div>
            <div style={{ height: '600px' }}>
              <video
                ref={videoRef}
                controls
                poster="/videos/chanel-vogue-magazine-poster.jpg"
                className="w-full rounded-lg bg-black"
                style={{ height: '600px', objectFit: 'contain' }}
                preload="metadata"
                playsInline
              >
                <source src="/videos/chanel-vogue-magazine-sound-design.webm" type="video/webm" />
                <source src="/videos/chanel-vogue-magazine-sound-design-original.mp4" type="video/mp4" />
                <source src="/videos/chanel-vogue-magazine-sound-design-copy.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* BBC Card */}
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 hover:border-purple-500 transition-all duration-300">
            <div className="mb-6" style={{ height: '180px' }}>
              <h3 className="text-3xl font-bold text-white mb-4">
                BBC Podcast Production
              </h3>
              <p className="text-gray-300">
                Professional field recording and audio editing for BBC podcast series &quot;The Reset&quot; by Jade Scott.
              </p>
            </div>
            <div style={{ height: '600px', marginTop: '-50px' }}>
              <img
                src="/images/bbc-podcast-the-reset.webp"
                alt="BBC Podcast The Reset"
                className="w-full rounded-lg"
                style={{ height: '600px', objectFit: 'contain' }}
              />
            </div>
            <div className="mt-6 flex justify-center">
              <a
                href="https://www.bbc.co.uk/sounds/play/p0cw9yfk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-300"
              >
                <span>Listen on BBC Sounds</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

