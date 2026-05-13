export function sortByOrder(items = []) {
  if (!Array.isArray(items)) return [];

  return [...items].sort((a, b) => {
    const orderA = Number.isFinite(Number(a?.order)) ? Number(a.order) : Number.MAX_SAFE_INTEGER;
    const orderB = Number.isFinite(Number(b?.order)) ? Number(b.order) : Number.MAX_SAFE_INTEGER;

    if (orderA !== orderB) return orderA - orderB;

    return (a?.id ?? 0) - (b?.id ?? 0);
  });
}

export function normalizeCourseOrder(course) {
  if (!course) return course;

  return {
    ...course,
    modules: sortByOrder(course.modules).map((module) => normalizeModuleOrder(module)),
  };
}

export function normalizeModuleOrder(module) {
  if (!module) return module;

  return {
    ...module,
    lessons: sortByOrder(module.lessons).map((lesson) => normalizeLessonOrder(lesson)),
  };
}

export function normalizeLessonOrder(lesson) {
  if (!lesson) return lesson;

  return {
    ...lesson,
    pages: sortByOrder(lesson.pages),
  };
}
