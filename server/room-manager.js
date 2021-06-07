var connectedUsers = [];
const colorKeys = ['red', 'brown', 'orange', 'yellow', 'pink', 'purple', 'blue', 'cyan', 'green', 'lime', 'white', 'black'];

const joinToRoom = (room, user) => {
    console.log('current users');
    console.log(user);
    if (connectedUsers.includes(u => u.id === user.id)) {
        //same id exists already
        return;
    }
    if (connectedUsers.includes(u => u.name === user.name && u.room === user.room)) {
        console.log('user already exists');
        return { error: 'user already exists' };
    } else {
        user.room = room;
        if (connectedUsers.length == 0) {
            // first user, admin
            user.admin = true;
        } else {
            user.admin = false;
        }
        user.color = colorKeys[connectedUsers.length % colorKeys.length];
        connectedUsers.push(user);
        return user;
    }
}

const leaveRoom = (userId) => {
    connectedUsers = connectedUsers.filter(u => u.id !== userId);
    return connectedUsers.length > 0;
}

const getUsersInRoom = (room) => {
    console.log('connectedUsers');
    console.log(connectedUsers);
    console.log(connectedUsers.filter(u => u.room === room));
    return connectedUsers.filter(u => u.room === room);
}

const updatePosition = (userId, position) => {
    var user = connectedUsers.find(u => u.id === userId);
    user.position = position;
}

const makeSomeoneImposter = () => {
    console.log(connectedUsers.length);
    let randomIndex = Math.floor(Math.random() * connectedUsers.length);
    console.log(`random index ${randomIndex}`);
    return connectedUsers[randomIndex];
}

module.exports = { joinToRoom, leaveRoom, getUsersInRoom, updatePosition, makeSomeoneImposter };