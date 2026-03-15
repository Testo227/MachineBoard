import React, { useState } from "react";
import { Search } from "lucide-react";
import FiltersPanel from "./FiltersPanel";

const Topbar = ({ filters, setFilters, globalTags }) => {
  const [showFilterModal, setShowFilterModal] = useState(false);

  const handleSearch = (value) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      search: "",
      tags: [],
      typ: "",
      typBezeichung: "",
      wlw: "",
      sequenzFilter: {
        area: [
          "PPM1","PPM2","PUMI","Dock","Prüffeld Pumpe","Prüffeld Mast",
          "Lackierung","Endmontage","PDI","Konservieren","Optimieren",
          "BSA Linie","BSA Dock"
        ],
        type: ["Plan", "Ist"],
        type2: ["start","ende"],
        from: "",
        till: "",
      },
    });
  };

  // Prüfen, ob irgendein Filter aktiv ist
  const sf = filters.sequenzFilter || {};
  const isAnyFilterActive =
    Boolean(filters.search?.trim()) ||
    (filters.tags?.length > 0) ||
    Boolean(filters.typ?.trim()) ||
    Boolean(filters.typBezeichung?.trim()) ||
    Boolean(sf.selectedArea?.trim()) ||
    Boolean(sf.selectedType?.trim()) ||
    Boolean(sf.selectedType2?.trim()) ||
    Boolean(sf.from) ||
    Boolean(sf.till);

  return (
    <div className="flex bg-[rgb(255,204,0)] h-8 items-center justify-between px-3 shadow-md relative">
      {/* Titel */}
      <h1 className="absolute left-1/2 transform -translate-x-1/2 text-sm font-extrabold text-[rgb(85,90,90)] select-none whitespace-nowrap">
        Shopfloorboard PCP Aichtal
      </h1>

      {/* Suchfeld */}
      <div className="relative w-52 mr-2 ml-auto">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={11} />
        <input
          className="w-full bg-white pl-7 pr-2 py-0.5 rounded border border-gray-300 text-gray-700 text-xs focus:outline-none focus:ring-1 focus:ring-[rgb(85,90,90)] focus:border-transparent shadow-sm"
          placeholder="K-Nummer oder Kunde..."
          type="text"
          value={filters.search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Filter-Button */}
      <div className="relative">
        <button
          onClick={() => setShowFilterModal((prev) => !prev)}
          className={`bg-white px-2.5 py-0.5 rounded shadow-sm border text-xs font-semibold flex items-center gap-1.5 hover:bg-gray-100 transition-all duration-200 ${
            isAnyFilterActive ? "ring-2 ring-[rgb(85,90,90)]" : "border-gray-300"
          }`}
        >
          Filter
          {isAnyFilterActive && <span className="w-1.5 h-1.5 bg-[rgb(228,12,12)] rounded-full inline-block"></span>}
        </button>

        {showFilterModal && (
          <div className="absolute right-0 mt-1 w-145 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-4">
            <FiltersPanel filters={filters} setFilters={setFilters} globalTags={globalTags} clearAllFilters={clearAllFilters} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;