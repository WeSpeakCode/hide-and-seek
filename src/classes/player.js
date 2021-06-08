import Phaser from 'phaser';
import PlayerTitle from './player-title';

export default class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, user) {
        super(scene, user.position.x, user.position.y);
        this.position = user.position;
        this.setTexture('player-' + user.color).setScale(0.4);

        this.id = user.id;
        this.position = user.position;
        this.color = user.color;

        scene.add.existing(this);

        scene.anims.create({
            key: 'running-' + user.color,
            frames: scene.anims.generateFrameNumbers('player-' + user.color),
            frameRate: 24,
            reapeat: -1,
        });

        this.titleLabel = new PlayerTitle(scene, user.position.x, user.position.y - 40, user.name.toString());
        this.titleLabel.setOrigin(0.5, 0.5);

        this.on('destroy', () => {
            this.titleLabel.destroy(true);
        });
    }

    update() {
        this.x = this.position.x;
        this.y = this.position.y;
        if (!this.anims.isPlaying)
            this.play('running-' + this.color);

        this.titleLabel.setPosition(this.x, this.y - 2 * this.titleLabel.height);
        this.titleLabel.updateTitleColor(this.imposter);
    }

    get speed() {
        return 3;
    }
}