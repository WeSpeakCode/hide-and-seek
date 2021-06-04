import { PLAYER_SPEED, SHIP_HEIGHT, SHIP_WIDTH } from './constants';
import { shipBounds } from './ship-bounds';

const isPositionWithInBoundaries = (x, y) => {
    return !shipBounds[y] ? true : !shipBounds[y].includes(x);
}

export const movePlayer = (keys, player) => {
    let isMoved = false;
    const absPlayerX = player.x + SHIP_WIDTH / 2;
    const absPlayerY = player.y + SHIP_HEIGHT / 2 + 20;

    if (keys.includes('ArrowUp') && isPositionWithInBoundaries(absPlayerX, absPlayerY - PLAYER_SPEED)) {
        player.y = player.y - PLAYER_SPEED;
        isMoved = true;
    }
    if (keys.includes('ArrowDown') && isPositionWithInBoundaries(absPlayerX, absPlayerY + PLAYER_SPEED)) {
        player.y = player.y + PLAYER_SPEED;
        isMoved = true;
    }
    if (keys.includes('ArrowLeft') && isPositionWithInBoundaries(absPlayerX - PLAYER_SPEED, absPlayerY)) {
        player.x = player.x - PLAYER_SPEED;
        isMoved = true;
        player.flipX = true;
    }
    if (keys.includes('ArrowRight') && isPositionWithInBoundaries(absPlayerX + PLAYER_SPEED, absPlayerY)) {
        player.x = player.x + PLAYER_SPEED;
        isMoved = true;
        player.flipX = false;
    }
    return isMoved;
};