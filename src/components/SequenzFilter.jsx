import React, { useState } from "react";
import { ChevronDown, X } from "lucide-react";

const SequenzFilter = ({ filters, setFilters }) => {
  const [openDropdown, setOpenDropdown] = useState(null); // "area" | "type" | "type2" | null

  const areas = filters.sequenzFilter.area || [];
  const dateTypes = filters.sequenzFilter.type || ["Plan", "Ist"];
  const startEndTypes = filters.sequenzFilter.type2 || ["start", "ende"];

  // ---------- Helper ----------
  const toggleDropdown = (type) => {
    setOpenDropdown((prev) => (prev === type ? null : type));
  };

  // ---------- Area ----------
  const handleAreaChange = (area) => {
    setFilters((prev) => ({
      ...prev,
      sequenzFilter: { ...prev.sequenzFilter, selectedArea: area },
    }));
    setOpenDropdown(null);
  };

  const clearArea = () => {
    setFilters((prev) => ({
      ...prev,
      sequenzFilter: { ...prev.sequenzFilter, selectedArea: "" },
    }));
    setOpenDropdown(null);
  };

  // ---------- Datumstyp ----------
  const handleTypeChange = (type) => {
    setFilters((prev) => ({
      ...prev,
      sequenzFilter: { ...prev.sequenzFilter, selectedType: type },
    }));
    setOpenDropdown(null);
  };

  const clearType = () => {
    setFilters((prev) => ({
      ...prev,
      sequenzFilter: { ...prev.sequenzFilter, selectedType: "" },
    }));
    setOpenDropdown(null);
  };

  // ---------- Start/Ende ----------
  const handleType2Change = (type2) => {
    setFilters((prev) => ({
      ...prev,
      sequenzFilter: { ...prev.sequenzFilter, selectedType2: type2 },
    }));
    setOpenDropdown(null);
  };

  const clearType2 = () => {
    setFilters((prev) => ({
      ...prev,
      sequenzFilter: { ...prev.sequenzFilter, selectedType2: "" },
    }));
    setOpenDropdown(null);
  };

  // ---------- Datum ----------
  const handleDateChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      sequenzFilter: { ...prev.sequenzFilter, [field]: value },
    }));
  };

  const btnClass =
    "flex items-center justify-between w-full bg-white px-2 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-100 h-9";

  return (
    <div
      className="p-3 rounded-md border border-gray-300"
      style={{ backgroundColor: "rgb(244,204,0)" }}
    >
      <h2 className="text-sm font-bold text-[rgb(85,90,90)] mb-3">
        Sequenz Filter
      </h2>

      <div className="grid grid-cols-[1fr_1fr] gap-x-4 gap-y-2 items-stretch relative">
        {/* Spalte 1 */}
        <div className="flex flex-col justify-between">
          {/* Bereich */}
          <div className="relative flex flex-col flex-grow">
            <label className="text-[10px] text-gray-600 mb-1">Bereich</label>
            <button onClick={() => toggleDropdown("area")} className={btnClass}>
              <span>{filters.sequenzFilter.selectedArea || "wählen"}</span>
              <ChevronDown
                className={`transition-transform duration-200 ${
                  openDropdown === "area" ? "rotate-180" : "rotate-0"
                }`}
                size={16}
              />
            </button>

            {openDropdown === "area" && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-y-auto z-50">
                {areas.map((area) => (
                  <div
                    key={area}
                    onClick={() => handleAreaChange(area)}
                    className={`px-2 py-1 cursor-pointer hover:bg-gray-100 ${
                      filters.sequenzFilter.selectedArea === area
                        ? "bg-gray-100 font-semibold"
                        : ""
                    }`}
                  >
                    {area}
                  </div>
                ))}
                <div
                  onClick={clearArea}
                  className="px-2 py-1 cursor-pointer hover:bg-gray-100 text-red-500 flex items-center gap-1"
                >
                  <X size={14} /> Löschen
                </div>
              </div>
            )}
          </div>

          {/* Datumstyp + Start/Ende */}
          <div className="flex gap-2 mt-2">
            {/* Datumstyp */}
            <div className="relative flex flex-col w-1/2">
              <label className="text-[10px] text-gray-600 mb-1">Datumstyp</label>
              <button
                onClick={() => toggleDropdown("type")}
                className={btnClass}
              >
                <span>{filters.sequenzFilter.selectedType || "wählen"}</span>
                <ChevronDown
                  className={`transition-transform duration-200 ${
                    openDropdown === "type" ? "rotate-180" : "rotate-0"
                  }`}
                  size={16}
                />
              </button>

              {openDropdown === "type" && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50">
                  {dateTypes.map((type) => (
                    <div
                      key={type}
                      onClick={() => handleTypeChange(type)}
                      className={`px-2 py-1 cursor-pointer hover:bg-gray-100 ${
                        filters.sequenzFilter.selectedType === type
                          ? "bg-gray-100 font-semibold"
                          : ""
                      }`}
                    >
                      {type}
                    </div>
                  ))}
                  <div
                    onClick={clearType}
                    className="px-2 py-1 cursor-pointer hover:bg-gray-100 text-red-500 flex items-center gap-1"
                  >
                    <X size={14} /> Löschen
                  </div>
                </div>
              )}
            </div>

            {/* Start/Ende */}
            <div className="relative flex flex-col w-1/2">
              <label className="text-[10px] text-gray-600 mb-1">Start/Ende</label>
              <button
                onClick={() => toggleDropdown("type2")}
                className={btnClass}
              >
                <span>{filters.sequenzFilter.selectedType2 || "wählen"}</span>
                <ChevronDown
                  className={`transition-transform duration-200 ${
                    openDropdown === "type2" ? "rotate-180" : "rotate-0"
                  }`}
                  size={16}
                />
              </button>

              {openDropdown === "type2" && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50">
                  {startEndTypes.map((t2) => (
                    <div
                      key={t2}
                      onClick={() => handleType2Change(t2)}
                      className={`px-2 py-1 cursor-pointer hover:bg-gray-100 ${
                        filters.sequenzFilter.selectedType2 === t2
                          ? "bg-gray-100 font-semibold"
                          : ""
                      }`}
                    >
                      {t2}
                    </div>
                  ))}
                  <div
                    onClick={clearType2}
                    className="px-2 py-1 cursor-pointer hover:bg-gray-100 text-red-500 flex items-center gap-1"
                  >
                    <X size={14} /> Löschen
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Spalte 2: Datum */}
        <div className="flex flex-col justify-between">
          {/* Von */}
          <div className="flex flex-col">
            <label className="text-[10px] text-gray-600 mb-1">Von</label>
            <input
              type="date"
              value={filters.sequenzFilter.from}
              onChange={(e) => handleDateChange("from", e.target.value)}
              className="bg-white border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(85,90,90)] h-9"
            />
          </div>

          {/* Bis */}
          <div className="flex flex-col mt-2">
            <label className="text-[10px] text-gray-600 mb-1">Bis</label>
            <input
              type="date"
              value={filters.sequenzFilter.till}
              onChange={(e) => handleDateChange("till", e.target.value)}
              className="bg-white border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(85,90,90)] h-9"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SequenzFilter;