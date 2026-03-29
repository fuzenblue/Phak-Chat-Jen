import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
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

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}