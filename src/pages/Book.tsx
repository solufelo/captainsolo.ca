import { Link } from 'react-router'
import { site } from '../content/site'
import { NotFound } from './NotFound'

/** The booking calendar (Cal.com, embedded). Pick a time; Cal.com emails both of us and adds it to my calendar. */
export function Book() {
  if (!site.cal) return <NotFound />
  return (
    <div className="page wrap book">
      <header className="page-head">
        <p className="label">20 minutes · free · no prep needed</p>
        <h1 className="page-title">Book a call</h1>
      </header>
      <iframe className="cal-frame" src={`https://cal.com/${site.cal}?embed=true&theme=light`} title="Pick a time for a 20-minute call" />
      <p className="muted book-alt">
        No time that works? <Link to="/contact?call=1">Send a message</Link> and I’ll find one.
      </p>
    </div>
  )
}
