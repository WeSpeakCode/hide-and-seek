import Phaser from 'phaser';

export default class Player extends Phaser.GameObjects.Sprite {

    constructor(scene, user) {
        super(scene, user.position.x, user.position.y);
        this.position = user.position;
        this.setTexture('player-'+user.color).setScale(0.4);

        this.id = user.id;
        this.position = user.position;
        this.color = user.color;

        scene.add.existing(this);

        scene.anims.create({
            key: 'running-'+user.color,
            frames: scene.anims.generateFrameNumbers('player-'+user.color),
            frameRate: 24,
            reapeat: -1,
        });
    }

    update() {
        this.x = this.position.x;
        this.y = this.position.y;
        if (!this.anims.isPlaying)
            this.play('running-'+this.color);
    }

    get speed() {
        return 3;
    }
}