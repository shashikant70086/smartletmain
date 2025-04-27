import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { PiPaperPlaneRightFill } from "react-icons/pi";
import { FaSignOutAlt, FaTrash } from "react-icons/fa";
import avatar from "../Pooho.png";
import "../stars.css";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export default function PromptPage() {
  const [image, setImage] = useState(null);
  const messagesEndRef = useRef(null);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(() => uuidv4());
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);

  const handleImageUpload = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    const userMessage = { type: "user", text: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:8080/api/prompt", {
        prompt,
        sessionId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const botMessage = {
        type: "bot",
        text: res.data.reply,
        image: avatar
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [...prev, { type: "bot", text: "Error fetching reply", image: avatar }]);
    }
  };

  useEffect(() => {
    const fetchSessions = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/sessions", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessions(res.data);
    };

    fetchSessions();
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          type: "bot",
          text: "Hi, I’m Smartlet 👋 What do you want to shop today?",
          image: avatar,
        },
      ]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]">
      <div className="stars" />
      <div className="twinkling" />

      {/* Top Bar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-md flex justify-between items-center px-6 py-4 shadow-lg">
        <h1 className="text-2xl font-bold text-white">Smartlet 🛍️</h1>
        <button
          onClick={() => alert("Logged out!")}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow-md"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      {/* Left Side - Session Buttons */}
<div className="absolute top-24 left-4 z-40 bg-white/10 backdrop-blur p-4 rounded-xl space-y-2">
  <button
    onClick={() => {
      const newSession = uuidv4();
      setSessionId(newSession);
      setMessages([]);
      setActiveSession(null);
    }}
    className="bg-green-500 px-4 py-2 rounded text-white w-full"
  >
    + New Chat
  </button>

  {/* New Shop Manually Button */}
  <button
    onClick={() => {
      window.location.href = "/shop"; // <-- Navigate to the shop page
    }}
    className="bg-yellow-500 px-4 py-2 rounded text-white w-full"
  >
    🛒 Shop Manually
  </button>

  {/* List all Sessions */}
  {sessions.map((s) => (
  <div key={s.sessionId} className="flex items-center gap-2">
    <button
      className={`flex-1 text-left px-3 py-1 rounded ${
        activeSession === s.sessionId ? "bg-blue-500 text-white" : "bg-white"
      }`}
      onClick={async () => {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:8080/sessions/${s.sessionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const msgs = res.data.messages.map((msg) => ({
          type: msg.role === "user" ? "user" : "bot",
          text: msg.content,
          image: msg.role === "bot" ? avatar : null
        }));

        setSessionId(s.sessionId);
        setMessages(msgs);
        setActiveSession(s.sessionId);
      }}
    >
      {s.title}
    </button>

    {/* 🗑️ Delete Button */}
    <button
      onClick={async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this session?");
        if (!confirmDelete) return;

        try {
          const token = localStorage.getItem("token");
          await axios.delete(`http://localhost:8080/sessions/${s.sessionId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          // After delete, refresh sessions
          setSessions((prev) => prev.filter((sess) => sess.sessionId !== s.sessionId));
          if (activeSession === s.sessionId) {
            setMessages([]);
            setActiveSession(null);
          }
        } catch (error) {
          console.error(error);
          alert("Failed to delete session.");
        }
      }}
      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
    >
      <FaTrash />
    </button>
  </div>
))}

</div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative p-2 w-full pt-24">
        {/* Chat Messages Area */}
        <div className="flex flex-col w-full max-w-3xl mx-auto mb-28 overflow-y-auto space-y-4 max-h-[calc(100vh-180px)] scrollbar-thin pr-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start ${message.type === "user" ? "justify-end" : "justify-start"} p-2`}
            >
              <div
                className={`flex items-center ${
                  message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
                } space-x-4`}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                  <img
                    src={message.image || avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className={`p-4 rounded-xl max-w-xs break-words ${
                    message.type === "user" ? "bg-green-400" : "bg-blue-500"
                  } text-white`}
                >
                  {message.text}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="fixed bottom-6 transform -translate-x-1/2 w-full max-w-3xl bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl p-4 flex items-center justify-between space-x-4"
        >
          <textarea
            rows="2"
            className="w-full p-2 rounded bg-white/30 placeholder-white/80 text-white resize-none focus:outline-none"
            placeholder="Type your magical prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />

          {/* File Upload Button */}
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="text-white text-lg">
              <i className="fas fa-plus-circle"></i>
            </div>
          </label>

          {/* Send Button */}
          <button
            onClick={handleSubmit}
            className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center text-white"
          >
            <PiPaperPlaneRightFill />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
