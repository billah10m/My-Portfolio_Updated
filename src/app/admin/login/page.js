'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck, ArrowLeft, RefreshCw, AlertCircle, Eye, EyeOff, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { signInAdmin } from '@/lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. First authenticate with our server-side secure auth endpoint
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, password })
      });
      const data = await res.json();

      if (data.success) {
        // Also sign in to Supabase client if enabled
        try {
          await signInAdmin(identifier, password);
        } catch {}

        // Store active session flag for fast client navigation
        localStorage.setItem('admin_auth_status', 'true');
        router.push('/admin');
        return;
      }

      // If server auth returned error, check if Supabase has direct credentials
      const sbRes = await signInAdmin(identifier, password);
      if (sbRes?.data?.user) {
        localStorage.setItem('admin_auth_status', 'true');
        router.push('/admin');
        return;
      }

      setError(data.error || sbRes?.error?.message || 'Invalid administrator credentials. Access denied.');
    } catch (err) {
      setError(err.message || 'Authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main 
      className="min-h-screen w-full flex items-center justify-center p-4 select-none font-sans relative overflow-hidden" 
      style={{ background: 'var(--color-bg, #08090D)' }}
    >
      {/* Ambient background glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] blur-[140px] rounded-full pointer-events-none opacity-25"
        style={{ background: 'radial-gradient(circle, #38bdf8 0%, #00f2fe 50%, transparent 70%)' }}
      />

      <div 
        className="w-full max-w-md p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl border relative z-10 backdrop-blur-xl" 
        style={{ 
          background: 'rgba(16, 23, 39, 0.75)', 
          borderColor: 'rgba(56, 189, 248, 0.2)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}
      >
        {/* Header Badge */}
        <div className="text-center space-y-3">
          <div 
            className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-lg border" 
            style={{ 
              background: 'rgba(56, 189, 248, 0.1)', 
              borderColor: 'rgba(56, 189, 248, 0.3)' 
            }}
          >
            <Lock className="w-7 h-7 text-sky-400" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold mb-1 border border-sky-500/30 bg-sky-500/10 text-sky-400">
              <ShieldCheck className="w-3 h-3" />
              <span>Owner Access Only</span>
            </div>
            <h1 className="text-2xl font-bold text-white font-sans tracking-tight">Admin Gateway</h1>
            <p className="text-xs text-zinc-400 font-mono mt-1">Authenticate to access Asif Billah&apos;s Portfolio CMS</p>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3.5 rounded-xl text-xs font-mono flex items-center gap-2.5 text-red-400 bg-red-950/40 border border-red-800/50 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 font-mono">
          <div>
            <label className="text-xs block mb-1.5 text-zinc-300 font-semibold">Admin Identifier / Email</label>
            <div className="relative">
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="asifbillah.cse@gmail.com"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none text-white transition-all focus:border-sky-400"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255, 255, 255, 0.12)' 
                }}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs block mb-1.5 text-zinc-300 font-semibold">Secret Key / Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-2.5 pr-10 rounded-xl text-sm outline-none text-white transition-all focus:border-sky-400"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255, 255, 255, 0.12)' 
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm cursor-pointer shadow-lg font-sans flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
            style={{ 
              background: 'linear-gradient(135deg, #38bdf8 0%, #00f2fe 100%)', 
              color: '#08090D' 
            }}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Unlock CMS Dashboard &rarr;</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-4 text-center border-t border-white/10">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-sky-400 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Public Portfolio
          </Link>
        </div>
      </div>
    </main>
  );
}
