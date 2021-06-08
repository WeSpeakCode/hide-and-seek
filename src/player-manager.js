import Player from './classes/player'
import {
    PLAYER_HEIGHT,
    PLAYER_WIDTH,
    PLAYER_START_X,
    PLAYER_START_Y,
} from './constants';

export const createPlayer = (scene, user) => {
    console.log(`creating player with id ${user.id} name: ${user.name} color:${user.color}`);
    var player = new Player(scene, user);
    
    // var player = new Player();
    // player.id = user.id;
    // player.position = user.position;
    // player.color = user.color;
    // player.sprite = scene.add.sprite(PLAYER_START_X, PLAYER_START_Y, 'player-' + user.color).setScale(0.5);
    // player.sprite.displayHeight = PLAYER_HEIGHT;
    // player.sprite.displayWidth = PLAYER_WIDTH;
    return player;
}

export const removePlayer = (userId, players) => {
    console.log(`removing player ${userId}`);
    players.find(u => u.id === userId).destroy(true);
    players = players.filter(u => u.id === userId);
}

export const markPlayerAsImposter = (userId, players) => {
    let player = players.find(u => u.id === userId);
    player.imposter = true;
    var index = players.findIndex(p => p.id == userId);
    players[index] = player;
    return player;
}
