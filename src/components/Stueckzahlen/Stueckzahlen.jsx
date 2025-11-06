import React from "react";

const Stueckzahlen = ({ areas }) => {
  // --- Hilfsfunktionen --------------------------------------------------
  const getISOWeek = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    // Donnerstag als Referenz
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return weekNo;
  };

  const getWeeksSplitByMonth = (endYear, endMonth) => {
    const result = [];
    const current = new Date();
    current.setDate(current.getDate() - current.getDay() + 1); // Montag der aktuellen Woche

    while (current.getFullYear() < endYear || (current.getFullYear() === endYear && current.getMonth() <= endMonth)) {
      const start = new Date(current);
      const end = new Date(current);
      end.setDate(start.getDate() + 6);

      const week = getISOWeek(start);
      const startMonth = start.getMonth();
      const endMonthIdx = end.getMonth();

      // Falls KW überlappt → splitte
      if (startMonth !== endMonthIdx) {
        // Teil 1
        const lastDayOfStartMonth = new Date(start.getFullYear(), startMonth + 1, 0);
        result.push({
          week,
          month: startMonth,
          until: lastDayOfStartMonth,
        });
        // Teil 2
        result.push({
          week,
          month: endMonthIdx,
          until: end,
        });
      } else {
        result.push({
          week,
          month: startMonth,
          until: end,
        });
      }

      // Gehe zur nächsten Woche
      current.setDate(current.getDate() + 7);
    }

    return result;
  };

  // --- Wochen und Monate generieren -------------------------------------
  const weeks = getWeeksSplitByMonth(2026, 5);
  const monthNames = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
  ];

  // --- Tabelle rendern --------------------------------------------------
  return (
    <div className="flex">
      {/* Fixierte Bereichs-Spalte */}
      <div className="sticky left-0 top-0 bg-white z-30 border-r border-gray-300">
        <table className="border-collapse border border-gray-300 text-xs">
          <thead>
            <tr>
              <th
                rowSpan="3"
                className="border border-gray-300 bg-gray-200 px-3 py-2 min-w-[150px] text-left"
              >
                Bereich
              </th>
            </tr>
          </thead>
          <tbody>
            {areas.map((area) => (
              <tr key={area.id}>
                <td className="border border-gray-300 bg-gray-50 px-3 py-1 min-w-[150px]">
                  {area.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Scrollbarer Bereich */}
      <div className="overflow-x-auto">
        <div className="min-w-max">
          <table className="border-collapse border border-gray-300 text-xs">
            <thead>
              {/* Ebene 1 */}
              <tr>
                {weeks.map((w, i) => {
                  const nextWeek = weeks[i + 1];
                  const isMonthEnd = !nextWeek || nextWeek.month !== w.month;
                  return (
                    <React.Fragment key={`kw-${i}`}>
                      <th
                        colSpan="6"
                        className="border border-gray-300 bg-gray-100 text-center whitespace-nowrap"
                      >
                        KW{String(w.week).padStart(2, "0")} (bis{" "}
                        {w.until.getDate().toString().padStart(2, "0")}.
                        {String(w.until.getMonth() + 1).padStart(2, "0")})
                      </th>

                      {isMonthEnd && (
                        <th
                          colSpan="6"
                          className="border border-gray-300 bg-yellow-100 text-center"
                        >
                          {monthNames[w.month]}
                        </th>
                      )}
                    </React.Fragment>
                  );
                })}
              </tr>

              {/* Ebene 2 */}
              <tr>
                {weeks.map((w, i) => {
                  const nextWeek = weeks[i + 1];
                  const isMonthEnd = !nextWeek || nextWeek.month !== w.month;
                  return (
                    <React.Fragment key={`lvl2-${i}`}>
                      <th colSpan="3" className="border border-gray-300 bg-gray-50">Start</th>
                      <th colSpan="3" className="border border-gray-300 bg-gray-50">Ende</th>

                      {isMonthEnd && (
                        <>
                          <th colSpan="3" className="border border-gray-300 bg-gray-50">Start</th>
                          <th colSpan="3" className="border border-gray-300 bg-gray-50">Ende</th>
                        </>
                      )}
                    </React.Fragment>
                  );
                })}
              </tr>

              {/* Ebene 3 */}
              <tr>
                {weeks.map((w, i) => {
                  const nextWeek = weeks[i + 1];
                  const isMonthEnd = !nextWeek || nextWeek.month !== w.month;
                  return (
                    <React.Fragment key={`lvl3-${i}`}>
                      <th className="border border-gray-300 bg-white px-2 py-1">Plan</th>
                      <th className="border border-gray-300 bg-white px-2 py-1">Ist</th>
                      <th className="border border-gray-300 bg-white px-2 py-1">∆</th>
                      <th className="border border-gray-300 bg-white px-2 py-1">Plan</th>
                      <th className="border border-gray-300 bg-white px-2 py-1">Ist</th>
                      <th className="border border-gray-300 bg-white px-2 py-1">∆</th>

                      {isMonthEnd && (
                        <>
                          <th className="border border-gray-300 bg-yellow-50 px-2 py-1">Plan</th>
                          <th className="border border-gray-300 bg-yellow-50 px-2 py-1">Ist</th>
                          <th className="border border-gray-300 bg-yellow-50 px-2 py-1">∆</th>
                          <th className="border border-gray-300 bg-yellow-50 px-2 py-1">Plan</th>
                          <th className="border border-gray-300 bg-yellow-50 px-2 py-1">Ist</th>
                          <th className="border border-gray-300 bg-yellow-50 px-2 py-1">∆</th>
                        </>
                      )}
                    </React.Fragment>
                  );
                })}
              </tr>
            </thead>

            {/* --- Body --- */}
            <tbody>
              {areas.map((area) => (
                <tr key={area.id}>
                  {weeks.map((w, i) => {
                    const nextWeek = weeks[i + 1];
                    const isMonthEnd = !nextWeek || nextWeek.month !== w.month;
                    return (
                      <React.Fragment key={`cell-${area.id}-${i}`}>
                        <td className="border border-gray-200 text-center">–</td>
                        <td className="border border-gray-200 text-center">–</td>
                        <td className="border border-gray-200 text-center">–</td>
                        <td className="border border-gray-200 text-center">–</td>
                        <td className="border border-gray-200 text-center">–</td>
                        <td className="border border-gray-200 text-center">–</td>

                        {isMonthEnd && (
                          <>
                            <td className="border border-gray-200 bg-yellow-50 text-center">–</td>
                            <td className="border border-gray-200 bg-yellow-50 text-center">–</td>
                            <td className="border border-gray-200 bg-yellow-50 text-center">–</td>
                            <td className="border border-gray-200 bg-yellow-50 text-center">–</td>
                            <td className="border border-gray-200 bg-yellow-50 text-center">–</td>
                            <td className="border border-gray-200 bg-yellow-50 text-center">–</td>
                          </>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Stueckzahlen;