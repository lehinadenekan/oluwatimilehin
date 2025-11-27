// Google Analytics 4 Event Tracking

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void
  }
}

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
      page_path: url,
    })
  }
}

// Track custom events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Predefined event helpers
export const trackEvent = {
  // Contact form
  contactFormSubmit: () => {
    event({
      action: 'submit',
      category: 'Contact Form',
      label: 'Contact Form Submission',
    })
  },
  contactFormSuccess: () => {
    event({
      action: 'success',
      category: 'Contact Form',
      label: 'Contact Form Success',
    })
  },
  contactFormError: (error: string) => {
    event({
      action: 'error',
      category: 'Contact Form',
      label: error,
    })
  },

  // Calendly
  calendlyClick: () => {
    event({
      action: 'click',
      category: 'Calendly',
      label: 'Schedule Call Button',
    })
  },

  // External links
  externalLink: (url: string, label: string) => {
    event({
      action: 'click',
      category: 'External Link',
      label: `${label} - ${url}`,
    })
  },

  // Video plays
  videoPlay: (videoName: string) => {
    event({
      action: 'play',
      category: 'Video',
      label: videoName,
    })
  },

  // Section views (scroll tracking)
  sectionView: (sectionName: string) => {
    event({
      action: 'view',
      category: 'Section',
      label: sectionName,
    })
  },

  // Button clicks
  buttonClick: (buttonName: string, location: string) => {
    event({
      action: 'click',
      category: 'Button',
      label: `${buttonName} - ${location}`,
    })
  },

  // Game interactions
  gameStart: (gameName: string) => {
    event({
      action: 'start',
      category: 'Game',
      label: gameName,
    })
  },
  gameComplete: (gameName: string) => {
    event({
      action: 'complete',
      category: 'Game',
      label: gameName,
    })
  },

  // Music plays
  musicPlay: (trackName: string) => {
    event({
      action: 'play',
      category: 'Music',
      label: trackName,
    })
  },
}

