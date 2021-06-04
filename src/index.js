import Phaser from 'phaser';
import shipImg from './assets/ship.png';
import playerSprite from './assets/player.png';
import { movePlayer } from './movement'
import { initAnimation, animateMovement } from './animations'

import {
    PLAYER_SPRITE_HEIGHT,
    PLAYER_SPRITE_WIDTH,
    PLAYER_HEIGHT,
    PLAYER_WIDTH,
    PLAYER_START_X,
    PLAYER_START_Y,
} from './constants';

const player = {};

let pressedKeys = [];

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
    }

    create() {
        const ship = this.add.image(0, 350, 'ship');

        player.sprite = this.add.sprite(PLAYER_START_X, PLAYER_START_Y, 'player');
        player.sprite.displayHeight = PLAYER_HEIGHT;
        player.sprite.displayWidth = PLAYER_WIDTH;

        console.log(this);        
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
        let playerMoved = movePlayer(pressedKeys, player.sprite);
        if (playerMoved) {
            player.movedLastFrame = true;
        } else {
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
