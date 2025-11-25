import React, { useState, useEffect } from "react";
import '../styles/style.css';



const statusOptions = ["Offen", "Laufend", "Abgeschlossen"];

const SequenzTable = ({ sequenzen, onChange }) => {
  const [rows, setRows] = useState(sequenzen || []);

  useEffect(() => {
  if (sequenzen && Array.isArray(sequenzen)) {
    setRows([...sequenzen].sort((a, b) => a.sequenz - b.sequenz));
    }
  }, [sequenzen]);


  const handleFieldChange = (id, field, value) => {
    const updated = rows.map(r => {
      if (r.id === id) {
        const updatedRow = { ...r, [field]: value };

        // DLZ-Plan berechnen
        if (updatedRow.planStart && updatedRow.planEnde) {
          updatedRow.DLZPlan = calculateWorkdays(updatedRow.planStart, updatedRow.planEnde);
        } else {
          updatedRow.DLZPlan = "";
        }

        // DLZ-Ist berechnen
        if (updatedRow.istStart && updatedRow.istEnde) {
          updatedRow.DLZIst = calculateWorkdays(updatedRow.istStart, updatedRow.istEnde);
        } else {
          updatedRow.DLZIst = "";
        }

        return updatedRow;
      }
      return r;
    });

    setRows(updated);
    onChange(updated);
  };

  // Hilfsfunktion: Arbeitstage zwischen zwei Daten (Mo-Fr) zählen
  const calculateWorkdays = (startStr, endStr) => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    if (start > end) return 0;

    let workdays = 0;
    const cur = new Date(start);
    while (cur <= end) {
      const day = cur.getDay();
      if (day !== 0 && day !== 6) workdays++; // nur Mo-Fr
      cur.setDate(cur.getDate() + 1);
    }
    return workdays;
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
      status: "Offen",
      DLZPlan: "",
      DLZIst: "",
      showOnCard: false
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
    <div className="flex flex-col h-[350px] rounded overflow-hidden">
      <div className="flex justify-between items-center bg-white px-2 py-2 border-b border-gray-300 flex-shrink-0 sticky top-0 z-20">
        <h3 className="text-[rgb(85,90,90)] text-sm font-medium">
          Sequenz-Planung
        </h3>
        <button
          onClick={handleAddRow}
          className="cursor-pointer bg-[rgb(255,204,0)] text-[rgb(85,90,90)] px-3 py-1 rounded font-bold hover:bg-yellow-400 transition"
        >
          + Zeile
        </button>
      </div>
      <div className="overflow-y-auto flex-1">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-[rgb(255,204,0)] text-[rgb(85,90,90)] font-bold sticky top-0 z-10">
          <tr>
            <th className="p-2 border">Sequ</th>
            <th className="p-2 border">Bereich</th>
            <th className="p-2 border">Plan-Start</th>
            <th className="p-2 border">Plan-Ende</th>
            <th className="p-2 border">DLZ-Plan</th>
            <th className="p-2 border">Ist-Start</th>
            <th className="p-2 border">Ist-Ende</th>
            <th className="p-2 border">DLZ-Ist</th>
            <th className="p-2 border">Start-Abw</th>
            <th className="p-2 border">End-Abw</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Auf Karte</th>
            <th className="p-2 border">X</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => {
            // 🔧 Hilfsfunktion: Arbeitstage zwischen zwei Daten zählen (ohne Wochenende)
            const getWorkdayDiff = (plan, ist) => {
              if (!plan || !ist) return "";
              const start = new Date(plan);
              const end = new Date(ist);

              if (start.getTime() === end.getTime()) return "0";

              const forward = end > start; // true = später, false = früher
              let diff = 0;
              let cur = new Date(Math.min(start, end));

              while (cur <= new Date(Math.max(start, end))) {
                const day = cur.getDay();
                if (day !== 0 && day !== 6) diff++; // Nur Werktage zählen
                cur.setDate(cur.getDate() + 1);
              }

  const days = diff - 1; // Starttag doppelt gezählt
  return forward ? `+${days}` : `-${days}`;
              };

            const startAbw = getWorkdayDiff(row.planStart, row.istStart);
            const endAbw = getWorkdayDiff(row.planEnde, row.istEnde);

            return (
              <tr key={row.id} className="hover:bg-gray-100">
                <td className="p-2 border text-center w-10">
                  <input
                    type="text"
                    className="w-full border border-gray-200 px-2 py-1"
                    value={row.sequenz}
                    onChange={(e) => handleFieldChange(row.id, "sequenz", e.target.value)}
                  />
                </td>
                <td className="p-2 border w-40">
                  <input
                    type="text"
                    list={`bereiche-${row.id}`} // eindeutige ID, damit jede Zeile ihr eigenes Datalist hat
                    className="w-full border border-gray-200 px-2 py-1"
                    value={row.bereich}
                    onChange={(e) => handleFieldChange(row.id, "bereich", e.target.value)}
                    placeholder="Bereich wählen oder eingeben..."
                  />
                  <datalist id={`bereiche-${row.id}`}>
                    <option value="PPM1" />
                    <option value="PPM2" />
                    <option value="PUMI" />
                    <option value="Dock" />
                    <option value="Prüffeld Pumpe" />
                    <option value="Prüffeld Mast" />
                    <option value="Lackierung" />
                    <option value="Endmontage" />
                    <option value="PDI" />
                    <option value="Konservieren" />
                    <option value="Optimieren" />
                    <option value="BSA Linie" />
                    <option value="BSA Dock" />
                  </datalist>
                </td>
                <td className="p-2 border w-10">
                  <input
                    type="date"
                    className="w-28 border border-gray-200 px-2 py-1"
                    value={row.planStart}
                    onChange={(e) => handleFieldChange(row.id, "planStart", e.target.value)}
                  />
                </td>
                <td className="p-2 border w-10">
                  <input
                    type="date"
                    className="w-28 border border-gray-200 px-2 py-1"
                    value={row.planEnde}
                    onChange={(e) => handleFieldChange(row.id, "planEnde", e.target.value)}
                  />
                </td>
                <td className="p-2 border text-center w-10">
                  {row.DLZPlan}
                </td>
                <td className="p-2 border w-10">
                  <input
                    type="date"
                    className="w-28 border border-gray-200 px-2 py-1"
                    value={row.istStart}
                    onChange={(e) => handleFieldChange(row.id, "istStart", e.target.value)}
                  />
                </td>
                <td className="p-2 border w-10">
                  <input
                    type="date"
                    className="w-28 border border-gray-200 px-2 py-1"
                    value={row.istEnde}
                    onChange={(e) => handleFieldChange(row.id, "istEnde", e.target.value)}
                  />
                </td>
                <td className="p-2 border text-center w-10">
                  {row.DLZIst}
                </td>

                {/* Start-Abweichung */}
                <td className="p-2 border text-center w-10">
                  {(() => {
                    const diff = getWorkdayDiff(row.planStart, row.istStart);
                    const color =
                      diff.startsWith("+") ? "text-red-600 font-semibold" :
                      diff.startsWith("-") ? "text-green-600 font-semibold" :
                      "text-gray-800";
                    return <span className={color}>{diff}</span>;
                  })()}
                </td>

                {/* End-Abweichung */}
                <td className="p-2 border text-center w-10">
                  {(() => {
                    const diff = getWorkdayDiff(row.planEnde, row.istEnde);
                    const color =
                      diff.startsWith("+") ? "text-red-600 font-semibold" :
                      diff.startsWith("-") ? "text-green-600 font-semibold" :
                      "text-gray-800";
                    return <span className={color}>{diff}</span>;
                  })()}
                </td>

                {/* 🚦 Status-Ampel */}
                <td className="p-2 border w-25">
                  <div className="flex justify-center items-center gap-2">
                    {["Offen", "Laufend", "Abgeschlossen"].map((status) => {
                      const colorMap = {
                        Offen: "bg-red-500",
                        Laufend: "bg-yellow-400",
                        Abgeschlossen: "bg-green-500",
                      };
                      const isActive = row.status === status;

                      return (
                        <button
                          key={status}
                          onClick={() => {
                            if (row.status !== status) {
                              const confirmChange = window.confirm(
                                `Willst du den Status wirklich auf "${status}" ändern?`
                              );
                              if (confirmChange) {
                                const updatedRow = { ...row, status };
                                const today = new Date().toISOString().split("T")[0];

                                if (status === "Laufend" && !row.istStart) {
                                  updatedRow.istStart = today;
                                }
                                if (status === "Abgeschlossen" && !row.istEnde) {
                                  updatedRow.istEnde = today;
                                }

                                const updatedRows = rows.map(r =>
                                  r.id === row.id ? updatedRow : r
                                );
                                setRows(updatedRows);
                                onChange(updatedRows);
                              }
                            }
                          }}
                          className={`
                            w-5 h-5 rounded-full border-2 border-gray-400
                            transition-all duration-200
                            ${isActive ? colorMap[status] : "bg-white"}
                            hover:scale-110
                          `}
                          title={status}
                        />
                      );
                    })}
                  </div>
                </td>
                <td className="p-2 border text-center w-10">
                  <input
                    type="checkbox"
                    checked={row.showOnCard || false}
                    onChange={(e) => {
                      const updatedRows = rows.map(r => ({
                        ...r,
                        showOnCard: r.id === row.id ? e.target.checked : false, // nur diese Zeile markieren
                      }));
                      setRows(updatedRows);
                      onChange(updatedRows);
                    }}
                  />
                </td>
                {/* 🗑 Löschen */}
                <td className="p-2 border text-center">
                  <button
                    onClick={() => handleDeleteRow(row.id)}
                    className="bg-red-400 text-white px-2 py-1 rounded hover:bg-red-500 transition"
                  >
                    X
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default SequenzTable;