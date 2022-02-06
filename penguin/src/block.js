export default class Block extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, name = 0) {
        super(scene, x, y , `block${name}`);
        this.scene = scene;
        this.name = `block${name}`;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.immovable = true;
        this.body.moves = false;
    }
}
