import React, { useState, useEffect } from 'react';
import '../styles/style.css';


//Components
import TagInput from './TagInput';
import SequenzTable from './SequenzTable';

const Modal = ({ 
  areas,
  setAreas,
  currentmachine,
  machinelist,
  setmachinelist,
  isOpen,
  setIsOpen
}) => {
  const [localMachine, setLocalMachine] = useState({
  ...currentmachine,
  sequenzen: currentmachine.sequenzen || [
    { id: 1, sequenz: 1, bereich: "Hauptmontage", planStart: "", planEnde: "", istStart: "", istEnde: "", status: "Offen" },
    { id: 2, sequenz: 2, bereich: "Prueffeld Pumpe", planStart: "", planEnde: "", istStart: "", istEnde: "", status: "Offen" },
    { id: 3, sequenz: 3, bereich: "Prueffeld Mast", planStart: "", planEnde: "", istStart: "", istEnde: "", status: "Offen" },
    { id: 4, sequenz: 4, bereich: "Lackierung", planStart: "", planEnde: "", istStart: "", istEnde: "", status: "Offen" },
    { id: 5, sequenz: 5, bereich: "Endmontage", planStart: "", planEnde: "", istStart: "", istEnde: "", status: "Offen" },
    { id: 6, sequenz: 6, bereich: "PDI", planStart: "", planEnde: "", istStart: "", istEnde: "", status: "Offen" },
  ]
});
  const [localSlot, setLocalSlot] = useState(`${currentmachine.area}:${currentmachine.position}`);

  useEffect(() => {
    setLocalMachine(currentmachine);
    setLocalSlot(`${currentmachine.area}:${currentmachine.position}`);
  }, [currentmachine]);

  const handleLocalChange = (field, value) => {
    setLocalMachine(prev => ({ ...prev, [field]: value }));
  };

  const handleTagChange = (updatedTags) => {
  setLocalMachine(prev => ({
    ...prev,
    Tags: updatedTags
  }));
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
      <div className="bg-white rounded-lg shadow-lg p-6 w-300 h-300 relative">
        <h2 className="text-2xl font-bold mb-4 text-[rgb(85,90,90)]">Maschine bearbeiten</h2>

        <div className="flex flex-col gap-3">
          <div className='flex gap-4'>
            <div className="flex flex-col space-y-1 w-150">
              <label
                htmlFor="kunde"
                className="text-[rgb(85,90,90)] text-sm font-medium"
              >
                Kunde
              </label>
              <input
                id="kunde"
                className="kunde border border-[rgb(222,222,222)] border-8 bg-white placeholder-gray-400 text-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(222,222,222)]"
                value={localMachine.kunde || ""}
                onChange={(e) => handleLocalChange("kunde", e.target.value)}
                type="text"
                placeholder="..."
              />
            </div>
            <div className="flex flex-col space-y-1 w-150">
              <label
                htmlFor="kNummer"
                className="text-[rgb(85,90,90)] text-sm font-medium"
              >
                K-Nummer
              </label>
              <input
                id="kNummer"
                className="kNummer border border-[rgb(222,222,222)] border-8 bg-white placeholder-gray-400 text-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(222,222,222)]"
                value={localMachine.kNummer || ""}
                onChange={(e) => handleLocalChange("kNummer", e.target.value)}
                type="text"
                placeholder="..."
              />
            </div>
          </div>
          <div className='flex gap-4'>
            <div className="flex flex-col space-y-1 w-69">
              <label
                htmlFor="Typ"
                className="text-[rgb(85,90,90)] text-sm font-medium"
              >
                Typ
              </label>
              <select value={localMachine.Typ || ""} onChange={(e) => handleLocalChange("Typ", e.target.value)} className='Typ border border-[rgb(222,222,222)] border-8 bg-white placeholder-gray-400 text-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(222,222,222)]'>
                <option value="" disabled>...</option>
                <option key={1}>BSF</option>
                <option key={2}>PUMI</option>
                <option key={3}>BSA</option>
                <option key={4}>Prototyp</option>
                <option key={5}>E-Mischer</option>
                <option key={6}>Leerslot</option>
              </select>
            </div>
            <div className="flex flex-col space-y-1 w-69">
              <label
                htmlFor="Typ-Bezeichnung"
                className="text-[rgb(85,90,90)] text-sm font-medium"
              >
                Typ-Bezeichnung
              </label>
              <input
                id="Typ_Bezeichnung"
                className="Typ-Bezeichnung border border-[rgb(222,222,222)] border-8 bg-white placeholder-gray-400 text-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(222,222,222)]"
                value={localMachine.Typ_Bezeichnung || ""}
                onChange={(e) => handleLocalChange("Typ_Bezeichnung", e.target.value)}
                type="text"
                placeholder="..."
              />
            </div>
          <div className='flex gap-4'>
              <div className="flex flex-col space-y-1 w-142">
                <label
                htmlFor="Wunschliefertermin"
                className="text-[rgb(85,90,90)] text-sm font-medium"
              >
                Wunschliefertermin
              </label>
              <input
                id="WLW"
                className="Wunschliefertermin border border-[rgb(222,222,222)] border-8 bg-white placeholder-gray-400 text-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(222,222,222)]"
                value={localMachine.WLW || ""}
                onChange={(e) => handleLocalChange("WLW", e.target.value)}
                type="text"
                placeholder="..."
              />
              </div>
          </div>
          </div>
          <div className='flex gap-4'>
            <div className='flex gap-4'>
                <div className="flex flex-col space-y-1 w-69">
                  <label
                  htmlFor="Start-Datum"
                  className="text-[rgb(85,90,90)] text-sm font-medium"
                >
                  Start-Datum
                </label>
                <input
                  id="Start"
                  className="Ende border border-[rgb(222,222,222)] border-8 bg-white placeholder-gray-400 text-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(222,222,222)]"
                  value={localMachine.Start || ""}
                  onChange={(e) => handleLocalChange("Start", e.target.value)}
                  type="date"
                  placeholder="..."
                />
                </div>
              </div>
              <div className='flex gap-4'>
                <div className="flex flex-col space-y-1 w-69">
                  <label
                  htmlFor="End-Datum"
                  className="text-[rgb(85,90,90)] text-sm font-medium"
                >
                  End-Datum
                </label>
                <input
                  id="Ende"
                  className="Ende border border-[rgb(222,222,222)] border-8 bg-white placeholder-gray-400 text-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(222,222,222)]"
                  value={localMachine.Ende || ""}
                  onChange={(e) => handleLocalChange("Ende", e.target.value)}
                  type="date"
                  placeholder="..."
                />
                </div>
              </div>
              <div className='flex gap-4'>
              <div className='flex gap-4'>
                <div className="flex flex-col space-y-1 w-69">
                    <label
                    htmlFor="Aktuelle Position"
                    className="text-[rgb(85,90,90)] text-sm font-medium"
                  >
                    Aktuelle Position
                  </label>
                  <div className="Ende border border-[rgb(222,222,222)] border-8 bg-white placeholder-gray-400 text-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(222,222,222)]" >
                    {currentmachine.area} auf {currentmachine.position}
                  </div>
              </div>
            </div>
            </div>
            <div className='flex gap-4'>
                <div className="flex flex-col space-y-1 w-69">
                    <label
                    htmlFor="Verschieben"
                    className="text-[rgb(85,90,90)] text-sm font-medium"
                  >
                    Maschine nach ... verschieben 
                  </label>
                  <select value={localSlot} onChange={handleLocalSlotChange} className="Ende border border-[rgb(222,222,222)] border-8 bg-white placeholder-gray-400 text-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(222,222,222)]">
                    <option value="" disabled>Bitte Slot auswählen...</option>
                    {areas.map(area => (
                      <optgroup key={area.id} label={area.name}>
                        {area.slots.map(slot => (
                          <option
                            key={slot.id}
                            value={`${area.name}:${slot.slotName}`}
                          >
                            {area.name} {slot.slotName}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
              </div>
            </div>
          </div>
          <div className='flex gap-4'>
            <div className='flex flex-col space-y-1 w-290'>
                 <label
                    htmlFor="Tags"
                    className="text-[rgb(85,90,90)] text-sm font-medium"
                  >
                    Tags 
                  </label> 
                  <TagInput
                    tags={localMachine.Tags || []}
                    onChange={handleTagChange}
                  >
                  </TagInput>
            </div>
            <div className='flex gap-4'>
            <div className='flex flex-col space-y-1 w-142'>
                 <label
                    htmlFor="Kommentare"
                    className="text-[rgb(85,90,90)] text-sm font-medium"
                  >
                  Kommentare
                  </label> 
                  <textarea
                  id="Kommentare"
                  className=" resize-none border border-[rgb(222,222,222)]  !h-[200px] border-8 bg-white placeholder-gray-400 text-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(222,222,222)]"
                  value={localMachine.Kommentare || ""}
                  onChange={(e) => handleLocalChange("Kommentare", e.target.value)}
                  type="text"
                  placeholder="..."
                />
            </div>
            
          </div>
          </div>
          <div className="mt-6">
            <SequenzTable
              sequenzen={localMachine.sequenzen}
              onChange={(updated) => handleLocalChange("sequenzen", updated)}
            />
          </div>
          


          
          
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => setIsOpen(false)}
            className="bg-[rgb(85,90,90)] text-white px-4 py-2 rounded hover:bg-gray-400 transition"
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