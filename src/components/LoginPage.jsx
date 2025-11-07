import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyUsers } from "./Data/dummyUser";
import { motion } from "framer-motion";

const LoginPage = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // kleine Fake-Verzögerung, um Backend-Simulation realistischer zu machen
    await new Promise((res) => setTimeout(res, 1000));

    const user = dummyUsers.find(
      (u) =>
        (u.username === username || u.email === username) &&
        u.password === password
    );

    if (user) {
      setUser({ username: user.username, name: user.name, email: user.email });
      setError("");
      navigate("/shopfloor");
    } else {
      setError("Benutzername oder Passwort falsch");
    }

    setLoading(false);
  };

  return (
    <div className="relative h-screen w-screen flex items-center justify-center overflow-hidden">
      {/* === Animierter Hintergrund === */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/background.jpg')" }}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Halbtransparenter Overlay */}
      <div  />

      {/* === Weißes Login-Feld === */}
      <motion.form
        onSubmit={handleLogin}
        className="relative bg-white rounded-md shadow-lg w-[350px] overflow-hidden z-10"
        animate={
          error
            ? { x: [0, -8, 8, -8, 8, 0] } // kleiner Shake-Effekt bei Fehler
            : { x: 0 }
        }
        transition={{ duration: 0.4 }}
      >
        {/* Gelber Header mit Logo */}
        <div className="bg-[rgb(244,204,0)] flex justify-center items-center h-28">
          <img
            src="/PM_Logo.png"
            alt="PM Logo"
            className="h-20 object-contain"
          />
        </div>

        {/* Dunkelgrauer Balken mit Titel */}
        <div className="bg-[rgb(84,88,90)] text-white text-center font-bold py-3 text-lg">
          Shopfloorboard PCP Aichtal
        </div>

        {/* Eingabefelder */}
        <div className="p-6 flex flex-col gap-4">
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center font-medium"
            >
              {error}
            </motion.p>
          )}

          <input
            type="text"
            placeholder="E-Mail oder Benutzername"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 border-2 border-[rgb(84,88,90)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(244,204,0)] disabled:opacity-60"
          />

          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 border-2 border-[rgb(84,88,90)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(244,204,0)] disabled:opacity-60"
          />

          {/* Passwort vergessen */}
          <button
            type="button"
            className="text-sm text-gray-500 hover:text-[rgb(84,88,90)] text-right -mt-2"
            disabled={loading}
          >
            Passwort vergessen?
          </button>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="relative w-full bg-[rgb(244,204,0)] text-[rgb(84,88,90)] font-bold py-2 rounded-md hover:bg-yellow-400 transition disabled:opacity-70 disabled:cursor-not-allowed"
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

      {/* Verblasster Text unten rechts */}
      <p className="absolute bottom-2 right-3 text-sm text-white/70 z-10">
        Created by J. Wörn
      </p>
    </div>
  );
};

export default LoginPage;