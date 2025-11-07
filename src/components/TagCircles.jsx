import React, { useState } from "react";

const TagCircles = ({ tags = [], globalTags }) => {
  const [activeTagId, setActiveTagId] = useState(null); // nur ein aktives Tag

  const toggleTagActive = (id) => {
    if (activeTagId === id) {
      setActiveTagId(null); // nochmal klicken = schließen
    } else {
      setActiveTagId(id); // neues Tag aktiv, altes schließt sich automatisch
    }
  };

  return (
    <ul className="flex gap-1 flex-wrap">
      {tags.map(tagId => {
        const tag = globalTags.find(t => t.id === tagId);
        if (!tag) return null;

        const isActive = activeTagId === tag.id;

        return (
          <li key={tag.id}>
            <div
              className={`flex items-center justify-center h-4 rounded-full cursor-pointer transition-all duration-300
                          ${isActive ? "px-2 min-w-max" : "w-4"}`}
              style={{ backgroundColor: tag.color.replace("bg-[", "").replace("]", "") }}
              onClick={() => toggleTagActive(tag.id)}
            >
              {isActive && (
                <span className="text-white text-xs whitespace-nowrap">
                  {tag.name}
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default TagCircles;