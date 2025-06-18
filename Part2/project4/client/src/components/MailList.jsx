import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Mail, Star, RefreshCw, MoreHorizontal, CircleSlash, Trash2, Paperclip, Circle,Tag } from 'lucide-react';
import '../styles/MailList.css';
import LabelDropdown from './LabelDropdown';

// קומפוננטה לטעינת פרטי משתמש בודד
function MailItemWithUser({ mail, selectedMail, onSelect, darkMode, 
  toggleStar, moveToTrash, onAddLabelToMail, onRemoveLabelFromMail }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [showLabelDropdown, setShowLabelDropdown] = useState(false);

  useEffect(() => {
    if (!mail.from) return;

    async function fetchUser() {
      setLoadingUser(true);
      try {
        const res = await fetch(`http://localhost:4000/api/users/${mail.from}`, {
          headers: {
            'user-id': mail.from,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        setLoadingUser(false);
      }
    }

    fetchUser();
  }, [mail.from]);

  const isSelected = selectedMail?.id === mail.id;
  const isUnread = !mail.isRead;
  const hasAttachments = mail.attachments && mail.attachments.length > 0;
  
  // הצגת שם המשתמש או מצב טעינה
  const senderName = loadingUser 
    ? 'Loading...' 
    : user 
      ? `${user.first_name} ${user.last_name}` 
      : mail.from;

  return (
    <div
      key={mail.id}
      onClick={() => onSelect(mail)}
      className={`mail-item 
        ${isSelected ? 'selected' : ''} 
        ${isUnread ? 'unread' : ''} 
        ${mail.spam ? 'spam' : ''}`}
    >
      <div className="mail-item-content">
        <div className="mail-item-meta">
          {mail.category !== 'trash' && (
            <button
              className="star-button"
              onClick={(e) => {
                e.stopPropagation();
                toggleStar(mail.id, mail.isStarred);
              }}
            >
              <Star
                size={16}
                className={`star-icon ${mail.isStarred ? 'starred' : ''}`}
              />
            </button>
          )}
          {mail.category !== 'trash' && (
            <div className="relative">
              <button
                className="label-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLabelDropdown(!showLabelDropdown);
                }}
                title="Manage labels"
              >
                <Tag size={16} />
              </button>
              
              <LabelDropdown
                // isOpen={showLabelDropdown}
                // onClose={() => setShowLabelDropdown(false)}
                // onAddToLabel={(labelId) => togglelabel(mail.id, labelId)}
                // onRemoveFromLabel={(labelName) => onRemoveLabelFromMail(mail.id, labelName)}
                // currentLabels={mail.labels || []}
                // position="bottom-left"
              />
            </div>
          )}
          {mail.category !== 'trash' && (
          <button
            className="trash-button"
            onClick={(e) => {
              e.stopPropagation();
              moveToTrash(mail.id);
            }}
          >
            <Trash2 size={20} />
          </button>
          )}
          {mail.isImportant && <div className="important-dot"></div>}
          {hasAttachments && (
            <div className="attachment-indicator" title={`${mail.attachments.length} attachment${mail.attachments.length > 1 ? 's' : ''}`}>
              <Paperclip size={14} />
            </div>
          )}
        </div>

        <div className="mail-details">
          <div className="mail-header">
            <span className={`mail-sender ${isUnread ? 'bold' : ''}`}>{senderName}</span>
            <div className="mail-header-right">
              <span className="mail-date">{mail.date}</span>
            </div>
          </div>

          <div className={`mail-subject ${isUnread ? 'bold' : ''}`}>
            {mail.subject}
            {hasAttachments && (
              <span className="subject-attachment-count">
                ({mail.attachments.length})
              </span>
            )}
          </div>
          <div className="mail-preview">{mail.preview}</div>
          {mail.labels && mail.labels.length > 0 && (
            <div className="mail-labels">
              {mail.labels.map((label, index) => (
                <span 
                  key={index}
                  className="label-tag"
                  style={{ 
                    backgroundColor: label.color || '#4285f4',
                    color: 'white',
                    fontSize: '11px',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    marginRight: '4px',
                    display: 'inline-block'
                  }}
                >
                  {typeof label === 'string' ? label : label.name}
                </span>
              ))}
            </div>
          )}

          {mail.spam && (
            <div className="mail-category">
              <span className="category-label spam">Spam</span>
            </div>
          )}

          {mail.category && !mail.spam && (
            <div className="mail-category">
              <span className={`category-label ${mail.category.toLowerCase()}`}>{mail.category}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MailList({ mails,
  selectedMail,
  onSelect,
  loading,
  error,
  darkMode,
  selectedCategory,
  onRefresh,
  toggleStar,
  moveToTrash,
  handlePermanentDelete,
  currentPage,
  totalPages,
  setCurrentPage,
  onAddLabelToMail,
  onRemoveLabelFromMail,
  onRemoveLabelFromMails,
  setMails,
  selectedLabel
  }) {
  const [selectedMails, setSelectedMails] = useState([]);
  const [showBulkLabelDropdown, setShowBulkLabelDropdown] = useState(false);

  const toggleSelectMail = (mailId) => {
  setSelectedMails(prev =>
    prev.includes(mailId) ? prev.filter(id => id !== mailId) : [...prev, mailId]
  );
};

const clearSelection = () => setSelectedMails([]);
  const themeClass = darkMode ? 'dark' : 'light';
  
  if (loading) {
    return (
      <div className={`mail-list-wrapper center ${themeClass}`}>
        <div className="loading-message">
          <RefreshCw className="spin" size={20} />
          <span>Loading emails...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`mail-list-wrapper center ${themeClass}`}>
        <div className="error-message">
          <p>Error loading emails</p>
          <p className="error-detail">{error}</p>
        </div>
      </div>
    );
  }

  if (mails.length === 0) {
    return (
      <div className={`mail-list-wrapper ${themeClass}`}>
        <div className="mail-list-header">

          <div className="header-left">
            <h2 className="header-title">{selectedCategory}</h2>
          </div>
          <div className="header-actions">
            <button
              className="icon-button"
              onClick={onRefresh}
              aria-label="רענן מיילים"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
        <div className="center empty-state">
          <Mail size={48} className="empty-icon" />
          <p className="empty-title">No emails in {selectedCategory.toLowerCase()}</p>
          <p className="empty-text">When you receive emails, they'll appear here</p>
        </div>
      </div>
    );
  }

  const togglelabel = async (mailId, label) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found.");
    const mailToMove = mails.find(mail => mail.id === mailId);
    console.log('mailToMove:', mailToMove);
    console.log('label:', label);
    console.log('mailToMove.labelId:', mailToMove.labelId);

    const updatedLabelIds = [...mailToMove.labelId, label];
    console.log('updatedLabelIds:', updatedLabelIds);


    const res = await fetch(`http://localhost:4000/api/mails/${mailId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ labelId: updatedLabelIds }),
    });

    if (!res.ok) {
      throw new Error("Failed to toggle label");
    }

    setMails((prevMails) =>
      prevMails.map((mail) =>
        mail.id === mailId ? { ...mail, labelId: updatedLabelIds } : mail
      )
    );
  } catch (err) {
    console.error(err);
  }
};


  const filteredMails = mails.filter((mail) => {
  const category = selectedCategory.toLowerCase();
  const label = selectedLabel;
  
  if (category === 'starred') {
    return mail.isStarred === true;
  }
  const categoryMatch = mail.category?.toLowerCase() === category;
  const labelMatch = !label || (mail.labelId && mail.labelId.includes(label));

  return categoryMatch && labelMatch;
});

  return (
    <div className={`mail-list-wrapper ${themeClass}`}>
     <div className="mail-list-header">
        {/* צד שמאל – רק הכותרת */}
        <div className="header-left">
          <h2 className="header-title">{selectedCategory}</h2>
        </div>

        {/* צד ימין – רענון + bulk actions */}
        <div className="header-actions">
          
            <div className="bulk-actions-buttons">
              {/*               
              {selectedCategory !== 'trash' && (
                <button
                  onClick={() => {
                    selectedMails.forEach((mailId) => {
                      const mail = mails.find((m) => m.id === mailId);
                      if (mail) {
                        toggleStar(mail.id, mail.isStarred);
                      }
                    });
                  }}
                  className="icon-button"
                  aria-label="סמן בכוכב"
                >
                  <Star size={18} />
                </button>
              )} */}
              <div className="relative">
                <button
                  className="icon-button"
                  onClick={() => setShowBulkLabelDropdown(prev => !prev)}
                  aria-label="ניהול תוויות"
                  title="ניהול תוויות"
                >
                  <Tag size={18} />
                </button>

                <LabelDropdown
                  isOpen={showBulkLabelDropdown}
                  onClose={() => setShowBulkLabelDropdown(false)}
                  onAddToLabel={(labelId) => {
                    selectedMails.forEach((id) => togglelabel(id, labelId));
                    clearSelection(); // אופציונלי
                  }}
                  onRemoveFromLabel={(labelName) => {
                    selectedMails.forEach((id) => onRemoveLabelFromMails(id, labelName));
                    clearSelection(); // אופציונלי
                  }}
                  currentLabels={[]} // אפשר להשאיר ריק או לחשב לפי המכנה המשותף בין המיילים
                  position="bottom-left"
                />
              </div>


              <button
                className="icon-button"
                onClick={() => {
                  if (selectedCategory === 'trash') {
                    const mailsToDelete = selectedMails
                      .map((id) => mails.find((m) => m.id === id))
                      .filter(Boolean);
                    handlePermanentDelete(mailsToDelete);
                  } else {
                    selectedMails.forEach((id) => {
                      moveToTrash(id);
                    });
                    clearSelection();
                  }
                }}
                aria-label={selectedCategory === 'trash' ? "מחק לצמיתות" : "העבר לאשפה"}
                title={selectedCategory === 'trash' ? "מחק לצמיתות" : "העבר לאשפה"}
              >
                <Trash2 size={18} />
              </button>

              <button
                onClick={clearSelection}
                className="icon-button"
                aria-label="בטל בחירה"
                title="בטל בחירה"
              >
                <CircleSlash size={18} />
              </button>

              <button
                onClick={() => setSelectedMails(filteredMails.map(m => m.id))}
                className="icon-button"
                aria-label="בחר הכל"
                title="בחר הכל"
              >
                <Circle size={18} />
              </button>
            </div>
          

          <button
            className="icon-button"
            onClick={onRefresh}
            aria-label="רענן מיילים"
            title="רענן מיילים"
          >
            <RefreshCw size={18} />
          </button>
          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="page-arrow"
              title="עמוד קודם"
            >
              <ChevronLeft size={20} />
            </button>

            <span className="page-indicator">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="page-arrow"
              title="עמוד הבא"
            >
              <ChevronRight size={20} />
            </button>
          </div>

        </div>
      </div>


      <div className="mail-list-scroll">
        
        {filteredMails.map((mail) => {
          const isSelected = selectedMail?.id === mail.id;
          const isUnread = !mail.isRead;

          return (
            <div
              key={mail.id}
              onClick={() => onSelect(mail)}
              className={`mail-item 
                ${isSelected ? 'selected' : ''} 
                ${isUnread ? 'unread' : ''} 
                ${mail.spam ? 'spam' : ''}`}
            >
              <div className="mail-item-content">
                <div className="mail-item-meta">
                  <input
                    type="checkbox"
                    checked={selectedMails.includes(mail.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleSelectMail(mail.id);
                    }}
                    onClick={(e) => e.stopPropagation()}

                    className="mail-checkbox"
                  />
                  {mail.category !== 'trash' && (
                    <button
                      className="star-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(mail.id, mail.isStarred);
                      }}
                    >
                      <Star
                        size={16}
                        className={`star-icon ${mail.isStarred ? 'starred' : ''}`}
                      />
                    </button>
                  )}
                  <span className={`mail-sender ${isUnread ? 'bold' : ''}`}>
                    {mail.category === 'inbox' ? (mail.fromMail || 'Unknown') : (mail.toMail || 'Unknown')}
                  </span>

                  <span className={`mail-subject ${isUnread ? 'bold' : ''}`}>
                    {mail.subject}
                  </span>

                  <span className="mail-preview">
                    {mail.preview}
                  </span>

                  <span className="mail-date">
                    {new Date(mail.timestamp).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short"
                    })}
                  </span>
                  {mail.isImportant && <div className="important-dot"></div>}
                </div>
              </div>

                {/* <div className="mail-details">
                  <div className="mail-header">
                    <span className="mail-date">{new Date(mail.timestamp).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short"
                    })}</span>
                  </div>

                  <div className={`mail-subject ${isUnread ? 'bold' : ''}`}>{mail.subject}</div>
                  <div className="mail-preview">{mail.preview}</div>

                  {mail.spam && (
                    <div className="mail-category">
                      <span className="category-label spam">Spam</span>
                    </div>
                  )}

                  {mail.category && !mail.spam && (
                    <div className="mail-category">
                      <span className={`category-label ${mail.category.toLowerCase()}`}>{mail.category}</span>
                    </div>
                  )} */}
                {/* </div> */}
              </div>
          );
        })}
      </div>
    </div>
  );
}

export default MailList;
