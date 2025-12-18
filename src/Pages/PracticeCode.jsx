import { useEffect, useMemo, useState } from "react";
import { useLoaderData, useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import Navbar from "../Components/NavBar";
import LeftDrawer from "../Components/LeftDrawer";
import CustomMarkdownReader from "../Components/CustomMarkdownReader";
import { getNextPageId, getCurrentPageIndex } from "../utils/getPageIdsAndIndexes.js";
import { markPageAsRead } from "../sending-data.js";
import { SERVER_URL } from "../../dev_data.js";

// Monaco language mapping
const LANGUAGE_MAP = {
  python: "python",
  cpp: "cpp",
  java: "java",
  javascript: "javascript",
  js: "javascript",
};

export default function PracticeCode() {
  const params = useParams();
  const navigate = useNavigate();
  const data = useLoaderData();

  const lesson = data?.lesson;
  const page = data?.page;

  // ✅ IMPORTANT: derive taskData/codeMeta/samples/snippets BEFORE hooks use them
  const taskData = useMemo(() => {
    return page?.data?.find((item) => item.type === "TASK")?.content || null;
  }, [page]);

  const codeMeta = useMemo(() => taskData?.code_meta || {}, [taskData]);

  const availableLanguages = useMemo(() => {
    return codeMeta?.languages?.length ? codeMeta.languages : ["python"];
  }, [codeMeta]);

  const samples = useMemo(() => {
    return codeMeta?.samples?.length ? codeMeta.samples : [];
  }, [codeMeta]);

  const snippets = useMemo(() => {
    const fromMeta = codeMeta?.snippets;
    if (Array.isArray(fromMeta) && fromMeta.length) return fromMeta;
    return Array.isArray(taskData?.snippets) ? taskData.snippets : [];
  }, [codeMeta, taskData]);

  const currentPageId = Number(params.pageId);
  const nextPageId = lesson ? getNextPageId(lesson, currentPageId) : -1;
  const currentPageIndex = lesson ? getCurrentPageIndex(lesson, currentPageId) : 0;

  // -----------------------------
  // State
  // -----------------------------
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [codeByLang, setCodeByLang] = useState({}); // keep code per language
  const [userCode, setUserCode] = useState("");

  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);

  // Bottom panel (LeetCode-like)
  const [bottomTab, setBottomTab] = useState("testcase"); // "testcase" | "result"
  const [cases, setCases] = useState([]); // [{ title, input, expected, isSample }]
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);

  const [testResultText, setTestResultText] = useState("");
  const [testPassed, setTestPassed] = useState(null); // null | true | false
  const [submitPassedAll, setSubmitPassedAll] = useState(false);

  // -----------------------------
  // Helpers
  // -----------------------------
  function loadTemplate(language, snippetsArray) {
    if (!Array.isArray(snippetsArray) || snippetsArray.length === 0) return "";

    let snippet =
      snippetsArray.find((s) => s.language === language && s.kind === "starter") ||
      snippetsArray.find((s) => s.language === language);

    return snippet?.code || "";
  }

  function clearResult() {
    setTestResultText("");
    setTestPassed(null);
    setSubmitPassedAll(false);
    setJobId(null);
    setJobStatus(null);
  }

  function updateActiveCaseInput(value) {
    setCases((prev) =>
      prev.map((c, i) => (i === activeCaseIndex ? { ...c, input: value } : c))
    );
  }

  function addNewCase() {
    setCases((prev) => {
      const next = [
        ...prev,
        { title: `Case ${prev.length + 1}`, input: "", expected: "", isSample: false },
      ];
      return next;
    });
    setActiveCaseIndex((prev) => prev + 1);
  }

  // -----------------------------
  // Effects
  // -----------------------------
  useEffect(() => window.scrollTo(0, 0), []);
  useEffect(() => window.scrollTo(0, 0), [currentPageId]);

  // Ensure selectedLanguage is valid when task loads/changes
  useEffect(() => {
    if (!availableLanguages.includes(selectedLanguage)) {
      setSelectedLanguage(availableLanguages[0] || "python");
    }
    
    // Reset code state when available languages change
    const template = loadTemplate(availableLanguages[0] || "python", snippets);
    setUserCode(template || "");
    setCodeByLang((prev) => ({
      ...prev,
      [availableLanguages[0] || "python"]: template || ""
    }));
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableLanguages, currentPageId]);

  // Init cases from samples (sorted by ordinal)
  useEffect(() => {
    const sorted = [...(samples || [])].sort(
      (a, b) => (a.ordinal ?? 0) - (b.ordinal ?? 0)
    );

    const mapped = sorted.map((s, idx) => ({
      title: `Case ${idx + 1}`,
      input: s.input ?? "",
      expected: s.expected ?? "",
      isSample: true,
    }));

    const finalCases =
      mapped.length > 0
        ? mapped
        : [{ title: "Case 1", input: "", expected: "", isSample: false }];

    setCases(finalCases);
    setActiveCaseIndex(0);
    setBottomTab("testcase");
    clearResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [samples]);

  // Load code when language/snippets change or when page changes:
  // - if user already typed something for this language, keep it
  // - else load starter template
  useEffect(() => {
    // Reset code state when page changes
    const saved = codeByLang[selectedLanguage];
    const template = loadTemplate(selectedLanguage, snippets);
    
    // Always use the template when page changes, don't persist code between different pages
    setUserCode(template || "");
    setCodeByLang((prev) => ({ ...prev, [selectedLanguage]: template || "" }));
    
    // Clear any previous results
    clearResult();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage, snippets, currentPageId]); // Added currentPageId to dependency array

  // -----------------------------
  // Backend: poll submit job
  // -----------------------------
  async function pollJobStatus(jobIdToPoll) {
    try {
      const response = await fetch(`${SERVER_URL}/api/judgejobs/${jobIdToPoll}/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) throw new Error(`Failed to fetch job status: ${response.statusText}`);

      const result = await response.json();
      setJobStatus(result);

      const status = result.status || result.state;

      if (status === "EVAL" || status === "PENDING") {
        setTimeout(() => pollJobStatus(jobIdToPoll), 1000);
        return;
      }

      if (status === "SUCCESS") {
        setIsSubmitting(false);
        setSubmitPassedAll(true);
        setTestPassed(true);
        setBottomTab("result");
        setTestResultText("✅ Accepted — all tests passed.");
        return;
      }

      if (status === "FAILURE" || status === "ERROR") {
        setIsSubmitting(false);
        setSubmitPassedAll(false);
        setTestPassed(false);
        setBottomTab("result");
        setTestResultText("❌ Wrong Answer — some tests failed.");
        return;
      }

      // Unknown status
      setIsSubmitting(false);
      setBottomTab("result");
      setTestResultText(`Finished with status: ${String(status)}`);
    } catch (error) {
      setIsSubmitting(false);
      setBottomTab("result");
      setTestResultText(`Error polling job status: ${error.message}`);
    }
  }

  // -----------------------------
  // Run (active testcase input)
  // -----------------------------
  async function handleRunCode() {
    clearResult();

    if (!userCode.trim()) {
      setBottomTab("result");
      setTestResultText("Error: Please write some code first.");
      return;
    }

    if (!taskData?.id) {
      setBottomTab("result");
      setTestResultText("Error: Task data not available.");
      return;
    }

    const active = cases[activeCaseIndex] || { input: "", expected: "" };
    const stdin = String(active.input ?? "");

    setIsRunning(true);
    setBottomTab("result");
    setTestResultText("Running...\n");

    const body = {
      payload: {
        language: selectedLanguage,
        code: userCode,
      },
      use_public_samples: false,
      tests: [
        {
          // include id if you have it, otherwise omit
          // id: active.id,
          input: active.input ?? "",
          expected: active.expected ?? "",   // ✅ backend will check this
        }
      ]
    };
    try {
      const response = await fetch(`${SERVER_URL}/api/tasks/${taskData.id}/run/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const result = await response.json();
      const r = Array.isArray(result.results) && result.results.length ? result.results[0] : result;

      const stdout = r?.stdout || "";
      const stderr = r?.stderr ? `\n${r.stderr}` : "";
      const out = (stdout + stderr).trimEnd();

      const expected = String(active.expected ?? "");
      if (expected.trim().length) {
        const ok = out.trim() === expected.trim();
        setTestPassed(ok);
        setTestResultText(
          `${ok ? "✅ Accepted" : "❌ Wrong Answer"}\n\n` +
            `Your output:\n${out || "(empty)"}\n\nExpected:\n${expected}`
        );
      } else {
        setTestResultText(out || "Run completed but no output was produced.");
      }
    } catch (error) {
      setTestResultText(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  }

  // -----------------------------
  // Submit (full judge)
  // -----------------------------
  async function pollSubmission(submissionId) {
  let attempt = 0;

  while (attempt < 60) { // ~ до 1-2 минут ожидания
    const res = await fetch(`${SERVER_URL}/api/submissions/${submissionId}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const data = await res.json();

    const status = data?.submission?.status || data?.status; // на случай разного формата
    setJobStatus(data); // если хочешь отображать где-то в UI

    if (status && status !== "EVAL") {
      return data; // финальный результат
    }

    attempt++;
    const delayMs = Math.min(1000 * (attempt <= 5 ? attempt : 5), 5000); // 1s..5s
    await new Promise(r => setTimeout(r, delayMs));
  }

  throw new Error("Timeout: judging took too long");
}

async function pollJudgeJob(jobIdToPoll) {
  // fallback на твой старый вариант (если у тебя реально так работает)
  while (true) {
    const res = await fetch(`${SERVER_URL}/api/judgejobs/${jobIdToPoll}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const data = await res.json();
    const status = data.status || data.state;

    if (status === "EVAL" || status === "PENDING") {
      await new Promise(r => setTimeout(r, 1000));
      continue;
    }

    return data;
  }
}

async function handleSubmitCode() {
  if (!userCode.trim()) {
    setBottomTab("result");
    setTestResultText("Error: Please write some code first.");
    return;
  }
  if (!taskData?.id) {
    setBottomTab("result");
    setTestResultText("Error: Task data not available.");
    return;
  }

  setIsSubmitting(true);
  setBottomTab("result");
  setTestResultText("Submitting...\nEvaluating...\n");
  setTestPassed(null);

  try {
    const res = await fetch(`${SERVER_URL}/api/tasks/${taskData.id}/submit/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        payload: {
          language: selectedLanguage,
          code: userCode,
        },
      }),
    });

    const submitData = await res.json();

    // ✅ Вариант из описания: вернулся сабмит (id) + job_id + status=EVAL
    const submissionId = submitData?.id || submitData?.submission_id;
    const jobId = submitData?.job_id;

    let finalResult = null;

    if (submissionId) {
      finalResult = await pollSubmission(submissionId);
    } else if (jobId) {
      finalResult = await pollJudgeJob(jobId);
    } else {
      throw new Error("Submit response did not include submission id or job_id");
    }

    // ---- Разбор результата (под твой формат) ----
    // Ожидаемый формат “другой нейронки”:
    // finalResult.submission.status, finalResult.tests.summary, finalResult.tests.public
    const verdict = finalResult?.submission?.status || finalResult?.status || "UNKNOWN";
    const score = finalResult?.submission?.score ?? finalResult?.score;

    const isAccepted = verdict === "AC" || verdict === "SUCCESS";
    setTestPassed(isAccepted);

    // Красивый вывод в консоль/панель
    let details = `Verdict: ${verdict}\n`;
    if (score != null) details += `Score: ${score}\n`;

    const passed = finalResult?.tests?.summary?.passed;
    const total = finalResult?.tests?.summary?.total;
    if (passed != null && total != null) details += `Tests: ${passed}/${total}\n`;

    // если бэкенд отдаёт public тесты со stdout/expected
    const firstPublic = finalResult?.tests?.public?.[0];
    if (firstPublic) {
      details += `\nSample output:\n${firstPublic.stdout ?? ""}\nExpected:\n${firstPublic.expected ?? ""}\n`;
    }

    setTestResultText((isAccepted ? "✅ Accepted\n\n" : "❌ Not Accepted\n\n") + details);
  } catch (e) {
    setTestResultText(`Error: ${e.message}`);
  } finally {
    setIsSubmitting(false);
  }
}


  // -----------------------------
  // Navigation
  // -----------------------------
  function handleClickLeftDrawer(pageId) {
    if (pageId === currentPageId) return;
    if (pageId === -1) return;

    const targetPage = lesson?.pages?.find((p) => p.id === pageId);
    if (targetPage?.type === "codepractice") {
      navigate(
        `/course/${params.courseId}/module/${params.moduleId}/lesson/${params.lessonId}/page/${pageId}/code`
      );
    } else {
      navigate(
        `/course/${params.courseId}/module/${params.moduleId}/lesson/${params.lessonId}/page/${pageId}`
      );
    }
  }

  async function handleClickNextPage(nextId) {
    await markPageAsRead(currentPageId);

    if (nextId === -1) {
      navigate(`/course/${params.courseId}/module/${params.moduleId}/lessons-middleware`);
      return;
    }

    const finalPageId = nextId === null ? currentPageId : nextId;

    const next = lesson?.pages?.find((p) => p.id === finalPageId);
    if (next?.type === "codepractice") {
      navigate(
        `/course/${params.courseId}/module/${params.moduleId}/lesson/${params.lessonId}/page/${finalPageId}/code`
      );
    } else {
      navigate(
        `/course/${params.courseId}/module/${params.moduleId}/lesson/${params.lessonId}/page/${finalPageId}`
      );
    }
  }

  // -----------------------------
  // Render
  // -----------------------------
  if (!page) return <p>Loading...</p>;

  const fileName =
    selectedLanguage === "python"
      ? "main.py"
      : selectedLanguage === "cpp"
      ? "main.cpp"
      : selectedLanguage === "java"
      ? "Main.java"
      : "main.js";

  return (
    <>
      <Navbar />

      <LeftDrawer
        isLesson={false}
        currentPageIndex={currentPageIndex}
        handleClick={handleClickLeftDrawer}
        data={lesson}
        width={"w-48"}
        backgroundColor={"bg-[#1e1e1e]"}
        textColor={"text-gray-100"}
        moduleBackgoundColor={"bg-[#303030]"}
        moduleHoverBackgroundColor={"hover:bg-[#404040]"}
        moduleSelectedBackgroundColor={"bg-[#404040]"}
        moduleHeaderTextColor={"text-gray-100"}
      />

      <div className="flex bg-[#1e1e1e] w-full h-screen p-2 gap-2 pl-50">
        {/* Left: Task Description */}
        <div className="flex flex-col w-96 border-2 border-gray-600 bg-[#1e1e1e] overflow-auto">
          <div className="bg-[#252526] text-white text-sm px-4 py-2 border-b border-gray-700 sticky top-0">
            <span className="inline-block font-semibold">Task</span>
          </div>

          <div className="p-4 text-gray-200 text-sm overflow-y-auto">
            {taskData ? (
              <>
                <h3 className="text-lg font-bold text-white mb-3">{taskData.title}</h3>

                {taskData.description && (
                  <div className="mb-4">
                    <CustomMarkdownReader data={taskData.description} className="markdown" />
                  </div>
                )}

                {/* Show samples (optional, still useful) */}
                {samples.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">
                      Sample Test Cases:
                    </h4>
                    {samples
                      .slice()
                      .sort((a, b) => (a.ordinal ?? 0) - (b.ordinal ?? 0))
                      .map((s, idx) => (
                        <div key={s.id || idx} className="mb-3 p-2 bg-[#252526] rounded text-xs">
                          <div className="text-gray-400 mb-1">Input:</div>
                          <pre className="text-gray-200 whitespace-pre-wrap font-mono">
                            {s.input}
                          </pre>
                          <div className="text-gray-400 mb-1 mt-2">Expected Output:</div>
                          <pre className="text-gray-200 whitespace-pre-wrap font-mono">
                            {s.expected}
                          </pre>
                        </div>
                      ))}
                  </div>
                )}

                {/* Meta */}
                <div className="mt-4 text-xs text-gray-400">
                  <div>Time Limit: {codeMeta.time_limit_ms ?? "—"}ms</div>
                  <div>Memory Limit: {codeMeta.memory_limit_kb ?? "—"}KB</div>
                </div>
              </>
            ) : (
              <CustomMarkdownReader
                data={page?.title || "No task description available"}
                className="markdown"
              />
            )}
          </div>
        </div>

        {/* Center: Editor + Bottom Panel */}
        <div className="flex flex-col flex-1 border-2 border-gray-600 overflow-hidden min-h-0">
          {/* Header (file tab, language, buttons) */}
          <div className="flex justify-between items-center bg-[#252526] text-white text-sm px-4 py-2 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <span className="inline-block font-semibold">{fileName}</span>

              {availableLanguages.length > 1 && (
                <select
                  value={selectedLanguage}
                  onChange={(e) => {
                    const newLang = e.target.value;
                    setSelectedLanguage(newLang);
                  }}
                  className="bg-[#1e1e1e] text-white text-xs px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                >
                  {availableLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang.toUpperCase()}
                    </option>
                  ))}
                </select>
              )}

              <button
                onClick={() => {
                  const template = loadTemplate(selectedLanguage, snippets);
                  setUserCode(template);
                  setCodeByLang((prev) => ({ ...prev, [selectedLanguage]: template }));
                }}
                type="button"
                className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded border border-gray-600 hover:border-gray-500"
                title="Reset to template"
              >
                Reset Template
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRunCode}
                disabled={isRunning || isSubmitting}
                type="button"
                className={`w-[90px] text-white font-medium rounded-md text-sm px-3 py-2 ${
                  isRunning || isSubmitting
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-green-700 hover:bg-green-800"
                }`}
              >
                {isRunning ? "Running..." : "Run"}
              </button>

              <button
                onClick={handleSubmitCode}
                disabled={isRunning || isSubmitting}
                type="button"
                className={`w-[100px] text-white font-medium rounded-md text-sm px-3 py-2 ${
                  isRunning || isSubmitting
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-blue-700 hover:bg-blue-800"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              theme="vs-dark"
              language={LANGUAGE_MAP[selectedLanguage] || "python"}
              value={userCode}
              onChange={(value) => {
                const v = value || "";
                setUserCode(v);
                setCodeByLang((prev) => ({ ...prev, [selectedLanguage]: v }));
              }}
              options={{
                fontSize: 16,
                padding: { top: 18, bottom: 18, right: 8, left: 8 },
                scrollbar: { vertical: "auto", horizontal: "auto" },
                wordWrap: "on",
                minimap: { enabled: false },
                automaticLayout: true,
              }}
            />
          </div>

          {/* Bottom panel (LeetCode-like) */}
          <div className="border-t border-gray-700 bg-[#1e1e1e] h-[280px]">
            {/* Tabs */}
            <div className="flex items-center justify-between bg-[#252526] border-b border-gray-700 px-4 py-2">
              <div className="flex items-center gap-4 text-sm">
                <button
                  className={
                    bottomTab === "testcase"
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                  }
                  onClick={() => setBottomTab("testcase")}
                  type="button"
                >
                  Testcase
                </button>

                <button
                  className={
                    bottomTab === "result" ? "text-white" : "text-gray-400 hover:text-white"
                  }
                  onClick={() => setBottomTab("result")}
                  type="button"
                >
                  Test Result
                </button>
              </div>

              <button
                onClick={clearResult}
                type="button"
                className="text-blue-400 bg-transparent hover:bg-[#303030] font-medium rounded-md text-sm px-3 py-1.5 border border-gray-600"
              >
                Clear
              </button>
            </div>

            {bottomTab === "testcase" ? (
              <div className="p-3">
                {/* Case tabs */}
                <div className="flex items-center gap-2 mb-3 overflow-auto">
                  {cases.map((c, idx) => (
                    <button
                      key={c.title + idx}
                      type="button"
                      onClick={() => setActiveCaseIndex(idx)}
                      className={`px-3 py-1.5 rounded-md text-sm border ${
                        idx === activeCaseIndex
                          ? "bg-[#303030] text-white border-gray-500"
                          : "bg-transparent text-gray-300 border-gray-700 hover:border-gray-500"
                      }`}
                    >
                      {c.title}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={addNewCase}
                    className="px-3 py-1.5 rounded-md text-sm border border-gray-700 text-gray-300 hover:border-gray-500"
                    title="Add testcase"
                  >
                    +
                  </button>
                </div>

                {/* Input */}
                <div className="text-xs text-gray-400 mb-2">stdin =</div>
                <textarea
                  value={cases[activeCaseIndex]?.input ?? ""}
                  onChange={(e) => updateActiveCaseInput(e.target.value)}
                  className="w-full h-24 bg-[#252526] text-gray-200 border border-gray-700 rounded-md p-2 font-mono text-sm outline-none focus:border-gray-500"
                  placeholder="Type input here (passed to stdin)"
                />

                {/* Expected (optional) */}
                {!!String(cases[activeCaseIndex]?.expected ?? "").trim() && (
                  <div className="mt-3">
                    <div className="text-xs text-gray-400 mb-2">expected =</div>
                    <pre className="w-full bg-[#252526] text-gray-200 border border-gray-700 rounded-md p-2 font-mono text-sm overflow-auto">
                      {cases[activeCaseIndex]?.expected}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 font-mono text-sm text-gray-200 whitespace-pre-wrap overflow-auto h-full">
                {testPassed === true && <div className="text-green-400 mb-2">Accepted</div>}
                {testPassed === false && <div className="text-red-400 mb-2">Wrong Answer</div>}
                {testResultText || "Run or Submit to see results here..."}
                {submitPassedAll && taskData?.title ? (
                  <div className="mt-4 text-green-300">
                    🎉 All tests passed for “{taskData.title}”.
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Next button */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={() => handleClickNextPage(nextPageId)}
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center"
        >
          Далі
          <svg
            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </button>
      </div>
    </>
  );
}
