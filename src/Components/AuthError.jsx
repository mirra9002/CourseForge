export default function AuthError({ message }) {
  if (!message) return null

  return (
    <div id="auth-error" role="alert" className="flex items-start gap-2.5 rounded-xl border border-rose-100 bg-rose-50/70 px-3.5 py-3 text-left text-sm leading-5 text-rose-700">
      <svg aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="10" cy="10" r="7.5" />
        <path d="M10 6v4.5M10 14h.01" />
      </svg>
      <p className="min-w-0 break-words">{message}</p>
    </div>
  )
}
