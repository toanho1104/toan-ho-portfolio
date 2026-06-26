'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: '▦' },
  { href: '/profile', label: 'Profile', icon: '◉' },
  { href: '/projects', label: 'Projects', icon: '◈' },
  { href: '/skills', label: 'Skills', icon: '◎' },
  { href: '/experiences', label: 'Experiences', icon: '◷' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 bg-base-100 border-r border-base-300 flex flex-col">
      <div className="p-5 border-b border-base-300">
        <h1 className="font-bold text-lg tracking-tight">Toan Ho</h1>
        <p className="text-xs text-base-content/50 mt-0.5">Back Office</p>
      </div>
      <nav className="flex-1 p-3">
        <ul className="menu menu-sm gap-1 p-0">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={pathname === item.href ? 'active' : ''}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-3 border-t border-base-300">
        <button className="btn btn-ghost btn-sm w-full justify-start gap-2 text-error">
          <span>⎋</span> Sign out
        </button>
      </div>
    </aside>
  )
}
