import { colorKeys } from './utils';

export const initAnimation = (game) => {
    game.anims.create({
        key: 'running',
        frames: game.anims.generateFrameNumbers('player'),
        frameRate: 24,
        reapeat: -1,
    });
    let allColors = colorKeys();
    for (let i = 0; i < allColors.length; i++) {
        game.anims.create({
            key: 'running-'+allColors[i],
            frames: game.anims.generateFrameNumbers('player-' + allColors[i]),
            frameRate: 24,
            reapeat: -1,
        });
    }
}

export const animateMovement = (keys, player) => {
    const runningKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if (keys.some((key) => runningKeys.includes(key)) && !player.sprite.anims.isPlaying) {
        player.sprite.play('running-'+player.color);
    } else if (!keys.some((key) => runningKeys.includes(key)) && player.sprite.anims.isPlaying) {
        player.sprite.stop('running-'+player.color);
    }
};
