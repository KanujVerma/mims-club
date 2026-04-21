import { Button } from 'react-bootstrap'
import './MyEventRow.css'

export default function MyEventRow({ event, onUnRSVP }) {
  return (
    <div className="my-event-row">
      <div className="my-event-row__info">
        <div className="my-event-row__title">{event.title}</div>
        <div className="my-event-row__meta">{event.date} · {event.location}</div>
      </div>
      <Button
        variant="outline-danger"
        size="sm"
        onClick={() => onUnRSVP(event.id)}
      >
        Remove
      </Button>
    </div>
  )
}
