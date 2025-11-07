import React, { useState } from "react";
import { Tag, ChevronDown, Check, X } from "lucide-react";
import SequenzFilter from "./SequenzFilter";
import TypFilter from "./TypFilter";

const FiltersPanel = ({ filters, setFilters, globalTags, clearAllFilters }) => {
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const handleTagToggle = (tagId) => {
    setFilters((prev) => {
      const alreadySelected = prev.tags.includes(tagId);
      return {
        ...prev,
        tags: alreadySelected
          ? prev.tags.filter((id) => id !== tagId)
          : [...prev.tags, tagId],
      };
    });
  };

  const clearTag = (tagId) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.filter((id) => id !== tagId),
    }));
  };

  const getColorValue = (colorString) => {
    if (!colorString) return "#ccc";
    const match = colorString.match(/\[(.*?)\]/);
    return match ? match[1] : colorString;
  };

  const sf = filters.sequenzFilter || {};

  const isAnyFilterActive =
    Boolean(filters.search?.trim()) ||
    (filters.tags?.length > 0) ||
    Boolean(filters.typ?.trim()) ||
    Boolean(filters.typBezeichung?.trim()) ||
    Boolean(sf.selectedArea?.trim()) ||
    Boolean(sf.selectedType?.trim()) ||
    Boolean(sf.selectedType2?.trim()) ||
    Boolean(sf.from) ||
    Boolean(sf.till);

  return (
    <div className="flex flex-col gap-4">
      {/* === TAG FILTER === */}
      <div className="bg-[rgb(244,204,0)] p-3 rounded-md flex flex-col gap-3">
        <label className="font-bold text-[rgb(85,90,90)] text-sm">Tag Filter</label>

        {/* Dropdown + ausgewählte Tags direkt im Button */}
        <div className="relative">
          <button
            onClick={() => setShowTagDropdown((prev) => !prev)}
            className="flex flex-wrap items-center gap-1 min-h-[2.5rem] w-full bg-white px-3 py-1.5 rounded-md shadow-sm border border-gray-300 text-sm text-gray-700 hover:bg-gray-100"
          >
            {filters.tags.length > 0 ? (
              filters.tags.map((tagId) => {
                const tag = globalTags.find((t) => t.id === tagId);
                if (!tag) return null;
                const color = getColorValue(tag.color);
                return (
                  <div
                    key={tag.id}
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs cursor-pointer"
                    style={{ backgroundColor: color }}
                    onClick={(e) => {
                      e.stopPropagation(); // verhindert Schließen des Dropdowns
                      clearTag(tag.id);
                    }}
                  >
                    {tag.name}
                    <X size={12} className="ml-1" />
                  </div>
                );
              })
            ) : (
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-gray-600" />
                <span>Tags auswählen</span>
              </div>
            )}

            {/* Pfeil bleibt rechts */}
            <ChevronDown
              className={`ml-auto transition-transform duration-200 ${
                showTagDropdown ? "rotate-180" : "rotate-0"
              }`}
              size={16}
            />
          </button>

          {showTagDropdown && (
            <div className="absolute left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
              {globalTags.map((tag) => {
                const colorValue = getColorValue(tag.color);
                const selected = filters.tags.includes(tag.id);
                return (
                  <div
                    key={tag.id}
                    onClick={() => handleTagToggle(tag.id)}
                    className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                      selected ? "bg-gray-50 font-semibold" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: colorValue }}
                      ></div>
                      <span className="text-sm text-gray-800">{tag.name}</span>
                    </div>
                    {selected && <Check size={16} className="text-gray-600" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* === TYP FILTER === */}
      <TypFilter filters={filters} setFilters={setFilters} />

      {/* === SEQUENZ FILTER === */}
      <SequenzFilter filters={filters} setFilters={setFilters} />

      {/* Alle Filter löschen */}
      {isAnyFilterActive && (
        <button
          onClick={clearAllFilters}
          className="mt-2 bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 font-semibold"
        >
          Alle Filter entfernen
        </button>
      )}
    </div>
  );
};

export default FiltersPanel;