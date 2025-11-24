import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import "../styles/style.css";
import { supabase } from "../supabaseClient";
import { useState, useEffect } from "react";


const Sidebar = ({ foldSidebar, setFoldSidebar, setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => setFoldSidebar(!foldSidebar);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/");
  };

  const menuItems = [
    { name: "Shopfloor", path: "/shopfloor" },
    { name: "Stückzahlen", path: "/stueckzahlen" },
    { name: "Fehler", path: "/fehler" },
  ];

   // Scroll deaktivieren, wenn Modal offen
  useEffect(() => {
    if (showLogoutModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showLogoutModal]);

  return (
    <div
      className={`relative bg-[rgb(85,90,90)] h-screen flex flex-col justify-start transition-all duration-300
        ${foldSidebar ? "w-[220px]" : "w-[60px]"}
      `}
    >
      {/* LOGO OBEN */}
      <div className="flex flex-col items-center mt-3">
        <img
          className="w-12 h-10 mb-6"
          src="/PM_Logo_whitesmall.png"
          alt="Logo"
        />
      </div>

      {/* MENÜ */}
      <ul className="text-white text-lg flex flex-col space-y-3 pl-4 mt-6 list-none">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <li key={item.path} className="flex items-center list-none">
              {/* Optional Icon links */}
              

              {/* Text – nur sichtbar, wenn Sidebar ausgeklappt */}
              <Link
                to={item.path}
                className={`transition-all duration-300 whitespace-nowrap overflow-hidden ${
                  foldSidebar ? "opacity-100" : "opacity-0 pointer-events-none"
                } ${isActive ? "text-[rgb(255,204,0)] font-bold" : ""}`}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* UNTERE ICONS – am unteren Rand */}
      <div className="mt-auto mb-10 flex flex-col items-start space-y-4 pl-4">
        {/* Ausloggen */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => setShowLogoutModal(true)}
        >
          <span className="text-2xl"></span>
          <span
            className={`transition-all duration-300 whitespace-nowrap overflow-hidden text-white hover:text-[rgb(255,204,0)] ${
              foldSidebar ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
           ➜ Ausloggen
          </span>
        </div>

        {/* Einstellungen */}
        <div className="flex items-center space-x-2 cursor-pointer">
          
          <span
            className={`transition-all duration-300 whitespace-nowrap overflow-hidden ${
              foldSidebar ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="flex text-white group hover:text-[rgb(255,204,0)]">
            <Settings className="w-6 h-6 text-white grouphover:text-[rgb(255,204,0)] " />
            Einstellungen
            </div>
          </span>
        </div>

        {/* Hilfe */}
        <div className="flex items-center space-x-2 cursor-pointer">
          <span className="text-2xl"></span>
          <span
            className={`transition-all duration-300 whitespace-nowrap overflow-hidden text-white hover:text-[rgb(255,204,0)] ${
              foldSidebar ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            ? Hilfe
          </span>
        </div>
      </div>

      {/* DREIECK – RECHTS, VERTIKAL ZENTRIERT */}
      <div
        onClick={toggleSidebar}
        className="absolute top-1/2 -translate-y-1/2 right-[0px] cursor-pointer select-none"
      >
        {foldSidebar ? (
          <div className="
            w-0 h-0 
            border-t-[24px] border-b-[24px] border-r-[60px]
            border-t-transparent border-b-transparent
            border-r-[rgb(244,204,0)]
            hover:scale-110 transition-transform
          "></div>
        ) : (
          <div className="
            w-0 h-0 
            border-t-[24px] border-b-[24px] border-l-[60px]
            border-t-transparent border-b-transparent
            border-l-[rgb(244,204,0)]
            hover:scale-110 transition-transform
          "></div>
        )}
      </div>
        {/* MODAL */}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="relative bg-white w-[90%] max-w-[400px] p-6 rounded-2xl shadow-xl border border-[rgb(85,90,90)]">
              
              <h2 className="text-xl font-bold text-[rgb(85,90,90)] text-center mb-4">
                Wirklich ausloggen?
              </h2>

              <p className="text-center text-[rgb(85,90,90)] opacity-80 mb-6">
                Bist du sicher, dass du dich ausloggen möchtest?
              </p>

              <div className="flex justify-between gap-4">
                
                {/* Cancel */}
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-2 rounded-xl border border-[rgb(85,90,90)] text-[rgb(85,90,90)] font-semibold hover:bg-[rgb(85,90,90)] hover:text-white transition hover:cursor-pointer"
                >
                  Abbrechen
                </button>

                {/* Confirm */}
                <button
                  onClick={async () => {
                    setShowLogoutModal(false);
                    await handleLogout();
                  }}
                  className="flex-1 py-2 rounded-xl font-semibold bg-[rgb(244,204,0)] text-black hover:brightness-110 transition hover:cursor-pointer"
                >
                  Ausloggen
                </button>

              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Sidebar;