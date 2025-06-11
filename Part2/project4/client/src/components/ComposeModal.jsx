import React, { useState } from 'react';
import { X, Send, Paperclip } from 'lucide-react';
import '../styles/ComposeModal.css';

function ComposeModal({ onClose, darkMode, onMailSent, prefillTo = '', prefillSubject = '', prefillBody = '' }) {
  const [to, setTo] = useState(prefillTo);
  const [subject, setSubject] = useState(prefillSubject);
  const [body, setBody] = useState(prefillBody);

  const handleSend = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Sending with token:", token);
      const response = await fetch('http://localhost:4000/api/mails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ sendTo: to, subject, body }),
      });

      if (response.ok) {
        const sentMail = await response.json();
        onMailSent(sentMail);
        alert("Email sent successfully!");
        onClose();
      } else {
        const { error } = await response.json();
        alert("Error: " + error);
      }
    } catch (err) {
      alert("An error occurred: " + err.message);
    }
  };

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
            <button onClick={handleSend} className="send-button">
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
