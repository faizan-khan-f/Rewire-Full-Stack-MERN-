import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, Bot, Volume2 } from "lucide-react";

const TalkToSpidey = () => {
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Hey! I'm Spidey, your AI Coach. Where is your focus slipping today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const introAudioRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (introAudioRef.current) {
      introAudioRef.current.play().catch(() => {
        console.log(
          "Browser autoplay blocked the audio. User must click the avatar to play it.",
        );
      });
    }
  }, []);

  const playIntroAudio = () => {
    if (introAudioRef.current) {
      introAudioRef.current.currentTime = 0;
      introAudioRef.current
        .play()
        .catch((err) => console.log("Audio play failed:", err));
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    const currentHistory = [...messages];

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      //   const res = await axios.post("http://localhost:5000/api/ai/chat", {
      //     message: userMessage.text,
      //     history: currentHistory,
      //   });
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const res = await axios.post(`${API_BASE_URL}/ai/chat`, {
        message: userMessage.text,
        history: currentHistory,
      });
      setMessages((prev) => [...prev, { role: "model", text: res.data.reply }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "Network interference detected. Reconnect and try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center py-8 px-4 bg-slate-50 dark:bg-slate-900 font-sans transition-colors duration-300">
      <audio ref={introAudioRef} src="/spidey-intro.mp3" preload="auto" />

      {/* Avatar Header */}
      <div className="flex flex-col items-center justify-center mb-6">
        <div
          onClick={playIntroAudio}
          title="Click to hear Spidey!"
          className={`relative rounded-full cursor-pointer transition-all duration-700 ease-in-out group ${
            isTyping
              ? "scale-110 shadow-[0_0_40px_rgba(16,185,129,0.4)]"
              : "scale-100 shadow-lg shadow-emerald-500/20 dark:shadow-emerald-900/40 hover:scale-105"
          }`}
        >
          <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 p-1.5 rounded-full border border-slate-200 dark:border-slate-600 z-20 shadow-md group-hover:scale-110 transition-transform">
            <Volume2 size={16} />
          </div>

          {isTyping && (
            <div className="absolute inset-[-6px] rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
          )}

          <img
            src="/spidey.png"
            alt="Spidey Avatar"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
            className={`w-28 h-28 rounded-full object-cover border-4 border-white dark:border-slate-800 relative z-10 ${isTyping ? "animate-pulse" : ""}`}
          />
          <div
            style={{ display: "none" }}
            className="w-28 h-28 rounded-full border-4 border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 items-center justify-center relative z-10 text-emerald-500"
          >
            <Bot size={48} />
          </div>
        </div>
        <p
          className={`mt-4 font-bold tracking-widest uppercase text-xs transition-colors duration-300 ${
            isTyping
              ? "text-emerald-500 dark:text-emerald-400"
              : "text-slate-500 dark:text-slate-500"
          }`}
        >
          {isTyping ? "Spidey is analyzing..." : "Spidey is online"}
        </p>
      </div>

      {/* Chat Window */}
      <div className="w-full max-w-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[550px] transition-colors duration-300">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-emerald-500 dark:bg-emerald-600 text-white rounded-br-none"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-600 font-mono tracking-tight"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-2xl rounded-bl-none border border-slate-200 dark:border-slate-600 flex gap-1.5 items-center">
                <span className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-bounce"></span>
                <span
                  className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></span>
                <span
                  className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-end gap-3 transition-colors duration-300">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Spidey for protocol adjustments..."
            className="flex-1 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl p-4 outline-none border border-slate-300 dark:border-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none max-h-32 min-h-[56px] transition-all custom-scrollbar"
            rows="1"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="p-4 bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20 dark:shadow-emerald-900/30"
          >
            <Send
              size={20}
              className={
                input.trim() && !isTyping
                  ? "translate-x-0.5 -translate-y-0.5"
                  : ""
              }
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TalkToSpidey;
