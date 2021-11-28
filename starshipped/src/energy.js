import Particle from "./particle";

class Energy extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y) {
        super(scene, x, y, "energy");
        this.scene = scene;
        this.setOrigin(0.5)
        this.power = Phaser.Math.Between(3, 10);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.init();
   }

    init () {
        this.scene.tweens.add({
            targets: this,
            duration: 1000,
            scale: { from: 1, to: 0.9},
            repeat: -1,
            yoyo: true
        });

        this.scene.anims.create({
            key: "energy",
            frames: this.scene.anims.generateFrameNumbers("energy", { start: 0, end: 3 }),
            frameRate: 5,
            origin: 0.5
          });
          // this.on('animationcomplete', this.animationComplete, this);
          this.anims.play("energy", true)
    }

    explode() {
        Array(5).fill(0).forEach(a => { new Particle(this.scene, this.x, this.y,  50, -1) });
        
        this.destroy();
    }
}

export default Energy;
