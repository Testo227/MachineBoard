import React from "react";

//CSS
import '../styles/operatingbar.css'


const Operatingbar = () => {
    return ( 
        <div className="operatingbar">
            <img className="logo" src="../public/logo.png"></img>
            <h1>PCP Shopfloorboard</h1>
            <ul className="list">
                <li>Logout  </li>
                <li>Einstellugen  </li>
                <li>Hilfe  </li>
            </ul>
        </div>
     );
}
 
export default Operatingbar;