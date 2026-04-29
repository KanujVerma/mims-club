import './OfficerCard.css'

export default function OfficerCard({ officer }) {
  return (
    <div className="officer-card">
      <div className="officer-card__avatar">{officer.initials}</div>
      <div className="officer-card__name">{officer.name}</div>
      <div className="officer-card__role">{officer.role}</div>
    </div>
  )
}
