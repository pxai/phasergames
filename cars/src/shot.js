import Particle from "./particle";

class Shot extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y) {
        super(scene, x, y, "bullet");
        this.scene = scene;
        this.setOrigin(0.5)
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setVelocityX(900)

        this.particle =  0x3e6875;
        this.init();
        this.death = false;
   }

    init () {
        this.scene.tweens.add({
            targets: this,
            duration: 200,
            scale: {from: 0.6, to: 0.8},
            repeat: -1
        });
       /* this.scene.anims.create({
            key: this.animName,
            frames: this.scene.anims.generateFrameNumbers(this.animName),
            frameRate: 5,
            origin: 0.5
          });*/

         /* this.anims.play(this.animName, true)
          if (this.id === "FOE") {
            this.scene.physics.moveTo(this, this.scene.player.x, this.scene.player.y, 200);
          } */
          this.scene.events.on("update", this.update, this);
          this.scene.time.delayedCall(4000, () => this.destroy(), null, this);
    }

    destroy() {
        this.death = true;
        super.destroy();
    }

    update () {
        if (this.death) return;
        if (Phaser.Math.Between(1, 2) > 1) {
            new Particle(this.scene, this.x, this.y, this.particle, 4)
        }

        //if (this.id === "FOE") return;
    }

    explode() {
        Array(5).fill(0).forEach(a => { new Particle(this.scene, this.x, this.y,  50, -1) });
        
        this.destroy();
    }
}

export default Shot;
