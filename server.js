const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve static files from public
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  // Join a room for signaling
  socket.on('join', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', socket.id);
  });

  // Relay signaling data (offer/answer/ice) to peers
  socket.on('signal', ({ roomId, data, to }) => {
    if (to) {
      io.to(to).emit('signal', { from: socket.id, data });
    } else if (roomId) {
      socket.to(roomId).emit('signal', { from: socket.id, data });
    }
  });

  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms].filter((r) => r !== socket.id);
    rooms.forEach((roomId) => socket.to(roomId).emit('user-left', socket.id));
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


