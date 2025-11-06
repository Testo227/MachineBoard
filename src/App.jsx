import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import MainBoard from './components/MainBoard';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Stueckzahlen from './components/Stueckzahlen/Stueckzahlen';

// CSS
import './styles/style.css';


const App = () => {
  const [foldSidebar, setFoldSidebar] = useState(true);

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
          Typ_Bezeichnung:"", 
          WLW:24, 
          Tags:[1, 7], 
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
                  status: "Offen", 
                  DLZIst: "",
                  DLZPlan: ""
              }
          ],
          
      },
      {id:2, 
          machine:"Machine 1", 
          position:"Pos 7", 
          kunde: "Firma A", 
          kNummer: "K123", 
          Start: "2023-10-01", 
          Ende: "2023-10-01", 
          area: "PPM1-Line", 
          Typ:"BSF", 
          Typ_Bezeichnung:"", 
          WLW:24, 
          Tags:[1, 7], 
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
                  status: "Offen", 
                  DLZIst: "",
                  DLZPlan: ""
              }
          ],
          
      },
      {id:3, 
          machine:"Machine 1", 
          position:"Pos 2", 
          kunde: "Firma A", 
          kNummer: "K123", 
          Start: "2023-10-01", 
          Ende: "2023-10-01", 
          area: "PPM2-Line", 
          Typ:"PUMI", 
          Typ_Bezeichnung:"", 
          WLW:24, 
          Tags:[1, 7], 
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
                  status: "Offen", 
                  DLZIst: "",
                  DLZPlan: ""
              }
          ],
          
      }
    ])

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
            { id: 16, slotName: "Pos 7", occupied: true },
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
            { id: 45, slotName: "Pos 2", occupied: true },
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


  //Filter State
  const [filters, setFilters] = useState({
    Search: "",
    Tags: [],
    Typ: "",
    TypBezeichung: "",
    wlw: "",
    date:{from:"", till:""}
  })

  return (
    <Router>
      <div className='flex'>
        {/* Sidebar unverändert */}
        <div className="fixed top-0 left-0 h-full z-20">
          <Sidebar foldSidebar={foldSidebar} setFoldSidebar={setFoldSidebar} />
        </div>

        {/* Main content */}
        <div className={`flex flex-col flex-1 transition-all duration-300 ${foldSidebar ? "ml-[220px]" : "ml-[80px]"}`}>
          
          {/* Topbar unverändert */}
          <div className={`fixed top-0 right-0 z-10 transition-all duration-300 ${foldSidebar ? "left-[220px]" : "left-[80px]"}`}>
            <Topbar filters={filters} setFilters={setFilters}  />
          </div>

          {/* Content Bereich */}
          <div className="mt-10 p-4">
            <Routes>
              {/* Standard Route */}
              <Route path="/" element={<Navigate to="/shopfloor" />} />
              
              {/* Shopfloor */}
              <Route path="/shopfloor" element={<MainBoard machinelist={machinelist} setmachinelist={setmachinelist} finishedMachines={finishedMachines} setFinishedMachines={setFinishedMachines} areas={areas} setAreas={setAreas} filters={filters}> </MainBoard>} />
              
              {/* Stückzahlen – leere Seite für jetzt */}
              <Route path="/stueckzahlen" element={<div><Stueckzahlen machinelist={machinelist} areas={areas}></Stueckzahlen></div>} />

              {/* Fehler – leere Seite */}
              <Route path="/fehler" element={<div>Fehler Seite (leer)</div>} />

              {/* Fallback */}
              <Route path="*" element={<div>Seite nicht gefunden</div>} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
