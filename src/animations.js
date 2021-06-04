
export const initAnimation = (game) => {
    game.anims.create({
        key: 'running',
        frames: game.anims.generateFrameNumbers('player'),
        frameRate: 24,
        reapeat: -1,
    });
}

export const animateMovement = (keys, player) => {
    const runningKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if (keys.some((key) => runningKeys.includes(key)) && !player.anims.isPlaying) {
        player.play('running');
    } else if (!keys.some((key) => runningKeys.includes(key)) && player.anims.isPlaying) {
        player.stop('running');
    }
};
