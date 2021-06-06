import Player from './player'
import {
    PLAYER_SPRITE_HEIGHT,
    PLAYER_SPRITE_WIDTH,
    PLAYER_HEIGHT,
    PLAYER_WIDTH,
    PLAYER_START_X,
    PLAYER_START_Y,
} from './constants';
import playerSprite from './assets/player.png';

export const createPlayer = (userId, scene) => {
    console.log(`creating player with id ${userId}`);
    console.log(scene);
    var player = new Player();
    player.id = userId;
    player.sprite = scene.add.sprite(PLAYER_START_X + Math.floor(Math.random() * 10), PLAYER_START_Y, 'player');
    player.sprite.displayHeight = PLAYER_HEIGHT;
    player.sprite.displayWidth = PLAYER_WIDTH;    
    return player;
}

export const removePlayer = (userId, players) => {
    console.log(`removing player ${userId}`);
    players.find(u => u.id === userId).sprite.destroy(true);
    players = players.filter(u => u.id === userId);
}

export const markPlayerAsImposter = (userId, players) => {
    let player = players.find(u => u.id === userId);
    player.imposter = true;
    var index = players.findIndex(p => p.id == userId);
    players[index] = player;
    return player;
}
