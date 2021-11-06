import Particle from "./particle";

class Shot extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name = "shot", velocity = 1, direction) {
        super(scene, x, y, name);
        this.name = name;
        this.scene = scene;
        this.setOrigin(0.5)

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.direction = direction || Phaser.Math.Between(0, 1) ? -1 : 1;
        this.body.setVelocityX(300 * this.direction * velocity);
        this.flipX = this.direction > 0;

        //this.collider = this.scene.physics.add.overlap(this.scene.player, this, this.scene.player.hit, null, this.scene.player);
        //this.overlapBulletBeam = this.scene.physics.add.overlap(this.scene.player.beamGroup, this, this.scene.player.destroyBeam);
    }

    init () {
        this.scene.tweens.add({
            targets: this,
            duration: 100,
            scale: {from: Phaser.Math.Between(0.5, 1), to: 0.1},
            repeat: -1
        });

        this.scene.anims.create({
            key: "shot",
            frames: this.scene.anims.generateFrameNumbers("shot"),
            frameRate: 5,
            origin: 0.5
          });
          // this.on('animationcomplete', this.animationComplete, this);
          this.anims.play("fly", true)
    }

    update () {
        if (Phaser.Math.Between(1, 2) > 1) {
            new Particle(this.scene, this.x - (this.direction * 34), this.y,  50, -1)
        }
    }

    explode() {
        Array(5).fill(0).forEach(a => { new Bubble(this.scene, this.x, this.y,  50, -1) });
        
        this.destroy();
    }
}

export default Shot;
