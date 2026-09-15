import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { mediaSource } from '../api.js';
import '../Styles/markdown.css'

export default function CustomMarkdownReader({ data, className = "" }) {

  return <div className={`markdown-body max-w-full ${className}`}>
    <ReactMarkdown
      
      remarkPlugins={[remarkGfm]}
      components={{
        img: ({ node: _node, src, alt, ...props }) => <img src={mediaSource(src)} alt={alt || ''} className="h-auto max-w-full rounded-md" {...props} />,
        h1: (props) => <h1 className="text-3xl font-bold mt-4 mb-3" {...props} />,
        h2: (props) => <h2 className="text-2xl font-semibold mt-4 mb-2" {...props} />,
        h3: (props) => <h3 className="text-xl font-semibold mt-3 mb-1.5" {...props} />,
        p:  (props) => <p className="my-2 leading-relaxed" {...props} />,
        ul: (props) => <ul className="list-disc ms-5 my-3" {...props} />,
        ol: (props) => <ol className="list-decimal ms-5 my-3" {...props} />,
        table: ({ node: _node, ...props }) => (
          <div className="my-4 w-full max-w-2xl overflow-x-auto rounded-lg border border-gray-300 bg-white shadow-sm">
            <table className="w-full min-w-[340px] border-separate border-spacing-0 text-left text-sm text-gray-800" {...props} />
          </div>
        ),
        thead: ({ node: _node, ...props }) => <thead className="bg-gray-50 text-left text-gray-900" {...props} />,
        tbody: ({ node: _node, ...props }) => <tbody className="divide-y divide-slate-200" {...props} />,
        tr: ({ node: _node, ...props }) => <tr className="transition-colors even:bg-gray-50/60 hover:bg-gray-50/50" {...props} />,
        th: ({ node: _node, style, ...props }) => <th className="border-b border-gray-300 px-5 py-3 text-left font-semibold first:rounded-tl-lg last:rounded-tr-lg [&:not(:first-child)]:border-l [&:not(:first-child)]:border-slate-200" style={{ ...style, textAlign: "left" }} {...props} />,
        td: ({ node: _node, style, ...props }) => <td className="px-5 py-3 text-left align-top text-slate-700 [&:not(:first-child)]:border-l [&:not(:first-child)]:border-slate-200" style={{ ...style, textAlign: "left" }} {...props} />,
        code: (props) => <code className="bg-gray-200 text-blue-600 px-1.5 py-0.5 rounded" {...props} />,
        pre: (props) => <pre className="bg-gray-100 text-gray-800 p-3 rounded overflow-auto my-3" {...props} />,
      }}
    >
    {data}
  </ReactMarkdown></div>
}
