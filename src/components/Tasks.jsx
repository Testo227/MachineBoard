import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useToast } from './ToastContext';
import { Check, Trash2, Plus, User } from 'lucide-react';

const AVATAR_COLORS = [
  "#3b82f6","#8b5cf6","#ec4899","#f97316",
  "#14b8a6","#22c55e","#ef4444","#6366f1",
];
function getAvatarColor(str = "") {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const MiniAvatar = ({ name }) => {
  const parts    = (name || '').split(' ');
  const initials = ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '?';
  const bg       = getAvatarColor(name || '');
  return (
    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: bg }}>
      <span className="text-white font-bold leading-none select-none" style={{ fontSize: 8 }}>{initials}</span>
    </div>
  );
};

// Responsible person picker dropdown
const PersonPicker = ({ profiles, value, onChange }) => {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef(null);

  const filtered = profiles.filter(p =>
    !query || `${p.first_name} ${p.last_name}`.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-50 transition cursor-pointer">
        {value ? <MiniAvatar name={value} /> : <User size={11} className="text-gray-400" />}
        <span className="truncate max-w-[80px]">{value || 'Verantwortlich'}</span>
      </button>
      {open && (
        <div className="absolute top-full mt-1 right-0 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="px-3 py-1.5 border-b border-gray-100">
            <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Suchen…"
              className="w-full text-xs bg-transparent outline-none text-gray-700 placeholder-gray-400" />
          </div>
          {value && (
            <button type="button" onMouseDown={e => { e.preventDefault(); onChange(''); setOpen(false); }}
              className="w-full px-3 py-2 text-xs text-gray-400 hover:bg-gray-50 text-left transition">
              — Keiner
            </button>
          )}
          <div className="max-h-48 overflow-y-auto">
            {filtered.map(p => {
              const name = `${p.first_name} ${p.last_name}`.trim();
              return (
                <button key={p.id} type="button"
                  onMouseDown={e => { e.preventDefault(); onChange(name); setOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-blue-50 transition text-left group">
                  <MiniAvatar name={name} />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition">{name}</span>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-xs text-gray-400">Keine Benutzer gefunden</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Tasks = ({ machineId }) => {
  const [tasks,       setTasks]       = useState([]);
  const [profiles,    setProfiles]    = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [newText,     setNewText]     = useState('');
  const [newResponsible, setNewResponsible] = useState('');
  const [adding, setAdding] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data?.session?.user;
      if (!u) return;
      const firstName   = u.user_metadata?.firstName || '';
      const lastName    = u.user_metadata?.lastName  || '';
      const emailHandle = u.email?.split('@')[0]?.replace(/[._]/g, ' ') || '';
      setCurrentUser({
        id:          u.id,
        displayName: (firstName + ' ' + lastName).trim() || emailHandle || u.email || 'Benutzer',
      });
    });
  }, []);

  const loadProfiles = useCallback(async () => {
    const { data } = await supabase.from('profiles')
      .select('id, first_name, last_name').order('first_name');
    if (data) setProfiles(data);
  }, []);

  const loadTasks = useCallback(async () => {
    const { data } = await supabase.from('tasks').select('*')
      .eq('machine_id', machineId).order('created_at', { ascending: true });
    if (data) setTasks(data);
  }, [machineId]);

  useEffect(() => { loadProfiles(); loadTasks(); }, [loadProfiles, loadTasks]);

  const addTask = async () => {
    if (!newText.trim()) return;
    setAdding(true);
    const { error } = await supabase.from('tasks').insert({
      machine_id:       machineId,
      text:             newText.trim(),
      completed:        false,
      responsible_name: newResponsible || '',
      created_by:       currentUser?.displayName || '',
    });
    setAdding(false);
    if (error) { addToast('❌ Fehler beim Erstellen der Aufgabe', 'error'); return; }
    setNewText('');
    setNewResponsible('');
    loadTasks();
  };

  const toggleTask = async (task) => {
    const { error } = await supabase.from('tasks')
      .update({ completed: !task.completed }).eq('id', task.id);
    if (!error) setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = async (taskId) => {
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    if (!error) setTasks(prev => prev.filter(t => t.id !== taskId));
    else addToast('❌ Fehler beim Löschen', 'error');
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Task list */}
      {tasks.length === 0 ? (
        <p className="text-xs text-center text-gray-400 py-1">Noch keine Aufgaben.</p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {tasks.map(task => (
            <div key={task.id}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition group ${
                task.completed ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-100 shadow-sm'
              }`}>
              {/* Checkbox */}
              <button onClick={() => toggleTask(task)}
                className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition cursor-pointer ${
                  task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-[rgb(255,204,0)]'
                }`}>
                {task.completed && <Check size={11} className="text-white" strokeWidth={3} />}
              </button>
              {/* Text */}
              <span className={`flex-1 text-sm leading-snug ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {task.text}
              </span>
              {/* Responsible */}
              {task.responsible_name && (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <MiniAvatar name={task.responsible_name} />
                  <span className="text-xs text-gray-400 truncate max-w-[72px]">{task.responsible_name}</span>
                </div>
              )}
              {/* Delete */}
              <button onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition cursor-pointer flex-shrink-0">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new task */}
      <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
        <div className="flex gap-2">
          <input
            value={newText}
            onChange={e => setNewText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            placeholder="Neue Aufgabe…"
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgb(255,204,0)] focus:bg-white focus:border-transparent transition"
          />
          <PersonPicker profiles={profiles} value={newResponsible} onChange={setNewResponsible} />
        </div>
        <div className="flex justify-end">
          <button onClick={addTask} disabled={adding || !newText.trim()}
            className="px-5 py-2 rounded-lg bg-[rgb(255,204,0)] text-[rgb(40,44,48)] text-sm font-bold hover:brightness-95 transition cursor-pointer disabled:opacity-60 flex items-center gap-2">
            {adding
              ? <div className="w-4 h-4 border-2 border-t-transparent border-[rgb(40,44,48)] rounded-full animate-spin" />
              : <><Plus size={14} />Hinzufügen</>
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
