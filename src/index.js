import Phaser from 'phaser';
import { io } from 'socket.io-client';

import shipImg from './assets/ship.png';
import playerSprite from './assets/player.png';
import ghostSprite from './assets/ghost.png';

import Player from './player';

import { movePlayer, movePlayerToPosition } from './movement'
import { initAnimation, animateMovement } from './animations'
import { createPlayer, removePlayer } from './player-manager'
import {
    getQueryParameter,
    getRandomString,
    updateQueryParameter,
    comparer
} from './utils';
import {
    PLAYER_SPRITE_HEIGHT,
    PLAYER_SPRITE_WIDTH,
    PLAYER_HEIGHT,
    PLAYER_WIDTH,
    GHOST_SPRITE_HEIGHT,
    GHOST_SPRITE_WIDTH,
    PLAYER_START_X,
    PLAYER_START_Y,
} from './constants';

const player = new Player();
const otherPlayers = [];

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
        console.log(player.name);
        this.load.image('ship', shipImg);
        this.load.spritesheet('player', playerSprite, {
            frameWidth: PLAYER_SPRITE_WIDTH,
            frameHeight: PLAYER_SPRITE_HEIGHT,
        });
        this.load.spritesheet('ghost', ghostSprite, {
            frameWidth: GHOST_SPRITE_WIDTH,
            frameHeight: GHOST_SPRITE_HEIGHT,
        });

        socket = io(`localhost:3000?room=${room}&user=${user}`);
        socket.on('connect', function () {
            console.log('myID ' + socket.id);
            player.id = socket.id;
        });
        socket.on('move', ({ id, position }) => {
            var otherPlayer = otherPlayers.find(u => u.id === id);
            // console.log(otherPlayer);
            // console.log(id);
            // console.log(otherPlayers);

            if (typeof (otherPlayer) !== "undefined") {
                movePlayerToPosition(otherPlayer, position);
            }
        });
        socket.on('moveEnd', () => {
            //console.log(otherPlayers);
            //console.log('player move end');
        });
        socket.on('playerJoined', (userId) => {
            console.log('playerJoined ' + userId);
            let player = createPlayer(userId.id, this);
            otherPlayers.push(player);
        });

        socket.on('playerLeft', (userId) => {
            console.log('player left ' + userId.id);
            removePlayer(userId.id, otherPlayers);
        })

        socket.on('roomData', (data) => {
            console.log('room data');
            console.log(data.users);
            console.log(otherPlayers);
            var newPlayers = data.users.filter(comparer(otherPlayers));
            if (typeof (newPlayers) !== "undefined") {
                for (let i = 0; i < newPlayers.length; i++) {
                    console.log(newPlayers[i]);
                    var newPlayer = createPlayer(newPlayers[i].id, this);
                    otherPlayers.push(newPlayer);
                    var position = newPlayers[i].position;
                    if (typeof (position) === 'undefined') {
                        position = { x: PLAYER_START_X, y: PLAYER_START_Y };
                    }
                    movePlayerToPosition(newPlayer, { x: position.x, y: position.y });
                }
            }
            console.log(`newPlayers ${newPlayers}`);
        })
    }

    create() {
        const ship = this.add.image(0, 0, 'ship');

        player.sprite = this.add.sprite(PLAYER_START_X, PLAYER_START_Y, 'player');
        player.sprite.displayHeight = PLAYER_HEIGHT;
        player.sprite.displayWidth = PLAYER_WIDTH;

        initAnimation(this);

        this.input.keyboard.on('keydown', (e) => {
            if (!pressedKeys.includes(e.code)) {
                pressedKeys.push(e.code);
            }
        });
        this.input.keyboard.on('keyup', (e) => {
            pressedKeys = pressedKeys.filter((key) => key !== e.code);
        });
    }

    update() {
        this.scene.scene.cameras.main.centerOn(player.sprite.x, player.sprite.y);
        let playerMoved = movePlayer(pressedKeys, player);
        if (playerMoved) {
            socket.emit('move', { id: player.id, position: { x: player.sprite.x, y: player.sprite.y } });
            player.movedLastFrame = true;
            //console.log(`moving player ${player.id}`);
        } else {
            if (player.movedLastFrame) {
                // console.log(player.sprite);
                // console.log('x: ' + player.sprite.x + ' y: ' + player.sprite.y);
                // console.log('x: ' + otherPlayers[0].sprite.x + ' y: ' + otherPlayers[0].sprite.y);
                // console.log('visible: ' + player.sprite.visible + ' in camera: ' + player.sprite.inCamera);
                // console.log('visible: ' + otherPlayers[0].sprite.visible + ' in camera: ' + otherPlayers[0].sprite.inCamera);
                socket.emit('moveEnd');
            }
            player.movedLastFrame = false;
        }
        animateMovement(pressedKeys, player.sprite);
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: MyGame
};

const game = new Phaser.Game(config);
