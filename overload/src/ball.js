import { Particle } from "./particle";

const TYPES = {
    "chocolate": { color: 0xAF8057, radius: 16, intensity: 0.4 }, 
    "vanila": { color: 0xfff6d5, radius: 16, intensity: 0.4 },
    "fruit": { color: 0xffffff, radius: 16, intensity: 0.4 },
    "water": { color: 0xffffff, radius: 16, intensity: 0.4 },
    "foe": { color: 0x00ff00, radius: 16, intensity: 0.4 }
};

class Ball extends Phaser.GameObjects.PointLight {
    constructor (scene, x, y, type = "water", velocityX = 0, velocityY = 0) {
        const { color, radius, intensity } = TYPES[type];

        x = Phaser.Math.Between(32, 800 - 32);
        y = Phaser.Math.Between(64, 128);
        super(scene, x, y, color, radius, intensity)
        this.name = "shot";
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setBounce(1);
        this.body.setAllowGravity(false);
        this.body.setVelocityX(Phaser.Math.Between(-32, 32));
        //this.body.setVelocityY(velocityY);
        this.body.setCircle(10);
        this.body.setOffset(6, 9)
        this.react();
   }

    update () {
    }

    react () {
        this.body.setVelocityY(Phaser.Math.Between(-300, 300));
        this.body.setVelocityX(Phaser.Math.Between(-300, 300));
    }
}

export default Ball;
