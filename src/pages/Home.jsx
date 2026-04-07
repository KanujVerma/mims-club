import { Link } from 'react-router-dom'
import { Badge, Button } from 'react-bootstrap'
import { events } from '../data/events'
import './Home.css'

const DiscordIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
)

const GroupMeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 14.2a7.2 7.2 0 0 1-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 0 1-6 3.22z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
)

export default function Home() {
  const previewEvents = events.slice(0, 2)

  return (
    <div className="page">
      {/* Hero */}
      <section className="home__hero">
        <Badge bg="danger" className="red-tag">Music Industry for Madison Students</Badge>
        <h1>Connect. Learn. Grow.</h1>
        <p>The home for music industry students at UW–Madison. Network with professionals, attend exclusive events, and launch your career.</p>
        <div className="home__hero-buttons">
          <Button as={Link} to="/events" variant="outline-danger" className="btn-mims btn-mims--primary">Explore Events →</Button>
          <Button as={Link} to="/about" variant="outline-secondary" className="btn-mims btn-mims--ghost">About MIMS</Button>
        </div>
      </section>

      {/* Community */}
      <section className="home__community">
        <Badge bg="danger" className="red-tag" style={{ marginBottom: '12px' }}>Join the Community</Badge>
        <div className="home__social-buttons">
          <a href="https://discord.gg/MWrqSXGcp5" target="_blank" rel="noopener noreferrer" className="social-btn social-btn--discord">
            <DiscordIcon /> Join Discord
          </a>
          <a href="https://groupme.com/join_group/110594746/LTZYss4T" target="_blank" rel="noopener noreferrer" className="social-btn social-btn--groupme">
            <GroupMeIcon /> Join GroupMe
          </a>
          <a href="https://www.instagram.com/musicindustry4madisonstudents/" target="_blank" rel="noopener noreferrer" className="social-btn social-btn--instagram">
            <InstagramIcon /> Follow Instagram
          </a>
        </div>
      </section>

      {/* Events preview */}
      <section className="home__events">
        <div className="section-heading">Upcoming Events</div>
        {previewEvents.map(event => (
          <div key={event.id} className="home__event-row">
            <div className="home__event-date">{event.date}</div>
            <div className="home__event-info">
              <div className="home__event-name">{event.title}</div>
              <div className="home__event-meta">{event.location} · {event.time}</div>
            </div>
            <Button as={Link} to="/events" variant="outline-danger" size="sm" className="btn-mims btn-mims--primary">View →</Button>
          </div>
        ))}
      </section>
    </div>
  )
}
