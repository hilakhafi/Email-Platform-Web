import { Edit, Plus } from 'lucide-react';
import '../styles/Sidebar.css';
import React, { useState, useEffect } from 'react';
import LabelDropdown from './LabelDropdown';


function Sidebar({ onCompose, selectedCategory, onCategorySelect, categories, darkMode, onLabelSelect, selectedLabel }) {
  const [labels, setLabels] = useState([]);
  const fetchLabels = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch("http://localhost:4000/api/labels", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log('data:', data);
            setLabels(data);
          } else {
            console.error("Failed to fetch labels", response.status);
          }
        } catch (err) {
          console.error("Error fetching labels:", err);
        }
      };
  // טען את הלייבלים כשהקומפוננטה נטענת
  useEffect(() => {
    fetchLabels();
  }, []);

  const handleSelectLabel = (labelName) => {
    console.log("Selected label:", labelName);
    onCategorySelect(labelName); // כאן תוכל להתאים לפעולה הרצויה
  };

const handleAddLabel = async () => {
  const name = prompt("Enter label name:");
  const color = prompt("Enter label color (e.g. red, blue, #ffaa00):");

  if (!name || !color) return;

  try {
    console.log('name:', name);
    console.log('color:', color);
    const token = localStorage.getItem("token"); // או איפה ששמרת את ה־JWT
    console.log('token:', token);
    const response = await fetch("http://localhost:4000/api/labels", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name, color })
    });

    if (response.ok) {
      // עדכן את התוויות מחדש
      const newLabels = await response.json(); // אולי תרצה פשוט לקרוא שוב ל־GET /labels
      console.log('Label added:', newLabels);
      await fetchLabels();
      //window.location.reload(); // פתרון זמני — עדיף להשתמש ב־setLabels או callback מה־App
    } else {
      console.error("Failed to add label", response.status, await response.text());
    }
  } catch (err) {
    console.error(err);
  }
};


  return (
    <div className={`sidebar ${darkMode ? 'dark' : 'light'}`}>
      <div className="compose-wrapper">
        <button onClick={onCompose} className="compose-btn">
          <Edit size={18} />
          Compose
        </button>
      </div>

      <div className="categories-wrapper">
        <nav>
          {categories.map(category => {
            const IconComponent = category.icon;
            const isSelected = selectedCategory === category.name;
            return (
              <button
                key={category.name}
                onClick={() => onCategorySelect(category.name)}
                className={`category-btn ${isSelected ? 'selected' : ''}`}
              >
                <span className={`count ${category.count > 0 ? 'has-count' : ''}`}>
                  {category.count > 0 ? category.count : ''}
                </span>
                <div className="category-info">
                  <span className="category-name">{category.name}</span>
                  <IconComponent size={18} />
                </div>
              </button>
            );
          })}
        </nav>

        {labels.length >= 0 && (
          <div className="labels-section">
            <div className="labels-header">
              <span className="labels-title">Labels</span>
              <button className="add-label-btn" onClick={handleAddLabel}>
                <Plus size={22} />
              </button>
            </div>
          {labels.map(label => {
            const isSelectedLabel = selectedLabel === label.name;
            return (
            <button
              key={label.name}
              onClick={() => onLabelSelect(label.name)}
              className={`label-item ${isSelectedLabel ? 'selected' : ''}`}
            >
              <div
                className="label-color"
                style={{ backgroundColor: label.color }}
              ></div>
              <span className="label-name">{label.name}</span>
            </button>
            );
          })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
