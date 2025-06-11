import React, { useState, useEffect } from 'react';
import { Mail, Archive, Trash2, MoreHorizontal, AlertTriangle } from 'lucide-react';
import '../styles/MailView.css';

function MailView({ mail, darkMode }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [errorUser, setErrorUser] = useState(null);

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
          },
        });

        if (!res.ok) throw new Error(`Failed to fetch user: ${res.status}`);

        const data = await res.json();
        setUser(data);
      } catch (err) {
        setErrorUser(err.message);
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    }

    fetchUser();
  }, [mail]);

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
          <button className="icon-btn"><MoreHorizontal size={18} /></button>
        </div>

        <div className="sender-info">
          <div className="sender-avatar">{fromName.charAt(0) || '?'}</div>
          <div className="sender-details">
            <div className="sender-name">{fromName}</div>
            <div className="send-time">
              {new Date(mail.timestamp).toLocaleDateString()} at {new Date(mail.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
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
          <button className="btn primary">Reply</button>
          <button className="btn secondary">Reply All</button>
          <button className="btn secondary">Forward</button>
        </div>
      </div>
    </div>
  );
}

export default MailView;
