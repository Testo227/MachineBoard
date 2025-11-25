import { useState } from "react";
import '../styles/style.css';
import { supabase } from '../supabaseClient';

const TagInputDropdown = ({ machineTags = [], onChange, globalTags, setGlobalTags }) => {
  const [open, setOpen] = useState(false);
  const [editingTagId, setEditingTagId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Tag der Maschine hinzufügen
  const addTagToMachine = (tagId) => {
    if (!machineTags.includes(tagId)) {
      onChange([...machineTags, tagId]);
    }
  };

  // Tag aus der Box entfernen
  const removeTagFromMachine = (tagId) => {
    onChange(machineTags.filter(id => id !== tagId));
  };

  const renameTag = async (tagId) => {
    if (!editValue.trim()) return;

    // 1️⃣ UI State updaten
    setGlobalTags(prev =>
      prev.map(tag => tag.id === tagId ? { ...tag, name: editValue } : tag)
    );

    // 2️⃣ Datenbank updaten
    const { error } = await supabase
      .from('globaltags')
      .update({ name: editValue })
      .eq('id', tagId);

    if (error) {
      console.error('Fehler beim Updaten des Tags:', error);
    }

    // 3️⃣ Edit-Modus beenden
    setEditingTagId(null);
    setEditValue('');
  };

  // Alle Tags außer die, die schon hinzugefügt wurden
  const availableTags = globalTags.filter(tag => !machineTags.includes(tag.id));

  return (
    <div className="relative w-full">
      {/* Box mit ausgewählten Tags */}
      <div
        className="flex items-center justify-between border border-[rgb(222,222,222)] border-8 bg-white px-3 py-2 cursor-pointer"
        onClick={() => setOpen(prev => !prev)}
      >
        <div className="flex flex-wrap gap-2">
          {machineTags.length === 0 ? (
            <span className="text-gray-400 italic">Keine Tags...</span>
          ) : (
            machineTags.map(tagId => {
              const tag = globalTags.find(t => t.id === tagId);
              return tag && (
                <span
                  key={tag.id}
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-white text-sm cursor-pointer"
                  style={{ backgroundColor: tag.color.replace("bg-[", "").replace("]", "") }}
                  onClick={() => {
                    setEditingTagId(tag.id);
                    setEditValue(tag.name);
                  }}
                >
                  {editingTagId === tag.id ? (
                    <input
                      autoFocus
                      className="bg-transparent border-none text-white focus:outline-none w-24"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onBlur={() => renameTag(tag.id)}
                      onKeyDown={e => e.key === "Enter" && renameTag(tag.id)}
                    />
                  ) : (
                    <span>{tag.name}</span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // verhindert Dropdown Toggle
                      removeTagFromMachine(tag.id);
                    }}
                    className="ml-1 text-white font-bold hover:text-gray-200"
                  >
                    ×
                  </button>
                </span>
              );
            })
          )}
        </div>
        <span className={`ml-2 transform ${open ? "rotate-180" : ""}`}>▼</span>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-gray-100 border border-gray-300 rounded-lg shadow-lg z-50">
          {availableTags.map(tag => (
            <div
              key={tag.id}
              className="flex items-center px-3 py-2 hover:bg-gray-100 transition"
            >
              {/* Oval + Button */}
              <div
                className="flex items-center gap-2 px-3 py-1 rounded-full text-white relative cursor-pointer"
                style={{ backgroundColor: tag.color.replace("bg-[", "").replace("]", "") }}
              >
                <span
                  className="cursor-text"
                  onClick={() => {
                    setEditingTagId(tag.id);
                    setEditValue(tag.name);
                  }}
                >
                  {editingTagId === tag.id ? (
                    <input
                      autoFocus
                      className="bg-transparent border-none text-white focus:outline-none w-24"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onBlur={() => renameTag(tag.id)}
                      onKeyDown={e => e.key === "Enter" && renameTag(tag.id)}
                    />
                  ) : (
                    tag.name
                  )}
                </span>
                <button
                  onClick={() => addTagToMachine(tag.id)}
                  className="absolute -right-2 -top-2 bg-white text-gray-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-gray-200"
                >
                  +
                </button>
              </div>
            </div>
          ))}

          {availableTags.length === 0 && (
            <div className="px-3 py-2 text-gray-500 text-sm italic">
              Keine weiteren Tags verfügbar
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TagInputDropdown;