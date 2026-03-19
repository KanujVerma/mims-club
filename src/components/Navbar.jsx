import { NavLink } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__logo">MIMS</NavLink>
        <ul className="navbar__links">
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/leadership">Leadership</NavLink></li>
          <li><NavLink to="/events">Events</NavLink></li>
          <li><NavLink to="/my-events">My Events</NavLink></li>
        </ul>
      </div>
    </nav>
  )
}
