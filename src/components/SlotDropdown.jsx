import React, { useState, useRef, useEffect } from "react";

export default function SlotDropdown({ areas, value, onChange, machinelist }) {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
  const dropdownRef = useRef(null);

  // Klick außerhalb schließt Menü
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* BUTTON */}
      <button
        className="w-full bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 px-3 py-2.5 flex justify-between items-center hover:bg-white transition focus:outline-none focus:ring-2 focus:ring-[rgb(255,204,0)]"
        onClick={() => setOpen(!open)}
      >
        <span className={value ? "text-gray-800" : "text-gray-400"}>{value || "Slot auswählen…"}</span>
        <span className="text-gray-400 text-xs">▼</span>
      </button>

      {open && (
        <div className="absolute left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-auto">
          {areas.map((area) => (
            <div key={area.id} className="border-b border-gray-100 last:border-none">
              {/* Area Header */}
              <button
                className="w-full text-left px-3 py-2.5 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wide flex justify-between items-center hover:bg-gray-100 transition"
                onClick={() =>
                  setOpenGroup(openGroup === area.id ? null : area.id)
                }
              >
                {area.name}
                <span>{openGroup === area.id ? "▲" : "▼"}</span>
              </button>

              {/* Eingeklappte Slots */}
              {openGroup === area.id && (
                <ul className="bg-white">
                  {area.slots.map((slot) => {
                    const valueString = `${area.name}:${slot.slotName}`;

                    // ---> BELEGUNG PRÜFEN <---
                    const assignedMachine = machinelist.find(
                      (m) =>
                        m.area === area.name &&
                        m.position === slot.slotName
                    );

                    const isTaken = Boolean(assignedMachine);
                    const isCurrent = value === valueString; // aktueller Slot

                    return (
                      <li key={slot.id}>
                        <button
                          className={`w-full text-left px-5 py-2 text-sm flex items-center justify-between transition
                            ${isCurrent ? "bg-[rgb(255,204,0)]/20 text-[rgb(40,44,48)] font-semibold" : "hover:bg-gray-50 text-gray-700"}`}
                          onClick={() => {
                            onChange(valueString);
                            setOpen(false);
                          }}
                        >
                          <span>{slot.slotName}</span>
                          {isTaken ? (
                            <span className={`text-xs font-medium ${isCurrent ? "text-[rgb(40,44,48)]" : "text-amber-500"}`}>
                              {assignedMachine.kunde || assignedMachine.kNummer || "belegt"}
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-green-500">frei</span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}