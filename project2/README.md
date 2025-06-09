# URL Blacklist TCP Server-Client System

## Overview

This project extends Part A by transforming the standalone Bloom Filter URL blacklist system into a **TCP-based client-server architecture**.

- The **server** is written in C++ and contains all the business logic: managing the Bloom Filter, exact blacklist, and handling commands.
- The **client** is written in Python 3 and serves as a dumb interface: it reads user input from the console, sends it to the server, and prints the server's response.

The system uses a persistent connection via a TCP socket. The server listens for commands and responds according to strict protocol rules.

---

## Architecture

```
+-----------+       TCP        +-----------+
|  Python   | <-------------> |   C++      |
|  Client   |   socket comm.  |   Server   |
+-----------+                 +-----------+
```

- The server receives and responds to commands via the socket only.
- Commands end with a newline (`\n`), and all responses from the server also end with a newline.
- The connection remains open throughout the client's runtime; commands are sent over the same socket.

---

## Server Commands

The server accepts the following commands:

| Command Type | Format                            | Description                        | Server Response                  |
|--------------|-----------------------------------|------------------------------------|----------------------------------|
| `POST`       | `POST <URL>`                      | Adds URL to blacklist              | `201 Created\n`                  |
| `DELETE`     | `DELETE <URL>`                    | Removes URL from exact blacklist   | `204 No Content\n`               |
| `GET`        | `GET <URL>`                       | Checks if URL is blacklisted       | `200 Ok\n\n<true/false>\n`       |
| Invalid URL  | Any logical error (e.g., DELETE non-existing URL) | | `404 Not Found\n`        |
| Invalid Cmd  | Unknown command / wrong format    |                                    | `400 Bad Request\n`              |

---

## Usage

### Server & Client – Using Docker Compose

The system uses Docker Compose to build and run both the server (C++) and the client (Python).

#### 1. Build and start the containers:

```bash
docker-compose up --build
```
This command builds the server and client images and starts the containers.

#### 2. Run the client and connect to the server:

```bash
docker-compose exec client python client.py server 8080
```
This runs the Python client inside the client container and connects it to the server container.

## Project Structure

<pre lang="markdown"> ```bash . ├── docker-compose.yml # Docker Compose configuration file ├── src/ │ └── server/ # C++ server implementation │ ├── main.cpp │ ├── server.cpp │ ├── ... │ └── Dockerfile ├── src/client/ # Python client │ ├── client.py │ └── Dockerfile ├── data/ # Runtime data directory (e.g., bloom.dat, blacklist.txt) └── tests/ # Unit tests (Google Test) ``` </pre>


## Design Notes & SOLID Reflection

We followed **SOLID principles** and ensured **low coupling** to facilitate change and extension. Here's how we addressed backward compatibility:

### ✅ Command Format Change (e.g., `1` → `POST`)

**Status:** No core logic change required  
**Why:**  
Command parsing is handled by a modular `CommandProcessor` class using a polymorphic interface. New command names are interpreted without changing core functionality.

### ✅ New Commands (`DELETE`)

**Status:** Added via extension  
**Why:**  
`CommandHandler` is implemented via an interface (`ICommand`). We simply added a `DeleteCommand` class without touching existing commands.

### ✅ Response Format Change

**Status:** Minimal updates  
**Why:**  
Response formatting is abstracted into a response builder. The logic generating HTTP-like responses is decoupled from command execution.

### ✅ Switching from Console to Socket I/O

**Status:** No core logic modified  
**Why:**  
I/O is abstracted into an `IInputOutput` interface. Switching from console-based to socket-based communication was done by plugging in a new implementation.

### ✅ Future Extension – Multi-client Support

**Status:** Core logic is ready  
**Why:**  
The server processes one client at a time now, but the `ConnectionHandler` is isolated. Future concurrent handling (e.g., threads or async) can wrap this layer without modifying business logic.

---

## Key Features

- TCP client-server model
- Persistent URL blacklist using Bloom Filter
- Full support for `POST`, `DELETE`, and `GET`
- Strict input/output formatting
- Easily extensible architecture (new commands, I/O modes)
- Built with SOLID and TDD principles

--- 
## Screenshots
![IMG-20250511-WA0040 1](https://github.com/user-attachments/assets/90ddde2e-5299-47c2-9898-f1269892397e)
![Screenshot 2025-05-11 163956](https://github.com/user-attachments/assets/5317a154-204f-4c1b-9293-15b15923f6b0)

