import React, { useState } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { supabase } from '../supabaseClient';
import { useToast } from './ToastContext';

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

import '../styles/style.css';

const TYPE_COLORS = {
  BSF: '#22c55e', PUMI: '#FFCC00', BSA: '#f97316',
  Prototyp: '#94a3b8', 'E-Mischer': '#3b82f6',
};

// Floating card shown under the cursor while dragging
const CardPreview = ({ machine }) => {
  const typeColor = TYPE_COLORS[machine.Typ] || '#e2e8f0';
  const isYellow = machine.Typ === 'PUMI';
  return (
    <div className="w-28 bg-white rounded-lg shadow-2xl opacity-95 overflow-hidden rotate-2 pointer-events-none" style={{ borderLeft: `3px solid ${typeColor}` }}>
      <div className="px-1.5 pt-1">
        <span className="font-bold rounded-full inline-block px-1.5 py-0.5" style={{ fontSize: '8px', backgroundColor: typeColor, color: isYellow ? '#555A5A' : 'white' }}>
          {machine.Typ || 'Kein Typ'}
        </span>
      </div>
      <div className="px-1.5 mt-0.5 pb-1.5">
        <div className="font-bold text-[rgb(85,90,90)] text-xs truncate">{machine.kunde || '—'}</div>
        <div className="text-gray-400 text-xs truncate">{machine.kNummer || '—'}</div>
      </div>
    </div>
  );
};

// Reusable area header + content wrapper
const Area = ({ name, flex, children }) => (
  <div style={{ flex }} className='flex flex-col min-w-0 min-h-0'>
    <div className='bg-[rgb(70,75,82)] rounded-sm px-1 flex-shrink-0 mb-0.5' style={{ paddingTop: '2px', paddingBottom: '2px' }}>
      <h2 className='text-center font-extrabold text-white tracking-wide truncate leading-tight' style={{ fontSize: 'clamp(8px, 0.75vw, 13px)' }}>{name}</h2>
    </div>
    <div className='flex-1 min-h-0'>
      {children}
    </div>
  </div>
);

const MainBoard = ({ machinelist, setmachinelist, finishedMachines, setFinishedMachines, areas, setAreas, filters, globalTags, setGlobalTags }) => {
  const { addToast } = useToast();
  const [activeMachine, setActiveMachine] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = ({ active }) => {
    setActiveMachine(active.data.current.machine);
  };

  const handleDragEnd = async ({ active, over }) => {
    setActiveMachine(null);
    if (!over) return;

    const draggedMachine = active.data.current.machine;
    const { areaName: toArea, slotName: toSlot, occupant } = over.data.current;
    const fromArea = draggedMachine.area;
    const fromSlot = draggedMachine.position;

    if (fromArea === toArea && fromSlot === toSlot) return;

    const snapshot = machinelist;

    // Optimistic update
    setmachinelist(prev => prev.map(m => {
      if (m.id === draggedMachine.id) return { ...m, area: toArea, position: toSlot };
      if (occupant && m.id === occupant.id) return { ...m, area: fromArea, position: fromSlot };
      return m;
    }));

    try {
      const updates = [
        supabase.from('machines').update({ area: toArea, position: toSlot }).eq('id', draggedMachine.id),
      ];
      if (occupant) {
        updates.push(supabase.from('machines').update({ area: fromArea, position: fromSlot }).eq('id', occupant.id));
      }
      const results = await Promise.all(updates);
      if (results.some(r => r.error)) throw new Error('DB update failed');
      addToast('✅ Maschine verschoben', 'success');
    } catch {
      setmachinelist(snapshot);
      addToast('❌ Fehler beim Verschieben', 'error');
    }
  };

  const filteredMachines = machinelist.filter((m) => {
    const searchValue = filters.search?.toLowerCase() || "";
    const kNummer = m.kNummer || "";
    const kunde = m.kunde?.toLowerCase() || "";

    const searchMatch = !searchValue || String(kNummer).includes(searchValue) || kunde.includes(searchValue);
    const typMatch = !filters.typ || m.Typ === filters.typ;
    const typBezeichnungMatch = !filters.typBezeichung || (m.Typ_Bezeichnung?.toLowerCase() || "").includes(filters.typBezeichung.toLowerCase());
    const tagMatch = !filters.tags?.length || filters.tags.every((t) => m.Tags?.includes(t));

    const { selectedArea, selectedType, selectedType2, from, till } = filters.sequenzFilter || {};
    if (!selectedArea && !selectedType && !selectedType2 && !from && !till) {
      return searchMatch && typMatch && typBezeichnungMatch && tagMatch;
    }

    const sequenzMatch = m.sequenzen.some((seq) => {
      const areaOk = !selectedArea || seq.bereich.toLowerCase() === selectedArea.toLowerCase();
      const typesToCheck = selectedType ? [selectedType.toLowerCase()] : ["plan", "ist"];
      const startEndToCheck = selectedType2 ? [selectedType2.toLowerCase()] : ["start", "ende"];
      const dateFields = [];
      typesToCheck.forEach((t) => startEndToCheck.forEach((se) => dateFields.push(`${t}${se.charAt(0).toUpperCase() + se.slice(1)}`)));
      const fromDate = from ? new Date(from) : null;
      const tillDate = till ? new Date(till) : null;
      const anyDateOk = dateFields.some((field) => {
        const dateValue = seq[field];
        if (!dateValue) return false;
        const seqDate = new Date(dateValue);
        return (!fromDate || seqDate >= fromDate) && (!tillDate || seqDate <= tillDate);
      });
      return areaOk && (from || till ? anyDateOk : true);
    });

    return searchMatch && typMatch && typBezeichnungMatch && tagMatch && sequenzMatch;
  });

  if (!areas || areas.length === 0) return <div>Lade Bereiche...</div>;

  // Shared props builder
  const p = (i) => ({
    machinelist, setmachinelist, areas, thisarea: areas[i],
    setAreas, finishedMachines, setFinishedMachines,
    globalTags, setGlobalTags, filteredMachines
  });

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
    <div className='flex gap-1 h-full w-full'>

      {/* ── LEFT GROUP: PPM1 / PPM2 / PUMI / Dock / BSA ── flex-[8] */}
      <div style={{ flex: 8 }} className='flex flex-col gap-1 min-w-0 min-h-0'>

        {/* PPM1 row — 3 slot-rows high */}
        <div style={{ flex: 3 }} className='flex gap-1 min-h-0'>
          <Area name={areas[0].name} flex={3}><PPM1_Pool {...p(0)} /></Area>
          <Area name={areas[1].name} flex={4}><PPM1_Line {...p(1)} /></Area>
          <Area name={areas[2].name} flex={1}><PPM1_NAorWait {...p(2)} /></Area>
        </div>

        {/* PPM2 row — 3 slot-rows high */}
        <div style={{ flex: 3 }} className='flex gap-1 min-h-0'>
          <Area name={areas[6].name} flex={3}><PPM2_Pool {...p(6)} /></Area>
          <Area name={areas[7].name} flex={4}><PPM2_Line {...p(7)} /></Area>
          <Area name={areas[8].name} flex={1}><PPM2_NAorWait {...p(8)} /></Area>
        </div>

        {/* PUMI row — 2 slot-rows high */}
        <div style={{ flex: 2 }} className='flex gap-1 min-h-0'>
          <Area name={areas[3].name} flex={3}><PUMI_Pool {...p(3)} /></Area>
          <Area name={areas[4].name} flex={4}><PUMI_Line {...p(4)} /></Area>
          <Area name={areas[5].name} flex={1}><PUMI_NAorWait {...p(5)} /></Area>
        </div>

        {/* Dock row — 3 slot-rows high */}
        <div style={{ flex: 3 }} className='flex gap-1 min-h-0'>
          <Area name={areas[9].name} flex={3}><Dock_Pool {...p(9)} /></Area>
          <Area name={areas[10].name} flex={5}><Dock_Places {...p(10)} /></Area>
        </div>

        {/* BSA row — 3 slot-rows high */}
        <div style={{ flex: 3 }} className='flex gap-1 min-h-0'>
          <Area name={areas[11].name} flex={3}><BSA_Pool {...p(11)} /></Area>
          <Area name={areas[12].name} flex={2}><BSA_Line {...p(12)} /></Area>
          <Area name={areas[13].name} flex={2}><BSA_Dock {...p(13)} /></Area>
        </div>

      </div>

      {/* ── DIVIDER: Arbeit / Puffer / Nacharbeit zones ── */}
      <div className='flex flex-col gap-1 w-6 flex-shrink-0'>
        <div style={{ flex: 6 }} className='flex items-center justify-center bg-[rgb(50,90,140)] rounded text-white font-extrabold text-[9px] [writing-mode:vertical-rl] rotate-180 select-none'>↓ in Arbeit ↓</div>
        <div style={{ flex: 5 }} className='flex items-center justify-center bg-[rgb(150,115,40)] rounded text-white font-extrabold text-[9px] [writing-mode:vertical-rl] rotate-180 select-none'>↓ Puffer ↓</div>
        <div style={{ flex: 3 }} className='flex items-center justify-center bg-[rgb(145,60,60)] rounded text-white font-extrabold text-[9px] [writing-mode:vertical-rl] rotate-180 select-none'>↓ Nacharbeit ↓</div>
      </div>

      {/* ── RIGHT GROUP: station columns ── flex-[7] */}
      <div style={{ flex: 7 }} className='flex gap-1 min-w-0 min-h-0'>

        {/* Pumpe — 2 slot-cols */}
        <div style={{ flex: 2 }} className='flex flex-col gap-1 min-w-0 min-h-0'>
          <Area name={areas[14].name} flex={6}><Pumpe_Arbeit {...p(14)} /></Area>
          <Area name={areas[15].name} flex={5}><Pumpe_Puffer {...p(15)} /></Area>
          <Area name={areas[16].name} flex={3}><Pumpe_Nacharbeit {...p(16)} /></Area>
        </div>

        {/* Mast — 1 slot-col */}
        <div style={{ flex: 1 }} className='flex flex-col gap-1 min-w-0 min-h-0'>
          <Area name={areas[17].name} flex={6}><Mast_Arbeit {...p(17)} /></Area>
          <Area name={areas[18].name} flex={5}><Mast_Puffer {...p(18)} /></Area>
          <Area name={areas[19].name} flex={3}><Mast_Nacharbeit {...p(19)} /></Area>
        </div>

        {/* Lackierung — 1 slot-col */}
        <div style={{ flex: 1 }} className='flex flex-col gap-1 min-w-0 min-h-0'>
          <Area name={areas[20].name} flex={6}><Lackierung_Arbeit {...p(20)} /></Area>
          <Area name={areas[21].name} flex={5}><Lackierung_Puffer {...p(21)} /></Area>
          <Area name={areas[22].name} flex={3}><Lackierung_Nacharbeit {...p(22)} /></Area>
        </div>

        {/* Endmontage — 1 slot-col */}
        <div style={{ flex: 1 }} className='flex flex-col gap-1 min-w-0 min-h-0'>
          <Area name={areas[23].name} flex={6}><Endmontage_Arbeit {...p(23)} /></Area>
          <Area name={areas[24].name} flex={5}><Endmontage_Puffer {...p(24)} /></Area>
          <Area name={areas[25].name} flex={3}><Endmontage_Nacharbeit {...p(25)} /></Area>
        </div>

        {/* PDI — 1 slot-col */}
        <div style={{ flex: 1 }} className='flex flex-col gap-1 min-w-0 min-h-0'>
          <Area name={areas[26].name} flex={6}><PDI_Arbeit {...p(26)} /></Area>
          <Area name={areas[27].name} flex={5}><PDI_Puffer {...p(27)} /></Area>
          <Area name={areas[28].name} flex={3}><PDI_Nacharbeit {...p(28)} /></Area>
        </div>

        {/* Konservieren — 1 slot-col */}
        <div style={{ flex: 1 }} className='flex flex-col gap-1 min-w-0 min-h-0'>
          <Area name={areas[29].name} flex={6}><Konservieren_Arbeit {...p(29)} /></Area>
          <Area name={areas[30].name} flex={5}><Konservieren_Puffer {...p(30)} /></Area>
          <Area name={areas[31].name} flex={3}><Konservieren_Nacharbeit {...p(31)} /></Area>
        </div>

      </div>
    </div>
    <DragOverlay dropAnimation={null}>
      {activeMachine ? <CardPreview machine={activeMachine} /> : null}
    </DragOverlay>
    </DndContext>
  );
};

export default MainBoard;
