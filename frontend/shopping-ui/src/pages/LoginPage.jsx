import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import avatar from "..//Pooho.png";
import "..//stars.css";

export default function LoginPage() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const navigate = useNavigate(); // for navigation

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email: loginEmail,
        password: loginPassword,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/Prompt"); // Redirect to UI route
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed", {
        duration: 3000,
        position: "top-center",
      });
    }
  };

  const handleSignup = async () => {
    try {
      const res = await axios.post("http://localhost:8080/api/auth/signup", {
        username: signupUsername,
        email: signupEmail,
        password: signupPassword,
      });
      localStorage.setItem("token", res.data.token);
      toast.success("Signup successful!", {
        duration: 3000,
        position: "top-center",
      });
      setIsFlipped(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed", {
        duration: 3000,
        position: "top-center",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] p-6">
      <Toaster />
      <div className="stars" />
      <div className="twinkling" />

      <motion.div
        initial={{ y: -10 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="z-10 mb-4"
      >
        <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden mx-auto">
          <img src={avatar} alt="Smartlet Avatar" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-white text-2xl text-center font-bold mt-3 drop-shadow">
          Hi! I'm Smartlet
        </h2>
        <p className="text-white text-center text-sm drop-shadow">✨ Here to make shopping magical ✨</p>
      </motion.div>

      <motion.div
        className="relative w-96 h-[460px]"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Login Form */}
        <div
          className="absolute w-full h-full bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl p-8 flex flex-col justify-center items-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <h2 className="text-3xl font-bold text-white mb-6">Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            className="w-full p-3 mb-4 rounded bg-white/30 placeholder-white/80 text-white focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="w-full p-3 mb-4 rounded bg-white/30 placeholder-white/80 text-white focus:outline-none"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition p-3 rounded text-white font-semibold"
          >
            Log In
          </button>
          <button
            onClick={() => setIsFlipped(true)}
            className="mt-4 text-sm text-white/80 hover:underline"
          >
            Don't have an account? Sign up
          </button>
        </div>

        {/* Sign Up Form */}
        <div
          className="absolute w-full h-full bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl p-8 flex flex-col justify-center items-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <h2 className="text-3xl font-bold text-white mb-6">Sign Up</h2>
          <input
            type="text"
            placeholder="Username"
            value={signupUsername}
            onChange={(e) => setSignupUsername(e.target.value)}
            className="w-full p-3 mb-4 rounded bg-white/30 placeholder-white/80 text-white focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            className="w-full p-3 mb-4 rounded bg-white/30 placeholder-white/80 text-white focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            className="w-full p-3 mb-4 rounded bg-white/30 placeholder-white/80 text-white focus:outline-none"
          />
          <button
            onClick={handleSignup}
            className="w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 transition p-3 rounded text-white font-semibold"
          >
            Sign Up
          </button>
          <button
            onClick={() => setIsFlipped(false)}
            className="mt-4 text-sm text-white/80 hover:underline"
          >
            Already have an account? Log in
          </button>
        </div>
      </motion.div>
    </div>
  );
}
