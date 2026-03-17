import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CustomerNavbar from './components/CustomerNavbar'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import MapPage from './pages/MapPage'
import ProtectedRoute from './contexts/ProtectedRoute';
import LoginRegisterPage from './pages/LoginRegisterPage';
import MyProductsPage from './pages/MyProductsPage';
import StoreDetailPage from './pages/StoreDetailPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/login" element={<LoginRegisterPage />} />
        
        <Route path="/map" element={
          <div className="pt-14">
            <CustomerNavbar title="แผนที่ร้านค้า" />
            <MapPage />
          </div>
        } />
        
        <Route path="/shops/:id" element={
          <div className="pt-14">
            <CustomerNavbar title="รายละเอียดร้าน" back />
            <StoreDetailPage />
          </div>
        } />

        <Route path="/dashboard" element={<MyProductsPage />} />
      </Routes>
    </Router>
  )
}

export default App