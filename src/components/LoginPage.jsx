import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { motion } from "framer-motion";

const LoginPage = ({ setUser }) => {
  const [mode, setMode] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const loginAttempts = useRef(0);
  const lastAttemptTime = useRef(Date.now());

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const generateDisplayName = (email) => {
    const local = email.split("@")[0];
    return local
      .split(".")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");
  };

  // Login behandeln
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setInfoMessage("");

    if (!validateEmail(email)) return setError("Bitte gib eine gültige E-Mail ein.");
    if (!password) return setError("Bitte gib dein Passwort ein.");

    setLoading(true);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError("E-Mail oder Passwort ungültig.");
        return;
      }

      if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          displayName: data.user.user_metadata?.display_name || "",
          firstName: data.user.user_metadata?.firstName || "",
          lastName: data.user.user_metadata?.lastName || "",
          profileColor: data.user.user_metadata?.profileColor || "",
        });
        navigate("/shopfloor"); // Weiterleitung nach erfolgreichem Login
      }
    } catch (err) {
      setError("Fehler beim Einloggen.");
    } finally {
      setLoading(false);
    }
  };



  // Registrierung behandeln
  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setInfoMessage("");

    if (!validateEmail(email)) {
      return setError("Bitte gib eine gültige E-Mail ein.");
    }

    try {
      const { data, error } = await supabase.functions.invoke("secureSignup2", {
        method: "POST",
        body: { email, password, firstName, lastName },
      });

      const parsedData = data ? JSON.parse(data) : null

      if (error || data?.error) {
        setError("Registrierung fehlgeschlagen");
        return;
      }

      if (parsedData?.success) {
        // Felder zurücksetzen
        setEmail("");
        setPassword("");
        setFirstName("");
        setLastName("");

        // Info-Meldung anzeigen
        setInfoMessage(
          "Registrierungsanfrage gesendet... verifiziere deinen Account durch das Drücken des Links in deinem Email-Postfach"
        );
      }
    } catch (err) {
      setError("Registrierung fehlgeschlagen");
    }
  };
    

  const handleKeyDown = (e) => {
    if (e.key === "Enter") mode === "login" ? handleLogin(e) : handleRegister(e);
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

      <motion.div
        className="relative bg-white rounded-md shadow-lg w-[350px] overflow-hidden z-10"
      >
        <div className="bg-[rgb(244,204,0)] flex justify-center items-center h-28">
          <img src="/PM_Logo.png" alt="PM Logo" className="h-20 object-contain" />
        </div>

        <div className="bg-[rgb(84,88,90)] text-white text-center font-bold py-3 text-lg">
          Shopfloorboard PCP Aichtal
        </div>

        <div className="p-6 flex flex-col gap-4">
          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
          {infoMessage && <p className="text-green-500 text-sm text-center font-medium">{infoMessage}</p>}

          <input
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 border-2 border-gray-700 rounded-md"
            required
          />

          {mode === "login" && (
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-2 border-2 border-gray-700 rounded-md"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-700"
              >
                {showPassword ? "👁" : "👁‍🗨"}
              </button>
            </div>
          )}

          {mode === "register" && (
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={firstName}
                className="w-full px-3 py-2 border-2 border-gray-700 rounded-md"
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Vorname"
                required
              />
              <input
                type="text"
                value={lastName}
                className="w-full px-3 py-2 border-2 border-gray-700 rounded-md"
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Nachname"
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Passwort"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-3 py-2 border-2 border-gray-700 rounded-md"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-700"
                >
                  {showPassword ? "👁" : "👁‍🗨"}
                </button>
              </div>
            </div>
          )}

          {mode === "login" ? (
            <>
              <button
                type="button"
                onClick={() => {}}
                className="text-sm text-gray-500 hover:text-gray-700 text-right -mt-2 cursor-pointer"
              >
                Passwort vergessen?
              </button>

              <button
                onClick={handleLogin}
                className="w-full bg-[rgb(244,204,0)] text-gray-900 font-bold py-2 rounded-md hover:bg-yellow-400 transition cursor-pointer"
              >
                Einloggen
              </button>

              <div className="flex items-center my-2">
                <div className="flex-grow h-[1px] bg-gray-300" />
                <span className="px-2 text-gray-500 text-sm">oder</span>
                <div className="flex-grow h-[1px] bg-gray-300" />
              </div>

              <button
                type="button"
                onClick={() => setMode("register")}
                className="w-full bg-gray-700 text-white font-bold py-2 rounded-md hover:bg-gray-800 transition cursor-pointer"
              >
                Registrieren
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleRegister}
                className="w-full bg-[rgb(244,204,0)] text-gray-900 font-bold py-2 rounded-md hover:bg-yellow-400 cursor-pointer"
              >
                Jetzt registrieren
              </button>

              <div className="flex items-center my-3">
                <div className="flex-grow h-[1px] bg-gray-300" />
                <span className="px-2 text-gray-500 text-sm">oder</span>
                <div className="flex-grow h-[1px] bg-gray-300" />
              </div>

              <button
                type="button"
                onClick={() => setMode("login")}
                className="w-full bg-gray-700 text-white font-bold py-2 rounded-md hover:bg-gray-800 cursor-pointer"
              >
                Doch Einloggen?
              </button>
            </>
          )}
        </div>
      </motion.div>

      <p className="absolute bottom-2 right-3 text-sm text-black/70 z-10">
        Created by J. Wörn
      </p>
    </div>
  );
};

export default LoginPage;