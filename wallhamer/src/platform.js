export default class Platform extends Phaser.GameObjects.Container {
    constructor (scene, x, y, size = 4, demo = false) {
        super(scene, x, y);
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setBounce(1);
        this.body.setSize(size * 64, 64)
        this.body.setOffset(-2, -2)

        this.body.immovable = true;
        this.body.moves = false;
        this.platform = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "platform" + size).setOrigin(0);
        this.add(this.platform);
        this.chain = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "chain").setOrigin(0);
        this.add(this.chain);

    }
}