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

