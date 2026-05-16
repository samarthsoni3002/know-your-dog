import { useState } from "react";

function App() {
  const [imageUrl, setImageUrl] = useState(null);
  const [fileName, setFileName] = useState("");
  const [dogBreed, setDogBreed] = useState("");
  const [breedInfo, setBreedInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const resetExperience = () => {
    setImageUrl(null);
    setFileName("");
    setDogBreed("");
    setBreedInfo("");
    setSessionId(null);
    setMessages([]);
    setInput("");
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    setImageUrl(URL.createObjectURL(file));
    setFileName(file.name);
    setDogBreed("");
    setBreedInfo("");
    setSessionId(null);
    setMessages([{ sender: "bot", text: "Analyzing the image..." }]);
    setInput("");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setDogBreed(data.breed || "Unknown breed");
      setBreedInfo(data.info || "No information available.");
      setSessionId(data.session_id || null);

      setMessages([
        {
          sender: "bot",
          text: `I found ${data.breed || "this dog breed"}. ${
            data.info || "Ask me anything about care, temperament, or training."
          }`,
        },
      ]);
    } catch {
      setDogBreed("Detection failed");
      setBreedInfo("Something went wrong.");
      setMessages([
        { sender: "bot", text: "Something went wrong during detection." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };

    setMessages((prev) => [
      ...prev,
      userMsg,
      { sender: "bot", text: "Answering..." },
    ]);
    const currentInput = input;
    setInput("");

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput, session_id: sessionId }),
      });

      const data = await res.json();

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: "bot", text: data.response };
        return updated;
      });
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          sender: "bot",
          text: "Something went wrong. Please try again.",
        };
        return updated;
      });
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    handleImageUpload(event.dataTransfer.files[0]);
  };

  const quickQuestions = [
    "What is this breed's temperament?",
    "How much exercise does it need?",
    "Is it good for first-time owners?",
  ];

  return (
    <div className="min-h-screen bg-[#f6f3ec] text-slate-950">
      <nav className="sticky top-0 z-20 border-b border-slate-200/80 bg-[#f6f3ec]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
              Breed insight assistant
            </p>
            <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Know Your Dog
            </h1>
          </div>
          <button
            onClick={resetExperience}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!imageUrl && !messages.length}
          >
            Start over
          </button>
        </div>
      </nav>

      <main className="mx-auto grid min-h-[calc(100vh-89px)] max-w-7xl gap-6 px-5 py-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)]">
        <section className="flex flex-col gap-5">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
            <div
              onDragEnter={() => setDragActive(true)}
              onDragLeave={() => setDragActive(false)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
              className={`relative flex min-h-[19rem] flex-col items-center justify-center overflow-hidden rounded-[1.5rem] border-2 border-dashed p-6 text-center transition ${
                dragActive
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Uploaded dog"
                  className="max-h-[25rem] w-full rounded-2xl object-contain"
                />
              ) : (
                <div className="mx-auto max-w-md">
                  <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-emerald-100 text-3xl font-black text-emerald-800">
                    <span aria-hidden="true">+</span>
                  </div>
                  <h2 className="text-3xl font-black tracking-tight text-slate-950">
                    Upload a dog photo
                  </h2>
                  <p className="mt-3 text-base leading-7 text-slate-600">
                    Drop an image here or choose one from your device to detect
                    the breed and open a focused chat.
                  </p>
                  <label className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800">
                    Choose image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        handleImageUpload(event.target.files[0])
                      }
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {imageUrl && (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Current image
                  </p>
                  <p className="max-w-sm truncate text-base font-bold text-slate-900">
                    {fileName || "Uploaded dog photo"}
                  </p>
                </div>
                <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800">
                  Replace image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      handleImageUpload(event.target.files[0])
                    }
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Step 1
              </p>
              <p className="mt-2 font-bold text-slate-900">Upload</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Step 2
              </p>
              <p className="mt-2 font-bold text-slate-900">Detect breed</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Step 3
              </p>
              <p className="mt-2 font-bold text-slate-900">Ask follow-ups</p>
            </div>
          </div>
        </section>

        <section className="flex min-h-[30rem] flex-col rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
          <div className="border-b border-slate-200 p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-emerald-700">
                  {loading
                    ? "Detecting breed"
                    : dogBreed
                      ? "Breed detected"
                      : "Ready when you are"}
                </p>
                <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
                  {dogBreed || "Dog knowledge chat"}
                </h2>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  sessionId
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {sessionId ? "Chat active" : "Upload needed"}
              </span>
            </div>
            {breedInfo && (
              <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                {breedInfo}
              </p>
            )}
          </div>

          <div className="flex flex-1 flex-col p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => setInput(question)}
                  disabled={!sessionId || loading}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {question}
                </button>
              ))}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto rounded-3xl bg-slate-50 p-4">
              {messages.length === 0 ? (
                <div className="flex h-full min-h-[14rem] items-center justify-center text-center">
                  <div className="max-w-sm">
                    <h3 className="text-xl font-black text-slate-900">
                      Your results will appear here
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      After detection, ask about grooming, training, energy
                      level, health, or personality.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span
                        className={`max-w-[84%] whitespace-pre-wrap break-words rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm md:text-base ${
                          msg.sender === "user"
                            ? "bg-slate-950 text-white"
                            : "border border-slate-200 bg-white text-slate-800"
                        }`}
                      >
                        {msg.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") sendMessage();
                }}
                className="min-w-0 flex-1 rounded-full border border-slate-300 bg-white px-5 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                placeholder="Ask about care, behavior, training..."
                disabled={!sessionId || loading}
              />
              <button
                onClick={sendMessage}
                className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={!sessionId || loading || !input.trim()}
              >
                Send
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
