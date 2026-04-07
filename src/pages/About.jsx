import { Badge } from 'react-bootstrap'
import './About.css'

const whatWeDo = [
  { title: 'Industry Panels', desc: 'Hear directly from label executives, managers, and artists.' },
  { title: 'Networking Mixers', desc: 'Build your professional network before you graduate.' },
  { title: 'Workshops', desc: 'Hands-on skills in music marketing, A&R, and more.' },
  { title: 'Career Support', desc: 'Resume reviews, mock interviews, and internship leads.' },
]

export default function About() {
  return (
    <div className="page">
      <Badge bg="danger" className="red-tag">Who We Are</Badge>
      <h1 className="page-title">About MIMS</h1>
      <hr className="divider" />

      <section className="about__mission">
        <div className="section-heading">Our Mission</div>
        <p>
          MIMS — Music Industry for Madison Students — bridges the gap between UW–Madison academics
          and the professional music business world. We bring together students passionate about
          labels, publishing, management, marketing, and live events.
        </p>
      </section>

      <hr className="divider" />

      <section>
        <div className="section-heading">What We Do</div>
        <div className="about__what-grid">
          {whatWeDo.map(item => (
            <div key={item.title} className="about__what-card">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      <section className="about__membership">
        <div className="section-heading">Membership</div>
        <p>
          Open to all UW–Madison students. No audition, no experience required — just a passion
          for the music industry. Meetings are biweekly on Tuesdays.
        </p>
      </section>
    </div>
  )
}
