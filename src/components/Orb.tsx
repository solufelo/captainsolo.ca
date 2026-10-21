import type { ReactNode } from 'react'
import { Link } from 'react-router'

/** Round call to action. With a mouse it leans toward the pointer and wobbles back (Cursor.tsx drives [data-magnetic]). */
export function Orb({ to, children, size = 'md' }: { to: string; children: ReactNode; size?: 'md' | 'lg' }) {
  return (
    <Link to={to} className={`orb orb-${size}`} data-magnetic>
      <span>{children}</span>
    </Link>
  )
}
