import Particle from "./particle";

class Shot extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, speed_x, speed_y, id) {
        super(scene, x, y, "shot");
        this.scene = scene;
        this.setOrigin(0.5)
        this.id = id;
        this.speed_x = speed_x;
        this.speed_y = speed_y;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.particle = this.id === "FOE" ? 0xff083e : 0x3e6875;
        this.animName = this.id === "FOE" ? "shotfoe" : "shot";
        this.init();
   }

    init () {
        this.scene.tweens.add({
            targets: this,
            duration: 200,
            scale: {from: 0.6, to: 1},
            repeat: -1
        });
        this.scene.anims.create({
            key: this.animName,
            frames: this.scene.anims.generateFrameNumbers(this.animName),
            frameRate: 5,
            origin: 0.5
          });

          this.anims.play(this.animName, true)
          if (this.id === "FOE") {
            this.scene.physics.moveTo(this, this.scene.player.x, this.scene.player.y, 200);
          } 
    }

    update () {
        if (Phaser.Math.Between(1, 2) > 1) {
            new Particle(this.scene, this.x, this.y, this.particle, 4)
        }

        if (this.id === "FOE") return;
        this.x += this.speed_x * 2; 
        this.y += this.speed_y * 2; 
    }

    explode() {
        Array(5).fill(0).forEach(a => { new Particle(this.scene, this.x, this.y,  50, -1) });
        
        this.destroy();
    }
}

export default Shot;
