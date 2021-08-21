class Marble extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, number) {
        super(scene, x, y, `marble${number}`);
        this.scene = scene;
        this.setOrigin(0.5)
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.overlap = this.scene.physics.add.overlap(this.scene.player, this, this.touch, null, this.scene);
        this.groundCollider = this.scene.physics.add.overlap(this.scene.ground, this, this.hitGround, null, this );
    }

    touch (player, marble) {
        console.log("Player was dead!");
        player.scene.playerDeath(player);
        marble.destroy();
     }

     hitGround(ground, marble) {
        console.log("Oh I hit the ground  marble! ", this);
        marble.destroy();
    }
}

export default Marble;
