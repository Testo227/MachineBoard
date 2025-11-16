import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import Card from './Card';

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

  const currentMachine = machinelist.find(
    (m) => m.position === slotName && m.area === thisarea.name
  );

  const isFilteredIn = filteredMachines?.some(
    (m) => m.id === currentMachine?.id
  );

  const handleCreateMachine = async () => {
    if (!currentMachine) {
      setLoading(true); // Spinner anzeigen

      // 1️⃣ Optimistisches Machine-Objekt erstellen
      const optimisticMachine = {
        id: `temp-${Date.now()}`, // temporäre ID
        position: slotName,
        area: thisarea.name,
        Typ: "",
        Typ_Bezeichnung: "",
        kNummer: "",
        fNummer: "",
        WLW: "",
        sequenzen: [],
        kommentare: [],
        maengel: [],
        dateien: []
      };
      setmachinelist([...machinelist, optimisticMachine]);
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

      try {
        // 2️⃣ Maschine in Supabase erstellen
        const { data: newMachine, error: machineError } = await supabase
          .from('machines')
          .insert({
            position: slotName,
            area: thisarea.name,
            Typ: "",
            Typ_Bezeichnung: "",
            kNummer: "",
            fNummer: "",
            WLW: ""
          })
          .select()
          .single();

        if (machineError) throw machineError;

        // 3️⃣ Relationen parallel erstellen
        const sequenzenArray = Array.from({ length: 13 }, (_, i) => ({
          sequenz: i + 1,
          bereich: [
            "PPM1","PPM2","PUMI","Dock","Prüffeld Pumpe","Prüffeld Mast",
            "Lackierung","Endmontage","PDI","Konservieren","Optimieren","BSA Linie","BSA Dock"
          ][i],
          planStart: null,
          planEnde: null,
          istStart: null,
          istEnde: null,
          status: "Offen",
          DLZPlan: null,
          DLZIst: null,
          machine_id: newMachine.id
        }));

        const kommentareArray = [{ text: "", machine_id: newMachine.id }];
        const maengelArray = [{ text: "", machine_id: newMachine.id }];
        const dateienArray = [{ name: "", url: "", machine_id: newMachine.id }];

        await Promise.all([
          supabase.from('sequenzen').insert(sequenzenArray),
          supabase.from('kommentare').insert(kommentareArray),
          supabase.from('maengel').insert(maengelArray),
          supabase.from('dateien').insert(dateienArray)
        ]);

        // 4️⃣ State aktualisieren mit echten DB-Daten
        const newMachineWithRelations = {
          ...newMachine,
          sequenzen: sequenzenArray,
          kommentare: kommentareArray,
          maengel: maengelArray,
          dateien: dateienArray
        };

        setmachinelist(prev => [
          ...prev.filter(m => m.id !== optimisticMachine.id),
          newMachineWithRelations
        ]);
      } catch (err) {
        console.error("Fehler beim Erstellen der Maschine:", err);
        // Falls Fehler, optimistische Maschine wieder entfernen
        setmachinelist(prev => prev.filter(m => m.id !== optimisticMachine.id));
        setAreas(prev =>
          prev.map(area =>
            area.id === thisarea.id
              ? {
                  ...area,
                  slots: area.slots.map(s =>
                    s.slotName === slotName ? { ...s, occupied: false } : s
                  )
                }
              : area
          )
        );
      } finally {
        setLoading(false); // Spinner verstecken
      }
    }
  };

  return (
  <div className="w-40 h-43 flex flex-col bg-[rgb(222,222,222)] flex-shrink-0 relative">
  <h3 className="text-center font-extrabold text-[9px] text-[rgb(85,90,90)]">
    {slotName}
  </h3>

  {currentMachine ? (
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
  ) : (
    <div
      onClick={handleCreateMachine}
      className="flex items-center justify-center my-[30px] mx-[60px] hover:cursor-pointer w-10 h-10 relative"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-t-transparent border-gray-700 rounded-full animate-spin"></div>
      ) : (
        <h1 className="text-[16px] font-bold">+</h1>
      )}
    </div>
  )}
</div>
);
};

export default Slot;