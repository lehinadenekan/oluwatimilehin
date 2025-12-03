'use client'

export default function Exclusive() {
  return (
    <section id="exclusive" className="min-h-screen bg-black py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-8 text-center">
          Exclusive Content
        </h2>
        
        <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
          <p className="text-gray-200 text-base text-center mb-6 leading-relaxed tracking-wide max-w-3xl mx-auto">
            Welcome to the exclusive section. This area is reserved for employers and partners.
          </p>
          <p className="text-gray-300 text-sm text-center mb-6 leading-relaxed tracking-wide max-w-3xl mx-auto">
            Content will be added here soon.
          </p>
        </div>
      </div>
    </section>
  )
}

