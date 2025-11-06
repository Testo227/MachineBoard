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
                machine: `Machine ${machinelist.length + 1}`,
                position: slotName,
                area: thisarea.name,
                Typ: "",
                Typ_Bezeichnung:"",
                WLW: "",
                Tags: [""],
                Start: "",
                Ende: "",
                Mängel: [""],
                Kommentare: [""],
                Fertigstellung: "",
                sequenzen: [
                    { id: 1, sequenz: 1, bereich: "Hauptmontage", planStart: "", planEnde: "", istStart: "", istEnde: "", status: "Offen", DLZPlan: "", DLZIst: "" },
                    { id: 2, sequenz: 2, bereich: "Prüffeld Pumpe", planStart: "", planEnde: "", istStart: "", istEnde: "", status: "Offen", DLZPlan: "", DLZIst: ""},
                    { id: 3, sequenz: 3, bereich: "Prüffeld Mast", planStart: "", planEnde: "", istStart: "", istEnde: "", status: "Offen", DLZPlan: "", DLZIst: "" },
                    { id: 4, sequenz: 4, bereich: "Lackierung", planStart: "", planEnde: "", istStart: "", istEnde: "", status: "Offen", DLZPlan: "", DLZIst: "" },
                    { id: 5, sequenz: 5, bereich: "Endmontage", planStart: "", planEnde: "", istStart: "", istEnde: "", status: "Offen", DLZPlan: "", DLZIst: "" },
                    { id: 6, sequenz: 6, bereich: "PDI", planStart: "", planEnde: "", istStart: "", istEnde: "", status: "Offen", DLZPlan: "", DLZIst: "" },
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