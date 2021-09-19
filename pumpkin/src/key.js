export default class Key extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name) {
        super(scene, x, y, name);
        this.scene = scene;
        this.name = name;
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);
        this.overlap = this.scene.physics.add.overlap(this.scene.player, this, this.pick, null, this.scene);

        this.body.setSize(32,32);
        this.init();
    }

    init () {
        this.setOrigin(0.5);
    }

    pick (player, key) {
        console.log("Player got key!!");
        key.destroy();
        player.getKey();
    }
}
