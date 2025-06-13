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
  const [selectedCategory, setSelectedCategory] = useState('inbox');
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
    console.log("Fetched mails:", data);
    setMails(data);
    
    //כאן נעדכן את selectedMail:
    if (selectedMail) {
      const updatedMail = data.find(mail => mail.id === selectedMail.id);
      setSelectedMail(updatedMail || null);  // אם לא נמצא, מאפסים ל-null
    }
 
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
    fetchMails();
  }, []);

useEffect(() => {
  const updatedCategories = defaultCategories.map(category => {
    let count = 0;

    if (category.name === 'All mail') {
      // כולל הכל חוץ מספאם ואשפה
      count = mails.filter(mail => mail.category !== 'Spam' && mail.category !== 'Trash').length;
    } else if (category.name === 'Starred') {
      count = mails.filter(mail => mail.isStarred).length;
    } else {
      // כל שאר הקטגוריות: Inbox, Sent, Drafts, Spam, Trash
      count = mails.filter(mail => mail.category === category.name).length;
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
      filtered = mails.filter(mail => mail.ownerId === userId && mail.category === 'inbox');
      break;
    case 'Starred':
      filtered = mails.filter(mail => mail.ownerId === userId && mail.isStarred);
      break;
    case 'Sent':
      filtered = mails.filter(mail => mail.ownerId === userId && mail.category === 'sent');
      break;
    case 'Drafts':
      filtered = mails.filter(mail => mail.from === userId && mail.category === 'drafts');
      break;
    case 'Spam':
      filtered = mails.filter(mail => mail.category === 'spam');
      break;
    case 'Trash':
      filtered = mails.filter(mail => mail.category === 'trash');
      break;
    default:
      filtered = mails;
  }

  // חיפוש – סינון לפי מחרוזת החיפוש
  if (searchTerm.trim()) {
    const lower = searchTerm.toLowerCase();
    filtered = filtered.filter(mail =>
      (mail.subject && mail.subject.toLowerCase().includes(lower)) ||
      (mail.body && mail.body.toLowerCase().includes(lower))
    );
  }

  return filtered;
}

const toggleStar = async (mailId, currentStarred) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found.");

    const res = await fetch(`http://localhost:4000/api/mails/${mailId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isStarred: !currentStarred }),
    });

    if (!res.ok) {
      throw new Error("Failed to toggle star");
    }

    setMails((prevMails) =>
      prevMails.map((mail) =>
        mail.id === mailId ? { ...mail, isStarred: !currentStarred } : mail
      )
    );
  } catch (err) {
    console.error(err);
  }
};
const moveToTrash = async (mailId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found.");

    const res = await fetch(`http://localhost:4000/api/mails/${mailId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ category: "trash" }),
    });

    if (!res.ok) {
      throw new Error("Failed to move mail to trash");
    }

    // אם העדכון הצליח, נעדכן גם ב־state המקומי:
    setMails((prevMails) =>
      prevMails.map((mail) =>
        mail.id === mailId ? { ...mail, category: "trash", isStarred: false, previousCategory: selectedCategory } : mail
      )
    );
  } catch (err) {
    console.error(err);
    // אפשר להראות הודעת שגיאה למשתמש
  }
};

const restoreMail = async (mailId, previousCategory) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found.");

    const res = await fetch(`http://localhost:4000/api/mails/${mailId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ category: previousCategory || "inbox", previousCategory: null }),
    });

    if (!res.ok) {
      throw new Error("Failed to restore mail");
    }

    setMails((prevMails) =>
      prevMails.map((mail) =>
        mail.id === mailId
          ? { ...mail, category: previousCategory || "inbox", previousCategory: null }
          : mail
      )
    );
  } catch (err) {
    console.error(err);
  }
};

const moveToSpam = async (mailId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found.");

    const res = await fetch(`http://localhost:4000/api/mails/${mailId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ category: "spam" }),
    });

    if (!res.ok) {
      throw new Error("Failed to move mail to trash");
    }

    // אם העדכון הצליח, נעדכן גם ב־state המקומי:
    setMails((prevMails) =>
      prevMails.map((mail) =>
        mail.id === mailId ? { ...mail, category: "spam" , isStarred: false } : mail
      )
    );
  } catch (err) {
    console.error(err);
    // אפשר להראות הודעת שגיאה למשתמש
  }
};

const handlePermanentDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to permanently delete this email?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`/api/mails/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!res.ok) throw new Error("Failed to delete email");

    // מסננים את המייל שנמחק מה-state
    setMails(prev => prev.filter(mail => mail.id !== id));
    setSelectedMail(null); // ניקוי הבחירה
  } catch (err) {
    console.error(err);
    alert("Failed to delete the email permanently");
  }
};

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
          toggleStar={toggleStar}
          moveToTrash={moveToTrash}
          handlePermanentDelete={handlePermanentDelete}
          
        />

        <MailView 
        mail={selectedMail} darkMode={darkMode}
        restoreMail={restoreMail}
        moveToSpam={moveToSpam}
        />

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