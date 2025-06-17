import React, { useState, useEffect, useRef } from 'react';
import { Search, Mail, Settings, Menu, Sun, Moon, Inbox, Star, SendHorizontal, FileText, AlertCircle, Trash2, User, LogOut, UserCircle } from 'lucide-react';
import Sidebar from './Sidebar';
import MailList from './MailList';
import MailView from './MailView';
import ComposeModal from './ComposeModal';
import UserProfileModal from './UserProfileModal';
import '../styles/MailHome.css';

const defaultCategories = [
  { name: "inbox", icon: Inbox, color: "blue", count: 0 },
  { name: "starred", icon: Star, color: "yellow", count: 0 },
  { name: "sent", icon: SendHorizontal, color: "green", count: 0 },
  { name: "drafts", icon: FileText, color: "gray", count: 0 },
  { name: "spam", icon: AlertCircle, color: "orange", count: 0 },
  { name: "trash", icon: Trash2, color: "red", count: 0 }
];

export default function MailHome() {
  const [mails, setMails] = useState([]);
  const [selectedMail, setSelectedMail] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  //first state for selected category
  const [selectedCategory, setSelectedCategory] = useState('inbox');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [categories, setCategories] = useState(defaultCategories);
  const [labels, setLabels] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  const handleUpdateMail = (updatedMail) => {
  console.log('handleUpdateMail', updatedMail);
  setMails(prev =>
    prev.map(mail => (mail.id === updatedMail.id ? updatedMail : mail))
  );
  setSelectedMail(updatedMail); // גם המייל הנבחר מתעדכן
};
  
  const userMenuRef = useRef(null);
//   const handleMailSent = () => {
//   // מחכים רגע כדי שהמייל ייכנס גם לנמען
//   setTimeout(() => {
//     fetchMails();
//   }, 300); // או אפילו פחות
// };
  useEffect(() => {
  fetchMails(currentPage);
}, [currentPage]);

  async function fetchMails(page = 1) {
  setLoading(true);
  setError(null);
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found. Please login.");

    const res = await fetch(`http://localhost:4000/api/mails?page=${page}`, {      
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
    setMails(data.mails);
    setCurrentPage(data.currentPage);
    setTotalPages(data.totalPages);
    
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
  // בדוק אם המייל תקין
  if (newMail && typeof newMail === 'object' && newMail.id) {
    setMails(prevMails => [newMail, ...prevMails]);
  } else {
    // אם לא - רענן את כל המיילים
    console.log("Invalid mail object received, refreshing all mails");
    fetchMails();
  }
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
  console.log('fromMail:', mails.fromMail);
  console.log('toMail:', mails.toMail);
  console.log('email', userInfo.email);

  if (!userInfo) return; // אם אין משתמש, לא עושים כלום

  const userMails = mails.filter(mail => mail.toMail === userInfo.email);
  const userDraft = mails.filter(mail => mail.fromMail === userInfo.email);

  const updatedCategories = defaultCategories.map(category => {
    let count = 0;

    if (category.name === 'inbox') {
      count = userMails.filter(mail => mail.category === 'inbox' && mail.isRead === false).length;
    } else if (category.name === 'spam') {
      count = userMails.filter(mail => mail.category === 'spam' && mail.isRead === false).length;
    } else if (category.name === 'drafts') {
      count = userDraft.filter(mail => mail.category === 'drafts').length;
    }
    return { ...category, count };
  });

  setCategories(updatedCategories);

}, [mails, userInfo]);


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
  console.log("Decoded userId:", getCurrentUserId());

  let filtered = [];

  switch (selectedCategory) {
    case 'inbox':
      filtered = mails.filter(mail => mail.ownerId === userId && mail.category === 'inbox');
      break;
    case 'starred':
      filtered = mails.filter(mail => mail.ownerId === userId && mail.isStarred);
      break;
    case 'sent':
      filtered = mails.filter(mail => mail.ownerId === userId && mail.category === 'sent');
      break;
    case 'drafts':
      filtered = mails.filter(mail => mail.ownerId === userId && mail.category === 'drafts');
      break;
    case 'spam':
      filtered = mails.filter(mail => mail.ownerId === userId && mail.category === 'spam');
      break;
    case 'trash':
      filtered = mails.filter(mail => mail.ownerId === userId && mail.category === 'trash');
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

    // מוצא את המייל כדי לקבל את הקטגוריה הנוכחית שלו
    const mailToMove = mails.find(mail => mail.id === mailId);
    if (!mailToMove) throw new Error("Mail not found.");

    const res = await fetch(`http://localhost:4000/api/mails/${mailId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        category: "trash", 
        previousCategory: mailToMove.category // שומר את הקטגוריה הנוכחית
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to move mail to trash");
    }

    // אם העדכון הצליח, נעדכן גם ב־state המקומי:
    setMails((prevMails) =>
      prevMails.map((mail) =>
        mail.id === mailId 
          ? { 
              ...mail, 
              category: "trash", 
              isStarred: false, 
              previousCategory: mailToMove.category 
            } 
          : mail
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
      body: JSON.stringify({ category: previousCategory }),
    });

    if (!res.ok) {
      throw new Error("Failed to restore mail");
    }

    setMails((prevMails) =>
      prevMails.map((mail) =>
        mail.id === mailId
          ? { ...mail, category: previousCategory }
          : mail
      )
    );
    
    // סוגר את המייל הנוכחי ועובר לקטגוריה שאליה המייל חזר
    setSelectedMail(null);
    setSelectedCategory(previousCategory);
    
  } catch (err) {
    console.error(err);
  }
};

const moveToSpam = async (mail) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found.");

    const res = await fetch(`http://localhost:4000/api/mails/${mail.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ category: "spam", isStarred: false }),
    });

    if (!res.ok) {
      throw new Error("Failed to move mail to trash");
    }

    // אם העדכון הצליח, נעדכן גם ב־state המקומי:
    setMails((prevMails) =>
      prevMails.map((mailcheck) =>
        mailcheck.id === mail.id ? { ...mailcheck, category: "spam" , isStarred: false } : mailcheck
      )
    );
    
    // 3. Extract + Add URLs to blacklist
    // const blockedUrls = await BlacklistService.check(subject, body); // השתמשי בגרסה החדשה של check
    // for (const url of blockedUrls) {

      const res2 = await fetch("http://localhost:4000/api/blacklist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subject: mail.subject, body: mail.body, }),
      });

      if (!res2.ok) {
      throw new Error("Failed to move mail to blacklist");
    }
  } catch (err) {
    console.error(err);
    // אפשר להראות הודעת שגיאה למשתמש
  }
};

// const handlePermanentDelete = async (mail) => {
//   if(mail.category !== 'drafts') {
//     const confirmDelete = window.confirm("Are you sure you want to permanently delete this email?");
//     if (!confirmDelete) return;
//   }
//   // אם המייל הוא טיוטה, לא נבקש אישור
//   try {
//     const res = await fetch(`/api/mails/${mail.id}`, {
//       method: 'DELETE',
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('token')}`,
//       },
//     });

//     if (!res.ok) throw new Error("Failed to delete email");

//     // מסננים את המייל שנמחק מה-state
//     setMails(prev => prev.filter(deleteMail => deleteMail.id !== mail.id));
//     setSelectedMail(null); // ניקוי הבחירה
//   } catch (err) {
//     console.error(err);
//     alert("Failed to delete the email permanently");
//   }
// };
  const handlePermanentDelete = async (mailsToDelete) => {
  // תמיכה במייל אחד בלבד
  const mailsArray = Array.isArray(mailsToDelete) ? mailsToDelete : [mailsToDelete];

  const hasNonDraft = mailsArray.some(mail => mail.category !== 'drafts');

  // בקשת אישור אם יש מייל לא מטיוטה
  if (hasNonDraft) {
    const confirmDelete = window.confirm("Are you sure you want to permanently delete the selected email(s)?");
    if (!confirmDelete) return;
  }

  try {
    for (const mail of mailsArray) {
      const res = await fetch(`/api/mails/${mail.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete email");
    }

    setMails(prev => prev.filter(mail => !mailsArray.some(toDelete => toDelete.id === mail.id)));
    setSelectedMail(null);
    // setSelectedMails([]); // נקה בחירה מרובה אם צריך
  } catch (err) {
    console.error(err);
    alert("Failed to delete one or more emails permanently");
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
                      <h3>{userInfo.username}</h3>
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
  {/* Sidebar - תמיד מוצג */}
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

        {/* תוכן מיילים - או רשימה או מייל אחד */}
        <div className="mail-content">
          {!selectedMail && mails.length > 0  ? (
            <MailList
              mails={filterMailsByCategory()}
              loading={loading}
              error={error}
              selectedMail={selectedMail}
              onSelect={setSelectedMail}
              darkMode={darkMode}
              selectedCategory={selectedCategory}
              onRefresh={fetchMails}
              toggleStar={toggleStar}
              moveToTrash={moveToTrash}
              handlePermanentDelete={handlePermanentDelete}
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          ) : (
            <MailView
              mail={selectedMail}
              darkMode={darkMode}
              restoreMail={restoreMail}
              moveToSpam={moveToSpam}
              onClose={() => setSelectedMail(null)}
              handlePermanentDelete={handlePermanentDelete}
              selectedCategory={selectedCategory}
              onUpdateMail={handleUpdateMail}
            />
          )}
        </div>

        {showCompose && (
          <ComposeModal 
            onClose={() => setShowCompose(false)} 
            darkMode={darkMode} 
            onMailSent={handleNewMail} 
            // moveToDraft={moveToDraft}
            // mail={selectedMail}
            // updateDraftCategory={updateDraftCategory}
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