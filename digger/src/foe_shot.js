import { Particle } from "./particle";

const TYPES = {
    "chocolate": { color: 0xAF8057, radius: 16, intensity: 0.4 }, 
    "vanila": { color: 0xfff6d5, radius: 16, intensity: 0.4 },
    "fruit": { color: 0x00ff00, radius: 16, intensity: 0.4 },
    "water": { color: 0x0000cc, radius: 16, intensity: 0.4 },
    "foe": { color: 0xfff01f, radius: 16, intensity: 0.4 }
};

class FoeShot extends Phaser.GameObjects.PointLight {
    constructor (scene, x, y, type = "water", playerName, velocityX = 0, velocityY = -300) {
        const { color, radius, intensity } = TYPES[type];
        super(scene, x, y, color, radius, intensity)
        this.name = "foeshot";
        this.scene = scene;
        this.playerName = playerName;
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setAllowGravity(false);
        this.body.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;
        this.body.setCircle(10);
        this.body.setOffset(6, 9)

        this.init();
   }


    init () {
        this.scene.tweens.add({
            targets: this,
            duration: 200,
            intensity: {from: 0.3, to: 0.7},
            repeat: -1
        });
    }

    showPoints (score, color = 0xff0000) {
        let text = this.scene.add.bitmapText(this.x + 20, this.y - 30, "pusab", "-"+score, 40).setTint(color).setOrigin(0.5).setDropShadow(2, 3, 0xffffff, 0.7);;
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

export default FoeShot;
