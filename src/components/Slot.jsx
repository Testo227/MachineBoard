import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Card from './Card';
import { useToast } from "./ToastContext";


const Slot = ({
  slotName,
  machinelist,
  setmachinelist,
  areas,
  thisarea,
  filteredMachines,
  finishedMachines,
  setFinishedMachines,
  globalTags,
  setGlobalTags,
  setAreas
}) => {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const [showModal, setShowModal] = useState(false);

  // 🔹 currentMachine jetzt aus dem State ableiten
  const [currentMachine, setCurrentMachine] = useState(
    machinelist.find(m => m.position === slotName && m.area === thisarea.name) || null
  );

  const isFilteredIn = filteredMachines?.some(
    m => m.id === currentMachine?.id
  );

  // prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
  }, [showModal]);

  useEffect(() => {
    const machine = machinelist.find(
      m => m.area === thisarea.name && m.position === slotName
    );
    setCurrentMachine(machine || null);
  }, [machinelist, thisarea.name, slotName]);

  const handleCreateMachine = async () => {
    if (currentMachine) return;

    setLoading(true);

    try {
      // 1️⃣ Maschine erzeugen
      const { data: newMachineRaw, error: machineError } = await supabase
        .from('machines')
        .insert({
          position: slotName,
          area: thisarea.name,
          Typ: "",
          Typ_Bezeichnung: "",
          kNummer: null,
          fNummer: null,
          WLW: ""
        })
        .select()
        .single();

      if (machineError) throw machineError;

      // 2️⃣ Relationen anlegen
     // 2️⃣ Relationen erstellen 
     const sequenzenArray = Array.from({ length: 13 }, (_, i) => ({ sequenz: i + 1, bereich: [ "PPM1","PPM2","PUMI","Dock","Prüffeld Pumpe","Prüffeld Mast", "Lackierung","Endmontage","PDI","Konservieren","Optimieren","BSA Linie","BSA Dock" ][i], planStart: null, planEnde: null, istStart: null, istEnde: null, status: "Offen", DLZPlan: null, DLZIst: null, machine_id: newMachineRaw.id })); 
     const kommentareArray = [{ text: "", machine_id: newMachineRaw.id }]; 
     const maengelArray = [{ text: "", machine_id: newMachineRaw.id }]; 
     const dateienArray = [{ name: "", url: "", machine_id: newMachineRaw.id }]; 
     
     await Promise.all([ supabase.from('sequenzen').insert(sequenzenArray), 
      supabase.from('kommentare').insert(kommentareArray), 
      supabase.from('maengel').insert(maengelArray), 
      supabase.from('dateien').insert(dateienArray) ]);

      // 3️⃣ Maschine vollständig neu laden
      const { data: freshMachine, error: fetchError } = await supabase
        .from("machines")
        .select(`
          *,
          sequenzen (*),
          kommentare (*),
          maengel (*),
          dateien (*)
        `)
        .eq("id", newMachineRaw.id)
        .single();

      if (fetchError) throw fetchError;

      // 4️⃣ States aktualisieren
      setmachinelist(prev => [...prev, freshMachine]);
      setCurrentMachine(freshMachine);

      // 5️⃣ Slot belegen
      setAreas(prev =>
        prev.map(area =>
          area.id === thisarea.id
            ? {
                ...area,
                slots: area.slots.map(s =>
                  s.slotName === slotName ? { ...s, occupied: true } : s
                )
              }
            : area
        )
      );

      addToast("✅ Maschine wurde erfolgreich erstellt!", "success");

    } catch (err) {
      console.error("Fehler beim Erstellen der Maschine:", err);
      addToast("❌ Fehler beim Erstellen der Maschine!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-white/40 border border-white/60 rounded-xl relative backdrop-blur-sm w-full h-full min-w-0 min-h-0 overflow-hidden">
      <span className="absolute top-0.5 left-1 font-bold text-[rgb(85,90,90)]/70 leading-none select-none z-10" style={{ fontSize: 'clamp(6px, 0.55vw, 9px)' }}>
        {slotName}
      </span>

      {currentMachine ? (
        <div className="absolute inset-0 flex items-center justify-center" style={{ padding: '3px', paddingTop: '16px', paddingBottom: '10px' }}>
          <Card
            machineid={currentMachine.id}
            currentMachine={currentMachine}
            slotName={slotName}
            machinelist={machinelist}
            setmachinelist={setmachinelist}
            areas={areas}
            finishedMachines={finishedMachines}
            setFinishedMachines={setFinishedMachines}
            globalTags={globalTags}
            setGlobalTags={setGlobalTags}
            dimmed={!isFilteredIn}
            setAreas={setAreas}
          />
        </div>
      ) : (
        <div
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center flex-1 hover:cursor-pointer group"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-t-transparent border-[rgb(85,90,90)] rounded-full animate-spin"></div>
          ) : (
            <span className="text-[rgb(85,90,90)]/25 group-hover:text-[rgb(255,204,0)] text-[10px] font-light leading-none transition-all duration-200 select-none">+</span>
          )}
        </div>
      )}

      {/* Modal bleibt normal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white w-[90%] max-w-[400px] p-6 rounded-2xl shadow-xl border border-[rgb(85,90,90)]">
            <h2 className="text-xl font-bold text-[rgb(85,90,90)] text-center mb-4">
              Neue Maschine erstellen?
            </h2>
            <p className="text-center text-[rgb(85,90,90)] opacity-80 mb-6">
              Bist du sicher, dass du eine neue Maschine anlegen möchtest?
            </p>
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 rounded-xl border border-[rgb(85,90,90)] text-[rgb(85,90,90)] font-semibold hover:bg-[rgb(85,90,90)] hover:text-white transition hover:cursor-pointer"
              >
                Abbrechen
              </button>
              <button
                onClick={async () => {
                  setShowModal(false);
                  await handleCreateMachine();
                }}
                className="flex-1 py-2 rounded-xl font-semibold bg-[rgb(244,204,0)] text-black hover:brightness-110 transition hover:cursor-pointer"
              >
                Erstellen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Slot;