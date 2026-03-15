import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage = ({ setUser }) => {
  const [mode, setMode]               = useState('login'); // login | reset
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]             = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading]         = useState(false);

  const navigate = useNavigate();

  const inputCls = "w-full bg-[rgb(240,241,245)] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[rgb(85,90,90)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgb(255,204,0)] focus:bg-white focus:border-transparent transition";

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const switchMode = (newMode) => {
    setError('');
    setInfoMessage('');
    setMode(newMode);
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError('');
    setInfoMessage('');
    if (!validateEmail(email)) return setError('Bitte gib eine gültige E-Mail ein.');
    if (!password) return setError('Bitte gib dein Passwort ein.');
    setLoading(true);
    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) { setError('E-Mail oder Passwort ungültig.'); return; }
      if (data?.user) {
        setUser({
          id:           data.user.id,
          email:        data.user.email,
          displayName:  data.user.user_metadata?.display_name || '',
          firstName:    data.user.user_metadata?.firstName || '',
          lastName:     data.user.user_metadata?.lastName || '',
          profileColor: data.user.user_metadata?.profileColor || '',
        });
        navigate('/shopfloor');
      }
    } catch { setError('Fehler beim Einloggen.'); }
    finally { setLoading(false); }
  };

  const handlePasswordReset = async (e) => {
    e?.preventDefault();
    setError('');
    setInfoMessage('');
    if (!validateEmail(email)) return setError('Bitte gib eine gültige E-Mail ein.');
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/login',
      });
      if (error) setError(error.message);
      else setInfoMessage('Passwort-Reset E-Mail gesendet. Bitte prüfe dein Postfach.');
    } catch { setError('Fehler beim Senden der Reset-E-Mail.'); }
    finally { setLoading(false); }
  };

  const handleKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    if (mode === 'login') handleLogin(e);
    else handlePasswordReset(e);
  };

  return (
    <div className="relative h-screen w-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/background.jpg')" }}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Card */}
      <motion.div
        className="relative z-10 w-full max-w-sm mx-4"
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Logo header */}
          <div className="bg-[rgb(255,204,0)] flex items-center justify-center py-8 px-6">
            <img src="/PM_Logo.png" alt="Putzmeister Logo" className="h-16 object-contain" />
          </div>

          {/* App title bar */}
          <div className="bg-[rgb(70,75,82)] text-white text-center font-bold py-3 text-sm tracking-wide">
            Shopfloorboard PCP Aichtal
          </div>

          {/* Body */}
          <div className="p-6 flex flex-col gap-4">

            <h2 className="text-[rgb(85,90,90)] font-extrabold text-xl text-center">
              {mode === 'login' ? 'Anmelden' : 'Passwort zurücksetzen'}
            </h2>

            {/* Feedback */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-3 text-center leading-relaxed">
                {error}
              </div>
            )}
            {infoMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl px-4 py-3 text-center leading-relaxed">
                {infoMessage}
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-3"
              >
                {/* Email */}
                <input
                  type="email"
                  placeholder="E-Mail"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={inputCls}
                  autoComplete="email"
                />

                {/* Password — login only */}
                {mode === 'login' && (
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Passwort"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className={inputCls + ' pr-11'}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                )}

                {/* Forgot password link */}
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => switchMode('reset')}
                    className="text-xs text-gray-400 hover:text-[rgb(85,90,90)] text-right -mt-1 cursor-pointer transition self-end"
                  >
                    Passwort vergessen?
                  </button>
                )}

                {/* Primary button */}
                <button
                  onClick={mode === 'login' ? handleLogin : handlePasswordReset}
                  disabled={loading}
                  className="w-full bg-[rgb(255,204,0)] text-[rgb(40,44,48)] font-bold py-3 rounded-xl hover:brightness-95 transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 mt-1 text-sm"
                >
                  {loading
                    ? <div className="w-4 h-4 border-2 border-t-transparent border-[rgb(40,44,48)] rounded-full animate-spin" />
                    : mode === 'login' ? 'Einloggen' : 'Reset-Link senden'
                  }
                </button>

                {/* Back to login — reset mode only */}
                {mode === 'reset' && (
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="w-full bg-[rgb(70,75,82)] text-white font-bold py-3 rounded-xl hover:bg-[rgb(85,90,90)] transition cursor-pointer text-sm"
                  >
                    Zurück zum Login
                  </button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <p className="absolute bottom-3 right-4 text-xs text-white/50 z-10">Created by J. Wörn</p>
    </div>
  );
};

export default LoginPage;
