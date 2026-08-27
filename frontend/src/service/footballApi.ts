export interface Match {
  home: string
  away: string
  homeLogo: string
  awayLogo: string
  status: string
  statusText: string
  time: string
  competition: string
  competitionLogo: string
}

export interface Player {
  id: number
  name: string
  age: number
  number: number | null
  position: string
  photo: string
}

export async function getNextMatch(): Promise<Match | null> {
  const response = await fetch(
    'http://localhost:5292/api/matches/next'
  )

  if (!response.ok) {
    throw new Error('Erro ao buscar próximo jogo')
  }

  return await response.json()
}

export async function getPlayers(): Promise<Player[]> {
  const response = await fetch(
    'http://localhost:5292/api/players'
  )

  if (!response.ok) {
    throw new Error('Erro ao buscar jogadores')
  }

  return await response.json()
}