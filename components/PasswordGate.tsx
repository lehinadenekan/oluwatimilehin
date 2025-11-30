'use client'

import { useState } from 'react'

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Store authentication in sessionStorage
        sessionStorage.setItem('portfolioAuthenticated', 'true')
        setPassword('')
        setIsSubmitting(false)
        onAuthenticated()
      } else {
        setError(data.error || 'Incorrect password')
        setPassword('')
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Password verification error:', error)
      setError('An error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <section id="password-gate" className="bg-black py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            Access Exclusive Portfolio
          </h2>
          <p className="text-gray-200 text-base mb-6 text-center">
            Enter the password to view exclusive portfolio information.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="portfolio-password" className="block text-sm font-medium text-gray-200 mb-2">
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
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
                placeholder="Enter password"
                disabled={isSubmitting}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'password-error' : undefined}
              />
              {error && (
                <p id="password-error" className="mt-2 text-sm text-red-400">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || !password.trim()}
            >
              {isSubmitting ? 'Verifying...' : 'Access Portfolio'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

