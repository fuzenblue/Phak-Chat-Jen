import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import CustomerNavbar from './components/CustomerNavbar'
import HomePage from './pages/HomePage'
import MapPage from './pages/MapPage'
import FavoritesPage from './pages/FavoritesPage';
import CustomerProfilePage from './pages/CustomerProfilePage';
import ProtectedRoute from './contexts/ProtectedRoute';
import LoginRegisterPage from './pages/LoginRegisterPage';
import MyProductsPage from './pages/MyProductsPage';
import StoreDetailPage from './pages/StoreDetailPage';
import StoreSetup from './pages/StoreSetup';
import AddProduct from './pages/AddProduct';
import AgentSettingsPage from './pages/AgentSettingsPage';
import AgentActivityPage from './pages/AgentActivityPage';
import EditProductPage from './pages/EditProductPage';

const App = () => {
  return (
   <AuthProvider>
      <Router>
        <Routes>
          {/* Fullscreen Pages (No restriction in App.jsx) */}
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/profile" element={<CustomerProfilePage />} />
          <Route path="/login" element={<LoginRegisterPage />} />
          
          {/* Standard Pages wrapped with spacing container */}
          <Route 
            path="*" 
            element={
              <Routes>
                    <Route path="/shops/:id" element={<StoreDetailPage />} />
                    
                    <Route path="/dashboard" element={<MyProductsPage />} />
                    <Route path="/dashboard/setup" element={<StoreSetup />} />
                                      
                    <Route path="/add-product" element={<AddProduct />} />
                    <Route path="/merchant/products/:id/edit" element={<EditProductPage />} />
                    <Route path="/dashboard/agent" element={<AgentSettingsPage />} />
                    <Route path="/dashboard/agent/activity" element={<AgentActivityPage />} />
                  </Routes>
            } 
          />
        </Routes>
      </Router>
   </AuthProvider>
  )
}

export default App