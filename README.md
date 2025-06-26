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
![Screenshot 2025-06-25 143417](https://github.com/user-attachments/assets/c7405407-f414-490e-adca-cbf9506b6b76)
![Screenshot 2025-06-25 143431](https://github.com/user-attachments/assets/51dbf734-e8d1-4263-b035-fb7b5489e895)
![Screenshot 2025-06-25 143449](https://github.com/user-attachments/assets/5e29e10c-e767-4d3a-8e4f-288feaeb7c6e)
![Screenshot 2025-06-25 143846](https://github.com/user-attachments/assets/dbb2aefd-399d-4955-becf-1ec84ac8befb)
![Screenshot 2025-06-25 143914](https://github.com/user-attachments/assets/f0ce5c88-7d18-4b16-8895-63edc3eb294b)
![Screenshot 2025-06-25 143923](https://github.com/user-attachments/assets/322eaaf2-60b0-408a-9c1e-a1498d6186e7)
![Screenshot 2025-06-25 143948](https://github.com/user-attachments/assets/49290956-7bfd-4909-a3c3-e66cb60c7c51)
![Screenshot 2025-06-25 144002](https://github.com/user-attachments/assets/7539c268-be9d-44c0-9960-4a04267b8869)
![image](https://github.com/user-attachments/assets/b2a476b8-0f1b-4f67-8a9d-9ae5934d52d3)
![image](https://github.com/user-attachments/assets/ce757400-e665-48c8-a6ea-bb3d1a774e80)
![Screenshot 2025-06-25 144044](https://github.com/user-attachments/assets/d9f8f11a-5e34-4d2f-8d0f-607d544524bb)
![Screenshot 2025-06-25 144102](https://github.com/user-attachments/assets/dad2f9a2-0b59-450e-9d9a-7850c7bd5eb5)

