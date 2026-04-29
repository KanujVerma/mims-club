import { useState, useEffect } from 'react'
import { Card, Button } from 'react-bootstrap'
import { motion, useReducedMotion } from 'framer-motion'
import FeedbackMessage from './FeedbackMessage'
import './EventCard.css'

export default function EventCard({ event, isRsvpd, onRSVP = () => {}, onUnRSVP = () => {} }) {
  const [showFeedback, setShowFeedback] = useState(false)
  const [hovered, setHovered] = useState(false)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (!showFeedback) return
    const timer = setTimeout(() => setShowFeedback(false), 1500)
    return () => clearTimeout(timer)
  }, [showFeedback])

  function handleRSVP() {
    onRSVP(event.id)
    setShowFeedback(true)
  }

  function handleUnRSVP() {
    onUnRSVP(event.id)
    setShowFeedback(false)
    setHovered(false)
  }

  const buttonLabel = isRsvpd ? (hovered ? 'Remove' : "✓ RSVP'd") : 'RSVP'

  return (
    <motion.div
      whileHover={prefersReduced ? {} : { y: -2, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
    >
      <Card className="event-card">
        <Card.Body>
          <div className="event-card__date">{event.date}</div>
          <div className="event-card__content">
            <Card.Title as="div" className="event-card__title">{event.title}</Card.Title>
            <Card.Subtitle className="event-card__meta">
              📍 {event.location} · {event.time}
            </Card.Subtitle>
            <Card.Text className="event-card__desc">{event.description}</Card.Text>
            <FeedbackMessage visible={showFeedback} />
          </div>
          <Button
            variant={isRsvpd ? 'danger' : 'outline-danger'}
            size="sm"
            className="event-card__rsvp"
            onClick={isRsvpd ? handleUnRSVP : handleRSVP}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {buttonLabel}
          </Button>
        </Card.Body>
      </Card>
    </motion.div>
  )
}
