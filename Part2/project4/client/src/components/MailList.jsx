import React from 'react';
import { Mail, Star, RefreshCw, MoreHorizontal, CircleSlash, Trash2 } from 'lucide-react';
import '../styles/MailList.css';


function MailList({ mails, selectedMail, onSelect, loading, error, darkMode, selectedCategory, onRefresh, toggleStar, moveToTrash, handlePermanentDelete, moveToSpam }) {
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
             {selectedMail && selectedCategory !== 'Trash' && !selectedMail.spam && (
              <button
                className="spam-action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  moveToSpam(selectedMail.id);
                }}
                aria-label="סמן כספאם"
                title="סמן כספאם"
              >
                <CircleSlash size={20} />
              </button>
            )}

            {selectedCategory === 'Trash' && selectedMail && (
              <button
                className="permanent-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePermanentDelete(selectedMail.id);
                }}
                aria-label="מחק לצמיתות"
                title="מחק לצמיתות"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
          <div className="header-actions">
            <button
              className="icon-button"
              onClick={onRefresh}
              aria-label="רענן מיילים"
            >
              <RefreshCw size={18} />
            </button>
            <button className="icon-button">
              <MoreHorizontal size={18} />
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

  return (
    <div className={`mail-list-wrapper ${themeClass}`}>
      <div className="mail-list-header">
        <div className="header-left">
          <h2 className="header-title">{selectedCategory}</h2>
          {selectedMail && selectedCategory !== 'Trash' && !selectedMail.spam && (
              <button
                className="spam-action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  moveToSpam(selectedMail.id);
                }}
                aria-label="סמן כספאם"
                title="סמן כספאם"
              >
                <CircleSlash size={20} />
              </button>
            )}
          {selectedCategory === 'Trash' && selectedMail && (
            <button
              className="permanent-delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                handlePermanentDelete(selectedMail.id);
              }}
              aria-label="מחק לצמיתות"
              title="מחק לצמיתות"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
        <div className="header-actions">
          <button
            className="icon-button"
            onClick={onRefresh}
            aria-label="רענן מיילים"
          >
            <RefreshCw size={18} />
          </button>
          <button className="icon-button">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      <div className="mail-list-scroll">
        {mails.map((mail) => {
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
                  <button
                    className="trash-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveToTrash(mail.id);
                    }}
                  >
                    <Trash2 size={20} />
                  </button>

                  {mail.isImportant && <div className="important-dot"></div>}
                </div>

                <div className="mail-details">
                  <div className="mail-header">
                    <span className={`mail-sender ${isUnread ? 'bold' : ''}`}>{mail.from}</span>
                    <span className="mail-date">{mail.date}</span>
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
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MailList;