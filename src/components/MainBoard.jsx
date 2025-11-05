import React from 'react';
import { useState } from 'react';

//components

import PPM1_Pool from './PPM1/PPM1_Pool';
import PPM1_Line from './PPM1/PPM1_Line';
import PPM1_NAorWait from './PPM1/PPM1_NAorWait';

import PUMI_Pool from './PUMI/PUMI_Pool';
import PUMI_Line from './PUMI/PUMI_Line';
import PUMI_NAorWait from './PUMI/PUMI_NAorWait';

import PPM2_Pool from './PPM2/PPM2_Pool';
import PPM2_Line from './PPM2/PPM2_Line';
import PPM2_NAorWait from './PPM2/PPM2_NAorWait';

import Dock_Pool from './Dock/Dock_Pool';
import Dock_Places from './Dock/Dock_Places';

import BSA_Pool from './BSA/BSA_Pool';
import BSA_Line from './BSA/BSA_Line';
import BSA_Dock from './BSA/BSA_Dock';

import Pumpe_Arbeit from './P_Pumpe/Pumpe_Arbeit';
import Pumpe_Puffer from './P_Pumpe/Pumpe_Puffer';
import Pumpe_Nacharbeit from './P_Pumpe/Pumpe_Nacharbeit';

import Mast_Arbeit from './P_Mast/Mast_Arbeit';
import Mast_Puffer from './P_Mast/Mast_Puffer';
import Mast_Nacharbeit from './P_Mast/Mast_Nacharbeit';

import Lackierung_Arbeit from './Lackierung/Lackierung_Arbeit';
import Lackierung_Puffer from './Lackierung/Lackierung_Puffer';
import Lackierung_Nacharbeit from './Lackierung/Lackierung_Nacharbeit';

import Endmontage_Arbeit from './Endmontage/Endmontage_Arbeit';
import Endmontage_Puffer from './Endmontage/Endmontage_Puffer';
import Endmontage_Nacharbeit from './Endmontage/Endmontage_Puffer';

import PDI_Arbeit from './PDI/PDI_Arbeit';
import PDI_Puffer from './PDI/PDI_Puffer';
import PDI_Nacharbeit from './PDI/PDI_Nacharbeit';

import Konservieren_Arbeit from './Konservieren/Konservieren_Arbeit';
import Konservieren_Puffer from './Konservieren/Konservieren_Puffer';
import Konservieren_Nacharbeit from './Konservieren/Konservieren_Nacharbeit';

//CSS
import '../styles/style.css'




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
        },
        {
            id: 10,
            name: "Dock-Pool",
            slots: [
            { id: 54, slotName: "Pos 1", occupied: false },
            { id: 55, slotName: "Pos 2", occupied: false },
            { id: 56, slotName: "Pos 3", occupied: false },
            { id: 57, slotName: "Pos 4", occupied: false },
            { id: 58, slotName: "Pos 5", occupied: false },
            { id: 59, slotName: "Pos 6", occupied: false },
            { id: 60, slotName: "Pos 7", occupied: false },
            { id: 61, slotName: "Pos 8", occupied: false },
            { id: 62, slotName: "Pos 9", occupied: false }
            ]
        }
        ,
        {
            id: 11,
            name: "Dock-Plätze",
            slots: [
            { id: 63, slotName: "Pos 1", occupied: false },
            { id: 64, slotName: "Pos 2", occupied: false },
            { id: 65, slotName: "Pos 3", occupied: false },
            { id: 66, slotName: "Pos 4", occupied: false },
            { id: 67, slotName: "Pos 5", occupied: false },
            { id: 68, slotName: "Pos 6", occupied: false },
            { id: 69, slotName: "Pos 7", occupied: false },
            { id: 70, slotName: "Pos 8", occupied: false },
            { id: 71, slotName: "Pos 9", occupied: false },
            { id: 72, slotName: "Pos 10", occupied: false }
            ]
        },
        {
            id: 12,
            name: "BSA-Pool",
            slots: [
            { id: 73, slotName: "Pos 1", occupied: false },
            { id: 74, slotName: "Pos 2", occupied: false },
            { id: 75, slotName: "Pos 3", occupied: false },
            { id: 76, slotName: "Pos 4", occupied: false },
            { id: 77, slotName: "Pos 5", occupied: false },
            { id: 78, slotName: "Pos 6", occupied: false },
            { id: 79, slotName: "Pos 7", occupied: false },
            { id: 80, slotName: "Pos 8", occupied: false },
            { id: 81, slotName: "Pos 9", occupied: false }
            ]
        },
        {
            id: 13,
            name: "BSA-Linie",
            slots: [
            { id: 82, slotName: "Pos 1", occupied: false },
            { id: 83, slotName: "Pos 2", occupied: false },
            { id: 84, slotName: "Pos 3", occupied: false },
            { id: 85, slotName: "Pos 4", occupied: false },
            { id: 86, slotName: "Pos 5", occupied: false },
            { id: 87, slotName: "Pos 6", occupied: false }
            ]
        },
        {
            id: 14,
            name: "BSA-Dock",
            slots: [
            { id: 88, slotName: "Pos 1", occupied: false },
            { id: 89, slotName: "Pos 2", occupied: false },
            { id: 90, slotName: "Pos 3", occupied: false },
            { id: 91, slotName: "Pos 4", occupied: false },
            { id: 92, slotName: "Pos 5", occupied: false },
            { id: 93, slotName: "Pos 6", occupied: false }
            ],
        },
        {
            id: 15,
            name: "Pumpe-inArbeit",
            slots: [
            { id: 94, slotName: "Pos 1", occupied: false },
            { id: 95, slotName: "Pos 2", occupied: false },
            { id: 96, slotName: "Pos 3", occupied: false },
            { id: 97, slotName: "Pos 4", occupied: false },
            { id: 98, slotName: "Pos 5", occupied: false },
            { id: 999, slotName: "Pos 6", occupied: false },
            { id: 998, slotName: "Pos 7", occupied: false },
            { id: 997, slotName: "Pos 8", occupied: false },
            { id: 996, slotName: "Pos 9", occupied: false },
            { id: 995, slotName: "Pos 10", occupied: false },
            { id: 994, slotName: "Pos 11", occupied: false },
            { id: 99, slotName: "Pos 12", occupied: false }
            ]
        },
        {
            id: 16,
            name: "Pumpe-Puffer",
            slots: [
            { id: 100, slotName: "Pos 1", occupied: false },
            { id: 101, slotName: "Pos 2", occupied: false },
            { id: 102, slotName: "Pos 3", occupied: false },
            { id: 103, slotName: "Pos 4", occupied: false },
            { id: 104, slotName: "Pos 5", occupied: false },
            { id: 105, slotName: "Pos 6", occupied: false },
            { id: 106, slotName: "Pos 7", occupied: false },
            { id: 107, slotName: "Pos 8", occupied: false },
            { id: 108, slotName: "Pos 9", occupied: false },
            { id: 109, slotName: "Pos 10", occupied: false }
            ]
        },
        {
            id: 17,
            name: "Pumpe-Nacharbeit",
            slots: [
            { id: 110, slotName: "Pos 1", occupied: false },
            { id: 111, slotName: "Pos 2", occupied: false },
            { id: 112, slotName: "Pos 3", occupied: false },
            { id: 113, slotName: "Pos 4", occupied: false },
            { id: 114, slotName: "Pos 5", occupied: false },
            { id: 115, slotName: "Pos 6", occupied: false },
            ]
        },
        {
            id: 18,
            name: "Mast-inArbeit",
            slots: [
            { id: 116, slotName: "Pos 1", occupied: false },
            { id: 117, slotName: "Pos 2", occupied: false },
            { id: 118, slotName: "Pos 3", occupied: false },
            { id: 119, slotName: "Pos 4", occupied: false },
            { id: 120, slotName: "Pos 5", occupied: false },
            { id: 121, slotName: "Pos 6", occupied: false },
            ]
        },
        {
            id: 19,
            name: "Mast-Puffer",
            slots: [
            { id: 122, slotName: "Pos 1", occupied: false },
            { id: 123, slotName: "Pos 2", occupied: false },
            { id: 124, slotName: "Pos 3", occupied: false },
            { id: 125, slotName: "Pos 4", occupied: false },
            { id: 126, slotName: "Pos 5", occupied: false }
            ]
        },
        {
            id: 20,
            name: "Mast-Nacharbeit",
            slots: [
            { id: 122, slotName: "Pos 1", occupied: false },
            { id: 123, slotName: "Pos 2", occupied: false },
            { id: 124, slotName: "Pos 3", occupied: false }
            ]
        },
        {
            id: 21,
            name: "Lack-inArbeit",
            slots: [
            { id: 125, slotName: "Pos 1", occupied: false },
            { id: 126, slotName: "Pos 2", occupied: false },
            { id: 127, slotName: "Pos 3", occupied: false },
            { id: 128, slotName: "Pos 4", occupied: false },
            { id: 129, slotName: "Pos 5", occupied: false },
            { id: 130, slotName: "Pos 6", occupied: false },
            ]
        },
        {
            id: 22,
            name: "Lack-Puffer",
            slots: [
            { id: 131, slotName: "Pos 1", occupied: false },
            { id: 132, slotName: "Pos 2", occupied: false },
            { id: 133, slotName: "Pos 3", occupied: false },
            { id: 134, slotName: "Pos 4", occupied: false },
            { id: 135, slotName: "Pos 5", occupied: false }
            ]
        },
        {
            id: 23,
            name: "Lack-Nacharbeit",
            slots: [
            { id: 136, slotName: "Pos 1", occupied: false },
            { id: 137, slotName: "Pos 2", occupied: false },
            { id: 138, slotName: "Pos 3", occupied: false }
            ]
        },
        {
            id: 24,
            name: "Endm.-inArbeit",
            slots: [
            { id: 139, slotName: "Pos 1", occupied: false },
            { id: 140, slotName: "Pos 2", occupied: false },
            { id: 141, slotName: "Pos 3", occupied: false },
            { id: 142, slotName: "Pos 4", occupied: false },
            { id: 143, slotName: "Pos 5", occupied: false },
            { id: 144, slotName: "Pos 6", occupied: false },
            ]
        },
        {
            id: 25,
            name: "Endm.-Puffer",
            slots: [
            { id: 145, slotName: "Pos 1", occupied: false },
            { id: 146, slotName: "Pos 2", occupied: false },
            { id: 147, slotName: "Pos 3", occupied: false },
            { id: 148, slotName: "Pos 4", occupied: false },
            { id: 149, slotName: "Pos 5", occupied: false }
            ]
        },
        {
            id: 26,
            name: "Endm.-Nacharbeit",
            slots: [
            { id: 150, slotName: "Pos 1", occupied: false },
            { id: 151, slotName: "Pos 2", occupied: false },
            { id: 152, slotName: "Pos 3", occupied: false }
            ]
        },
        {
            id: 27,
            name: "PDI-inArbeit",
            slots: [
            { id: 153, slotName: "Pos 1", occupied: false },
            { id: 154, slotName: "Pos 2", occupied: false },
            { id: 155, slotName: "Pos 3", occupied: false },
            { id: 156, slotName: "Pos 4", occupied: false },
            { id: 157, slotName: "Pos 5", occupied: false },
            { id: 158, slotName: "Pos 6", occupied: false },
            ]
        },
        {
            id: 28,
            name: "PDI-Puffer",
            slots: [
            { id: 159, slotName: "Pos 1", occupied: false },
            { id: 160, slotName: "Pos 2", occupied: false },
            { id: 161, slotName: "Pos 3", occupied: false },
            { id: 162, slotName: "Pos 4", occupied: false },
            { id: 163, slotName: "Pos 5", occupied: false }
            ]
        },
        {
            id: 29,
            name: "PDI-Nacharbeit",
            slots: [
            { id: 164, slotName: "Pos 1", occupied: false },
            { id: 165, slotName: "Pos 2", occupied: false },
            { id: 166, slotName: "Pos 3", occupied: false }
            ]
        },
        {
            id: 30,
            name: "Kons.-inArbeit",
            slots: [
            { id: 167, slotName: "Pos 1", occupied: false },
            { id: 168, slotName: "Pos 2", occupied: false },
            { id: 169, slotName: "Pos 3", occupied: false },
            { id: 170, slotName: "Pos 4", occupied: false },
            { id: 171, slotName: "Pos 5", occupied: false },
            { id: 172, slotName: "Pos 6", occupied: false },
            ]
        },
        {
            id: 31,
            name: "Kons.-Puffer",
            slots: [
            { id: 173, slotName: "Pos 1", occupied: false },
            { id: 174, slotName: "Pos 2", occupied: false },
            { id: 175, slotName: "Pos 3", occupied: false },
            { id: 176, slotName: "Pos 4", occupied: false },
            { id: 177, slotName: "Pos 5", occupied: false }
            ]
        },
        {
            id: 32,
            name: "Kons.-Nacharbeit",
            slots: [
            { id: 178, slotName: "Pos 1", occupied: false },
            { id: 179, slotName: "Pos 2", occupied: false },
            { id: 180, slotName: "Pos 3", occupied: false }
            ]
        }
    ]);

    const [finishedMachines, setFinishedMachines] = useState([])
    
    //dummy machine data
    const [machinelist, setmachinelist] = useState([
        {id:1, 
            machine:"Machine 1", 
            position:"Pos 2", 
            kunde: "Firma A", 
            kNummer: "K123", 
            Start: "2023-10-01", 
            Ende: "2023-10-01", 
            area: "PPM1-Pool", 
            Typ:"BSF",
            area:"PUMI-Pool" ,
            Typ_Bezeichnung:"", 
            WLW:24, 
            Tags:[{name:"Prototyp", color: "red"}], 
            Mängel: [""],
            Kommentare: [""],
            sequenzen: [
                {
                    id: 1,
                    sequenz:1,
                    bereich: "Hauptmontage",
                    planStart: "",
                    planEnde: "",
                    istStart: "",
                    istEnde: "",
                    status: "Offen"
                }
            ],
            Fertigstellung: ""
        }])



    return ( 
        <div className='MainBoard flex gap-4  w-full h-full overflow-x-scroll overflow-y-auto'>
            <div className='flex flex-col gap-4'>
        
                <div className='flex gap-4'> 
                    <div className='flex flex-col'>
                        <div className='mb-4 bg-[rgb(255,204,0)]'>
                            <h2 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{areas[0].name}</h2>
                        </div>
                            <PPM1_Pool
                                machinelist={machinelist} 
                                setmachinelist={setmachinelist}
                                areas={areas}
                                thisarea={areas[0]}
                                setAreas={setAreas}
                                finishedMachines={finishedMachines}
                                setFinishedMachines={setFinishedMachines}> 
                            </PPM1_Pool>
                    </div>
                    <div className='flex flex-col'>
                        <div className='mb-4 bg-[rgb(255,204,0)]'>
                            <h2 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{areas[1].name}</h2>
                        </div>
                            <PPM1_Line 
                                machinelist={machinelist} 
                                setmachinelist={setmachinelist}
                                areas={areas}
                                thisarea={areas[1]}
                                setAreas={setAreas}
                                finishedMachines={finishedMachines}
                                setFinishedMachines={setFinishedMachines}
                            ></PPM1_Line>
                    </div>
                    <div className='flex flex-col'>
                        <div className='mb-4 bg-[rgb(255,204,0)]'>
                            <h2 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{areas[2].name}</h2>
                        </div>
                            <PPM1_NAorWait 
                                machinelist={machinelist} 
                                setmachinelist={setmachinelist}
                                areas={areas}
                                thisarea={areas[2]}
                                setAreas={setAreas}
                                finishedMachines={finishedMachines}
                                setFinishedMachines={setFinishedMachines}
                            ></PPM1_NAorWait>
                    </div>
                </div>
                <div className='flex gap-4'>
                    <div className='flex flex-col'>
                        <div className='mb-4 bg-[rgb(255,204,0)]'>
                            <h2 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{areas[6].name}</h2>
                        </div>
                        
                            <PPM2_Pool
                                machinelist={machinelist} 
                                setmachinelist={setmachinelist}
                                areas={areas}
                                thisarea={areas[6]}
                                setAreas={setAreas}
                                finishedMachines={finishedMachines}
                                setFinishedMachines={setFinishedMachines}
                            >
                            </PPM2_Pool>
                    </div>
                    <div className='flex flex-col'>
                        <div className='mb-4 bg-[rgb(255,204,0)]'>
                            <h2 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{areas[7].name}</h2>
                        </div>
                            <PPM2_Line
                                machinelist={machinelist} 
                                setmachinelist={setmachinelist}
                                areas={areas}
                                thisarea={areas[7]}
                                setAreas={setAreas}
                                finishedMachines={finishedMachines}
                                setFinishedMachines={setFinishedMachines}
                            >
                            </PPM2_Line>
                    </div>
                    <div className='flex flex-col'>
                        <div className='mb-4 bg-[rgb(255,204,0)]'>
                            <h2 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{areas[8].name}</h2>
                        </div>
                            <PPM2_NAorWait
                                machinelist={machinelist} 
                                setmachinelist={setmachinelist}
                                areas={areas}
                                thisarea={areas[8]}
                                setAreas={setAreas}
                                finishedMachines={finishedMachines}
                                setFinishedMachines={setFinishedMachines}
                            >
                            </PPM2_NAorWait>
                    </div>
                </div>
                <div className='flex gap-4'>
                    <div className='flex flex-col'>
                        <div className='mb-4 bg-[rgb(255,204,0)]'>
                            <h2 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{areas[3].name}</h2>
                        </div>
                            <PUMI_Pool
                                machinelist={machinelist} 
                                setmachinelist={setmachinelist}
                                areas={areas}
                                thisarea={areas[3]}
                                setAreas={setAreas}
                                finishedMachines={finishedMachines}
                                setFinishedMachines={setFinishedMachines}
                            >
                            </PUMI_Pool>
                    </div>
                    <div className='flex flex-col'>
                        <div className='mb-4 bg-[rgb(255,204,0)]'>
                            <h2 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{areas[4].name}</h2>
                        </div>
                            <PUMI_Line
                                machinelist={machinelist} 
                                setmachinelist={setmachinelist}
                                areas={areas}
                                thisarea={areas[4]}
                                setAreas={setAreas}
                                finishedMachines={finishedMachines}
                                setFinishedMachines={setFinishedMachines}
                            >
                            </PUMI_Line>
                    </div>
                    <div className='flex flex-col'>
                        <div className='mb-4 bg-[rgb(255,204,0)]'>
                            <h2 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{areas[5].name}</h2>
                        </div>
                            <PUMI_NAorWait
                                machinelist={machinelist} 
                                setmachinelist={setmachinelist}
                                areas={areas}
                                thisarea={areas[5]}
                                setAreas={setAreas}
                                finishedMachines={finishedMachines}
                                setFinishedMachines={setFinishedMachines}
                            >
                            </PUMI_NAorWait>
                    </div>
                </div>
                <div className='flex gap-4'>
                    <div className='flex flex-col'>
                        <div className='mb-4 bg-[rgb(255,204,0)]'>
                            <h2 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{areas[9].name}</h2>
                        </div>
                    
                        <Dock_Pool
                                machinelist={machinelist} 
                                setmachinelist={setmachinelist}
                                areas={areas}
                                thisarea={areas[9]}
                                setAreas={setAreas}
                                finishedMachines={finishedMachines}
                                setFinishedMachines={setFinishedMachines}
                                >
                        </Dock_Pool>
                    </div>
                    <div className='flex flex-col'>
                        <div className='mb-4 bg-[rgb(255,204,0)]'>
                            <h2 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{areas[10].name}</h2>
                        </div>

                        <Dock_Places
                                machinelist={machinelist} 
                                setmachinelist={setmachinelist}
                                areas={areas}
                                thisarea={areas[10]}
                                setAreas={setAreas}
                                finishedMachines={finishedMachines}
                                setFinishedMachines={setFinishedMachines}>

                        </Dock_Places>
                    </div>
                </div>
                <div className='flex gap-4'>
                    <div className='flex flex-col'>
                        <div className='mb-4 bg-[rgb(255,204,0)]'>
                            <h2 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{areas[11].name}</h2>
                        </div>
                        <BSA_Pool 
                                machinelist={machinelist} 
                                setmachinelist={setmachinelist}
                                areas={areas}
                                thisarea={areas[11]}
                                setAreas={setAreas}
                                finishedMachines={finishedMachines}
                                setFinishedMachines={setFinishedMachines}>

                        </BSA_Pool>
                    </div>
                    <div className='flex flex-col'>
                        <div className='mb-4 bg-[rgb(255,204,0)]'>
                            <h2 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{areas[12].name}</h2>
                        </div>
                        <BSA_Line 
                                machinelist={machinelist} 
                                setmachinelist={setmachinelist}
                                areas={areas}
                                thisarea={areas[12]}
                                setAreas={setAreas}
                                finishedMachines={finishedMachines}
                                setFinishedMachines={setFinishedMachines}>
                        </BSA_Line>
                    </div>
                    <div className='flex flex-col'>
                        <div className='mb-4 bg-[rgb(255,204,0)]'>
                            <h2 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{areas[13].name}</h2>
                        </div>
                        <BSA_Dock
                                machinelist={machinelist} 
                                setmachinelist={setmachinelist}
                                areas={areas}
                                thisarea={areas[13]}
                                setAreas={setAreas}
                                finishedMachines={finishedMachines}
                                setFinishedMachines={setFinishedMachines}>

                        </BSA_Dock>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-4'>
                <div className='text-xl font-extrabold text-[rgb(85,90,90)] bg-[rgb(166,202,236)] w-8 h-[770px] flex items-center justify-center [writing-mode:vertical-rl] rotate-180 text-center'>↓ in Arbeit ↓</div>
                <div className='text-xl font-extrabold text-[rgb(85,90,90)] bg-[rgb(242,207,238)] w-8 h-[630px] flex items-center justify-center [writing-mode:vertical-rl] rotate-180 text-center'>↓ Puffer ↓</div>
                <div className='text-xl font-extrabold text-[rgb(85,90,90)] bg-[rgb(246,198,173)] w-8 h-[358px] flex items-center justify-center [writing-mode:vertical-rl] rotate-180 text-center'>↓ Nacharbeit ↓</div>
            </div>
            <div className='flex gap-4'>
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col'>
                        <div className='mb-4 bg-[rgb(255,204,0)]'>
                            <h2 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{areas[14].name}</h2>
                        </div>
                        <Pumpe_Arbeit 
                                machinelist={machinelist} 
                                setmachinelist={setmachinelist}
                                areas={areas}
                                thisarea={areas[14]}
                                setAreas={setAreas}
                                finishedMachines={finishedMachines}
                                setFinishedMachines={setFinishedMachines}>
                            
                        </Pumpe_Arbeit>
                    </div>
                    <div className='flex flex-col mt-9'>
                        <div className='mb-4 bg-[rgb(255,204,0)]'>
                            <h2 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{areas[15].name}</h2>
                        </div>
                        <Pumpe_Puffer
                                machinelist={machinelist} 
                                setmachinelist={setmachinelist}
                                areas={areas}
                                thisarea={areas[15]}
                                setAreas={setAreas}
                                finishedMachines={finishedMachines}
                                setFinishedMachines={setFinishedMachines}>
                        </Pumpe_Puffer>

                    </div>
                    <div className='flex flex-col mt-9'>
                        <div className='mb-4 bg-[rgb(255,204,0)]'>
                            <h2 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{areas[16].name}</h2>
                        </div>
                        <Pumpe_Nacharbeit 
                                machinelist={machinelist} 
                                setmachinelist={setmachinelist}
                                areas={areas}
                                thisarea={areas[16]}
                                setAreas={setAreas}
                                finishedMachines={finishedMachines}
                                setFinishedMachines={setFinishedMachines}>
                        </Pumpe_Nacharbeit>
                    </div>
                </div>
                
            </div>
            <div className='flex gap-4'>
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col'>
                        <div className='mb-4 bg-[rgb(255,204,0)]'>
                            <h2 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{areas[17].name}</h2>
                        </div>
                        <Mast_Arbeit 
                                machinelist={machinelist} 
                                setmachinelist={setmachinelist}
                                areas={areas}
                                thisarea={areas[17]}
                                setAreas={setAreas}
                                finishedMachines={finishedMachines}
                                setFinishedMachines={setFinishedMachines}>
                        </Mast_Arbeit>
                    </div>
                    <div className='flex flex-col mt-9'>
                        <div className='mb-4 bg-[rgb(255,204,0)]'>
                            <h2 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{areas[18].name}</h2>
                        </div>
                        <Mast_Puffer 
                                machinelist={machinelist} 
                                setmachinelist={setmachinelist}
                                areas={areas}
                                thisarea={areas[18]}
                                setAreas={setAreas}
                                finishedMachines={finishedMachines}
                                setFinishedMachines={setFinishedMachines}>
                        </Mast_Puffer>
                    </div>
                    <div className='flex flex-col mt-9'>
                        <div className='mb-4 bg-[rgb(255,204,0)]'>
                            <h2 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{areas[19].name}</h2>
                        </div>
                        <Mast_Nacharbeit 
                                machinelist={machinelist} 
                                setmachinelist={setmachinelist}
                                areas={areas}
                                thisarea={areas[19]}
                                setAreas={setAreas}
                                finishedMachines={finishedMachines}
                                setFinishedMachines={setFinishedMachines}>
                        </Mast_Nacharbeit>
                    </div>
                </div>
            </div>
            <div className='flex gap-4'>
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col'>
                        <div className='mb-4 bg-[rgb(255,204,0)]'>
                            <h2 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{areas[20].name}</h2>
                        </div>
                        <Lackierung_Arbeit 
                                machinelist={machinelist} 
                                setmachinelist={setmachinelist}
                                areas={areas}
                                thisarea={areas[20]}
                                setAreas={setAreas}
                                finishedMachines={finishedMachines}
                                setFinishedMachines={setFinishedMachines}>

                        </Lackierung_Arbeit>
                    </div>
                    <div className='flex flex-col mt-9'>
                        <div className='mb-4 bg-[rgb(255,204,0)]'>
                            <h2 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{areas[21].name}</h2>
                        </div>
                        <Lackierung_Puffer 
                                machinelist={machinelist} 
                                setmachinelist={setmachinelist}
                                areas={areas}
                                thisarea={areas[21]}
                                setAreas={setAreas}
                                finishedMachines={finishedMachines}
                                setFinishedMachines={setFinishedMachines}>

                        </Lackierung_Puffer>
                    </div>
                    <div className='flex flex-col mt-9'>
                        <div className='mb-4 bg-[rgb(255,204,0)]'>
                            <h2 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{areas[22].name}</h2>
                        </div>
                        <Lackierung_Nacharbeit 
                                machinelist={machinelist} 
                                setmachinelist={setmachinelist}
                                areas={areas}
                                thisarea={areas[22]}
                                setAreas={setAreas}
                                finishedMachines={finishedMachines}
                                setFinishedMachines={setFinishedMachines}>
                        </Lackierung_Nacharbeit>
                    </div>
                </div>
            </div>
            <div className='flex gap-4'>
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col'>
                        <div className='mb-4 bg-[rgb(255,204,0)]'>
                            <h2 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{areas[23].name}</h2>
                        </div>
                        <Endmontage_Arbeit 
                                machinelist={machinelist} 
                                setmachinelist={setmachinelist}
                                areas={areas}
                                thisarea={areas[23]}
                                setAreas={setAreas}
                                finishedMachines={finishedMachines}
                                setFinishedMachines={setFinishedMachines}>
                        </Endmontage_Arbeit>
                    </div>
                    <div className='flex flex-col mt-9'>
                        <div className='mb-4 bg-[rgb(255,204,0)]'>
                            <h2 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{areas[24].name}</h2>
                        </div>
                        <Endmontage_Puffer 
                                machinelist={machinelist} 
                                setmachinelist={setmachinelist}
                                areas={areas}
                                thisarea={areas[24]}
                                setAreas={setAreas}
                                finishedMachines={finishedMachines}
                                setFinishedMachines={setFinishedMachines}>
                        </Endmontage_Puffer>
                    </div>
                    <div className='flex flex-col mt-9'>
                        <div className='mb-4 bg-[rgb(255,204,0)]'>
                            <h2 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{areas[25].name}</h2>
                        </div>
                        <Endmontage_Nacharbeit 
                                machinelist={machinelist} 
                                setmachinelist={setmachinelist}
                                areas={areas}
                                thisarea={areas[25]}
                                setAreas={setAreas}
                                finishedMachines={finishedMachines}
                                setFinishedMachines={setFinishedMachines}>
                        </Endmontage_Nacharbeit>
                    </div>
                </div>
            </div>
            <div className='flex gap-4'>
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col'>
                        <div className='mb-4 bg-[rgb(255,204,0)]'>
                            <h2 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{areas[26].name}</h2>
                        </div>
                        <PDI_Arbeit 
                                machinelist={machinelist} 
                                setmachinelist={setmachinelist}
                                areas={areas}
                                thisarea={areas[26]}
                                setAreas={setAreas}
                                finishedMachines={finishedMachines}
                                setFinishedMachines={setFinishedMachines}>
                        </PDI_Arbeit>
                    </div>
                    <div className='flex flex-col mt-9'>
                        <div className='mb-4 bg-[rgb(255,204,0)]'>
                            <h2 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{areas[27].name}</h2>
                        </div>
                        <PDI_Puffer 
                                machinelist={machinelist} 
                                setmachinelist={setmachinelist}
                                areas={areas}
                                thisarea={areas[27]}
                                setAreas={setAreas}
                                finishedMachines={finishedMachines}
                                setFinishedMachines={setFinishedMachines}>
                        </PDI_Puffer>
                    </div>
                    <div className='flex flex-col mt-9'>
                        <div className='mb-4 bg-[rgb(255,204,0)]'>
                            <h2 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{areas[28].name}</h2>
                        </div>
                        <PDI_Nacharbeit 
                                machinelist={machinelist} 
                                setmachinelist={setmachinelist}
                                areas={areas}
                                thisarea={areas[28]}
                                setAreas={setAreas}
                                finishedMachines={finishedMachines}
                                setFinishedMachines={setFinishedMachines}>
                        </PDI_Nacharbeit>
                    </div>
                </div>
            </div>
            <div className='flex gap-4'>
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col'>
                        <div className='mb-4 bg-[rgb(255,204,0)]'>
                            <h2 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{areas[29].name}</h2>
                        </div>
                        <Konservieren_Arbeit machinelist={machinelist} 
                                setmachinelist={setmachinelist}
                                areas={areas}
                                thisarea={areas[29]}
                                setAreas={setAreas}
                                finishedMachines={finishedMachines}
                                setFinishedMachines={setFinishedMachines}>
                        </Konservieren_Arbeit>
                    </div>
                    <div className='flex flex-col mt-9'>
                        <div className='mb-4 bg-[rgb(255,204,0)]'>
                            <h2 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{areas[30].name}</h2>
                        </div>
                        <Konservieren_Puffer 
                                machinelist={machinelist} 
                                setmachinelist={setmachinelist}
                                areas={areas}
                                thisarea={areas[30]}
                                setAreas={setAreas}
                                finishedMachines={finishedMachines}
                                setFinishedMachines={setFinishedMachines}>
                        </Konservieren_Puffer>
                    </div>
                    <div className='flex flex-col mt-9'>
                        <div className='mb-4 bg-[rgb(255,204,0)]'>
                            <h2 className='text-center font-extrabold text-sm text-[rgb(85,90,90)]'>{areas[31].name}</h2>
                        </div>
                        <Konservieren_Nacharbeit 
                                machinelist={machinelist} 
                                setmachinelist={setmachinelist}
                                areas={areas}
                                thisarea={areas[31]}
                                setAreas={setAreas}
                                finishedMachines={finishedMachines}
                                setFinishedMachines={setFinishedMachines}>
                        </Konservieren_Nacharbeit>
                    </div>
                </div>
            </div>
        </div>
        
        
     )
}
 
export default MainBoard;