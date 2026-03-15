import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../styles/style.css';
import { supabase } from '../supabaseClient';


//Components
import TagInputDropdown from './TagInput';
import Comments from './Comments';
import Tasks from './Tasks';
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const { addToast } = useToast();
  const [showFertigModal, setShowFertigModal] = useState(false);
  const [loadingFertig, setLoadingFertig] = useState(false);
  const [fertigDate, setFertigDate] = useState(() => new Date().toISOString().split("T")[0]);

  // Immer die aktuelle Maschine aus machinelist holen, falls sich irgendwas ändert
  useEffect(() => {
    if (!currentmachine) return;

    const freshMachine = machinelist.find(m => m.id === currentmachine.id);
    if (freshMachine) {
      setLocalMachine({ ...freshMachine });
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

  const handleSave = async () => {
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
        allgemeines: localMachine.allgemeines,
        start_date: localMachine.start_date || null,
        end_date: localMachine.end_date || null,
      }).eq('id', currentmachine.id)
    );

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
      prev.map(m => m.id === currentmachine.id ? { ...m, ...localMachine } : m)
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

      // Status und Fertigstellung in der DB updaten
      const { error } = await supabase
        .from("machines")
        .update({ status: "fertig", fertigstellung: fertigDate })
        .eq("id", currentmachine.id);

      if (error) throw error;

      // Maschine aus machinelist entfernen
      setmachinelist(prev => prev.filter(m => m.id !== currentmachine.id));

      // Maschine zu finishedMachines hinzufügen (lokal)
      setFinishedMachines(prev => [...prev, { ...localMachine, fertigstellung: fertigDate }]);

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

  const inputCls = "w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgb(255,204,0)] focus:bg-white focus:border-transparent transition";
  const labelCls = "text-xs font-semibold text-gray-400 uppercase tracking-wider";
  const sectionCls = "bg-white rounded-xl p-5 shadow-sm flex flex-col gap-4";
  const sectionTitleCls = "text-xs font-bold text-gray-400 uppercase tracking-widest pb-1 border-b border-gray-100";

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[9999] p-4">
      <div className="bg-[rgb(245,246,248)] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* ── Header ── */}
        <div className="bg-[rgb(70,75,82)] px-6 py-4 flex items-center justify-between flex-shrink-0 rounded-t-2xl">
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">Maschine bearbeiten</h2>
            {(localMachine.Typ || localMachine.kunde) && (
              <p className="text-white/50 text-xs mt-0.5">
                {[localMachine.Typ, localMachine.Typ_Bezeichnung, localMachine.kunde].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition text-2xl leading-none cursor-pointer">×</button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto flex-1 p-5 flex flex-col gap-4">

          {/* Maschineninfo */}
          <div className={sectionCls}>
            <h3 className={sectionTitleCls}>Maschineninformationen</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 flex flex-col gap-1.5">
                <label className={labelCls}>Kunde</label>
                <input className={inputCls} value={localMachine.kunde || ""} onChange={(e) => handleLocalChange("kunde", e.target.value)} type="text" placeholder="Kundenname" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>K-Nummer</label>
                <input className={inputCls} value={localMachine.kNummer || ""} onChange={(e) => handleLocalChange("kNummer", e.target.value)} type="text" placeholder="z. B. 123456" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>WLW</label>
                <input className={inputCls} value={localMachine.WLW || ""} onChange={(e) => handleLocalChange("WLW", e.target.value)} type="text" placeholder="Wunschliefertermin" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Typ</label>
                <select value={localMachine.Typ || ""} onChange={(e) => handleLocalChange("Typ", e.target.value)} className={inputCls}>
                  <option value="" disabled>Typ wählen…</option>
                  <option>BSF</option>
                  <option>PUMI</option>
                  <option>BSA</option>
                  <option>Prototyp</option>
                  <option>E-Mischer</option>
                  <option>Leerslot</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Typ-Bezeichnung</label>
                <input className={inputCls} value={localMachine.Typ_Bezeichnung || ""} onChange={(e) => handleLocalChange("Typ_Bezeichnung", e.target.value)} type="text" placeholder="z. B. 20T, 30T …" />
              </div>
              <div className="col-span-2 flex flex-col gap-1.5">
                <label className={labelCls}>Tags</label>
                <TagInputDropdown
                  machineTags={localMachine.Tags || []}
                  onChange={(updatedIds) => setLocalMachine(prev => ({ ...prev, Tags: updatedIds }))}
                  globalTags={globalTags}
                  setGlobalTags={setGlobalTags}
                />
              </div>
            </div>
          </div>

          {/* Allgemeines & Einsatzdaten */}
          <div className={sectionCls}>
            <h3 className={sectionTitleCls}>Allgemeines</h3>
            <div className="flex flex-col gap-1.5">
              <textarea
                className={`${inputCls} resize-none h-24`}
                value={localMachine.allgemeines || ""}
                onChange={(e) => handleLocalChange("allgemeines", e.target.value)}
                placeholder="Allgemeine Informationen zur Maschine…"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Start</label>
                <input
                  type="date"
                  className={inputCls}
                  value={localMachine.start_date || ""}
                  onChange={(e) => handleLocalChange("start_date", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Ende</label>
                <input
                  type="date"
                  className={inputCls}
                  value={localMachine.end_date || ""}
                  onChange={(e) => handleLocalChange("end_date", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Aufgaben */}
          <div className={sectionCls}>
            <h3 className={sectionTitleCls}>Aufgaben</h3>
            <Tasks machineId={currentmachine.id} />
          </div>

          {/* Kommentare */}
          <div className={sectionCls}>
            <h3 className={sectionTitleCls}>Kommentare</h3>
            <Comments machineId={currentmachine.id} />
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="bg-white px-6 py-3.5 border-t border-gray-100 flex items-center justify-between gap-3 flex-shrink-0 rounded-b-2xl">
          <div className="flex gap-2">
            <button onClick={() => setShowDeleteModal(true)} className="px-3 py-2 rounded-lg border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition cursor-pointer">
              Löschen
            </button>
            <button onClick={() => setShowFertigModal(true)} className="px-3 py-2 rounded-lg border border-green-200 text-green-600 text-sm font-medium hover:bg-green-50 transition cursor-pointer">
              Fertigmelden
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition cursor-pointer">
              Abbrechen
            </button>
            <button onClick={handleSave} disabled={saving} className="px-5 py-2 rounded-lg bg-[rgb(255,204,0)] text-[rgb(40,44,48)] text-sm font-bold hover:brightness-95 transition cursor-pointer flex items-center gap-2 min-w-[100px] justify-center disabled:opacity-60">
              {saving ? <div className="w-4 h-4 border-2 border-t-transparent border-[rgb(40,44,48)] rounded-full animate-spin" /> : "Speichern"}
            </button>
          </div>
        </div>

      </div>

      {/* ── Delete confirmation ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[99999] p-4">
          <div className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-2xl">
            <h2 className="text-lg font-bold text-[rgb(85,90,90)] text-center mb-1">Maschine löschen?</h2>
            <p className="text-center text-gray-400 text-sm mb-6">Diese Aktion kann nicht rückgängig gemacht werden.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition cursor-pointer">Abbrechen</button>
              <button onClick={handleConfirmDelete} disabled={loadingDelete} className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition cursor-pointer disabled:opacity-50">
                {loadingDelete ? "Lösche…" : "Ja, löschen"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Fertig confirmation ── */}
      {showFertigModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[99999] p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-[rgb(70,75,82)] px-5 py-4">
              <h2 className="text-white font-bold text-base">Maschine fertigmelden?</h2>
              <p className="text-white/50 text-xs mt-0.5">Hiermit wird die Maschine an den Versand übergeben.</p>
            </div>
            <div className="p-5 flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Wann wurde die Maschine fertiggestellt?</label>
                <input
                  type="date"
                  value={fertigDate}
                  onChange={e => setFertigDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[rgb(255,204,0)] focus:bg-white focus:border-transparent transition"
                />
              </div>
            </div>
            <div className="px-5 pb-5 flex gap-3">
              <button onClick={() => setShowFertigModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition cursor-pointer">Abbrechen</button>
              <button onClick={handleConfirmFertigmelden} disabled={loadingFertig || !fertigDate} className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-green-600 text-white hover:bg-green-700 transition cursor-pointer disabled:opacity-50">
                {loadingFertig ? "Speichere…" : "Fertigmelden"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
};

export default Modal;