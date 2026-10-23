import { Credits } from '../components/Credits'
import { WorkGrid } from '../components/WorkGrid'
import { projects } from '../content/site'

export function WorkIndex() {
  return (
    <div className="page wrap">
      <header className="page-head">
        <p className="label">Selected work · {projects.length}</p>
        <h1 className="page-title">Work</h1>
      </header>
      <h2 className="sr-only">Projects</h2>
      <WorkGrid />
      <Credits />
    </div>
  )
}
