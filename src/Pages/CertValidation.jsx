import { useState, useRef } from "react";
import Navbar from "../Components/NavBar";

import { SERVER_URL } from "../../dev_data.js";

export default function CertValidation() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");
  const inputRef = useRef();

  function handleFileSelect(e) {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  }

  function handleDrop(e) {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  async function handleValidate() {
    if (!file) return;

    try {
      setStatus("loading");
      setMessage("");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${SERVER_URL}/api/courses/verifycert/`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Сертифікат невалідний");
      }

      const data = await response.json();
      if(data.verified === true){
        setStatus("success");
        setMessage(data.detail || "Сертифікат дійсний");
      } else {
        setStatus("error");
        setMessage(data.detail || "Сертифікат недійсний");
      }
      
    } catch (err) {
      setStatus("error");
      setMessage("Сертифікат недійсний");
    }
  }

  return (
    <>
      <Navbar />

      <div className="mt-20 flex justify-center items-center">
        <div className="w-full max-w-xl bg-white border border-gray-200 rounded-xl shadow-sm p-10">

          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
            Перевірка сертифіката
          </h2>

          <p className="text-center text-gray-500 mb-8">
            Завантажте PDF-файл сертифіката для перевірки
          </p>


          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => inputRef.current.click()}
            className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-300 rounded-xl p-10 bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
          >
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16v-8m0 0-3 3m3-3 3 3M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1"
              />
            </svg>

            <p className="text-gray-600 text-center">
              {file ? file.name : "Перетягніть файл сюди або натисніть для завантаження"}
            </p>

            <input
              ref={inputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current.click();
              }}
              className="mt-4 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-lg px-10 py-3 shadow-lg"
            >
              Обрати файл
            </button>
          </div>


          <button
            onClick={handleValidate}
            disabled={!file || status === "loading"}
            className="mt-6 w-full text-white bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-lg px-6 py-4 shadow-lg disabled:opacity-50"
          >
            {status === "loading" ? "Перевірка..." : "Перевірити сертифікат"}
          </button>


          {status !== "idle" && (
            <div
              className={`mt-10 p-5 rounded-lg border text-center ${
                status === "success"
                  ? "bg-green-100 border-green-300 text-green-800"
                  : status === "error"
                  ? "bg-red-100 border-red-300 text-red-800"
                  : "bg-gray-100 border-gray-200 text-gray-600"
              }`}
            >
              {message}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
