import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PromptPage from "./pages/PromptPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/prompt" element={<PromptPage />} />
      </Routes>
    </Router>
  );
}

export default App;