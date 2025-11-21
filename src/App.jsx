import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

import MainBoard from './components/MainBoard';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Stueckzahlen from './components/Stueckzahlen/Stueckzahlen';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './components/LoginPage';

// CSS
import './styles/style.css';


const App = () => {
    
  const [user, setUser] = useState(null); // Login-Zustand
  
  const [foldSidebar, setFoldSidebar] = useState(true);

  const [finishedMachines, setFinishedMachines] = useState([])

  const [loadingAuth, setLoadingAuth] = useState(true);
    
  //machine data
  const [machinelist, setmachinelist] = useState([])

  //slot data
    const [areas, setAreas] = useState([])


  //Filter State
  const [filters, setFilters] = useState({
    search: "",
    tags: [],
    typ: "",
    typBezeichung: "",
    wlw: "",
    sequenzFilter:{ area: [
    "PPM1",
    "PPM2",
    "PUMI",
    "Dock",
    "Prüffeld Pumpe",
    "Prüffeld Mast",
    "Lackierung",
    "Endmontage",
    "PDI",
    "Konservieren",
    "Optimieren",
    "BSA Linie",
    "BSA Dock",
  ],
    type:["Plan","Ist"],type2:["start", "ende"] ,  from:"", till:""}
  })

  //Global Tags
    const [globalTags, setGlobalTags] = useState([]);

  //API Call fuer machinelist 
  useEffect(() => {
    const fetchMachines = async () => {
      const { data, error } = await supabase
        .from('machines')
        .select(`
          *,
          sequenzen(*),
          kommentare(*),
          dateien(*),
          machine_tags(*),
          maengel(*)
        `)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Fehler beim Laden der Maschinen:', error)
      } else {
        setmachinelist(data)
      }
    }

    fetchMachines()
  }, [])

  //API Call fuer globaltags
  useEffect(() => {
    const fetchGlobalTags = async () => {
      const { data, error } = await supabase
        .from('globaltags') // Name der Tabelle in Supabase
        .select('*')
        .order('id', { ascending: true }) // optional: sortiert nach id

      if (error) {
        console.error('Fehler beim Laden der GlobalTags:', error)
      } else {
        setGlobalTags(data)
      }
    }

    fetchGlobalTags()
  }, [])


  //API Call fuer areas
  useEffect(() => {
    const fetchAreas = async () => {
      // Hole alle Areas
      let { data: areasData, error: areasError } = await supabase
        .from('areas')
        .select('*')

      if (areasError) {
        console.error('Fehler beim Abrufen der Areas:', areasError)
        return
      }

      // Hole alle Slots
      let { data: slotsData, error: slotsError } = await supabase
        .from('area_slots')
        .select('*')

      if (slotsError) {
        console.error('Fehler beim Abrufen der Slots:', slotsError)
        return
      }

      // Mappe die Slots zu den Areas
      const areasWithSlots = areasData.map(area => ({
        ...area,
        slots: slotsData
          .filter(slot => slot.area_id === area.id)
          .map(slot => ({
            id: slot.id,
            slotName: slot.slotName,
            occupied: slot.occupied
          }))
      }))

      setAreas(areasWithSlots)
    }

    fetchAreas()
  }, [])


  //Login Session mit Supabase
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            username: session.user.user_metadata?.username || "",
            displayName: session.user.user_metadata?.display_name || "",
          });
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // USE EFFECT FÜR PERSISTENTES LOGIN
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();

      if (data?.session?.user) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email,
          username: data.session.user.user_metadata?.username || "",
          displayName: data.session.user.user_metadata?.display_name || "",
        });
      }

      setLoadingAuth(false);
    };

    init();
  }, []);

  if (loadingAuth) {
    return <div className="text-center mt-10 text-xl">Lade...</div>;
  }


  return (
    <Router>
      <Routes>
        {/* Login-Seite */}
        <Route path="/login" element={<LoginPage setUser={setUser} />} />

        {/* Geschützte Routen */}
        <Route
          path="/*"
          element={
            <ProtectedRoute user={user}>
              <div className="flex">
                <div className="fixed top-0 left-0 h-full z-20">
                  <Sidebar foldSidebar={foldSidebar} setFoldSidebar={setFoldSidebar} setUser={setUser} user={user}/>
                </div>
                <div
                  className={`flex flex-col flex-1 transition-all duration-300 ${
                    foldSidebar ? "ml-[220px]" : "ml-[80px]"
                  }`}
                >
                  <div
                    className={`fixed top-0 right-0 z-10 transition-all duration-300 ${
                      foldSidebar ? "left-[220px]" : "left-[80px]"
                    }`}
                  >
                    <Topbar
                      filters={filters}
                      setFilters={setFilters}
                      globalTags={globalTags}
                    />
                  </div>

                  <div className="mt-10 p-4">
                    <Routes>
                      <Route path="/" element={<Navigate to="/shopfloor" />} />
                      <Route
                        path="/shopfloor"
                        element={
                          <MainBoard
                            machinelist={machinelist}
                            setmachinelist={setmachinelist}
                            finishedMachines={finishedMachines}
                            setFinishedMachines={setFinishedMachines}
                            areas={areas}
                            setAreas={setAreas}
                            filters={filters}
                            globalTags={globalTags}
                            setGlobalTags={setGlobalTags}
                          />
                        }
                      />
                      <Route
                        path="/stueckzahlen"
                        element={<Stueckzahlen machinelist={machinelist} areas={areas} />}
                      />
                      <Route path="*" element={<div>Seite nicht gefunden</div>} />
                    </Routes>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
