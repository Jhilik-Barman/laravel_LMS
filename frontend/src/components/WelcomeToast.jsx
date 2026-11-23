import { useEffect, useState } from 'react'

export default function WelcomeToast({ user }) {
  const [visible, setVisible] = useState(false)
  const hasUser = Boolean(user)

  useEffect(() => {
    if (!hasUser) return undefined

    const showTimer = window.setTimeout(() => setVisible(true), 20)
    const hideTimer = window.setTimeout(() => setVisible(false), 8000)

    return () => {
      window.clearTimeout(showTimer)
      window.clearTimeout(hideTimer)
    }
  }, [hasUser])

  if (!user) return null

  return (
    <aside
      role="status"
      aria-live="polite"
      className={`fixed right-4 top-24 z-50 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-indigo-100 bg-white p-5 shadow-2xl shadow-indigo-950/15 transition-all duration-500 ${
        visible ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-full opacity-0'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Welcome, {user.name}!
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Close welcome message"
          className="rounded-full px-2 text-xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          &times;
        </button>
      </div>
    </aside>
  )
}
