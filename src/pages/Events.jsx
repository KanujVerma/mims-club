import { events } from '../data/events'
import PageHeader from '../components/PageHeader'
import EventCard from '../components/EventCard'
import './Events.css'

export default function Events({ rsvpIds = [], onRSVP, onUnRSVP }) {
  return (
    <div className="page">
      <PageHeader tag="What's Happening" title="Upcoming Events" subtitle="RSVP to save events to your personal list." />
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
