import React from 'react';
import { useState } from 'react';

//CSS
import '../styles/style.css'


const Topbar = () => {

    const [searchValue, setSearchValue] = useState("")

    const handleSearch = (value) => setSearchValue(value);
       
            
        


    return ( 
        <div className="flex bg-[rgb(255,204,0)] h-10">
            <h1 className='text-center font-extrabold text-3xl basis-2/3 text-[rgb(85,90,90)]'>Shopfloorboard PCP</h1>
            <div className='basis-1/3 flex justify-center items-center'>
                <input className="bg-white rounded-sm " 
                    placeholder="Suchen..." 
                    type="text" 
                    value={searchValue} 
                    onChange={(e) => handleSearch(e.target.value)}>
                </input>
            </div>
            
        </div>
     );
}
 
export default Topbar;
