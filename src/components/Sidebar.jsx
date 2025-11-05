import React from "react";
import { useState } from "react";
import "../styles/style.css";

const Sidebar = ({ foldSidebar, setFoldSidebar }) => {
  const handleSidebar = () => setFoldSidebar(!foldSidebar);

  return (
    <div
      className={`bg-[rgb(85,90,90)] h-screen flex flex-col justify-between transition-all duration-300 ${
        foldSidebar ? "w-[220px]" : "w-[80px]"
      }`}
    >
      {/* --- OBERER BEREICH --- */}
      <div>
        {/* Logo */}
        <div className="flex items-center justify-center rounded-full bg-[rgb(255,204,0)] m-6 w-[60px] h-[60px] mx-auto">
          <img className="w-8 h-8" src="/logo.png" alt="Logo" />
        </div>

        {/* Menü */}
        <ul
          className={`text-white text-lg space-y-3 transition-opacity duration-300 ${
            foldSidebar ? "opacity-100 px-6" : "opacity-0 w-0 overflow-hidden"
          }`}
        >
          <li className="cursor-pointer hover:text-[rgb(255,204,0)]">
            Prozesse
          </li>
          <li className="cursor-pointer hover:text-[rgb(255,204,0)]">
            Shopfloor
          </li>
          <li className="cursor-pointer hover:text-[rgb(255,204,0)]">
            Fehler
          </li>
          <li className="cursor-pointer hover:text-[rgb(255,204,0)]">
            Stückzahlen
          </li>
        </ul>
      </div>

      {/* --- UNTERER BEREICH --- */}
      <div className="flex flex-col items-center pb-4">
        {/* Footer-Links */}
        <ul
          className={`text-white text-sm mb-3 transition-opacity duration-300 ${
            foldSidebar ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
          }`}
        >
          <li className="cursor-pointer hover:text-[rgb(255,204,0)]">
            Logout
          </li>
          <li className="cursor-pointer hover:text-[rgb(255,204,0)]">
            Einstellungen
          </li>
          <li className="cursor-pointer hover:text-[rgb(255,204,0)]">Hilfe</li>
        </ul>

        {/* Toggle Button */}
        <button
          onClick={handleSidebar}
          className="cursor-pointer text-[rgb(85,90,90)] bg-[rgb(255,204,0)] rounded-full text-3xl w-[45px] h-[45px] flex items-center justify-center hover:scale-105 transition-transform"
        >
          {foldSidebar ? "❱" : "❰"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;