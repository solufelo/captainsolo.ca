import { useState } from 'react'
import { Link } from 'react-router'
import { projects, type Project } from '../content/site'

const filters = [
  { id: 'all', label: 'All' },
  { id: 'code', label: 'Sites & apps' },
  { id: 'video', label: 'Video' },
  { id: 'photo', label: 'Photography' },
  { id: 'design', label: 'Design' },
  { id: 'motion', label: '3D & motion' },
  { id: 'wip', label: 'In progress' },
] as const

type FilterId = (typeof filters)[number]['id']

const matches = (p: Project, f: FilterId) => f === 'all' || (f === 'wip' ? p.status === 'wip' : p.categories.includes(f))
// An empty filter (e.g. "In progress" once everything ships) is a dead end, so hide it.
const shownFilters = filters.filter((f) => projects.some((p) => matches(p, f.id)))

export function WorkCard({ p, featured = false }: { p: Project; featured?: boolean }) {
  return (
    <li className="work-card" data-featured={featured} data-reveal>
      <Link to={`/work/${p.slug}`} className="work-link">
        <div className="work-media">
          <img src={p.image} alt="" loading="lazy" width="800" height="500" />
          <span className={`status status-${p.status}`}>{p.status === 'live' ? 'Live' : 'In progress'}</span>
          {p.video && (
            <span className="play-badge" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          )}
        </div>
        <div className="work-body">
          <h3>{p.title}</h3>
          <p className="work-for">
            <span>{p.client}</span> · {p.role}
          </p>
          {featured && <p className="work-summary">{p.summary}</p>}
          <ul className="tags">
            {p.tags.slice(0, featured ? 6 : 4).map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </Link>
    </li>
  )
}

export function WorkGrid() {
  const [filter, setFilter] = useState<FilterId>('all')
  const shown = projects.filter((p) => matches(p, filter))

  return (
    <>
      <div className="chips" role="group" aria-label="Filter work">
        {shownFilters.map((f) => (
          <button key={f.id} type="button" className="chip" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label}
            <span className="chip-count">{projects.filter((p) => matches(p, f.id)).length}</span>
          </button>
        ))}
      </div>
      <ul className="work-grid bento">
        {shown.map((p, i) => (
          <WorkCard key={p.slug} p={p} featured={i === 0 && filter === 'all'} />
        ))}
      </ul>
    </>
  )
}
