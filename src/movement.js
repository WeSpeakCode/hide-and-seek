import { SHIP_HEIGHT, SHIP_WIDTH, PLAYER_START_X, PLAYER_START_Y } from './constants';
import { shipBounds } from './ship-bounds';

const isPositionWithInBoundaries = (x, y) => {
    return !shipBounds[y] ? true : !shipBounds[y].includes(x);
}

export const movePlayer = (keys, player) => {
    var position = player.position;
    let isMoved = false;
    const absPlayerX = position.x + SHIP_WIDTH / 2;
    const absPlayerY = position.y + SHIP_HEIGHT / 2 + 20;

    if (keys.includes('ArrowUp') && isPositionWithInBoundaries(absPlayerX, absPlayerY - player.speed)) {
        position.y = position.y - player.speed;
        isMoved = true;
    }
    if (keys.includes('ArrowDown') && isPositionWithInBoundaries(absPlayerX, absPlayerY + player.speed)) {
        position.y = position.y + player.speed;
        isMoved = true;
    }
    if (keys.includes('ArrowLeft') && isPositionWithInBoundaries(absPlayerX - player.speed, absPlayerY)) {
        position.x = position.x - player.speed;
        isMoved = true;
        player.flipX = true;
    }
    if (keys.includes('ArrowRight') && isPositionWithInBoundaries(absPlayerX + player.speed, absPlayerY)) {
        position.x = position.x + player.speed;
        isMoved = true;
        player.flipX = false;
    }
    return isMoved;
};