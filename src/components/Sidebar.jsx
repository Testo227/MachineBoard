import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/style.css";

const Sidebar = ({ foldSidebar, setFoldSidebar, setUser, user }) => {
  const location = useLocation();
  const handleSidebar = () => setFoldSidebar(!foldSidebar);

  const menuItems = [
    { name: "Shopfloor", path: "/shopfloor" },
    { name: "Stückzahlen", path: "/stueckzahlen" },
    { name: "Fehler", path: "/fehler" },
  ];

   const handleLogout = () => {
    setUser(null);          // Benutzer zurücksetzen
    navigate("/");          // Zur Login-Seite weiterleiten
  };

  return (
    <div className={`bg-[rgb(85,90,90)] h-screen flex flex-col justify-between transition-all duration-300 ${foldSidebar ? "w-[220px]" : "w-[80px]"}`}>
      <div>
        <div className="flex items-center justify-center rounded-full bg-[rgb(255,204,0)] m-6 w-[60px] h-[60px] mx-auto">
          <img className="w-8 h-8" src="/PM_Logo.png" alt="Logo" />
        </div>

        <ul className={`text-white text-lg space-y-3 transition-opacity duration-300 ${foldSidebar ? "opacity-100 px-6" : "opacity-0 w-0 overflow-hidden"}`}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li
                key={item.path}
                className={`cursor-pointer hover:text-[rgb(255,204,0)] ${
                  isActive ? "text-[rgb(255,204,0)] font-bold" : ""
                }`}
              >
                <Link to={item.path}>{item.name}</Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-col items-center pb-4">
        <ul className={`text-white text-sm mb-3 transition-opacity duration-300 ${foldSidebar ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}>
          <li className="cursor-pointer hover:text-[rgb(255,204,0)]" onClick={handleLogout} >Logout</li>
          <li className="cursor-pointer hover:text-[rgb(255,204,0)]">Einstellungen</li>
          <li className="cursor-pointer hover:text-[rgb(255,204,0)]">Hilfe</li>
        </ul>

        <button onClick={handleSidebar} className="cursor-pointer text-[rgb(85,90,90)] bg-[rgb(255,204,0)] rounded-full text-3xl w-[45px] h-[45px] flex items-center justify-center hover:scale-105 transition-transform">
          {foldSidebar ? "❱" : "❰"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;