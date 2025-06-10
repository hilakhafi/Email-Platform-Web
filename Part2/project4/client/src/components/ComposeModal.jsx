import React, { useState } from 'react';
import { X, Send, Paperclip } from 'lucide-react';
import '../styles/ComposeModal.css'; // הוספת קובץ CSS רגיל

function ComposeModal({ onClose, darkMode }) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  return (
    <div className="compose-overlay">
      <div className={`compose-modal ${darkMode ? 'dark' : 'light'}`}>
        <div className="compose-header">
          <h2 className="compose-title">New Message</h2>
          <button onClick={onClose} className="icon-button close-button">
            <X size={20} />
          </button>
        </div>

        <div className="compose-body">
          <input
            type="email"
            placeholder="To..."
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="compose-input"
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="compose-input"
          />
          <textarea
            placeholder="Write your email here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="compose-textarea"
          />
        </div>

        <div className="compose-footer">
          <button className="icon-button">
            <Paperclip size={20} />
          </button>
          <div className="footer-buttons">
            <button onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button className="send-button">
              <Send size={16} />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComposeModal;
