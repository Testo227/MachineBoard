import React, { useState } from 'react';
import '../styles/style.css';
import Modal from './Modal';

const Card = ({
  areas,
  setAreas,
  currentmachine,
  machinelist,
  setmachinelist
}) => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {isOpen && (
        <Modal 
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          areas={areas}
          setAreas={setAreas}
          currentmachine={currentmachine}
          machinelist={machinelist}
          setmachinelist={setmachinelist}
        />
      )}

      <div className="bg-[rgb(85,90,90)] rounded-lg text-[rgb(85,90,90)] flex flex-col gap-2 p-2">
        <div className="flex gap-3 bg-white items-center">
          <div className="w-40">{currentmachine.Typ}</div>
          <button 
            onClick={() => setIsOpen(true)} 
            className="bg-white text-[rgb(85,90,90)] font-extrabold rounded w-6 h-6"
          >
            ⤢
          </button>
        </div>

        <div>
          <div className="bg-white">{currentmachine.kunde}</div>
          <div className="bg-white">{currentmachine.kNummer}</div>
        </div>

        <div className="text-xs">
          <div className="bg-white flex">
            <div>Start</div>
            <div>{currentmachine.Start}</div>
          </div>
          <div className="bg-white flex">
            <div>Ende</div>
            <div>{currentmachine.Ende}</div>
          </div>
          <div className="bg-white flex">
            <div>Tags</div>
            <div className="text-right">{currentmachine.Tags}</div>
          </div>
          <div className="bg-white flex">
            <div>Fehler</div>
            <div>{17}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;