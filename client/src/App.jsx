import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import MapPage from './pages/MapPage'
import ProtectedRoute from './contexts/ProtectedRoute';
import LoginRegisterPage from './pages/LoginRegisterPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/login" element={<LoginRegisterPage />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App