import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Navbar from './components/Navbar';

/**
 * Protects a route by checking authentication status.
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  return (
    <div className="h-screen flex flex-col overflow-hidden select-none">
      <Navbar />
      <main className="flex-1 flex p-6 gap-6 overflow-hidden w-full max-w-[1280px] mx-auto">
        {children}
      </main>
       <footer className="h-12 border-t border-white/5 bg-[#0A0F1E] px-8 flex items-center justify-between text-[10px] font-mono text-white/30 shrink-0">
         <div className="flex space-x-6">
           <span className="hidden md:inline">ML ENGINE: BERT-MINI + FLAN-T5</span>
           <span className="hidden md:inline">LATENCY: ~42ms</span>
           <span>VERSION: 1.0.0</span>
         </div>
         <div className="flex items-center">
           <span className="mr-2">SYSTEM STATUS:</span>
           <span className="text-[#00C9B1]">OPERATIONAL</span>
           <div className="ml-2 w-2 h-2 rounded-full bg-[#00C9B1] shadow-[0_0_8px_#00C9B1]"></div>
         </div>
         <span className="text-[10px] font-mono text-white/20">BY AMIT BADONI</span>
       </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
