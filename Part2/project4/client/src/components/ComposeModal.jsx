import React, { useState, useEffect } from 'react';
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
  prefillBody = '',
  forwardAttachments = [] // קבצים מצורפים מהמייל המועבר
}) {
  const [to, setTo] = useState(prefillTo);
  const [subject, setSubject] = useState(prefillSubject);
  const [body, setBody] = useState(prefillBody);
  const [mails, setMails] = useState([]);
  const [sending, setSending] = useState(false);

  // שימוש ב-hook לניהול קבצים
  const { 
    attachments, 
    handleFileUpload, 
    removeAttachment, 
    clearAttachments,
    addAttachmentsFromForward // פונקציה חדשה להוספת קבצים מועברים
  } = useFileUpload(10); // מקסימום 10MB

  // הוספת קבצים מצורפים מהמייל המועבר בעת טעינת הקומפוננטה
  useEffect(() => {
    if (forwardAttachments && forwardAttachments.length > 0) {
      // אם יש פונקציה להוספת קבצים מועברים, השתמש בה
      if (addAttachmentsFromForward) {
        addAttachmentsFromForward(forwardAttachments);
      }
    }
  }, [forwardAttachments, addAttachmentsFromForward]);

const handleSend = async () => {
    if (!to.trim() || !subject.trim()) {
      alert('Please fill in recipient and subject');
      return;
    }

    setSending(true);
    
  try {
    const token = localStorage.getItem("token");

    // נבדוק האם יש קישור זדוני, אבל לא נעצור
    const spamResponse = await fetch('http://localhost:4000/api/blacklist/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ subject, body })
    });

    const spamResult = await spamResponse.json();
    const isSpam = spamResult.spam;

    // שולחים מייל כולל מידע האם הוא ספאם
      
      // אם יש קבצים מצורפים (חדשים או מועברים), שלח ל-files endpoint
      if (attachments.length > 0 || forwardAttachments.length > 0) {
        // יצירת FormData להעלאת קבצים
        const formData = new FormData();
        formData.append('sendTo', to);
        formData.append('subject', subject);
        formData.append('body', body);
        formData.append('isSpam', isSpam);
        // הוספת כל הקבצים החדשים ל-FormData
        attachments.forEach((file) => {
          formData.append('attachments', file);
        });

        // הוספת קבצים מועברים אם יש
        if (forwardAttachments && forwardAttachments.length > 0) {
          forwardAttachments.forEach((attachment) => {
            // אם יש data (base64), המר אותו חזרה לקובץ
            if (attachment.data) {
              try {
                const byteCharacters = atob(attachment.data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: attachment.contentType || 'application/octet-stream' });
                const file = new File([blob], attachment.filename, { type: attachment.contentType });
                formData.append('attachments', file);
              } catch (error) {
                console.error('Error converting attachment:', error);
              }
            }
          });
        }

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
          const totalAttachments = attachments.length + (forwardAttachments?.length || 0);
          alert("Email sent successfully with " + totalAttachments + " attachments!");
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
            body: body,
            isSpam
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

// תיקון של הפונקציה moveToDraft ב-ComposeModal.js
const moveToDraft = async (mailData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch('http://localhost:4000/api/mails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        sendTo: mailData.to || '',
        subject: mailData.subject || '',
        body: mailData.body || '',
        category: 'drafts',
      }),
    });

    if (response.ok) {
      const newDraft = await response.json();
      console.log("Draft saved successfully:", newDraft);
      
      // קריאה לפונקציה שמעדכנת את רשימת המיילים
      if (onMailSent) {
        onMailSent(newDraft);
      }
      
      alert("Email saved as draft");
    } else {
      const err = await response.json();
      console.error("Server error:", err);
      alert("Failed to save draft: " + (err.message || err.error));
    }
  } catch (error) {
    console.error("Network error:", error);
    alert("Error saving draft: " + error.message);
  }
};

  // קביעת כותרת המודל בהתאם לסוג הפעולה
  const getModalTitle = () => {
    if (prefillSubject.startsWith('Re:')) return 'Reply';
    if (prefillSubject.startsWith('Fwd:')) return 'Forward';
    return 'New Message';
  };

  return (
    <div className="compose-overlay">
      <div className={`compose-modal ${darkMode ? 'dark' : 'light'}`}>
        <div className="compose-header">
          <h2 className="compose-title">{getModalTitle()}</h2>
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
            forwardedAttachments={forwardAttachments} // העברת הקבצים המועברים
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
            <button onClick={() => {
              moveToDraft({to, subject, body});              
              onClose(); }}
              className="cancel-button">
              Cancel
            </button>
            <button 
              onClick={handleSend} 
              className="send-button"
              disabled={sending}
            >
              <Send size={16} />
              {sending ? 'Sending...' : 'Send'}
              {(attachments.length > 0 || forwardAttachments.length > 0) && 
                ` (${attachments.length + (forwardAttachments?.length || 0)} files)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComposeModal;