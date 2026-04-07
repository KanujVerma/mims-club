import { Badge } from 'react-bootstrap'
import { events } from '../data/events'
import './Events.css'

export default function Events() {
  return (
    <div className="page">
      <Badge bg="danger" className="red-tag">What's Happening</Badge>
      <h1 className="page-title">Upcoming Events</h1>
      <p className="page-subtitle">RSVP to save events to your personal list.</p>
      <hr className="divider" />
      <div className="events__list">
        {events.map((event, index) => (
          <div key={event.id} className="event-item">
            <div className="event-item__date">{event.date}</div>
            <div className="event-item__body">
              <div className="event-item__title">{event.title}</div>
              <div className="event-item__meta">📍 {event.location} · {event.time}</div>
              <div className="event-item__desc">{event.description}</div>
            </div>
            {/* Phase 1: first event shows RSVP'd state as a static visual mock */}
            <button className={`rsvp-btn${index === 0 ? ' rsvp-btn--active' : ''}`}>
              {index === 0 ? '✓ RSVP\'d' : 'RSVP'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
