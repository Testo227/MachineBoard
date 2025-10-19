import React, { use } from 'react';
import { useState } from 'react';

//components
import Slot from './Slot';

//CSS
import '../styles/ppm2.css'


const PPM2_Pool = ({thisarea, areas, setAreas, machinelist, setmachinelist}) => {

   
    return ( 
        <div className="ppm2-pool">

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
 
export default PPM2_Pool;