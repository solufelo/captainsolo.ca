import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { awards, channels, education, experience, intro, musicCredits, postCredits, tools } from '../content/about'
import { bookCall, credits, projects, type Project } from '../content/site'

type Row = { title: string; who: string; role: string; year?: number; to?: string; href?: string }

const isMusicVideo = (p: Project) => p.tags.includes('Music video')
const caseRow = (p: Project): Row => ({ title: p.title, who: p.client, role: p.role, to: `/work/${p.slug}` })

// Every project once, in the first group it fits; then credits from public pages that have no case study here.
const groups: { title: string; rows: Row[]; note?: ReactNode }[] = [
  { title: 'Music videos', rows: [...projects.filter(isMusicVideo).map(caseRow), ...credits.map((c) => ({ ...c, who: c.artist }))] },
  {
    title: 'Brand, events and sport',
    rows: projects.filter((p) => !isMusicVideo(p) && p.categories.includes('video') && !p.categories.includes('code')).map(caseRow),
  },
  { title: 'Websites and apps', rows: projects.filter((p) => p.categories.includes('code')).map(caseRow) },
  { title: 'Photography', rows: projects.filter((p) => p.categories.includes('photo')).map(caseRow) },
  {
    title: 'Design, 3D and broadcast',
    rows: projects
      .filter((p) => !p.categories.some((c) => c === 'video' || c === 'code' || c === 'photo'))
      .map(caseRow),
  },
  {
    title: 'Music and sound',
    rows: musicCredits,
    note: (
      <>
        As Solufelo: {channels.items.map((c, i) => (
          <span key={c.href}>
            {i > 0 && ' · '}
            <a href={c.href} target="_blank" rel="noopener noreferrer">
              {c.name}
            </a>
            , {c.stat}
          </span>
        ))}{' '}
        ({channels.asOf}). Custom producer tags are on the <Link to="/voice-tags">voice tags</Link> page.
      </>
    ),
  },
  { title: 'Also on Instagram and TikTok', rows: postCredits },
]
const total = groups.reduce((n, g) => n + g.rows.length, 0)
const count = (title: string) => groups.find((g) => g.title === title)?.rows.length ?? 0

function CreditRow({ r }: { r: Row }) {
  const cells = (
    <>
      <span className="credit-title">{r.title}</span>
      <span className="credit-artist">{r.who}</span>
      <span className="credit-role">{r.role}</span>
      <span className="credit-year">{r.year}</span>
      <span className="credit-go" aria-hidden="true">
        {r.to ? '→' : '↗'}
      </span>
    </>
  )
  return r.to ? (
    <Link to={r.to} className="credit">
      {cells}
    </Link>
  ) : (
    <a href={r.href} className="credit" target="_blank" rel="noopener noreferrer">
      {cells}
    </a>
  )
}

/** Who he is, what he's done (experience from his résumés), and every credit: on this site and wherever he's named. */
export function About() {
  return (
    <div className="page about">
      <header className="page-head wrap">
        <p className="label">About</p>
        <h1 className="page-title">Camera, code and sound</h1>
        <p className="lead">{intro}</p>
        <div className="about-ctas">
          <a className="btn" href="/solomon-olufelo-resume.pdf" download>
            Download résumé (PDF)
          </a>
          <Link to={bookCall} className="btn btn-ghost">
            Book a call
          </Link>
        </div>
        <dl className="about-stats">
          <div>
            <dt>Credits on this page</dt>
            <dd>{total}</dd>
          </div>
          <div>
            <dt>Music videos</dt>
            <dd>{count('Music videos')}</dd>
          </div>
          <div>
            <dt>Releases with my name on them</dt>
            <dd>{musicCredits.length}</dd>
          </div>
          <div>
            <dt>Websites and apps</dt>
            <dd>{count('Websites and apps')}</dd>
          </div>
        </dl>
      </header>

      <section className="wrap section-tight" aria-labelledby="xp-title">
        <h2 id="xp-title" className="section-title small">
          Experience
        </h2>
        <ol className="xp">
          {experience.map((j) => (
            <li key={j.role}>
              <p className="xp-when">{j.when}</p>
              <div>
                <h3>{j.role}</h3>
                <p className="xp-org">
                  {j.org} · {j.place}
                </p>
                <ul>
                  {j.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
        <div className="about-facts">
          <div>
            <h3>Education</h3>
            <ul>
              {education.map((e) => (
                <li key={e.school}>
                  <strong>{e.school}</strong>, {e.detail} <span className="muted">· {e.when}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Awards</h3>
            <ul>
              {awards.map((a) => (
                <li key={a.name}>
                  {a.name} <span className="muted">· {a.when}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="all-credits-title">
        <div className="wrap">
          <p className="label">Everything, A to Z · {total}</p>
          <h2 id="all-credits-title" className="section-title small">
            Credits
          </h2>
          {groups.map((g) => (
            <section key={g.title} className="credit-group" aria-label={g.title}>
              <h3>
                {g.title} <span>{g.rows.length}</span>
              </h3>
              {g.note && <p className="credit-note">{g.note}</p>}
              <ul className="credit-list">
                {g.rows.map((r) => (
                  <li key={r.to ?? r.href}>
                    <CreditRow r={r} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <section className="wrap section-tight" aria-labelledby="tools-title">
        <h2 id="tools-title" className="section-title small">
          Tools
        </h2>
        <div className="tools">
          {tools.map((t) => (
            <div key={t.area}>
              <h3>{t.area}</h3>
              <ul className="tags">
                {t.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
