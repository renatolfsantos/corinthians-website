import { useEffect, useState } from 'react'

import './Elenco.css'

import {
  getPlayers,
  type Player,
} from '../../service/footballApi'

import PlayerCard from './PlayerCard'

export default function Elenco() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPlayers() {
      try {
        const data = await getPlayers()
        setPlayers(data)
      } catch (error) {
        console.error(
          'Erro ao carregar elenco:',
          error
        )
      } finally {
        setLoading(false)
      }
    }

    loadPlayers()
  }, [])

const goalkeepers: Player[] = []
const defenders: Player[] = []
const midfielders: Player[] = []
const attackers: Player[] = []
const tecnico: Player[] = []

players.forEach(player => {
  switch (player.position) {
    case 'Goalkeeper':
      goalkeepers.push(player)
      break
    case 'Defender':
      defenders.push(player)
      break
    case 'Midfielder':
      midfielders.push(player)
      break
    case 'Attacker':
      attackers.push(player)
      break
    case 'Técnico':
      tecnico.push(player)
      break
  }
})

  if (loading) {
    return (
      <section>
        <div className="elenco">
          <h2>ELENCO</h2>
          <p>Carregando elenco...</p>
        </div>
      </section>
    )
  }

  return (
    <section id='elenco'>
      <div className="elenco">
        <h2>ELENCO</h2>

        <h3>GOLEIROS</h3>

        <div className="players-grid">
          {goalkeepers.map(player => (
            <PlayerCard
              key={player.id}
              player={player}
            />
          ))}
        </div>

        <h3>DEFENSORES</h3>

        <div className="players-grid">
          {defenders.map(player => (
            <PlayerCard
              key={player.id}
              player={player}
            />
          ))}
        </div>

        <h3>MEIAS</h3>

        <div className="players-grid">
          {midfielders.map(player => (
            <PlayerCard
              key={player.id}
              player={player}
            />
          ))}
        </div>

        <h3>ATACANTES</h3>

        <div className="players-grid">
          {attackers.map(player => (
            <PlayerCard
              key={player.id}
              player={player}
            />
          ))}
        </div>
        
        <h3>TÉCNICO</h3>

        <div className="players-grid">
          {tecnico.map(player => (
            <PlayerCard
              key={player.id}
              player={player}
            />
          ))}
        </div>
      </div>
    </section>
  )
}