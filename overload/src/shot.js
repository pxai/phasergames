import { Particle } from "./particle";

const TYPES = {
    "chocolate": { color: 0xAF8057, radius: 16, intensity: 0.4 }, 
    "vanila": { color: 0xfff6d5, radius: 16, intensity: 0.4 },
    "fruit": { color: 0xffffff, radius: 16, intensity: 0.4 },
    "water": { color: 0xffffff, radius: 16, intensity: 0.4 },
    "foe": { color: 0x00ff00, radius: 16, intensity: 0.4 }
};

class Shot extends Phaser.GameObjects.PointLight {
    constructor (scene, x, y, type = "water", playerName, velocityX = 500, velocityY = 0) {
        const { color, radius, intensity } = TYPES[type];
        super(scene, x, y, color, radius, intensity)
        this.name = "shot";
        this.scene = scene;
        this.playerName = playerName;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setVelocityX(velocityX);
        this.body.setVelocityY(velocityY);
        this.body.setCircle(10);
        this.body.setOffset(6, 9)
        this.body.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;
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

    update () {
    }
}

export default Shot;
