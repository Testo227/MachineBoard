import React, { use } from 'react';
import { useState } from 'react';

//components
import Slot from '../Slot';

//CSS
import '../../styles/style.css'


const Endmontage_Nacharbeit = ({thisarea, 
    areas, 
    setAreas, 
    machinelist, 
    setmachinelist , 
    finishedMachines ,
    setFinishedMachines,
    globalTags,
    setGlobalTags,
    filteredMachines}) => {

   
    return ( 
        <div className="grid grid-cols-1 grid-rows-3 gap-4">

                {thisarea.slots.map(slot => (
                    <Slot 
                        key={slot.id} 
                        slotName={slot.slotName} 
                        machinelist={machinelist}
                        setmachinelist={setmachinelist}
                        areas={areas}
                        setAreas={setAreas}
                        thisarea={thisarea}
                        finishedMachines={finishedMachines}
                        setFinishedMachines={setFinishedMachines}
                        globalTags={globalTags}
                        setGlobalTags={setGlobalTags}
                        filteredMachines={filteredMachines}
                    />
                ))}

        </div>
     );
}
 
export default Endmontage_Nacharbeit;