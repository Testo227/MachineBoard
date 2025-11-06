// TagCircles.js
import React, { useState } from "react";

const TagCircles = ({ tags = [], globalTags }) => {
  const [activeTagIds, setActiveTagIds] = useState([]);

  const toggleTagActive = (id) => {
    if (activeTagIds.includes(id)) {
      setActiveTagIds(activeTagIds.filter(i => i !== id));
    } else {
      setActiveTagIds([...activeTagIds, id]);
    }
  };

  return (
    <ul className="flex gap-1 flex-wrap">
      {tags.map(tagId => {
        const tag = globalTags.find(t => t.id === tagId);
        if (!tag) return null;

        const isActive = activeTagIds.includes(tag.id);

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