import { gsap } from 'gsap'
import { useLayoutEffect, useRef } from 'react'

interface HeroProps {
  startTyping: boolean
}

export function Hero({ startTyping }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!startTyping) return

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>(
        '.hero-copy-line'
      )

      const tl = gsap.timeline()

      lines.forEach((line) => {
        const text = line.dataset.text ?? ''
        const obj = { value: 0 }

        gsap.set(line, {
          visibility: 'hidden',
        })

        tl.set(line, {
          visibility: 'visible',
        })

        tl.to(obj, {
          value: text.length,
          duration: text.length * 0.035,
          ease: 'none',
          snap: {
            value: 1,
          },
          onUpdate: () => {
            line.textContent = text.slice(
              0,
              Math.floor(obj.value)
            )
          },
        })
      })

      tl.to('.hero-cta', {
        opacity: 1,
        y: 0,
        duration: 0.5,
      })
    }, heroRef)

    return () => ctx.revert()
  }, [startTyping])

  return (
    <div
      ref={heroRef}
      className="interface-layer"
      id="inicio"
    >
      <header
        className="topbar"
        aria-label="Navegação principal"
      />

      <main
        className="hero"
        aria-labelledby="hero-title"
      >
        <div className="hero-copy">
          <h1
            id="hero-title"
            className="hero-title"
          >
            <span className="hero-title-line">
              O TIME
            </span>

            <span className="hero-title-line">
              DO POVO
            </span>
          </h1>

          <p
            className="hero-copy-line"
            data-text="Aqui tem um bando de louco"
          />

          <p
            className="hero-copy-line"
            data-text="Louco por ti, Corinthians"
          />

          <p
            className="hero-copy-line"
            data-text="Pra aqueles que acham que é pouco"
          />

          <p
            className="hero-copy-line"
            data-text="Eu vivo por ti, Corinthians"
          />

          <p
            className="hero-copy-line"
            data-text="Eu canto até ficar rouco, eu canto para empurrar"
          />

          <p
            className="hero-copy-line"
            data-text="Vamo, vamo, vamo meu Timão"
          />

          <p
            className="hero-copy-line"
            data-text="Vamo meu Timão, não para de lutar."
          />
        </div>

        <div className="hero-cta">
          VAI, CORINTHIANS!
        </div>
      </main>
    </div>
  )
}

