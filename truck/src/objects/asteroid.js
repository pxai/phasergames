class Asteroid extends Phaser.Physics.Arcade.Sprite {
    constructor (scene) {
        const x = Phaser.Math.Between(scene.physics.world.bounds.width, scene.physics.world.bounds.width + 50);
        const y = Phaser.Math.Between(0, scene.physics.world.bounds.height);

        const scale = Math.random() + 0.2;
        super(scene, x, y, "asteroid");
        this.scene = scene;
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
        this.setScale(scale);
        this.setBounce(1/scale)
        this.scene.add.existing(this);
        this.collider = this.scene.physics.add.collider(this, this.scene.player, this.scene.player.hit, null, this.scene.player);
        this.scene.containerGenerator.containers.forEach( container => {
            this.scene.physics.add.collider(this, container, () => {console.log("DALE");}, null, this);
        })

        this.moveIt();
    }

    moveIt () {
        if (Phaser.Math.Between(1, 101) > 10) {
            this.body.setVelocityY(Phaser.Math.Between(-10, 10));
        }
        this.body.setVelocityX(-100 * (1/this.scale));
    }

    asteroidHit(other, me) {
        console.log("Asteroid vs Asteroid");
    }
}

export default Asteroid;
