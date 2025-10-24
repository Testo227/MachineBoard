import React from "react";
import { useState } from "react";

//CSS
import '../styles/style.css'



const Sidebar = ({foldSidebar, setFoldSidebar}) => {

    

    const handleSidebar = () => setFoldSidebar(!foldSidebar);


    return (

         <div
      className={`bg-[rgb(85,90,90)] h-screen flex flex-col items-center transition-all duration-300 ${
        foldSidebar ? "w-[220px]" : "w-[80px]"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-center rounded-full bg-[rgb(255,204,0)] m-6 w-[60px] h-[60px]">
        <img className="w-8 h-8" src="/logo.png" alt="Logo" />
      </div>

      {/* Menü */}
      {foldSidebar && (
        <ul className="flex-1  text-2xl space-y-2">
          <li>Prozesse</li>
          <li>Shopfloor</li>
          <li>Fehler</li>
        </ul>
      )}

      {/* Footer mit Button */}
      <div className="flex flex-col items-center pb-4">
        {foldSidebar && (
          <ul className="text-white text-sm mb-2">
            <li>Logout</li>
            <li>Einstellungen</li>
            <li>Hilfe</li>
          </ul>
        )}
        <button
          className="cursor-pointer m-4 text-[rgb(85,90,90)] bg-[rgb(255,204,0)] rounded-sm text-4xl w-[50px] h-[50px] flex items-center justify-center"
          onClick={handleSidebar}
        >
          {foldSidebar ? "❱" : "❰"}
        </button>
      </div>
    </div>



    );
}

export default Sidebar;