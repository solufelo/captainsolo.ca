import { useState } from 'react'
import { PostCard } from '../components/PostCard'
import { categories, posts } from '../content/posts'

export function BlogIndex() {
  const [cat, setCat] = useState('all')
  const shown = cat === 'all' ? posts : posts.filter((p) => p.category === cat)

  return (
    <div className="page">
      <header className="page-head wrap">
        <p className="kicker">Knowledge hub</p>
        <h1 className="page-title">Blog</h1>
        <p className="lead">Guides on web development, videography, music production, study tools and running a small business in Brampton and the GTA.</p>
      </header>
      <div className="wrap">
        <div className="chips" role="group" aria-label="Filter articles">
          {['all', ...categories].map((c) => (
            <button key={c} type="button" className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>
              {c === 'all' ? 'All' : c}
              <span className="chip-count">{c === 'all' ? posts.length : posts.filter((p) => p.category === c).length}</span>
            </button>
          ))}
        </div>
        <ul className="post-grid">
          {shown.map((p) => (
            <li key={p.slug}>
              <PostCard post={p} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
