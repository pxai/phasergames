export default class Coin extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name) {
        super(scene, x, y, name);
        this.scene = scene;
        this.name = name;
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);
        this.overlap = this.scene.physics.add.overlap(this.scene.player, this, this.pickCoin, null, this.scene);

        this.body.setSize(32,32);
        this.init();
    }

    init () {
        this.setOrigin(0.5);

        this.scene.anims.create({
            key: "coin",
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 2 }),
            frameRate: 3,
            repeat: -1
        });

        this.play("coin", true)
    }

    pickCoin (player, coin) {
        console.log("Player pick!!");
        coin.destroy();
        player.scene.pickCoin();
    }
}
