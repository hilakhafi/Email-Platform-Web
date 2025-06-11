import React, { useState, useEffect, useRef } from 'react';
import { Search, Mail, Settings, Menu, Sun, Moon, Inbox, Star, SendHorizontal, FileText, AlertCircle, Trash2, User, LogOut, UserCircle } from 'lucide-react';
import Sidebar from './Sidebar';
import MailList from './MailList';
import MailView from './MailView';
import ComposeModal from './ComposeModal';
import UserProfileModal from './UserProfileModal';
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
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // User menu states
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "User Example",
    email: "user@example.com",
    avatar: null,
    username: "",
    birthDate: "",
    gender: ""
  });
  
  const userMenuRef = useRef(null);

  async function fetchMails() {
  setLoading(true);
  setError(null);
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found. Please login.");

    const res = await fetch("http://localhost:4000/api/mails", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch mails: ${res.status}`);
    }

    const data = await res.json();
    setMails(data);
  } catch (err) {
    setError(err.message);
    setMails([]);
  } finally {
    setLoading(false);
  }
}

  // Handle new mail event (e.g., from WebSocket or similar)
  function handleNewMail(newMail) {
    setMails(prevMails => [newMail, ...prevMails]); // מוסיף למיילים קיים, בראש הרשימה
  }
  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch user info
  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId"); // נניח שאתה שומר את ה-ID גם כן
        console.log("Token:", token);
        console.log("User ID:", userId);

        if (!token || !userId) return;

        const res = await fetch(`http://localhost:4000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'user-id': userId
          },
        });

        if (res.ok) {
          const userData = await res.json();
          console.log('User data from server:', userData);
          console.log('Profile image:', userData.profileImage);
          const profileImagePath = userData.profileImage ? userData.profileImage.replace(/\\/g, '/') : null;
            const avatarUrl = profileImagePath ? `http://localhost:4000/${profileImagePath}` : null;

            console.log('Profile image URL:', avatarUrl);
          setUserInfo({
            // name: `${userData.first_name} ${userData.last_name}` || "User",
            name: userData.first_name && userData.last_name
            ? `${userData.first_name} ${userData.last_name}`
            : "User",
            email: userData.mail || "user@example.com",
            avatar: userData.profileImage ? `http://localhost:4000/${userData.profileImage.replace(/\\/g, '/')}` : null,
            username: userData.username,
            birthDate: userData.birth_date,
            gender: userData.gender
          });
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    }

    fetchUserInfo();
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setShowUserMenu(false);
    // Add navigation to login page or refresh
    window.location.href = "/login";
  };

  // Handle profile edit
  const handleEditProfile = () => {
    setShowUserMenu(false);
    setShowProfileModal(true);
  };

  // Handle user update from profile modal
  const handleUserUpdate = (updatedUserInfo) => {
    setUserInfo(updatedUserInfo);
  };

  
  // fetch mails from the server
  useEffect(() => {
    async function fetchMails() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please login.");
          setLoading(false);
          return;
        }
        console.log("Token:", token);
        console.log("Fetching mails...");
        const res = await fetch("http://localhost:4000/api/mails", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Response status:", res.status);
        if (!res.ok) throw new Error(`Failed to fetch mails: ${res.status}`);

        const data = await res.json();
        setMails(data);
      } catch (err) {
        setError(err.message || "Unknown error");
        setMails([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMails();
  }, []);

// Fetch labels (assuming an endpoint exists)
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

function getCurrentUserId() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId;
  } catch {
    return null;
  }
}

function filterMailsByCategory() {
  const userId = getCurrentUserId();
  if (!userId) return [];

  let filtered = [];
  
  switch (selectedCategory) {
    case 'Inbox':
      //filtered = mails.filter(mail => mail.to === userId && !mail.isDeleted && !mail.isSpam );
      filtered = mails.filter(mail => mail.to === userId && !mail.isDeleted && !mail.isSpam && mail.isInbox);

      break;
    case 'Starred':
      filtered = mails.filter(mail => mail.isStarred);
      break;
    case 'Sent':
      //filtered = mails.filter(mail => mail.from === userId);
      filtered = mails.filter(mail => mail.from === userId && mail.isSent);

      break;
    case 'Drafts':
      filtered = mails.filter(mail => mail.isDraft && mail.from === userId);
      break;
    case 'Spam':
      filtered = mails.filter(mail => mail.isSpam);
      break;
    case 'Trash':
      filtered = mails.filter(mail => mail.isDeleted);
      break;
    default:
      filtered = mails;
  }

  // חיפוש – סינון לפי מחרוזת החיפוש
  if (searchTerm.trim()) {
    const lower = searchTerm.toLowerCase();
    filtered = filtered.filter(mail =>
      (mail.subject && mail.subject.toLowerCase().includes(lower)) ||
      (mail.body && mail.body.toLowerCase().includes(lower)) ||
      (mail.to && mail.to.toLowerCase().includes(lower))
    );
  }

  return filtered;
}

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
            <button 
              onClick={() => setSearchTerm(searchInput)} 
              className="search-icon-button" 
              aria-label="Search"
            >
              <Search className="search-icon" size={20} />
            </button>
            <input
              type="text"
              placeholder="Search mail..."
              className="search-input"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setSearchTerm(searchInput);
                }
              }}
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
            
            {/* User Menu */}
            <div className="user-menu-container" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="user-avatar"
                aria-label="User Menu"
              >
                {userInfo.avatar ? (
                  <img src={userInfo.avatar} alt="User Avatar" />
                ) : (
                  userInfo.name.charAt(0).toUpperCase()
                )}
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <div className="user-details">
                      <h3>{userInfo.name}</h3>
                      <p>{userInfo.email}</p>
                    </div>
                  </div>
                  
                  <div className="user-menu-divider"></div>
                  
                  <div className="user-menu-items">
                    <button
                      onClick={handleEditProfile}
                      className="user-menu-item"
                    >
                      <User size={16} />
                      <span>Edit profile</span>
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="user-menu-item logout"
                    >
                      <LogOut size={16} />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
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
          mails={filterMailsByCategory()}
          loading={loading}
          error={error}
          selectedMail={selectedMail}
          onSelect={setSelectedMail}
          darkMode={darkMode}
          selectedCategory={selectedCategory}
          onRefresh={fetchMails}  // <-- פונקציה שמרעננת מיילים

        />

        <MailView mail={selectedMail} darkMode={darkMode} />

        {showCompose && (
          <ComposeModal 
              onClose={() => setShowCompose(false)} 
              darkMode={darkMode} 
              onMailSent={handleNewMail} 
          />        
        )}

        {showProfileModal && (
          <UserProfileModal 
            onClose={() => setShowProfileModal(false)} 
            darkMode={darkMode}
            userInfo={userInfo}
            onUserUpdate={handleUserUpdate}
          />
        )}
      </main>
    </div>
  );
}