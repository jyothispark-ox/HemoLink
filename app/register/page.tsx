'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import { Droplet } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await apiFetch('users', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      // Auto login after test registration
      const loginData = await apiFetch('login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      login(loginData.token, loginData.user);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] py-12 px-4 sm:px-6 lg:px-8 text-[#f1f5f9]">
      <div className="max-w-md w-full space-y-8 bg-slate-900 p-8 sm:p-10 rounded-xl border border-slate-800">
        <div className="flex flex-col items-center">
          <Image 
            src="https://i.ibb.co/Z1Lc8JyQ/Hemo-Linklogo.png" 
            alt="HemoLink Logo" 
            width={200} 
            height={64} 
            className="h-12 w-auto object-contain mb-4" 
            referrerPolicy="no-referrer" 
          />
          <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400 font-medium tracking-wide uppercase">
            Join HemoLink to manage donations
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 text-red-500 p-3 rounded-md text-sm font-medium border border-red-500/20">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
              <input
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-slate-700 bg-slate-800 placeholder-slate-500 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm transition-colors"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email address</label>
              <input
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-slate-700 bg-slate-800 placeholder-slate-500 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm transition-colors"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Password</label>
              <input
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-slate-700 bg-slate-800 placeholder-slate-500 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold uppercase tracking-wider rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
          
          <div className="text-center text-sm">
            <span className="text-slate-400">Already have an account? </span>
            <Link href="/login" className="font-medium text-red-500 hover:text-red-400 transition-colors">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
