import { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

export default function LatexBlock({ data }) {
  const html = useMemo(() => {
    return katex.renderToString(data || "", {
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
