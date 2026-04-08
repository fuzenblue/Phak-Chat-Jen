import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    const initializeAuth = async () => {
      if (savedToken && savedUser) {
        setToken(savedToken);
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);

        try {
          // Sync fresh profile data from DB softly
          const res = await api.get('/auth/me');
          const fullUser = { ...parsedUser, ...res.data.data };
          setUser(fullUser);
          localStorage.setItem('user', JSON.stringify(fullUser));
        } catch (err) {
          console.error("Failed to fresh sync user:", err);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // --- เพิ่มส่วนนี้: ตัวดักจับการย้อนกลับ (popstate) ---
  useEffect(() => {
    const handleAuth = () => {
      const isPublic = ['/login', '/map', '/register'].includes(window.location.pathname);
      if (!localStorage.getItem('token') && !isPublic) {
        window.location.replace('/login');
      }
    };
    window.addEventListener('popstate', handleAuth);
    return () => window.removeEventListener('popstate', handleAuth);
  }, [token]);
  // -------------------------------------------

  useEffect(() => {
    const publicPaths = ['/login', '/map', '/register']; 
    const isPublicPath = publicPaths.includes(window.location.pathname);

    if (!loading && !token && !isPublicPath) {
      window.location.replace('/login'); // เปลี่ยนจาก .href เป็น .replace
    }
  }, [token, loading]);

  function login(userData, userToken) {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.replace('/login'); // เพิ่มบรรทัดนี้: บังคับเด้งออกและล้างประวัติ
  }

  function updateUser(newData) {
    setUser(prev => {
      const updated = { ...prev, ...newData };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}