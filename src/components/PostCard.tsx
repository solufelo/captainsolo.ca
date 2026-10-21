import { Link } from 'react-router'
import { formatDate, type Post } from '../content/posts'

export function PostCard({ post }: { post: Post }) {
  return (
    <Link to={`/blog/${post.slug}`} className="post-card">
      <p className="post-meta">
        <span className="cat">{post.category}</span>
        <span>{post.readTime} read</span>
      </p>
      <h3>{post.title}</h3>
      <p className="post-excerpt">{post.excerpt}</p>
      <p className="post-foot">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span className="arrow" aria-hidden="true">
          →
        </span>
      </p>
    </Link>
  )
}
