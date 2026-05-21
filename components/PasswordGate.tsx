'use client'

import { useState } from 'react'
import { trackEvent } from '@/lib/analytics'

interface PasswordGateProps {
  onAuthenticated: () => void
}

export default function PasswordGate({ onAuthenticated }: PasswordGateProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!password.trim()) {
      setError('Password required')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        trackEvent.portfolioAuth('success')
        sessionStorage.setItem('portfolioAuthenticated', 'true')
        setPassword('')
        setIsSubmitting(false)
        window.dispatchEvent(new CustomEvent('portfolioAuthenticated'))
        onAuthenticated()
      } else {
        setError(data.error || 'Incorrect password')
        setPassword('')
        setIsSubmitting(false)
      }
    } catch (err) {
      console.error('Password verification error:', err)
      setError('An error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <section id="password-gate" className="py-20 px-4 border-t border-warm-mid bg-ink">
      <div className="max-w-2xl mx-auto">
        <div className="border border-white/10 p-8 sm:p-10">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-accent block mb-3 text-center">
            Exclusive
          </span>
          <h2 className="font-serif text-3xl font-light text-cream mb-4 text-center">
            Portfolio access
          </h2>
          <p className="text-cream/60 text-base mb-6 text-center leading-relaxed">
            Enter the password to view additional portfolio work.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="portfolio-password" className="block font-mono text-[10px] tracking-[0.15em] uppercase text-cream/50 mb-2">
                Password
              </label>
              <input
                id="portfolio-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                className="w-full px-4 py-3 bg-ink border border-white/20 text-cream font-mono text-sm placeholder-white/30 focus:outline-none focus:border-accent"
                placeholder="Enter password"
                disabled={isSubmitting}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'password-error' : undefined}
              />
              {error && (
                <p id="password-error" className="mt-2 text-sm text-accent-pale font-mono">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full font-mono text-[11px] tracking-[0.15em] uppercase py-3 px-6 bg-accent text-cream hover:bg-accent-hover transition-colors disabled:opacity-50"
              disabled={isSubmitting || !password.trim()}
            >
              {isSubmitting ? 'Verifying…' : 'Access portfolio'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
