import React from 'react';
import { useState } from 'react';

//CSS
import '../styles/card.css'

//Components
import Modal from './Modal';


const Card = ({
    areas,
    setAreas,
    slotName,
    thisarea,
    machineid,    
    machineposition,
    currentmachine, 
    machinelist,
    setmachinelist}) => {

    const [showModal,setShowModal] = useState(true);
    const handleClick = () => {
        setShowModal(!showModal)
    }

    const [selectedSlot, setSelectedSlot] = useState("");
    
        const handleSwitch = (e) => {
        const [newAreaName, newSlotName] = e.target.value.split(":");
        setSelectedSlot(e.target.value);
    
        const targetMachine = machinelist.find(
          m => m.area === newAreaName && m.position === newSlotName
        );
    
        if (!targetMachine) {
          // 🟩 Slot ist frei → einfach verschieben
          setmachinelist(prev =>
            prev.map(m =>
              m.id === currentmachine.id
                ? { ...m, area: newAreaName, position: newSlotName }
                : m
            )
          );
    
          // 🟨 Slots updaten: alter Slot leer, neuer belegt
          setAreas(prev =>
            prev.map(area => {
              // alter Bereich → Slot frei
              if (area.name === currentmachine.area) {
                return {
                  ...area,
                  slots: area.slots.map(slot =>
                    slot.name === currentmachine.position
                      ? { ...slot, occupied: false }
                      : slot
                  )
                };
              }
              // neuer Bereich → Slot belegt
              if (area.name === newAreaName) {
                return {
                  ...area,
                  slots: area.slots.map(slot =>
                    slot.name === newSlotName
                      ? { ...slot, occupied: true }
                      : slot
                  )
                };
              }
              return area;
            })
          );
    
        } else {
          // 🟦 Slot belegt → Maschinen tauschen
          setmachinelist(prev =>
            prev.map(m => {
              if (m.id === currentmachine.id) {
                return { ...m, area: newAreaName, position: newSlotName };
              }
              if (m.id === targetMachine.id) {
                return { ...m, area: currentmachine.area, position: currentmachine.position };
              }
              return m;
            })
          );
    
          // 🔄 Beide Slots bleiben belegt → keine Änderung im occupied-Status nötig
        }
      
        setTimeout(() => handleClick(), 0); // Modal schließen nach dem Wechsel
    };
    
    const handleChange = (field, value) => {
        setmachinelist(prev =>
          prev.map(m => m.id === machineid ? { ...m, [field]: value } : m)
        );
      }
    

    return (
        <div className="card">
            
            <div className='kundeundk'>
                <input className='kunde' value={currentmachine.kunde || ""} onChange={(e) => handleChange("kunde", e.target.value)} type="text" placeholder="Kunde" />
                <input className='k' value={currentmachine.kNummer || ""} onChange={(e) => handleChange("kNummer", e.target.value)} type="text" placeholder="K-Nummer" />
            </div>
            <div className='TypundWLW'>
                <input className='Typ' value={currentmachine.Typ || ""} onChange={(e) => handleChange("Typ", e.target.value)} type="text" placeholder="Typ" />
                <input className='WLW' value={currentmachine.WLW || ""} onChange={(e) => handleChange("WLW", e.target.value)} type="number" placeholder="WLW" />
            </div>
            <div className='StartundEnde'>
                <input className='Start' value={currentmachine.Start || ""} onChange={(e) => handleChange("Start", e.target.value)} type="date"/>
                <input className='Ende' value={currentmachine.Ende || ""} onChange={(e) => handleChange("Ende", e.target.value)} type="date"/>
            </div>
            
            
    
            
            <select value={selectedSlot} onChange={handleSwitch}>
              <option value="" disabled>Bitte Slot auswählen...</option>
              {areas.map(area => (
              <optgroup key={area.id} label={area.name}>
                {area.slots.map(slot => (
                  <option
                    key={slot.id}
                    value={`${area.name}:${slot.slotName}`}
                  >
                    {slot.slotName}
                  </option>
                ))}
              </optgroup>
                ))}
            </select>



            <button onClick={handleClick} >⤢</button>
        
        </div>
        
        
     );
}
 
export default Card;