import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import client from '../api/client';
import { Scale } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const res = await client.post(endpoint, { email, password });
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050812]">
      <div className="w-full max-w-md bg-[#111A2E] p-8 rounded-2xl shadow-2xl border border-[#1F2A40]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[var(--color-accent-teal)]/10 rounded-full flex items-center justify-center mb-4">
            <Scale className="w-8 h-8 text-[var(--color-accent-teal)]" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-white">ClauseEase</h1>
          <p className="text-gray-400 mt-2 text-sm">AI Legal Document Analysis</p>
        </div>
        
        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full bg-[#0A0F1E] border border-[#1F2A40] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--color-accent-teal)] transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full bg-[#0A0F1E] border border-[#1F2A40] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--color-accent-teal)] transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-[var(--color-accent-teal)] text-[#0A0F1E] font-bold rounded-lg hover:bg-[#00E5C9] transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {isLogin ? "Don't have an account? Register" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
