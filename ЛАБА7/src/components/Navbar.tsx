import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav className="main-nav">
      <Link to="/">Главная</Link>
      <Link to="/jokes">Шутки</Link>
      <Link to="/dogs">Собаки</Link>
      <Link to="/holidays">Праздники</Link>
    </nav>
  )
}

export default Navbar