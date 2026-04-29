import { events } from '../data/events'
import { motion, useReducedMotion } from 'framer-motion'
import PageHeader from '../components/PageHeader'
import EventCard from '../components/EventCard'
import AnimatedPage from '../components/AnimatedPage'
import './Events.css'

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

export default function Events({ rsvpIds = [], onRSVP, onUnRSVP }) {
  const prefersReduced = useReducedMotion()

  return (
    <AnimatedPage>
      <div className="page">
        <PageHeader tag="What's Happening" title="Upcoming Events" subtitle="RSVP to save events to your personal list." />
        <motion.div
          className="events__list"
          variants={prefersReduced ? {} : listVariants}
          initial="hidden"
          animate="visible"
        >
          {events.map(event => (
            <motion.div key={event.id} variants={prefersReduced ? {} : itemVariants}>
              <EventCard
                event={event}
                isRsvpd={rsvpIds.includes(event.id)}
                onRSVP={onRSVP}
                onUnRSVP={onUnRSVP}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedPage>
  )
}
