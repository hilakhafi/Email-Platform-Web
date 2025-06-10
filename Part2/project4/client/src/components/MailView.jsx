import React from 'react';
import { Mail, Archive, Trash2, MoreHorizontal } from 'lucide-react';
import '../styles/MailView.css';
function MailView({ mail, darkMode }) {
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

  return (
    <div className={`mailview-container ${darkMode ? 'dark' : 'light'}`}>
      <div className="mailview-header">
        <h1 className="mailview-subject">{mail.subject}</h1>

        <div className="mailview-actions-sender">
          <div className="actions">
            <button className="icon-btn"><Archive size={18} /></button>
            <button className="icon-btn"><Trash2 size={18} /></button>
            <button className="icon-btn"><MoreHorizontal size={18} /></button>
          </div>

          <div className="sender-info">
            <div className="sender-avatar">{mail.sender.charAt(0)}</div>
            <div className="sender-details">
              <div className="sender-name">{mail.sender}</div>
              <div className="send-time">{mail.date} at {mail.time}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mailview-body">
        <p className="mailview-text preview-text">{mail.preview}</p>
        <p className="mailview-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <p className="mailview-text">
          Best regards,<br />
          {mail.sender}
        </p>
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
