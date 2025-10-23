import React from 'react';
import { useState } from 'react';
 
//CSS
import '../styles/style.css'

//Components
import Card from './Card';

const Slot = ({slotName, machinelist, setmachinelist, setSlotList, slotList, areas, thisarea}) => {
    
    const currentMachine = machinelist.find(
        m => m.position === slotName && m.area === thisarea.name);

    const handleCreateMachine = () => {
        if(!currentMachine) {
            const newMachine = {
                id: machinelist.length + 1,
                machine: `Machine ${machinelist.length + 1}`,
                position: slotName,
                area: thisarea.name,
                Typ: "waehlen"
            };
            setmachinelist([...machinelist, newMachine])
            setSlotList(slotList.map(s => s.slotName === slotName ? {...s, occupied: true} : s))
            //console.log(slotList)
        }
            }

    return ( 
        <div className='w-50 h-50' onClick={handleCreateMachine}>
            <h3 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{slotName}</h3>
            {currentMachine ? (
                <Card 
                    machineid={currentMachine.id} 
                    currentmachine={currentMachine}
                    slotName={slotName} 
                    setSlotList={setSlotList}
                    slotList={slotList}
                    setmachinelist={setmachinelist}
                    machinelist={machinelist}
                    areas={areas}/>

            ) : (
                <h1>+</h1>  
            )}
        </div>
        
     );
}
 
export default Slot;