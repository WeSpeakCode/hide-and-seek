const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origins: ['http://localhost:8081'],
  },
});
const { joinToRoom, leaveRoom, getUsersInRoom, updatePosition, makeSomeoneImposter } = require('./room-manager')

io.on('connection', (socket) => {
  const room = socket.handshake.query.room;
  const user = socket.handshake.query.user;
  console.log(room);
  let playerJoined = joinToRoom(room, { 'id': socket.id, 'name': user });
  socket.join(room);

  setTimeout(() => {
    io.to(room).emit('playerJoined', playerJoined);

    console.log('player connected');
  
    socket.emit('roomData', {
      users: getUsersInRoom(room) // get user data based on user's room
    });
  }, 1000)//HACK: the sprite is not drawn without the delay

  socket.on('disconnect', () => {
    console.log('player disconnected');
    let roomAvailable = leaveRoom(socket.id);
    if (roomAvailable) {
      io.to(room).emit('playerLeft', {
        id: socket.id
      });
    }
  });

  socket.on('move', ({ id, position }) => {
    // console.log(`player ${id} moved to ${position.x}`);
    updatePosition(id, position);
    socket.broadcast.emit('move', { id, position });
  });
  socket.on('moveEnd', () => {
    socket.broadcast.emit('moveEnd');
  });
  socket.on('onGameStart', () => {
    console.log('on game start');
    let imposter = makeSomeoneImposter();
    console.log(imposter);
    io.to(room).emit('onGameStart', imposter);
  });
  socket.on('onKill', (evidence) => {
    console.log(evidence);
    socket.broadcast.emit('onKill', evidence);
  })

});

http.listen(3000, () => {
  console.log('server listening on localhost:3000');
});
