import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import MapPage from './pages/MapPage';
import DatabasePage from './pages/DatabasePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/60 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-500/25">
                  P
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Phak-Chat-Jen
                </span>
              </div>
              <div className="flex items-center gap-1">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                      ? 'bg-indigo-500/20 text-indigo-300 shadow-inner'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  🏠 Home
                </NavLink>
                <NavLink
                  to="/chat"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                      ? 'bg-indigo-500/20 text-indigo-300 shadow-inner'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  🤖 AI Chat
                </NavLink>
                <NavLink
                  to="/map"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                      ? 'bg-indigo-500/20 text-indigo-300 shadow-inner'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  🗺️ Map
                </NavLink>
                <NavLink
                  to="/database"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                      ? 'bg-indigo-500/20 text-indigo-300 shadow-inner'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  🗄️ Database
                </NavLink>
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/database" element={<DatabasePage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/5 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
            © 2026 Phak-Chat-Jen — Built with React + Vite + Tailwind CSS
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
