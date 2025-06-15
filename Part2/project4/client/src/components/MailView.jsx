import React, { useState, useEffect } from 'react';
import { Mail, Archive, Trash2, MoreHorizontal, AlertTriangle } from 'lucide-react';
import ComposeModal from './ComposeModal';
import '../styles/MailView.css';

function MailView({ mail, darkMode, restoreMail, moveToSpam  }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [errorUser, setErrorUser] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!mail || !mail.from) {
      setUser(null);
      return;
    }

    async function fetchUser() {
      setLoadingUser(true);
      setErrorUser(null);

      try {
        const res = await fetch(`http://localhost:4000/api/users/${mail.from}`, {
          headers: {
            'user-id': mail.from,
            'Authorization': localStorage.getItem('token'), // הוספת טוקן אם נדרש
          },
        });

        console.log("Response status:", res.status);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.log("Error response:", errorText);
          throw new Error(`Failed to fetch user: ${res.status} - ${errorText}`);
        }

        const data = await res.json();
        console.log("user data received:", data);
        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setErrorUser(err.message);
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    }

    fetchUser();
  }, [mail]);

//   async function handleMarkAsSpam(id) {
//   try {
//     await fetch(`http://localhost:4000/api/mails/${id}`, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': localStorage.getItem('token'),
//       },
//       body: JSON.stringify({ spam: true }),
//     });
//     setShowMenu(false);
//     window.location.reload(); // או עדכון סטייט מקומי
//   } catch (error) {
//     console.error('Failed to mark as spam:', error);
//   }
// }

async function handleMarkAsUnread(id) {
  try {
    await fetch(`http://localhost:4000/api/mails/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
      },
      body: JSON.stringify({ isRead: false }),
    });
    setShowMenu(false);
    window.location.reload(); // או עדכון סטייט
  } catch (error) {
    console.error('Failed to mark as unread:', error);
  }
}


  if (!mail) {
    return (
      <div className={`mailview-empty ${darkMode ? 'dark' : 'light'}`}>
        <div className="empty-content">
          <Mail size={48} className="empty-icon" />
          <p className="empty-title">Select an email to view</p>
          <p className="empty-subtitle">Choose an email from the list to see the full content</p>
        </div>
      </div>
    );
  }

  const fromName = user ? `${user.first_name} ${user.last_name}` : loadingUser ? 'Loading...' : errorUser ? 'Unknown' : 'Unknown';

  return (
    <div className="mailview-header">
      <h1 className="mailview-subject">{mail.subject}</h1>

      <div className="mailview-actions-sender">
        <div className="actions">
          <button className="icon-btn"><Archive size={18} /></button>
          <button className="icon-btn"><Trash2 size={18} /></button>
          <div className="dropdown-wrapper">
          <button className="icon-btn" onClick={() => setShowMenu(prev => !prev)}>
            <MoreHorizontal size={18} />
          </button>

      {showMenu && (
        <div className="dropdown-menu">
          <button onClick={() => moveToSpam(mail)}>Mark as Spam</button>
          <button onClick={() => handleMarkAsUnread(mail.id)}>Mark as Unread</button>
          <button onClick={() => restoreMail(mail.id, mail.previousCategory)}>Restore</button>
        </div>
      )}
</div>
        </div>

        <div className="sender-info">
          <div className="sender-avatar">{fromName.charAt(0) || '?'}</div>
          <div className="sender-details">
            <div className="sender-name">{fromName}</div>
            <div className="send-time">
              {new Date(mail.timestamp).toLocaleDateString()} at {new Date(mail.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="sender-email">{user && user.mail ? `<${user.mail}>` : ''}</div>
          </div>
        </div>
      </div>

      {mail.spam && (
        <div className="spam-warning">
          <AlertTriangle size={18} className="spam-icon" />
          <span>This email has been marked as spam due to suspicious content.</span>
        </div>
      )}

      <div className="mailview-body">
        <p className="mailview-text">{mail.body}</p>
      </div>

      <div className="mailview-footer">
        <div className="footer-buttons">
          <button className="btn primary" onClick={() => setShowReplyModal(true)}>Reply</button>
          <button className="btn secondary">Reply All</button>
          <button className="btn secondary">Forward</button>
        </div>
      </div>

      {showReplyModal && (
        <ComposeModal
          onClose={() => setShowReplyModal(false)}
          darkMode={darkMode}
          onMailSent={() => setShowReplyModal(false)}
          prefillTo={user?.mail || ''} // תיקון עיקרי - השתמשי ב-user.mail במקום user.email
          prefillSubject={`Re: ${mail.subject}`}
          prefillBody={`\n\n--- Original message from ${user?.mail || 'unknown'} ---\n${mail.body}`}
        />
      )}
    </div>
  );
}

export default MailView;