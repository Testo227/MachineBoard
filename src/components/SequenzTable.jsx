import React, { useState, useEffect } from "react";
import '../styles/style.css';

const defaultBereiche = [
  "Hauptmontage",
  "Prueffeld Pumpe",
  "Prueffeld Mast",
  "Lackierung",
  "Endmontage",
  "PDI"
];

const statusOptions = ["Offen", "Laufend", "Abgeschlossen", "Abweichung"];

const SequenzTable = ({ sequenzen, onChange }) => {
  const [rows, setRows] = useState(sequenzen || []);

  useEffect(() => {
    // Immer nach Sequenz sortieren (aufsteigend oder absteigend)
    const sorted = [...rows].sort((a, b) => b.sequenz - a.sequenz);
    setRows(sorted);
  }, [sequenzen]);

  const handleFieldChange = (id, field, value) => {
    const updated = rows.map(r => (r.id === id ? { ...r, [field]: value } : r));
    setRows(updated);
    onChange(updated);
  };

  const handleAddRow = () => {
    const newRow = {
      id: Date.now(),
      sequenz: rows.length ? Math.max(...rows.map(r => r.sequenz)) + 1 : 1,
      bereich: "",
      planStart: "",
      planEnde: "",
      istStart: "",
      istEnde: "",
      status: "Offen"
    };
    const updated = [newRow, ...rows];
    setRows(updated);
    onChange(updated);
  };

  const handleDeleteRow = (id) => {
    const updated = rows.filter(r => r.id !== id);
    setRows(updated);
    onChange(updated);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[rgb(85,90,90)]">
          Sequenz-Planung
        </h3>
        <button
          onClick={handleAddRow}
          className="bg-[rgb(255,204,0)] text-[rgb(85,90,90)] px-3 py-1 rounded font-bold hover:bg-yellow-400 transition"
        >
          + Zeile
        </button>
      </div>

      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-[rgb(222,222,222)] text-[rgb(85,90,90)] font-bold">
          <tr>
            <th className="p-2 border">Sequenz</th>
            <th className="p-2 border">Bereich</th>
            <th className="p-2 border">Plan-Start</th>
            <th className="p-2 border">Plan-Ende</th>
            <th className="p-2 border">Ist-Start</th>
            <th className="p-2 border">Ist-Ende</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id} className="hover:bg-gray-100">
              <td className="p-2 border text-center">{row.sequenz}</td>
              <td className="p-2 border">
                <input
                  type="text"
                  className="w-full border border-gray-200 px-2 py-1"
                  value={row.bereich}
                  onChange={(e) => handleFieldChange(row.id, "bereich", e.target.value)}
                  list="bereiche"
                />
              </td>
              <td className="p-2 border">
                <input
                  type="date"
                  className="w-full border border-gray-200 px-2 py-1"
                  value={row.planStart}
                  onChange={(e) => handleFieldChange(row.id, "planStart", e.target.value)}
                />
              </td>
              <td className="p-2 border">
                <input
                  type="date"
                  className="w-full border border-gray-200 px-2 py-1"
                  value={row.planEnde}
                  onChange={(e) => handleFieldChange(row.id, "planEnde", e.target.value)}
                />
              </td>
              <td className="p-2 border">
                <input
                  type="date"
                  className="w-full border border-gray-200 px-2 py-1"
                  value={row.istStart}
                  onChange={(e) => handleFieldChange(row.id, "istStart", e.target.value)}
                />
              </td>
              <td className="p-2 border">
                <input
                  type="date"
                  className="w-full border border-gray-200 px-2 py-1"
                  value={row.istEnde}
                  onChange={(e) => handleFieldChange(row.id, "istEnde", e.target.value)}
                />
              </td>
              <td className="p-2 border">
                <select
                  className="w-full border border-gray-200 px-2 py-1"
                  value={row.status}
                  onChange={(e) => handleFieldChange(row.id, "status", e.target.value)}
                >
                  {statusOptions.map(opt => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </td>
              <td className="p-2 border text-center">
                <button
                  onClick={() => handleDeleteRow(row.id)}
                  className="bg-red-400 text-white px-2 py-1 rounded hover:bg-red-500 transition"
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <datalist id="bereiche">
        {defaultBereiche.map((b, i) => (
          <option key={i} value={b} />
        ))}
      </datalist>
    </div>
  );
};

export default SequenzTable;