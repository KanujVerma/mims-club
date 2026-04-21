import { Link } from 'react-router-dom'
import { Badge, Button } from 'react-bootstrap'
import { events } from '../data/events'
import MyEventRow from '../components/MyEventRow'
import './MyEvents.css'

export default function MyEvents({ rsvpIds = [], onUnRSVP }) {
  const rsvpdEvents = events.filter(e => rsvpIds.includes(e.id))

  return (
    <div className="page">
      <Badge bg="danger" className="red-tag">Your Schedule</Badge>
      <h1 className="page-title">My Events</h1>
      <p className="page-subtitle">Events you've RSVP'd to. Saved locally in your browser.</p>
      <hr className="divider" />

      {rsvpdEvents.length > 0 ? (
        <>
          <div className="section-heading my-events__heading">
            RSVP'd Events ({rsvpdEvents.length})
          </div>
          <div className="my-events__list">
            {rsvpdEvents.map(event => (
              <MyEventRow
                key={event.id}
                event={event}
                onUnRSVP={onUnRSVP}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="my-events__empty">
          <div className="my-events__empty-icon">🎵</div>
          <h2>No events yet</h2>
          <p>Head to the Events page and RSVP to something!</p>
          <Button as={Link} to="/events" variant="outline-danger" size="sm">Browse Events →</Button>
        </div>
      )}
    </div>
  )
}
