const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origins: ['http://localhost:8081'],
  },
});
const { joinToRoom, leaveRoom, getUsersInRoom, updatePosition } = require('./room-manager')

io.on('connection', (socket) => {
  const room = socket.handshake.query.room;
  const user = socket.handshake.query.user;
  console.log(room);
  joinToRoom(room, { 'id': socket.id, 'name': user });
  socket.join(room);
  io.to(room).emit('playerJoined', {
    id: socket.id
  });

  console.log('player connected');

  io.to(socket.id).emit('roomData', {
    users: getUsersInRoom(room) // get user data based on user's room
  });

  socket.on('disconnect', () => {
    console.log('player disconnected');
    leaveRoom(socket.id);
  });

  socket.on('move', ({ id, position }) => {
    // console.log(`player ${id} moved to ${position.x}`);
    updatePosition(id, position);
    socket.broadcast.emit('move', { id, position });
  });
  socket.on('moveEnd', () => {
    socket.broadcast.emit('moveEnd');
  });
});

http.listen(3000, () => {
  console.log('server listening on localhost:3000');
});
