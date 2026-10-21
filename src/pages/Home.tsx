import { Link } from 'react-router'
import { Hero } from '../components/Hero'
import { WorkGrid } from '../components/WorkGrid'
import { Packages } from '../components/Packages'
import { ContactSection } from '../components/ContactForm'
import { PostCard } from '../components/PostCard'
import { about, projects, services } from '../content/site'
import { posts } from '../content/posts'

export function Home() {
  return (
    <>
      <Hero />

      {/* Work comes straight after the hero: it's what a client came to see. */}
      <section id="work" className="section" aria-labelledby="work-title">
        <div className="wrap">
          <header className="section-head row" data-reveal>
            <div>
              <p className="kicker">Selected work</p>
              <h2 id="work-title" className="section-title">
                Work
              </h2>
            </div>
            <p className="lead">Sites, apps and reels. Click any one for the full story. Works in progress are labelled honestly.</p>
          </header>
          <WorkGrid />
        </div>
      </section>

      <Packages />

      <section id="services" className="section" aria-labelledby="services-title">
        <div className="wrap">
          <header className="section-head" data-reveal>
            <p className="kicker">What I do</p>
            <h2 id="services-title" className="section-title">
              Services
            </h2>
            <p className="lead">Full-stack builds and camera work, scoped honestly and shipped with clear demos and source.</p>
          </header>
          <div className="service-groups">
            {services.map((g) => (
              <div key={g.group} className="service-group" data-reveal>
                <h3 className="group-label">{g.group}</h3>
                <ul className="service-list">
                  {g.items.map((s) => (
                    <li key={s.title} className="service">
                      <h4>{s.title}</h4>
                      <p>{s.body}</p>
                      <ul className="tags">
                        {s.tags.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                      {s.link &&
                        (s.link.href.startsWith('/') ? (
                          <Link to={s.link.href} className="arrow-link">
                            {s.link.label}
                          </Link>
                        ) : (
                          <a href={s.link.href} className="arrow-link" target="_blank" rel="noopener noreferrer">
                            {s.link.label}
                          </a>
                        ))}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="section section-alt" aria-labelledby="about-title">
        <div className="wrap about-grid">
          <figure className="portrait" data-reveal>
            <img src={about.portrait} alt="Solomon Olufelo" width="640" height="800" loading="lazy" />
          </figure>
          <div data-reveal>
            <p className="kicker">Brampton · Captain Solo</p>
            <h2 id="about-title" className="section-title">
              About
            </h2>
            <p className="about-lede">{about.heading}</p>
            {about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <dl className="stats">
              <div>
                <dt>1,400+</dt>
                <dd>Video & audio jobs delivered</dd>
              </div>
              <div>
                <dt>{projects.length}</dt>
                <dd>Projects with their own page</dd>
              </div>
              <div>
                <dt>{posts.length}</dt>
                <dd>Guides on the blog</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="latest-title">
        <div className="wrap">
          <header className="section-head row" data-reveal>
            <div>
              <p className="kicker">Knowledge hub</p>
              <h2 id="latest-title" className="section-title">
                From the blog
              </h2>
            </div>
            <Link to="/blog" className="arrow-link">
              All {posts.length} articles
            </Link>
          </header>
          <ul className="post-grid">
            {posts.slice(0, 3).map((p) => (
              <li key={p.slug} data-reveal>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ContactSection />
    </>
  )
}
