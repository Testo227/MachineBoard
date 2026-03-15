import React, { useState } from 'react';
import '../styles/style.css';
import Modal from './Modal';
import TagCircles from './TagCircles';
import { useDraggable } from '@dnd-kit/core';

const TYPE_COLORS = {
  BSF: '#22c55e',
  PUMI: '#FFCC00',
  BSA: '#f97316',
  Prototyp: '#94a3b8',
  'E-Mischer': '#3b82f6',
  Leerslot: '#cbd5e1',
};

const Card = ({
  areas, setAreas, currentMachine, machinelist, setmachinelist,
  setFinishedMachines, finishedMachines, globalTags, setGlobalTags, dimmed
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: currentMachine.id,
    data: { machine: currentMachine },
  });

  const typeColor = TYPE_COLORS[currentMachine.Typ] || '#e2e8f0';
  const isYellow  = currentMachine.Typ === 'PUMI';
  const showRow   = currentMachine.sequenzen?.find(seq => seq.showOnCard);

  const formatDate = (raw) => {
    if (!raw) return '—';
    const d = new Date(raw);
    const weekday = d.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', '').slice(0, 2);
    const day   = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${weekday} ${day}.${month}.`;
  };

  // Use sequenz dates if set, fall back to machine-level start_date / end_date
  const startDate = showRow?.istStart || currentMachine.start_date;
  const endDate   = showRow?.istEnde  || currentMachine.end_date;

  const modal = isOpen && (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} areas={areas} setAreas={setAreas}
      currentmachine={currentMachine} machinelist={machinelist} setmachinelist={setmachinelist}
      setFinishedMachines={setFinishedMachines} finishedMachines={finishedMachines}
      globalTags={globalTags} setGlobalTags={setGlobalTags} />
  );

  // Leerslot: show only a minimal placeholder card
  if (currentMachine.Typ === 'Leerslot') {
    return (
      <div className="w-full" style={{ opacity: dimmed ? 0.3 : isDragging ? 0.3 : 1, pointerEvents: dimmed ? 'none' : 'auto' }}>
        {modal}
        <div
          ref={setNodeRef} {...listeners} {...attributes}
          onClick={() => setIsOpen(true)}
          className="mx-1.5 my-1.5 bg-white/60 rounded-lg shadow-sm flex items-center justify-center cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-150"
          style={{ borderLeft: '3px solid #cbd5e1', minHeight: 30 }}
        >
          <span className="text-gray-300 font-semibold select-none" style={{ fontSize: 'clamp(7px, 0.6vw, 10px)' }}>
            Leerslot
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ opacity: dimmed ? 0.3 : isDragging ? 0.3 : 1, pointerEvents: dimmed ? 'none' : 'auto' }}>
      {modal}
      <div
        ref={setNodeRef} {...listeners} {...attributes}
        onClick={() => setIsOpen(true)}
        className="mx-1.5 my-1.5 bg-white rounded-lg shadow-sm flex flex-col overflow-hidden cursor-grab active:cursor-grabbing hover:shadow-md hover:brightness-[0.98] transition-all duration-150 pb-1"
        style={{ borderLeft: `3px solid ${typeColor}` }}
      >
        {/* Type badge */}
        <div className="px-1.5 pt-1">
          <span className="font-bold rounded-full truncate inline-block max-w-full leading-tight"
            style={{ fontSize: 'clamp(5px, 0.45vw, 8px)', padding: '1px 5px',
              backgroundColor: typeColor, color: isYellow ? '#555A5A' : 'white' }}>
            {currentMachine.Typ
              ? `${currentMachine.Typ}${currentMachine.Typ_Bezeichnung ? ' ' + currentMachine.Typ_Bezeichnung : ''}`
              : currentMachine.Typ_Bezeichnung || 'Kein Typ'}
          </span>
        </div>

        {/* Customer + K-Number */}
        <div className="px-1.5 mt-0.5">
          <span className="font-bold text-[rgb(85,90,90)] truncate leading-tight block"
            style={{ fontSize: 'clamp(6px, 0.65vw, 11px)' }}>
            {currentMachine.kunde || '—'}
          </span>
          <span className="text-gray-400 font-medium truncate leading-tight block"
            style={{ fontSize: 'clamp(5px, 0.5vw, 9px)' }}>
            {currentMachine.kNummer || '—'}
          </span>
        </div>

        {/* Dates */}
        <div className="px-1.5 mt-0.5">
          <div className="flex items-center gap-0.5">
            <span className="text-gray-400 flex-shrink-0" style={{ fontSize: 'clamp(4px, 0.4vw, 7px)' }}>Start:</span>
            <span className="font-semibold text-[rgb(85,90,90)] truncate" style={{ fontSize: 'clamp(5px, 0.45vw, 8px)' }}>
              {formatDate(startDate)}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <span className="text-gray-400 flex-shrink-0" style={{ fontSize: 'clamp(4px, 0.4vw, 7px)' }}>Ende:</span>
            <span className="font-semibold text-[rgb(85,90,90)] truncate" style={{ fontSize: 'clamp(5px, 0.45vw, 8px)' }}>
              {formatDate(endDate)}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="px-1.5 mt-0.5">
          <TagCircles tags={currentMachine.Tags} globalTags={globalTags} />
        </div>
      </div>
    </div>
  );
};

export default Card;
