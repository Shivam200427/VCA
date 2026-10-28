# Video Call App

A lightweight browser-based video calling application built with **WebRTC**, **Node.js**, **Express**, and **Socket.IO**. Users can join the same room to share audio and video in real time, and can upload and share PDF reports with other participants.

## Features

- Peer-to-peer audio and video calling with WebRTC
- Room-based calls using a shared Room ID
- Real-time signaling with Socket.IO
- PDF report uploads up to 10 MB
- PDF report sharing with participants in the same room
- Shared report history retained while the server is running
- Responsive browser-based interface

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript, WebRTC
- **Backend:** Node.js, Express
- **Real-time communication:** Socket.IO
- **File uploads:** Multer

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- A modern browser with WebRTC support

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Shivam200427/VCA.git
   cd VCA
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1. Open the application in two or more browser tabs or devices.
2. Enter the same Room ID in each browser.
3. Click **Join** and allow camera and microphone access when prompted.
4. Use the PDF upload form to upload a report.
5. Uploaded reports are shared with other users in the same room.

> For local testing, all participants must be connected to the same server. Camera and microphone permissions may require HTTPS when deployed outside of localhost.

## Project Structure

```text
VCA/
├── public/
│   ├── index.html    # Application interface
│   ├── script.js     # WebRTC and Socket.IO client logic
│   └── style.css     # Application styles
├── server.js         # Express server and Socket.IO signaling
├── package.json       # Project metadata and dependencies
└── uploads/           # Uploaded PDF files, created at runtime
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm install` | Install project dependencies |
| `npm start` | Start the production server |
| `npm run dev` | Start the server with automatic restarts using Nodemon |

## Configuration

The server listens on port `3000` by default. To use a different port, set the `PORT` environment variable:

```bash
PORT=5000 npm start
```

## Notes

- Signaling data is handled by the server, while media is exchanged peer-to-peer through WebRTC.
- Uploaded files are stored locally in the `uploads/` directory.
- Shared report history is kept in memory and is cleared when the server restarts.
- Only PDF files are accepted, with a maximum file size of 10 MB.

## License

This project does not currently specify a license.
