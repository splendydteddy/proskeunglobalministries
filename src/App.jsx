import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import About from "./pages/About";
import Login from "./pages/Login";
import UploadPortal from "./pages/UploadPortal";
import Services from "./pages/Services";
import SermonsPage from "./pages/SermonsPage"; // Make sure this matches your file location (or import from wherever SermonsPage is stored)
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/messages" element={<SermonsPage />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <UploadPortal />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/upload" 
          element={
            <ProtectedRoute>
              <UploadPortal />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;