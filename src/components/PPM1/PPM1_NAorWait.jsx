import React, { use } from 'react';
import { useState } from 'react';

//components
import Slot from '../Slot';

//CSS
import '../../styles/style.css'


const PPM1_NAorWait = ({thisarea, areas, setAreas, machinelist, setmachinelist , finishedMachines ,setFinishedMachines}) => {

   
    return ( 
        <div className="flex-shrink-0">
        <div className="flex flex-col gap-4 w-max h-max">

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
                    />
                ))}

        </div>
        </div>
     );
}
 
export default PPM1_NAorWait;