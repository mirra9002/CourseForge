import { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

function normalizeLatex(data) {
  const latex = String(data || "").trim();
  const wrappers = [
    ["$$", "$$"],
    ["\\[", "\\]"],
    ["\\(", "\\)"],
    ["$", "$"],
  ];

  const wrapper = wrappers.find(([start, end]) => latex.startsWith(start) && latex.endsWith(end));
  if (!wrapper) return latex;

  const [start, end] = wrapper;
  return latex.slice(start.length, latex.length - end.length).trim();
}

export default function LatexBlock({ data }) {
  const html = useMemo(() => {
    return katex.renderToString(normalizeLatex(data), {
      displayMode: true,
      throwOnError: false,
      strict: false,
    });
  }, [data]);

  return (
    <div
      className="my-4 max-w-full overflow-x-auto rounded-sm border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
