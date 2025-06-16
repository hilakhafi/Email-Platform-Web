import React, { useState } from 'react';
import { X, Send, Paperclip } from 'lucide-react';
import AttachmentsList from './AttachmentsList';
import useFileUpload from '../hooks/useFileUpload';
import '../styles/ComposeModal.css';

function ComposeModal({ 
  onClose, 
  darkMode, 
  onMailSent, 
  prefillTo = '', 
  prefillSubject = '', 
  prefillBody = '' 
}) {
  const [to, setTo] = useState(prefillTo);
  const [subject, setSubject] = useState(prefillSubject);
  const [body, setBody] = useState(prefillBody);
  const [sending, setSending] = useState(false);

  // שימוש ב-hook לניהול קבצים
  const { 
    attachments, 
    handleFileUpload, 
    removeAttachment, 
    clearAttachments 
  } = useFileUpload(10); // מקסימום 10MB

  const handleSend = async () => {
    if (!to.trim() || !subject.trim()) {
      alert('Please fill in recipient and subject');
      return;
    }

    setSending(true);
    
    try {
      const token = localStorage.getItem("token");
      console.log("Sending with token:", token);
      
      // אם יש קבצים מצורפים, שלח ל-files endpoint
      if (attachments.length > 0) {
        // יצירת FormData להעלאת קבצים
        const formData = new FormData();
        formData.append('sendTo', to);
        formData.append('subject', subject);
        formData.append('body', body);
        
        // הוספת כל הקבצים ל-FormData
        attachments.forEach((file) => {
          formData.append('attachments', file);
        });

        const response = await fetch('http://localhost:4000/api/files/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            // אל תוסיפי Content-Type כאשר משתמשים ב-FormData
          },
          body: formData
        });

        if (response.ok) {
          const result = await response.json();
            console.log("Server response:", result); // ← הוסיפי את זה לראות מה חוזר
          alert("Email sent successfully with " + result.attachments + " attachments!");
          clearAttachments();
          onClose();
          if (onMailSent) onMailSent();
        } else {
          const error = await response.json();
          alert("Error: " + (error.message || error.error));
        }
      } else {
        // אם אין קבצים מצורפים, שלח JSON רגיל ל-mails endpoint
        const response = await fetch('http://localhost:4000/api/mails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sendTo: to,
            subject: subject,
            body: body
          })
        });

        if (response.ok) {
          alert("Email sent successfully!");
          onClose();
          if (onMailSent) onMailSent();
        } else {
          const error = await response.json();
          alert("Error: " + (error.error || error.message));
        }
      }
    } catch (err) {
      console.error("Send error:", err);
      alert("An error occurred: " + err.message);
    } finally {
      setSending(false);
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

          {/* קומפוננטת קבצים מצורפים */}
          <AttachmentsList 
            attachments={attachments}
            onRemoveAttachment={removeAttachment}
            darkMode={darkMode}
          />

          <textarea
            placeholder="Write your email here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="compose-textarea"
          />
        </div>

        <div className="compose-footer">
          {/* כפתור להעלאת קבצים */}
          <label className="icon-button attach-button">
            <Paperclip size={20} />
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              accept="*/*"
            />
          </label>
          
          <div className="footer-buttons">
            <button onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button 
              onClick={handleSend} 
              className="send-button"
              disabled={sending}
            >
              <Send size={16} />
              {sending ? 'Sending...' : 'Send'}
              {attachments.length > 0 && ` (${attachments.length} files)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComposeModal;