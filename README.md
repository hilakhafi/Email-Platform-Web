# Project4

# Advanced Email System – Project 4 (Client + Backend)
## Advanced Systems Programming Course

---

## Overview
This project extends **Project 3** by adding a full-featured **React** client for managing users, emails, labels, and blacklist filtering.  
It connects to the **Node.js** backend from Project 3 (Part 1), which communicates via **TCP socket** with the **C++ blacklist server** from Project 2.
This system demonstrates advanced full-stack development with React, Node.js, and C++ integration.  
All components work together to provide a complete email management solution.

---

## Architecture
```
┌─────────────────────┐       ┌────────────────────────────┐       ┌─────────────────────────────┐
│  React Client (3000)│ ───►  │ Node.js API Server (4000)  │ ◄──► │ C++ TCP Blacklist Server    │
│                     │       │                            │       │        (8080)              │
└─────────────────────┘       └────────────────────────────┘       └─────────────────────────────┘
```
- **React frontend** communicates with Node.js via REST API
- **Node.js backend** communicates with C++ server via raw TCP
- All parts run in Docker/networked setup

---

## Features

### General
- Modular React UI using Hooks, Router, and Context
- Light/Dark theme toggle with persistent settings
- SPA: no full page reloads
- Responsive design (Gmail-style interface)

### Authentication
- Register & log in with comprehensive form validation
- JWT-based session management with middleware protection
- Auth-protected routes with automatic redirect
- Profile management with image upload

### Email Management
- **Compose & Send**: Rich text editor with file attachment support
- **Read & Organize**: Mark as read/unread, star/unstar emails
- **Categories**: Inbox, Sent, Drafts, Starred, Spam, Trash
- **Delete Operations**: Soft delete (move to trash) and permanent deletion
- **Restore**: Recover emails from trash to original location
- **Pagination**: 50 emails per page with navigation controls
- **Search**: Advanced search by subject, content, sender, date, recipient
- **Reply & Forward**: Support for replying and forwarding emails with attachments
- **Draft Management**: Auto-save to drafts when canceling compose

### File Attachments
- **Upload Support**: Multiple file attachments with progress tracking
- **File Validation**: Size limits (10MB max) and type validation
- **Attachment Management**: Remove/add attachments during compose
- **Forward Attachments**: Preserve attachments when forwarding emails
- **Download Support**: Download attachments from received emails

### Labels System
- Create, edit, and delete custom labels
- Apply multiple labels to emails
- Filter emails by labels
- Bulk label operations
- Color-coded label system

### Spam Filtering
- **Real-time Blacklist Check**: Integration with C++ blacklist server via TCP
- **Automatic Spam Detection**: Emails with blacklisted URLs automatically marked as spam
- **Manual Spam Management**: Users can mark emails as spam (adds URLs to blacklist)
- **Spam Recovery**: Spam emails can be restored and URLs removed from blacklist
- **Blacklist Persistence**: Blacklist data persists across server restarts

### User Profile
- Profile modal with editable fields (name, username, birth date, gender)
- Profile image upload with preview and file validation
- Account settings and preferences
- Secure logout functionality

---

## Running the System

### Step 1: Run Backend Services
```bash
docker-compose up --build
```

### Step 2:Access the application: 
**[http://localhost:3000](http://localhost:3000)**

---

## Multi-User Functionality

- Supports multiple users simultaneously, each with isolated sessions and state.
- Users can register and log in with unique credentials.
- Emails sent by one user appear instantly in the recipient’s inbox.
- Each user only sees their own emails, labels, and profile data.
- All mailbox categories — **Inbox**, **Sent**, **Drafts**, **Starred**, **Spam**, and **Trash** — are scoped per user.
- Works seamlessly across multiple browsers or incognito windows, enabling true parallel usage without session conflict.

---
### Security Considerations
- JWT token validation through `authenticateToken.js` middleware
- Uses hardcoded secret key `'secretkeyHHE'` for token verification
- Bearer token authentication on protected routes with 401/403 error handling
- Basic JWT signature verification to prevent token tampering

## Project Structure
```
Project4/
├── part1/                          # Backend Services
│   ├── project3/                   # Node.js API server
│   │   ├── server.js               # Main server file
│   │   ├── routes/                 # API routes
│   │   ├── models/                 # Database models
│   │   ├── middleware/             # Authentication middleware
│   │   │   └── auth.js             # JWT token validation
│   │   └── uploads/                # File storage
│   └── project2/                   # C++ blacklist server
│       ├── blacklist_server.cpp    # TCP server implementation
│       └── Dockerfile              # C++ server container
│
├── part2/project4/client/           # React Frontend
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── ComposeModal.js      # Email composition
│   │   │   ├── AttachmentsList.js   # Attachment management
│   │   │   └── ...
│   │   ├── hooks/                   # Custom React hooks
│   │   │   └── useFileUpload.js     # File upload logic
│   │   ├── styles/                  # CSS styling
│   │   ├── utils/                   # Utility functions
│   │   └── App.js                   # Main application
│   ├── public/                      # Static assets
│   └── package.json                 # Dependencies
│└── ...
└── README.md                        # This file
├── docker-compose.yml               # Docker orchestration

```
### screenshoots
![Screenshot 2025-06-19 234837](https://github.com/user-attachments/assets/97ed229e-1144-4ea1-b450-667c276a5818)
![Screenshot 2025-06-19 235103](https://github.com/user-attachments/assets/0bab09e8-8f7e-49db-bd8f-77b0ce0e3b09)
![Screenshot 2025-06-19 235054](https://github.com/user-attachments/assets/a02b5a29-f724-45ae-9706-bd76a0301c14)
![Screenshot 2025-06-19 235045](https://github.com/user-attachments/assets/c9cc88ac-6929-4fdc-94e7-914f032c1b7b)
![image](https://github.com/user-attachments/assets/0a44699b-f63f-48e4-beb3-c88238aaf72b)
