import { useState } from 'react';

function useFileUpload(maxSizeInMB = 10) {
  const [attachments, setAttachments] = useState([]);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    
    // בדיקת גודל קבצים
    const maxSize = maxSizeInMB * 1024 * 1024; // המרה ל-bytes
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSizeInMB}MB.`);
        return false;
      }
      return true;
    });

    // הוספת קבצים חדשים לרשימה
    setAttachments(prev => [...prev, ...validFiles]);
    
    // איפוס ה-input
    event.target.value = '';
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const clearAttachments = () => {
    setAttachments([]);
  };

  return {
    attachments,
    handleFileUpload,
    removeAttachment,
    clearAttachments
  };
}

export default useFileUpload;