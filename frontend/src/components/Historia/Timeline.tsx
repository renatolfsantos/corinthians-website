import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'

import './Timeline.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const events = [
  {
    year: '1910',
    title: 'O nascimento do Corinthians',
    text: 'Em 1º de setembro de 1910, o Sport Club Corinthians Paulista é fundado no bairro do Bom Retiro, em São Paulo.',
    image: '/historia/1910.webp',
  },
  {
    year: '1914',
    title: 'O primeiro título',
    text: 'O Corinthians conquista seu primeiro Campeonato Paulista, iniciando uma história marcada por grandes conquistas.',
    image: '/historia/1914.webp',
  },
  {
    year: '1977',
    title: 'A espera chega ao fim',
    text: 'Depois de 23 anos, o Corinthians volta a conquistar o Campeonato Paulista. O título se torna um dos momentos mais marcantes da história do clube.',
    image: '/historia/1977.webp',
  },
  {
    year: '1990',
    title: 'O primeiro Campeonato Brasileiro',
    text: 'O Corinthians conquista pela primeira vez o Campeonato Brasileiro, consolidando sua força no cenário nacional.',
    image: '/historia/1990.webp',
  },
  {
    year: '2012',
    title: 'A América e o mundo',
    text: 'Invicto, o Corinthians conquista sua primeira Libertadores. Meses depois, vence o Chelsea e se torna campeão mundial pela segunda vez.',
    image: '/historia/2012.webp',
  },
  {
    year: 'Hoje',
    title: 'Uma história que continua',
    text: 'Mais de um século depois, o Corinthians continua construindo sua história dentro e fora dos campos.',
    image: '/historia/hoje.webp',
  },
]

export default function Historia() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const lineRef = useRef<HTMLDivElement | null>(null)

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>('.history-event')

      gsap.set(cards, {
        autoAlpha: 0,
        y: 80,
      })

      gsap.set('.history-year', {
        autoAlpha: 0,
        scale: 0.7,
      })

      gsap.set('.history-line-progress', {
        scaleY: 0,
        transformOrigin: 'top center',
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${events.length * 1600}`,
          scrub: 2,
          pin: true,
          anticipatePin: 1,
        },
      })

      cards.forEach((card, index) => {
        const year = card.querySelector('.history-year')
        const content = card.querySelector('.history-content')
        const image = card.querySelector('.history-image')
        
        tl.to({}, { duration: 0.4 })
        tl.addLabel(`event-${index}`)

        tl.to(
          year,
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.35,
            ease: 'power2.out',
          },
          `event-${index}`
        )

        tl.to(
          card,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: 'power3.out',
          },
          `event-${index}+=0.1`
        )

        tl.fromTo(
          content,
          {
            x: index % 2 === 0 ? -50 : 50,
            autoAlpha: 0,
          },
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.5,
            ease: 'power3.out',
          },
          `event-${index}+=0.15`
        )

        tl.fromTo(
          image,
          {
            scale: 1.12,
            autoAlpha: 0,
            filter: 'grayscale(100%) contrast(1.1)',
          },
          {
            scale: 1,
            autoAlpha: 1,
            filter: 'grayscale(0%) contrast(1.05)',
            duration: 0.8,
            ease: 'power3.out',
          },
          `event-${index}+=0.35`
        )

        if (index < cards.length - 1) {
          tl.to(
            card,
            {
              autoAlpha: 0.01,
              duration: 0.4,
            },
            `event-${index}+=3`
          )
        }
      })

      tl.to(
        '.history-line-progress',
        {
          scaleY: 1,
          duration: tl.duration(),
          ease: 'none',
        },
        0
      )
    },
    {
      scope: sectionRef,
    }
  )

  return (
    <section
      ref={sectionRef}
      className="history"
      id="historia"
    >
      <div className="history-header">
        <span>SPORT CLUB CORINTHIANS PAULISTA</span>

        <h2>
          UMA HISTÓRIA
          <br />
          <strong>ALÉM DO FUTEBOL</strong>
        </h2>
      </div>

      <div className="history-line">
        <div
          ref={lineRef}
          className="history-line-progress"
        />
      </div>

      <div className="history-events">
        {events.map((event, index) => (
          <article
            className={`history-event ${
              index % 2 === 0
                ? 'history-event-left'
                : 'history-event-right'
            }`}
            key={event.year}
          >
            <div className="history-year">
              {event.year}
            </div>

            <div className="history-content">

              <h3>{event.title}</h3>

              <p>{event.text}</p>
            </div>

            <div className="history-image-wrapper">
              <img
                className="history-image"
                src={event.image}
                alt=""
                loading="lazy"
                decoding="async"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

