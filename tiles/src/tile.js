export default class Tile extends Phaser.GameObjects.Container {
    constructor (scene, x, y) {
        super(scene, x, y);
        this.x = x;
        this.y = y;
        this.scene = scene;
        
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setImmovable(true)

        this.body.collideWorldBounds = true;
        this.tile = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "tile").setOrigin(0.5);
        this.add(this.tile);
    }
}

