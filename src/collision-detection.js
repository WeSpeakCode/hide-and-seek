import Phaser from 'phaser';
import { MINIMUM_DISTANCE_FOR_KILL, MINIMUM_DISTANCE_FOR_VISIBLITY_FOR_PLAYER, MINIMUM_DISTANCE_FOR_VISIBLITY_FOR_IMPOSTER } from './constants'

export const findClosestPlayer = (player, players) => {
    for (let i = 0; i < players.length; i++) {
        let anotherPlayer = players[i];
        if (anotherPlayer.id === player.id) {
            //same player, ignoring
            continue;
        }
        let distance = Phaser.Math.Distance.Between(player.position.x, player.position.y, anotherPlayer.position.x, anotherPlayer.position.y);
        if (distance < MINIMUM_DISTANCE_FOR_KILL) {
            return anotherPlayer;
        }
    }
}

export const isCloseToImposter = (currentPlayer, player) => {
    let distance = Phaser.Math.Distance.Between(player.position.x, player.position.y, currentPlayer.position.x, currentPlayer.position.y);
    if (currentPlayer.imposter) {
        return (distance < MINIMUM_DISTANCE_FOR_VISIBLITY_FOR_PLAYER);
    } else {
        return (distance < MINIMUM_DISTANCE_FOR_VISIBLITY_FOR_IMPOSTER);
    }
}

export const markClosesPlayerVisible = (currentPlayer, players) => {
    for (let i = 0; i < players.length; i++) {
        let player = players[i];
        if (currentPlayer.id === player.id) {
            continue;
        }
        player.setVisiblity(isCloseToImposter(currentPlayer, player));
    }
}