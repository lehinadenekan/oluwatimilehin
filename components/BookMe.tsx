export default function BookMe() {
  return (
    <section id="book" className="py-20 px-4 bg-black">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Let&apos;s Work Together
          </h2>
          <p className="text-gray-400 text-lg">
            Get in touch to discuss your project or book a session
          </p>
        </div>
        <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-white mb-6">
              Booking Options
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="text-white font-medium mb-1">Remote Session</h4>
                  <p className="text-gray-400 text-sm">
                    Work together from anywhere in the world via video call
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="text-white font-medium mb-1">Mobile Visit</h4>
                  <p className="text-gray-400 text-sm">
                    On-location recording and production services
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="text-white font-medium mb-1">Project Quote</h4>
                  <p className="text-gray-400 text-sm">
                    Get a custom quote for your specific project needs
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Calendly Integration Space */}
          <div className="mb-8 pt-8 border-t border-gray-800">
            <h3 className="text-xl font-semibold text-white mb-4">
              Schedule a Call
            </h3>
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-400 mb-4">
                Calendly integration will be added here
              </p>
              <p className="text-sm text-gray-500">
                For now, please contact via email
              </p>
            </div>
          </div>

          {/* Email Contact Fallback */}
          <div className="pt-8 border-t border-gray-800">
            <h3 className="text-xl font-semibold text-white mb-4">
              Email Contact
            </h3>
            <a
              href="mailto:contact@example.com"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              <span>Send Email</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

