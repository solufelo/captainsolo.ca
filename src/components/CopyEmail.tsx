import { useEffect, useState } from 'react'
import { site } from '../content/site'

/** One-tap email: copies the address, falls back to mailto where the clipboard is blocked. */
export function CopyEmail({ className = 'btn', compact = false }: { className?: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1800)
    return () => clearTimeout(t)
  }, [copied])

  const copy = async (e: React.MouseEvent) => {
    try {
      await navigator.clipboard.writeText(site.email)
      e.preventDefault()
      setCopied(true)
    } catch {
      /* no clipboard permission: let the mailto: link open instead */
    }
  }

  return (
    <a href={`mailto:${site.email}`} className={`${className} copy-email`} data-magnetic="0.25" onClick={copy} data-copied={copied} aria-live="polite">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {copied ? <path d="M5 12.5 10 17l9-10" /> : <path d="M4 6h16v12H4zM4 7l8 6 8-6" />}
      </svg>
      <span>{copied ? 'Copied' : compact ? 'Email me' : site.email}</span>
    </a>
  )
}
