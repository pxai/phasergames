import Particle from "./particle";

class Shot extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, speed_x, speed_y) {
        super(scene, x, y, "shot");
        this.scene = scene;
        this.setOrigin(0.5)
        this.speed_x = speed_x;
        this.speed_y = speed_y;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.init();

        //this.collider = this.scene.physics.add.overlap(this.scene.player, this, this.scene.player.hit, null, this.scene.player);
        //this.overlapBulletBeam = this.scene.physics.add.overlap(this.scene.player.beamGroup, this, this.scene.player.destroyBeam);
    }

    init () {
        this.scene.tweens.add({
            targets: this,
            duration: 200,
            scale: {from: 0.6, to: 1},
            repeat: -1
        });

        this.scene.anims.create({
            key: "shot",
            frames: this.scene.anims.generateFrameNumbers("shot"),
            frameRate: 5,
            origin: 0.5
          });
          // this.on('animationcomplete', this.animationComplete, this);
          this.anims.play("shot", true)
    }

    update () {
        if (Phaser.Math.Between(1, 2) > 1) {
            new Particle(this.scene, this.x, this.y,  50, 0x3e6875)
        }

        this.x += this.speed_x; 
        this.y += this.speed_y; 
    }

    explode() {
        Array(5).fill(0).forEach(a => { new Particle(this.scene, this.x, this.y,  50, -1) });
        
        this.destroy();
    }
}

export default Shot;
