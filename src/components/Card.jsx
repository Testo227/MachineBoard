import React, { useState, useEffect } from 'react';
import '../styles/style.css';
import Modal from './Modal';

const Card = ({
  areas,
  setAreas,
  currentMachine,
  machinelist,
  setmachinelist,
  setFinishedMachines,
  finishedMachines
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
        />
      )}

      
      {currentMachine.Typ !== "Leerslot" &&( 
      <div className="bg-[rgb(85,90,90)] rounded-lg text-[rgb(85,90,90)] flex flex-col p-2 gap-0.5 my-[2px] mx-[4px]">
         <div className='flex gap-0.5'>
          <div className="flex items-center w-38 h-4">
            <div className="w-27 text-xs h-4" style={{backgroundColor: typeColor}}>
              {currentMachine.Typ} {" "}
              {currentMachine.Typ_Bezeichnung}
            </div>
          </div>
          <button 
              onClick={() => setIsOpen(true)} 
              className="bg-[rgb(255,204,0)] text-[rgb(85,90,90)] font-extrabold rounded w-5 h-4 hover:cursor-pointer hover:rgba(92, 80, 33, 1)"
            >
              ^
            </button>
        </div> 
        
        <div className="text-xm text-center bg-white">{currentMachine.kunde || "Leer"}</div>
        <div className="text-xm text-center bg-white">{currentMachine.kNummer || "Leer" }</div>
        <div className="flex text-xs gap-0.5">
          <div className='bg-white w-8'>Start{" "} </div>
          <div className='bg-white w-23'>{currentMachine.Start
            ? new Date(currentMachine.Start).toLocaleDateString("de-DE")
              : "Leer"}</div>
        </div>
        <div className="flex gap-0.5 text-xs">
          <div className='bg-white w-8'>Ende{" "}</div>
          <div className='bg-white w-23'>{currentMachine.Ende
            ? new Date(currentMachine.Start).toLocaleDateString("de-DE")
              : "Leer"}</div>
        </div>
          <div className="bg-white flex gap-0.5 text-xs">
            <div>Tags</div>
            <div>{17}</div>
          </div>
      </div>
      )}
      
      {currentMachine.Typ === "Leerslot" &&( 
      <div className="flex flex-row-reverse bg-[rgb(85,90,90)] rounded-lg text-[rgb(85,90,90)] flex flex-col p-2 gap-0.5 my-[2px] mx-[4px] w-38 h-34">
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