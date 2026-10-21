import { legalPages } from '../meta'

export function Legal({ page }: { page: keyof typeof legalPages }) {
  const { title, html } = legalPages[page]
  return (
    <div className="page">
      <header className="page-head wrap narrow">
        <h1 className="page-title">{title}</h1>
      </header>
      <div className="wrap narrow prose" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
