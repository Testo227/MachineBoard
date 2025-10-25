import { useState } from "react";
import '../styles/style.css';

const TagInput = ({ tags = [], onChange }) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedColor, setSelectedColor] = useState("red"); // Default-Farbe auf "red"

  const colors = ["red", "green", "blue", "orange", "yellow", "black"];

  // Mapping der Farben auf Tailwind-Klassen
  const colorMap = {
    red: "bg-red-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
    orange: "bg-orange-500",
    yellow: "bg-yellow-500",
    black: "bg-black",
  };

  const addTag = () => {
    if (!inputValue.trim()) return;

    // Immer eine Farbe verwenden, default fallback auf "red"
    const color = selectedColor || "red";

    const newTag = { name: inputValue.trim(), color };
    const updatedTags = [...tags, newTag];

    onChange(updatedTags); // Update an Parent
    setInputValue(""); // Input leeren
    setSelectedColor("red"); // Reset Dropdown auf Default
  };

  const removeTag = (index) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    onChange(updatedTags);
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      {/* Tags anzeigen */}
      <div className="flex flex-wrap gap-2 border border-[rgb(222,222,222)] rounded-lg p-2 bg-white">
        {tags.length === 0 && (
          <span className="text-gray-400 italic">Keine Tags vorhanden...</span>
        )}
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`flex items-center gap-2 text-white px-3 py-1 rounded-full ${colorMap[tag.color]}`}
          >
            {tag.name}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="text-white hover:text-gray-200 font-bold"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Eingabe + Farbe auswählen */}
      <div className="flex items-center gap-2 mt-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTag()}
          placeholder="Neuer Tag..."
          className="kunde border border-[rgb(222,222,222)] border-8 bg-white placeholder-gray-400 text-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(222,222,222)]"
        />

        <select
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
          className='Typ border border-[rgb(222,222,222)] border-8 bg-white placeholder-gray-400 text-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(222,222,222)]'
        >
          {colors.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={addTag}
          className="bg-[rgb(85,90,90)] text-white px-4 py-2 rounded-lg hover:bg-[rgb(65,70,70)]"
        >
          Hinzufügen
        </button>
      </div>
    </div>
  );
};

export default TagInput;