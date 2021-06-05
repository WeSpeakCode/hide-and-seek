var connectedUsers = [];

const joinToRoom = (room, user) => {
    console.log(user);
    if (connectedUsers.includes(u => u.name === user.name && u.room === user.room)) {
        console.log('user already exists');
        return { error: 'user already exists' };
    } else {
        user.room = room;
        connectedUsers.push(user);
    }
}

const leaveRoom = (userId) => {
    connectedUsers = connectedUsers.filter(u => u.id !== userId);
}

const getUsersInRoom = (room) => {
    console.log(connectedUsers);
    console.log(connectedUsers.filter(u => u.room === room));
    return connectedUsers.filter(u => u.room === room);
}

const updatePosition = (userId, position) => {
    var user = connectedUsers.find(u => u.id === userId);
    user.position = position;
}

module.exports = { joinToRoom, leaveRoom, getUsersInRoom, updatePosition };