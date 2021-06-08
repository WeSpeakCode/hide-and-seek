import { GameObjects, Scene } from 'phaser';

export default class PlayerTitle extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text) {
        super(scene, x, y, text, {
            fontSize: 20,
            color: '#fff',
            stroke: '#000',
            strokeThickness: 4,
        });
        this.setOrigin(0, 0);
        scene.add.existing(this);
    }

    updateTitleColor(imposter) {
        if (imposter === undefined) {
            this.setColor('#fff', 4);
        } else {
            this.setColor('#f00', 4);
        }
    }
}