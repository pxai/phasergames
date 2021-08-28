class MarbleShot extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, number) {
        super(scene, x, y, `marble${number}`);
        this.scene = scene;
        this.setOrigin(0.5)
        this.active = true;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setVelocityX(300);
        this.shot = new Phaser.GameObjects.Sprite(this.scene, x, y, "shot");
        this.scene.add.existing(this.shot);
        this.shot.anims.play("shot", true);

        this.scene.asteroidField.asteroids.forEach(asteroid => {
            this.scene.physics.add.collider(asteroid, this, asteroid.marbleHit, null, asteroid);
        })
    }
}

export default MarbleShot;
