import { events } from '../data/events'
import { Badge } from 'react-bootstrap'
import EventCard from '../components/EventCard'
import './Events.css'

export default function Events({ rsvpIds = [], onRSVP, onUnRSVP }) {
  return (
    <div className="page">
      <Badge bg="danger" className="red-tag">What's Happening</Badge>
      <h1 className="page-title">Upcoming Events</h1>
      <p className="page-subtitle">RSVP to save events to your personal list.</p>
      <hr className="divider" />
      <div className="events__list">
        {events.map(event => (
          <EventCard
            key={event.id}
            event={event}
            isRsvpd={rsvpIds.includes(event.id)}
            onRSVP={onRSVP}
            onUnRSVP={onUnRSVP}
          />
        ))}
      </div>
    </div>
  )
}
