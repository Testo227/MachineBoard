import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { motion } from "framer-motion";

const LoginPage = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const navigate = useNavigate();

  // Einfaches Client-side Rate Limiting
  const loginAttempts = useRef(0);
  const lastAttemptTime = useRef(Date.now());

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setInfoMessage("");

    // Rate limiting: max 5 Versuche in 1 Minute
    const now = Date.now();
    if (now - lastAttemptTime.current > 60000) {
      loginAttempts.current = 0;
    }
    loginAttempts.current += 1;
    lastAttemptTime.current = now;

    if (loginAttempts.current > 5) {
      setError("Zu viele Login-Versuche. Bitte kurz warten.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Bitte gib eine gültige E-Mail ein.");
      return;
    }

    if (!password) {
      setError("Bitte gib dein Passwort ein.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        // Keine sensiblen Infos anzeigen
        setError("E-Mail oder Passwort ungültig.");
        console.error("Login Error:", loginError);
        return;
      }

      if (data?.user) {
        // User-Objekt aus Supabase Auth
        setUser({
          id: data.user.id,
          email: data.user.email,
          username: data.user.user_metadata?.username || "",
          displayName: data.user.user_metadata?.display_name || "",
        });
        navigate("/shopfloor");
      }
    } catch (err) {
      console.error("Unexpected login error:", err);
      setError("Fehler beim Einloggen. Bitte erneut versuchen.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!validateEmail(email)) {
      setError("Bitte gib zuerst eine gültige E-Mail ein.");
      return;
    }
    setError("");
    setInfoMessage("");
    setResetting(true);

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/reset-password",
      });
      if (error) {
        console.error("Password reset error:", error);
        setError("Fehler beim Anfordern des Passwort-Resets.");
      } else {
        setInfoMessage("Falls die E-Mail existiert, wurde eine Reset-Mail verschickt.");
      }
    } catch (err) {
      console.error("Unexpected reset error:", err);
      setError("Fehler beim Anfordern des Passwort-Resets.");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="relative h-screen w-screen flex items-center justify-center overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/background.jpg')" }}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.form
        onSubmit={handleLogin}
        className="relative bg-white rounded-md shadow-lg w-[350px] overflow-hidden z-10"
        animate={error ? { x: [0, -8, 8, -8, 8, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="bg-[rgb(244,204,0)] flex justify-center items-center h-28">
          <img src="/PM_Logo.png" alt="PM Logo" className="h-20 object-contain" />
        </div>

        <div className="bg-[rgb(84,88,90)] text-white text-center font-bold py-3 text-lg">
          Shopfloorboard PCP Aichtal
        </div>

        <div className="p-6 flex flex-col gap-4">
          {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm text-center font-medium">{error}</motion.p>}
          {infoMessage && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-500 text-sm text-center font-medium">{infoMessage}</motion.p>}

          <input
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading || resetting}
            className="w-full px-3 py-2 border-2 border-[rgb(84,88,90)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(244,204,0)] disabled:opacity-60"
          />

          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || resetting}
            className="w-full px-3 py-2 border-2 border-[rgb(84,88,90)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(244,204,0)] disabled:opacity-60"
          />

          <button
            type="button"
            onClick={handlePasswordReset}
            disabled={loading || resetting}
            className="text-sm text-gray-500 hover:text-[rgb(84,88,90)] text-right -mt-2"
          >
            {resetting ? "E-Mail wird gesendet..." : "Passwort vergessen?"}
          </button>

          <button
            type="submit"
            disabled={loading || resetting}
            className="relative w-full bg-[rgb(244,204,0)] text-[rgb(84,88,90)] font-bold py-2 rounded-md hover:bg-yellow-400 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[rgb(84,88,90)] border-t-transparent rounded-full animate-spin" />
                <span>Wird überprüft...</span>
              </div>
            ) : (
              "Einloggen"
            )}
          </button>
        </div>
      </motion.form>

      <p className="absolute bottom-2 right-3 text-sm text-white/70 z-10">
        Created by J. Wörn
      </p>
    </div>
  );
};

export default LoginPage;