'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { trackEvent } from '@/lib/analytics'
import AppScreenshotCarousel from './AppScreenshotCarousel'
import styles from './yoruba-deck.module.css'

/* ─── DATA ──────────────────────────────────────────────────── */

const problems = [
  {
    num: '01',
    heading: 'Diacritics are meaning',
    body: 'Yorùbá is tonal. A misplaced mark changes a word entirely. No existing tool handled this with integrity. I engineered custom logic to honour diacritic accuracy at every touchpoint.',
  },
  {
    num: '02',
    heading: 'No modern vocabulary resource',
    body: 'There was no audio-first Yorùbá dictionary with consistent pronunciation. I built one from scratch: database architecture, recording sessions, and a team in Nigeria to produce the content.',
  },
  {
    num: '03',
    heading: 'No community to grow into',
    body: 'Without an existing audience, I had to build one. I chose TikTok as the primary growth channel, leveraging the dictionary database as raw material for a social content pipeline.',
  },
  {
    num: '04',
    heading: 'Pre-launch products need pre-launch audiences',
    body: 'Rather than launch into silence, I built a waitlist strategy to capture and nurture learners before the main product launch, treating email subscribers as early adopters to validate demand.',
  },
]

const funnelSteps = [
  {
    icon: 'Source',
    heading: 'Yorùbá dictionary database',
    body: 'Words, audio, tonal marks. Custom PostgreSQL schema built and populated by the Nigeria team.',
    highlight: false,
  },
  {
    icon: 'Distribute',
    heading: 'TikTok & social content',
    body: 'Database powers Word of the Day, proverbs, and vocabulary content. AI pipeline schedules and publishes.',
    highlight: false,
  },
  {
    icon: 'Capture',
    heading: 'yorubadeck.com',
    body: 'Mobile-first landing page with event tracking on every interaction: audio plays, app downloads, shares.',
    highlight: true,
  },
  {
    icon: 'Convert',
    heading: 'Waitlist sign-up',
    body: 'A/B tested form design drove a strong conversion uplift within 2 weeks. Email addresses captured for nurture.',
    highlight: false,
  },
  {
    icon: 'Nurture',
    heading: 'Email audience',
    body: 'Subscribers are nurtured pre-launch. Intent validated before product investment scales.',
    highlight: false,
  },
]

const builtCards = [
  {
    icon: 'Platform',
    heading: 'Web app & Word Master game',
    body: 'Full-stack application with real-time sync, custom Yorùbá keyboard, and a vocabulary game with diacritic-accurate game logic.',
    tags: ['Next.js 14', 'React', 'TypeScript', 'Tailwind'],
  },
  {
    icon: 'Mobile',
    heading: 'iOS keyboard app (live) + iOS & Android apps in development',
    body: 'Custom system keyboard live on the Apple App Store, enabling diacritic-accurate Yorùbá typing on any iPhone. A second iOS app and an Android app are currently in development.',
    tags: ['iOS', 'App Store', 'Android'],
  },
  {
    icon: 'Database',
    heading: 'Yorùbá dictionary DB',
    body: 'Custom schema for the dictionary, audio recordings, game data, and user analytics. Powers both the product and the content pipeline.',
    tags: ['PostgreSQL', 'Supabase', 'SQL'],
  },
  {
    icon: 'AI & Automation',
    heading: 'Agentic content pipeline',
    body: 'AI-powered workflow for QA, scheduling, and multi-platform publishing. Built on OpenClaw and Claude API.',
    tags: ['OpenClaw', 'Claude API', 'Agentic AI'],
  },
  {
    icon: 'Auth & Security',
    heading: 'Identity & access',
    body: 'NextAuth.js v5, Google OAuth, JWT tokens, encrypted sessions. Enterprise-grade for a consumer product.',
    tags: ['NextAuth v5', 'OAuth', 'JWT'],
  },
  {
    icon: 'DevOps',
    heading: 'CI/CD & testing',
    body: 'GitHub Actions + Vercel deployment. Jest, Playwright, and axe-core for unit, E2E, and accessibility testing.',
    tags: ['GitHub Actions', 'Vercel', 'Playwright'],
  },
]

const analyticsEvents = [
  {
    type: 'Audio',
    heading: 'Word of the Day listens',
    body: 'Every audio play tracked. Tells me which words generate most engagement and which content formats hold attention.',
  },
  {
    type: 'Sharing',
    heading: 'Audio shares',
    body: 'Share events reveal viral potential: which words and proverbs people are motivated to pass on.',
  },
  {
    type: 'Downloads',
    heading: 'App download clicks',
    body: 'Tracks intent to install the iOS app. Funnel visibility from web traffic to App Store.',
  },
  {
    type: 'Conversion',
    heading: 'Waitlist sign-ups',
    body: 'The core conversion metric. A/B tested form variants with uplifts tracked in real time across Supabase and GA4.',
  },
  {
    type: 'Engagement',
    heading: 'Homepage interactions',
    body: 'SPA pageviews, scroll depth, feature interaction. Supabase first-party analytics reduce reliance on third-party tracking.',
  },
  {
    type: 'Retention',
    heading: 'Return visit patterns',
    body: 'Tracks which content types bring users back. Feeds directly into content prioritisation for the Nigeria team.',
  },
]

const skills = [
  {
    label: 'Product Management',
    heading: 'Full lifecycle ownership with data-led iteration',
    body: 'Roadmap, backlog, launch, post-release optimisation.'
  },
  {
    label: 'Growth & Marketing',
    heading: 'Built a top-of-funnel from zero',
    body: 'TikTok strategy, content as a product feature, waitlist CRO, event tracking. I am growing an audience and allowing the waitlist to be well populated before launching the product.'
  },
  {
    label: 'AI & Automation',
    heading: 'Agentic workflows in production',
    body: 'I built and operate AI pipelines using Claude and OpenClaw that run a real content business.'
  },
  {
    label: 'Team Leadership',
    heading: 'Remote international team management',
    body: 'Recruited, onboarded, and manage a Nigeria-based team across time zones. Set quality standards, managed briefs, and maintained output at scale.',
  },
  {
    label: 'Analytics',
    heading: 'End-to-end instrumentation and insight',
    body: 'Google Analytics 4, website events captured in Supabase, A/B testing. I know where users come from, what they do, and what makes them stay.',
  },
  {
    label: 'Applied Learning Design',
    heading: 'Pedagogy built for an underserved language',
    body: 'I designed the learning system, not just the software. Gamification, audio-first content, spaced repetition for a tonal language with no existing digital curriculum.',
  },
]

/* ─── HOOK: intersection-based reveal ───────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(styles.visible)
          observer.unobserve(el)
        }
      },
      { threshold: 0.08 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

/* ─── SMALL COMPONENTS ──────────────────────────────────────── */
function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal()
  return (
    <div ref={ref} className={`${styles.reveal} ${className}`}>
      {children}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <span className={styles.sectionLabel}>{children}</span>
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */
export default function YorubaDeckCaseStudy() {
  return (
    <div className={styles.root}>

      {/* NAV */}
      <nav className={styles.nav}>
        <Link
          href="/"
          className={styles.navLogo}
          onClick={() => trackEvent.caseStudyNav('home_logo')}
        >
          Olúwatìmílẹ́hìn
        </Link>
        <ul className={styles.navLinks}>
          <li>
            <a href="#problem" onClick={() => trackEvent.caseStudyNav('problem')}>
              Problem
            </a>
          </li>
          <li>
            <a href="#funnel" onClick={() => trackEvent.caseStudyNav('funnel')}>
              Growth Loop
            </a>
          </li>
          <li>
            <a href="#content" onClick={() => trackEvent.caseStudyNav('content')}>
              Content
            </a>
          </li>
          <li>
            <a href="#analytics" onClick={() => trackEvent.caseStudyNav('analytics')}>
              Analytics
            </a>
          </li>
          <li>
            <a href="#built" onClick={() => trackEvent.caseStudyNav('built')}>
              Tech
            </a>
          </li>
          <li>
            <Link href="/" onClick={() => trackEvent.caseStudyNav('home_back')}>
              ← Home
            </Link>
          </li>
        </ul>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <Image
            src="/images/yoruba-deck/yoruba-deck-logo-hero.png"
            alt="Yorùbá Deck logo"
            width={160}
            height={160}
            className={styles.heroLogo}
            priority
          />
          <span className={styles.heroEyebrow}>Case Study: 2025 → Present</span>
          <h1 className={styles.heroTitle}>
            Yorùbá<br /><em>Deck</em>
          </h1>
          <p className={styles.heroDesc}>
            I conceived, built, and operate a Yorùbá language learning platform end to end.
            Product, technology, content, growth, and a remote team in Nigeria. Solo founder.
          </p>
          <div className={styles.heroStats}>
            <div>
              <span className={styles.statNum}>200+</span>
              <span className={styles.statLabel}>Monthly visitors</span>
            </div>
            <div>
              <span className={styles.statNum}>1</span>
              <span className={styles.statLabel}>App live on App Store</span>
            </div>
            <div>
              <span className={styles.statNum}>2</span>
              <span className={styles.statLabel}>Apps in development</span>
            </div>
          </div>
        </div>
        <div className={styles.heroRight}>
          <span className={styles.heroBgText} aria-hidden="true">Yorùbá</span>
          <div className={styles.heroRightInner}>
            <div className={styles.heroAppShot}>
              <div className={styles.heroPhoneFrame}>
                <Image
                  src="/images/yoruba-deck-app-screenshot.png"
                  alt="Yorùbá Deck app showing the word bá…wí with morphological structure"
                  width={420}
                  height={840}
                  className={styles.heroAppShotImg}
                  priority
                />
              </div>
            </div>
            <blockquote className={styles.heroQuote}>
              I couldn&apos;t find a tool that treated Yorùbá with the depth it deserves. So I built
              one: the database, the app, the content pipeline, and the audience.
              <span className={styles.heroQuoteAttr}>Timilehin Adenekan, Creator of Yorùbá Deck</span>
            </blockquote>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className={styles.section} id="problem">
        <Reveal><SectionLabel>01: The Problem</SectionLabel></Reveal>
        <Reveal>
          <h2 className={styles.sectionTitle}>
            A living language<br />with no digital infrastructure.
          </h2>
        </Reveal>
        <Reveal>
          <div className={styles.problemGrid}>
            {problems.map((p) => (
              <div key={p.num} className={styles.problemCell}>
                <span className={styles.problemCellNum}>{p.num}</span>
                <h3>{p.heading}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* FUNNEL */}
      <section className={styles.funnelSection} id="funnel">
        <Reveal><SectionLabel>02: The Growth Loop</SectionLabel></Reveal>
        <Reveal>
          <h2 className={`${styles.sectionTitle} ${styles.light}`}>
            From database to audience<br />to waitlist.
          </h2>
        </Reveal>
        <Reveal>
          <p className={`${styles.sectionBody} ${styles.dimmed}`}>
            Every piece of content comes from the dictionary database. Content drives social traffic.
            Social traffic hits a tracked website. The website captures emails. Those subscribers
            become the launch audience. It is a closed loop, and every stage is instrumented.
          </p>
        </Reveal>
        <Reveal>
          <div className={styles.funnelTrack}>
            {funnelSteps.map((step, i) => (
              <>
                <div
                  key={step.icon}
                  className={`${styles.funnelStep} ${step.highlight ? styles.funnelHighlight : ''}`}
                >
                  <span className={styles.funnelIcon}>{step.icon}</span>
                  <h3>{step.heading}</h3>
                  <p>{step.body}</p>
                </div>
                {i < funnelSteps.length - 1 && (
                  <div key={`arrow-${i}`} className={styles.funnelArrow}>→</div>
                )}
              </>
            ))}
          </div>
        </Reveal>
      </section>

      {/* CONTENT & SOCIAL */}
      <section className={`${styles.section} ${styles.contentSection}`} id="content">
        <Reveal><SectionLabel>03: Content & Social</SectionLabel></Reveal>
        <Reveal>
          <h2 className={styles.sectionTitle}>
            TikTok as a growth engine,<br />not just a presence.
          </h2>
        </Reveal>
        <Reveal>
          <div className={styles.contentGrid}>
            <div>
              <p className={`${styles.sectionBody} ${styles.noMb}`}>
                I built a content operation around the dictionary database, using it as raw material
                for a consistent TikTok presence. The Nigeria-based team produces culturally
                authentic, linguistically accurate content at scale, whilst an agentic AI pipeline
                handles QA, scheduling, and multi-platform publishing.
              </p>
              <div className={styles.contentPlatform}>
                <div className={styles.platformHeader}>
                  <span className={styles.platformName}>TikTok</span>
                  <span className={styles.platformHandle}>@yorubadeck</span>
                </div>
                <p className={styles.platformDesc}>
                  Primary growth channel. Word of the Day, proverbs, pronunciation guides. Each
                  piece of content drives traffic back to the website and the waitlist.
                </p>
              </div>
              <div className={styles.contentPlatform}>
                <div className={styles.platformHeader}>
                  <span className={styles.platformName}>Multi-platform pipeline</span>
                </div>
                <p className={styles.platformDesc}>
                  The same content is repurposed and distributed across platforms using an AI
                  workflow built on OpenClaw, reducing production overhead whilst maintaining
                  quality standards.
                </p>
              </div>
            </div>
            <div className={styles.contentAside}>
              <div className={styles.contentStats}>
                <div className={styles.contentStat}>
                  <span className={`${styles.statNum} ${styles.accentNum}`}>Nigeria</span>
                  <span className={styles.statLabel}>Production team base</span>
                </div>
                <div className={styles.contentStat}>
                  <span className={`${styles.statNum} ${styles.accentNum}`}>AI</span>
                  <span className={styles.statLabel}>Powered QA pipeline</span>
                </div>
              </div>
              <a
                href="https://www.tiktok.com/@yorubadeck"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.tiktokProfileLink}
                aria-label="View Yorùbá Deck on TikTok @yorubadeck"
                onClick={() => trackEvent.caseStudyCta('tiktok_profile_image')}
              >
                <Image
                  src="/images/yoruba-deck/tiktok-profile.png"
                  alt="Yorùbá Deck TikTok profile @yorubadeck showing Word of the Day videos and language learning content"
                  width={1024}
                  height={789}
                  sizes="(max-width: 900px) 92vw, 420px"
                  className={styles.tiktokProfileImg}
                />
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* TEAM */}
      <section className={`${styles.section} ${styles.teamSection}`} id="team">
        <Reveal><SectionLabel>04: The Team</SectionLabel></Reveal>
        <Reveal>
          <h2 className={styles.sectionTitle}>
            Remote, international,<br />built from scratch.
          </h2>
        </Reveal>
        <Reveal>
          <p className={styles.sectionBody}>
            I recruited and manage a Nigeria-based production team to ensure the content is both
            linguistically accurate and culturally grounded. Managing a remote international team,
            across different time zones, production rhythms, and quality standards, is a distinct
            operational skill I built from the ground up.
          </p>
        </Reveal>
        <Reveal>
          <div className={styles.teamGrid}>
            <div className={styles.teamCard}>
              <span className={styles.teamRole}>Founder & Product Lead</span>
              <h3>Timilehin Adenekan</h3>
              <p>
                Product strategy, platform engineering, growth, analytics, and overall vision.
                Every product decision goes through one person, which means radical accountability
                for outcomes.
              </p>
            </div>
            <div className={styles.teamCard}>
              <span className={styles.teamRole}>Content Creator, Nigeria</span>
              <h3>Video & social production</h3>
              <p>
                Produces culturally authentic TikTok content from the dictionary database. Managed
                remotely with a clear brief and quality framework built by the founder.
              </p>
            </div>
            <div className={styles.teamCard}>
              <span className={styles.teamRole}>Language Specialist, Nigeria</span>
              <h3>Linguistic quality assurance</h3>
              <p>
                Validates tonal accuracy, diacritic correctness, and pronunciation across the
                dictionary and all published content. The integrity of the product depends on this
                role.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ANALYTICS */}
      <section className={`${styles.analyticsSection} ${styles.section}`} id="analytics">
        <Reveal><SectionLabel>05: Analytics & Instrumentation</SectionLabel></Reveal>
        <Reveal>
          <h2 className={`${styles.sectionTitle} ${styles.light}`}>
            Nothing ships<br />without tracking.
          </h2>
        </Reveal>
        <Reveal>
          <p className={styles.analyticsIntro}>
            I implemented a dual-layer analytics system: GA4 with a custom event taxonomy, and
            Supabase-first analytics for product-specific behaviour. Every meaningful user action
            on yorubadeck.com fires a tracked event.
          </p>
        </Reveal>
        <Reveal>
          <div className={styles.eventsGrid}>
            {analyticsEvents.map((e) => (
              <div key={e.type} className={styles.eventCard}>
                <span className={styles.eventType}>{e.type}</span>
                <h3>{e.heading}</h3>
                <p>{e.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal>
          <p className={styles.analyticsNote}>
            Every product decision, from what content to produce to what features to build to what
            copy to test, is grounded in real user behaviour data, not assumption.
          </p>
        </Reveal>
      </section>

      {/* BUILT */}
      <section className={styles.builtSection} id="built">
        <Reveal><SectionLabel>06: Technology</SectionLabel></Reveal>
        <Reveal>
          <h2 className={styles.sectionTitle}>
            Built end-to-end.<br />No agency. No co-founder.
          </h2>
        </Reveal>
        <Reveal>
          <div className={styles.builtGrid}>
            {builtCards.map((c) => (
              <div key={c.icon} className={styles.builtCard}>
                <span className={styles.builtIcon}>{c.icon}</span>
                <h3>{c.heading}</h3>
                <p>{c.body}</p>
                <div className={styles.techTags}>
                  {c.tags.map((t) => (
                    <span key={t} className={styles.techTag}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* iOS APP SCREENSHOTS */}
      <section className={styles.appScreensSection} id="app">
        <Reveal><SectionLabel>iOS Keyboard App</SectionLabel></Reveal>
        <Reveal>
          <h2 className={styles.sectionTitle}>
            Live on the App Store.<br />Built for typing Yorùbá.
          </h2>
        </Reveal>
        <Reveal>
          <p className={styles.appScreensIntro}>
            The Yorùbá Deck keyboard app guides users through setup, supports custom themes and
            settings, and includes a full character set with tonal marks and predictive text.
          </p>
        </Reveal>
        <Reveal>
          <AppScreenshotCarousel />
        </Reveal>
      </section>

      {/* OUTCOMES */}
      <section className={styles.outcomesSection} id="outcomes">
        <Reveal><SectionLabel>07: Results</SectionLabel></Reveal>
        <Reveal><h2 className={styles.sectionTitle}>Measured. Not claimed.</h2></Reveal>
        <Reveal>
          <div className={styles.outcomesRow}>
            <div className={styles.outcomeCard}>
              <span className={styles.outcomeNum}>200+</span>
              <span className={styles.outcomeLabel}>Monthly visitors</span>
              <p className={styles.outcomeDesc}>
                Consistent organic baseline driven by social content and mobile-first SEO.
              </p>
            </div>
            <div className={styles.outcomeCard}>
              <span className={styles.outcomeNum}>1 live</span>
              <span className={styles.outcomeLabel}>App on App Store</span>
              <p className={styles.outcomeDesc}>
                Yorùbá Deck Keyboard live on iOS. One iOS app and one Android app currently in
                development.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* SKILLS */}
      <section className={styles.skillsSection} id="skills">
        <Reveal><SectionLabel>08: What This Proves</SectionLabel></Reveal>
        <Reveal>
          <h2 className={styles.sectionTitle}>
            Skills that transfer<br />to any organisation.
          </h2>
        </Reveal>
        <Reveal>
          <div className={styles.skillsGrid}>
            {skills.map((s) => (
              <div key={s.label} className={styles.skillCard}>
                <span className={styles.skillLabel}>{s.label}</span>
                <h3>{s.heading}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection} id="contact">
        <h2 className={`${styles.sectionTitle} ${styles.light}`}>Want to talk?</h2>
        <p>
          Available for product, platform, and EdTech roles, particularly where culture,
          technology, and learning intersect.
        </p>
        <div className={styles.ctaRow}>
          <a
            href="https://www.yorubadeck.com"
            className={styles.btnPrimary}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent.caseStudyCta('visit_yorubadeck')}
          >
            Visit Yorùbá Deck
          </a>
          <a
            href="https://www.tiktok.com/@yorubadeck"
            className={styles.btnOutline}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent.caseStudyCta('tiktok')}
          >
            TikTok @yorubadeck
          </a>
          <a
            href="https://www.linkedin.com/in/lehin/"
            className={styles.btnOutline}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent.caseStudyCta('linkedin')}
          >
            LinkedIn
          </a>
          <a
            href="mailto:lehinadenekan@gmail.com"
            className={styles.btnOutline}
            onClick={() => trackEvent.caseStudyCta('email')}
          >
            Email me
          </a>
        </div>
      </section>

    </div>
  )
}
