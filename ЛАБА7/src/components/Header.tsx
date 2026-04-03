import { Link } from "react-router-dom"

function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">

        <div className="brand">
          <h1>ВНЕШНИЕ API АНЮТА КС20</h1>
        </div>

        <nav className="main-nav">
          <Link to="/">Главная</Link>
          <Link to="/jokes">Шутки</Link>
          <Link to="/dogs">Собаки</Link>
          <Link to="/holidays">Праздники</Link>
        </nav>

      </div>
    </header>
  )
}

export default Header