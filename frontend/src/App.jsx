import { useState } from "react";

function App() {
  const [imageUrl, setImageUrl] = useState(null);
  const [dogBreed, setDogBreed] = useState("");
  const [breedInfo, setBreedInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUrl(URL.createObjectURL(file));
    setDogBreed("");
    setBreedInfo("");
    setSessionId(null);
    setMessages([{ sender: "bot", text: "Detecting..." }]);
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
      setDogBreed(data.breed || "Unknown");
      setBreedInfo(data.info || "No information available.");
      setSessionId(data.session_id || null);

      setMessages([
        {
          sender: "bot",
          text: `Hi, I am Dog AI. I will tell you about dogs. The dog predicted is ${data.breed}. ${data.info}`,
        },
      ]);
    } catch {
      setDogBreed("Error");
      setBreedInfo("Something went wrong.");
      setMessages([
        { sender: "bot", text: "❌ Something went wrong during detection." },
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
          text: "❌ Something went wrong.",
        };
        return updated;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col">
      {/* NAVBAR */}
      <nav className="bg-white shadow sticky top-0 z-10">
        <div className="container mx-auto py-4 flex justify-center">
          <h1 className="text-3xl font-extrabold text-blue-600">
            Know Your Dog 🐶
          </h1>
        </div>
      </nav>

      <main className="flex-grow container mx-auto p-6 flex flex-col items-center">
        {!imageUrl && (
          <label className="cursor-pointer bg-blue-600 text-white px-8 py-4 text-lg rounded-full hover:bg-blue-700 transition shadow">
            Upload Dog Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        )}

        {imageUrl && (
          <div className="flex w-full max-w-7xl gap-6 mt-6">
            {/* IMAGE */}
            <div className="w-2/5 flex items-center justify-center">
              <div className="bg-white rounded-3xl shadow-xl h-[32rem] w-full flex items-center justify-center overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Dog"
                  className="h-full w-full object-contain rounded-3xl"
                />
              </div>
            </div>

            {/* CHAT */}
            <div className="w-3/5 bg-white rounded-3xl shadow-xl p-4 flex flex-col">
              <div className="h-[32rem] overflow-y-auto border rounded-lg p-3 space-y-3 mb-4 bg-gray-50">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`${
                      msg.sender === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <span
                      className={`inline-block px-4 py-2 rounded-xl text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words shadow ${
                        msg.sender === "user"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-white text-gray-800"
                      }`}
                    >
                      {msg.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-grow border rounded-lg p-3 shadow-sm"
                  placeholder="Ask something about the breed..."
                  disabled={!sessionId || loading}
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white px-5 rounded-lg hover:bg-blue-700 transition shadow"
                  disabled={!sessionId || loading}
                >
                  Send
                </button>
              </div>

              <button
                onClick={() => {
                  setImageUrl(null);
                  setDogBreed("");
                  setBreedInfo("");
                  setSessionId(null);
                  setMessages([]);
                  setInput("");
                }}
                className="mt-4 bg-blue-600 text-white px-6 py-3 text-lg rounded-full hover:bg-blue-700 transition shadow"
              >
                Upload a different image
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
