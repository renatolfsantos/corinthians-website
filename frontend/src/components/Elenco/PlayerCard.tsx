import type { Player } from '../../service/footballApi'

interface PlayerCardProps {
  player: Player
}

function formatPosition(position: string) {
  switch (position) {
    case 'Goalkeeper':
      return 'Goleiro'
    case 'Defender':
      return 'Defensor'
    case 'Midfielder':
      return 'Meia'
    case 'Attacker':
      return 'Atacante'
    default:
      return position
  }
}

export default function PlayerCard({
  player,
}: PlayerCardProps) {
  return (
    <article className="player-card">
      <div className="player-card-shine" />

      <div className="player-card-number">
        {player.position === 'Técnico' ? '' : (player.number ?? '--')}
      </div>

      <div className="player-card-photo-wrapper">
        <img
          loading='lazy'
          decoding='async'
          src={player.photo}
          alt={`Foto de ${player.name}`}
          className="player-card-photo"
        />
      </div>

      <div className="player-card-info">
        <span className="player-card-position">
          {formatPosition(player.position)}
        </span>

        <h4 className="player-card-name">
          {player.name}
        </h4>

        <span className="player-card-age">
          {player.age} anos
        </span>
      </div>
    </article>
  )
}