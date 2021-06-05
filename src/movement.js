import { SHIP_HEIGHT, SHIP_WIDTH } from './constants';
import { shipBounds } from './ship-bounds';

const isPositionWithInBoundaries = (x, y) => {
    return !shipBounds[y] ? true : !shipBounds[y].includes(x);
}

export const movePlayer = (keys, player) => {
    var sprite = player.sprite;
    let isMoved = false;
    const absPlayerX = sprite.x + SHIP_WIDTH / 2;
    const absPlayerY = sprite.y + SHIP_HEIGHT / 2 + 20;

    if (keys.includes('ArrowUp') && isPositionWithInBoundaries(absPlayerX, absPlayerY - player.speed)) {
        sprite.y = sprite.y - player.speed;
        isMoved = true;
    }
    if (keys.includes('ArrowDown') && isPositionWithInBoundaries(absPlayerX, absPlayerY + player.speed)) {
        sprite.y = sprite.y + player.speed;
        isMoved = true;
    }
    if (keys.includes('ArrowLeft') && isPositionWithInBoundaries(absPlayerX - player.speed, absPlayerY)) {
        sprite.x = sprite.x - player.speed;
        isMoved = true;
        sprite.flipX = true;
    }
    if (keys.includes('ArrowRight') && isPositionWithInBoundaries(absPlayerX + player.speed, absPlayerY)) {
        sprite.x = sprite.x + player.speed;
        isMoved = true;
        sprite.flipX = false;
    }
    return isMoved;
};

export const movePlayerToPosition = (player, position) => {
    var sprite = player.sprite;
    console.log(`current position ${sprite.x} ${sprite.y}`);
    console.log(`new position ${position.x} ${position.y}`);
    sprite.x = position.x;
    sprite.y = position.y;
}