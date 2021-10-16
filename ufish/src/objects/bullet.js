class Bullet extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name = "missile", velocity = 1, direction) {
        super(scene, x, y, name);
        this.name = name;
        this.scene = scene;
        this.setOrigin(0.5)

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.direction = direction || Phaser.Math.Between(0, 1) ? -1 : 1;
        this.body.setVelocityX(300 * this.direction * velocity);
        this.flipX = this.direction < 0;
        this.init();
        this.collider = this.scene.physics.add.overlap(this.scene.player, this, this.scene.player.hit, null, this.scene.player);
        this.overlapBulletBeam = this.scene.physics.add.overlap(this.scene.player.beamGroup, this, this.scene.player.destroyBeam);
    }

    init () {
        this.scene.anims.create({
            key: this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
          });
  
          this.anims.play(this.name, true)
    }
}

export default Bullet;
