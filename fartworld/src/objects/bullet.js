class Bullet extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, direction=-1) {
        super(scene, x, y, "bullet");
        this.scene = scene;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setDragY(330)
        this.body.setVelocityX(300 * direction);
        this.body.setVelocityY(Phaser.Math.Between(-30, 10));
        this.body.setCollideWorldBounds(true)
        this.body.setBounce(1)
        this.overlap = this.scene.physics.add.overlap(this.scene.player, this, this.touch, null, this.scene);
        this.groundCollider = this.scene.physics.add.overlap(this.scene.ground, this, this.hitGround, null, this );
    }

    touch (player, bullet) {
        console.log("Player was dead!");
        player.scene.playerDeath(player);
        bullet.destroy();
     }

     hitGround(ground, bullet) {
        console.log("Oh I hit the ground  bullet! ", this);
        bullet.destroy();
    }
}

export default Bullet;
