# 🕵️‍♂️ SimpC2 – Java C2 Server (Command & Control)

This is a basic Command and Control (C2) server implemented in **Java** using raw TCP sockets and a minimal **HTTP API**. It is designed to receive check-ins from bot clients and store their information in a **PostgreSQL** database. The stored data can be retrieved via a simple HTTP interface.

---

## 🚀 Features

- 📡 **TCP Server**: Accepts incoming connections from bots and receives system information.
- 🗃️ **PostgreSQL Integration**: Saves bot check-in data and updates existing entries on MAC address conflict.
- 🌐 **HTTP API**: Serves a RESTful JSON endpoint (`/api/bots`) listing all bot check-ins.
- 🧱 **Minimal Dependencies**: Uses standard Java libraries (`com.sun.net.httpserver`)—no external frameworks.

---

## 🛠️ Tech Stack

- Java SE 8+
- PostgreSQL
- Java HttpServer (built-in)

---

## 🗃️ Database Setup

Ensure PostgreSQL is running and accessible. Create a database and table using:

```sql
CREATE DATABASE c2db;

\c c2db

CREATE TABLE bot_checkins (
    host_name TEXT,
    os TEXT,
    architecture TEXT,
    mac_address TEXT PRIMARY KEY,
    ip_address TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## ⚙️ Running the Server

1. Update database credentials in `C2Server.java`  
   (look for `DriverManager.getConnection(...)`).

2. Compile and run:

```bash
javac C2Server.java
java C2Server
```

- TCP server will listen on **port 9000**  
- HTTP API server will run on **port 8080**

---

## 🖥️ Running the Web UI

```bash
npm install
npm run dev
```

- The frontend will start on the default port (usually `http://localhost:3000`).
- Make sure it is configured to call the backend API at `http://localhost:8080/api/bots` or wherever your C2 server is running.

> Note: You may need to configure proxy settings or CORS headers if accessing from a different origin.
![Web ui](https://github.com/user-attachments/assets/cbf692b9-0247-40cb-bc8c-e685d8f5a70f)

---

## 🤖 Bot Communication Protocol

Bots must connect via **TCP port 9000** and send the following **5 lines**, each terminated with a newline (`\n`):

```
<host_name>
<os>
<architecture>
<mac_address>
```

> The server captures the IP address automatically from the socket connection.

---

## 📡 HTTP API Usage

- **Endpoint**: `GET http://<server-ip>:8080/api/bots`
- **Response**: JSON array of all bot check-ins

Example response:

```json
[
  {
    "host_name": "Bot-PC",
    "os": "Windows 10",
    "architecture": "x64",
    "mac_address": "00:11:22:33:44:55",
    "ip_address": "192.168.1.101",
    "timestamp": "2025-06-13 14:22:00"
  }
]
```
