'use client'

import { useState, useEffect } from 'react'
import Script from 'next/script'
import { trackEvent } from '@/lib/analytics'

export default function Services() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    
    // Track form submission
    trackEvent.contactFormSubmit()

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setErrorMessage('')
        setFormData({ name: '', email: '', subject: '', message: '' })
        // Track successful submission
        trackEvent.contactFormSuccess()
      } else {
        const errorMsg = data.error || data.details || 'Unknown error occurred'
        console.error('Contact form error:', errorMsg, data)
        setSubmitStatus('error')
        setErrorMessage(errorMsg)
        // Track error
        trackEvent.contactFormError(errorMsg)
      }
    } catch (error) {
      console.error('Contact form submission error:', error)
      setSubmitStatus('error')
      setErrorMessage('Network error. Please check your connection and try again.')
      // Track error
      trackEvent.contactFormError('Network error')
    } finally {
      setIsSubmitting(false)
    }
  }
  const services = [
    {
      title: 'Audio Production',
      description: 'Professional audio production services including recording, editing, and post-production for podcasts, commercials, and multimedia content. Expert sound design and audio engineering.',
    },
    {
      title: 'Music Production',
      description: 'End-to-end music production from composition to final mastering for artists and commercial projects. Professional music production services.',
    },
    {
      title: 'Web Design & App Design',
      description: 'Custom web design and app design services. Professional web applications, interactive experiences, and creative technology solutions. Responsive web design and mobile app development.',
    },
  ]

  return (
    <section id="services" className="py-20 px-4 bg-gray-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Let&apos;s Work Together
          </h2>
          <p className="text-gray-200 text-xl mb-6 leading-relaxed tracking-wide max-w-3xl mx-auto">
            Professional audio production, web design, and app design services
          </p>
          <p className="text-gray-300 text-base mb-6 max-w-3xl mx-auto leading-relaxed tracking-wide">
            Serving clients in the UK and worldwide. Specialising in Yoruba language technology, podcast production, and creative digital solutions.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 justify-items-center">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-purple-700 transition-all duration-300 hover:transform hover:scale-105 w-full max-w-sm"
            >
              <h3 className="text-xl font-semibold text-white mb-3 text-center">
                {service.title}
              </h3>
              <p className="text-gray-200 text-base mb-6 leading-relaxed tracking-wide">{service.description}</p>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-900 rounded-lg p-4 sm:p-8 border border-gray-800">
          {/* Calendly Integration */}
          <div className="mb-4 sm:mb-6 text-center">
            <h3 className="text-xl font-semibold text-white mb-4">
              Schedule a Call
            </h3>
            <div className="bg-gray-800 rounded-lg p-4 sm:p-8 overflow-hidden">
              {/* Calendly Inline Widget */}
              <div className="w-full max-w-full overflow-x-hidden">
                <div 
                  className="calendly-inline-widget mx-auto w-full h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden" 
                  data-url="https://calendly.com/oluwatimilehinonline"
                />
              </div>
              <Script
                src="https://assets.calendly.com/assets/external/widget.js"
                strategy="lazyOnload"
              />
            </div>
          </div>

          {/* Email Contact Form */}
          <div className="pt-4 sm:pt-6 border-t border-gray-800 text-center">
            <h3 className="text-xl font-semibold text-white mb-4">
              Email Contact
            </h3>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
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
                  </>
                )}
              </button>
              {submitStatus === 'success' && (
                <p className="text-green-400 text-sm">Message sent successfully! I&apos;ll get back to you soon.</p>
              )}
              {submitStatus === 'error' && (
                <div className="text-red-400 text-sm">
                  <p className="font-semibold mb-1">Failed to send message:</p>
                  <p className="mb-2">{errorMessage}</p>
                  <p>Please try again or email directly at <a href="mailto:lehinadenekan@gmail.com" className="underline">lehinadenekan@gmail.com</a></p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

