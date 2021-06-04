import { PLAYER_SPEED, SHIP_HEIGHT, SHIP_WIDTH } from './constants';

export const movePlayer = (keys, player) => {
    let isMoved = false;
    if (keys.includes('ArrowUp')) {
        console.log(`player y ${player.y}`)
        console.log('moving up');
        player.y = player.y - PLAYER_SPEED;
        isMoved = true;
    }
    if (keys.includes('ArrowDown')) {
        player.y = player.y + PLAYER_SPEED;
        isMoved = true;
    }
    if (keys.includes('ArrowLeft')) {
        player.x = player.x - PLAYER_SPEED;
        isMoved = true;
        player.flipX = true;
    }
    if (keys.includes('ArrowRight')) {
        player.x = player.x + PLAYER_SPEED;
        isMoved = true;
        player.flipX = false;
    }
    return isMoved;
};