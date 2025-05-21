import { useState, useEffect, useRef } from "react";
import { Loader2, SendHorizontal } from "lucide-react";
import useChatStore from "../stores/useChatStore.js";
import ProductCard from "../components/ProductCard.jsx";

const ChatBotPage = () => {
  const { messages, sendMessage, isLoading, addMessage } = useChatStore();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        type: "text",
        text: "Assalomu alaykum! Qanday yordam bera olaman?",
        sender: "ai",
      });
    }
  }, [addMessage, messages.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const renderMessageContent = (msg) => {
    if (msg.type === "loading") {
      return <Loader2 className="w-4 h-4 animate-spin text-white" />;
    } else if (msg.type === "text") {
      return msg.text;
    } else if (msg.type === "product_recommendation" && msg.product) {
      return (
        <div className="w-full max-w-xs md:max-w-sm lg:max-w-md flex justify-center">
          <ProductCard product={msg.product} />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <main className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.type === "product_recommendation" && msg.product ? (
              <div className="bg-white rounded-xl p-2 shadow w-full max-w-xs">
                <ProductCard product={msg.product} />
              </div>
            ) : (
              <div
                className={`max-w-[80%] bg-blue-500 px-3 py-2 rounded-xl shadow-sm whitespace-pre-wrap text-sm break-words${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : msg.type === "loading"
                    ? "bg-blue-600 text-white rounded-bl-none italic"
                    : msg.isError
                    ? "bg-red-300 text-red-800 rounded-bl-none"
                    : "bg-blue-100 text-white rounded-bl-none shadow"
                }`}
              >
                {renderMessageContent(msg)}
              </div>
            )}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </main>

      <form
        onSubmit={handleSubmit}
        className="flex items-center p-4 border-t border-gray-200 bg-white shadow-inner"
      >
        <div className="flex items-center w-full max-w-md mx-auto gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isLoading ? "Yozmoqda..." : "Savolingizni yozing..."}
            className="flex-grow rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition duration-200 flex-shrink-0"
          >
            <SendHorizontal className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBotPage;
