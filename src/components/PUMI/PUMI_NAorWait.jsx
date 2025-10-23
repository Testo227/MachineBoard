import React, { use } from 'react';
import { useState } from 'react';

//components
import Slot from '../Slot';

//CSS



const PUMI_NAorWait = ({thisarea, areas, setAreas, machinelist, setmachinelist}) => {

   
    return ( 
        <div className="PUMI-end">

                {thisarea.slots.map(slot => (
                    <Slot 
                        key={slot.id} 
                        slotName={slot.slotName} 
                        machinelist={machinelist}
                        setmachinelist={setmachinelist}
                        areas={areas}
                        setAreas={setAreas}
                        thisarea={thisarea}
                    />
                ))}

        </div>
     );
}
 
export default PUMI_NAorWait;