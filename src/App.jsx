import React from 'react'
import { useState } from 'react'

//components
import MainBoard from './components/MainBoard'

import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import TestBoard from './components/TestBoard'

//CSS
import './styles/style.css'

const App = () => {
  const [foldSidebar, setFoldSidebar] = useState(true);


  return ( 
    <div className='flex h-screen overflow-hidden'>

      <div className="fixed top-0 left-0 h-full z-20">
        <Sidebar foldSidebar={foldSidebar} setFoldSidebar={setFoldSidebar}></Sidebar>
      </div>

      <div className={`flex flex-col flex-1 transition-all duration-300 ${foldSidebar ? "ml-[220px]" : "ml-[80px]"}`}> 
          <div className={`fixed top-0 right-0 z-10 transition-all duration-300 ${foldSidebar ? "left-[220px]" : "left-[80px]"}`}>
            <Topbar></Topbar>
          </div>
          <div>
          <div className="mt-10 overflow-y-auto overflow-x-auto h-[calc(100vh-2.5rem)] bg-white-300 p-4">
          <MainBoard></MainBoard>
          </div>
          </div>
      </div>
    </div>
   )
}
 

export default App
