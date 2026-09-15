import { useEffect, useRef, useState } from 'react';
import { Link, useBlocker } from 'react-router-dom';
import LessonContent from '../Components/LessonContent.jsx';
import { api, uploadMedia } from '../api.js';
import '../Styles/course-studio.css';

const endpoint = '/api/authoring/courses/';
const key = () => crypto.randomUUID();
const blankPage = (n = 1) => ({ _key: key(), title: `Page ${n}`, type: 'theory', data: [{ _key: key(), type: 'MD', content: '' }], tasks: [] });
const blankLesson = (n = 1) => ({ _key: key(), title: `Lesson ${n}`, description: '', pages: [blankPage()] });
const blankModule = (n = 1) => ({ _key: key(), title: `Module ${n}`, description: '', lessons: [blankLesson()] });

function hydrate(course) {
  return { ...course, modules: course.modules.map(module => ({ ...module, _key: key(),
    lessons: module.lessons.map(lesson => ({ ...lesson, _key: key(), pages: lesson.pages.map(page => ({
      ...page, _key: key(), data: page.data.map(block => ({ ...block, _key: key() })),
      tasks: page.tasks.map(task => ({ ...task, _key: key() })),
    })) })),
  })) };
}

function payload(course) {
  return JSON.parse(JSON.stringify({ ...course, tags: course.tags.map(tag => tag.trim()).filter(Boolean) }, (name, value) => ['_key', 'preview_tasks'].includes(name) ? undefined : value));
}

function move(items, index, direction) {
  const next = [...items];
  [next[index], next[index + direction]] = [next[index + direction], next[index]];
  return next;
}

function OrderButtons({ index, count, onMove, onDelete, label }) {
  return <span className="studio-order">
    <button type="button" disabled={index === 0} aria-label={`Move ${label} up`} onClick={() => onMove(-1)}>↑</button>
    <button type="button" disabled={index === count - 1} aria-label={`Move ${label} down`} onClick={() => onMove(1)}>↓</button>
    <button type="button" className="danger" aria-label={`Delete ${label}`} onClick={onDelete}>×</button>
  </span>;
}

function Structure({ course, selected, onSelect, onChange }) {
  function updateModule(index, update) {
    onChange({ ...course, modules: course.modules.map((module, i) => i === index ? { ...module, ...update } : module) });
  }
  function updateLesson(mi, li, update) {
    updateModule(mi, { lessons: course.modules[mi].lessons.map((lesson, i) => i === li ? { ...lesson, ...update } : lesson) });
  }
  function remove(label, action) {
    if (window.confirm(`Delete this ${label} and all of its content? The change will be applied when you save the course.`)) action();
  }
  return <aside className="studio-structure">
    <h2>2. Course structure</h2>
    <p className="studio-muted">Module → lesson → pages. Use the arrows to change the order.</p>
    {course.modules.map((module, mi) => <section key={module._key} className="studio-module">
      <div className="studio-row"><strong>Module {mi + 1}</strong>
        <OrderButtons index={mi} count={course.modules.length} label="module"
          onMove={direction => onChange({ ...course, modules: move(course.modules, mi, direction) })}
          onDelete={() => remove('module', () => onChange({ ...course, modules: course.modules.filter((_, i) => i !== mi) }))} />
      </div>
      <input aria-label={`Module ${mi + 1} title`} maxLength={256} value={module.title} onChange={e => updateModule(mi, { title: e.target.value })} />
      <input aria-label={`Module ${mi + 1} description`} placeholder="Module description" maxLength={1024} value={module.description || ''} onChange={e => updateModule(mi, { description: e.target.value })} />
      {module.lessons.map((lesson, li) => <div key={lesson._key} className="studio-lesson">
        <div className="studio-row"><strong>Lesson {mi + 1}.{li + 1}</strong>
          <OrderButtons index={li} count={module.lessons.length} label="lesson"
            onMove={direction => updateModule(mi, { lessons: move(module.lessons, li, direction) })}
            onDelete={() => remove('lesson', () => updateModule(mi, { lessons: module.lessons.filter((_, i) => i !== li) }))} />
        </div>
        <input aria-label={`Lesson ${mi + 1}.${li + 1} title`} maxLength={256} value={lesson.title} onChange={e => updateLesson(mi, li, { title: e.target.value })} />
        <input aria-label={`Lesson ${mi + 1}.${li + 1} description`} placeholder="Lesson description" maxLength={1024} value={lesson.description || ''} onChange={e => updateLesson(mi, li, { description: e.target.value })} />
        {lesson.pages.map((page, pi) => <div key={page._key} className="studio-row studio-page-link">
          <button type="button" className={selected === page._key ? 'selected' : ''} onClick={() => onSelect(page._key)}>{pi + 1}. {page.title || 'Untitled'}</button>
          <OrderButtons index={pi} count={lesson.pages.length} label="page"
            onMove={direction => updateLesson(mi, li, { pages: move(lesson.pages, pi, direction) })}
            onDelete={() => remove('page', () => updateLesson(mi, li, { pages: lesson.pages.filter((_, i) => i !== pi) }))} />
        </div>)}
        <button type="button" onClick={() => { const page = blankPage(lesson.pages.length + 1); updateLesson(mi, li, { pages: [...lesson.pages, page] }); onSelect(page._key); }}>+ Page</button>
      </div>)}
      <button type="button" onClick={() => updateModule(mi, { lessons: [...module.lessons, blankLesson(module.lessons.length + 1)] })}>+ Lesson</button>
    </section>)}
    <button type="button" onClick={() => onChange({ ...course, modules: [...course.modules, blankModule(course.modules.length + 1)] })}>+ Module</button>
  </aside>;
}

const markdownHelp = `# Heading\n## Subheading\n**Bold** and *italic*\n- List item\n1. Numbered item\n[Link](https://example.com)\n![Image description](/api/media/ID/content/)\n> Quote\n\n\`\`\`python\nprint("Hello!")\n\`\`\`\n\n| Column 1 | Column 2 |\n| --- | --- |\n| Value | Value |`;

function TaskEditor({ task, onChange }) {
  return <div className="studio-task-editor">
    <label>Question<input maxLength={200} value={task.title} onChange={e => onChange({ ...task, title: e.target.value })} /></label>
    <label>Answer type<select value={task.type} onChange={e => onChange({ ...task, type: e.target.value, correct: e.target.value === 'single' ? task.correct.slice(0, 1) : task.correct })}>
      <option value="single">One answer (single-select)</option><option value="multi">Multiple answers (multi-select)</option>
    </select></label>
    <p className="studio-muted">Mark the correct answer or answers using the controls on the left.</p>
    {task.options.map((option, index) => <div key={option.id} className="studio-row">
      <input aria-label={`Correct answer ${index + 1}`} type={task.type === 'single' ? 'radio' : 'checkbox'} name={`answer-${task._key}`}
        checked={task.correct.includes(option.id)} onChange={e => onChange({ ...task,
          correct: task.type === 'single' ? [option.id] : e.target.checked ? [...task.correct, option.id] : task.correct.filter(id => id !== option.id),
        })} />
      <input aria-label={`Option ${index + 1}`} maxLength={2000} value={option.text} onChange={e => onChange({ ...task, options: task.options.map(item => item.id === option.id ? { ...item, text: e.target.value } : item) })} />
      <button type="button" aria-label={`Delete option ${index + 1}`} disabled={task.options.length <= 2} onClick={() => onChange({ ...task, options: task.options.filter(item => item.id !== option.id), correct: task.correct.filter(id => id !== option.id) })}>×</button>
    </div>)}
    <button type="button" disabled={task.options.length >= 30} onClick={() => onChange({ ...task, options: [...task.options, { id: key(), text: '' }] })}>+ Answer option</button>
    <label>Attempt limit (leave empty for unlimited)<input type="number" min="1" value={task.max_submissions ?? ''} onChange={e => onChange({ ...task, max_submissions: e.target.value ? Number(e.target.value) : null })} /></label>
  </div>;
}

function PageEditor({ page, onChange, onUploading }) {
  const [upload, setUpload] = useState(null);
  const [error, setError] = useState('');
  const [library, setLibrary] = useState(null);
  const [libraryPage, setLibraryPage] = useState(1);
  const [libraryBusy, setLibraryBusy] = useState(false);
  const activeMarkdown = useRef(null);
  const textareaRefs = useRef({});
  function insert(media) {
    if (media.type === 'video' || media.media_type === 'video') {
      onChange({ ...page, data: [...page.data, { _key: key(), type: 'VIDEO', content: media.url }] });
      return;
    }
    const blockKey = activeMarkdown.current;
    const block = page.data.find(item => item._key === blockKey && item.type === 'MD');
    const snippet = `\n![Image description](${media.url})\n`;
    if (block) {
      const input = textareaRefs.current[blockKey];
      const start = input?.selectionStart ?? block.content.length;
      const end = input?.selectionEnd ?? start;
      onChange({ ...page, data: page.data.map(item => item === block ? { ...item, content: block.content.slice(0, start) + snippet + block.content.slice(end) } : item) });
    } else onChange({ ...page, data: [...page.data, { _key: key(), type: 'MD', content: snippet }] });
  }
  async function loadLibrary(next = 1) {
    setLibraryBusy(true); setError('');
    try {
      const data = await api(`/api/media/?status=completed&page=${next}`);
      setLibrary(old => ({ ...data, results: next === 1 ? data.results : [...(old?.results || []), ...data.results] }));
      setLibraryPage(next);
    } catch (err) { setError(err.message); }
    finally { setLibraryBusy(false); }
  }
  async function uploadFile(file) {
    if (!file || upload !== null) return;
    setError(''); setUpload(0); onUploading(true);
    try { const media = await uploadMedia(file, setUpload); insert(media); setLibrary(null); }
    catch (err) { setError(err.message); }
    finally { setUpload(null); onUploading(false); }
  }
  const previewBlocks = [...page.data.map(block => block.type === 'TASK'
    ? { ...block, content: page.preview_tasks?.find(task => task.id === block.content.id) || block.content } : block),
    ...page.tasks.map(task => ({ type: 'TASK', content: { ...task, id: task.id || task._key, spec: { items: [{ options: task.options, correct: task.correct }] } } }))];
  return <section className="studio-editor">
    <h2>3. Page content</h2>
    <fieldset disabled={upload !== null}>
      <label>Page title<input maxLength={128} value={page.title} onChange={e => onChange({ ...page, title: e.target.value })} /></label>
      <details className="studio-help"><summary>Markdown quick reference</summary>
        <p>Separate paragraphs with a blank line. HTML is disabled. Upload images with the button below or paste them from the clipboard. Use separate Code, Video, and LaTeX blocks for those content types.</p>
        <pre>{markdownHelp}</pre>
      </details>
      <div className="studio-toolbar">
        <label className="studio-upload">Upload image / video
          <input type="file" accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm" onChange={e => { uploadFile(e.target.files[0]); e.target.value = ''; }} />
        </label>
        <button type="button" disabled={libraryBusy} onClick={() => loadLibrary()}>My uploaded files</button>
      </div>
      <p className="studio-muted">An image is inserted into the last selected Markdown block. Images up to 20 MB; MP4 / WebM up to 500 MB.</p>
      {library && <div className="studio-library">
        {!library.results.length && <p>No uploaded files yet.</p>}
        {library.results.map(media => <button type="button" key={media.id} onClick={() => insert(media)}>{media.media_type === 'video' ? 'Video' : 'Image'}: {media.original_filename}</button>)}
        {library.next && <button type="button" disabled={libraryBusy} onClick={() => loadLibrary(libraryPage + 1)}>Load more</button>}
      </div>}
      {page.data.map((block, index) => <section key={block._key} className="studio-block">
        <div className="studio-row"><strong>{block.type === 'MD' ? 'Markdown' : block.type}</strong>
          <OrderButtons index={index} count={page.data.length} label="block"
            onMove={direction => onChange({ ...page, data: move(page.data, index, direction) })}
            onDelete={() => { if (window.confirm('Delete this block?')) onChange({ ...page, data: page.data.filter((_, i) => i !== index) }); }} />
        </div>
        {['MD', 'CODE', 'LATEX', 'VIDEO', 'IMAGE'].includes(block.type) ? <textarea
          aria-label={`${block.type} block ${index + 1}`} className={['MD', 'CODE'].includes(block.type) ? 'studio-markdown' : ''}
          ref={element => { textareaRefs.current[block._key] = element; }}
          value={block.content} rows={block.type === 'MD' ? 14 : block.type === 'CODE' ? 10 : 3}
          onFocus={() => { if (block.type === 'MD') activeMarkdown.current = block._key; }}
          onPaste={e => { const file = [...e.clipboardData.files].find(item => item.type.startsWith('image/')); if (file) { e.preventDefault(); uploadFile(file); } }}
          onChange={e => onChange({ ...page, data: page.data.map(item => item._key === block._key ? { ...item, content: e.target.value } : item) })} />
          : <p>This existing block will be preserved without changes.</p>}
      </section>)}
      <div className="studio-toolbar">
        <button type="button" onClick={() => onChange({ ...page, data: [...page.data, { _key: key(), type: 'MD', content: '' }] })}>+ Markdown</button>
        <button type="button" onClick={() => onChange({ ...page, data: [...page.data, { _key: key(), type: 'CODE', content: '' }] })}>+ Code block</button>
        <button type="button" onClick={() => onChange({ ...page, data: [...page.data, { _key: key(), type: 'LATEX', content: '' }] })}>+ LaTeX formula</button>
      </div>
      <h3>Quizzes at the end of the page</h3>
      {page.tasks.map((task, index) => <section key={task._key} className="studio-block">
        <div className="studio-row"><strong>Quiz {index + 1}</strong>
          <OrderButtons index={index} count={page.tasks.length} label="quiz"
            onMove={direction => onChange({ ...page, tasks: move(page.tasks, index, direction) })}
            onDelete={() => { if (window.confirm('Delete this quiz?')) onChange({ ...page, tasks: page.tasks.filter((_, i) => i !== index) }); }} />
        </div>
        <TaskEditor task={task} onChange={updated => onChange({ ...page, tasks: page.tasks.map(item => item._key === task._key ? updated : item) })} />
      </section>)}
      <button type="button" onClick={() => onChange({ ...page, tasks: [...page.tasks, { _key: key(), title: '', type: 'single', options: [{ id: key(), text: '' }, { id: key(), text: '' }], correct: [], max_submissions: null, max_score: '100' }] })}>+ Quiz</button>
    </fieldset>
    {upload !== null && <p role="status">{upload < 100 ? `Uploading: ${upload}%` : 'Verifying the file in R2…'}</p>}
    {error && <p className="studio-error" role="alert">{error}</p>}
    <section className="studio-preview"><h2>Page preview</h2><p className="studio-muted">This uses the same renderer as the lesson page. Quiz checks in the preview do not save attempts.</p>
      <h2>{page.title}</h2><LessonContent blocks={previewBlocks} preview />
    </section>
  </section>;
}

export default function CourseStudio() {
  const [user, setUser] = useState(undefined);
  const [canEdit, setCanEdit] = useState(undefined);
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(null);
  const [saved, setSaved] = useState('');
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [counts, setCounts] = useState({ modules: 1, lessons: 1, pages: 1 });
  const dirty = Boolean(course && JSON.stringify(payload(course)) !== saved);
  const blocker = useBlocker(dirty || uploading);
  useEffect(() => {
    if (blocker.state === 'blocked') {
      if (!uploading && window.confirm('You have unsaved changes. Leave the editor?')) blocker.proceed();
      else blocker.reset();
    }
  }, [blocker, uploading]);
  useEffect(() => {
    function warn(event) { if (dirty || uploading) { event.preventDefault(); event.returnValue = ''; } }
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty, uploading]);
  useEffect(() => {
    let live = true;
    async function init() {
      try {
        const me = await api('/api/users/me/');
        if (!live) return;
        setUser(me);
        try {
          const list = await api(endpoint);
          if (live) { setCourses(list); setCanEdit(true); }
        } catch (err) {
          if (live) {
            setCanEdit(false);
            if (![401, 403].includes(err.status)) setError(err.message);
          }
        }
      } catch (err) { if (live) { setUser(null); setError(err.status === 401 ? '' : err.message); } }
    }
    init(); return () => { live = false; };
  }, []);
  function maySwitch() { return !uploading && (!dirty || window.confirm('Discard the unsaved course changes?')); }
  function change(next) { setCourse(next); setMessage(''); }
  function install(data) {
    const next = hydrate(data); setCourse(next); setSaved(JSON.stringify(payload(next)));
    setSelected(next.modules[0]?.lessons[0]?.pages[0]?._key || null);
  }
  async function openCourse(id) {
    if (!maySwitch()) return;
    setBusy(true); setError(''); setMessage('');
    try { install(await api(`${endpoint}${id}/`)); }
    catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  function create() {
    if (!maySwitch()) return;
    if (Object.values(counts).some(value => !Number.isInteger(value) || value < 1 || value > 100) || counts.modules * counts.lessons * counts.pages > 1000) {
      setError('Enter a value from 1 to 100 for each level, with no more than 1,000 pages in total.'); return;
    }
    const modules = Array.from({ length: counts.modules }, (_, mi) => ({ ...blankModule(mi + 1),
      lessons: Array.from({ length: counts.lessons }, (_, li) => ({ ...blankLesson(li + 1), pages: Array.from({ length: counts.pages }, (_, pi) => blankPage(pi + 1)) })),
    }));
    setCourse({ title: 'New course', description: '', category: 'practice', difficulty: 'easy', tags: [], is_public: false, modules });
    setSaved(''); setSelected(modules[0].lessons[0].pages[0]._key); setError(''); setMessage('');
  }
  async function save(isPublic = course.is_public) {
    setBusy(true); setError(''); setMessage('');
    try {
      const data = await api(`${endpoint}${course.id ? `${course.id}/` : ''}`, { method: course.id ? 'PUT' : 'POST', body: { ...payload(course), is_public: isPublic } });
      // Preserve the selected page by its position while new server IDs arrive.
      const position = course.modules.flatMap((m, mi) => m.lessons.flatMap((l, li) => l.pages.map((p, pi) => ({ key: p._key, mi, li, pi })))).find(p => p.key === selected);
      const next = hydrate(data); setCourse(next); setSaved(JSON.stringify(payload(next)));
      setSelected(position ? next.modules[position.mi]?.lessons[position.li]?.pages[position.pi]?._key : null);
      setCourses(old => [{ id: data.id, title: data.title, is_public: data.is_public }, ...old.filter(item => item.id !== data.id)]);
      setMessage(isPublic ? 'Course saved and published.' : 'Draft saved.');
    } catch (err) { setError(err.status === 401 ? 'Your session has expired. Sign in in a new tab, then try saving again.' : err.message); }
    finally { setBusy(false); }
  }
  async function deleteCourse() {
    if (!window.confirm(`Delete “${course.title}”, all of its lessons, and student progress? This action cannot be undone.`)) return;
    setBusy(true); setError('');
    try { await api(`${endpoint}${course.id}/`, { method: 'DELETE', body: { updated_at: course.updated_at } });
      setCourses(old => old.filter(item => item.id !== course.id)); setCourse(null); setSaved(''); setMessage('Course deleted.');
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  const page = course?.modules.flatMap(module => module.lessons.flatMap(lesson => lesson.pages)).find(item => item._key === selected);
  const updatePage = next => change({ ...course, modules: course.modules.map(module => ({ ...module,
    lessons: module.lessons.map(lesson => ({ ...lesson, pages: lesson.pages.map(item => item._key === next._key ? next : item) })),
  })) });
  const isSuperuser = user?.is_superuser === true || (user?.is_superuser == null && user?.role === 'staff');
  if (user === undefined || (user && canEdit === undefined)) return <main className="course-studio"><p role="status">Checking access…</p></main>;
  if (!user || !canEdit) return <main className="course-studio studio-access">
    <h1>CourseForge · Course Studio</h1><p>{user ? 'Access is limited to teachers and superusers.' : 'Sign in with a teacher or superuser account.'}</p>
    {error && <p role="alert">{error}</p>}
    <Link to="/auth/0" state={{ returnTo: window.location.pathname }}>Sign in</Link><Link to="/">Back to site</Link>
  </main>;
  return <main className="course-studio">
    <header className="studio-header"><div><h1>CourseForge · Course Studio</h1><p>{user.username} · {isSuperuser ? 'Superuser — all courses' : 'Teacher — my courses'}</p></div><Link to="/">Back to site</Link></header>
    <div className="studio-notices" aria-live="polite">
      {error && <p className="studio-error" role="alert">{error}</p>}
      {message && <p className="studio-success">{message}</p>}
      {busy && <p>Saving / loading…</p>}
    </div>
    <fieldset disabled={busy || uploading}>
      <section className="studio-panel studio-toolbar">
        <label>Open course<select value={course?.id || ''} onChange={e => e.target.value && openCourse(e.target.value)}><option value="">Select a course</option>
          {courses.map(item => <option key={item.id} value={item.id}>{item.title} · {item.is_public ? 'Published' : 'Draft'}</option>)}
        </select></label>
        <details><summary>Create a new course</summary><div className="studio-toolbar">
          {Object.entries({ modules: 'Modules', lessons: 'Lessons per module', pages: 'Pages per lesson' }).map(([name, label]) => <label key={name}>{label}<input type="number" min="1" max="100" value={counts[name]} onChange={e => setCounts({ ...counts, [name]: Number(e.target.value) })} /></label>)}
          <button type="button" className="primary" onClick={create}>Create structure</button>
        </div></details>
      </section>
      {course ? <>
        <section className="studio-panel">
          <h2>1. About the course</h2>
          <label>Title<input maxLength={256} value={course.title} onChange={e => change({ ...course, title: e.target.value })} /></label>
          <label>Description<textarea rows="3" maxLength={1024} value={course.description || ''} onChange={e => change({ ...course, description: e.target.value })} /></label>
          <div className="studio-toolbar">
            <label>Category<select value={course.category} onChange={e => change({ ...course, category: e.target.value })}><option value="practice">Practical course</option><option value="theory">Theory course</option><option value="dev">Development</option></select></label>
            <label>Difficulty<select value={course.difficulty} onChange={e => change({ ...course, difficulty: e.target.value })}><option value="easy">Beginner</option><option value="mid">Intermediate</option><option value="hard">Advanced</option></select></label>
            <label>Comma-separated tags<input value={course.tags.join(',')} onChange={e => change({ ...course, tags: e.target.value.split(',') })} /></label>
          </div>
        </section>
        <div className="studio-workspace"><Structure course={course} selected={selected} onSelect={setSelected} onChange={change} />
          {page ? <PageEditor key={page._key} page={page} onChange={updatePage} onUploading={setUploading} /> : <section className="studio-editor"><p>Select a page on the left or add a new one.</p></section>}
        </div>
      </> : <section className="studio-panel"><p>Create a new course structure or open an existing course.</p></section>}
    </fieldset>
    {course && <footer className="studio-savebar">
      <span>{course.is_public ? 'Published' : 'Draft'} · {dirty ? 'Unsaved changes' : 'All changes saved'}</span>
      <button type="button" disabled={busy || uploading} className="primary" onClick={() => save()}>Save {course.is_public ? 'changes' : 'draft'}</button>
      <button type="button" disabled={busy || uploading} onClick={() => save(!course.is_public)}>{course.is_public ? 'Unpublish' : 'Publish'}</button>
      {course.id && <button type="button" disabled={busy || uploading} className="danger" onClick={deleteCourse}>Delete course</button>}
      {error && <span className="studio-error">The action failed. See the details at the top of the page.</span>}
    </footer>}
  </main>;
}
