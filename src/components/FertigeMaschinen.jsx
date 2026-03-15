import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FileDown, LayoutGrid, BarChart2, X } from 'lucide-react';
import { supabase } from '../supabaseClient';
import TagCircles from './TagCircles';
import { useToast } from './ToastContext';

const TYPE_COLORS = {
  BSF: '#22c55e', PUMI: '#FFCC00', BSA: '#f97316',
  Prototyp: '#94a3b8', 'E-Mischer': '#3b82f6',
};
const TYPE_ORDER = ['BSF', 'PUMI', 'BSA', 'E-Mischer', 'Prototyp'];
const MONTH_NAMES = ['Januar','Februar','März','April','Mai','Juni',
  'Juli','August','September','Oktober','November','Dezember'];

function getCalendarWeek(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T12:00:00');
  const day = d.getDay() || 7;
  d.setDate(d.getDate() + 4 - day);
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const kw = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return { kw, year: d.getFullYear() };
}

function getGroupKey(dateStr, mode) {
  if (!dateStr) return { key: 'Unbekannt', sortKey: '0' };
  const d = new Date(dateStr + 'T12:00:00');
  if (mode === 'kw') {
    const r = getCalendarWeek(dateStr);
    if (!r) return { key: 'Unbekannt', sortKey: '0' };
    return { key: `KW${String(r.kw).padStart(2, '0')} ${r.year}`, sortKey: `${r.year}${String(r.kw).padStart(2, '0')}` };
  }
  if (mode === 'monat') {
    return {
      key: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`,
      sortKey: `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`,
    };
  }
  return { key: `${d.getFullYear()}`, sortKey: `${d.getFullYear()}` };
}

// ── FertigCard ─────────────────────────────────────────────────────────────

const FertigCard = ({ machine, globalTags, onClick }) => {
  const typeColor = TYPE_COLORS[machine.Typ] || '#e2e8f0';
  const isYellow  = machine.Typ === 'PUMI';
  const fmt = (raw) => {
    if (!raw) return '—';
    const d = new Date(raw + 'T12:00:00');
    return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.`;
  };
  return (
    <div onClick={onClick}
      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer hover:brightness-[0.98]"
      style={{ borderLeft: `3px solid ${typeColor}` }}>
      <div className="px-1.5 pt-1">
        <span className="font-bold rounded-full inline-block truncate max-w-full leading-tight"
          style={{ fontSize: 8, padding: '1px 5px', backgroundColor: typeColor, color: isYellow ? '#555A5A' : 'white' }}>
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
          <span style={{ fontSize: 8, fontWeight: 600, color: '#555A5A' }}>{fmt(machine.fertigstellung)}</span>
        </div>
        <TagCircles tags={machine.Tags} globalTags={globalTags} />
      </div>
    </div>
  );
};

// ── ChartView ──────────────────────────────────────────────────────────────

const ChartView = ({ sortedKeys, groups, sollValues, mode }) => {
  const CHART_H  = 220;
  const BAR_W    = 52;
  const BAR_GAP  = 20;
  const Y_W      = 26;
  const BOT_H    = 44;
  const TOP_PAD  = 24;
  const showSoll = mode === 'monat';

  const rawMax   = Math.max(...sortedKeys.map(k => groups[k].machines.length), 1);
  const niceMax  = Math.max(Math.ceil(rawMax / 5) * 5, 5);
  const tickStep = niceMax <= 10 ? 1 : niceMax <= 20 ? 2 : niceMax <= 50 ? 5 : 10;
  const yTicks   = [];
  for (let t = 0; t <= niceMax; t += tickStep) yTicks.push(t);

  const totalW = Y_W + sortedKeys.length * (BAR_W + BAR_GAP) + BAR_GAP;

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden min-h-0 pb-2">
      <div className="flex flex-col px-2 pt-2 h-full" style={{ minWidth: totalW + 48 }}>

        {/* Legend */}
        <div className="flex gap-4 mb-3 flex-wrap flex-shrink-0">
          {TYPE_ORDER.map(t => (
            <div key={t} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: TYPE_COLORS[t] }} />
              <span className="text-xs text-gray-500">{t}</span>
            </div>
          ))}
          {showSoll && (
            <div className="flex items-center gap-1.5">
              <div className="w-5 flex-shrink-0" style={{ borderTop: '2px dashed #6b7280', marginTop: 1 }} />
              <span className="text-xs text-gray-500">Soll</span>
            </div>
          )}
        </div>

        {/* Chart */}
        <div style={{ position: 'relative', width: totalW, height: CHART_H + BOT_H + TOP_PAD, flexShrink: 0 }}>

          {/* Y-axis labels + gridlines */}
          {yTicks.map(t => {
            const yFromBottom = BOT_H + (t / niceMax) * CHART_H;
            return (
              <React.Fragment key={t}>
                <div style={{
                  position: 'absolute', left: Y_W, right: 0,
                  bottom: yFromBottom, borderTop: t === 0 ? '2px solid #e2e8f0' : '1px solid #f1f5f9',
                }} />
                <div style={{
                  position: 'absolute', left: 0, width: Y_W - 4, bottom: yFromBottom - 7,
                  textAlign: 'right', fontSize: 9, color: '#9ca3af', lineHeight: 1,
                }}>{t}</div>
              </React.Fragment>
            );
          })}

          {/* Bars — sortedKeys is already oldest→newest (ascending), so left=oldest, right=newest */}
          {sortedKeys.map((key, i) => {
            const group  = groups[key];
            const total  = group.machines.length;
            const barH   = niceMax > 0 ? (total / niceMax) * CHART_H : 0;
            const soll   = showSoll ? (sollValues[key] || 0) : 0;
            const sollH  = soll > 0 && niceMax > 0 ? (soll / niceMax) * CHART_H : null;
            const meets  = total >= soll;
            const x      = Y_W + BAR_GAP / 2 + i * (BAR_W + BAR_GAP);

            return (
              <React.Fragment key={key}>
                {/* Total label above bar */}
                <div style={{
                  position: 'absolute', left: x, width: BAR_W,
                  bottom: BOT_H + barH + 4,
                  textAlign: 'center', fontSize: 11, fontWeight: 900,
                  color: 'rgb(85,90,90)', lineHeight: 1,
                }}>
                  {total}
                </div>

                {/* Stacked bar */}
                <div style={{
                  position: 'absolute', left: x, width: BAR_W, bottom: BOT_H,
                  height: barH, display: 'flex', flexDirection: 'column-reverse',
                  borderRadius: '4px 4px 0 0', overflow: 'hidden',
                }}>
                  {TYPE_ORDER.filter(t => group.typeCounts[t]).map(t => {
                    const segH = niceMax > 0 ? (group.typeCounts[t] / niceMax) * CHART_H : 0;
                    return (
                      <div key={t} title={`${t}: ${group.typeCounts[t]}`}
                        style={{ flex: group.typeCounts[t], backgroundColor: TYPE_COLORS[t], minHeight: 2,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {segH >= 13 && (
                          <span style={{ color: t === 'PUMI' ? '#555A5A' : 'white', fontSize: 8, fontWeight: 800, lineHeight: 1 }}>
                            {group.typeCounts[t]}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Soll dashed line (only in Monat mode) */}
                {sollH !== null && (
                  <div style={{
                    position: 'absolute', left: x - 3, width: BAR_W + 6,
                    bottom: BOT_H + sollH,
                    borderTop: `2px dashed ${meets ? '#22c55e' : '#ef4444'}`,
                    zIndex: 5,
                  }} />
                )}

                {/* X label */}
                <div style={{
                  position: 'absolute', left: x, width: BAR_W,
                  bottom: soll > 0 ? 16 : 6, textAlign: 'center',
                  fontSize: 9, color: '#9ca3af', lineHeight: 1.3,
                  whiteSpace: 'nowrap', overflow: 'hidden',
                }}>
                  {key}
                </div>

                {/* Soll badge (only in Monat mode) */}
                {soll > 0 && (
                  <div style={{
                    position: 'absolute', left: x, width: BAR_W, bottom: 2,
                    textAlign: 'center', fontSize: 8, fontWeight: 700, lineHeight: 1,
                    color: meets ? '#22c55e' : '#ef4444',
                  }}>
                    Soll {soll} {meets ? '✓' : '✗'}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── FertigDetailModal ──────────────────────────────────────────────────────

const FertigDetailModal = ({ machine, onClose, onUpdateDate, onReactivate, areas }) => {
  const { addToast } = useToast();
  const [fertigDate, setFertigDate]       = useState(machine.fertigstellung || '');
  const [savingDate, setSavingDate]       = useState(false);
  const [showReactivate, setShowReactivate] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [reactivating, setReactivating]   = useState(false);

  const allSlots = areas.flatMap(area =>
    area.slots.map(slot => ({
      areaId:   area.id,
      areaName: area.name,
      slotId:   slot.id,
      slotName: slot.slotName,
      occupied: slot.occupied,
    }))
  );
  const selectedSlot = allSlots.find(s => String(s.slotId) === selectedSlotId) || null;

  const handleSaveDate = async () => {
    setSavingDate(true);
    const { error } = await supabase.from('machines').update({ fertigstellung: fertigDate }).eq('id', machine.id);
    if (error) {
      addToast('Fehler beim Speichern des Datums', 'error');
    } else {
      onUpdateDate(machine.id, fertigDate);
      addToast('Fertigstelldatum aktualisiert', 'success');
    }
    setSavingDate(false);
  };

  const handleReactivate = async () => {
    if (!selectedSlot || selectedSlot.occupied) return;
    setReactivating(true);
    try {
      const { error: mErr } = await supabase.from('machines').update({
        status:         'in_progress',
        area:           selectedSlot.areaName,
        position:       selectedSlot.slotName,
        area_id:        selectedSlot.areaId,
        fertigstellung: null,
      }).eq('id', machine.id);
      if (mErr) throw mErr;

      const { error: sErr } = await supabase.from('area_slots')
        .update({ occupied: true })
        .eq('id', selectedSlot.slotId);
      if (sErr) throw sErr;

      // Fetch full machine with relations so it can be added to the board
      const { data: freshData } = await supabase.from('machines')
        .select('*, sequenzen(*), kommentare(*), dateien(*), machine_tags(*), maengel(*)')
        .eq('id', machine.id)
        .single();

      onReactivate(machine.id, freshData, selectedSlot);
      addToast('Maschine wurde reaktiviert!', 'success');
      onClose();
    } catch {
      addToast('Fehler beim Reaktivieren', 'error');
    } finally {
      setReactivating(false);
    }
  };

  const typeColor = TYPE_COLORS[machine.Typ] || '#e2e8f0';
  const isYellow  = machine.Typ === 'PUMI';
  const inputCls  = "w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[rgb(255,204,0)] focus:bg-white transition";

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[9999] p-4">
      <div className="bg-[rgb(245,246,248)] rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-[rgb(70,75,82)] px-6 py-4 flex items-center justify-between flex-shrink-0 rounded-t-2xl">
          <div>
            <span className="font-bold rounded-full text-xs px-2 py-0.5 leading-tight"
              style={{ backgroundColor: typeColor, color: isYellow ? '#555A5A' : 'white' }}>
              {machine.Typ}{machine.Typ_Bezeichnung ? ' ' + machine.Typ_Bezeichnung : ''}
            </span>
            <h2 className="text-white font-bold text-lg leading-tight mt-1">{machine.kunde || '—'}</h2>
            <p className="text-white/50 text-xs">{machine.kNummer}</p>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white transition cursor-pointer ml-4 flex-shrink-0">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-4 overflow-y-auto">

          {/* Fertigstelldatum */}
          <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1">
              Fertigstelldatum ändern
            </h3>
            <div className="flex gap-2">
              <input
                type="date"
                className={inputCls}
                value={fertigDate}
                onChange={e => setFertigDate(e.target.value)}
              />
              <button
                onClick={handleSaveDate}
                disabled={savingDate || fertigDate === machine.fertigstellung}
                className="px-4 py-2 rounded-lg bg-[rgb(255,204,0)] text-[rgb(40,44,48)] text-sm font-bold hover:brightness-95 transition cursor-pointer disabled:opacity-50 flex-shrink-0"
              >
                {savingDate ? '…' : 'Speichern'}
              </button>
            </div>
          </div>

          {/* Reaktivieren */}
          <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1">
              Maschine reaktivieren
            </h3>
            {!showReactivate ? (
              <button
                onClick={() => setShowReactivate(true)}
                className="w-full py-2.5 rounded-lg bg-[rgb(70,75,82)] text-white text-sm font-semibold hover:bg-[rgb(85,90,90)] transition cursor-pointer"
              >
                Auf Shopfloor zurücklegen
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-gray-400">Wähle einen freien Stellplatz:</p>
                <select
                  className={inputCls}
                  value={selectedSlotId}
                  onChange={e => setSelectedSlotId(e.target.value)}
                >
                  <option value="">— Stellplatz wählen —</option>
                  {areas.map(area => (
                    <optgroup key={area.id} label={area.name}>
                      {area.slots.map(slot => (
                        <option key={slot.id} value={slot.id} disabled={!!slot.occupied}>
                          {slot.slotName} {slot.occupied ? '(Belegt)' : '(Frei)'}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowReactivate(false); setSelectedSlotId(''); }}
                    className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition cursor-pointer"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleReactivate}
                    disabled={!selectedSlot || selectedSlot.occupied || reactivating}
                    className="flex-1 py-2 rounded-lg bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition cursor-pointer disabled:opacity-50"
                  >
                    {reactivating ? 'Reaktiviere…' : 'Bestätigen'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white px-6 py-3.5 border-t border-gray-100 flex justify-end rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition cursor-pointer"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// ── Main ───────────────────────────────────────────────────────────────────

const FertigeMaschinen = ({ globalTags, setGlobalTags, areas, setAreas, machinelist, setmachinelist }) => {
  const [machines, setMachines]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [mode, setMode]                   = useState('kw');
  const [view, setView]                   = useState('karten');
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [sollValues, setSollValues]       = useState({});

  // Load fertig machines
  useEffect(() => {
    supabase.from('machines').select('*, machine_tags(*)')
      .eq('status', 'fertig')
      .order('fertigstellung', { ascending: true })
      .then(({ data }) => {
        if (data) setMachines(data.map(m => ({ ...m, Tags: m.machine_tags?.map(mt => mt.tag_id) || [] })));
        setLoading(false);
      });
  }, []);

  // Load soll values from Supabase (table: soll_ziele, columns: key text PK, value int)
  useEffect(() => {
    supabase.from('soll_ziele').select('key, value').then(({ data }) => {
      if (data) {
        const obj = {};
        data.forEach(({ key, value }) => { obj[key] = value; });
        setSollValues(obj);
      }
    });
  }, []);

  const updateSoll = async (key, val) => {
    const value = Math.max(0, parseInt(val) || 0);
    setSollValues(prev => ({ ...prev, [key]: value }));
    await supabase.from('soll_ziele').upsert({ key, value }, { onConflict: 'key' });
  };

  // Build groups
  const groups = {};
  machines.forEach(m => {
    const { key, sortKey } = getGroupKey(m.fertigstellung, mode);
    if (!groups[key]) groups[key] = { machines: [], sortKey, typeCounts: {} };
    groups[key].machines.push(m);
    const typ = m.Typ || 'Sonstige';
    groups[key].typeCounts[typ] = (groups[key].typeCounts[typ] || 0) + 1;
  });

  // Ascending sort — lowest KW / oldest month / earliest year first (left to right)
  const sortedKeys = Object.entries(groups)
    .sort((a, b) => a[1].sortKey.localeCompare(b[1].sortKey))
    .map(([key]) => key);

  const exportToCSV = () => {
    const sep = ';';
    const headers = ['Gruppe', 'Typ', 'Typ-Bezeichnung', 'Kunde', 'K-Nummer', 'WLW', 'Fertigstellung'];
    const rows = sortedKeys.flatMap(key =>
      groups[key].machines.map(m =>
        [key, m.Typ||'', m.Typ_Bezeichnung||'', m.kunde||'', m.kNummer||'', m.WLW||'', m.fertigstellung||''].join(sep)
      )
    );
    const csv = '\ufeff' + [headers.join(sep), ...rows].join('\n');
    const url  = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a    = Object.assign(document.createElement('a'), { href: url, download: `fertige-maschinen-${new Date().toISOString().split('T')[0]}.csv` });
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpdateDate = (machineId, newDate) => {
    setMachines(prev => prev.map(m => m.id === machineId ? { ...m, fertigstellung: newDate } : m));
    if (selectedMachine?.id === machineId) setSelectedMachine(prev => ({ ...prev, fertigstellung: newDate }));
  };

  const handleReactivate = (machineId, freshData, slot) => {
    setMachines(prev => prev.filter(m => m.id !== machineId));
    if (setmachinelist && freshData) {
      setmachinelist(prev => [...prev, { ...freshData, Tags: freshData.machine_tags?.map(mt => mt.tag_id) || [] }]);
    }
    setAreas(prev => prev.map(area =>
      area.id === slot.areaId
        ? { ...area, slots: area.slots.map(s => s.id === slot.slotId ? { ...s, occupied: true } : s) }
        : area
    ));
  };

  if (loading) return <div className="p-8 text-center text-gray-400 text-sm">Lade fertige Maschinen…</div>;

  return (
    <div className="h-full flex flex-col overflow-hidden">

      {/* ── Toolbar ── */}
      <div className="px-3 py-2 flex items-center gap-3 flex-shrink-0 flex-wrap border-b border-gray-200 bg-white/60">
        <h1 className="text-sm font-extrabold text-[rgb(85,90,90)]">Fertige Maschinen</h1>
        <div className="flex items-center gap-1 bg-[rgb(70,75,82)] text-[rgb(255,204,0)] px-2 py-0.5 rounded-lg">
          <span className="font-black text-base leading-none">Σ</span>
          <span className="font-extrabold text-sm leading-none">{machines.length}</span>
        </div>

        {/* Group mode */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          {[['kw','KW'],['monat','Monat'],['jahr','Jahr']].map(([m, label]) => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-3 py-0.5 text-xs font-semibold transition cursor-pointer ${
                mode === m ? 'bg-[rgb(70,75,82)] text-white' : 'bg-white text-[rgb(85,90,90)] hover:bg-gray-50'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <button onClick={() => setView('karten')}
            className={`flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold transition cursor-pointer ${
              view === 'karten' ? 'bg-[rgb(70,75,82)] text-white' : 'bg-white text-[rgb(85,90,90)] hover:bg-gray-50'
            }`}>
            <LayoutGrid size={10} />Karten
          </button>
          <button onClick={() => setView('diagramm')}
            className={`flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold transition cursor-pointer ${
              view === 'diagramm' ? 'bg-[rgb(70,75,82)] text-white' : 'bg-white text-[rgb(85,90,90)] hover:bg-gray-50'
            }`}>
            <BarChart2 size={10} />Diagramm
          </button>
        </div>

        {/* Export */}
        <button onClick={exportToCSV}
          className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-[rgb(85,90,90)] shadow-sm hover:bg-gray-50 transition cursor-pointer">
          <FileDown size={11} />Export Excel
        </button>
      </div>

      {/* ── Content ── */}
      {machines.length === 0 ? (
        <div className="p-8 text-center text-gray-400 text-sm">Noch keine fertigen Maschinen.</div>
      ) : view === 'diagramm' ? (
        <ChartView sortedKeys={sortedKeys} groups={groups} sollValues={sollValues} mode={mode} />
      ) : (
        /* ── Karten view ── */
        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-2 min-h-0">
          <div className="flex gap-3 px-3 pt-3 h-full" style={{ width: 'max-content' }}>
            {sortedKeys.map(key => {
              const group       = groups[key];
              const typeEntries = TYPE_ORDER.filter(t => group.typeCounts[t]);
              const soll        = mode === 'monat' ? (sollValues[key] || 0) : 0;
              const meets       = soll > 0 && group.machines.length >= soll;
              return (
                <div key={key} className="flex flex-col h-full" style={{ width: 150 }}>

                  {/* Column header */}
                  <div className="bg-[rgb(70,75,82)] rounded-lg px-2 py-2 flex-shrink-0 mb-2">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-white font-bold text-xs truncate">{key}</span>
                      <div className="flex items-center gap-0.5 flex-shrink-0 bg-[rgb(255,204,0)]/20 rounded px-1 py-0.5">
                        <span className="text-[rgb(255,204,0)] font-black text-xs leading-none">Σ</span>
                        <span className="text-[rgb(255,204,0)] font-extrabold text-xs leading-none">{group.machines.length}</span>
                      </div>
                    </div>

                    {typeEntries.map(t => (
                      <div key={t} className="flex items-center justify-between gap-1 mt-0.5">
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: TYPE_COLORS[t] }} />
                          <span className="text-white/70 leading-none" style={{ fontSize: 10 }}>{t}</span>
                        </div>
                        <span className="text-white font-bold leading-none" style={{ fontSize: 10 }}>{group.typeCounts[t]}</span>
                      </div>
                    ))}

                    {/* Soll input — only visible in Monat mode */}
                    {mode === 'monat' && (
                      <div className="flex items-center gap-1.5 mt-2 pt-1.5 border-t border-white/10">
                        <span className="text-white/50 text-[9px]">Soll</span>
                        <input
                          type="number" min="0"
                          value={soll || ''}
                          onChange={e => updateSoll(key, e.target.value)}
                          className="w-10 bg-white/10 text-white text-[9px] text-center rounded px-1 py-0.5 outline-none placeholder-white/30 [appearance:textfield]"
                          placeholder="—"
                        />
                        {soll > 0 && (
                          <span className={`text-[9px] font-bold ml-auto ${meets ? 'text-green-400' : 'text-red-400'}`}>
                            {meets ? '✓' : `${group.machines.length - soll}`}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Cards */}
                  <div className="flex-1 overflow-y-auto flex flex-col gap-2 min-h-0">
                    {group.machines.map(m => (
                      <FertigCard key={m.id} machine={m} globalTags={globalTags}
                        onClick={() => setSelectedMachine(m)} />
                    ))}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedMachine && (
        <FertigDetailModal
          machine={selectedMachine}
          onClose={() => setSelectedMachine(null)}
          onUpdateDate={handleUpdateDate}
          onReactivate={handleReactivate}
          areas={areas}
        />
      )}
    </div>
  );
};

export default FertigeMaschinen;
