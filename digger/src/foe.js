import FoeShot from "./foe_shot";
import Explosion from "./explosion";

const TYPES = {
    "foe0": { points: 400, lives: 1 },
    "foe1": { points: 500, lives: 3 },
    "foe2": { points: 800, lives: 2 },
    "guinxu": { points: 10000, lives: 20 },
};

class Foe extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name = "foe0", velocityX = 0, velocityY = 0) {
        super(scene, x, y, name);
        this.name = name;
        this.points = TYPES[name].points;
        this.lives = TYPES[name].lives;
        this.scene = scene;
        this.id = Math.random();

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);

        this.body.setCircle(19);
        this.body.setOffset(12, 12);
        this.body.setVelocityX(velocityX);
        this.body.setVelocityY(velocityY);

        this.init();
   }

    init () {
        this.scene.anims.create({
            key: this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name),
            frameRate: 10,
            repeat: -1
          });
          
          this.anims.play(this.name, true)

          this.direction = -1;
    }

    update () {
        if (Phaser.Math.Between(1, 101) > 100) {
            if (!this.scene || !this.scene.player) return;
            this.scene.playAudio("foeshot")
            let shot = new FoeShot(this.scene, this.x, this.y, "foe", this.name)
            this.scene.foeShots.add(shot);
            this.scene.physics.moveTo(shot, this.scene.player.x, this.scene.player.y, 300);
        }
    }

    dead() {
        let radius = 60;
        let explosionRad = 20;

        const explosion = this.scene.add.circle(this.x, this.y, 5).setStrokeStyle(20, 0xffffff);
        this.showPoints(this.points)
        this.scene.tweens.add({
            targets: explosion,
            radius: {from: 10, to: radius},
            alpha: { from: 1, to: 0.3},
            duration: 250,
            onComplete: () => {  explosion.destroy()}
        })

        new Explosion(this.scene, this.x, this.y, explosionRad) 

        this.destroy(); 
    }

    showPoints (score, color = 0xff0000) {
        let text = this.scene.add.bitmapText(this.x + 20, this.y - 30, "pusab", "+"+score, 40, color).setOrigin(0.5);
        this.scene.tweens.add({
            targets: text,
            duration: 800,
            alpha: {from: 1, to: 0},
            y: {from: this.y - 20, to: this.y - 80},
            onComplete: () => {
                text.destroy()
            }
        });
    }
}

export default Foe;
