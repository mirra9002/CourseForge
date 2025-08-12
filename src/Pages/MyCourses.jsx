// src/Pages/MyCourses.jsx
import { useMemo } from "react";
import AuthInit from "../State/AuthInit";
import Navbar from "../Components/NavBar";

export default function MyCourses() {
  // minimal mock data to render something
  const courses = useMemo(
    () => [
      { id: 1, track: "Професія Python developer", title: "Python Basics", progress: 1 },
      { id: 2, track: "Професія Frontend developer", title: "React Fundamentals", progress: 34 },
    ],
    []
  );

  return (
    <>
      <AuthInit />
      <Navbar />

      <main className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="mb-6 text-2xl font-semibold text-gray-900">Мої курси</h1>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {courses.map(c => (
              <article
                key={c.id}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <p className="text-sm text-gray-500">{c.track}</p>
                <h2 className="mt-1 text-xl font-semibold text-gray-900">{c.title}</h2>

                <div className="mt-5">
                  <div className="mb-1 text-sm font-medium text-gray-700">{c.progress}%</div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-blue-600"
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Empty state (shows when list is empty) */}
          {courses.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-600">
              Тут поки що порожньо. Додайте свій перший курс.
            </div>
          )}
        </div>
      </main>
    </>
  );
}
