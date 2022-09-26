export default class Platform extends Phaser.GameObjects.Container {
    constructor (scene, x, y, type=1) {
        super(scene, x, y);
        this.x = x;
        this.y = y;
        const size = 2;
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        //this.body.setBounce(1);
        this.body.setSize(size * 32, 32)
        this.body.setOffset(-2, -2)

        this.body.immovable = true;
        this.body.moves = false;
        this.chain = new Phaser.GameObjects.Sprite(this.scene, 16, -1024, "chain").setOrigin(0);
        this.add(this.chain);
        this.platform = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "platform2").setScale(0.5).setOrigin(0);
        this.add(this.platform);

        this.init();
    }

    init() {
        const offsetX = this.x;
        const offsetY = 20;

        this.scene.tweens.add({
            targets: this,
            duration: Phaser.Math.Between(6000, 8000),
            x: {from: this.x, to: offsetX},
            y: {from: this.y, to: offsetY},
            repeat: -1,
            yoyo: true
        })
    }
}
