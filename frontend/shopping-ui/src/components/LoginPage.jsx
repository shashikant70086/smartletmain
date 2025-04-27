import React, { useState } from "react";
import { motion } from "framer-motion";
import "./stars.css";

export default function LoginPage() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="stars" />
      <div className="twinkling" />

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="absolute top-12 text-center"
      >
        <motion.div
          className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 shadow-lg mx-auto mb-4"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <h2 className="text-white text-lg font-light">Hi! I’m <span className="font-semibold">Smartlet</span> 👋</h2>
        <p className="text-white/70 text-sm">Ready to help you shop smarter.</p>
      </motion.div>

      <motion.div
        className="relative w-[360px] h-[460px] mt-20 perspective"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* FRONT - Login */}
        <div
          className="absolute w-full h-full rounded-2xl bg-white/10 backdrop-blur-lg shadow-2xl p-8 flex flex-col justify-center items-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <h2 className="text-3xl font-bold text-white mb-6">Log In</h2>
          <input type="email" placeholder="Email" className="w-full p-3 mb-4 rounded bg-white/20 placeholder-white/80 text-white focus:outline-none" />
          <input type="password" placeholder="Password" className="w-full p-3 mb-4 rounded bg-white/20 placeholder-white/80 text-white focus:outline-none" />
          <button className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded text-white font-semibold">Log In</button>
          <button onClick={() => setIsFlipped(true)} className="mt-4 text-sm text-blue-200 hover:underline">Don't have an account? Sign up</button>
        </div>

        {/* BACK - Signup */}
        <div
          className="absolute w-full h-full rounded-2xl bg-white/10 backdrop-blur-lg shadow-2xl p-8 flex flex-col justify-center items-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <h2 className="text-3xl font-bold text-white mb-6">Sign Up</h2>
          <input type="text" placeholder="Username" className="w-full p-3 mb-4 rounded bg-white/20 placeholder-white/80 text-white focus:outline-none" />
          <input type="email" placeholder="Email" className="w-full p-3 mb-4 rounded bg-white/20 placeholder-white/80 text-white focus:outline-none" />
          <input type="password" placeholder="Password" className="w-full p-3 mb-4 rounded bg-white/20 placeholder-white/80 text-white focus:outline-none" />
          <button className="w-full bg-green-600 hover:bg-green-700 transition p-3 rounded text-white font-semibold">Sign Up</button>
          <button onClick={() => setIsFlipped(false)} className="mt-4 text-sm text-green-200 hover:underline">Already have an account? Log in</button>
        </div>
      </motion.div>
    </div>
  );
}