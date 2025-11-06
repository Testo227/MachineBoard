import React from 'react';
import { useState } from 'react';

//CSS
import '../styles/style.css'


const Topbar = ({filters, setFilters}) => {


    const handleSearch = (value) => {
        setFilters(prev => ({...prev, search: value}));
    };
       
            
        


    return ( 
        <div className="flex bg-[rgb(255,204,0)] h-10">
            <h1 className='text-center font-extrabold text-3xl basis-2/3 text-[rgb(85,90,90)]'>Shopfloorboard PCP</h1>
            <div className='basis-1/3 flex justify-center items-center'>
                <input className="bg-white rounded-sm w-80" 
                    placeholder="Suchen nach K-Nummer oder Kunde..." 
                    type="text" 
                    value={filters.search} 
                    onChange={(e) => handleSearch(e.target.value)}>
                </input>
            </div>
            
        </div>
     );
}
 
export default Topbar;
