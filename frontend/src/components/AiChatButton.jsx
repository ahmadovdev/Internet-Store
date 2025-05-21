// src/components/HomePage/HomepageChatButton.jsx
import { Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AiChatButton = () => {


  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/chatbot"); 
  };
  return (
    <button
      onClick={handleClick}
      className="
        fixed bottom-6 right-6
        w-14 h-14
        bg-gradient-to-r from-blue-500 to-indigo-600
        text-white
        rounded-full
        shadow-xl
        hover:scale-105 hover:shadow-2xl
        focus:outline-none focus:ring-4 focus:ring-indigo-300
        transition-all duration-300 ease-in-out
        z-50
        flex items-center justify-center
      "
      aria-label="Chatbotni ochish"
    >
      <Bot size={26} className="animate-pulse" />
    </button>

  );
};

export default AiChatButton;
