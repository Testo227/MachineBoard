import React, { use } from 'react';
import { useState } from 'react';

//components
import Slot from '../Slot';
import DummySlot from '../DummySlot';

//CSS
import '../../styles/style.css'


const PUMI_Line = ({thisarea, areas, setAreas, machinelist, setmachinelist}) => {

   
    return ( 
        <div className="grid grid-cols-4 grid-rows-2 gap-4">

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
                    <DummySlot></DummySlot>
                    <DummySlot></DummySlot>


        </div>
     );
}
 
export default PUMI_Line;