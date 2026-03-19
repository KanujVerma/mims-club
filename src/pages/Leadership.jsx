import { officers } from '../data/officers'
import './Leadership.css'

export default function Leadership() {
  return (
    <div className="page">
      <div className="red-tag">The Team</div>
      <h1 className="page-title">Leadership</h1>
      <p className="page-subtitle">Meet the officers running MIMS for 2024–25.</p>
      <hr className="divider" />
      <div className="section-heading">Executive Board</div>
      <div className="leadership__grid">
        {officers.map(officer => (
          <div key={officer.id} className="officer-card">
            <div className="officer-card__avatar">{officer.initials}</div>
            <div className="officer-card__name">{officer.name}</div>
            <div className="officer-card__role">{officer.role}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
