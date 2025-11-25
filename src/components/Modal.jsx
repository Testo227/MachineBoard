import React, { useState, useEffect } from 'react';
import '../styles/style.css';
import { supabase } from '../supabaseClient';


//Components
import TagInputDropdown from './TagInput';
import SequenzTable from './SequenzTable';
import SlotDropdown from './SlotDropdown';
import { useToast } from "./ToastContext";


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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const { addToast } = useToast();
  const [showFertigModal, setShowFertigModal] = useState(false);
  const [loadingFertig, setLoadingFertig] = useState(false);

  // Immer die aktuelle Maschine aus machinelist holen, falls sich irgendwas ändert
  useEffect(() => {
    if (!currentmachine) return;

    const freshMachine = machinelist.find(m => m.id === currentmachine.id);
    if (freshMachine) {
      setLocalMachine({ ...freshMachine });
      setLocalSlot(`${freshMachine.area}:${freshMachine.position}`);
    }
  }, [machinelist, currentmachine?.id]);

  useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = "hidden";   // Scroll verhindern
  } else {
    document.body.style.overflow = "auto";     // Scroll wieder erlauben
  }

  return () => {
    document.body.style.overflow = "auto";     // Cleanup falls Modal unmounted
  };
}, [isOpen]);

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

  // Prüfen, ob der Zielslot von einer anderen Maschine besetzt ist
  const targetMachine = machinelist.find(
    m => m.area === newAreaName && m.position === newSlotName
  );

  try {
    setSaving(true);

    // --- DB Updates vorbereiten ---
    const updates = [];

    // Update currentMachine
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

    // Update targetMachine falls Slot belegt ist
    if (targetMachine) {
      updates.push(
        supabase.from('machines').update({
          area: currentmachine.area,
          position: currentmachine.position
        }).eq('id', targetMachine.id)
      );
    }

    // Kommentare aktualisieren
    localMachine.kommentare?.forEach(k => {
      updates.push(
        supabase.from('kommentare').update({ text: k.text }).eq('id', k.id)
      );
    });

    // Mängel aktualisieren
    localMachine.maengel?.forEach(m => {
      updates.push(
        supabase.from('maengel').update({ text: m.text }).eq('id', m.id)
      );
    });

    // Dateien aktualisieren
    localMachine.dateien?.forEach(d => {
      updates.push(
        supabase.from('dateien').update({ name: d.name, url: d.url }).eq('id', d.id)
      );
    });

    


    // --- Alle DB Updates parallel ausführen ---
    const results = await Promise.all(updates);
    results.forEach(res => {
      if (res.error) throw res.error;
    });

    // --- Tags seriell behandeln ---
      // 1️⃣ Alte Tags löschen
      await supabase
        .from("machine_tags")
        .delete()
        .eq("machine_id", currentmachine.id);

      // 2️⃣ Neue Tags einfügen
      if (localMachine.Tags?.length > 0) {
        const tagInserts = localMachine.Tags.map(tagId => ({
          machine_id: currentmachine.id,
          tag_id: tagId
        }));

        const { error: insertError } = await supabase
          .from("machine_tags")
          .insert(tagInserts);

        if (insertError) throw insertError;
      }

    // --- State aktualisieren nach erfolgreichem DB Update ---
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

    setIsOpen(false);
    addToast("✅ Maschine wurde erfolgreich gespeichert!", "success");

  } catch (err) {
    console.error("Fehler beim Speichern der Maschine:", err);
    addToast("❌ Fehler beim Speichern der Maschine!", "error");
  } finally {
    setSaving(false);
  }
};


  // Loeschen von Maschinen
  const handleConfirmDelete = async () => {
  setLoadingDelete(true);

  const { error } = await supabase
    .from("machines")
    .delete()
    .eq("id", currentmachine.id);

  if (error) {
    console.error("Fehler beim Löschen der Maschine:", error);
    addToast("❌ Fehler beim Löschen der Maschine!", "error");
    setLoadingDelete(false);
    return;
  }


  

  // Lokale machinelist aktualisieren
  setmachinelist(prev => prev.filter(m => m.id !== currentmachine.id));

  // Slot im Frontend-State freigeben
  setAreas(prev =>
    prev.map(area => {
      if (area.id === currentmachine.area_id) {
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

  setShowDeleteModal(false);
  setIsOpen(false);

  addToast("✅ Maschine wurde erfolgreich gelöscht!", "success");
  setLoadingDelete(false);
};


  //Fertigmelden von Maschinen
  const handleConfirmFertigmelden = async () => {
    try {
      setLoadingFertig(true);

      const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

      // Status und Fertigstellung in der DB updaten
      const { error } = await supabase
        .from("machines")
        .update({ status: "fertig", fertigstellung: today })
        .eq("id", currentmachine.id);

      if (error) throw error;

      // Maschine aus machinelist entfernen
      setmachinelist(prev => prev.filter(m => m.id !== currentmachine.id));

      // Maschine zu finishedMachines hinzufügen (lokal)
      setFinishedMachines(prev => [...prev, { ...localMachine, Fertigstellung: today }]);

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
          return area;
        })
      );

      // Modals schließen
      setShowFertigModal(false);
      setIsOpen(false);
      addToast("✅ Maschine wurde erfolgreich fertiggemeldet!", "success");

    } catch (err) {
      console.error("Fehler beim Fertigmelden:", err);
      addToast("❌ Fehler beim Fertigmelden der Maschine!", "error");
    } finally {
      setLoadingFertig(false);
    }
  };

  



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-[9999]">
      <div className="bg-white rounded-lg shadow-lg p-6 w-300 h-250 relative">
        <div className="flex justify-between items-center mb-4">
            {/* Linker Teil */}
            <h2 className="text-2xl font-bold text-[rgb(85,90,90)]">Maschine bearbeiten</h2>

            {/* Rechter Teil */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-700 transition cursor-pointer"
              >
                🗑️ Löschen
              </button>
              <button
                onClick={() => setShowFertigModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition cursor-pointer"
              >
                ✅ Fertigmelden
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-[rgb(85,90,90)] text-white px-4 py-2 rounded hover:bg-gray-400 transition cursor-pointer"
              >
                Schließen
              </button>
              <button
                onClick={handleSave}
                className="bg-[rgb(255,204,0)] text-[rgb(85,90,90)] px-4 py-2 rounded font-bold hover:bg-yellow-500 hover:cursor-pointer transition flex items-center justify-center"
                disabled={saving}
              >
                {saving ? (
                  <div className="loader w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Speichern"
                )}
              </button>
            </div>
          </div>
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
            <div className="flex flex-col space-y-1 w-118">
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
            <div className="flex flex-col space-y-1 w-32">
                <label
                htmlFor="Wunschliefertermin"
                className="text-[rgb(85,90,90)] text-sm font-medium"
              >
                WLW
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
          <div className='flex gap-4'>
            <div className="flex flex-col space-y-1 w-40">
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
            <div className="flex flex-col space-y-1 w-95">
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
              <div className='flex flex-col space-y-1 w-145'>
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
                  <SlotDropdown
                    areas={areas}
                    value={localSlot}
                    machinelist={machinelist}
                    onChange={(newValue) => {
                    handleLocalSlotChange({ target: { value: newValue } });
                    }}
                  />
              </div>
            </div>
          </div>
          <div className='flex gap-4'>
            
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
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[99999] backdrop-blur-sm">
            <div className="relative bg-white w-[90%] max-w-[400px] p-6 rounded-2xl shadow-xl border border-[rgb(85,90,90)]">
              
              <h2 className="text-xl font-bold text-[rgb(85,90,90)] text-center mb-4">
                Maschine wirklich löschen?
              </h2>

              <p className="text-center text-[rgb(85,90,90)] opacity-80 mb-6">
                Diese Aktion kann nicht rückgängig gemacht werden.
              </p>

              <div className="flex justify-between gap-4">

                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2 rounded-xl border border-[rgb(85,90,90)] text-[rgb(85,90,90)]
                    font-semibold hover:bg-[rgb(85,90,90)] hover:text-white transition hover:cursor-pointer"
                >
                  Abbrechen
                </button>

                <button
                  onClick={handleConfirmDelete}
                  disabled={loadingDelete}
                  className="flex-1 py-2 rounded-xl font-semibold bg-red-600 text-white hover:bg-red-700
                    transition hover:cursor-pointer disabled:opacity-50"
                >
                  {loadingDelete ? "Lösche..." : "Löschen"}
                </button>

              </div>
            </div>
          </div>
        )}
        {showFertigModal && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[99999] backdrop-blur-sm">
            <div className="relative bg-white w-[90%] max-w-[400px] p-6 rounded-2xl shadow-xl border border-[rgb(85,90,90)]">
              
              <h2 className="text-xl font-bold text-[rgb(85,90,90)] text-center mb-4">
                Maschine wirklich fertig melden?
              </h2>

              <p className="text-center text-[rgb(85,90,90)] opacity-80 mb-6">
                Hiermit wird die Maschine an den Versand übergeben.
              </p>

              <div className="flex justify-between gap-4">

                <button
                  onClick={() => setShowFertigModal(false)}
                  className="flex-1 py-2 rounded-xl border border-[rgb(85,90,90)] text-[rgb(85,90,90)]
                    font-semibold hover:bg-[rgb(85,90,90)] hover:text-white transition hover:cursor-pointer"
                >
                  Abbrechen
                </button>

                <button
                  onClick={handleConfirmFertigmelden}
                  disabled={loadingFertig}
                  className="flex-1 py-2 rounded-xl font-semibold bg-green-600 text-white hover:bg-green-700
                    transition hover:cursor-pointer disabled:opacity-50"
                >
                  {loadingFertig ? "Fertig..." : "Fertigmelden"}
                </button>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;