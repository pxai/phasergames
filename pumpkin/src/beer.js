export default class Beer extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name) {
        super(scene, x, y, name);
        this.scene = scene;
        this.name = name;
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);
        this.overlap = this.scene.physics.add.overlap(this.scene.player, this, this.drink, null, this.scene);

        this.body.setSize(32,32);
        this.init();
    }

    init () {
        this.setOrigin(0.5);

        this.scene.anims.create({
            key: "beer",
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });

        this.play("beer", true)
    }

    drink (player, beer) {
        console.log("Player drink!!");
        beer.destroy();
        player.scene.recover();
    }
}
