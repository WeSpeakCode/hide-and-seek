import Phaser from 'phaser';
import { io } from 'socket.io-client';

import shipImg from './assets/ship.png';
import playerSprite from './assets/player.png';
import ghostSprite from './assets/ghost.png';
import startButtonSprite from './assets/start-button.png'

import Player from './player';

import { movePlayer, movePlayerToPosition } from './movement'
import { initAnimation, animateMovement } from './animations'
import { createPlayer, removePlayer, markPlayerAsImposter } from './player-manager'
import { findClosestPlayer } from './collision-detection'
import { getQueryParameter, getRandomString, updateQueryParameter } from './utils';
import { createAllColorPlayers } from './sprite-helper';

import {
    PLAYER_SPRITE_HEIGHT, PLAYER_SPRITE_WIDTH,
    PLAYER_HEIGHT, PLAYER_WIDTH,
    GHOST_SPRITE_HEIGHT, GHOST_SPRITE_WIDTH,
    PLAYER_START_X, PLAYER_START_Y,
    START_BUTTON_START_X, START_BUTTON_START_Y, START_BUTTON_WIDTH, START_BUTTON_HEIGHT
} from './constants';

var player = new Player();
const allPlayers = [];
let startButton;
var playerImage;
let myGame;
let gameStarted = false;
let killed = false;

let pressedKeys = [];
let socket;
const room = getQueryParameter('room') || getRandomString(5);
const user = getQueryParameter('user') || 'Ram';
window.history.replaceState(
    {},
    document.title,
    updateQueryParameter('room', room),
);

class MyGame extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        this.load.image('ship', shipImg);
        this.load.spritesheet('player', playerSprite, {
            frameWidth: PLAYER_SPRITE_WIDTH,
            frameHeight: PLAYER_SPRITE_HEIGHT,
        });
        this.load.spritesheet('ghost', ghostSprite, {
            frameWidth: GHOST_SPRITE_WIDTH,
            frameHeight: GHOST_SPRITE_HEIGHT,
        });
        this.load.spritesheet('startButtonSprite', startButtonSprite, {
            frameWidth: START_BUTTON_WIDTH,
            frameHeight: START_BUTTON_HEIGHT,
        });
        this.load.image('startButtonSprite', startButtonSprite);

        socket = io(`localhost:3000?room=${room}&user=${user}`);
        socket.on('connect', function () {
            console.log('myID ' + socket.id);
            player.id = socket.id;
        });
        socket.on('move', ({ id, position }) => {
            var otherPlayer = allPlayers.find(u => u.id === id);
            otherPlayer.position = position;

            if (typeof (otherPlayer) !== "undefined") {
                movePlayerToPosition(otherPlayer);
            }
        });
        socket.on('moveEnd', () => {
        });
        socket.on('playerJoined', (user) => {
            console.log('playerJoined ' + user);
            let playerFromLocal = allPlayers.find(p => p.id == user.id);
            console.log(`player joined ${allPlayers.length} ${playerFromLocal}`);
            if (typeof (playerFromLocal) === "undefined") {
                // new player
                var newPlayer = createPlayer(user, this, allPlayers.length);
                allPlayers.push(newPlayer);
                if (player.id === user.id) {
                    player = newPlayer;
                }                      
                movePlayerToPosition(newPlayer);
            } 
        });

        socket.on('playerLeft', (userId) => {
            console.log('player left ' + userId.id);
            removePlayer(userId.id, allPlayers);
        })

        socket.on('roomData', (data) => {
            for (let i = 0; i < data.users.length; i++) {
                let user = data.users[i];
                let playerFromLocal = allPlayers.find(p => p.id == user.id);
                console.log(`room data ${allPlayers.length} ${playerFromLocal}`);
                if (typeof (playerFromLocal) === "undefined") {
                    // new player
                    var newPlayer = createPlayer(user, this, allPlayers.length);
                    allPlayers.push(newPlayer);              
                    if (player.id === user.id) {
                        player = newPlayer;
                    }      
                    movePlayerToPosition(newPlayer);
                } else {
                    console.log('user is already here');
                    playerFromLocal.admin = user.admin;
                    if (player.id == user.id && user.admin === true) {
                        console.log('you are the admin');

                        createStartButton(this);
                    }
                }
            }
        })

        socket.on('onGameStart', (imposter) => {
            console.log(`game start ${imposter.id}`);
            gameStarted = true;
            markPlayerAsImposter(imposter.id, allPlayers);
            if (imposter.id == player.id) {
                console.log('you are the imposter');
                player.imposter = true;
            }
        })

        socket.on('onKill', ({ killer, victim }) => {
            console.log(`killer ${killer} killed victim ${victim}`);
            if (player.id === victim) {
                killed = true;
                console.log(`you are killed`);
                removePlayer(player.id, allPlayers);
                player.sprite.destroy(true);
            }
        })
    }

    create() {
        const ship = this.add.image(0, 0, 'ship');
        console.log('creating all the players');
        createAllColorPlayers(myGame);

        // player.sprite = this.add.sprite(PLAYER_START_X, PLAYER_START_Y, 'player');
        // player.sprite.displayHeight = PLAYER_HEIGHT;
        // player.sprite.displayWidth = PLAYER_WIDTH;

        initAnimation(this);

        this.input.keyboard.on('keydown', (e) => {
            if (!gameStarted)
                return;
            if (!pressedKeys.includes(e.code)) {
                pressedKeys.push(e.code);
            }
        });
        this.input.keyboard.on('keyup', (e) => {
            if (!gameStarted)
                return;
            if (e.code === 'KeyK' && player.imposter) {
                console.log('pressed kill');
                let closestPlayer = findClosestPlayer(player, allPlayers);
                if (closestPlayer !== undefined) {
                    console.log(player.id);
                    console.log(closestPlayer.id);
                    removePlayer(closestPlayer.id, allPlayers);
                    socket.emit('onKill', { killer: player.id, victim: closestPlayer.id });
                }
            }
            pressedKeys = pressedKeys.filter((key) => key !== e.code);
        });
    }

    update() {
        if (killed)
            return;
        if (player.sprite === undefined){
            console.log('player not created yet');
            return;
        }
        this.scene.scene.cameras.main.centerOn(player.sprite.x, player.sprite.y);
        let playerMoved = movePlayer(pressedKeys, player);
        if (playerMoved) {
            socket.emit('move', { id: player.id, position: { x: player.sprite.x, y: player.sprite.y } });
            player.movedLastFrame = true;
        } else {
            if (player.movedLastFrame) {
                socket.emit('moveEnd');
            }
            player.movedLastFrame = false;
        }
        animateMovement(pressedKeys, player.sprite);
    }
}

function createStartButton(scene) {
    startButton = scene.add.image(START_BUTTON_START_X, START_BUTTON_START_Y, 'startButtonSprite');
    startButton.setInteractive({ useHandCursor: true });
    startButton.on('pointerover', function () {
        console.log('point over');
        this.setScale(1.25);
    });
    startButton.on('pointerout', function () {
        this.setScale(1);
    });
    startButton.on('pointerdown', function () {
        startButton.visible = false;
        socket.emit('onGameStart');
    });
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: MyGame
};

myGame = new Phaser.Game(config);
