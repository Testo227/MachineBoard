import React, { use } from 'react';
import { useState } from 'react';

//components
import Slot from './Slot';

//CSS
import '../styles/pumi.css'


const PUMI_Pool = ({thisarea, areas, setAreas, machinelist, setmachinelist}) => {

   
    return ( 
        <div className="pumi-pool">

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
 
export default PUMI_Pool;