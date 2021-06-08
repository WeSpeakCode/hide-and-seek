import Phaser from 'phaser';
import { MINIMUM_DISTANCE_FOR_KILL } from './constants'

export const findClosestPlayer = (player, players) => {
    for (let i = 0; i < players.length; i++) {
        let anotherPlayer = players[i];
        if (anotherPlayer.id === player.id) {
            //same player, ignoring
            continue;
        }
        let distance = Phaser.Math.Distance.Between(player.sprite.x, player.sprite.y, anotherPlayer.sprite.x, anotherPlayer.sprite.y);
        if (distance < MINIMUM_DISTANCE_FOR_KILL) {
            return anotherPlayer;
        }
    }
}