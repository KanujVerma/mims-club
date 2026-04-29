import { officers } from '../data/officers'
import PageHeader from '../components/PageHeader'
import OfficerCard from '../components/OfficerCard'
import './Leadership.css'

export default function Leadership() {
  return (
    <div className="page">
      <PageHeader tag="The Team" title="Leadership" subtitle="Meet the officers running MIMS for 2024–25." />
      <div className="section-heading">Executive Board</div>
      <div className="leadership__grid">
        {officers.map(officer => (
          <OfficerCard key={officer.id} officer={officer} />
        ))}
      </div>
    </div>
  )
}
