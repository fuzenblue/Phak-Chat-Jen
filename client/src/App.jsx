import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import CustomerNavbar from './components/CustomerNavbar'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import MapPage from './pages/MapPage'
import ProtectedRoute from './contexts/ProtectedRoute';
import LoginRegisterPage from './pages/LoginRegisterPage';
import MyProductsPage from './pages/MyProductsPage';
import StoreDetailPage from './pages/StoreDetailPage';
import StoreSetup from './pages/StoreSetup';
import AddProduct from './pages/AddProduct';

const App = () => {
  return (
   <AuthProvider>
      <Router>
        <Routes>
          {/* Fullscreen Pages (No restriction in App.jsx) */}
          <Route path="/map" element={<MapPage />} />
          <Route path="/login" element={<LoginRegisterPage />} />
          
          {/* Standard Pages wrapped with spacing container */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-24">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    
                    <Route path="/shops/:id" element={<StoreDetailPage />} />
                    
                    <Route path="/dashboard" element={<MyProductsPage />} />
                    <Route path="/dashboard/setup" element={<StoreSetup />} />
                                      
                    <Route path="/add-product" element={<AddProduct />} />
                  </Routes>
                </div>
              </div>
            } 
          />
        </Routes>
      </Router>
   </AuthProvider>
  )
}

export default App