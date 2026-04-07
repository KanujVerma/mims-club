import { Link } from 'react-router-dom'
import { Badge } from 'react-bootstrap'
import './MyEvents.css'

export default function MyEvents() {
  return (
    <div className="page">
      <Badge bg="danger" className="red-tag">Your Schedule</Badge>
      <h1 className="page-title">My Events</h1>
      <p className="page-subtitle">Events you've RSVP'd to. Saved locally in your browser.</p>
      <hr className="divider" />

      {/* Phase 1: always shows empty state — localStorage wired up in Phase 2 */}
      <div className="my-events__empty">
        <div className="my-events__empty-icon">🎵</div>
        <h2>No events yet</h2>
        <p>Head to the Events page and RSVP to something!</p>
        <Link to="/events" className="btn-red">Browse Events →</Link>
      </div>
    </div>
  )
}
