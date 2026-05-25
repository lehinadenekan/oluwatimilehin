// Google Analytics 4 + Supabase first-party event tracking

import { getVisitorId } from '@/lib/analytics-visitor'

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void
  }
}

export type InteractionEvent = {
  action: string
  category: string
  label?: string
  value?: number
  metadata?: Record<string, unknown>
}

// Track page views (GA only)
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
      page_path: url,
    })
  }
}

function sendToGoogleAnalytics({
  action,
  category,
  label,
  value,
  metadata,
}: InteractionEvent) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
    ...metadata,
  })
}

function persistToSupabase({
  action,
  category,
  label,
  value,
  metadata,
}: InteractionEvent) {
  if (typeof window === 'undefined') return

  const visitorId = getVisitorId()

  const payload = {
    event_name: action,
    event_category: category,
    label,
    page_path: window.location.pathname + window.location.search,
    referrer: document.referrer || undefined,
    visitor_id: visitorId ?? undefined,
    metadata: {
      ...metadata,
      ...(value !== undefined ? { value } : {}),
    },
  }

  const body = JSON.stringify(payload)

  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {
    // Fire-and-forget; analytics must not break UX
  })
}

/** Sends the same event to GA4 and Supabase (when configured). */
export function trackInteraction(event: InteractionEvent) {
  sendToGoogleAnalytics(event)
  persistToSupabase(event)
}

/** @deprecated Prefer trackInteraction — kept for backwards compatibility */
export const event = (params: InteractionEvent) => {
  trackInteraction(params)
}

// Predefined event helpers
export const trackEvent = {
  contactFormSubmit: () => {
    trackInteraction({
      action: 'submit',
      category: 'Contact Form',
      label: 'Contact Form Submission',
    })
  },
  contactFormSuccess: () => {
    trackInteraction({
      action: 'success',
      category: 'Contact Form',
      label: 'Contact Form Success',
    })
  },
  contactFormError: (error: string) => {
    trackInteraction({
      action: 'error',
      category: 'Contact Form',
      label: error,
    })
  },

  calendlyClick: () => {
    trackInteraction({
      action: 'click',
      category: 'Calendly',
      label: 'Schedule Call Widget',
    })
  },
  calendlyEventScheduled: () => {
    trackInteraction({
      action: 'scheduled',
      category: 'Calendly',
      label: 'Event Scheduled',
    })
  },

  externalLink: (url: string, linkLabel: string) => {
    trackInteraction({
      action: 'click',
      category: 'External Link',
      label: `${linkLabel} - ${url}`,
      metadata: { url, link_label: linkLabel },
    })
  },

  videoPlay: (videoName: string) => {
    trackInteraction({
      action: 'play',
      category: 'Video',
      label: videoName,
    })
  },

  sectionView: (sectionName: string) => {
    trackInteraction({
      action: 'view',
      category: 'Section',
      label: sectionName,
    })
  },

  buttonClick: (buttonName: string, location: string) => {
    trackInteraction({
      action: 'click',
      category: 'Button',
      label: `${buttonName} - ${location}`,
      metadata: { button: buttonName, location },
    })
  },

  gameStart: (gameName: string) => {
    trackInteraction({
      action: 'start',
      category: 'Game',
      label: gameName,
    })
  },
  gameComplete: (gameName: string) => {
    trackInteraction({
      action: 'complete',
      category: 'Game',
      label: gameName,
    })
  },

  musicPlay: (trackName: string) => {
    trackInteraction({
      action: 'play',
      category: 'Music',
      label: trackName,
    })
  },

  portfolioArm: (arm: 'music' | 'audio' | 'tech') => {
    trackInteraction({
      action: 'click',
      category: 'Portfolio',
      label: arm,
      metadata: { arm },
    })
  },

  scrollCue: () => {
    trackInteraction({
      action: 'click',
      category: 'Portfolio',
      label: 'scroll_cue',
    })
  },

  scrollToTop: (pagePath?: string) => {
    trackInteraction({
      action: 'click',
      category: 'Navigation',
      label: 'scroll_to_top',
      metadata: pagePath ? { page_path: pagePath } : undefined,
    })
  },

  caseStudyNav: (section: string) => {
    trackInteraction({
      action: 'click',
      category: 'Case Study Nav',
      label: section,
      metadata: { section },
    })
  },

  caseStudyCta: (cta: string) => {
    trackInteraction({
      action: 'click',
      category: 'Case Study CTA',
      label: cta,
      metadata: { cta },
    })
  },

  carousel: (action: 'prev' | 'next' | 'dot' | 'enlarge' | 'close', index?: number) => {
    trackInteraction({
      action,
      category: 'Case Study Carousel',
      label: index !== undefined ? `slide_${index + 1}` : action,
      metadata: { index },
    })
  },

  musicPanelView: () => {
    trackInteraction({
      action: 'view',
      category: 'Portfolio Panel',
      label: 'music',
    })
  },

  portfolioAuth: (action: 'success' | 'logout') => {
    trackInteraction({
      action,
      category: 'Portfolio Auth',
      label: action,
    })
  },
}
