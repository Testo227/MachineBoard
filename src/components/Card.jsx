import React, { useState, useEffect } from 'react';
import '../styles/style.css';
import Modal from './Modal';
import TagCircles from './TagCircles';
import { Settings } from 'lucide-react';

const Card = ({
  areas,
  setAreas,
  currentMachine,
  machinelist,
  setmachinelist,
  setFinishedMachines,
  finishedMachines,
  globalTags,
  setGlobalTags,
  dimmed
}) => {

  const [isOpen, setIsOpen] = useState(false);

  const [typeColor, setTypeColor] = useState("white")
  
  useEffect(() => {
    switch (currentMachine.Typ) {
      case "BSF":
        setTypeColor("lightgreen");
        break;
      case "PUMI":
        setTypeColor("yellow");
        break;
      case "BSA":
        setTypeColor("orange");
        break;
      case "Prototyp":
        setTypeColor("lightgrey");
        break;
      case "Leerslot":
        setTypeColor("white");
        break;
      case "E-Mischer":
        setTypeColor("lightblue");
        break;
      default:
        setTypeColor("white");
    }
  }, [currentMachine.Typ]);

  return (
    <div>
      {isOpen && (
        <Modal 
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          areas={areas}
          setAreas={setAreas}
          currentmachine={currentMachine}
          machinelist={machinelist}
          setmachinelist={setmachinelist}
          setFinishedMachines={setFinishedMachines}
          finishedMachines={finishedMachines}
          globalTags={globalTags}
          setGlobalTags={setGlobalTags}
        />
      )}

      
      {currentMachine.Typ !== "Leerslot" &&( 
      <div  style={{opacity: dimmed ? 0.3 : 1, pointerEvents: dimmed ? 'none' : 'auto'}} className="bg-white shadow-sm rounded-lg text-[rgb(85,90,90)] flex flex-col p-2 gap-1 my-[6px] mx-[6px]">
         
          <div
            className="text-center w-[60%] absolute top-[17px] left-1/2 -translate-x-1/2 px-3 py-1 rounded-xl text-[7px] font-bold shadow-md"
            style={{ backgroundColor: typeColor }}
            >
            {currentMachine.Typ || currentMachine.Typ_Bezeichnung 
            ? `${currentMachine.Typ || ""} ${currentMachine.Typ_Bezeichnung || ""}`.trim()
            : "kein Typ"}
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="
              group
              absolute top-[18px] right-[-1px]
              bg-[rgb(85,90,90)]
              rounded-full w-5 h-5
              flex items-center justify-center
              shadow-lg border-2 border-[rgb(85,90,90)]
              transition-all duration-200 ease-out
              hover:bg-[rgb(255,204,0)]
              hover:scale-110
              hover:border-[rgb(255,204,0)]
            "
          >
            <Settings
              size={12}
              className="
                text-white
                transition-all duration-200
                group-hover:text-[rgb(85,90,90)] cursor-pointer
              "
            />
          </button>
         
        
        <div className="text-xs font-bold text-center bg-white rounded-xs ">{currentMachine.kunde || "Leer"}</div>
        <div className="text-xs font-bold text-center bg-white rounded-xs ">{currentMachine.kNummer || "Leer" }</div>
        <div className="grid grid-cols-[30px_82px] grid-rows-[15px_15px] gap-1">
          {["IstStart", "IstEnde"].map((field) => {
            const showRow = currentMachine.sequenzen?.find(seq => seq.showOnCard);
            const raw = showRow
              ? (field === "IstStart" ? showRow.istStart : showRow.istEnde) || "-"
              : "-";

            // Datum formatieren: Mo-01.02.
            let formattedDate = "-";
            if (raw !== "-") {
              const d = new Date(raw);
              const weekday = d.toLocaleDateString("de-DE", { weekday: "short" })
                .replace(".", "")
                .slice(0, 2);
              const day = String(d.getDate()).padStart(2, "0");
              const month = String(d.getMonth() + 1).padStart(2, "0");
              formattedDate = `${weekday}-${day}.${month}.`;
            }

            return (
              <React.Fragment key={field}>
                {/* Feld-Name */}
                <div className="text-left text-[10px] bg-white rounded-xs px-1 py-1 flex items-center justify-start text-[rgb(85,90,90)] font-bold">
                  {field === "IstStart" ? "Start:" : "Ende:"}
                </div>

                {/* Datum */}
                <div className="text-[10px] font-bold bg-white rounded-xs px-2 py-1 flex items-center justify-center text-[rgb(85,90,90)]">
                  {formattedDate}
                </div>
              </React.Fragment>
            );
          })}
        </div>
          <TagCircles tags={currentMachine.Tags} globalTags={globalTags}></TagCircles>
      </div>
      )}
      
      {currentMachine.Typ === "Leerslot" &&( 
      <div style={{opacity: dimmed ? 0.3 : 1, pointerEvents: dimmed ? 'none' : 'auto'}} className="flex flex-row-reverse bg-[rgb(85,90,90)] rounded-lg text-[rgb(85,90,90)] flex flex-col p-2 gap-0.5 my-[2px] mx-[4px] w-38 h-34">
          <button 
              onClick={() => setIsOpen(true)} 
              className="bg-[rgb(255,204,0)] text-[rgb(85,90,90)] font-extrabold rounded w-5 h-4 hover:cursor-pointer hover:rgba(92, 80, 33, 1)"
            >
              ^
            </button>
         
         <div className='flex justify-center items-center gap-0.5 my-[20px] mx-[10px]'>
          <span className="rotate-[45deg] text-xl font-bold  text-[rgb(255,204,0)]">
            Leerslot
          </span>

          
        </div> 
        
      </div>
      )}


    </div>
  );
};

export default Card;