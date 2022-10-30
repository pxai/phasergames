import Particle from "./particle";
import Shot from "./shot";

class Foe extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name = "player") {
        super(scene, x, y, name);
        this.scene = scene;
        this.id = Math.random();
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setCircle(24);
        this.body.setOffset(6, 12)
        this.power = 0;
        this.body.setBounce(0.8)
        this.setTint(Phaser.Math.RND.pick([0xf10000, 0x00ff00, 0x0000ff]));
        this.body.setVelocityX(Phaser.Math.Between(100, 400))
        this.init();
    }

    init () {
        this.scene.anims.create({
            key: "foe",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });

          this.anims.play("foe", true)

        this.upDelta = 0;
        this.scene.events.on("update", this.update, this);
    }

    shoot () {
        //if (this.power > 0) {
            // this.getSpeeds();
            this.scene.playAudio("shot");   
            this.scene.shots.add(new Shot(this.scene, this.x, this.y, Math.cos(this.rotation) * 500, Math.sin(this.rotation) * 500, this.id))
            this.power--;
       // }
    }


    update (timestep, delta) {
    }

    showPoints (score, color = 0xff0000) {
        let text = this.scene.add.bitmapText(this.x + 20, this.y - 30, "pico", score, 20, 0xfffd37).setOrigin(0.5);
        this.scene.tweens.add({
            targets: text,
            duration: 1000,
            alpha: {from: 1, to: 0},
            y: {from: text.y - 10, to: text.y - 100}
        });
    }

    destroy () {
        this.death = true;
        super.destroy();
    }      
}

export default Foe;
