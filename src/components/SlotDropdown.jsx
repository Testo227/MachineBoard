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
        className="w-full border-[rgb(222,222,222)] border-8 bg-white text-black px-3 py-2 focus:ring-2 focus:ring-gray-300 flex justify-between items-center"
        onClick={() => setOpen(!open)}
      >
        {value || "Bitte Slot auswählen..."}
        <span>▼</span>
      </button>

      {open && (
        <div className="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded shadow z-50 max-h-80 overflow-auto">
          {areas.map((area) => (
            <div key={area.id} className="border-b last:border-none">
              {/* Area Header */}
              <button
                className="w-full text-left px-3 py-2 bg-gray-100 font-semibold flex justify-between"
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
                          className={`w-full text-left px-5 py-2 
                            ${isCurrent ? "bg-green-700 text-white" : ""}
                            ${!isCurrent && isTaken ? "bg-yellow-100" : ""}
                            ${!isCurrent && !isTaken ? "bg-green-100" : ""}
                            hover:bg-gray-200`}
                          onClick={() => {
                            onChange(valueString);
                            setOpen(false);
                          }}
                        >
                          {slot.slotName}{" "}
                          {isTaken ? (
                            <span className={isCurrent ? "text-white" : "text-red-600 font-semibold"}>
                              (belegt von {assignedMachine.kunde} {assignedMachine.kNummer})
                            </span>
                          ) : (
                            <span className={isCurrent ? "text-white" : "text-green-700 font-semibold"}>
                              (freier Slot)
                            </span>
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