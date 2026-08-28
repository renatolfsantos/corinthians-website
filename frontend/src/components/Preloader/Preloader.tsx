import './Preloader.css'

export default function Preloader() {
  return (
      <div className="preloader" aria-live="polite">
        <div className="preloader-center">
        <img className="preloader-logo" src="/logo_bw.png" alt="Escudo do Corinthians" />
        </div>
    </div>
  )
}
