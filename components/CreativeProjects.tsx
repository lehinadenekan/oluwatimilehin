'use client'

import YorubaWordMasterEmbed from './word-master/YorubaWordMasterEmbed'

export default function CreativeProjects() {
  return (
    <section id="creative" className="py-20 px-4 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Creative Projects
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-2 text-justify">
            Innovative web design and app design projects featuring Yoruba language technology
          </p>
          <p className="text-gray-400 text-base max-w-3xl mx-auto text-justify">
            Explore interactive experiences and creative technology solutions, including the Yoruba Word Master game - an innovative approach to Yoruba language learning through web applications.
          </p>
        </div>
        {/* Embedded Game */}
        <YorubaWordMasterEmbed 
          defaultDifficulty="easy"
          defaultWordLength={3}
          showStatistics={true}
          showSettings={true}
        />
      </div>
    </section>
  )
}

