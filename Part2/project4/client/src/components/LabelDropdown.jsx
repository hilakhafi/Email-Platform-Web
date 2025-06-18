import React, { useState, useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';

function LabelDropdown({ 
  isOpen, 
  onClose, 
  onAddToLabel, 
  onRemoveFromLabel,
  currentLabels = [],
  position = 'bottom-left'
}) {
  const [labels, setLabels] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen) fetchLabels();
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const fetchLabels = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/labels", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setLabels(data);
      } else {
        console.error("Failed to fetch labels", response.status);
      }
    } catch (err) {
      console.error("Error fetching labels:", err);
    }
  };

  const handleLabelToggle = (labelname) => {
    if (currentLabels.includes(labelname)) {
      onRemoveFromLabel(labelname);
    } else {
      onAddToLabel(labelname);
    }
  };

  if (!isOpen) return null;

  const positionClasses = {
    'bottom-left': 'top-full left-0',
    'bottom-right': 'top-full right-0',
    'top-left': 'bottom-full left-0',
    'top-right': 'bottom-full right-0'
  };

  
  return (
    <div
      ref={dropdownRef}
      className={`absolute z-50 w-60 bg-white dark:bg-[#2b2b2b] border border-gray-300 dark:border-gray-600 rounded-md shadow-md ${positionClasses[position]}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-600">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Labels</span>
        <button onClick={onClose} className="text-gray-500 hover:text-black dark:hover:text-white">
          <X size={16} />
        </button>
      </div>

      {/* Labels */}
      <div className="py-1">
        {labels.length === 0 ? (
          <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 italic text-center">
            No labels available
          </div>
        ) : (
          labels.map(label => {
            const isApplied = currentLabels.includes(label.name);
            return (
              <button
                key={label.name}
                onClick={() => handleLabelToggle(label.name)}
                className="w-full px-4 py-2 flex items-center gap-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div
                  className="w-3 h-3 rounded-full border border-gray-300"
                  style={{ backgroundColor: label.color }}
                ></div>
                <span className="flex-grow text-gray-800 dark:text-gray-200">{label.name}</span>
                {isApplied && <Check size={16} className="text-green-600 dark:text-green-400" />}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

export default LabelDropdown;
