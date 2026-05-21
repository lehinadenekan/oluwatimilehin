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

  useEffect(() => {
    const onCalendlyMessage = (event: MessageEvent) => {
      const data = event.data
      if (!data || typeof data !== 'object' || !('event' in data)) return

      const name = String((data as { event?: string }).event)
      if (name === 'calendly.event_scheduled') {
        trackEvent.calendlyEventScheduled()
      } else if (name.startsWith('calendly.')) {
        trackEvent.calendlyClick()
      }
    }

    window.addEventListener('message', onCalendlyMessage)
    return () => window.removeEventListener('message', onCalendlyMessage)
  }, [])

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
    trackEvent.contactFormSubmit()

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setErrorMessage('')
        setFormData({ name: '', email: '', subject: '', message: '' })
        trackEvent.contactFormSuccess()
      } else {
        const errorMsg = data.error || data.details || 'Unknown error occurred'
        setSubmitStatus('error')
        setErrorMessage(errorMsg)
        trackEvent.contactFormError(errorMsg)
      }
    } catch (error) {
      console.error('Contact form submission error:', error)
      setSubmitStatus('error')
      setErrorMessage('Network error. Please check your connection and try again.')
      trackEvent.contactFormError('Network error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass =
    'w-full px-4 py-3 bg-cream border border-warm-mid rounded-sm text-ink placeholder-muted font-mono text-sm focus:outline-none focus:border-accent transition-colors'

  return (
    <section id="services" className="py-20 px-4 border-t border-warm-mid bg-accent-pale">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-accent block mb-3">
            Contact
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-ink text-center">
            Let&apos;s work together
          </h2>
        </div>

        <div className="bg-cream border border-warm-mid p-6 sm:p-10">
          <div className="mb-8 text-center">
            <h3 className="font-serif text-2xl text-ink mb-4">Schedule a call</h3>
            <div className="w-full overflow-x-hidden border border-warm-mid">
              <div
                className="calendly-inline-widget mx-auto w-full h-[500px] sm:h-[600px] lg:h-[700px]"
                data-url="https://calendly.com/oluwatimilehinonline"
              />
            </div>
            <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
          </div>

          <div className="pt-8 border-t border-warm-mid text-center">
            <h3 className="font-serif text-2xl text-ink mb-6">Email</h3>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                className={inputClass}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                required
                className={inputClass}
              />
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                required
                className={inputClass}
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message"
                required
                rows={6}
                className={`${inputClass} resize-none`}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full font-mono text-[11px] tracking-[0.15em] uppercase py-3 px-6 bg-accent text-cream hover:bg-accent-hover transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Sending…' : 'Send message'}
              </button>
              {submitStatus === 'success' && (
                <p className="text-accent text-sm font-mono">Message sent — I&apos;ll be in touch soon.</p>
              )}
              {submitStatus === 'error' && (
                <div className="text-ink text-sm">
                  <p className="font-mono mb-1">{errorMessage}</p>
                  <p>
                    Or email{' '}
                    <a href="mailto:lehinadenekan@gmail.com" className="text-accent underline">
                      lehinadenekan@gmail.com
                    </a>
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
