import { useEffect, useState } from 'react'

import {
  getNextMatch,
  type Match,
} from '../../service/footballApi'

interface NextMatchProps {
  onLoaded?: () => void
}

export function NextMatch({
  onLoaded,
}: NextMatchProps) {
  const [match, setMatch] = useState<Match | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadMatch() {
      try {
        const nextMatch = await Promise.race([
          getNextMatch(),

          new Promise<null>((resolve) =>
            setTimeout(() => resolve(null), 5000)
          ),
        ])

        if (cancelled) return

        if (nextMatch) {
          setMatch(nextMatch)
          setLastUpdated(new Date())
        }
      } catch (error) {
        console.error(
          'Erro ao carregar próximo jogo:',
          error
        )
      } finally {
        if (!cancelled) {
          setLoading(false)

          onLoaded?.()
        }
      }
    }

    loadMatch()

    return () => {
      cancelled = true
    }
  }, [onLoaded])

  if (loading) {
    return (
      <section
        className="next-match"
        aria-labelledby="next-match-title"
      >
        <div className="next-match-heading">
          <h2 id="next-match-title">
            PRÓXIMO JOGO
          </h2>
        </div>

        <div className="match-glass">
          <div
            className="glass-shine"
            aria-hidden="true"
          />

          <p>Carregando...</p>
        </div>
      </section>
    )
  }

  if (!match) {
    return (
      <section
        className="next-match"
        aria-labelledby="next-match-title"
      >
        <div className="next-match-heading">
          <h2 id="next-match-title">
            PRÓXIMO JOGO
          </h2>
        </div>

        <div className="match-glass">
          <div
            className="glass-shine"
            aria-hidden="true"
          />

          <p>
            Não foi possível carregar os
            dados do próximo jogo.
          </p>
        </div>
      </section>
    )
  }

  const matchDate = new Date(match.time)

  const displayDate =
    matchDate.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <section
      className="next-match"
      aria-labelledby="next-match-title"
      id="jogo"
    >
      <div className="next-match-heading">
        <h2 id="next-match-title">
          PRÓXIMO JOGO
        </h2>
      </div>

      <div className="match-glass">
        <div
          className="glass-shine"
          aria-hidden="true"
        />

        <div className="match-teams">
          <div className="team team-first">
            <span className="team-name">
              {match.home}
            </span>

            <img
              src={match.homeLogo}
              alt={`Escudo do ${match.home}`}
              className="team-crest"
            />
          </div>

          <span
            className="match-versus"
            aria-label="contra"
          >
            X
          </span>

          <div className="team team-second">
            <span className="team-name">
              {match.away}
            </span>

            <img
              src={match.awayLogo}
              className="team-crest"
              alt={`Escudo do ${match.away}`}
            />
          </div>
        </div>

        <div className="match-details">
          <p>{match.competition}</p>

          <time dateTime={match.time}>
            {displayDate}
          </time>

          <small
            className="match-updated"
            aria-live="polite"
          >
            {lastUpdated
              ? `Atualizado ${lastUpdated.toLocaleTimeString(
                  'pt-BR',
                  {
                    hour: '2-digit',
                    minute: '2-digit',
                  }
                )}`
              : 'Dados indisponíveis'}
          </small>
        </div>
      </div>
    </section>
  )
}