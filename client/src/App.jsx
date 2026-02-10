import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import MapPage from './pages/MapPage'
import DatabasePage from './pages/DatabasePage'

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/database" element={<DatabasePage />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App