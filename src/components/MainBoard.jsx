import React from 'react';
import { useState } from 'react';

//components
import PPM1_Pool from './PPM1_Pool';
import PPM1_Line from './PPM1_Line';
import PPM1_NAorWait from './PPM1_NAorWait';

import PUMI_Pool from './PUMI_Pool';
import PUMI_Line from './PUMI_Line';
import PUMI_NAorWait from './PUMI_NAorWait';

import PPM2_Pool from './PPM2_Pool';
import PPM2_Line from './PPM2_Line';
import PPM2_NAorWait from './PPM2_NAorWait';

//CSS
import '../styles/ppm1.css'
import '../styles/mainboard.css'
import '../styles/pumi.css'



const MainBoard = () => {

     //dummy slot data
    const [areas, setAreas] = useState([
        {
            id: 1,
            name: "PPM1-Pool",
            slots: [
            { id: 1, slotName: "Pos 1", occupied: false },
            { id: 2, slotName: "Pos 2", occupied: true },
            { id: 3, slotName: "Pos 3", occupied: false },
            { id: 4, slotName: "Pos 4", occupied: true },
            { id: 5, slotName: "Pos 5", occupied: true },
            { id: 6, slotName: "Pos 6", occupied: false },
            { id: 7, slotName: "Pos 7", occupied: true },
            { id: 8, slotName: "Pos 8", occupied: false },
            { id: 9, slotName: "Pos 9", occupied: false }
            ]
        },
        {
            id: 2,
            name: "PPM1-Line",
            slots: [
            { id: 10, slotName: "Pos 1", occupied: false },
            { id: 11, slotName: "Pos 2", occupied: false },
            { id: 12, slotName: "Pos 3", occupied: false },
            { id: 13, slotName: "Pos 4", occupied: false },
            { id: 14, slotName: "Pos 5", occupied: false },
            { id: 15, slotName: "Pos 6", occupied: false },
            { id: 16, slotName: "Pos 7", occupied: false },
            { id: 17, slotName: "Pos 8", occupied: false }
            ]
        },
        {
            id: 3,
            name: "PPM1-NAorWait",
            slots: [
            { id: 18, slotName: "Pos 1", occupied: false },
            { id: 19, slotName: "Pos 2", occupied: false },
            { id: 20, slotName: "Pos 3", occupied: false }
            ]
        },
        {
            id: 4,
            name: "PUMI-Pool",
            slots: [
            { id: 21, slotName: "Pos 1", occupied: false },
            { id: 22, slotName: "Pos 2", occupied: false },
            { id: 23, slotName: "Pos 3", occupied: false },
            { id: 24, slotName: "Pos 4", occupied: false },
            { id: 25, slotName: "Pos 5", occupied: false },
            { id: 26, slotName: "Pos 6", occupied: false }
            ]
        },
        {
            id: 5,
            name: "PUMI-Line",
            slots: [
            { id: 27, slotName: "Pos 1", occupied: false },
            { id: 28, slotName: "Pos 2", occupied: false },
            { id: 29, slotName: "Pos 3", occupied: false },
            { id: 30, slotName: "Pos 4", occupied: false },
            { id: 31, slotName: "Pos 5", occupied: false },
            { id: 32, slotName: "Pos 6", occupied: false }
            ]
        },
        {
            id: 6,
            name: "PUMI-NAorWait",
            slots: [
            { id: 33, slotName: "Pos 1", occupied: false },
            { id: 34, slotName: "Pos 2", occupied: false },
            ]
        },
        {
            id: 7,
            name: "PPM2-Pool",
            slots: [
            { id: 35, slotName: "Pos 1", occupied: false },
            { id: 36, slotName: "Pos 2", occupied: false },
            { id: 37, slotName: "Pos 3", occupied: false },
            { id: 38, slotName: "Pos 4", occupied: false },
            { id: 39, slotName: "Pos 5", occupied: false },
            { id: 40, slotName: "Pos 6", occupied: false },
            { id: 41, slotName: "Pos 7", occupied: false },
            { id: 42, slotName: "Pos 8", occupied: false },
            { id: 43, slotName: "Pos 9", occupied: false }
            ]
        },
        {
            id: 8,
            name: "PPM2-Line",
            slots: [
            { id: 44, slotName: "Pos 1", occupied: false },
            { id: 45, slotName: "Pos 2", occupied: false },
            { id: 46, slotName: "Pos 3", occupied: false },
            { id: 47, slotName: "Pos 4", occupied: false },
            { id: 48, slotName: "Pos 5", occupied: false },
            { id: 49, slotName: "Pos 6", occupied: false },
            { id: 50, slotName: "Pos 7", occupied: false }
            ]
        },
        {
            id: 9,
            name: "PPM2-NAorWait",
            slots: [
            { id: 51, slotName: "Pos 1", occupied: false },
            { id: 52, slotName: "Pos 2", occupied: false },
            { id: 53, slotName: "Pos 3", occupied: false }
            ]
        }
]);

    
    //dummy data
    const [machinelist, setmachinelist] = useState([
        {id:1, machine:"Machine 1", position:"Pos 2", kunde: "Firma A", kNummer: "K123", date: "2023-10-01", area: "PPM1-Pool"},
        {id:2, machine:"Machine 2", position:"Pos 4", kunde: "Firma B", kNummer: "K456", date: "2023-11-15", area: "PPM1-Pool"},
        {id:3, machine:"Machine 3", position:"Pos 5" ,kunde: "Firma C", kNummer: "K789", date: "2023-12-20", area: "PPM1-Pool"},
        {id:4, machine:"Machine 4", position:"Pos 7", kunde: "Firma D", kNummer: "K012", date: "2024-01-10", area: "PPM1-Pool"},])



    return ( 
        <div className='MainBoard'>

    
            <div className='PPM1'> 
                <div>
                <div className='headingppm1pool'>PPM1 Pool
                </div>
                <PPM1_Pool
                    machinelist={machinelist} 
                    setmachinelist={setmachinelist}
                    areas={areas}
                    thisarea={areas[0]}
                    setAreas={setAreas}> 
                </PPM1_Pool>
                </div>
                <div>
                <div className='headingppm1pool'>PPM1 Line
                </div>
                <PPM1_Line 
                    machinelist={machinelist} 
                    setmachinelist={setmachinelist}
                    areas={areas}
                    thisarea={areas[1]}
                    setAreas={setAreas}
                />
                </div>
                <PPM1_NAorWait 
                    machinelist={machinelist} 
                    setmachinelist={setmachinelist}
                    areas={areas}
                    thisarea={areas[2]}
                    setAreas={setAreas}
                />
            </div>
            <div className='PPM2'>
                <PPM2_Pool
                    machinelist={machinelist} 
                    setmachinelist={setmachinelist}
                    areas={areas}
                    thisarea={areas[6]}
                    setAreas={setAreas} 
                >
                </PPM2_Pool>

                <PPM2_Line
                    machinelist={machinelist} 
                    setmachinelist={setmachinelist}
                    areas={areas}
                    thisarea={areas[7]}
                    setAreas={setAreas}
                >
                </PPM2_Line>

                <PPM2_NAorWait
                    machinelist={machinelist} 
                    setmachinelist={setmachinelist}
                    areas={areas}
                    thisarea={areas[8]}
                    setAreas={setAreas}
                >
                </PPM2_NAorWait>

            </div>
            <div className='PUMI'>
                <PUMI_Pool
                    machinelist={machinelist} 
                    setmachinelist={setmachinelist}
                    areas={areas}
                    thisarea={areas[3]}
                    setAreas={setAreas} 
                >
                </PUMI_Pool>
                
                <PUMI_Line
                    machinelist={machinelist} 
                    setmachinelist={setmachinelist}
                    areas={areas}
                    thisarea={areas[4]}
                    setAreas={setAreas}
                >
                </PUMI_Line>

                <PUMI_NAorWait
                    machinelist={machinelist} 
                    setmachinelist={setmachinelist}
                    areas={areas}
                    thisarea={areas[5]}
                    setAreas={setAreas}
                >
                </PUMI_NAorWait>
            </div>
        </div>
        
     )
}
 
export default MainBoard;