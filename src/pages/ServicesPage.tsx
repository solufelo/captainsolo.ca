import { Packages } from '../components/Packages'

export function ServicesPage() {
  return (
    <div className="page">
      <header className="page-head wrap">
        <p className="label">For businesses & creators</p>
        <h1 className="page-title">Services</h1>
      </header>
      <Packages />
    </div>
  )
}
