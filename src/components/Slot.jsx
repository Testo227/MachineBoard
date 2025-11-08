import React from 'react';
import { useState } from 'react';
 
//CSS
import '../styles/style.css'

//Components
import Card from './Card';

const Slot = ({slotName, 
    machinelist, 
    setmachinelist, 
    setSlotList, 
    slotList, 
    areas, 
    thisarea, 
    finishedMachines, 
    setFinishedMachines,
    globalTags,
    setGlobalTags,
    filteredMachines}) => {
    
    const currentMachine = machinelist.find(
        m => m.position === slotName && m.area === thisarea.name);

    const isFilteredIn = filteredMachines?.some(
    m => m.id === currentMachine?.id
  );

    const handleCreateMachine = () => {
        if(!currentMachine) {
            const newMachine = {
                id: machinelist.length + 1,
                position: slotName,
                area: thisarea.name,
                Typ: "",
                Typ_Bezeichnung:"",
                kNummer: "K123", 
                fNummer: "" ,
                WLW: "",
                Tags: [""],
                Mängel: [""],
                Kommentare: [""],
                Fertigstellung: "",
                Dateien: [""],
                sequenzen: [
                    { id: 1, sequenz: 1, bereich: "PPM1", planStart: "", planEnde: "", istStart: "", istEnde: "", status: "Offen", DLZPlan: "", DLZIst: "" },
                    { id: 2, sequenz: 2, bereich: "PPM2", planStart: "", planEnde: "", istStart: "", istEnde: "", status: "Offen", DLZPlan: "", DLZIst: "" },
                    { id: 3, sequenz: 3, bereich: "PUMI", planStart: "", planEnde: "", istStart: "", istEnde: "", status: "Offen", DLZPlan: "", DLZIst: "" },
                    { id: 4, sequenz: 4, bereich: "Dock", planStart: "", planEnde: "", istStart: "", istEnde: "", status: "Offen", DLZPlan: "", DLZIst: "" },
                    { id: 5, sequenz: 5, bereich: "Prüffeld Pumpe", planStart: "", planEnde: "", istStart: "", istEnde: "", status: "Offen", DLZPlan: "", DLZIst: ""},
                    { id: 6, sequenz: 6, bereich: "Prüffeld Mast", planStart: "", planEnde: "", istStart: "", istEnde: "", status: "Offen", DLZPlan: "", DLZIst: "" },
                    { id: 7, sequenz: 7, bereich: "Lackierung", planStart: "", planEnde: "", istStart: "", istEnde: "", status: "Offen", DLZPlan: "", DLZIst: "" },
                    { id: 8, sequenz: 8, bereich: "Endmontage", planStart: "", planEnde: "", istStart: "", istEnde: "", status: "Offen", DLZPlan: "", DLZIst: "" },
                    { id: 9, sequenz: 9, bereich: "PDI", planStart: "", planEnde: "", istStart: "", istEnde: "", status: "Offen", DLZPlan: "", DLZIst: "" },
                    { id: 10, sequenz: 10, bereich: "Konservieren", planStart: "", planEnde: "", istStart: "", istEnde: "", status: "Offen", DLZPlan: "", DLZIst: "" },
                    { id: 11, sequenz: 11, bereich: "Optimieren", planStart: "", planEnde: "", istStart: "", istEnde: "", status: "Offen", DLZPlan: "", DLZIst: "" },
                    { id: 12, sequenz: 12, bereich: "BSA Linie", planStart: "", planEnde: "", istStart: "", istEnde: "", status: "Offen", DLZPlan: "", DLZIst: "" },
                    { id: 13, sequenz: 13, bereich: "BSA Dock", planStart: "", planEnde: "", istStart: "", istEnde: "", status: "Offen", DLZPlan: "", DLZIst: "" }
                ]
            };
            setmachinelist([...machinelist, newMachine])
            setSlotList(slotList.map(s => s.slotName === slotName ? {...s, occupied: true} : s))
            //console.log(slotList)
        }
            }

    return ( 
        <div className='w-40 h-43 flex flex-col bg-[rgb(222,222,222)] flex-shrink-0' >
            <h3 className='text-center font-extrabold text-[9px] text-[rgb(85,90,90)]'>{slotName}</h3>
            {currentMachine ? (
                <Card 
                    machineid={currentMachine.id} 
                    currentMachine={currentMachine}
                    slotName={slotName} 
                    setSlotList={setSlotList}
                    slotList={slotList}
                    setmachinelist={setmachinelist}
                    machinelist={machinelist}
                    areas={areas}
                    finishedMachines={finishedMachines}
                    setFinishedMachines={setFinishedMachines}
                    globalTags={globalTags}
                    setGlobalTags={setGlobalTags}
                    dimmed={!isFilteredIn}
                    />

            ) : (
                <div onClick={handleCreateMachine} className='flex items-center justify-center my-[30px] mx-[60px] hover:cursor-pointer w-10 h-10 '>
                    <h1 className='text-[16px] font-bold'>+</h1>
                </div>
            )}
        </div>
        
     );
}
 
export default Slot;