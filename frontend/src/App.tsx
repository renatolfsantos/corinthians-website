import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
} from 'react'

import './App.css'

import {
  Hero,
  NextMatch,
} from './components'

import Elenco from './components/Elenco/Elenco'
import Header from './components/Header/Header'
import Historia from './components/Historia/Timeline'
import Preloader from './components/Preloader/Preloader'

gsap.registerPlugin(ScrollTrigger)

const ShaderBackground = lazy(
  () =>
    import(
      './components/ShaderBackground/ShaderBackground'
    )
)

function App() {
  const appRef = useRef<HTMLDivElement | null>(null)

  const [matchLoaded, setMatchLoaded] =
    useState(false)

  const [videoLoaded, setVideoLoaded] =
    useState(false)

  const [startTyping, setStartTyping] =
    useState(false)

  const appReady =
    matchLoaded && videoLoaded

  useEffect(() => {
    const reducedMotion = window
      .matchMedia(
        '(prefers-reduced-motion: reduce)'
      )
      .matches

    const context = gsap.context(() => {
      const logo =
        document.querySelector(
          '.preloader-logo'
        )

      const intro =
        document.querySelectorAll(
          '.hero-title-line, .hero-cta'
        )

      gsap.set(logo, {
        autoAlpha: 1,
        clipPath: 'inset(0 100% 0 0)',
        scale: 0.92,
      })

      gsap.set(intro, {
        autoAlpha: 0,
        y: reducedMotion ? 0 : 40,
      })

      gsap.set('header', {
        autoAlpha: 0,
        y: reducedMotion ? 0 : -30,
      })

      gsap.to(logo, {
        clipPath: 'inset(0 0% 0 0)',
        scale: 1,
        duration: reducedMotion ? 0.2 : 1.5,
      })
    }, appRef)

    return () => context.revert()
  }, [])

  useEffect(() => {
    if (!appReady) return

    const reducedMotion = window
      .matchMedia(
        '(prefers-reduced-motion: reduce)'
      )
      .matches

    const context = gsap.context(() => {
      const layer =
        document.querySelector(
          '.preloader'
        )

      gsap.timeline()
        .to(
          layer,
          {
            autoAlpha: 0,
            duration: reducedMotion ? 0.15 : 0.9,
          },
          '+=0.3'
        )

        .to(
          'header',
          {
            autoAlpha: 1,
            y: 0,
            duration: reducedMotion ? 0.2 : 0.7,
          },
          '-=0.5'
        )
        .to(
          '.hero-title-line',
          {
            autoAlpha: 1,
            y: 0,
            clipPath: 'inset(0 0 0% 0)',
            duration: reducedMotion ? 0.3 : 1,
            stagger: 0.08,
          },
          '+=0.15'
        )
        .call(() => {
          setStartTyping(true)
        })
        .to(
          '.hero-cta',
          {
            autoAlpha: 1,
            y: 0,
            duration: reducedMotion ? 0.2 : 0.7,
          },
          '+=0.05'
        )
    }, appRef)

    return () => context.revert()
  }, [appReady])
  
  useEffect(() => {
    if (!matchLoaded) return

    const reducedMotion = window
      .matchMedia(
        '(prefers-reduced-motion: reduce)'
      )
      .matches

    const context = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(
          '.next-match-heading, .match-glass, .team, .match-versus, .match-details',
          {
            autoAlpha: 1,
          }
        )

        return
      }

      gsap.fromTo(
        '.next-match-heading',
        {
          autoAlpha: 0,
          y: 90,
          clipPath: 'inset(0 0 100% 0)',
        },
        {
          autoAlpha: 1,
          y: 0,
          clipPath: 'inset(0 0 0% 0)',
          duration: 1,
          ease: 'power3.out',

          scrollTrigger: {
            trigger: '.next-match',
            start: 'top 72%',
            toggleActions:
              'play none none reverse',
          },
        }
      )

      gsap.fromTo(
        '.match-glass',
        {
          autoAlpha: 0,
          y: 120,
          scale: 0.9,
          rotateX: 8,
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 1.25,
          ease: 'power4.out',

          scrollTrigger: {
            trigger: '.next-match',
            start: 'top 68%',
            toggleActions:
              'play none none reverse',
          },
        }
      )

      gsap.fromTo(
        '.team, .match-versus, .match-details',
        {
          autoAlpha: 0,
          y: 28,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',

          scrollTrigger: {
            trigger: '.match-glass',
            start: 'top 58%',
            toggleActions:
              'play none none reverse',
          },
        }
      )

      gsap.fromTo(
        '.glass-shine',
        {
          x: '-120%',
        },
        {
          x: '120%',
          duration: 1.8,
          ease: 'power2.inOut',

          scrollTrigger: {
            trigger: '.match-glass',
            start: 'top 65%',
            toggleActions:
              'play none none reverse',
          },
        }
      )

      ScrollTrigger.refresh()
    }, appRef)

    return () => context.revert()
  }, [matchLoaded])

  return (
    <div
      className="app-shell"
      ref={appRef}
    >
      <Preloader />

      <div className="experience">
        <Header />

        <div
          className="shader-layer"
          aria-hidden="true"
        >
          <Suspense fallback={null}>
            <ShaderBackground
              onLoaded={() =>
                setVideoLoaded(true)
              }
            />
          </Suspense>
        </div>

        <Hero
          startTyping={startTyping}
        />
      </div>

      <Historia />

      <Elenco />

      <NextMatch
        onLoaded={() =>
          setMatchLoaded(true)
        }
      />
    </div>
  )
}

export default App

