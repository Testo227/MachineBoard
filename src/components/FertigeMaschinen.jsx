import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import TagCircles from './TagCircles';

const TYPE_COLORS = {
  BSF: '#22c55e', PUMI: '#FFCC00', BSA: '#f97316',
  Prototyp: '#94a3b8', 'E-Mischer': '#3b82f6', Leerslot: '#cbd5e1',
};

function getCalendarWeek(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T12:00:00');
  const day = d.getDay() || 7;
  d.setDate(d.getDate() + 4 - day);
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const kw = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return { kw, year: d.getFullYear() };
}

const FertigCard = ({ machine, globalTags }) => {
  const typeColor = TYPE_COLORS[machine.Typ] || '#e2e8f0';
  const isYellow = machine.Typ === 'PUMI';

  const formatDate = (raw) => {
    if (!raw) return '—';
    const d = new Date(raw + 'T12:00:00');
    return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.`;
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
      style={{ borderLeft: `3px solid ${typeColor}` }}
    >
      <div className="px-1.5 pt-1">
        <span
          className="font-bold rounded-full inline-block truncate max-w-full leading-tight"
          style={{ fontSize: 8, padding: '1px 5px', backgroundColor: typeColor, color: isYellow ? '#555A5A' : 'white' }}
        >
          {machine.Typ}{machine.Typ_Bezeichnung ? ' ' + machine.Typ_Bezeichnung : ''}
        </span>
      </div>
      <div className="px-1.5 mt-0.5">
        <span className="font-bold text-[rgb(85,90,90)] truncate leading-tight block" style={{ fontSize: 10 }}>
          {machine.kunde || '—'}
        </span>
        <span className="text-gray-400 font-medium truncate leading-tight block" style={{ fontSize: 9 }}>
          {machine.kNummer || '—'}
        </span>
      </div>
      <div className="px-1.5 mt-0.5 pb-1.5">
        <div className="flex items-center gap-0.5 mb-0.5">
          <span style={{ fontSize: 7, color: '#9ca3af' }}>Fertig:</span>
          <span style={{ fontSize: 8, fontWeight: 600, color: '#555A5A' }}>{formatDate(machine.fertigstellung)}</span>
        </div>
        <TagCircles tags={machine.Tags} globalTags={globalTags} />
      </div>
    </div>
  );
};

const FertigeMaschinen = ({ globalTags }) => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('machines')
      .select('*, machine_tags(*)')
      .eq('status', 'fertig')
      .order('fertigstellung', { ascending: false })
      .then(({ data }) => {
        if (data) {
          setMachines(data.map(m => ({ ...m, Tags: m.machine_tags?.map(mt => mt.tag_id) || [] })));
        }
        setLoading(false);
      });
  }, []);

  const groups = {};
  machines.forEach(m => {
    const kwInfo = getCalendarWeek(m.fertigstellung);
    const key     = kwInfo ? `KW${String(kwInfo.kw).padStart(2, '0')} ${kwInfo.year}` : 'Unbekannt';
    const sortKey = kwInfo ? `${kwInfo.year}${String(kwInfo.kw).padStart(2, '0')}` : '0';
    if (!groups[key]) groups[key] = { machines: [], sortKey };
    groups[key].machines.push(m);
  });

  const sortedKeys = Object.entries(groups)
    .sort((a, b) => b[1].sortKey.localeCompare(a[1].sortKey))
    .map(([key]) => key);

  if (loading) return <div className="p-8 text-center text-gray-400 text-sm">Lade fertige Maschinen…</div>;
  if (machines.length === 0) return <div className="p-8 text-center text-gray-400 text-sm">Noch keine fertigen Maschinen.</div>;

  return (
    <div className="h-full flex flex-col">
      <div className="px-2 py-2 flex items-baseline gap-2 flex-shrink-0">
        <h1 className="text-sm font-extrabold text-[rgb(85,90,90)]">Fertige Maschinen</h1>
        <span className="text-xs text-gray-400">{machines.length} gesamt</span>
      </div>
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex gap-3 px-2 h-full" style={{ width: 'max-content' }}>
          {sortedKeys.map(key => (
            <div key={key} className="flex flex-col gap-2" style={{ width: 145 }}>
              <div className="bg-[rgb(70,75,82)] rounded-lg px-2 py-1.5 flex items-center gap-1.5 flex-shrink-0">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'rgb(255,204,0)' }} />
                <span className="text-white font-bold text-xs">{key}</span>
                <span className="text-white/50 text-xs ml-auto">{groups[key].machines.length}</span>
              </div>
              <div className="flex flex-col gap-2 overflow-y-auto">
                {groups[key].machines.map(m => (
                  <FertigCard key={m.id} machine={m} globalTags={globalTags} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FertigeMaschinen;
