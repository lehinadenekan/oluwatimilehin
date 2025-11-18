export default function AudioProduction() {
  return (
    <section id="audio" className="py-20 px-4 bg-gray-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Audio Production
          </h2>
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 hover:border-purple-500 transition-all duration-300">
            <div className="mb-6">
              <span className="text-purple-400 text-sm font-semibold">
                Podcast Production
              </span>
              <h3 className="text-3xl font-bold text-white mt-2 mb-4">
                BBC Podcast Production
              </h3>
              <p className="text-gray-300 mb-4">
                Professional audio editing and post-production for BBC podcast series.
                Delivered high-quality audio content with meticulous attention to detail
                and industry-standard production techniques.
              </p>
            </div>
            <div className="flex items-center space-x-4 pt-6 border-t border-gray-800">
              <div className="px-4 py-2 bg-purple-900/30 rounded-lg border border-purple-500/30">
                <span className="text-purple-300 text-sm font-medium">Audio Editor</span>
              </div>
              <div className="px-4 py-2 bg-pink-900/30 rounded-lg border border-pink-500/30">
                <span className="text-pink-300 text-sm font-medium">Post-Production</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

