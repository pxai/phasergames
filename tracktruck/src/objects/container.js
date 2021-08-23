class Container extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, type) {
        const x = Phaser.Math.Between(scene.physics.world.bounds.width, scene.physics.world.bounds.width + 50);
        const y = Phaser.Math.Between(0, scene.physics.world.bounds.height);

        super(scene, x, y, `container${type.id}`);
        this.scene = scene;
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
        this.setBounce(1)
        this.setScale(0.5)
        this.scene.add.existing(this);
        this.free = true;
        this.reward = type.value;
        this.type = type;
        this.pickOverlap = this.scene.physics.add.overlap(this, this.scene.player, this.scene.player.pick, null, this.scene.player);

        // this.body.setVelocityX(-100);
    }

    hit(asteroid, me) {

    }
}

export default Container;
