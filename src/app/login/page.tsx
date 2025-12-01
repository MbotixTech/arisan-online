"use client";

import { useState } from "react";
import { loginAction } from "../auth-actions";
import { Lock, User, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError("");
    
    const result = await loginAction(formData);
    
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-primary-500/20">
            M
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Selamat Datang</h1>
          <p className="text-slate-400">Silakan masuk untuk melanjutkan</p>
        </div>

        <form action={handleSubmit} className="space-y-6 bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                <input
                  name="username"
                  type="text"
                  required
                  placeholder="Masukkan username"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Masukkan password"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white font-medium py-3.5 rounded-xl transition-all shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Masuk Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
        
        <p className="text-center text-slate-500 text-sm mt-8">
          &copy; {new Date().getFullYear()} MbotixTECH Arisan System
        </p>
      </div>
    </div>
  );
}
