import { useId, useState } from 'react';
import CustomMarkdownReader from './CustomMarkdownReader.jsx';
import LatexBlock from './LatexBlock.jsx';
import { api, mediaSource } from '../api.js';

function CodeBlock({ data }) {
  const [copied, setCopied] = useState(false);
  const code = String(data ?? '');
  async function copy() {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(code);
      else {
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch (error) { console.error('Could not copy code', error); }
  }
  return <div className="relative mt-3 mb-5 max-w-3xl overflow-hidden rounded-md border border-slate-300 bg-white">
    <div className="flex items-center justify-end border-b border-slate-200 bg-slate-50 px-4 py-2">
      <button type="button" onClick={copy} className="cursor-pointer rounded-sm px-2 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900">
        {copied ? 'Copied' : 'Copy code'}
      </button>
    </div>
    <pre className="m-0 overflow-x-auto bg-white px-5 py-4"><code className="block cursor-text whitespace-pre font-mono text-sm leading-5 text-slate-900">{code}</code></pre>
  </div>;
}

function ChoiceTask({ task, preview }) {
  const group = useId();
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const question = task.spec?.items?.[0];
  if (!question || !['single', 'multi'].includes(task.type)) {
    return <p>The “{task.title || 'Practice'}” task is available in the corresponding lesson mode.</p>;
  }
  async function check() {
    setBusy(true); setError('');
    try {
      if (preview) {
        const correct = question.correct || [];
        setResult(selected.length === correct.length && selected.every(id => correct.includes(id)));
      } else {
        const submission = await api(`/api/tasks/${task.id}/submit/`, { method: 'POST', body: { payload: selected } });
        setResult(submission.status === 'AC');
      }
    } catch (err) { setError(err.status === 401 ? 'Sign in to submit your answer.' : err.message); }
    finally { setBusy(false); }
  }
  return <section className="mt-8 rounded-md border border-gray-300 p-4 text-gray-800">
    <h3 className="mb-3 font-semibold">{task.title}</h3>
    <p className="mb-3 text-sm">{task.type === 'single' ? 'Select one answer' : 'Select all correct answers'}</p>
    {question.options.map(option => <label key={option.id} className="mb-3 flex cursor-pointer items-center gap-3">
      <input type={task.type === 'single' ? 'radio' : 'checkbox'} name={group} disabled={busy}
        checked={selected.includes(option.id)} onChange={event => {
          setResult(null);
          setSelected(task.type === 'single' ? [option.id] : event.target.checked
            ? [...selected, option.id] : selected.filter(id => id !== option.id));
        }} />
      <span>{option.text}</span>
    </label>)}
    {result !== null && <p role="status" className={result ? 'text-green-700' : 'text-red-700'}>{result ? 'Correct!' : 'The answer is not fully correct.'}</p>}
    {error && <p role="alert" className="text-red-700">{error}</p>}
    <button type="button" disabled={busy || !selected.length} onClick={check}
      className="mt-3 rounded border border-blue-800 bg-blue-100 px-5 py-2 text-blue-800 disabled:opacity-50">
      {busy ? 'Checking…' : 'Check answer'}
    </button>
  </section>;
}

export default function LessonContent({ blocks = [], preview = false }) {
  return <div className="lesson-content">
    {blocks.map((block, index) => <div key={block._key || (block.type === 'TASK' ? block.content.id : index)} className="mb-5">
      {block.type === 'MD' && <CustomMarkdownReader data={block.content} />}
      {block.type === 'LATEX' && <LatexBlock data={block.content} />}
      {block.type === 'IMAGE' && <img src={mediaSource(block.content)} alt={block.alt || ''} className="h-auto max-w-full rounded-md" />}
      {block.type === 'VIDEO' && <figure>
        <video src={mediaSource(block.content)} poster={mediaSource(block.poster) || undefined} controls preload="metadata"
          className="aspect-video w-full rounded-md bg-black" />
        {block.caption && <figcaption>{block.caption}</figcaption>}
      </figure>}
      {block.type === 'CODE' && <CodeBlock data={typeof block.content === 'string' ? block.content : JSON.stringify(block.content, null, 2)} />}
      {block.type === 'TASK' && <ChoiceTask key={`${block.content.id}-${preview ? JSON.stringify(block.content) : ''}`} task={block.content} preview={preview} />}
    </div>)}
  </div>;
}
