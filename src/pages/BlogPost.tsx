import { Link, useNavigate, useParams } from 'react-router'
import { PostCard } from '../components/PostCard'
import { formatDate, getPost, relatedPosts } from '../content/posts'
import { NotFound } from './NotFound'

export function BlogPost() {
  const post = getPost(useParams().slug ?? '')
  const navigate = useNavigate()
  if (!post) return <NotFound />

  // Links inside the post HTML are plain <a>; route same-site ones without a full page load.
  const routeInternalLinks = (e: React.MouseEvent) => {
    const a = (e.target as HTMLElement).closest('a')
    const href = a?.getAttribute('href')
    if (!href || !href.startsWith('/') || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    navigate(href)
  }
  const related = relatedPosts(post)

  return (
    <article className="page post">
      <header className="page-head wrap narrow">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/blog">Blog</Link>
          <span aria-hidden="true">/</span>
          <span>{post.category}</span>
        </nav>
        <h1 className="post-title">{post.title}</h1>
        <p className="post-meta">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>{post.readTime} read</span>
        </p>
      </header>

      <div className="wrap post-layout">
        {post.toc.length > 2 && (
          <aside className="toc" aria-label="On this page">
            <p className="toc-label">On this page</p>
            <ol>
              {post.toc.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`}>{t.text}</a>
                </li>
              ))}
            </ol>
          </aside>
        )}
        {/* Trusted, first-party content converted from the old site by scripts/convert_posts.py. */}
        <div className="prose" onClick={routeInternalLinks} dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>

      <section className="wrap section-tight" aria-labelledby="related-title">
        <h2 id="related-title" className="section-title small">
          Keep reading
        </h2>
        <ul className="post-grid">
          {related.map((p) => (
            <li key={p.slug}>
              <PostCard post={p} />
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}
