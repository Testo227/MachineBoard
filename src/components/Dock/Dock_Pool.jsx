import React, { use } from 'react';
import { useState } from 'react';

//components
import Slot from '../Slot';

//CSS
import '../../styles/style.css'


const Dock_Pool = ({thisarea, areas, setAreas, machinelist, setmachinelist , finishedMachines ,setFinishedMachines}) => {

   
    return ( 
        <div className='grid grid-cols-3 grid-rows-3 gap-4'>

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
     );
}
 
export default Dock_Pool;