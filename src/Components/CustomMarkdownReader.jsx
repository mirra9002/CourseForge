import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import '../Styles/markdown.css'

export default function CustomMarkdownReader({data}) {

  return <>
    <ReactMarkdown
      
      remarkPlugins={[remarkGfm]}
      components={{
        h1: (props) => <h1 className="text-3xl font-bold mt-4 mb-3 dark:text-white" {...props} />,
        h2: (props) => <h2 className="text-2xl font-semibold mt-4 mb-2 dark:text-white" {...props} />,
        h3: (props) => <h3 className="text-xl font-semibold mt-3 mb-1.5 dark:text-white" {...props} />,
        p:  (props) => <p className="my-2 leading-relaxed dark:text-gray-300" {...props} />,
        ul: (props) => <ul className="list-disc ms-5 my-3 dark:text-gray-300" {...props} />,
        ol: (props) => <ol className="list-decimal ms-5 my-3 dark:text-gray-300" {...props} />,
        code: (props) => <code className="bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded" {...props} />,
        pre: (props) => <pre className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-3 rounded overflow-auto my-3" {...props} />,
      }}
    >
    {data}
  </ReactMarkdown></>
}