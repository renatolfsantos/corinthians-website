import './Header.css'

export default function Header() {
  return (
    <header>
      <nav className="nav-links">
        <a className="nav-logo" href="/">
          <img src="/logo_bw.png" alt="Logo Corinthians" />
        </a>

        <div className="nav-itens">
          <a href="#inicio">Início</a>
          <span className="nav-divisor"></span>
          <a href="#historia">História</a>
          <span className="nav-divisor"></span>
          <a href="#elenco">Elenco</a>
          <span className="nav-divisor"></span>
          <a href="#jogo">Próx. Jogo</a>
        </div>

      </nav>
    </header>

  )
}
