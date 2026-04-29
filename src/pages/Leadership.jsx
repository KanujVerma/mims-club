import { Badge } from 'react-bootstrap'
import { officers } from '../data/officers'
import OfficerCard from '../components/OfficerCard'
import './Leadership.css'

export default function Leadership() {
  return (
    <div className="page">
      <Badge bg="danger" className="red-tag">The Team</Badge>
      <h1 className="page-title">Leadership</h1>
      <p className="page-subtitle">Meet the officers running MIMS for 2024–25.</p>
      <hr className="divider" />
      <div className="section-heading">Executive Board</div>
      <div className="leadership__grid">
        {officers.map(officer => (
          <OfficerCard key={officer.id} officer={officer} />
        ))}
      </div>
    </div>
  )
}
