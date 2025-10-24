import React, { useState, useEffect } from 'react';
import '../styles/style.css';

const Modal = ({ 
  areas,
  setAreas,
  currentmachine,
  machinelist,
  setmachinelist,
  isOpen,
  setIsOpen
}) => {
  const [localMachine, setLocalMachine] = useState(currentmachine);
  const [localSlot, setLocalSlot] = useState(`${currentmachine.area}:${currentmachine.position}`);

  useEffect(() => {
    setLocalMachine(currentmachine);
    setLocalSlot(`${currentmachine.area}:${currentmachine.position}`);
  }, [currentmachine]);

  const handleLocalChange = (field, value) => {
    setLocalMachine(prev => ({ ...prev, [field]: value }));
  };

  const handleLocalSlotChange = (e) => {
    setLocalSlot(e.target.value);
  };

  const handleSave = () => {
  const [newAreaName, newSlotName] = localSlot.split(':');

  const targetMachine = machinelist.find(
    m => m.area === newAreaName && m.position === newSlotName
  );

  if (!targetMachine) {
    // 🟩 Slot ist frei → einfach verschieben
    setmachinelist(prev =>
      prev.map(m =>
        m.id === currentmachine.id
          ? { ...m, ...localMachine, area: newAreaName, position: newSlotName }
          : m
      )
    );

    // Slots aktualisieren (alter frei, neuer belegt)
    setAreas(prev =>
      prev.map(area => {
        if (area.name === currentmachine.area) {
          return {
            ...area,
            slots: area.slots.map(slot =>
              slot.slotName === currentmachine.position
                ? { ...slot, occupied: false }
                : slot
            )
          };
        }
        if (area.name === newAreaName) {
          return {
            ...area,
            slots: area.slots.map(slot =>
              slot.slotName === newSlotName
                ? { ...slot, occupied: true }
                : slot
            )
          };
        }
        return area;
      })
    );
  } else {
    // 🟦 Slot belegt → Maschinen tauschen
    setmachinelist(prev =>
      prev.map(m => {
        if (m.id === currentmachine.id) {
          return { ...m, ...localMachine, area: newAreaName, position: newSlotName };
        }
        if (m.id === targetMachine.id) {
          return { ...m, area: currentmachine.area, position: currentmachine.position };
        }
        return m;
      })
    );

    // occupied bleibt true auf beiden Slots (keine Änderung nötig)
  }

  setIsOpen(false);
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-[9999]">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        <h2 className="text-2xl font-bold mb-4 text-[rgb(85,90,90)]">Maschine bearbeiten</h2>

        <div className="flex flex-col gap-3">
          <input
            className="kunde"
            value={localMachine.kunde || ""}
            onChange={(e) => handleLocalChange("kunde", e.target.value)}
            type="text"
            placeholder="Kunde"
          />
          <input
            className="k"
            value={localMachine.kNummer || ""}
            onChange={(e) => handleLocalChange("kNummer", e.target.value)}
            type="text"
            placeholder="K-Nummer"
          />

          <select value={localSlot} onChange={handleLocalSlotChange}>
            <option value="" disabled>Bitte Slot auswählen...</option>
            {areas.map(area => (
              <optgroup key={area.id} label={area.name}>
                {area.slots.map(slot => (
                  <option
                    key={slot.id}
                    value={`${area.name}:${slot.slotName}`}
                  >
                    {slot.slotName}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          <input
            className="Start"
            value={localMachine.Start || ""}
            onChange={(e) => handleLocalChange("Start", e.target.value)}
            type="date"
          />
          <input
            className="Ende"
            value={localMachine.Ende || ""}
            onChange={(e) => handleLocalChange("Ende", e.target.value)}
            type="date"
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => setIsOpen(false)}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Schließen
          </button>
          <button
            onClick={handleSave}
            className="bg-[rgb(255,204,0)] text-[rgb(85,90,90)] px-4 py-2 rounded font-bold hover:bg-yellow-400 transition"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;