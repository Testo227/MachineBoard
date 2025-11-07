import React, { useState } from "react";
import { ChevronDown, X } from "lucide-react";

const TypFilter = ({ filters, setFilters }) => {
  const [openDropdown, setOpenDropdown] = useState(null); // "typ" | null

  // Beispiel-Daten für Typen (kannst du dynamisch ersetzen)
  const typen = ["BSF", "PUMI", "Dock", "PPM1", "PPM2"];

  const toggleDropdown = (field) => {
    setOpenDropdown((prev) => (prev === field ? null : field));
  };

  // ---------- Typ ----------
  const handleTypChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      typ: value,
    }));
    setOpenDropdown(null);
  };

  const clearTyp = () => {
    setFilters((prev) => ({
      ...prev,
      typ: "",
    }));
    setOpenDropdown(null);
  };

  // ---------- Typ Bezeichnung ----------
  const handleBezeichnungChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      typBezeichung: value,
    }));
  };

  const btnClass =
    "flex items-center justify-between w-full bg-white px-2 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-100 h-9";

  return (
    <div
      className="p-3 rounded-md border border-gray-300 "
      style={{ backgroundColor: "rgb(244,204,0)" }}
    >
      <h2 className="text-sm font-bold text-[rgb(85,90,90)] mb-3">
        Typ Filter
      </h2>

      {/* Typ + Typ Bezeichnung nebeneinander */}
      <div className="grid grid-cols-2 gap-4">
        {/* Typ Dropdown */}
        <div className="relative flex flex-col">
          <label className="text-[10px] text-gray-600 mb-1">Typ</label>
          <button onClick={() => toggleDropdown("typ")} className={btnClass}>
            <span>{filters.typ || "wählen"}</span>
            <ChevronDown
              className={`transition-transform duration-200 ${
                openDropdown === "typ" ? "rotate-180" : "rotate-0"
              }`}
              size={16}
            />
          </button>

          {openDropdown === "typ" && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50">
              {typen.map((t) => (
                <div
                  key={t}
                  onClick={() => handleTypChange(t)}
                  className={`px-2 py-1 cursor-pointer hover:bg-gray-100 ${
                    filters.typ === t ? "bg-gray-100 font-semibold" : ""
                  }`}
                >
                  {t}
                </div>
              ))}
              <div
                onClick={clearTyp}
                className="px-2 py-1 cursor-pointer hover:bg-gray-100 text-red-500 flex items-center gap-1"
              >
                <X size={14} /> Löschen
              </div>
            </div>
          )}
        </div>

        {/* Typ Bezeichnung Input */}
        <div className="flex flex-col">
          <label className="text-[10px] text-gray-600 mb-1">
            Typ Bezeichnung
          </label>
          <input
            type="text"
            value={filters.typBezeichung}
            onChange={(e) => handleBezeichnungChange(e.target.value)}
            placeholder="Bezeichnung eingeben..."
            className="bg-white border border-gray-300 rounded-md px-2 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[rgb(85,90,90)] h-9"
          />
        </div>
      </div>
    </div>
  );
};

export default TypFilter;