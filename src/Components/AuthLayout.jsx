export default function AuthLayout({ title, description, children }) {
  return (
    <main className="flex min-h-[calc(100svh-4.5rem)] items-center justify-center bg-gray-100 px-4 py-8 sm:py-12">
      <section className="w-full min-w-0 max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8" aria-labelledby="auth-title">
        <h1 id="auth-title" className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{title}</h1>
        {description && <p className="mt-3 text-center text-sm leading-6 text-gray-600">{description}</p>}
        <div className="mt-6">{children}</div>
      </section>
    </main>
  )
}
