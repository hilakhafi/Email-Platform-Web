import React, { useState, useEffect } from 'react';
import { Search, Mail, Settings, Menu, Sun, Moon, Inbox, Star, SendHorizontal, FileText, AlertCircle, Trash2 } from 'lucide-react';
import Sidebar from './Sidebar';
import MailList from './MailList';
import MailView from './MailView';
import ComposeModal from './ComposeModal';
import '../styles/MailHome.css';

const defaultCategories = [
  { name: "Inbox", icon: Inbox, color: "blue", count: 0 },
  { name: "Starred", icon: Star, color: "yellow", count: 0 },
  { name: "Sent", icon: SendHorizontal, color: "green", count: 0 },
  { name: "Drafts", icon: FileText, color: "gray", count: 0 },
  { name: "Spam", icon: AlertCircle, color: "orange", count: 0 },
  { name: "Trash", icon: Trash2, color: "red", count: 0 }
];

export default function MailHome() {
  const [mails, setMails] = useState([]);
  const [selectedMail, setSelectedMail] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Inbox');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [categories, setCategories] = useState(defaultCategories);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const updatedCategories = defaultCategories.map(category => {
      let count = 0;
      if (category.name === 'Inbox') {
        count = mails.filter(mail => !mail.isArchived && !mail.isDeleted).length;
      } else if (category.name === 'Starred') {
        count = mails.filter(mail => mail.isStarred).length;
      } else if (category.name === 'Sent') {
        count = mails.filter(mail => mail.isSent).length;
      } else if (category.name === 'Drafts') {
        count = mails.filter(mail => mail.isDraft).length;
      } else if (category.name === 'Spam') {
        count = mails.filter(mail => mail.isSpam).length;
      } else if (category.name === 'Trash') {
        count = mails.filter(mail => mail.isDeleted).length;
      }
      return { ...category, count };
    });
    setCategories(updatedCategories);
  }, [mails]);

  return (
    <div className={`mail-home ${darkMode ? 'dark' : 'light'}`}>
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="left-header">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="menu-btn"
              aria-label="Toggle Sidebar"
            >
              <Menu size={20} />
            </button>
            <div className="logo">
              <Mail size={24} />
              <span>Gmail</span>
            </div>
          </div>

          <div className="search-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search mail..."
              className="search-input"
            />
          </div>

          <div className="right-header">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="icon-btn"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="icon-btn" aria-label="Settings">
              <Settings size={20} />
            </button>
            <div className="user-avatar">U</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {!sidebarCollapsed && (
          <Sidebar
            onCompose={() => setShowCompose(true)}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            categories={categories}
            labels={labels}
            darkMode={darkMode}
          />
        )}

        <MailList
          mails={mails}
          loading={loading}
          error={error}
          selectedMail={selectedMail}
          onSelect={setSelectedMail}
          darkMode={darkMode}
          selectedCategory={selectedCategory}
        />

        <MailView mail={selectedMail} darkMode={darkMode} />

        {showCompose && (
          <ComposeModal onClose={() => setShowCompose(false)} darkMode={darkMode} />
        )}
      </main>
    </div>
  );
}
