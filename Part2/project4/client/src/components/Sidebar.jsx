import React from 'react';
import { Edit } from 'lucide-react';
import '../styles/Sidebar.css';

function Sidebar({ onCompose, selectedCategory, onCategorySelect, categories, labels, darkMode }) {
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

        {labels.length > 0 && (
          <div className="labels-section">
            <h3 className="labels-header">Labels</h3>
            {labels.map(label => (
              <div key={label.name} className="label-item">
                <div
                  className="label-color"
                  style={{ backgroundColor: label.color }}
                ></div>
                <span className="label-name">{label.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
