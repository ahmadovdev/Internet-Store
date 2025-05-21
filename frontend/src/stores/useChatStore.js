import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useChatStore = create((set, get) => ({
  messages: [],
  isLoading: false,
  isOpen: false,

  toggleChat: () => {
    set((state) => ({ isOpen: !state.isOpen }));
    if (!get().isOpen && get().messages.length === 0) {
      get().addMessage({
        type: "text",
        text: "Assalomu alaykum! Qanday yordam bera olaman?",
        sender: "ai",
      });
    }
  },

  addMessage: (message) => {
    set((state) => ({
      messages: [
        ...state.messages,
        { ...message, id: Date.now() + Math.random() },
      ],
    }));
  },

  setIsLoading: (loading) => set({ isLoading: loading }),

  clearMessages: () => set({ messages: [] }),

  sendMessage: async (userQuery) => {
    get().addMessage({ type: "text", text: userQuery, sender: "user" });

    get().setIsLoading(true);
    const loadingMessageId = Date.now();
    get().addMessage({ type: "loading", sender: "ai", id: loadingMessageId });

    try {
      const response = await axios.post("/chatbot/chatbot-recommend", {
        query: userQuery,
      });

      set((state) => {
        const updatedMessages = state.messages.filter(
          (msg) => msg.id !== loadingMessageId
        );
        const aiResponseData = response.data;

        const aiMessages = [];
        if (aiResponseData && aiResponseData.error) {
          aiMessages.push({
            type: "text",
            text: aiResponseData.error,
            sender: "ai",
            isError: true,
          });
          toast.error("Chatbot xatoligi: " + aiResponseData.error);
        } else if (aiResponseData) {
          if (aiResponseData.intro) {
            aiMessages.push({
              type: "text",
              text: aiResponseData.intro,
              sender: "ai",
            });
          }

          if (
            aiResponseData.recommendedProducts &&
            Array.isArray(aiResponseData.recommendedProducts) &&
            aiResponseData.recommendedProducts.length > 0
          ) {
            aiResponseData.recommendedProducts.forEach((product) => {
              aiMessages.push({
                type: "product_recommendation",
                product: product,
                sender: "ai",
              });
            });
          } else {
            if (!aiResponseData.intro) {
              aiMessages.push({
                type: "text",
                text: "Afsuski, so'rovingiz bo'yicha mos mahsulot topa olmadim.",
                sender: "ai",
              });
            }
          }
        } else {
          aiMessages.push({
            type: "text",
            text: "API dan kutilmagan javob keldi.",
            sender: "ai",
            isError: true,
          });
          toast.error("Chatbot API dan kutilmagan javob!");
        }
        return {
          messages: updatedMessages.concat(aiMessages),
          isLoading: false,
        };
      });
    } catch (error) {
      console.error("Chatbot API xatoligi:", error);
      set((state) => ({
        messages: state.messages
          .filter((msg) => msg.id !== loadingMessageId)
          .concat({
            type: "text",
            text: "Xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring.",
            sender: "ai",
            isError: true,
          }),
        isLoading: false,
      }));
      toast.error("Chatbot API chaqiruvida xato!");
    }
  },
}));

export default useChatStore;
