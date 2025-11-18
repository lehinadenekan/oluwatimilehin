'use client'

interface SongCardProps {
  title: string
  artist: string
  plays: string
  spotifyUrl: string
}

function SongCard({ title, artist, plays, spotifyUrl }: SongCardProps) {
  const trackId = spotifyUrl.split('/track/')[1]?.split('?')[0]

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-purple-500 transition-all duration-300">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
        <p className="text-gray-400 text-sm">{artist}</p>
        <p className="text-purple-400 text-sm mt-2">{plays} plays</p>
      </div>
      {trackId && (
        <div className="mt-4">
          <iframe
            src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-lg"
          />
        </div>
      )}
    </div>
  )
}

export default function Music() {
  return (
    <section id="music" className="py-20 px-4 bg-gray-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Music Releases
          </h2>
          <p className="text-gray-400 text-lg">
            Over 1 million combined streams on Spotify
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <SongCard
            title="Nothin Like"
            artist="Lehin"
            plays="911K"
            spotifyUrl="https://open.spotify.com/track/3JnpP0izcjNtopwxWJJN6Y"
          />
          <SongCard
            title="Road to Damascus"
            artist="Lehin ft. Olivia McShane"
            plays="155K"
            spotifyUrl="https://open.spotify.com/track/3Fn053srWfUf7aTIryw6Ib"
          />
        </div>
      </div>
    </section>
  )
}

