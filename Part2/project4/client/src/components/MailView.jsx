import React, { useState, useEffect } from 'react';
import { Mail, Archive, Trash2, MoreHorizontal, AlertTriangle, Paperclip, Download, Eye, ArrowLeft } from 'lucide-react';
import ComposeModal from './ComposeModal';
import '../styles/MailView.css';

function MailView({ mail, darkMode, restoreMail, moveToSpam, onClose, handlePermanentDelete,selectedCategory,
   onUpdateMail, setSelectedMail, setSelectedCategory     }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [errorUser, setErrorUser] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [draftToDeleteAfterSend, setDraftToDeleteAfterSend] = useState(null);


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
     // סימון המייל כנקרא
      async function markMailAsRead() {
        if (!mail.isRead) {
          try {
            const token = localStorage.getItem('token');
            if (!token) {
              console.error('No authorization token found');
              return;
            }
            const res = await fetch(`http://localhost:4000/api/mails/${mail.id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,  // לשים "Bearer " לפני הטוקן, אם השרת דורש
              },
              body: JSON.stringify({ isRead: true }),
            });

            if (res.ok) {
              try {
                const updatedMail = await res.json();
                onUpdateMail?.(updatedMail);
              } catch (e) {
                console.warn('Response was empty, using local update');
                onUpdateMail?.({ ...mail, isRead: true }); // לעדכן מתוך הסטייט הקיים
              }
            } else {
              // אפשר לקרוא טקסט של הודעת שגיאה מהשרת ולוג אותו
              const errorText = await res.text();
              console.error(`Failed to mark mail as read: ${res.status} ${res.statusText} - ${errorText}`);
            }
          } catch (err) {
            console.error("Network or fetch error:", err);
          }
        }
      }
    fetchUser();
    markMailAsRead();
  }, [mail]);


const handleResend = () => {
  setDraftToDeleteAfterSend(mail); // שומרים את ה־id למחיקה רק אם השליחה תתבצע
  setShowComposeModal(true);
}; 

async function handleMarkAsUnread(id) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authorization token found');
      return;
    }

    const res = await fetch(`http://localhost:4000/api/mails/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ isRead: false }),
    });

    if (res.ok) {
      console.log('Mail marked as unread successfully');
      
      // בדיקה אם יש תוכן בתגובה
      const responseText = await res.text();
      let updatedMail;
      
      if (responseText.trim()) {
        try {
          updatedMail = JSON.parse(responseText);
        } catch (parseError) {
          console.warn('Response was not valid JSON, using local update');
          updatedMail = { ...mail, isRead: false };
        }
      } else {
        console.warn('Empty response from server, using local update');
        updatedMail = { ...mail, isRead: false };
      }
      
      // עדכון הסטייט המקומי
      setShowMenu(false);
      
      // עדכון ה-parent component
      if (onUpdateMail) {
        onUpdateMail(updatedMail);
      }
      
      // **חזרה לרשימת המיילים - כמו שעשית**
      // סוגר את המייל הנוכחי ועובר לקטגוריה שאליה המייל חזר
      setSelectedMail(null);
      
      // אם המייל עבר לקטגוריה אחרת, עבור אליה
      if (updatedMail.category && updatedMail.category !== selectedCategory) {
        setSelectedCategory(updatedMail.category);
      }
      }
      
     else {
      const errorText = await res.text();
      console.error(`Failed to mark as unread: ${res.status} ${res.statusText} - ${errorText}`);
      alert('שגיאה בסימון המייל כלא נקרא');
    }
  } catch (error) {
    console.error('Network error when marking as unread:', error);
    alert('שגיאה ברשת');
  }
}

// פונקציה להורדת קובץ - מתוקנת
const handleDownloadAttachment = (attachment) => {
  try {
    // אם יש base64 data
    if (attachment.data) {
      const byteCharacters = atob(attachment.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: attachment.contentType || 'application/octet-stream' });
               
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.filename || 'attachment';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
    // אם יש path לקובץ בשרת
    else if (attachment.path) {
      const link = document.createElement('a');
      // תיקון הנתיב - הסרת files/ מהנתיב
      link.href = `http://localhost:4000/uploads/${attachment.filename}`;
      link.download = attachment.filename || 'attachment';
      link.click();
    }
  } catch (error) {
    console.error('Error downloading attachment:', error);
    alert('שגיאה בהורדת הקובץ');
  }
};

// פונקציה לתצוגה מקדימה של קובץ - מתוקנת
const handlePreviewAttachment = (attachment) => {
  try {
    if (attachment.data) {
      const byteCharacters = atob(attachment.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: attachment.contentType || 'application/octet-stream' });
      
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } else if (attachment.path) {
      // תיקון הנתיב - השתמש ב-uploads/ ישירות
      window.open(`http://localhost:4000/uploads/${attachment.filename}`, '_blank');
    }
  } catch (error) {
    console.error('Error previewing attachment:', error);
    alert('שגיאה בתצוגה מקדימה של הקובץ');
  }
};

  // פונקציה לקבלת איקון לפי סוג קובץ
  const getFileIcon = (filename, contentType) => {
    const extension = filename?.split('.').pop()?.toLowerCase();
    const type = contentType?.toLowerCase();
    
    if (type?.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension)) {
      return '🖼️';
    }
    if (type?.includes('pdf') || extension === 'pdf') {
      return '📄';
    }
    if (type?.includes('text') || ['txt', 'doc', 'docx'].includes(extension)) {
      return '📝';
    }
    if (['xlsx', 'xls', 'csv'].includes(extension)) {
      return '📊';
    }
    if (['zip', 'rar', '7z'].includes(extension)) {
      return '🗜️';
    }
    return '📎';
  };

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
      {!showReplyModal && !showComposeModal && !showForwardModal && (
      <div className={`mailview-topbar ${darkMode ? 'dark' : 'light'}`}>
        <button className="back-arrow" onClick={onClose}>
          <ArrowLeft size={20} />
        </button>
      </div>
      )}
      

      <div className="mailview-actions-sender">
        <div className="actions">
          <h1 className="mailview-subject">{mail.subject}</h1>
          
          <div className="dropdown-wrapper">
          <button className="icon-btn" onClick={() => setShowMenu(prev => !prev)}>
            <MoreHorizontal size={18} />
          </button>

      {showMenu && (
        <div className="dropdown-menu">
              <button onClick={() => moveToSpam(mail)}>Mark as Spam</button>
              <button onClick={() => handleMarkAsUnread(mail.id)}>Mark as Unread</button>
         {selectedCategory === 'trash' &&  <button onClick={() => restoreMail(mail.id, mail.previousCategory)}>Restore</button>}
         {selectedCategory === 'drafts' && <button onClick={() => {handleResend();  setShowMenu(false);}}>Resend</button>}
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
        
        {/* הצגת קבצים מצורפים */}
        {mail.attachments && mail.attachments.length > 0 && (
          <div className="attachments-section">
            <div className="attachments-header">
              <Paperclip size={16} />
              <span>{mail.attachments.length} attachment{mail.attachments.length > 1 ? 's' : ''}</span>
            </div>
            <div className="attachments-list">
              {mail.attachments.map((attachment, index) => (
                <div key={index} className="attachment-item">
                  <div className="attachment-info">
                    <span className="attachment-icon">
                      {getFileIcon(attachment.filename, attachment.contentType)}
                    </span>
                    <div className="attachment-details">
                      <span className="attachment-name">{attachment.filename || `attachment-${index + 1}`}</span>
                      <span className="attachment-size">
                        {attachment.size ? `${(attachment.size / 1024).toFixed(1)} KB` : 'Unknown size'}
                      </span>
                    </div>
                  </div>
                  <div className="attachment-actions">
                    <button
                      className="attachment-btn preview-btn"
                      onClick={() => handlePreviewAttachment(attachment)}
                      title="תצוגה מקדימה"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      className="attachment-btn download-btn"
                      onClick={() => handleDownloadAttachment(attachment)}
                      title="הורד קובץ"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mailview-footer">
        <div className="footer-buttons">
          <button className="btn primary" onClick={() => setShowReplyModal(true)}>Reply</button>
                    <button className="btn secondary" onClick={() => setShowForwardModal(true)}>Forward</button>

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
      
      {/* Modal להעברה */}
      {showForwardModal && (
        <ComposeModal
          onClose={() => setShowForwardModal(false)}
          darkMode={darkMode}
          onMailSent={() => setShowForwardModal(false)}
          prefillTo="" // נשאיר ריק כדי שהמשתמש יוכל למלא
          prefillSubject={`Fwd: ${mail.subject}`}
          prefillBody={`\n\n--- Forwarded message ---\nFrom: ${user?.mail || 'unknown'}\nDate: ${new Date(mail.timestamp).toLocaleString()}\nSubject: ${mail.subject}\n\n${mail.body}`}
          forwardAttachments={mail.attachments} // העברת הקבצים המצורפים
        />
      )}

      {showComposeModal && (
        <ComposeModal
          onClose={() => {
            setShowComposeModal(false);     
            setDraftToDeleteAfterSend(null);
          }}         
          darkMode={darkMode}
          onMailSent={() => {
          if (draftToDeleteAfterSend) {
            handlePermanentDelete(draftToDeleteAfterSend);
          }
            setShowComposeModal(false);
            setDraftToDeleteAfterSend(null);
            onClose(); // סוגר את ה-MailView, אם תרצי
          }}
          prefillTo={mail.toMail || ''}            // שימי לב! משתמשת ב־toMail
          prefillSubject={mail.subject || ''}
          prefillBody={mail.body || ''}
        />
      )}

    </div>
  );
}

export default MailView;