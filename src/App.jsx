import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

import MainBoard from './components/MainBoard';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Stueckzahlen from './components/Stueckzahlen/Stueckzahlen';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './components/LoginPage';
import LiveCursors from './components/LiveCursors';
import { ToastProvider } from './components/ToastContext';
import FertigeMaschinen from './components/FertigeMaschinen';
import { useLiveCursors } from './hooks/useLiveCursors';

// CSS
import './styles/style.css';


const App = () => {

  const [user, setUser] = useState(null); // Login-Zustand
  const { remoteCursors, currentUserId, onlineUsers } = useLiveCursors(user);


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
    mentionHandle: "",
    dateFrom: "",
    dateTill: "",
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
        .eq('status', 'in_progress') // 🔹 nur Maschinen in Arbeit
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Fehler beim Laden der Maschinen:', error)
      } else {
        const mapped = data.map(machine => ({
          ...machine,
          Tags: machine.machine_tags.map(mt => mt.tag_id) // 🔹 Hier die Umwandlung
        }))
        setmachinelist(mapped)
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
  // 1️⃣ Initiales Abrufen der Session
  const init = async () => {
    const { data } = await supabase.auth.getSession();
    if (data?.session?.user) {
      const u = data.session.user;
      setUser({
        id: u.id,
        email: u.email,
        username: u.user_metadata?.username || "",
        displayName: u.user_metadata?.display_name || "",
        firstName: u.user_metadata?.firstName || "",
        lastName: u.user_metadata?.lastName || "",
      });
    }
    setLoadingAuth(false);
  };
  init();

  // 2️⃣ Listener für Login / Logout
  const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      const u = session.user;
      setUser({
        id: u.id,
        email: u.email,
        username: u.user_metadata?.username || "",
        displayName: u.user_metadata?.display_name || "",
        firstName: u.user_metadata?.firstName || "",
        lastName: u.user_metadata?.lastName || "",
        profileColor: u.user_metadata?.profileColor || "",
      });
      // Keep profiles table populated for @mention dropdown (always upsert)
      const fn = u.user_metadata?.firstName || '';
      const ln = u.user_metadata?.lastName  || '';
      const emailHandle = u.email?.split('@')[0] || '';
      supabase.from('profiles').upsert({
        id: u.id,
        first_name: fn || emailHandle,
        last_name:  ln,
        email: u.email,
        profile_color: u.user_metadata?.profileColor || '',
      }, { onConflict: 'id' }).then(() => {});
    } else {
      setUser(null);
    }
  });

  return () => listener.subscription.unsubscribe();
}, []);

  // Real-time DB sync — board updates visible to all users without refresh
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('db-realtime')
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'area_slots' },
        (payload) => {
          setAreas(prev => prev.map(area => ({
            ...area,
            slots: area.slots.map(slot =>
              slot.id === payload.new.id
                ? { ...slot, occupied: payload.new.occupied }
                : slot
            ),
          })));
        }
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'machines' },
        (payload) => {
          setmachinelist(prev => prev.map(m =>
            m.id === payload.new.id ? { ...m, ...payload.new } : m
          ));
        }
      )
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'machines' },
        async (payload) => {
          if (payload.new.status !== 'in_progress') return;
          const { data } = await supabase
            .from('machines')
            .select('*, sequenzen(*), kommentare(*), dateien(*), machine_tags(*), maengel(*)')
            .eq('id', payload.new.id)
            .single();
          if (data) {
            setmachinelist(prev => [...prev, { ...data, Tags: data.machine_tags.map(mt => mt.tag_id) }]);
          }
        }
      )
      .on('postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'machines' },
        (payload) => {
          setmachinelist(prev => prev.filter(m => m.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user?.id]);

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
              <ToastProvider>
              <LiveCursors remoteCursors={remoteCursors} currentUserId={currentUserId} />
              <div className="flex flex-col bg-[rgb(240,241,245)] w-screen h-screen">
                  <div className="fixed top-0 left-0 right-0 z-10">
                    <Topbar
                      filters={filters}
                      setFilters={setFilters}
                      globalTags={globalTags}
                      user={user}
                      setUser={setUser}
                      onlineUsers={onlineUsers}
                    />
                  </div>

                  <div className="mt-8 overflow-y-auto overflow-x-hidden" style={{ height: 'calc(100vh - 32px)' }}>
                    <div style={{ minHeight: '1850px', height: '100%', width: '100%', padding: '8px', boxSizing: 'border-box' }}>
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
                      <Route
                        path="/fertige-maschinen"
                        element={<FertigeMaschinen globalTags={globalTags} />}
                      />
                      <Route path="*" element={<div>Seite nicht gefunden</div>} />
                    </Routes>
                    </div>
                  </div>
              </div>
              </ToastProvider>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
