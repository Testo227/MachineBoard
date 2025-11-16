import React, { useState, useEffect } from 'react';
import '../styles/style.css';
import { supabase } from '../supabaseClient';


//Components
import TagInputDropdown from './TagInput';
import SequenzTable from './SequenzTable';


const Modal = ({ 
  areas,
  setAreas,
  currentmachine,
  machinelist,
  setmachinelist,
  isOpen,
  setIsOpen,
  setFinishedMachines,
  finishedMachines,
  globalTags,
  setGlobalTags
}) => {
  const [localMachine, setLocalMachine] = useState({...currentmachine});
  const [localSlot, setLocalSlot] = useState(`${currentmachine.area}:${currentmachine.position}`);

  useEffect(() => {
    setLocalMachine(currentmachine);
    setLocalSlot(`${currentmachine.area}:${currentmachine.position}`);
  }, [currentmachine]);

  const handleLocalChange = (field, value) => {
    setLocalMachine(prev => ({ ...prev, [field]: value }));
  };

  //Fuer Spinner beim Speichern
  const [saving, setSaving] = useState(false);

  const handleLocalSlotChange = (e) => {
    setLocalSlot(e.target.value);
  };

  const handleSave = async () => {
  const [newAreaName, newSlotName] = localSlot.split(':');
  const targetMachine = machinelist.find(
    m => m.area === newAreaName && m.position === newSlotName
  );

  try {
    setSaving(true); // Spinner aktivieren

    // ------------------------
    // 1️⃣ Optimistisches UI Update
    // ------------------------
    setmachinelist(prev =>
      prev.map(m => {
        if (m.id === currentmachine.id) {
          return { ...m, ...localMachine, area: newAreaName, position: newSlotName };
        }
        if (targetMachine && m.id === targetMachine.id) {
          return { ...m, area: currentmachine.area, position: currentmachine.position };
        }
        return m;
      })
    );

    setAreas(prev =>
      prev.map(area => {
        if (area.name === currentmachine.area) {
          return {
            ...area,
            slots: area.slots.map(slot =>
              slot.slotName === currentmachine.position
                ? { ...slot, occupied: targetMachine ? true : false }
                : slot
            ),
          };
        }
        if (area.name === newAreaName) {
          return {
            ...area,
            slots: area.slots.map(slot =>
              slot.slotName === newSlotName
                ? { ...slot, occupied: true }
                : slot
            ),
          };
        }
        return area;
      })
    );

    // ------------------------
    // 2️⃣ Supabase Update in Parallel
    // ------------------------
    const updates = [];

    // Update currentmachine
    updates.push(
      supabase.from('machines').update({
        Typ: localMachine.Typ,
        Typ_Bezeichnung: localMachine.Typ_Bezeichnung,
        kunde: localMachine.kunde,
        kNummer: localMachine.kNummer,
        fNummer: localMachine.fNummer,
        WLW: localMachine.WLW,
        area: newAreaName,
        position: newSlotName
      }).eq('id', currentmachine.id)
    );

    // Wenn Slot belegt, update targetMachine auch
    if (targetMachine) {
      updates.push(
        supabase.from('machines').update({
          area: currentmachine.area,
          position: currentmachine.position
        }).eq('id', targetMachine.id)
      );
    }

    // Kommentare
    if (localMachine.kommentare?.length) {
      localMachine.kommentare.forEach(k => {
        updates.push(
          supabase.from('kommentare').update({ text: k.text }).eq('id', k.id)
        );
      });
    }

    // Mängel
    if (localMachine.maengel?.length) {
      localMachine.maengel.forEach(m => {
        updates.push(
          supabase.from('maengel').update({ text: m.text }).eq('id', m.id)
        );
      });
    }

    // Dateien
    if (localMachine.dateien?.length) {
      localMachine.dateien.forEach(d => {
        updates.push(
          supabase.from('dateien').update({ name: d.name, url: d.url }).eq('id', d.id)
        );
      });
    }

    // Alle Updates parallel ausführen
    const results = await Promise.all(updates);
    results.forEach(res => {
      if (res.error) throw res.error;
    });

    setIsOpen(false); // Modal schließen
  } catch (err) {
    console.error("Fehler beim Speichern in der Datenbank:", err);
    alert("Fehler beim Speichern der Maschine. Schau in die Konsole für Details.");
  } finally {
    setSaving(false); // Spinner aus
  }
  };

  //Loeschen von Maschinen
  const handleDeleteMachine = () => {
  if (!window.confirm("Willst du diese Maschine wirklich löschen?")) return;

  setmachinelist(prev => prev.filter(m => m.id !== currentmachine.id));
  setAreas(prev =>
    prev.map(area => {
      if (area.name === currentmachine.area) {
        return {
          ...area,
          slots: area.slots.map(slot =>
            slot.slotName === currentmachine.position
              ? { ...slot, occupied: false }
              : slot
          ),
        };
      }
      return area;
    })
  );
  setIsOpen(false);
  };


  //Fertigmelden von Maschinen
  const handleFertigmelden = () => {
  if (!window.confirm("Willst du diese Maschine wirklich als fertig melden?")) return;

  const today = new Date().toISOString().split("T")[0]; // aktuelles Datum yyyy-mm-dd

  // Maschine mit Fertigstellungsdatum versehen
  const finishedMachine = {
    ...localMachine,
    Fertigstellung: today,
  };

  // Maschine aus machinelist entfernen
  setmachinelist(prev => prev.filter(m => m.id !== currentmachine.id));

  // Maschine in finishedMachines hinzufügen
  setFinishedMachines(prev => {
    const updated = [...prev, finishedMachine];
    console.log("🏁 Aktueller finishedMachines State:", updated);
    return updated;
  });

  // Slot als frei markieren
  setAreas(prev =>
    prev.map(area => {
      if (area.name === currentmachine.area) {
        return {
          ...area,
          slots: area.slots.map(slot =>
            slot.slotName === currentmachine.position
              ? { ...slot, occupied: false }
              : slot
          ),
        };
      }
      return area ;
    })
  );

  // Modal schließen
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
              <div className='flex gap-4'>
                <div className="flex flex-col space-y-1 w-142">
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
                <div className="flex flex-col space-y-1 w-142">
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
                  <TagInputDropdown
                    machineTags={localMachine.Tags || []}
                    onChange={(updatedIds) => setLocalMachine(prev => ({ ...prev, Tags: updatedIds }))}
                    globalTags={globalTags}
                    setGlobalTags={setGlobalTags}
                  >
                  </TagInputDropdown>
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
        <div className="flex justify-between items-center mt-6">
            <button
              onClick={handleDeleteMachine}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition cursor-pointer"
            >
              Maschine Löschen
            </button>

            <button
              onClick={handleFertigmelden}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition cursor-pointer"
            >
              Maschine fertig melden
            </button>

            <div className="flex gap-4">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-[rgb(85,90,90)] text-white px-4 py-2 rounded hover:bg-gray-400 transition cursor-pointer"
              >
                Schließen
              </button>
              <button
                onClick={handleSave}
                className="bg-[rgb(255,204,0)] text-[rgb(85,90,90)] px-4 py-2 rounded font-bold hover:bg-yellow-500 transition flex items-center justify-center"
                disabled={saving} // während Save deaktivieren
              >
                {saving ? (
                  <div className="loader w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Speichern"
                )}
              </button>
            </div>
        </div>
        
      </div>
    </div>
  );
};

export default Modal;