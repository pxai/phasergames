class Asteroid extends Phaser.Physics.Arcade.Sprite {
    constructor (scene) {
        const x = Phaser.Math.Between(800, 850);
        const y = Phaser.Math.Between(0, 600);
        const scale = Math.random();
        super(scene, x, y, "asteroid");
        this.scene = scene;
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
        this.setScale(scale);
        this.scene.add.existing(this);
        this.collider = this.scene.physics.add.collider(this, this.scene.player, this.scene.player.hit, null, this.scene.player);
        this.maybeGoDiagonal();
    }

    maybeGoDiagonal () {
        if (Phaser.Math.Between(1, 11) > 10) {
            this.body.setVelocityY(Phaser.Math.Between(-10, 10));
        }
    }

    asteroidHit(other, me) {
    }
}

export default Asteroid;
