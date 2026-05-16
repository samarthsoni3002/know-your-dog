import { useState } from "react";

function ChatComponent({ sessionId }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          session_id: sessionId,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [...prev, { sender: "bot", text: data.response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Something went wrong." },
      ]);
    }

    setInput("");
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-4 mt-4 space-y-3">
      <div className="h-64 overflow-y-scroll border rounded p-2 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${msg.sender === "user" ? "text-right" : "text-left"}`}
          >
            <span
              className={`inline-block px-3 py-1 rounded ${
                msg.sender === "user"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
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
          className="flex-grow border rounded p-2"
          placeholder="Ask something about the breed..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatComponent;
