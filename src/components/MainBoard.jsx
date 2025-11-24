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




const MainBoard = ({machinelist, 
    setmachinelist, 
    finishedMachines, 
    setFinishedMachines, 
    areas, 
    setAreas,
    filters,
    globalTags,
    setGlobalTags}) => {

     

    
    const filteredMachines = machinelist.filter((m) => {
  const searchValue = filters.search?.toLowerCase() || "";
  const kNummer = m.kNummer || "";
  const kunde = m.kunde?.toLowerCase() || "";

  // 🔍 Suchlogik
  const searchMatch =
    !searchValue || kNummer.includes(searchValue) || kunde.includes(searchValue);

  // ⚙️ Typ-Filter
  const typMatch = !filters.typ || m.Typ === filters.typ;

  // 📝 Typ Bezeichnung Filter (Inputfeld)
  const typBezeichnungMatch =
    !filters.typBezeichung ||
    (m.Typ_Bezeichnung?.toLowerCase() || "").includes(
      filters.typBezeichung.toLowerCase()
    );

  // 🏷️ Tag-Filter
  const tagMatch =
    !filters.tags?.length ||
    filters.tags.every((selectedTag) => m.Tags?.includes(selectedTag));

  // 📆 Sequenzfilter
  const { selectedArea, selectedType, selectedType2, from, till } =
    filters.sequenzFilter;

  // Wenn kein Sequenzfilter aktiv ist → alles zeigen
  if (!selectedArea && !selectedType && !selectedType2 && !from && !till) {
    return searchMatch && typMatch && typBezeichnungMatch && tagMatch;
  }

  // 🏭 Sequenzprüfung pro Maschine
  const sequenzMatch = m.sequenzen.some((seq) => {
    // 🏭 Bereich (optional)
    const areaOk =
      !selectedArea || seq.bereich.toLowerCase() === selectedArea.toLowerCase();

    // ⏱ Datumstyp + Start/Ende Kombination
    let dateFields = [];

    const typesToCheck = selectedType
      ? [selectedType.toLowerCase()]
      : ["plan", "ist"];

    const startEndToCheck = selectedType2
      ? [selectedType2.toLowerCase()]
      : ["start", "ende"];

    typesToCheck.forEach((t) => {
      startEndToCheck.forEach((se) => {
        dateFields.push(`${t}${se.charAt(0).toUpperCase() + se.slice(1)}`); // z.B. planStart, istEnde
      });
    });

    const fromDate = from ? new Date(from) : null;
    const tillDate = till ? new Date(till) : null;

    const anyDateOk = dateFields.some((field) => {
      const dateValue = seq[field];
      if (!dateValue) return false;
      const seqDate = new Date(dateValue);
      return (!fromDate || seqDate >= fromDate) && (!tillDate || seqDate <= tillDate);
    });

    const dateOk = from || till ? anyDateOk : true;

    return areaOk && dateOk;
        });

    // ✅ Alle Bedingungen kombinieren
    return searchMatch && typMatch && typBezeichnungMatch && tagMatch && sequenzMatch;
        });

        
    if (!areas || areas.length === 0) {
        return <div>Lade Bereiche...</div>;
        }

    return ( 
        <div className='MainBoard flex gap-4 '>
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
                                setFinishedMachines={setFinishedMachines}
                                globalTags={globalTags}
                                setGlobalTags={setGlobalTags}
                                filteredMachines={filteredMachines}> 
                                
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
                                globalTags={globalTags}
                                setGlobalTags={setGlobalTags}
                                filteredMachines={filteredMachines}
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
                                globalTags={globalTags}
                                setGlobalTags={setGlobalTags}
                                filteredMachines={filteredMachines}
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
                                globalTags={globalTags}
                                setGlobalTags={setGlobalTags}
                                filteredMachines={filteredMachines}
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
                                globalTags={globalTags}
                                setGlobalTags={setGlobalTags}
                                filteredMachines={filteredMachines}
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
                                globalTags={globalTags}
                                setGlobalTags={setGlobalTags}
                                filteredMachines={filteredMachines}
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
                                globalTags={globalTags}
                                setGlobalTags={setGlobalTags}
                                filteredMachines={filteredMachines}
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
                                globalTags={globalTags}
                                setGlobalTags={setGlobalTags}
                                filteredMachines={filteredMachines}
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
                                globalTags={globalTags}
                                setGlobalTags={setGlobalTags}
                                filteredMachines={filteredMachines}
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
                                globalTags={globalTags}
                                setGlobalTags={setGlobalTags}
                                filteredMachines={filteredMachines}
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
                                setFinishedMachines={setFinishedMachines}
                                globalTags={globalTags}
                                setGlobalTags={setGlobalTags}
                                filteredMachines={filteredMachines}>

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
                                setFinishedMachines={setFinishedMachines}
                                globalTags={globalTags}
                                setGlobalTags={setGlobalTags}
                                filteredMachines={filteredMachines}>

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
                                setFinishedMachines={setFinishedMachines}
                                globalTags={globalTags}
                                setGlobalTags={setGlobalTags}
                                filteredMachines={filteredMachines}>
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
                                setFinishedMachines={setFinishedMachines}
                                globalTags={globalTags}
                                setGlobalTags={setGlobalTags}
                                filteredMachines={filteredMachines}>

                        </BSA_Dock>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-4'>
                <div className='text-xl font-extrabold text-[rgb(85,90,90)] bg-[rgb(166,202,236)] w-8 h-[1032px] flex items-center justify-center [writing-mode:vertical-rl] rotate-180 text-center'>↓ in Arbeit ↓</div>
                <div className='text-xl font-extrabold text-[rgb(85,90,90)] bg-[rgb(242,207,238)] w-8 h-[860px] flex items-center justify-center [writing-mode:vertical-rl] rotate-180 text-center'>↓ Puffer ↓</div>
                <div className='text-xl font-extrabold text-[rgb(85,90,90)] bg-[rgb(246,198,173)] w-8 h-[480px] flex items-center justify-center [writing-mode:vertical-rl] rotate-180 text-center'>↓ Nacharbeit ↓</div>
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
                                setFinishedMachines={setFinishedMachines}
                                globalTags={globalTags}
                                setGlobalTags={setGlobalTags}
                                filteredMachines={filteredMachines}>
                            
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
                                setFinishedMachines={setFinishedMachines}
                                globalTags={globalTags}
                                setGlobalTags={setGlobalTags}
                                filteredMachines={filteredMachines}>
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
                                setFinishedMachines={setFinishedMachines}
                                globalTags={globalTags}
                                setGlobalTags={setGlobalTags}
                                filteredMachines={filteredMachines}>
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
                                setFinishedMachines={setFinishedMachines}
                                globalTags={globalTags}
                                setGlobalTags={setGlobalTags}
                                filteredMachines={filteredMachines}>
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
                                setFinishedMachines={setFinishedMachines}
                                globalTags={globalTags}
                                setGlobalTags={setGlobalTags}
                                filteredMachines={filteredMachines}>
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
                                setFinishedMachines={setFinishedMachines}
                                globalTags={globalTags}
                                setGlobalTags={setGlobalTags}
                                filteredMachines={filteredMachines}>
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
                                setFinishedMachines={setFinishedMachines}
                                globalTags={globalTags}
                                setGlobalTags={setGlobalTags}
                                filteredMachines={filteredMachines}>

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
                                setFinishedMachines={setFinishedMachines}
                                globalTags={globalTags}
                                setGlobalTags={setGlobalTags}
                                filteredMachines={filteredMachines}>

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
                                setFinishedMachines={setFinishedMachines}
                                globalTags={globalTags}
                                setGlobalTags={setGlobalTags}
                                filteredMachines={filteredMachines}>
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
                                setFinishedMachines={setFinishedMachines}
                                globalTags={globalTags}
                                setGlobalTags={setGlobalTags}
                                filteredMachines={filteredMachines}>
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
                                setFinishedMachines={setFinishedMachines}
                                globalTags={globalTags}
                                setGlobalTags={setGlobalTags}
                                filteredMachines={filteredMachines}>
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
                                setFinishedMachines={setFinishedMachines}
                                globalTags={globalTags}
                                setGlobalTags={setGlobalTags}
                                filteredMachines={filteredMachines}>
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
                                setFinishedMachines={setFinishedMachines}
                                globalTags={globalTags}
                                setGlobalTags={setGlobalTags}
                                filteredMachines={filteredMachines}>
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
                                setFinishedMachines={setFinishedMachines}
                                globalTags={globalTags}
                                setGlobalTags={setGlobalTags}
                                filteredMachines={filteredMachines}>
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
                                setFinishedMachines={setFinishedMachines}
                                globalTags={globalTags}
                                setGlobalTags={setGlobalTags}
                                filteredMachines={filteredMachines}>
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
                                setFinishedMachines={setFinishedMachines}
                                globalTags={globalTags}
                                setGlobalTags={setGlobalTags}
                                filteredMachines={filteredMachines}>
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
                                setFinishedMachines={setFinishedMachines}
                                globalTags={globalTags}
                                setGlobalTags={setGlobalTags}
                                filteredMachines={filteredMachines}>
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
                                setFinishedMachines={setFinishedMachines}
                                globalTags={globalTags}
                                setGlobalTags={setGlobalTags}
                                filteredMachines={filteredMachines}>
                        </Konservieren_Nacharbeit>
                    </div>
                </div>
            </div>
        </div>
        
        
     )
}
 
export default MainBoard;